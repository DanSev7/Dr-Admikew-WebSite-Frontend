const express = require('express');
const { createClient } = require('@supabase/supabase-js');
const chapaRoutes = require('./routes/chapaRoutes');
const emailRoutes = require('./routes/emailRoutes');
const axios = require('axios');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

// Initialize Supabase client
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

// Get departments
app.get('/api/departments', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('departments')
      .select('id, name, price');
    if (error) throw error;
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get services by type
app.get('/api/services/:type', async (req, res) => {
  try {
    const { type } = req.params;
    const { data, error } = await supabase
      .from('services')
      .select('id, code, name, type, category, price')
      .eq('type', type.charAt(0).toUpperCase() + type.slice(1));
    if (error) throw error;
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get home service options
app.get('/api/home-services', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('home_service_options')
      .select('id, name, price');
    if (error) throw error;
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/appointments/status-by-tx/:txRef', async (req, res) => {
  const { txRef } = req.params;
  console.log("txRef : ", txRef);
  try {
    const { data, error } = await supabase
      .from('appointments')
      .select('payment_status')
      .eq('chapa_transaction_id', txRef)
      .single();

    if (error || !data) {
      return res.status(404).json({ error: 'Appointment not found' });
    }

    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


// Routes
app.use('/api/chapa', chapaRoutes);
app.use('/api', emailRoutes);

// Payment success page (simple redirect handler)
app.get('/payment-success', (req, res) => {
  res.redirect('/'); // Redirect to home or a success page
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});