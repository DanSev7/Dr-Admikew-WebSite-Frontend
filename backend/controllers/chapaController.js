const axios = require('axios');
const { createClient } = require('@supabase/supabase-js');
const validator = require('validator');
require('dotenv').config();

// ENV Variables
const CHAPA_URL = process.env.CHAPA_URL || 'https://api.chapa.co/v1/transaction/initialize';
const CHAPA_AUTH = process.env.CHAPA_AUTH || 'CHASECK_TEST-jXs31NxZNPiC3d3pKJqGZjxrWwFLVsqg';
const CALLBACK_URL = process.env.CALLBACK_URL || 'http://localhost:5000/api/chapa/verify-payment/';
const RETURN_URL = process.env.RETURN_URL || 'http://localhost:5173/payment-success';

// Initialize Supabase client
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);

// Axios config
const axiosConfig = {
  headers: {
    Authorization: `Bearer ${CHAPA_AUTH}`,
    'Content-Type': 'application/json',
  },
};

// Validate payment input
const validatePaymentInput = ({ appointmentId, amount, email, phone, name, tx_ref }) => {
  if (!appointmentId || !amount || !email || !phone || !name || !tx_ref) {
    throw new Error('Missing required payment fields.');
  }
  if (!validator.isEmail(email)) {
    throw new Error('Invalid email format.');
  }
  if (!validator.isMobilePhone(phone, 'any')) {
    throw new Error('Invalid phone number format.');
  }
  if (amount <= 0) {
    throw new Error('Amount must be greater than zero.');
  }
};

// Initiate Payment
const initiatePayment = async (req, res) => {
  const { appointmentId, amount, email, phone, name, tx_ref } = req.body;
  console.log('Initiating payment:', { appointmentId, tx_ref });

  try {
    validatePaymentInput({ appointmentId, amount, email, phone, name, tx_ref });

    const paymentData = {
      amount,
      currency: 'ETB',
      email,
      phone_number: phone,
      first_name: name.split(' ')[0],
      last_name: name.split(' ').slice(1).join(' ') || 'N/A',
      tx_ref,
      callback_url: CALLBACK_URL,
      return_url: RETURN_URL,
    };

    const response = await axios.post(CHAPA_URL, paymentData, axiosConfig);

    const { error } = await supabase
      .from('appointments')
      .update({ chapa_transaction_id: tx_ref })
      .eq('id', appointmentId);

    if (error) {
      console.error('Failed to update appointment with transaction ID:', error);
      throw new Error('Failed to update appointment with transaction ID.');
    }

    res.json({ checkoutUrl: response.data.data.checkout_url });
  } catch (error) {
    console.error('Payment initiation error:', error.message, { tx_ref });
    res.status(400).json({ error: error.message || 'Failed to initiate payment.' });
  }
};

// Webhook - Callback
const webhookClient = async (req, res) => {
  const { tx_ref } = req.body;
  console.log('Received webhook:', { tx_ref });

  try {
    if (!tx_ref) {
      throw new Error('Missing transaction reference.');
    }

    const response = await axios.get(`https://api.chapa.co/v1/transaction/verify/${tx_ref}`, axiosConfig);
    const status = response.data.data.status;
    console.log('Payment status from Chapa:', { tx_ref, status });

    const { data: appointments, error: fetchError } = await supabase
      .from('appointments')
      .select('id, patient_id, total_amount')
      .eq('chapa_transaction_id', tx_ref)
      .single();

    if (fetchError || !appointments) {
      console.error('Appointment not found:', fetchError, { tx_ref });
      throw new Error('Appointment not found.');
    }

    const updateStatus = status === 'success' ? 'Completed' : 'Failed';
    const { error: updateError } = await supabase
      .from('appointments')
      .update({ payment_status: updateStatus })
      .eq('id', appointments.id);

    if (updateError) {
      console.error('Failed to update appointment status:', updateError, { tx_ref });
      throw new Error('Failed to update appointment status.');
    }

    if (updateStatus === 'Completed') {
      const { data: patient, error: patientError } = await supabase
        .from('patients')
        .select('full_name, email')
        .eq('id', appointments.patient_id)
        .single();

      if (patientError || !patient) {
        console.error('Patient not found:', patientError, { tx_ref });
        throw new Error('Patient not found.');
      }

      const paymentDetails = {
        name: patient.full_name || 'Unknown',
        email: patient.email || 'no-email@fallback.com',
        amount: appointments.total_amount || 0,
        status: updateStatus,
        tx_ref,
      };

      const { sendPaymentSuccessEmail } = require('./emailController');
      await sendPaymentSuccessEmail(paymentDetails);
      console.log('Webhook triggered email for payment:', { tx_ref });
    }

    res.status(200).send('Webhook processed');
  } catch (error) {
    console.error('Webhook error:', error.message, { tx_ref });
    res.status(200).send('Webhook processed with errors');
  }
};

module.exports = { initiatePayment, webhookClient };