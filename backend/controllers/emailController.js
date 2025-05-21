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
      <h1 style="color: white; margin: 0;">Dr. Admikew Surgery Center</h1>
    </div>
    <div style="padding: 20px; background-color: white; border-radius: 0 0 8px 8px;">
      ${content}
      <hr style="border: 0; border-top: 1px solid #e5e7eb; margin: 20px 0;">
      <p style="color: #6b7280; font-size: 12px; text-align: center;">
        © ${new Date().getFullYear()} Dr. Admikew Surgery Center. All rights reserved.
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
      to: process.env.EMAIL_USER,
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
      subject: 'Thank You for Contacting Dr. Admikew Surgery Center!',
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
      to: process.env.EMAIL_USER,
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
};