import React, { useState, useEffect, lazy, Suspense } from 'react';
import { useTranslation } from 'react-i18next';
import { useLocation } from 'react-router-dom';
import { FaPaperPlane } from 'react-icons/fa';
import { createClient } from '@supabase/supabase-js';
import { AiOutlineClose } from 'react-icons/ai';  
import { motion } from 'framer-motion';

// Lazy load components
const ServiceSelectionModal = lazy(() => import('../components/ui/ServiceSelectionModal'));

// Initialize Supabase client
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

// Loading component for modal
const ModalLoadingFallback = () => (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-sky-600"></div>
  </div>
);

const Appointment = () => {
  const { t } = useTranslation();
  const location = useLocation();
  const [formData, setFormData] = useState({
    fullName: '',
    age: '',
    sex: '',
    phone: '',
    email: '',
    appointmentDate: '',
    appointmentTime: '',
    selectedDepartment: '',
    serviceType: 'appointment',
    location: 'Jigjiga',
    selectedServices: [],
    mrn: '',
    otherServices: '',
    otherServicesText: '',
  });
  const [isServiceModalOpen, setIsServiceModalOpen] = useState(false);
  const [currentServiceType, setCurrentServiceType] = useState('');
  const [departments, setDepartments] = useState([]);
  const [totalAmount, setTotalAmount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleRemoveService = (code) => {
    setFormData(prev => ({
      ...prev,
      selectedServices: prev.selectedServices.filter(service => service.code !== code),
      otherServicesText: prev.selectedServices.find(s => s.code === code)?.name === 'Others' ? '' : prev.otherServicesText,
    }));
  };

  // Fetch departments on mount
  useEffect(() => {
    const fetchData = async () => {
      const { data: deptData, error: deptError } = await supabase
        .from('departments')
        .select('id, name, price');
      if (deptError) {
        setError('Failed to load departments');
        return;
      }
      setDepartments(deptData);
    };
    fetchData();
  }, []);

  // Calculate total amount
  useEffect(() => {
    let total = 300;
    if (formData.selectedDepartment) {
      const dept = departments.find(d => d.id === formData.selectedDepartment);
      if (dept) {
        total += dept.price;
      }
    }
    total += formData.selectedServices.reduce((sum, s) => sum + s.price, 0);
    setTotalAmount(total);
  }, [formData.selectedServices, formData.selectedDepartment, departments]);

  // Set initial service type
  useEffect(() => {
    if (location.state?.serviceType) {
      setFormData(prev => ({
        ...prev,
        serviceType: location.state.serviceType,
      }));
    }
  }, [location.state]);

  const handleServiceSelection = (type) => {
    setCurrentServiceType(type);
    setIsServiceModalOpen(true);
  };

  const handleAppointmentSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      if (!formData.fullName || !formData.age || !formData.sex || !formData.phone || !formData.email || !formData.appointmentDate || !formData.appointmentTime) {
        setError('Please fill in all required fields');
        setLoading(false);
        return;
      }

      let patientId;
      const { data: existingPatient, error: patientError } = await supabase
        .from('patients')
        .select('id')
        .eq('mrn', formData.mrn)
        .single();
      if (patientError && patientError.code !== 'PGRST116') {
        throw new Error('Failed to check patient');
      }

      if (existingPatient) {
        patientId = existingPatient.id;
      } else {
        const { data: newPatient, error: createError } = await supabase
          .from('patients')
          .insert({
            full_name: formData.fullName,
            age: parseInt(formData.age),
            sex: formData.sex,
            phone_number: formData.phone,
            email: formData.email,
            address: formData.location,
            mrn: formData.mrn || null,
          })
          .select('id')
          .single();
        if (createError) throw new Error('Failed to create patient');
        patientId = newPatient.id;
      }
      const txRef = `TX-${Date.now()}-${crypto.randomUUID()}`;

      const { data: appointment, error: apptError } = await supabase
        .from('appointments')
        .insert({
          patient_id: patientId,
          appointment_date: formData.appointmentDate,
          appointment_time: formData.appointmentTime,
          department_id: formData.selectedDepartment,
          appointment_type: formData.serviceType === 'appointment' ? 'Clinic' : 'Home',
          base_price: 300,
          total_amount: totalAmount,
          payment_status: 'Pending',
          chapa_transaction_id: txRef,
          other_services: formData.otherServicesText || null,
        })
        .select('id')
        .single();

      if (apptError) throw new Error('Failed to create appointment');

      if (formData.serviceType === 'appointment' && formData.selectedServices.length > 0) {
        const clinicServices = formData.selectedServices.map(service => ({
          appointment_id: appointment.id,
          service_id: service.id,
        }));
        const { error: clinicError } = await supabase
          .from('clinic_visit_services')
          .insert(clinicServices);
        if (clinicError) throw new Error('Failed to link clinic services');
      }

      const response = await fetch(`${API_URL}/api/chapa/initiate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          tx_ref: txRef,
          appointmentId: appointment.id,
          amount: totalAmount,
          email: formData.email,
          phone: formData.phone,
          name: formData.fullName,
        }),
      });

      const paymentData = await response.json();
      if (!response.ok) throw new Error(paymentData.error || 'Failed to initiate payment');
      console.log("Payment Data : ", paymentData);

      window.location.href = paymentData.checkoutUrl;

      localStorage.setItem('appointmentData', JSON.stringify({
        name: formData.fullName,
        email: formData.email,
        phone: formData.phone,
        appointmentDate: formData.appointmentDate,
        appointmentTime: formData.appointmentTime,
        serviceType: formData.serviceType,
        selectedDepartment: formData.selectedDepartment,
        selectedServices: formData.selectedServices,
        otherServicesText: formData.otherServicesText,
        totalAmount: totalAmount,
        txRef: txRef
      }));
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  return (
    <div className="py-20 bg-gray-50">
      {/* Hero Section with Breadcrumb */}
      
        <div className="px-7 md:px-8 lg:px-14 xl:px-18 mb-16 mt-2">
        <nav className="mb-8">
          <ol className="flex items-center space-x-2 text-gray-600 font-medium text-md">
            <li><a href="/" className="hover:black-white transition-colors">{t('nav.home')}</a></li>
            <li>/</li>
            <li className="text-sky-600">{t('nav.appointment')}</li>
          </ol>
        </nav>
          <div className="text-center max-w-3xl mx-auto">
            <motion.h1 
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-4xl md:text-5xl font-bold mb-4 tracking-tight"
            >
              {t('appointment.title')}
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-lg leading-relaxed"
            >
              {t('appointment.subtitle')}
            </motion.p>
          </div>
        </div>

      <div className="container mx-auto px-4">
        {/* Book Appointment */}
        <div className="bg-white shadow-xl rounded-2xl p-8 grid md:grid-cols-2 gap-10 bg-gradient-to-br from-white to-gray-50">
          <div className="space-y-6">
            <motion.h2 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className="text-3xl font-bold text-gray-900"
            >
              Book Your Appointment
            </motion.h2>
            <motion.p 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
              className="text-gray-600 leading-relaxed"
            >
              Schedule a consultation or follow-up with our expert team. Fill in the details below, and we'll confirm your appointment promptly.
            </motion.p>
            <motion.p 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="text-gray-500 text-sm italic"
            >
              Fields marked with * are required.
            </motion.p>
            {error && (
              <motion.p 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-red-500 font-medium"
              >
                {error}
              </motion.p>
            )}
            {formData.serviceType === 'appointment' && (
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
                className="bg-sky-100 rounded-lg p-4"
              >
                <p className="text-sky-600 font-semibold">Total Amount: ${totalAmount}</p>
                <p className="text-sky-600 text-sm mt-1">*Initial 300 birr is for Registration</p>
              </motion.div>
            )}
          </div>

          <form onSubmit={handleAppointmentSubmit} className="space-y-6">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="flex space-x-4"
            >
              <button
                type="button"
                className={`px-6 py-3 rounded-full font-medium transition-all duration-300 ${
                  formData.serviceType === 'appointment'
                    ? 'bg-sky-600 text-white shadow-md'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
                onClick={() => setFormData(prev => ({ ...prev, serviceType: 'appointment', selectedServices: [] }))}
              >
                {t('booking.centerVisit')}
              </button>
              <button
                type="button"
                className={`px-6 py-3 rounded-full font-medium transition-all duration-300 ${
                  formData.serviceType === 'home'
                    ? 'bg-sky-600 text-white shadow-md'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
                onClick={() => setFormData(prev => ({ ...prev, serviceType: 'home', selectedServices: [] }))}
              >
                {t('booking.homeService')}
              </button>
            </motion.div>

            {formData.serviceType === 'home' && (
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.5, yoyo: Infinity, ease: "easeInOut" }}
                className="flex flex-col items-center justify-center h-40 bg-sky-100 rounded-xl p-6"
              >
                <motion.h2
                  animate={{ scale: [1, 1.1, 1], opacity: [1, 0.8, 1] }}
                  transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                  className="text-2xl font-bold text-sky-600"
                >
                  Under Construction
                </motion.h2>
                <motion.p
                  animate={{ scale: [1, 1.05, 1], opacity: [1, 0.9, 1] }}
                  transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut", delay: 0.2 }}
                  className="text-sm text-sky-600 mt-2 font-medium"
                >
                  Coming Soon...
                </motion.p>
              </motion.div>
            )}

            {formData.serviceType === 'appointment' && (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      {t('contact.form.name')}*
                    </label>
                    <input
                      type="text"
                      value={formData.fullName}
                      onChange={(e) => setFormData(prev => ({ ...prev, fullName: e.target.value }))}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-600 focus:border-sky-600 transition-all duration-300"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      {t('booking.mrn')}
                    </label>
                    <input
                      type="text"
                      value={formData.mrn || ''}
                      onChange={(e) => setFormData(prev => ({ ...prev, mrn: e.target.value }))}
                      placeholder={t('booking.mrnPlaceholder')}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-600 focus:border-sky-600 transition-all duration-300"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      {t('booking.age')}*
                    </label>
                    <input
                      type="number"
                      min="0"
                      value={formData.age}
                      onChange={(e) => {
                        const value = Math.max(0, parseInt(e.target.value) || 0);
                        setFormData(prev => ({ ...prev, age: value.toString() }));
                      }}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-600 focus:border-sky-600 transition-all duration-300"
                      required
                    />
                  </div>
                  <div>
                    <label htmlFor="sex" className="block text-sm font-medium text-gray-700 mb-1">
                      {t('booking.sex')}*
                    </label>
                    <div className="relative">
                      <select
                        id="sex"
                        className="appearance-none w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-600 focus:border-sky-600 transition-all duration-300 bg-white"
                        value={formData.sex}
                        onChange={(e) => setFormData(prev => ({ ...prev, sex: e.target.value }))}
                        required
                      >
                        <option value="">{t('booking.selectSex')}</option>
                        <option value="Male">{t('booking.male')}</option>
                        <option value="Female">{t('booking.female')}</option>
                      </select>
                      <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                        <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                        </svg>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                      {t('booking.phone')}*
                    </label>
                    <input
                      type="tel"
                      id="phone"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-600 focus:border-sky-600 transition-all duration-300"
                      placeholder="09XXXXXXXX"
                      value={formData.phone}
                      onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                      required
                    />
                  </div>
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                      {t('booking.email')}*
                    </label>
                    <input
                      type="email"
                      id="email"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-600 focus:border-sky-600 transition-all duration-300"
                      placeholder="example@gmail.com"
                      value={formData.email}
                      onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      {t('booking.date')}*
                    </label>
                    <input
                      type="date"
                      value={formData.appointmentDate}
                      onChange={(e) => setFormData(prev => ({ ...prev, appointmentDate: e.target.value }))}
                      min={new Date().toISOString().split('T')[0]}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-600 focus:border-sky-600 transition-all duration-300"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      {t('booking.time')}*
                    </label>
                    <input
                      type="time"
                      value={formData.appointmentTime}
                      onChange={(e) => setFormData(prev => ({ ...prev, appointmentTime: e.target.value }))}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-600 focus:border-sky-600 transition-all duration-300"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {t('booking.selectDepartment')}*
                  </label>
                  <div className="relative">
                    <select
                      value={formData.selectedDepartment}
                      onChange={(e) => setFormData(prev => ({ ...prev, selectedDepartment: e.target.value }))}
                      className="appearance-none w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-600 focus:border-sky-600 transition-all duration-300 bg-white"
                      required
                    >
                      <option value="">{t('booking.selectDepartmentPlaceholder')}</option>
                      {departments.map(dept => (
                        <option key={dept.id} value={dept.id}>
                          {dept.name}
                        </option>
                      ))}
                    </select>
                    <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                      <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                      </svg>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-900">{t('booking.selectServices')}</h3>
                  <div className="flex flex-wrap gap-3">
                    {['laboratory', 'x-ray', 'ultrasound'].map(type => (
                      <button
                        key={type}
                        type="button"
                        onClick={() => handleServiceSelection(type)}
                        className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-sky-50 hover:border-sky-600 transition-all duration-300"
                      >
                        {t(`booking.services.${type}`)}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="flex flex-wrap gap-2">
                  {formData.selectedServices.map(service => (
                    <div
                      key={service.id}
                      className="relative bg-sky-100 text-sky-600 px-3 py-1 rounded-lg text-sm pr-8"
                    >
                      {service.name}
                      <button
                        type="button"
                        onClick={() => handleRemoveService(service.code)}
                        className="absolute top-1/2 right-2 transform -translate-y-1/2 text-red-500 hover:text-red-700"
                      >
                        <AiOutlineClose size={14} />
                      </button>
                    </div>
                  ))}
                </div>

                <div>
                  <button
                    type="submit"
                    disabled={loading}
                    className={`w-full flex items-center justify-center px-6 py-3 bg-sky-600 text-white rounded-lg font-semibold hover:bg-sky-700 transition-all duration-300 shadow-md ${
                      loading ? 'opacity-50 cursor-not-allowed' : ''
                    }`}
                  >
                    <FaPaperPlane className="mr-2" />
                    {loading ? t('booking.submitting') : t('booking.submit')}
                  </button>
                </div>
              </>
            )}
          </form>
        </div>
      </div>

      <Suspense fallback={<ModalLoadingFallback />}>
        <ServiceSelectionModal
          isOpen={isServiceModalOpen}
          onClose={() => setIsServiceModalOpen(false)}
          type={currentServiceType}
          selectedServices={formData.selectedServices}
          onSelect={(services) => {
            const existingCodes = formData.selectedServices.map(s => s.code);
            const newServices = services.filter(s => !existingCodes.includes(s.code));
            setFormData(prev => ({
              ...prev,
              selectedServices: [...prev.selectedServices, ...newServices],
            }));
          }}
        />
      </Suspense>
    </div>
  );
};

export default Appointment;