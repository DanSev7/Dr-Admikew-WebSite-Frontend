import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { FaHeartbeat, FaBrain, FaCut, FaChild, FaUserMd, FaTeeth, FaSearch, FaArrowRight } from 'react-icons/fa';
import { GiKidneys } from 'react-icons/gi';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import 'react-lazy-load-image-component/src/effects/blur.css';

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
  ];

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

  return (
    <div className="py-20 bg-gray-50">
      {/* Hero Section with Breadcrumb */}
      <div className="px-7 md:px-8 lg:px-14 xl:px-18 mb-16 mt-2">
        <nav className="mb-8">
          <ol className="flex items-center space-x-2 text-gray-600 font-medium text-md">
            <li><Link to="/" className="hover:text-sky-600 transition-colors">{t('nav.home')}</Link></li>
            <li>/</li>
            <li className="text-sky-600">{t('nav.services')}</li>
          </ol>
        </nav>
        
        <div className="text-center max-w-3xl mx-auto">
          <motion.h1 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 tracking-tight"
          >
            {t('services.pageTitle')}
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-xl text-gray-600 leading-relaxed"
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
              className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-300 focus:border-sky-600 focus:ring-2 focus:ring-sky-600/50 transition-all duration-300"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex gap-2">
            {['all', 'surgical', 'specialized', 'general'].map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                  selectedCategory === category
                    ? 'bg-sky-600 text-white shadow-md'
                    : 'bg-white text-gray-600 hover:bg-sky-50 border border-gray-200'
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
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {filteredServices.map((service, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300 group bg-gradient-to-br from-white to-gray-50"
            >
              <Link to={`/services/${service.key}`}>
                <div className="relative h-48 overflow-hidden">
                  <LazyLoadImage 
                    src={service.image} 
                    alt={t(`services.items.${service.key}.title`)}
                    effect="blur"
                    className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-sky-600/20 group-hover:bg-sky-600/40 transition-colors duration-300" />
                </div>
                <div className="p-6">
                  <div className="flex items-center mb-4">
                    <div className="text-sky-600 mr-4">{service.icon}</div>
                    <h3 className="text-xl font-semibold text-gray-900">
                      {t(`services.items.${service.key}.title`)}
                    </h3>
                  </div>
                  <p className="text-gray-600 mb-4 leading-relaxed">
                    {t(`services.items.${service.key}.description`)}
                  </p>
                  <ul className="space-y-2 mb-4">
                    {t(`services.items.${service.key}.procedures`, { returnObjects: true })?.slice(0, 3).map((procedure, idx) => (
                      <li key={idx} className="flex items-center text-gray-700">
                        <span className="w-2 h-2 bg-sky-600 rounded-full mr-2"></span>
                        {procedure}
                      </li>
                    ))}
                  </ul>
                  <div className="flex items-center text-sky-600 font-medium text-sm">
                    <span>Learn more</span>
                    <FaArrowRight className="ml-2 transition-transform group-hover:translate-x-2 duration-300" />
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </motion.div>

        {filteredServices.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-600 text-lg font-medium">
              {t('services.noResults')}
            </p>
          </div>
        )}
      </div>

      {/* Combined CTA Section */}
      <motion.div 
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ delay: 0.4 }}
  className="container mx-auto px-4 mt-16"
>
  <div className="bg-gradient-to-r from-sky-600 to-sky-700 text-white rounded-xl shadow-xl p-8 flex flex-col md:flex-row items-center md:items-start justify-center md:justify-between text-center md:text-left">
    <div className="w-full md:w-2/3 mb-6 md:mb-0">
      <h2 className="text-3xl font-bold mb-4">{t('services.cta.title')}</h2>
      <p className="text-lg leading-relaxed">
        Discover our specialized facilities or book a consultation with our expert team today.
      </p>
    </div>
    <div className="w-full md:w-auto flex flex-col sm:flex-row gap-4 justify-center md:justify-end">
      <Link 
        to="/service-areas"
        className="inline-block bg-white text-sky-600 px-6 py-3 rounded-full font-semibold hover:bg-sky-50 transition-colors duration-300 shadow-md"
      >
        View Service Areas
      </Link>
      <Link 
        to="/appointment"
        className="inline-block bg-sky-800 text-white px-6 py-3 rounded-full font-semibold hover:bg-sky-900 transition-colors duration-300 shadow-md"
      >
        {t('services.cta.button')}
      </Link>
    </div>
  </div>
</motion.div>

    </div>
  );
};

export default Services;