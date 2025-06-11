import React from 'react';
import { Link } from 'react-router-dom';
import { FaHeartbeat, FaBrain, FaUserMd, FaChild, FaCut, FaStethoscope, FaArrowRight } from 'react-icons/fa';
import { useTranslation } from 'react-i18next';
import orthoImage from '../../assets/images/ortho.jpg';
import cardioImage from '../../assets/images/cardios.png';
import neuroImage from '../../assets/images/neuro.png';
// import maxilloImage from '../assets/images/maxillo.png';
import plasticImage from '../../assets/images/plastic.png';
import pediaImage from '../../assets/images/pedia.png';
import uroImage from '../../assets/images/uro.png';
import generalImage from '../../assets/images/general.png';

const OurServices = () => {
  const { t } = useTranslation();

  const services = [
    {
      icon: <FaHeartbeat className="w-8 h-8" />,
      key: "cardio",
      image: cardioImage,
    },
    {
      icon: <FaBrain className="w-8 h-8" />,
      key: "neuro",
      image: neuroImage,
    },
    {
      icon: <FaCut className="w-8 h-8" />,
      key: "plastic",
      image: plasticImage,
    },
    {
      icon: <FaChild className="w-8 h-8" />,
      key: "pediatric",
      image: pediaImage,
    },
    {
      icon: <FaStethoscope className="w-8 h-8" />,
      key: "urological",
      image: uroImage,
    },
    {
      icon: <FaUserMd className="w-8 h-8" />,
      key: "general",
      image: generalImage,
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
              <div className="relative h-[200px] overflow-hidden">
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