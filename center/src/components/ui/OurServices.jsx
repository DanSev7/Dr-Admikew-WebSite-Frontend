import React from 'react';
import { Link } from 'react-router-dom';
import { FaHeartbeat, FaBrain, FaUserMd, FaChild, FaCut, FaStethoscope, FaArrowRight } from 'react-icons/fa';
import { useTranslation } from 'react-i18next';

const OurServices = () => {
  const { t } = useTranslation();

  const services = [
    {
      icon: <FaHeartbeat className="w-8 h-8" />,
      key: "cardio",
      image: "https://images.unsplash.com/photo-1631815589968-fdb09a223b1e?q=80&w=500&auto=format&fit=crop",
    },
    {
      icon: <FaBrain className="w-8 h-8" />,
      key: "neuro",
      image: "https://images.unsplash.com/photo-1579154204601-01588f351e67?q=80&w=500&auto=format&fit=crop",
    },
    {
      icon: <FaCut className="w-8 h-8" />,
      key: "plastic",
      image: "https://images.unsplash.com/photo-1551601651-2a8555f1a136?q=80&w=500&auto=format&fit=crop",
    },
    {
      icon: <FaChild className="w-8 h-8" />,
      key: "pediatric",
      image: "https://images.unsplash.com/photo-1581056771107-24ca5f033842?q=80&w=500&auto=format&fit=crop",
    },
    {
      icon: <FaStethoscope className="w-8 h-8" />,
      key: "urological",
      image: "https://images.unsplash.com/photo-1518152006812-edab29b069ac?q=80&w=500&auto=format&fit=crop",
    },
    {
      icon: <FaUserMd className="w-8 h-8" />,
      key: "general",
      image: "https://images.unsplash.com/photo-1571772996211-2f02c9727629?q=80&w=500&auto=format&fit=crop",
    },
  ];

  return (
    <section className="py-16 bg-white ml-10 mr-10">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between mb-12">
          <div>
            <h2 className="text-3xl font-bold text-gray-800 mb-2">
              {t('services.title')}
            </h2>
            <p className="text-gray-600">
              {t('services.subtitle')}
            </p>
          </div>
          <Link
            to="/services"
            className="hidden md:flex items-center text-sky-600 hover:text-sky-700 transition-colors"
          >
            {t('services.viewAll')} <FaArrowRight className="ml-2" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <Link 
              to={`/services/${service.key}`} // Navigate to service details page
              key={index}
              className="group bg-gray-50 rounded-lg overflow-hidden hover:shadow-lg transition-shadow duration-300"
            >
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
                <p className="text-gray-600">
                  {t(`services.items.${service.key}.description`)}
                </p>
              </div>
            </Link>
          ))}
        </div>

        <Link
          to="/services"
          className="mt-8 flex md:hidden items-center justify-center text-sky-600 hover:text-sky-700 transition-colors"
        >
          {t('services.viewAll')} <FaArrowRight className="ml-2" />
        </Link>
      </div>
    </section>
  );
};

export default OurServices;