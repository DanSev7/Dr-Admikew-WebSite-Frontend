/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useLocation, useNavigate } from 'react-router-dom';
import { FaMapMarkerAlt, FaPhone, FaEnvelope, FaPaperPlane, FaExclamationTriangle } from 'react-icons/fa';
import { motion } from 'framer-motion';
import { createClient } from '@supabase/supabase-js';
import ServiceSelectionModal from '../components/ui/ServiceSelectionModal';
import { AiOutlineClose } from 'react-icons/ai';

// Initialize Supabase client
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

const Contact = () => {
  const { t } = useTranslation();
  const location = useLocation();
  const navigate = useNavigate();
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
  const [contactFormData, setContactFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: '',
  });
  const [isServiceModalOpen, setIsServiceModalOpen] = useState(false);
  const [currentServiceType, setCurrentServiceType] = useState('');
  const [departments, setDepartments] = useState([]);
  const [homeServices, setHomeServices] = useState([]);
  const [totalAmount, setTotalAmount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [contactLoading, setContactLoading] = useState(false);
  const [error, setError] = useState('');
  const [contactError, setContactError] = useState('');
  const [contactSuccess, setContactSuccess] = useState('');

  const handleRemoveService = (code) => {
    setFormData(prev => ({
      ...prev,
      selectedServices: prev.selectedServices.filter(service => service.code !== code),
      // Clear otherServicesText if removing "Other"
      otherServicesText: prev.selectedServices.find(s => s.code === code)?.name === 'Others' ? '' : prev.otherServicesText,
    }));
  };

  // Fetch departments and home services on mount
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

      const { data: homeData, error: homeError } = await supabase
        .from('home_service_options')
        .select('id, name, price');
      if (homeError) {
        setError('Failed to load home services');
        return;
      }
      setHomeServices(homeData);
    };
    fetchData();
  }, []);

  // Calculate total amount
  useEffect(() => {
    // Base payment is always 300 Birr
    let total = 300;
    
    // Add department price if selected
    if (formData.selectedDepartment) {
      const dept = departments.find(d => d.id === formData.selectedDepartment);
      if (dept) {
        total += dept.price;
      }
    }
    
    // Add prices of selected services
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

  const handleHomeServiceToggle = (service) => {
    const isCurrentlySelected = formData.selectedServices.some(s => s.id === service.id);

    setFormData(prev => ({
      ...prev,
      selectedServices: isCurrentlySelected
        ? prev.selectedServices.filter(s => s.id !== service.id)
        : [...prev.selectedServices, service],
      // Clear otherServicesText when "Other" is unchecked
      otherServicesText: service.name === 'Others' && isCurrentlySelected
        ? ''
        : prev.otherServicesText,
    }));
  };

  // Check if "Other" option is selected
  const isOtherSelected = formData.selectedServices.some(service => service.name === 'Others');

  const handleAppointmentSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // Validate form data
      if (!formData.fullName || !formData.age || !formData.sex || !formData.phone || !formData.email || !formData.appointmentDate || !formData.appointmentTime) {
        setError('Please fill in all required fields');
        setLoading(false);
        return;
      }

      // Create or get patient
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
          base_price: 300, // Base price is always 300
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

      if (formData.serviceType === 'home') {
        if (formData.selectedServices.length > 0) {
          const homeSelections = formData.selectedServices.map(service => ({
            appointment_id: appointment.id,
            home_service_option_id: service.id,
          }));
          const { error: homeError } = await supabase
            .from('home_service_selections')
            .insert(homeSelections);
          if (homeError) throw new Error('Failed to link home services');
        }

        const { error: locationError } = await supabase
          .from('home_service_locations')
          .insert({
            appointment_id: appointment.id,
            location: formData.location,
          });
        if (locationError) throw new Error('Failed to add location');
      }

      const response = await fetch('http://localhost:5000/api/chapa/initiate', {
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
      
      // Navigate to payment page with appointment data
      window.location.href = paymentData.checkoutUrl;
      
      // Store appointment data in localStorage for PaymentSuccess page
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

  const handleContactSubmit = async (e) => {
    e.preventDefault();
    setContactLoading(true);
    setContactError('');
    setContactSuccess('');

    // Client-side validation
    const { name, email, phone, message } = contactFormData;
    if (!name || !email || !phone || !message) {
      setContactError(t('contact.form.validationError'));
      setContactLoading(false);
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setContactError(t('contact.form.invalidEmail'));
      setContactLoading(false);
      return;
    }

    try {
      // Save to database
      const { error } = await supabase
        .from('contact_messages')
        .insert({
          name,
          email,
          phone,
          message,
        });
      if (error) throw new Error('Failed to send message');

      // Send email
      const response = await fetch('http://localhost:5000/api/send-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name,
          email,
          phone,
          message,
          type: 'contact'
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to send email');
      }

      setContactSuccess(t('contact.form.success'));
      setContactFormData({ name: '', email: '', phone: '', message: '' });
    } catch (err) {
      setContactError(err.message);
    } finally {
      setContactLoading(false);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.5,
      },
    },
  };

  return (
    <div className="py-20 bg-gray-50">
      {/* Breadcrumb + Page Header */}
      <div className="px-7 md:px-8 lg:px-14 xl:px-18 mb-16 mt-2">
        <nav className="mb-8">
          <ol className="flex items-center space-x-2 text-gray-500">
            <li><a href="/" className="hover:text-sky-600">{t('nav.home')}</a></li>
            <li>/</li>
            <li className="text-sky-600">{t('nav.contact')}</li>
          </ol>
        </nav>

        <div className="text-center max-w-3xl mx-auto">
          <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-5xl font-bold text-gray-800 mb-4"
          >
            {t('contact.title')}
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-lg text-gray-600"
          >
            {t('contact.subtitle')}
          </motion.p>
        </div>
      </div>

      <div className="container mx-auto px-4 space-y-16">
        {/* Contact Info */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 md:grid-cols-3 gap-8"
        >
          <motion.div variants={itemVariants} className="bg-white shadow-lg rounded-2xl p-6">
            <div className="flex items-start">
              <FaMapMarkerAlt className="w-6 h-6 text-sky-600 mr-4" />
              <div>
                <h3 className="text-lg font-semibold text-gray-800">{t('contact.addressTitle')}</h3>
                <p className="text-gray-600">Jijiga, Ethiopia</p>
              </div>
            </div>
          </motion.div>

          <motion.div variants={itemVariants} className="bg-white shadow-lg rounded-2xl p-6">
            <div className="flex items-start">
              <FaPhone className="w-6 h-6 text-sky-600 mr-4" />
              <div>
                <h3 className="text-lg font-semibold text-gray-800">{t('contact.phoneTitle')}</h3>
                <p className="text-gray-600">+251 25 278 2051</p>
              </div>
            </div>
          </motion.div>

          <motion.div variants={itemVariants} className="bg-white shadow-lg rounded-2xl p-6">
            <div className="flex items-start">
              <FaEnvelope className="w-6 h-6 text-sky-600 mr-4" />
              <div>
                <h3 className="text-lg font-semibold text-gray-800">{t('contact.emailTitle')}</h3>
                <p className="text-gray-600">info@dradmikewcenter.com</p>
              </div>
            </div>
          </motion.div>
        </motion.div>

        {/* Book Appointment */}
        <motion.div
          variants={itemVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="bg-white shadow-lg rounded-2xl p-8 grid md:grid-cols-2 gap-10"
        >
          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-gray-800">Book Appointment</h2>
            <p className="text-gray-600">
              Need a consultation or follow-up? Fill in the details and our team will get in touch with you to confirm your appointment.
            </p>
            <p className="text-gray-600 text-sm italic">
              Fields marked with * are required.
            </p>
            {error && <p className="text-red-500">{error}</p>}
          </div>

          <form onSubmit={handleAppointmentSubmit} className="space-y-6">
            <div className="flex space-x-4">
              <button
                type="button"
                className={`px-4 py-2 rounded-full ${
                  formData.serviceType === 'appointment' ? 'bg-sky-600 text-white' : 'bg-gray-100'
                }`}
                onClick={() => setFormData(prev => ({ ...prev, serviceType: 'appointment', selectedServices: [] }))}
              >
                {t('booking.centerVisit')}
              </button>
              <button
                type="button"
                className={`px-4 py-2 rounded-full ${
                  formData.serviceType === 'home' ? 'bg-sky-600 text-white' : 'bg-gray-100'
                }`}
                onClick={() => setFormData(prev => ({ ...prev, serviceType: 'home', selectedServices: [] }))}
              >
                {t('booking.homeService')}
              </button>
            </div>

            {formData.serviceType === 'home' && (
              <div className="bg-amber-50 border-l-4 border-amber-400 p-4 mb-6 rounded-r-lg flex items-start space-x-3">
                <FaExclamationTriangle className="text-amber-400 text-xl flex-shrink-0 mt-1" />
                <div>
                  <h3 className="font-medium text-amber-800">Location Restriction</h3>
                  <p className="text-amber-700 mt-1">
                    {t('booking.homeServiceWarning')}
                  </p>
                </div>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {t('contact.form.name')}*
                </label>
                <input
                  type="text"
                  value={formData.fullName}
                  onChange={(e) => setFormData(prev => ({ ...prev, fullName: e.target.value }))}
                  className="w-full p-2 border rounded-lg"
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
                    className="w-full p-2 border rounded-lg"
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
                  className="w-full p-2 border rounded-lg"
                  required
                />
              </div>
              <div>
                <label htmlFor="sex" className="block text-sm font-medium text-gray-700">
                  {t('booking.sex')}*
                </label>
                <select
                  id="sex"
                  className="mt-1 block w-full px-4 py-[10px] border border-gray-300 rounded-lg focus:ring-sky-500 focus:border-sky-500"
                  value={formData.sex}
                  onChange={(e) => setFormData(prev => ({ ...prev, sex: e.target.value }))}
                  required
                >
                  <option value="">{t('booking.selectSex')}</option>
                  <option value="Male">{t('booking.male')}</option>
                  <option value="Female">{t('booking.female')}</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
                  {t('booking.phone')}*
                </label>
                <input
                  type="tel"
                  id="phone"
                  className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-sky-500 focus:border-sky-500"
                  placeholder="09XXXXXXXX"
                  value={formData.phone}
                  onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                  required
                />
              </div>
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                  {t('booking.email')}*
                </label>
                <input
                  type="email"
                  id="email"
                  className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-sky-500 focus:border-sky-500"
                  placeholder="example@gmail.com"
                  value={formData.email}
                  onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {t('booking.date')}*
                </label>
                <input
                  type="date"
                  value={formData.appointmentDate}
                  onChange={(e) => setFormData(prev => ({ ...prev, appointmentDate: e.target.value }))}
                  min={new Date().toISOString().split('T')[0]}
                  className="w-full p-2 border rounded-lg"
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
                  className="w-full p-2 border rounded-lg"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {t('booking.selectDepartment')}*
              </label>
              <select
                value={formData.selectedDepartment}
                onChange={(e) => setFormData(prev => ({ ...prev, selectedDepartment: e.target.value }))}
                className="w-full p-2 border rounded-lg"
                required
              >
                <option value="">{t('booking.selectDepartmentPlaceholder')}</option>
                {departments.map(dept => (
                  <option key={dept.id} value={dept.id}>
                    {dept.name}
                  </option>
                ))}
              </select>
            </div>

            {formData.serviceType === 'home' && (
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {t('booking.location')}*
                  </label>
                  <input
                    type="text"
                    value={formData.location}
                    disabled
                    className="w-full p-2 border rounded-lg bg-gray-50"
                  />
                  <p className="mt-1 text-sm text-red-500">
                    {t('booking.services.locationNote')}
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {t('booking.services.homeServices')}*
                  </label>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {homeServices.map(service => (
                      <label
                        key={service.id}
                        className="flex items-center space-x-3 p-3 border rounded-lg cursor-pointer hover:bg-gray-50"
                      >
                        <input
                          type="checkbox"
                          checked={formData.selectedServices.some(s => s.id === service.id)}
                          onChange={() => handleHomeServiceToggle(service)}
                          className="w-4 h-4 text-sky-600 rounded focus:ring-sky-500"
                        />
                        <span className="text-gray-700">
                          {service.name}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Display text area when "Other" is selected */}
                {isOtherSelected && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {t('booking.services.home.others')}
                  </label>
                  <textarea
                      value={formData.otherServicesText}
                      onChange={(e) => setFormData(prev => ({ ...prev, otherServicesText: e.target.value }))}
                    placeholder={t('booking.services.home.othersPlaceholder')}
                      className="w-full p-3 border rounded-lg min-h-[100px] resize-y focus:ring-sky-500 focus:border-sky-500"
                  />
                </div>
                )}
              </div>
            )}

            {formData.serviceType === 'appointment' && (
              <div className="space-y-4">
                <h3 className="font-semibold">{t('booking.selectServices')}</h3>
                <div className="flex flex-wrap gap-3">
                  {['laboratory', 'x-ray', 'ultrasound'].map(type => (
                    <button
                      key={type}
                      type="button"
                      onClick={() => handleServiceSelection(type)}
                      className="px-4 py-2 border rounded-lg hover:bg-sky-50"
                    >
                      {t(`booking.services.${type}`)}
                    </button>
                  ))}
                </div>
              </div>
            )}

                <div className="flex flex-wrap gap-2">
                  {formData.selectedServices.map(service => (
                <div
                  key={service.id}
                  className="relative bg-sky-100 text-sky-600 px-2 py-0.5 rounded text-xs pr-5"
                >
                  {service.name}
                  <button
                    type="button"
                    onClick={() => handleRemoveService(service.code)}
                    className="absolute top-0 right-0 p-1 text-red-500 hover:text-red-700"
                  >
                    <AiOutlineClose size={10} />
                  </button>
                </div>
              ))}
              </div>

            <div>
              <button
                type="submit"
                disabled={loading}
                className={`w-full flex items-center justify-center px-6 py-3 bg-sky-600 text-white rounded-lg font-semibold hover:bg-sky-700 transition-colors duration-300 ${
                  loading ? 'opacity-50 cursor-not-allowed' : ''
                }`}
              >
                <FaPaperPlane className="mr-2" />
                {loading ? t('booking.submitting') : t('booking.submit')}
              </button>
            </div>
          </form>
        </motion.div>

        {/* Contact Form */}
        <motion.div
          variants={itemVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="bg-white shadow-lg rounded-2xl p-8 grid md:grid-cols-2 gap-10"
        >
          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-gray-800">{t('contact.form.title')}</h2>
            <p className="text-gray-600">{t('contact.form.description')}</p>
            <p className="text-gray-600 text-sm italic">{t('contact.form.required')}</p>
            <div className="pt-4">
              <h3 className="text-md font-semibold text-gray-700">{t('contact.form.stayConnected')}</h3>
            </div>
          </div>

          <form onSubmit={handleContactSubmit} className="space-y-6">
            {contactSuccess && (
              <div className="bg-green-50 border-l-4 border-green-400 p-4 mb-6 rounded-r-lg">
                <p className="text-green-700">{contactSuccess}</p>
              </div>
            )}
            {contactError && (
              <div className="bg-red-50 border-l-4 border-red-400 p-4 mb-6 rounded-r-lg">
                <p className="text-red-700">{contactError}</p>
              </div>
            )}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                  {t('contact.form.name')}*
                </label>
                <input
                  type="text"
                  id="name"
                  value={contactFormData.name}
                  onChange={(e) =>
                    setContactFormData(prev => ({ ...prev, name: e.target.value }))
                  }
                  className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-sky-500 focus:border-sky-500"
                  required
                />
              </div>
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                  {t('contact.form.email')}*
                </label>
                <input
                  type="email"
                  id="email"
                  value={contactFormData.email}
                  onChange={(e) =>
                    setContactFormData(prev => ({ ...prev, email: e.target.value }))
                  }
                  className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-sky-500 focus:border-sky-500"
                  required
                />
              </div>
            </div>
            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
                {t('contact.form.phone')}*
              </label>
              <input
                type="tel"
                id="phone"
                value={contactFormData.phone}
                onChange={(e) =>
                  setContactFormData(prev => ({ ...prev, phone: e.target.value }))
                }
                className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-sky-500 focus:border-sky-500"
                required
              />
            </div>
            <div>
              <label htmlFor="message" className="block text-sm font-medium text-gray-700">
                {t('contact.form.message')}*
              </label>
              <textarea
                id="message"
                rows="4"
                value={contactFormData.message}
                onChange={(e) =>
                  setContactFormData(prev => ({ ...prev, message: e.target.value }))
                }
                className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-sky-500 focus:border-sky-500"
                required
              />
            </div>
            <div>
              <button
                type="submit"
                disabled={contactLoading}
                className={`w-full flex items-center justify-center px-6 py-3 bg-sky-600 text-white rounded-lg font-semibold hover:bg-sky-700 transition-colors duration-300 ${
                  contactLoading ? 'opacity-50 cursor-not-allowed' : ''
                }`}
              >
                <FaPaperPlane className="mr-2" />
                {contactLoading ? t('contact.form.submitting') : t('contact.form.submit')}
              </button>
            </div>
          </form>
        </motion.div>

        {/* Map Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          viewport={{ once: true }}
          className="bg-white rounded-2xl shadow-lg overflow-hidden"
        >
          <iframe
            title="Location Map"
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3940.123456789012!2d42.79835810951355!3d9.361711723106156!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zOcKwMjEnNDIuMiJOIDQywrDQ3JzU0LjEiRQ!5e0!3m2!1sen!2set!4v1234567890123"
            width="100%"
            height="500"
            style={{ border: 0 }}
            allowFullScreen=""
            loading="lazy"
          />
        </motion.div>
      </div>

      <ServiceSelectionModal
        isOpen={isServiceModalOpen}
        onClose={() => setIsServiceModalOpen(false)}
        type={currentServiceType}
        selectedServices={formData.selectedServices}
        onSelect={(services) => {
          // Merge the new services with existing ones, avoiding duplicates by code
          const existingCodes = formData.selectedServices.map(s => s.code);
          const newServices = services.filter(s => !existingCodes.includes(s.code));
          
          setFormData(prev => ({
            ...prev,
            selectedServices: [...prev.selectedServices, ...newServices],
          }));
        }}
      />
    </div>
  );
};

export default Contact;