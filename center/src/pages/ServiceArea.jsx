import React from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

// Import images
import icuImage from '../assets/images/ICU.jpeg';
import emergencyImage from '../assets/images/emergency.jpg';
import laboratoryImage from '../assets/images/laboratory/hormone.png';
import xrayImage from '../assets/images/x_ray Image.avif';
import usImage from '../assets/images/us.jpg';
import opdImage from '../assets/images/opd/OPD.png';
import ipdImage from '../assets/images/ipd/bed1.jpg';
import orImage from '../assets/images/or.avif';

const ServiceArea = () => {
  const { t } = useTranslation();

  const serviceAreas = [
    { 
      id: "icu", 
      name: "ICU", 
      image: icuImage, 
      description: "Intensive Care Unit providing critical care services",
      features: ["24/7 Monitoring", "Advanced Life Support", "Critical Care Specialists"]
    },
    { 
      id: "radiology", 
      name: "Radiology Unit", 
      image: usImage, 
      description: "Advanced imaging and diagnostic services",
      features: ["Digital Imaging", "Ultrasound"]
    },
    { 
      id: "emergency", 
      name: "Emergency Unit", 
      image: emergencyImage, 
      description: "24/7 emergency medical care",
      features: ["Rapid Response", "Trauma Care", "Emergency Surgery"]
    },
    { 
      id: "laboratory", 
      name: "Laboratory Unit", 
      image: laboratoryImage, 
      description: "Comprehensive diagnostic testing",
      features: ["Blood Tests", "Pathology", "Microbiology"]
    },
    { 
      id: "digital-xray", 
      name: "Digital X-ray Unit", 
      image: xrayImage, 
      description: "State-of-the-art digital imaging",
      features: ["Digital X-ray", "Low Radiation", "Quick Results"]
    },
    { 
      id: "outpatient", 
      name: "OutPatient Unit", 
      image: opdImage, 
      description: "Specialized outpatient care services",
      features: ["Consultations", "Follow-ups", "Day Care"]
    },
    { 
      id: "inpatient", 
      name: "Inpatient Unit", 
      image: ipdImage, 
      description: "Comfortable inpatient care facilities",
      features: ["Private Rooms", "Nursing Care", "Patient Monitoring"]
    },
    { 
      id: "operation-theater", 
      name: "Major & Minor Operation Theater", 
      image: orImage, 
      description: "Advanced surgical facilities",
      features: ["Modern Equipment", "Sterile Environment", "Expert Surgeons"]
    }
  ];

  return (
    <div className="py-20 bg-gray-50">
      {/* Hero Section with Breadcrumb */}
      <div className="px-7 md:px-8 lg:px-14 xl:px-18 mb-16 mt-2">
        <nav className="mb-8">
          <ol className="flex items-center space-x-2 text-gray-500 font-medium text-md">
            <li><Link to="/" className="hover:text-sky-600">{t('nav.home')}</Link></li>
            <li>/</li>
            <li><Link to="/services" className="hover:text-sky-600">{t('nav.services')}</Link></li>
            <li>/</li>
            <li className="text-sky-600">Service Areas</li>
          </ol>
        </nav>
        
        <div className="text-center max-w-3xl mx-auto">
          <motion.h1 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-5xl font-bold text-gray-800 mb-6"
          >
            Our Service Areas
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-xl text-gray-600"
          >
            Explore our state-of-the-art facilities and specialized units
          </motion.p>
        </div>
      </div>

      {/* Service Areas Grid */}
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {serviceAreas.map((area, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Link to={`/service-area/${area.id}`}>
                <div className="relative rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300 group">
                  <img 
                    src={area.image} 
                    alt={area.name} 
                    className="w-full h-48 object-cover transform group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-black/30 group-hover:bg-sky-600/40 transition-colors duration-300 flex flex-col items-center justify-center p-4">
                    <h3 className="text-white text-lg font-semibold mb-2">{area.name}</h3>
                    <p className="text-white/90 text-sm text-center mb-3">{area.description}</p>
                    <div className="flex flex-wrap justify-center gap-2">
                      {area.features.map((feature, idx) => (
                        <span key={idx} className="text-xs bg-white/20 text-white px-2 py-1 rounded-full">
                          {feature}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>

      {/* CTA Section */}
    
      <motion.div 
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ delay: 0.4 }}
  className="container mx-auto px-4 mt-16"
>
  <div className="bg-gradient-to-r from-sky-600 to-sky-700 text-white rounded-xl shadow-xl p-8 flex flex-col md:flex-row items-center justify-between text-center md:text-left">
    <div className="w-full md:w-2/3 mb-6 md:mb-0">
      <h2 className="text-3xl font-bold mb-4">{t('services.cta.title')}</h2>
      <p className="text-lg leading-relaxed">
        Book an appointment with our specialists today            
      </p>
    </div>
    <div className="w-full md:w-auto flex justify-center md:justify-end">
      <Link 
        to="/appointment"
        className="bg-sky-800 text-white px-6 py-3 rounded-full font-semibold hover:bg-sky-900 transition-colors duration-300 shadow-md"
      >
        {t('services.cta.button')}
      </Link>
    </div>
  </div>
</motion.div>
    </div>
  );
};

export default ServiceArea;