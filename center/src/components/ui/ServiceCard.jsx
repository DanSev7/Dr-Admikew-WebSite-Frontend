import React from 'react';
import { Link } from 'react-router-dom';
import { FaArrowRight } from 'react-icons/fa';

const ServiceCard = ({ service, t }) => {
  return (
    <Link to={`/services/${service.key}`}>
      <div className="group bg-gray-50 rounded-lg overflow-hidden hover:shadow-lg transition-shadow duration-300">
        <div className="relative h-48 overflow-hidden">
          <img
            src={service.image}
            alt={t(`services.items.${service.key}.title`)}
            className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-300"
          />
          <div className="absolute inset-0 bg-sky-600/20 group-hover:bg-sky-600/30 transition-colors duration-300" />
        </div>
        <div className="p-6">
          <div className="text-sky-600 mb-3">{service.icon}</div>
          <h3 className="text-xl font-semibold text-gray-800 mb-2">
            {t(`services.items.${service.key}.title`)}
          </h3>
          <p className="text-gray-600 mb-4">
            {t(`services.items.${service.key}.description`)}
          </p>
          <div className="flex items-center text-sky-600 font-medium text-sm">
            <span>Learn more</span>
            <FaArrowRight className="ml-2 transition-transform group-hover:translate-x-1" />
          </div>
        </div>
      </div>
    </Link>
  );
};

export default ServiceCard; 