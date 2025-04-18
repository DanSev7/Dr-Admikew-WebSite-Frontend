const supabase = require('../config/database');
const { initializePayment } = require('../services/paymentService');

const appointmentController = {
  async createAppointment(req, res) {
    try {
      const {
        full_name,
        sex,
        age,
        phone,
        department,
        service_type,
        sub_services,
        mrn,
        appointment_date,
        appointment_time,
        appointment_mode
      } = req.body;

      // Create temporary appointment record
      const { data: appointment, error } = await supabase
        .from('appointments')
        .insert([{
          user_id: req.user.id,
          full_name,
          sex,
          age,
          phone,
          department,
          service_type,
          sub_services,
          mrn,
          appointment_date,
          appointment_time,
          appointment_mode,
          payment_status: 'pending'
        }])
        .select()
        .single();

      if (error) throw error;

      // Initialize payment with Chapa
      const totalPrice = await calculateTotalPrice(sub_services);
      const payment = await initializePayment({
        amount: totalPrice,
        email: req.user.email,
        reference: `APP-${appointment.id}`,
        callback_url: `${process.env.FRONTEND_URL}/payment/callback`,
        return_url: `${process.env.FRONTEND_URL}/payment/return`
      });

      // Update appointment with payment reference
      await supabase
        .from('appointments')
        .update({ payment_reference: payment.reference })
        .eq('id', appointment.id);

      res.json({
        appointment,
        checkout_url: payment.checkout_url
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  async getAppointments(req, res) {
    try {
      const { data: appointments, error } = await supabase
        .from('appointments')
        .select('*')
        .eq('user_id', req.user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      res.json(appointments);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
};

// Helper function to calculate appointment fee
function calculateAppointmentFee(mode, subServices) {
  let baseFee = mode === 'home' ? 1000 : 500; // Base fee in ETB
  
  // Add fees for sub-services
  if (subServices) {
    if (subServices.includes('laboratory')) baseFee += 300;
    if (subServices.includes('xray')) baseFee += 500;
    if (subServices.includes('ultrasound')) baseFee += 800;
  }
  
  return baseFee;
}

async function calculateTotalPrice(subServices) {
  const { data: services, error } = await supabase
    .from('service_categories')
    .select('price')
    .in('name', subServices);

  if (error) throw error;
  
  return services.reduce((total, service) => total + service.price, 0);
}

module.exports = appointmentController; 