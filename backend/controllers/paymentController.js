const supabase = require('../config/database');
const paymentService = require('../services/paymentService');
const emailService = require('../services/emailService');

const paymentController = {
  async handleWebhook(req, res) {
    try {
      // Verify webhook signature
      const signature = req.headers['x-chapa-signature'];
      if (!paymentService.verifyWebhookSignature(req.body, signature)) {
        return res.status(401).json({ error: 'Invalid signature' });
      }

      const { tx_ref, status } = req.body;

      if (status === 'success') {
        // Update appointment status
        const { data: appointment, error } = await supabase
          .from('appointments')
          .update({ payment_status: 'completed' })
          .eq('payment_reference', tx_ref)
          .select()
          .single();

        if (error) throw error;

        // Send confirmation emails
        await emailService.sendAppointmentConfirmation(appointment);
        await emailService.sendAdminNotification(appointment);

        res.json({ status: 'success' });
      } else {
        // Update appointment status to failed
        await supabase
          .from('appointments')
          .update({ payment_status: 'failed' })
          .eq('payment_reference', tx_ref);

        res.json({ status: 'failed' });
      }
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
};

module.exports = paymentController; 