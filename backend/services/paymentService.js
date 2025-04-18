const chapa = require('../config/chapa');
const crypto = require('crypto');

const paymentService = {
  async initializePayment({ amount, email, reference, callback_url, return_url }) {
    try {
      const response = await chapa.post('/transaction/initialize', {
        amount,
        currency: 'ETB',
        email,
        first_name: email.split('@')[0],
        last_name: 'Patient',
        tx_ref: reference,
        callback_url,
        return_url,
        customization: {
          title: 'Surgery Center Appointment',
          description: 'Payment for medical appointment'
        }
      });

      return {
        checkout_url: response.data.data.checkout_url,
        reference: reference
      };
    } catch (error) {
      throw new Error('Payment initialization failed');
    }
  },

  verifyWebhookSignature(payload, signature) {
    const hmac = crypto.createHmac('sha256', process.env.CHAPA_WEBHOOK_SECRET);
    const calculatedSignature = hmac
      .update(JSON.stringify(payload))
      .digest('hex');
    
    return crypto.timingSafeEqual(
      Buffer.from(signature),
      Buffer.from(calculatedSignature)
    );
  }
};

module.exports = paymentService; 