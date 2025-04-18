const transporter = require('../config/email');

const emailService = {
  async sendAppointmentConfirmation(appointment) {
    const mailOptions = {
      from: process.env.SMTP_FROM,
      to: appointment.email,
      subject: 'Appointment Confirmation - Surgery Center',
      html: `
        <h1>Appointment Confirmation</h1>
        <p>Dear ${appointment.full_name},</p>
        <p>Your appointment has been confirmed for:</p>
        <ul>
          <li>Date: ${appointment.appointment_date}</li>
          <li>Time: ${appointment.appointment_time}</li>
          <li>Department: ${appointment.department}</li>
          <li>Service Type: ${appointment.service_type}</li>
        </ul>
        <p>Thank you for choosing our services!</p>
      `
    };

    await transporter.sendMail(mailOptions);
  },

  async sendAdminNotification(appointment) {
    const mailOptions = {
      from: process.env.SMTP_FROM,
      to: process.env.ADMIN_EMAIL,
      subject: 'New Appointment Booking',
      html: `
        <h1>New Appointment Booking</h1>
        <p>A new appointment has been booked:</p>
        <ul>
          <li>Patient: ${appointment.full_name}</li>
          <li>Date: ${appointment.appointment_date}</li>
          <li>Time: ${appointment.appointment_time}</li>
          <li>Department: ${appointment.department}</li>
          <li>Service Type: ${appointment.service_type}</li>
          <li>Payment Reference: ${appointment.payment_reference}</li>
        </ul>
      `
    };

    await transporter.sendMail(mailOptions);
  },

  // Add this to the existing emailService object
    async sendContactNotification(contact) {
    const mailOptions = {
      from: process.env.SMTP_FROM,
      to: process.env.ADMIN_EMAIL,
      subject: 'New Contact Form Submission',
      html: `
        <h1>New Contact Form Submission</h1>
        <p>A new message has been received:</p>
        <ul>
          <li>Name: ${contact.full_name}</li>
          <li>Email: ${contact.email}</li>
          <li>Phone: ${contact.phone}</li>
          <li>Message: ${contact.message}</li>
        </ul>
      `
    };
  
    await transporter.sendMail(mailOptions);
  } 
};


module.exports = emailService; 