const axios = require('axios');
require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');


// ENV Variables
const CHAPA_URL = process.env.CHAPA_URL || "https://api.chapa.co/v1/transaction/initialize";
const CHAPA_AUTH = process.env.CHAPA_AUTH || "CHASECK_TEST-jXs31NxZNPiC3d3pKJqGZjxrWwFLVsqg";
const CALLBACK_URL = process.env.CALLBACK_URL || "http://localhost:5000/api/chapa/verify-payment/";
const RETURN_URL = process.env.RETURN_URL || "http://localhost:5173/payment-success";
// Initialize Supabase client
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

const config = {
  headers: {
    Authorization: `Bearer ${CHAPA_AUTH}`,
    'Content-Type': 'application/json'
  }
};

// INITIATE PAYMENT
const initiatePayment = async (req, res) => {
    const { appointmentId, amount, email, phone, fullName,tx_ref } = req.body;
  console.log("Body : ", req.body);

  try {
    // const tx_ref = `TX-${Date.now()}-${appointmentId}`;
    const paymentData = {
      amount,
      currency: 'ETB',
      email,
      phone_number: phone,
      first_name: fullName.split(' ')[0],
      last_name: fullName.split(' ').slice(1).join(' ') || 'Unknown',
      tx_ref: tx_ref,
      callback_url: CALLBACK_URL,
      return_url: RETURN_URL,
    };

    const response = await axios.post(CHAPA_URL, paymentData, config);

    // Update appointment with transaction ID
    const { error } = await supabase
      .from('appointments')
      .update({ chapa_transaction_id: tx_ref })
      .eq('id', appointmentId);
    if (error) throw error;

    res.json({ checkoutUrl: response.data.data.checkout_url });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// WEBHOOK - CALLBACK
const webhookClient = async (req, res) => {
    const { tx_ref } = req.body;
    console.log("tx_ref from webhook:", tx_ref);
  
    try {
      const response = await axios.get(`https://api.chapa.co/v1/transaction/verify/${tx_ref}`, {
        headers: {
          Authorization: `Bearer ${CHAPA_AUTH}`,
        },
      });
  
      console.log("Verification Response:", response.data);
  
      const status = response.data.data.status;
      console.log("Payment Status from Chapa:", status);
  
      const { data: existing, error: fetchError } = await supabase
        .from('appointments')
        .select('*')
        .eq('chapa_transaction_id', tx_ref);
  
      // console.log("Matching appointment:", existing);
  
      if (fetchError) {
        console.error("Error fetching appointment:", fetchError);
      }
  
      const updateStatus = status === 'success' ? 'Completed' : 'Failed';
      const { data, error } = await supabase
        .from('appointments')
        .update({ payment_status: updateStatus })
        .eq('chapa_transaction_id', tx_ref);
  
      console.log("Update response:", { data, error });
  
      if (error) throw error;
  
      res.status(200).send('Webhook processed');
    } catch (error) {
      console.error("Webhook Error:", error.message);
      res.status(500).json({ error: error.message });
    }
  };


module.exports = { initiatePayment, webhookClient };
