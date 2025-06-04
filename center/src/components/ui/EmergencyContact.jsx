import React from 'react';
import { FaPhone, FaAmbulance, FaClock } from 'react-icons/fa';
import { useTranslation } from 'react-i18next';

const EmergencyContact = () => {
  const { t } = useTranslation();

  return (
    <section className="bg-sky-600 text-white py-12">
      <div className="container mx-auto">
        <div className="flex justify-center">
          <div className="grid md:grid-cols-3 gap-8 items-start w-full max-w-7xl ml-12">
            <div className="flex items-center space-x-4">
              <div className="bg-white p-3 rounded-full">
                <FaPhone className="w-6 h-6 text-sky-600" />
              </div>
              <div>
                <h3 className="text-xl font-semibold">{t('emergency.contact.title')}</h3>
                <p className="text-sky-100">{t('emergency.contact.number')}</p>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <div className="bg-white p-3 rounded-full">
                <FaAmbulance className="w-6 h-6 text-sky-600" />
              </div>
              <div>
                <h3 className="text-xl font-semibold">{t('emergency.ambulance.title')}</h3>
                <p className="text-sky-100">{t('emergency.ambulance.availability')}</p>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <div className="bg-white p-3 rounded-full">
                <FaClock className="w-6 h-6 text-sky-600" />
              </div>
              <div>
                <h3 className="text-xl font-semibold">{t('emergency.hours.title')}</h3>
                <p className="text-sky-100">{t('emergency.hours.availability')}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default EmergencyContact;
