/* eslint-disable no-unused-vars */
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { FaMapMarkerAlt, FaPhone, FaEnvelope, FaPaperPlane } from 'react-icons/fa';
import { motion } from 'framer-motion';
import { createClient } from '@supabase/supabase-js';

// Initialize Supabase client
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const Contact = () => {
  const { t } = useTranslation();
  const [contactFormData, setContactFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: '',
  });
  const [contactLoading, setContactLoading] = useState(false);
  const [contactError, setContactError] = useState('');
  const [contactSuccess, setContactSuccess] = useState('');

  const handleContactSubmit = async (e) => {
    e.preventDefault();
    setContactLoading(true);
    setContactError('');
    setContactSuccess('');

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
      const { error } = await supabase
        .from('contact_messages')
        .insert({
          name,
          email,
          phone,
          message,
        });
      if (error) throw new Error('Failed to send message');

      const response = await fetch(`${API_URL}/api/send-email`, {
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
                <p className="text-gray-600">info@anbesg.com</p>
              </div>
            </div>
          </motion.div>
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
    </div>
  );
};

export default Contact;