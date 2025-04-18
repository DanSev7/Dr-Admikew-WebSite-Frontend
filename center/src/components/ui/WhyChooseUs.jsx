import React from 'react';
import { FaUserMd, FaHospital, FaAmbulance, FaClock } from 'react-icons/fa';
import { useTranslation } from 'react-i18next';

const WhyChooseUs = () => {
  const { t } = useTranslation();

  const features = [
    {
      icon: <FaUserMd className="text-5xl text-sky-600" />,
      title: t('whyChooseUs.features.expertise.title'), // Translated title
      description: t('whyChooseUs.features.expertise.description') // Translated description
    },
    {
      icon: <FaHospital className="text-5xl text-sky-600" />,
      title: t('whyChooseUs.features.technology.title'), // Translated title
      description: t('whyChooseUs.features.technology.description') // Translated description
    },
    {
      icon: <FaAmbulance className="text-5xl text-sky-600" />,
      title: t('whyChooseUs.features.support.title'), // Translated title
      description: t('whyChooseUs.features.support.description') // Translated description
    },
    {
      icon: <FaClock className="text-5xl text-sky-600" />,
      title: t('whyChooseUs.features.care.title'), // Translated title
      description: t('whyChooseUs.features.care.description') // Translated description
    }
  ];

  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-12">
          {t('whyChooseUs.title')} {/* Translated title */}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <div 
              key={index}
              className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300"
            >
              <div className="flex flex-col items-center text-center">
                {feature.icon}
                <h3 className="text-xl font-semibold mt-4 mb-2 text-gray-800">
                  {feature.title} {/* Translated title */}
                </h3>
                <p className="text-gray-600">
                  {feature.description} {/* Translated description */}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default WhyChooseUs;