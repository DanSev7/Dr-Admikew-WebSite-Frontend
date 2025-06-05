import React, { useState, useEffect, lazy, Suspense } from 'react';
import { useTranslation } from 'react-i18next';
import { useLocation } from 'react-router-dom';
import { FaPaperPlane, FaMoneyBillWave, FaTimes, FaCheckCircle } from 'react-icons/fa';
import { createClient } from '@supabase/supabase-js';
import { motion } from 'framer-motion';
import discountImage from '../assets/images/discount.png';

const ServiceSelectionModal = lazy(() => import('../components/ui/ServiceSelectionModal'));

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
);
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

// Utility function for UUID generation
const generateUUID = () => {
  if (crypto && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID();
  }
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = Math.random() * 16 | 0;
    const v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
};

const ModalLoadingFallback = () => (
  <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-sky-600"></div>
  </div>
);

// Success Modal Component
const SuccessModal = ({ isOpen, message }) => {
  if (!isOpen) return null;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.8 }}
      transition={{ duration: 0.3 }}
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
    >
      <div className="bg-white rounded-xl p-6 shadow-2xl max-w-sm w-full mx-4">
        <div className="flex flex-col items-center gap-4">
          <div className="bg-green-500 rounded-full p-3">
            <FaCheckCircle className="text-white" size={32} />
          </div>
          <p className="text-lg font-semibold text-gray-800 text-center">{message}</p>
        </div>
      </div>
    </motion.div>
  );
};

const Appointment = () => {
  const { t } = useTranslation();
  const { state } = useLocation();
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
    otherServicesText: '',
  });
  const [isServiceModalOpen, setIsServiceModalOpen] = useState(false);
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false); // New state for success modal
  const [currentServiceType, setCurrentServiceType] = useState('');
  const [departments, setDepartments] = useState([]);
  const [totalAmount, setTotalAmount] = useState(0);
  const [paymentLoading, setPaymentLoading] = useState(false);
  const [emailLoading, setEmailLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const discountedAmount = (totalAmount * 0.9).toFixed(2);
  const originalAmount = totalAmount.toFixed(2);

  const handleRemoveService = (code) => {
    setFormData(prev => ({
      ...prev,
      selectedServices: prev.selectedServices.filter(service => service.code !== code),
      otherServicesText: prev.selectedServices.find(s => s.code === code)?.name === 'Others' ? '' : prev.otherServicesText,
    }));
  };

  useEffect(() => {
    const fetchData = async () => {
      const { data: deptData, error: deptError } = await supabase
        .from('departments')
        .select('id, name, price');
      if (deptError) {
        setError(t('errors.departments'));
        return;
      }
      setDepartments(deptData);
    };
    fetchData();
  }, [t]);

  useEffect(() => {
    let total = 300;
    if (formData.selectedDepartment) {
      const dept = departments.find(d => d.id === formData.selectedDepartment);
      if (dept) total += dept.price;
    }
    total += formData.selectedServices.reduce((sum, s) => sum + s.price, 0);
    setTotalAmount(total);
  }, [formData.selectedServices, formData.selectedDepartment, departments]);

  useEffect(() => {
    if (state?.serviceType) {
      setFormData(prev => ({ ...prev, serviceType: state.serviceType }));
    }
  }, [state]);

  const handleServiceSelection = (type) => {
    setCurrentServiceType(type);
    setIsServiceModalOpen(true);
  };

  const handlePaymentSubmit = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    setPaymentLoading(true);
    setError('');
    setSuccessMessage('');

    try {
      if (!formData.fullName || !formData.age || !formData.sex || !formData.phone || !formData.email || !formData.appointmentDate || !formData.appointmentTime || !formData.selectedDepartment) {
        setError(t('booking.requiredFieldsError'));
        setPaymentLoading(false);
        return;
      }

      let patientId;
      const { data: existingPatient, error: patientError } = await supabase
        .from('patients')
        .select('id')
        .eq('mrn', formData.mrn)
        .single();
      if (patientError && patientError.code !== 'PGRST116') {
        throw new Error(t('errors.patientCheck'));
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
        if (createError) throw new Error(t('errors.patientCreate'));
        patientId = newPatient.id;
      }

      const txRef = `TX-${Date.now()}-${generateUUID()}`;

      const { data: appointment, error: apptError } = await supabase
        .from('appointments')
        .insert({
          patient_id: patientId,
          appointment_date: formData.appointmentDate,
          appointment_time: formData.appointmentTime,
          department_id: formData.selectedDepartment,
          appointment_type: formData.serviceType === 'appointment' ? 'Clinic' : 'Home',
          base_price: 300,
          total_amount: discountedAmount,
          payment_status: 'Pending',
          chapa_transaction_id: txRef,
          other_services: formData.otherServicesText || null,
        })
        .select('id')
        .single();

      if (apptError) throw new Error(t('errors.appointmentCreate'));

      if (formData.serviceType === 'appointment' && formData.selectedServices.length > 0) {
        const clinicServices = formData.selectedServices.map(service => ({
          appointment_id: appointment.id,
          service_id: service.id,
        }));
        const { error: clinicError } = await supabase
          .from('clinic_visit_services')
          .insert(clinicServices);
        if (clinicError) throw new Error(t('errors.clinicServices'));
      }

      const response = await fetch(`${API_URL}/api/chapa/initiate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          tx_ref: txRef,
          appointmentId: appointment.id,
          amount: discountedAmount,
          email: formData.email,
          phone: formData.phone,
          name: formData.fullName,
        }),
      });

      const paymentData = await response.json();
      if (!response.ok) throw new Error(paymentData.error || t('errors.paymentInitiate'));

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
        totalAmount: discountedAmount,
        txRef,
      }));

      window.location.href = paymentData.checkoutUrl;
    } catch (err) {
      setError(err.message);
      setPaymentLoading(false);
    }
  };

  const handleEmailBooking = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    setEmailLoading(true);
    setError('');
    setSuccessMessage('');

    try {
      if (!formData.fullName || !formData.age || !formData.sex || !formData.phone || !formData.email || !formData.appointmentDate || !formData.appointmentTime || !formData.selectedDepartment) {
        setError(t('booking.requiredFieldsError'));
        setEmailLoading(false);
        return;
      }

      let patientId;
      const { data: existingPatient, error: patientError } = await supabase
        .from('patients')
        .select('id')
        .eq('mrn', formData.mrn)
        .single();
      if (patientError && patientError.code !== 'PGRST116') {
        throw new Error(t('errors.patientCheck'));
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
        if (createError) throw new Error(t('errors.patientCreate'));
        patientId = newPatient.id;
      }

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
          other_services: formData.otherServicesText || null,
        })
        .select('id')
        .single();

      if (apptError) throw new Error(t('errors.appointmentCreate'));

      if (formData.serviceType === 'appointment' && formData.selectedServices.length > 0) {
        const clinicServices = formData.selectedServices.map(service => ({
          appointment_id: appointment.id,
          service_id: service.id,
        }));
        const { error: clinicError } = await supabase
          .from('clinic_visit_services')
          .insert(clinicServices);
        if (clinicError) throw new Error(t('errors.clinicServices'));
      }

      const response = await fetch(`${API_URL}/api/send-booking-email`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.fullName,
          email: formData.email,
          phone: formData.phone,
          totalAmount: totalAmount,
          appointmentId: appointment.id,
        }),
      });

      const emailData = await response.json();
      if (!response.ok) throw new Error(emailData.error || t('errors.emailSend'));

      setFormData({
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
        otherServicesText: '',
      });
      setSuccessMessage(t('booking.successMessage'));
      setIsSuccessModalOpen(true); // Show success modal

      // Clear success message after 10 seconds
      const messageTimeout = setTimeout(() => {
        setSuccessMessage('');
      }, 5000);

      // Close success modal after 4 seconds
      const modalTimeout = setTimeout(() => {
        setIsSuccessModalOpen(false);
      }, 4000);

      // Cleanup timeouts
      return () => {
        clearTimeout(messageTimeout);
        clearTimeout(modalTimeout);
      };
    } catch (err) {
      setError(err.message);
      setEmailLoading(false);
    } finally {
      setEmailLoading(false);
    }
  };

  return (
    <div className="py-16 bg-gray-50 min-h-screen">
      <div className="container mx-auto px-4">
        <nav className="mb-8 flex items-center space-x-2 text-gray-600 font-medium">
          <a href="/" className="hover:text-sky-600">{t('nav.home')}</a>
          <span>/</span>
          <span className="text-sky-600">{t('nav.appointment')}</span>
        </nav>
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h1 className="text-3xl md:text-4xl font-bold text-gray-800">{t('appointment.title')}</h1>
          <p className="text-gray-600 mt-2">{t('appointment.subtitle')}</p>
        </motion.div>

        <div className="bg-white shadow-xl rounded-2xl p-6 md:p-8 grid md:grid-cols-2 gap-8">
          <div className="space-y-6">
            <motion.h2
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className="text-2xl font-bold text-gray-800"
            >
              {t('booking.title')}
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
              className="text-gray-600"
            >
              {t('booking.description')}
            </motion.p>
            <motion.p
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="text-gray-500 text-sm italic"
            >
              {t('booking.requiredFields')}
            </motion.p>
            {formData.serviceType === 'appointment' && (
              <>
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 }}
                  className="bg-sky-50 rounded-lg p-4"
                >
                  <p className="text-sky-600 font-semibold">{t('booking.totalAmount', { amount: totalAmount })}</p>
                  <p className="text-sky-600 text-sm mt-1">{t('booking.registrationFee')}</p>
                </motion.div>
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4 }}
                  className="flex items-center gap-6 bg-white shadow-lg rounded-xl p-5 hover:shadow-xl transition-shadow duration-300"
                >
                  <motion.img
                    src={discountImage}
                    alt={t('booking.discountAlt')}
                    className="w-24 h-24 object-contain"
                    animate={{ scale: [1, 1.1, 1], y: [0, -5, 0] }}
                    transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                  />
                  <div>
                    <p className="text-sky-700 text-lg font-bold">{t('booking.discountTitle')}</p>
                    <p className="text-gray-600 text-sm">{t('booking.discountDescription')}</p>
                  </div>
                </motion.div>
              </>
            )}
          </div>

          <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
            {successMessage && (
              <div className="bg-green-50 border-l-4 border-green-400 p-4 rounded-r-lg">
                <p className="text-green-700">{successMessage}</p>
              </div>
            )}
            {error && (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-red-500 font-medium"
              >
                {error}
              </motion.p>
            )}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="flex space-x-4"
            >
              {['appointment', 'home'].map(type => (
                <button
                  key={type}
                  type="button"
                  className={`flex-1 py-2 rounded-lg font-semibold transition-all duration-300 ${formData.serviceType === type ? 'bg-sky-600 text-white shadow-md' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
                  onClick={() => setFormData(prev => ({ ...prev, serviceType: type, selectedServices: [] }))}
                >
                  {t(`booking.${type === 'appointment' ? 'centerVisit' : 'homeService'}`)}
                </button>
              ))}
            </motion.div>

            {formData.serviceType === 'home' && (
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.5 }}
                className="flex flex-col items-center justify-center p-6 bg-sky-50 rounded-xl"
              >
                <motion.h2
                  animate={{ scale: [1, 1.1, 1] }}
                  transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                  className="text-xl font-bold text-sky-600"
                >
                  {t('booking.underConstruction')}
                </motion.h2>
                <motion.p
                  transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut", delay: 0.2 }}
                  className="text-sm text-sky-600 mt-2"
                >
                  {t('booking.comingSoon')}
                </motion.p>
              </motion.div>
            )}

            {formData.serviceType === 'appointment' && (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">{t('contact.form.name')}*</label>
                    <input
                      type="text"
                      value={formData.fullName}
                      onChange={(e) => setFormData(prev => ({ ...prev, fullName: e.target.value }))}
                      className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-sky-600 focus:border-sky-600"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">{t('booking.mrn')}</label>
                    <input
                      type="text"
                      value={formData.mrn || ''}
                      onChange={(e) => setFormData(prev => ({ ...prev, mrn: e.target.value }))}
                      placeholder={t('booking.mrnPlaceholder')}
                      className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-sky-600 focus:border-sky-600"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">{t('booking.age')}*</label>
                    <input
                      type="number"
                      min="0"
                      value={formData.age}
                      onChange={(e) => setFormData(prev => ({ ...prev, age: Math.max(0, parseInt(e.target.value) || 0).toString() }))}
                      className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-sky-600 focus:border-sky-600"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">{t('booking.sex')}*</label>
                    <div className="relative">
                      <select
                        className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-sky-600 focus:border-sky-600 appearance-none"
                        value={formData.sex}
                        onChange={(e) => setFormData(prev => ({ ...prev, sex: e.target.value }))}
                        required
                      >
                        <option value="">{t('booking.selectSex')}</option>
                        <option value="Male">{t('booking.male')}</option>
                        <option value="Female">{t('booking.female')}</option>
                      </select>
                      <div className="absolute inset-0 right-0 flex items-center px-2 pointer-events-none">
                        <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                        </svg>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">{t('booking.phone')}*</label>
                    <input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                      placeholder="09XXXXXXXX"
                      className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-sky-600 focus:border-sky-600"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">{t('booking.email')}*</label>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                      placeholder="example@gmail.com"
                      className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-sky-600 focus:border-sky-600"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">{t('booking.date')}*</label>
                    <input
                      type="date"
                      value={formData.appointmentDate}
                      onChange={(e) => setFormData(prev => ({ ...prev, appointmentDate: e.target.value }))}
                      min={new Date().toISOString().split('T')[0]}
                      className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-sky-600 focus:border-sky-600"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">{t('booking.time')}*</label>
                    <input
                      type="time"
                      value={formData.appointmentTime}
                      onChange={(e) => setFormData(prev => ({ ...prev, appointmentTime: e.target.value }))}
                      className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-sky-600 focus:border-sky-600"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">{t('booking.selectDepartment')}*</label>
                  <div className="relative">
                    <select
                      value={formData.selectedDepartment}
                      onChange={(e) => setFormData(prev => ({ ...prev, selectedDepartment: e.target.value }))}
                      className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-sky-600 focus:border-sky-600 appearance-none"
                      required
                    >
                      <option value="">{t('booking.selectDepartmentPlaceholder')}</option>
                      {departments.map(dept => (
                        <option key={dept.id} value={dept.id}>{dept.name}</option>
                      ))}
                    </select>
                    <div className="absolute inset-0 right-0 flex items-center px-2 pointer-events-none">
                      <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                      </svg>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <h3 className="text-lg font-semibold text-gray-800">{t('booking.selectServices')}</h3>
                  <div className="flex flex-wrap gap-2">
                    {['laboratory', 'x-ray', 'ultrasound'].map(type => (
                      <button
                        key={type}
                        type="button"
                        onClick={() => handleServiceSelection(type)}
                        className="px-3 py-1.5 border rounded-lg text-gray-700 font-medium hover:bg-sky-50 hover:border-sky-600 transition-all"
                      >
                        {t(`booking.services.${type}`)}
                      </button>
                    ))}
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {formData.selectedServices.map(service => (
                      <div key={service.id} className="bg-sky-50 text-sky-600 px-2 py-1 rounded-lg text-sm flex items-center">
                        {service.name}
                        <button
                          type="button"
                          onClick={() => handleRemoveService(service.code)}
                          className="ml-2 text-red-500 hover:text-red-700"
                        >
                          <FaTimes size={12} />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    type="button"
                    onClick={handleEmailBooking}
                    disabled={emailLoading || paymentLoading}
                    className={`flex items-center justify-center p-4 bg-sky-100 border-2 border-sky-300 rounded-xl hover:bg-sky-200 transition-all duration-300 ${emailLoading || paymentLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
                  >
                    <FaPaperPlane className="text-sky-600 mr-3" size={20} />
                    <div className="text-left">
                      <span className="block text-base font-semibold text-gray-800">
                        {emailLoading ? t('booking.submitting') : t('payment.payAtCenter')}
                      </span>
                      <span className="block text-sm text-gray-600">{originalAmount} ETB</span>
                    </div>
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    type="button"
                    onClick={handlePaymentSubmit}
                    disabled={paymentLoading || emailLoading}
                    className={`flex items-center justify-center p-4 bg-sky-600 text-white rounded-xl hover:bg-sky-700 transition-all duration-300 ${paymentLoading || emailLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
                  >
                    <FaMoneyBillWave className="mr-3" size={20} />
                    <div className="text-left">
                      <span className="block text-base font-semibold">
                        {paymentLoading ? t('booking.submitting') : t('payment.payWithChapa')}
                      </span>
                      <div className="text-sm">
                        <span className="line-through text-gray-200 mr-2">{originalAmount} ETB</span>
                        <span>{discountedAmount} ETB</span>
                      </div>
                    </div>
                  </motion.button>
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

      <SuccessModal
        isOpen={isSuccessModalOpen}
        message={t('booking.successMessage')}
      />
    </div>
  );
};

export default Appointment;