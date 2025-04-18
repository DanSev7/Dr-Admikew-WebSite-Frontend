import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { FaArrowLeft, FaCalendarAlt, FaArrowRight, FaExpand } from 'react-icons/fa';

const ServiceDetail = () => {
  const { serviceId } = useParams();
  const { t } = useTranslation();
  const [selectedImage, setSelectedImage] = useState(null);

  // Get service details from translation
  const serviceTitle = t(`services.items.${serviceId}.title`);
  const serviceDescription = t(`services.items.${serviceId}.description`);
  const procedures = t(`services.items.${serviceId}.procedures`, { returnObjects: true });

  // Define related services based on categories
  const getRelatedServices = () => {
    const serviceCategories = {
      cardio: ["neuro", "general"],
      neuro: ["cardio", "maxillofacial"],
      maxillofacial: ["plastic", "ophthalmology"],
      plastic: ["maxillofacial", "general"],
      pediatric: ["general", "ophthalmology"],
      urological: ["general", "pediatric"],
      general: ["urological", "plastic"],
      ophthalmology: ["maxillofacial", "pediatric"]
    };

    return serviceCategories[serviceId] || [];
  };

  // Get gallery images for the service
  // const getServiceGallery = () => {
  //   const galleries = {
  //     cardio: [
  //       {
  //         thumb: "https://images.unsplash.com/photo-1579154204601-01588f351e67?w=200&q=80",
  //         full: "https://images.unsplash.com/photo-1579154204601-01588f351e67?w=1080&q=100",
  //         alt: "Cardio Surgery Room"
  //       },
  //       {
  //         thumb: "https://images.unsplash.com/photo-1631815587646-b85a1bb027e1?w=200&q=80",
  //         full: "https://images.unsplash.com/photo-1631815587646-b85a1bb027e1?w=1080&q=100",
  //         alt: "Heart Monitoring Equipment"
  //       },
  //       // Add more images for cardio
  //     ],
  //     neuro: [
  //       // Add neurosurgery images
  //     ],
  //     // Add other service galleries
  //   };

  //   return galleries[serviceId] || [];
  // };

  return (
    <div className="py-20 bg-gray-50">
      {/* Breadcrumb */}
      <div className="px-7 md:px-8 lg:px-14 xl:px-18 mb-16 mt-2">
        <nav className="mb-8">
          <ol className="flex items-center space-x-2 text-gray-500">
            <li><Link to="/" className="hover:text-sky-600">{t('nav.home')}</Link></li>
            <li>/</li>
            <li><Link to="/services" className="hover:text-sky-600">{t('nav.services')}</Link></li>
            <li>/</li>
            <li className="text-sky-600">{serviceTitle}</li>
          </ol>
        </nav>

        {/* Back Button */}
        <Link 
          to="/services"
          className="inline-flex items-center text-sky-600 hover:text-sky-700 mb-8"
        >
          <FaArrowLeft className="mr-2" />
          {t('services.common.backToServices')}
        </Link>

        {/* Service Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-lg shadow-lg p-8 mb-8"
            >
              <h1 className="text-3xl font-bold mb-4">{serviceTitle}</h1>
              <p className="text-gray-600 mb-6">{serviceDescription}</p>

              {/* Photo Gallery Section */}
              {/* <div className="mt-8">
                <h2 className="text-2xl font-bold mb-6">{t('services.gallery.title')}</h2>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {getServiceGallery().map((image, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: index * 0.1 }}
                      className="relative group cursor-pointer"
                      onClick={() => setSelectedImage(image)}
                    >
                      <div className="aspect-w-16 aspect-h-9 rounded-lg overflow-hidden">
                        <img
                          src={image.thumb}
                          alt={image.alt}
                          className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-300"
                        />
                      </div>
                      <div className="absolute inset-0 bg-sky-600/0 group-hover:bg-sky-600/20 transition-colors duration-300 flex items-center justify-center">
                        <FaExpand className="text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div> */}

              {/* Interactive Procedures Section */}
              <div className="mt-8">
                <h2 className="text-2xl font-bold mb-6">{t('services.common.procedures')}</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {procedures.map((procedure, index) => (
                    <motion.div 
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="flex items-start p-4 bg-sky-50 rounded-lg hover:bg-sky-100 transition-colors cursor-pointer"
                    >
                      <span className="w-2 h-2 bg-sky-600 rounded-full mt-2 mr-3"></span>
                      <div>
                        <h3 className="font-semibold text-lg">{procedure}</h3>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* Related Services Section */}
              <div className="mt-12">
                <h2 className="text-2xl font-bold mb-6">{t('services.common.relatedServices')}</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {getRelatedServices().map((relatedService, index) => (
                    <Link 
                      key={index}
                      to={`/services/${relatedService}`}
                      className="group"
                    >
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="flex items-center p-4 bg-white border border-gray-200 rounded-lg hover:border-sky-500 transition-all group-hover:shadow-md"
                      >
                        <div className="flex-1">
                          <h3 className="font-semibold text-lg group-hover:text-sky-600 transition-colors">
                            {t(`services.items.${relatedService}.title`)}
                          </h3>
                          <p className="text-gray-600 text-sm mt-1">
                            {t(`services.items.${relatedService}.description`)}
                          </p>
                        </div>
                        <FaArrowRight className="text-gray-400 group-hover:text-sky-600 transform group-hover:translate-x-1 transition-all" />
                      </motion.div>
                    </Link>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-white rounded-lg shadow-lg p-6 mb-8"
            >
              <h3 className="text-xl font-bold mb-4">{t('services.common.bookAppointment')}</h3>
              <button 
                onClick={() => window.location.href='/contact'}
                className="w-full bg-sky-600 text-white px-6 py-3 rounded-lg flex items-center justify-center hover:bg-sky-700 transition-colors"
              >
                <FaCalendarAlt className="mr-2" />
                {t('services.common.scheduleConsultation')}
              </button>
            </motion.div>

            {/* New FAQ Section */}
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white rounded-lg shadow-lg p-6 mt-8"
            >
              <h3 className="text-xl font-bold mb-4">{t('services.faq.title')}</h3>
              <div className="space-y-4">
                {t(`services.items.${serviceId}.faq`, { returnObjects: true, defaultValue: [] }).length > 0 ? (
                  t(`services.items.${serviceId}.faq`, { returnObjects: true }).map((faq, index) => (
                    <div key={index} className="border-b border-gray-200 pb-4">
                      <h4 className="font-semibold text-lg mb-2">{faq.question}</h4>
                      <p className="text-gray-600">{faq.answer}</p>
                    </div>
                  ))
                ) : (
                  <p className="text-gray-500">{t('services.faq.noQuestions')}</p>
                )}
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Image Modal */}
      {selectedImage && (
        <div
          className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4"
          onClick={() => setSelectedImage(null)}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="relative max-w-4xl w-full"
          >
            <img
              src={selectedImage.full}
              alt={selectedImage.alt}
              className="w-full h-auto rounded-lg"
            />
            <button
              className="absolute top-4 right-4 text-white hover:text-sky-400 transition-colors"
              onClick={() => setSelectedImage(null)}
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            <p className="text-white text-center mt-4">{selectedImage.alt}</p>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default ServiceDetail; 