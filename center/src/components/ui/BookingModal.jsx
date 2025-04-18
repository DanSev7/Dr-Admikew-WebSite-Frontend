import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { FaTimes } from 'react-icons/fa';
import ServiceSelectionModal from './ServiceSelectionModal';

const BookingModal = ({ isOpen, onClose }) => {
  const { t } = useTranslation();
  const [bookingType, setBookingType] = useState('appointment'); // or 'home'
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedDoctor, setSelectedDoctor] = useState('');
  const [selectedServices, setSelectedServices] = useState([]);
  const [isServiceModalOpen, setIsServiceModalOpen] = useState(false);
  const [serviceType, setServiceType] = useState('');

  const handleServiceSelection = (type) => {
    setServiceType(type);
    setIsServiceModalOpen(true);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
      <div className="bg-white rounded-lg w-full max-w-2xl p-6 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
        >
          <FaTimes />
        </button>

        <h2 className="text-2xl font-bold mb-6">{t('booking.title')}</h2>

        {/* Booking Type Selection */}
        <div className="mb-6">
          <div className="flex space-x-4">
            <button
              className={`px-4 py-2 rounded-full ${
                bookingType === 'appointment' ? 'bg-sky-600 text-white' : 'bg-gray-100'
              }`}
              onClick={() => setBookingType('appointment')}
            >
              {t('booking.appointment')}
            </button>
            <button
              className={`px-4 py-2 rounded-full ${
                bookingType === 'home' ? 'bg-sky-600 text-white' : 'bg-gray-100'
              }`}
              onClick={() => setBookingType('home')}
            >
              {t('booking.homeService')}
            </button>
          </div>
        </div>

        {/* Form Fields */}
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {t('booking.date')}
            </label>
            <input
              type="date"
              className="w-full border rounded-lg p-2"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              min={new Date().toISOString().split('T')[0]}
            />
          </div>

          {/* Doctor Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {t('booking.selectDoctor')}
            </label>
            <select
              className="w-full border rounded-lg p-2"
              value={selectedDoctor}
              onChange={(e) => setSelectedDoctor(e.target.value)}
            >
              <option value="">{t('booking.selectDoctorPlaceholder')}</option>
              {/* Add doctor options */}
            </select>
          </div>

          {/* Service Selection Buttons */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              {t('booking.selectServices')}
            </label>
            <div className="flex flex-wrap gap-2">
              {['laboratory', 'xray', 'ultrasound'].map((service) => (
                <button
                  key={service}
                  onClick={() => handleServiceSelection(service)}
                  className="px-4 py-2 bg-gray-100 rounded-full hover:bg-gray-200"
                >
                  {t(`booking.services.${service}`)}
                </button>
              ))}
            </div>
          </div>

          {/* Selected Services Display */}
          {selectedServices.length > 0 && (
            <div className="mt-4">
              <h3 className="text-sm font-medium text-gray-700 mb-2">
                {t('booking.selectedServices')}
              </h3>
              <div className="flex flex-wrap gap-2">
                {selectedServices.map((service) => (
                  <span
                    key={service.id}
                    className="px-3 py-1 bg-sky-100 text-sky-600 rounded-full text-sm"
                  >
                    {service.name}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Submit Button */}
        <button
          className="w-full mt-6 bg-sky-600 text-white py-2 rounded-lg hover:bg-sky-700"
          onClick={() => {
            // Handle booking submission
          }}
        >
          {t('booking.submit')}
        </button>
      </div>

      {/* Service Selection Modal */}
      <ServiceSelectionModal
        isOpen={isServiceModalOpen}
        onClose={() => setIsServiceModalOpen(false)}
        type={serviceType}
        onSelect={(services) => {
          setSelectedServices([...selectedServices, ...services]);
          setIsServiceModalOpen(false);
        }}
      />
    </div>
  );
};

export default BookingModal; 