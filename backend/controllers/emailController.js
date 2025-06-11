const { generateInvoiceBuffer } = require('./pdfInvoice');
const supabase = require('../config/database');
const transporter = require('../config/email');
const validator = require('validator');
const NodeCache = require('node-cache');

// Cache to prevent duplicate emails (TTL: 1 hour)
const emailCache = new NodeCache({ stdTTL: 3600 });

// Common email template
const createEmailTemplate = (content) => `
  <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f9fafb; border-radius: 8px;">
    <div style="background-color: #0284c7; padding: 20px; border-radius: 8px 8px 0 0; text-align: center;">
      <h1 style="color: white; margin: 0;">Dr. Admikew Medical and Surgical Center</h1>
    </div>
    <div style="padding: 20px; background-color: white; border-radius: 0 0 8px 8px;">
      ${content}
      <hr style="border: 0; border-top: 1px solid #e5e7eb; margin: 20px 0;">
      <p style="color: #6b7280; font-size: 12px; text-align: center;">
        © ${new Date().getFullYear()} Dr. Admikew Medical and Surgical Center. All rights reserved.
      </p>
    </div>
  </div>
`;

// Validate contact form inputs
const validateContactForm = ({ name, email, message, phone }) => {
  if (!name || !email || !message) {
    throw new Error('Name, email, and message are required.');
  }
  if (!validator.isEmail(email)) {
    throw new Error('Invalid email format.');
  }
  if (phone && !validator.isMobilePhone(phone, 'any')) {
    throw new Error('Invalid phone number format.');
  }
};

// Validate booking details
const validateBookingDetails = ({ name, email, phone, totalAmount, appointmentId }) => {
  if (!name || !email || !phone || !totalAmount || !appointmentId) {
    console.error('Missing booking details:', { name, email, phone, totalAmount, appointmentId });
    throw new Error('Missing required booking details.');
  }
  if (!validator.isEmail(email)) {
    console.error('Invalid email format:', { email });
    throw new Error('Invalid email format.');
  }
  if (!validator.isMobilePhone(phone, 'any')) {
    console.error('Invalid phone number format:', { phone });
    throw new Error('Invalid phone number format.');
  }
  if (totalAmount <= 0) {
    console.error('Invalid total amount:', { totalAmount });
    throw new Error('Total amount must be greater than zero.');
  }
  if (!validator.isUUID(appointmentId) && !validator.isInt(appointmentId.toString())) {
    console.error('Invalid appointment ID format:', { appointmentId });
    throw new Error('Invalid appointment ID format.');
  }
};

// Validate payment details
const validatePaymentDetails = ({ name, email, amount, tx_ref }) => {
  if (!name || !email || !amount || !tx_ref) {
    console.error('Missing payment details:', { name, email, amount, tx_ref });
    throw new Error('Missing required payment details.');
  }
  if (!validator.isEmail(email)) {
    console.error('Invalid email format:', { email });
    throw new Error('Invalid email format.');
  }
  if (amount <= 0) {
    console.error('Invalid amount:', { amount });
    throw new Error('Amount must be greater than zero.');
  }
};

// Submit Contact Form
const submitContactForm = async (req, res) => {
  const { name, email, message, phone } = req.body;
  console.log('Received contact form data:', { name, email, phone });

  try {
    validateContactForm({ name, email, message, phone });

    const { error } = await supabase
      .from('email_submissions')
      .insert([{ name, email, message, phone }]);

    if (error) {
      console.error('Supabase insert error:', error);
      throw new Error('Failed to save form data.');
    }

    const adminEmailOptions = {
      from: process.env.EMAIL_USER,
      to: process.env.ADMIN_EMAIL || process.env.EMAIL_USER,
      subject: 'New Contact Form Submission',
      html: createEmailTemplate(`
        <h2 style="color: #1f2937;">New Contact Form Submission</h2>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Phone:</strong> ${phone || 'Not provided'}</p>
        <p><strong>Message:</strong> ${message}</p>
      `),
    };

    const userEmailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Thank You for Contacting Dr. Admikew Medical and Surgical Center!',
      html: createEmailTemplate(`
        <h2 style="color: #1f2937;">Hi ${name},</h2>
        <p>Thank you for reaching out! We've received your message and will respond within 24-48 hours.</p>
        <hr style="border: 0; border-top: 1px solid #e5e7eb; margin: 20px 0;">
        <p><strong>Your Submission:</strong></p>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Phone:</strong> ${phone || 'Not provided'}</p>
        <p><strong>Message:</strong> ${message}</p>
      `),
    };

    await Promise.all([
      transporter.sendMail(adminEmailOptions),
      transporter.sendMail(userEmailOptions),
    ]);

    res.status(200).json({ success: true, message: 'Form submitted successfully.' });
  } catch (err) {
    console.error('Contact form submission error:', err.message);
    res.status(400).json({ success: false, message: err.message || 'Failed to submit form.' });
  }
};

// Send Booking Confirmation Email
const sendBookingEmail = async ({ name, email, phone, totalAmount, appointmentId }) => {
  console.log('Sending booking confirmation email:', { name, email, phone, totalAmount, appointmentId });

  try {
    // Check cache to prevent duplicate emails
    const cacheKey = `booking_email_${appointmentId}`;
    if (emailCache.get(cacheKey)) {
      console.log('Duplicate booking email attempt blocked:', { appointmentId });
      return;
    }

    validateBookingDetails({ name, email, phone, totalAmount, appointmentId });

    // Fetch appointment details from Supabase for additional context
    const { data: appointment, error: apptError } = await supabase
      .from('appointments')
      .select('appointment_date, appointment_time, department_id')
      .eq('id', appointmentId)
      .single();

    if (apptError || !appointment) {
      console.error('Failed to fetch appointment details:', apptError);
      throw new Error('Invalid appointment ID.');
    }

    // Fetch department name
    const { data: department, error: deptError } = await supabase
      .from('departments')
      .select('name')
      .eq('id', appointment.department_id)
      .single();

    if (deptError || !department) {
      console.error('Failed to fetch department details:', deptError);
      throw new Error('Invalid department ID.');
    }

    // <li><strong>Appointment ID:</strong> ${appointmentId}</li>
    
    const userEmailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Booking Confirmation - Dr. Admikew Medical and Surgical Center',
      html: createEmailTemplate(`
        <h2 style="color: #1f2937;">Hi ${name},</h2>
        <p>Your appointment booking has been successfully received. Please visit the center to complete your payment of <strong>${totalAmount} ETB</strong>.</p>
        <p><strong>Booking Details:</strong></p>
        <ul style="list-style: none; padding: 0;">
          <li><strong>Date:</strong> ${new Date(appointment.appointment_date).toLocaleDateString()}</li>
          <li><strong>Time:</strong> ${appointment.appointment_time}</li>
          <li><strong>Department:</strong> ${department.name}</li>
          <li><strong>Total Amount:</strong> ${totalAmount} ETB</li>
          <li><strong>Phone:</strong> ${phone}</li>
        </ul>
        <p>We look forward to seeing you!</p>
      `),
    };

    const adminEmailOptions = {
      from: process.env.EMAIL_USER,
      to: process.env.ADMIN_EMAIL || process.env.EMAIL_USER,
      subject: `New Appointment Booking - ${name}`,
      html: createEmailTemplate(`
        <h2 style="color: #1f2937;">New Appointment Booking</h2>
        <p>A new appointment has been booked with the following details:</p>
        <ul style="list-style: none; padding: 0;">
          <li><strong>Name:</strong> ${name}</li>
          <li><strong>Email:</strong> ${email}</li>
          <li><strong>Phone:</strong> ${phone}</li>
          <li><strong>Appointment ID:</strong> ${appointmentId}</li>
          <li><strong>Date:</strong> ${new Date(appointment.appointment_date).toLocaleDateString()}</li>
          <li><strong>Time:</strong> ${appointment.appointment_time}</li>
          <li><strong>Department:</strong> ${department.name}</li>
          <li><strong>Total Amount:</strong> ${totalAmount} ETB</li>
        </ul>
      `),
    };

    await Promise.all([
      transporter.sendMail(userEmailOptions),
      transporter.sendMail(adminEmailOptions),
    ]);

    // Mark email as sent in cache
    emailCache.set(cacheKey, true);
    console.log('Booking confirmation email sent:', { appointmentId });
  } catch (err) {
    console.error('Error sending booking confirmation email:', err.message, { appointmentId });
    throw err;
  }
};

// Handle Booking Email Route
const sendBookingEmailRoute = async (req, res) => {
  console.log('Received request to /send-booking-email:', req.body);

  try {
    const { name, email, phone, totalAmount, appointmentId } = req.body;

    validateBookingDetails({ name, email, phone, totalAmount, appointmentId });

    // Store booking submission in Supabase
    const { error } = await supabase
      .from('booking_submissions')
      .insert([{ name, email, phone, total_amount: totalAmount, appointment_id: appointmentId }]);

    if (error) {
      console.error('Supabase insert error:', error);
      throw new Error('Failed to save booking data.');
    }

    const bookingDetails = {
      name,
      email,
      phone,
      totalAmount,
      appointmentId,
    };

    await sendBookingEmail(bookingDetails);
    res.status(200).json({ success: true, message: 'Booking email sent successfully.' });
  } catch (err) {
    console.error('Error in sendBookingEmailRoute:', err.message);
    res.status(400).json({ success: false, message: err.message || 'Failed to send booking email.' });
  }
};

// Send Payment Success Email
const sendPaymentSuccessEmail = async ({ name, email, amount, status = 'Completed', tx_ref }) => {
  console.log('Sending payment success email:', { name, email, amount, tx_ref });

  try {
    // Check cache to prevent duplicate emails
    const cacheKey = `email_${tx_ref}`;
    if (emailCache.get(cacheKey)) {
      console.log('Duplicate email attempt blocked:', { tx_ref });
      return;
    }

    validatePaymentDetails({ name, email, amount, tx_ref });

    const date = new Date();
    const invoicePdfBuffer = await generateInvoiceBuffer({ name, email, amount, status, tx_ref, date });

    if (!Buffer.isBuffer(invoicePdfBuffer)) {
      console.error('Invalid invoice buffer generated');
      throw new Error('Failed to generate invoice PDF.');
    }

    const userEmailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Payment Confirmation - Invoice Attached',
      html: createEmailTemplate(`
        <h2 style="color: #1f2937;">Hi ${name},</h2>
        <p>Thank you for your payment of <strong>${amount} ETB</strong>. Your invoice is attached for your records.</p>
        <p><strong>Transaction Reference:</strong> ${tx_ref}</p>
        <p><strong>Status:</strong> ${status}</p>
      `),
      attachments: [{ filename: `Invoice-${tx_ref}.pdf`, content: invoicePdfBuffer }],
    };

    const adminEmailOptions = {
      from: process.env.EMAIL_USER,
      to: process.env.ADMIN_EMAIL || process.env.EMAIL_USER,
      subject: `New Payment Received - ${name}`,
      html: createEmailTemplate(`
        <h2 style="color: #1f2937;">New Payment Received</h2>
        <p>A payment has been made with the following details:</p>
        <ul style="list-style: none; padding: 0;">
          <li><strong>Name:</strong> ${name}</li>
          <li><strong>Email:</strong> ${email}</li>
          <li><strong>Amount:</strong> ${amount} ETB</li>
          <li><strong>Status:</strong> ${status}</li>
          <li><strong>Transaction Ref:</strong> ${tx_ref}</li>
        </ul>
      `),
      attachments: [{ filename: `Invoice-${tx_ref}.pdf`, content: invoicePdfBuffer }],
    };

    await Promise.all([
      transporter.sendMail(userEmailOptions),
      transporter.sendMail(adminEmailOptions),
    ]);

    // Mark email as sent in cache
    emailCache.set(cacheKey, true);
    console.log('Payment success email sent:', { tx_ref });
  } catch (err) {
    console.error('Error sending payment confirmation email:', err.message, { tx_ref });
    throw err;
  }
};

// Handle Payment Success Email Route
const sendPaymentSuccessEmailRoute = async (req, res) => {
  console.log('Received request to /send-email-success:', req.body);

  try {
    const { name, email, totalAmount, txRef } = req.body;

    validatePaymentDetails({ name, email, amount: totalAmount, tx_ref: txRef });

    const paymentDetails = {
      name,
      email,
      amount: totalAmount,
      status: 'Completed',
      tx_ref: txRef,
    };

    await sendPaymentSuccessEmail(paymentDetails);
    res.status(200).json({ success: true, message: 'Payment email sent successfully.' });
  } catch (err) {
    console.error('Error in sendPaymentSuccessEmailRoute:', err.message);
    res.status(400).json({ success: false, message: err.message || 'Failed to send payment email.' });
  }
};

module.exports = {
  submitContactForm,
  sendPaymentSuccessEmail,
  sendPaymentSuccessEmailRoute,
  sendBookingEmail,
  sendBookingEmailRoute,
};