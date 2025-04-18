import React from 'react';
import { FaPhone, FaAmbulance, FaClock } from 'react-icons/fa';

const EmergencyContact = () => {
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
                <h3 className="text-xl font-semibold">Emergency Contact</h3>
                <p className="text-sky-100">+251 25 278 2051</p>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <div className="bg-white p-3 rounded-full">
                <FaAmbulance className="w-6 h-6 text-sky-600" />
              </div>
              <div>
                <h3 className="text-xl font-semibold">Ambulance Service</h3>
                <p className="text-sky-100">24/7 Available</p>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <div className="bg-white p-3 rounded-full">
                <FaClock className="w-6 h-6 text-sky-600" />
              </div>
              <div>
                <h3 className="text-xl font-semibold">Working Hours</h3>
                <p className="text-sky-100">Open 24 Hours</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default EmergencyContact;
