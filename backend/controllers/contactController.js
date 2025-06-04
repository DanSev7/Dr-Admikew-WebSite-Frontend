const supabase = require('../config/database');
const emailService = require('../services/emailService');

const contactController = {
  async submitContact(req, res) {
    try {
      const { full_name, email, phone, message } = req.body;
      console.log("Full Name : ", full_name);

      // Store contact message in database
      const { data: contact, error } = await supabase
        .from('contact_messages')
        .insert([{ full_name, email, phone, message }])
        .select()
        .single();

      if (error) throw error;

      // Send notification email to admin
      await emailService.sendContactNotification({
        full_name,
        email,
        phone,
        message
      });

      res.status(201).json({
        message: 'Contact form submitted successfully',
        contact
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  async getContactMessages(req, res) {
    try {
      // Only admin can access this endpoint
      if (req.user.role !== 'admin') {
        return res.status(403).json({ error: 'Unauthorized' });
      }

      const { data: messages, error } = await supabase
        .from('contact_messages')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      res.json(messages);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
};

module.exports = contactController; 