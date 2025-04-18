import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { FaHeartbeat, FaBrain, FaCut, FaChild, FaStethoscope, FaUserMd, FaTeeth, FaEye, FaSearch, FaArrowRight} from 'react-icons/fa';
import { GiKidneys } from 'react-icons/gi';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

const Services = () => {
  const { t } = useTranslation();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [filteredServices, setFilteredServices] = useState([]);

  const allServices = [
    {
      icon: <FaHeartbeat className="w-12 h-12" />,
      key: "cardio",
      category: "specialized",
      image: "https://images.unsplash.com/photo-1631815589968-fdb09a223b1e?q=80&w=500&auto=format&fit=crop",
    },
    {
      icon: <FaBrain className="w-12 h-12" />,
      key: "neuro",
      category: "specialized",
      image: "https://images.unsplash.com/photo-1579154204601-01588f351e67?q=80&w=500&auto=format&fit=crop",
    },
    {
      icon: <FaTeeth className="w-12 h-12" />,
      key: "maxillofacial",
      category: "surgical",
      image: "https://images.unsplash.com/photo-1609840114035-3c981b782dfe?q=80&w=500&auto=format&fit=crop",
    },
    {
      icon: <FaCut className="w-12 h-12" />,
      key: "plastic",
      category: "surgical",
      image: "https://images.unsplash.com/photo-1551601651-2a8555f1a136?q=80&w=500&auto=format&fit=crop",
    },
    {
      icon: <FaChild className="w-12 h-12" />,
      key: "pediatric",
      category: "specialized",
      image: "https://images.unsplash.com/photo-1581056771107-24ca5f033842?q=80&w=500&auto=format&fit=crop",
    },
    {
      icon: <GiKidneys className="w-12 h-12" />,
      key: "urological",
      category: "surgical",
      image: "https://images.unsplash.com/photo-1518152006812-edab29b069ac?q=80&w=500&auto=format&fit=crop",
    },
    {
      icon: <FaUserMd className="w-12 h-12" />,
      key: "general",
      category: "general",
      image: "https://images.unsplash.com/photo-1571772996211-2f02c9727629?q=80&w=500&auto=format&fit=crop",
    },
    {
      "icon": <FaEye className='w-12 h-12' />,
      "key": "ophthalmology",
      "category": "specialized",
      "image": "https://images.unsplash.com/photo-1602520076584-c4a14147a6b2?crop=entropy&cs=tinysrgb&fit=max&ixid=MnwzNjUyOXwwfDF8c2VhcmNofDJ8fG9waHRhbW9sb2d5fGVufDB8fHx8fDE2NzA1NjA1Mzk&ixlib=rb-1.2.1&q=80&w=500"
    }
    
  ];

  // Filter services based on search term and category
  useEffect(() => {
    const filtered = allServices.filter(service => {
      const matchesSearch = t(`services.items.${service.key}.title`).toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
        t(`services.items.${service.key}.description`).toLowerCase()
          .includes(searchTerm.toLowerCase());
      
      const matchesCategory = selectedCategory === 'all' || service.category === selectedCategory;
      
      return matchesSearch && matchesCategory;
    });
    setFilteredServices(filtered);
  }, [searchTerm, selectedCategory, t]);

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.5
      }
    }
  };

  return (
    <div className="py-20 bg-gray-50">
      {/* Hero Section with Breadcrumb */}
      <div className="px-7 md:px-8 lg:px-14 xl:px-18 mb-16 mt-2">
        <nav className="mb-8">
          <ol className="flex items-center space-x-2 text-gray-500">
            <li><a href="/" className="hover:text-sky-600">{t('nav.home')}</a></li>
            <li>/</li>
            <li className="text-sky-600">{t('nav.services')}</li>
          </ol>
        </nav>
        
        <div className="text-center max-w-3xl mx-auto">
          <motion.h1 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-5xl font-bold text-gray-800 mb-6"
          >
            {t('services.pageTitle')}
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-xl text-gray-600"
          >
            {t('services.pageDescription')}
          </motion.p>
        </div>
      </div>

      {/* Search and Filter Section */}
      <div className="container mx-auto px-4 mb-12">
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
          <div className="relative w-full md:w-96">
            <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder={t('services.searchPlaceholder')}
              className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:border-sky-500 focus:ring-1 focus:ring-sky-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex gap-2">
            {['all', 'surgical', 'specialized', 'general'].map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  selectedCategory === category
                    ? 'bg-sky-600 text-white'
                    : 'bg-white text-gray-600 hover:bg-sky-50'
                }`}
              >
                {t(`services.categories.${category}`)}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Services Grid */}
      <div className="container mx-auto px-4">
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {filteredServices.map((service, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              className="bg-white rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300 group"
            >
              <Link to={`/services/${service.key}`}>
                <div className="relative h-48 overflow-hidden">
                  <img 
                    src={service.image} 
                    alt={t(`services.items.${service.key}.title`)}
                    className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-sky-600/20 group-hover:bg-sky-600/30 transition-colors duration-300" />
                </div>
                <div className="p-6">
                  <div className="flex items-center mb-4">
                    <div className="text-sky-600 mr-4">{service.icon}</div>
                    <h3 className="text-2xl font-semibold text-gray-800">
                      {t(`services.items.${service.key}.title`)}
                    </h3>
                  </div>
                  <p className="text-gray-600 mb-4">
                    {t(`services.items.${service.key}.description`)}
                  </p>
                  <ul className="space-y-2">
                  {t(`services.items.${service.key}.procedures`, { returnObjects: true })?.slice(0, 3).map((procedure, idx) => (

                    // {t(`services.items.${service.key}.procedures`, { returnObjects: true })?.map((procedure, idx) => (
                      <li key={idx} className="flex items-center text-gray-700">
                        <span className="w-2 h-2 bg-sky-600 rounded-full mr-2"></span>
                        {procedure}
                      </li>
                    ))}
                  </ul>
                
                      <div className="flex items-center text-sky-600 font-medium text-sm mt-4">
                        <span>Learn more</span>
                        <FaArrowRight className="ml-2 transition-transform group-hover:translate-x-1" />
                      </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </motion.div>

        {filteredServices.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-600 text-lg">
              {t('services.noResults')}
            </p>
          </div>
        )}
      </div>

      {/* CTA Section */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="container mx-auto px-4 mt-16"
      >

{/* Our Center Service Areas */}
<div className="container mx-auto px-4 mb-12">
  <h2 className="text-3xl font-bold text-gray-800 text-center mb-6">
    Our Center Service Areas
  </h2>
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
    {[
      { id: "icu", name: "ICU", image: "https://images.unsplash.com/photo-1576091160501-bbe57469278b?q=80&w=500&auto=format&fit=crop" },
      { id: "radiology", name: "Radiology Unit", image: "https://images.unsplash.com/photo-1551601651-2a8555f1a136?q=80&w=500&auto=format&fit=crop" },
      { id: "emergency", name: "Emergency Unit", image: "https://images.unsplash.com/photo-1597764698832-2e04b9c9cf92?q=80&w=500&auto=format&fit=crop" },
      { id: "laboratory", name: "Laboratory Unit", image: "https://images.unsplash.com/photo-1581595220162-6cf0ef55c3a5?q=80&w=500&auto=format&fit=crop" },
      { id: "digital-xray", name: "Digital X-ray Unit", image: "https://images.unsplash.com/photo-1615461066841-61194e5aabe2?q=80&w=500&auto=format&fit=crop" },
      { id: "outpatient", name: "OutPatient Unit", image: "https://images.unsplash.com/photo-1615461066841-61194e5aabe2?q=80&w=500&auto=format&fit=crop" },
      { id: "inpatient", name: "Inpatient Unit", image: "https://images.unsplash.com/photo-1582720875271-190ff5a52a21?q=80&w=500&auto=format&fit=crop" },
      { id: "operation-theater", name: "Major & Minor Operation Theater", image: "https://images.unsplash.com/photo-1550831107-1553da8c8464?q=80&w=500&auto=format&fit=crop" }
    ].map((area, index) => (
      <Link to={`/service-area/${area.id}`} key={index}>
        <div className="relative rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300 group">
          <img 
            src={area.image} 
            alt={area.name} 
            className="w-full h-48 object-cover transform group-hover:scale-105 transition-transform duration-300"
          />
          <div className="absolute inset-0 bg-black/30 group-hover:bg-black/40 transition-colors duration-300 flex items-center justify-center">
            <h3 className="text-white text-lg font-semibold">{area.name}</h3>
          </div>
        </div>
      </Link>
    ))}
  </div>
</div>


      {/* Need a Consultation */}

        <div className="bg-sky-600 text-white rounded-lg p-8 text-center">
          <h2 className="text-3xl font-bold mb-4">{t('services.cta.title')}</h2>
          <p className="text-lg mb-6">{t('services.cta.description')}</p>
          <button 
            onClick={() => window.location.href='/contact'}
            className="bg-white text-sky-600 px-8 py-3 rounded-full font-semibold hover:bg-sky-50 transition-colors duration-300"
          >
            {t('services.cta.button')}
          </button>
        </div>



        
      </motion.div>
    </div>
  );
};

export default Services;