const supabase = require('../config/database');
const transporter = require('../config/email');

exports.submitForm = async (req, res) => {
  try {
    const { name, email, message, phone } = req.body;
    console.log("sent data : ", req.body);

    // Save to Supabase
    const { error } = await supabase
      .from('email_submissions')
      .insert([{ name, email, message, phone }]);

    if (error) throw error;

    // Send emails
    await Promise.all([
      // Email to admin - Successfully registered message
      transporter.sendMail({
        from: process.env.EMAIL_USER,
        to: process.env.ADMIN_EMAIL,
        subject: 'New User Registration',
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 5px;">
            <h2 style="color: #333; text-align: center;">New User Registration</h2>
            <p style="font-size: 16px; color: #555;">A new user has successfully registered on your platform.</p>
            <div style="background-color: #f9f9f9; padding: 15px; border-radius: 5px; margin: 20px 0;">
              <p style="margin: 5px 0;"><strong>Full Name:</strong> ${name}</p>
              <p style="margin: 5px 0;"><strong>Email:</strong> ${email}</p>
              <p style="margin: 5px 0;"><strong>Phone:</strong> ${phone}</p>
            </div>
            <p style="font-size: 14px; color: #777; text-align: center;">This is an automated message from your application.</p>
          </div>
        `,
      }),

      // Email to user - Confirmation with their details
      transporter.sendMail({
        from: process.env.EMAIL_USER,
        to: email,
        subject: 'Welcome to Our Platform',
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 5px;">
            <h2 style="color: #333; text-align: center;">Welcome, ${name}!</h2>
            <p style="font-size: 16px; color: #555;">Thank you for registering with us. We're excited to have you on board!</p>
            
            <div style="background-color: #f9f9f9; padding: 15px; border-radius: 5px; margin: 20px 0;">
              <h3 style="color: #444; margin-top: 0;">Your Registration Details:</h3>
              <p style="margin: 5px 0;"><strong>Full Name:</strong> ${name}</p>
              <p style="margin: 5px 0;"><strong>Email:</strong> ${email}</p>
              <p style="margin: 5px 0;"><strong>Phone:</strong> ${phone}</p>
            </div>
            
            <p style="font-size: 16px; color: #555;">We've received your message and will get back to you as soon as possible.</p>
            
            <div style="text-align: center; margin-top: 30px;">
              <p style="font-size: 14px; color: #777;">If you have any questions, please don't hesitate to contact us.</p>
            </div>
          </div>
        `,
      })
    ]);

    res.status(200).json({ success: true, message: 'Form submitted successfully' });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
}; 