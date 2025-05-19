import { useParams, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useTranslation } from 'react-i18next';
import { FaArrowLeft, FaPhone, FaClock, FaMapMarkerAlt } from 'react-icons/fa';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import 'react-lazy-load-image-component/src/effects/blur.css';

// Import images (assuming these are already set up)
import icuImage from '../assets/images/ICU.jpeg';
import emergencyImage from '../assets/images/emergency.jpg';
import xrayImage from '../assets/images/x_ray Image.avif';
import usImage from '../assets/images/us.jpg';
import orImage from '../assets/images/or.avif';
import chemistryImage from '../assets/images/laboratory/chemistry.avif';
import centrifugeImage from '../assets/images/laboratory/centrifuge.jpg';
import cbcImage from '../assets/images/laboratory/cbc.jpg';
import hormoneImage from '../assets/images/laboratory/hormone.png';
import opdImage from '../assets/images/opd/OPD.png';
import ecgImage from '../assets/images/opd/ecg.jpg';
import bed1Image from '../assets/images/ipd/bed1.jpg';
import bed2Image from '../assets/images/ipd/bed2.jpg';
import bed3Image from '../assets/images/ipd/bed3.jpg';

const serviceAreas = [
  { 
    id: "icu", 
    name: "ICU", 
    image: icuImage, 
    description: "The ICU provides critical care and life support.",
    features: ["24/7 Monitoring", "Advanced Life Support", "Critical Care Specialists"],
    workingHours: "24/7",
    contact: "+251 25 278 2051",
    location: "Jigjiga, Somalia",
    additionalImages: [
      { name: "ICU room", image: bed3Image }
    ]
  },
  { 
    id: "radiology", 
    name: "Radiology Unit", 
    image: usImage, 
    description: "Advanced imaging for diagnostics and treatment.",
    features: ["Digital Imaging", "Ultrasound"],
    workingHours: "24/7",
    contact: "+251 25 278 2051",
    location: "Jigjiga, Somalia"
  },
  { 
    id: "emergency", 
    name: "Emergency Unit", 
    image: emergencyImage, 
    description: "24/7 emergency care and trauma support.",
    features: ["Rapid Response", "Trauma Care", "Emergency Surgery"],
    workingHours: "24/7",
    contact: "+251 25 278 2051",
    location: "Jigjiga, Somalia"
  },
  { 
    id: "laboratory", 
    name: "Laboratory Unit", 
    image: chemistryImage, 
    description: "Fast and accurate medical testing services.",
    features: ["Blood Tests", "Pathology", "Microbiology"],
    workingHours: "24/7",
    contact: "+251 25 278 2051",
    location: "Jigjiga, Somalia",
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
    description: "High-quality digital X-rays for precise diagnosis.",
    features: ["Digital X-ray", "Low Radiation", "Quick Results"],
    workingHours: "24/7",
    contact: "+251 25 278 2051",
    location: "Jigjiga, Somalia"
  },
  { 
    id: "outpatient", 
    name: "OutPatient Unit", 
    image: opdImage, 
    description: "Comprehensive outpatient consultation and treatment.",
    features: ["Consultations", "Follow-ups", "Day Care"],
    workingHours: "24/7",
    contact: "+251 25 278 2051",
    location: "Jigjiga, Somalia",
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
    features: ["Private Rooms", "Nursing Care", "Patient Monitoring"],
    workingHours: "24/7",
    contact: "+251 25 278 2051",
    location: "Jigjiga, Somalia",
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
    description: "State-of-the-art operation theaters for surgeries.",
    features: ["Modern Equipment", "Sterile Environment", "Expert Surgeons"],
    workingHours: "24/7",
    contact: "+251 25 278 2051",
    location: "Jigjiga, Somalia"
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
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center p-8 bg-white rounded-2xl shadow-xl"
        >
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Service Not Found</h2>
          <p className="text-gray-600 mb-8 text-lg">The requested service area could not be found.</p>
          <Link
            to="/service-areas"
            className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-sky-600 to-sky-700 text-white rounded-lg hover:from-sky-700 hover:to-sky-800 transition-all duration-300 shadow-md"
          >
            <FaArrowLeft className="mr-2" />
            Back to Service Areas
          </Link>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="py-20 bg-gray-50">
      {/* Breadcrumb Navigation */}
        <div className="px-7 md:px-8 lg:px-14 xl:px-18 mb-16 mt-2">
          <nav className="mb-8">
            <ol className="flex items-center space-x-2 text-gray-500">
              <Link to="/" className="hover:text-sky-600 transition-colors">{t('nav.home')}</Link>
              <span>/</span>
              <Link to="/services" className="hover:text-sky-600 transition-colors">{t('nav.services')}</Link>
              <span>/</span>
              <Link to="/service-areas" className="hover:text-sky-600 transition-colors">{t('nav.serviceArea')}</Link>
              <span>/</span>
              <span className="text-sky-600">{serviceTitle}</span>
            </ol>
          </nav>
        </div>

      <div className="container mx-auto px-8 py-16">
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="grid lg:grid-cols-2 gap-12 mb-16"
        >
          {/* Left Side - Image */}
          <div className="relative rounded-2xl overflow-hidden shadow-2xl">
            <LazyLoadImage
              src={service.image}
              alt={service.name}
              effect="blur"
              className="w-[620px] h-[500px] object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-sky-600/80 to-transparent flex items-end">
              <div className="p-8 text-white">
                <h1 className="text-4xl md:text-5xl font-bold mb-4 tracking-tight">{service.name}</h1>
                <p className="text-lg md:text-xl text-gray-100 leading-relaxed">{service.description}</p>
              </div>
            </div>
          </div>

          {/* Right Side - Info Cards */}
          <div className="space-y-6">
            {/* Features Card */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white rounded-2xl shadow-xl p-8 bg-gradient-to-br from-white to-gray-50"
            >
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Key Features</h2>
              <div className="space-y-4">
                {service.features.map((feature, index) => (
                  <div key={index} className="flex items-center space-x-3">
                    <div className="w-3 h-3 bg-sky-600 rounded-full"></div>
                    <span className="text-gray-700 text-lg font-medium">{feature}</span>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Contact Info Card */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-white rounded-2xl shadow-xl p-8 bg-gradient-to-br from-white to-gray-50"
            >
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Contact Information</h2>
              <div className="space-y-5">
                <div className="flex items-center space-x-4">
                  <FaPhone className="text-sky-600 text-xl" />
                  <span className="text-gray-700 text-lg font-medium">{service.contact}</span>
                </div>
                <div className="flex items-center space-x-4">
                  <FaClock className="text-sky-600 text-xl" />
                  <span className="text-gray-700 text-lg font-medium">{service.workingHours}</span>
                </div>
                <div className="flex items-center space-x-4">
                  <FaMapMarkerAlt className="text-sky-600 text-xl" />
                  <span className="text-gray-700 text-lg font-medium">{service.location}</span>
                </div>
              </div>
            </motion.div>
          </div>
        </motion.div>

        {/* Additional Images Section */}
        {service.additionalImages && service.additionalImages.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-white rounded-2xl shadow-xl p-8 bg-gradient-to-br from-white to-gray-50"
          >
            <h2 className="text-2xl font-bold text-gray-900 mb-8">Facility Gallery</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {service.additionalImages.map((item, index) => (
                <div key={index} className="group relative overflow-hidden rounded-xl shadow-md">
                  <LazyLoadImage
                    src={item.image}
                    alt={item.name}
                    effect="blur"
                    className="w-full h-64 object-cover transform group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-sky-500/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end">
                    <span className="text-white font-medium text-lg p-4">{item.name}</span>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default ServiceAreaDetailPage;