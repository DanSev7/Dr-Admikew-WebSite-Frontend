import { useParams, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useTranslation } from 'react-i18next';

// Import images
import icuImage from '../assets/images/ICU.jpeg';
import emergencyImage from '../assets/images/emergency.jpg';
import xrayImage from '../assets/images/x_ray Image.avif';
import usImage from '../assets/images/us.jpg';
import orImage from '../assets/images/or.avif';

// Laboratory images
import chemistryImage from '../assets/images/laboratory/chemistry.avif';
import centrifugeImage from '../assets/images/laboratory/centrifuge.jpg';
import cbcImage from '../assets/images/laboratory/cbc.jpg';
import hormoneImage from '../assets/images/laboratory/hormone.png';

// OPD image
import opdImage from '../assets/images/opd/OPD.png';
import ecgImage from '../assets/images/opd/ecg.jpg';

// IPD images
import bed1Image from '../assets/images/ipd/bed1.jpg';
import bed2Image from '../assets/images/ipd/bed2.jpg';
import bed3Image from '../assets/images/ipd/bed3.jpg';

const serviceAreas = [
  { 
    id: "icu", 
    name: "ICU", 
    image: icuImage, 
    description: "The ICU provides critical care and life support.",
    additionalImages: [
      { name: "ICU room", image: bed3Image }
    ]
  },
  { 
    id: "radiology", 
    name: "Radiology Unit", 
    image: usImage, 
    description: "Advanced imaging for diagnostics and treatment." 
  },
  { 
    id: "emergency", 
    name: "Emergency Unit", 
    image: emergencyImage, 
    description: "24/7 emergency care and trauma support." 
  },
  { 
    id: "laboratory", 
    name: "Laboratory Unit", 
    image: chemistryImage, 
    description: "Fast and accurate medical testing services.",
    additionalImages: [
      { name: "Chemistry", image: chemistryImage },
      { name: "Centrifuge", image: centrifugeImage },
      { name: "CBC", image: cbcImage },
      { name: "Hormone", image: hormoneImage }
    ]
  },
  { 
    id: "digital-xray", 
    name: "Digital X-ray Unit", 
    image: xrayImage, 
    description: "High-quality digital X-rays for precise diagnosis." 
  },
  { 
    id: "outpatient", 
    name: "OutPatient Unit", 
    image: opdImage, 
    description: "Comprehensive outpatient consultation and treatment.",
    additionalImages: [
      { name: "ECG", image: ecgImage },
      { name: "OPD", image: opdImage }
    ]
  },
  { 
    id: "inpatient", 
    name: "Inpatient Unit", 
    image: bed1Image, 
    description: "Comfortable inpatient facilities for extended care.",
    additionalImages: [
      { name: "Ward Bed", image: bed1Image },
      { name: "Ward Bed", image: bed2Image },
      { name: "ICU Bed", image: bed3Image }
    ]
  },
  { 
    id: "operation-theater", 
    name: "Major & Minor Operation Theater", 
    image: orImage, 
    description: "State-of-the-art operation theaters for surgeries." 
  }
];

const ServiceAreaDetailPage = () => {
    const { serviceId } = useParams();
    const [service, setService] = useState(null);
    const { t } = useTranslation();
    const serviceTitle = t(`services.areas.${serviceId}.title`);

  useEffect(() => {
    const selectedService = serviceAreas.find(area => area.id === serviceId);
    setService(selectedService);
  }, [serviceId]);

  if (!service) {
    return <p className="text-center text-gray-600">Service not found!</p>;
  }

  return (
    <div className="container mx-auto px-4 py-24">
        <div className="px-7 md:px-8 lg:px-14 xl:px-18 mb-16">
            <nav className="mb-8">
                <ol className="flex items-center space-x-2 text-gray-500">
                    <li><Link to="/" className="hover:text-sky-600">{t('nav.home')}</Link></li>
                    <li>/</li>
                    <li><Link to="/services" className="hover:text-sky-600">{t('nav.services')}</Link></li>
                    <li>/</li>
                    <li className="text-sky-600">{serviceTitle}</li>
                </ol>
            </nav>
        </div>
      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-3xl mx-auto text-center"
      >
        <img src={service.image} alt={service.name} className="w-full h-[550px] object-cover rounded-lg shadow-lg p-2" />
        <h1 className="text-3xl font-bold text-gray-800 mt-6">{service.name}</h1>
        <p className="text-gray-600 mt-4">{service.description}</p>
      </motion.div>

      {/* Additional Images Section */}
      {service.additionalImages && service.additionalImages.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mt-12"
        >
          <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">Facility Images</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {service.additionalImages.map((item, index) => (
              <div key={index} className="bg-white rounded-lg overflow-hidden shadow-lg">
                <img 
                  src={item.image} 
                  alt={item.name} 
                  className="w-full h-48 object-cover"
                />
                <div className="p-4">
                  <h3 className="text-lg font-semibold text-gray-800">{item.name}</h3>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default ServiceAreaDetailPage;
