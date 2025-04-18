import { useParams, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useTranslation } from 'react-i18next';


const serviceAreas = [
  { id: "icu", name: "ICU", image: "https://images.unsplash.com/photo-1576091160501-bbe57469278b?q=80&w=500&auto=format&fit=crop", description: "The ICU provides critical care and life support." },
  { id: "radiology", name: "Radiology Unit", image: "https://images.unsplash.com/photo-1551601651-2a8555f1a136?q=80&w=500&auto=format&fit=crop", description: "Advanced imaging for diagnostics and treatment." },
  { id: "emergency", name: "Emergency Unit", image: "https://images.unsplash.com/photo-1597764698832-2e04b9c9cf92?q=80&w=500&auto=format&fit=crop", description: "24/7 emergency care and trauma support." },
  { id: "laboratory", name: "Laboratory Unit", image: "https://images.unsplash.com/photo-1581595220162-6cf0ef55c3a5?q=80&w=500&auto=format&fit=crop", description: "Fast and accurate medical testing services." },
  { id: "digital-xray", name: "Digital X-ray Unit", image: "https://images.unsplash.com/photo-1615461066841-61194e5aabe2?q=80&w=500&auto=format&fit=crop", description: "High-quality digital X-rays for precise diagnosis." },
  { id: "outpatient", name: "OutPatient Unit", image: "https://images.unsplash.com/photo-1615461066841-61194e5aabe2?q=80&w=500&auto=format&fit=crop", description: "Comprehensive outpatient consultation and treatment." },
  { id: "inpatient", name: "Inpatient Unit", image: "https://images.unsplash.com/photo-1582720875271-190ff5a52a21?q=80&w=500&auto=format&fit=crop", description: "Comfortable inpatient facilities for extended care." },
  { id: "operation-theater", name: "Major & Minor Operation Theater", image: "https://images.unsplash.com/photo-1550831107-1553da8c8464?q=80&w=500&auto=format&fit=crop", description: "State-of-the-art operation theaters for surgeries." }
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
        <img src={service.image} alt={service.name} className="w-full h-64 object-cover rounded-lg shadow-lg" />
        <h1 className="text-3xl font-bold text-gray-800 mt-6">{service.name}</h1>
        <p className="text-gray-600 mt-4">{service.description}</p>
      </motion.div>
    </div>
  );
};

export default ServiceAreaDetailPage;
