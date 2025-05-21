import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import {
  FaUserMd, FaHospital, FaAward, FaHandHoldingMedical,
  FaBullseye, FaUsers, FaHospitalAlt, FaHeartbeat
} from 'react-icons/fa';
import { useInView } from 'react-intersection-observer';
import { motion } from 'framer-motion';
import ScrollToTop from '../components/common/ScrollToTop';
import Testimonials from '../components/ui/Testimonials';

const CountUpNumber = ({ end, duration = 2000 }) => {
  const [count, setCount] = useState(0);
  const { ref, inView } = useInView({ threshold: 0.3, triggerOnce: true });

  useEffect(() => {
    if (inView) {
      let startTime;
      const startValue = 0;
      const endValue = parseInt(end);

      const animate = (currentTime) => {
        if (!startTime) startTime = currentTime;
        const progress = (currentTime - startTime) / duration;

        if (progress < 1) {
          const currentCount = Math.round(startValue + (endValue - startValue) * progress);
          setCount(currentCount);
          requestAnimationFrame(animate);
        } else {
          setCount(endValue);
        }
      };

      requestAnimationFrame(animate);
    }
  }, [end, duration, inView]);

  return <div ref={ref}>{count}+</div>;
};

const About = () => {
  const { t } = useTranslation();

  const features = [
    {
      icon: <FaUserMd className="w-8 h-8 text-sky-600" />,
      title: "Expert Surgeons",
      description: "Our team consists of skilled surgeons committed to delivering exceptional care and ensuring successful outcomes for our patients."
    },
    {
      icon: <FaHospital className="w-8 h-8 text-sky-600" />,
      title: "Modern Facilities",
      description: "We provide advanced medical equipment and state-of-the-art facilities for the best surgical care experience."
    },
    {
      icon: <FaAward className="w-8 h-8 text-sky-600" />,
      title: "Quality Care",
      description: "We are dedicated to maintaining high standards in patient safety and delivering superior surgical care at all times."
    },
    {
      icon: <FaHandHoldingMedical className="w-8 h-8 text-sky-600" />,
      title: "Patient Support",
      description: "Our compassionate team offers continuous support before, during, and after surgery to ensure optimal recovery."
    }
  ];

  return (
    <div className="py-20 bg-gray-50">
      {/* Hero Section with Breadcrumb */}
      <div className="px-7 md:px-8 lg:px-14 xl:px-18 mb-16 mt-2">
        <nav className="mb-8">
          <ol className="flex items-center space-x-2 text-gray-500 font-medium text-md">
            <li><a href="/" className="hover:text-sky-600">{t('nav.home')}</a></li>
            <li>/</li>
            <li className="text-sky-600">{t('nav.about')}</li>
          </ol>
        </nav>

        <div className="text-center max-w-3xl mx-auto">
          <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-5xl font-bold text-gray-800 mb-6"
          >
            {t('about.title', 'About Us')}
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-xl text-gray-600"
          >
            {t('about.subtitle', 'Delivering safe and expert surgical care in Jigjiga, Ethiopia.')}
          </motion.p>
        </div>
      </div>

      {/* Features Grid */}
      <div className="px-7 md:px-8 lg:px-12 xl:px-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
          {features.map((feature, index) => (
            <div
              key={index}
              className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300"
            >
              <div className="mb-4">
                {feature.icon}
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">
                {feature.title}
              </h3>
              <p className="text-gray-600">
                {feature.description}
              </p>
            </div>
          ))}
        </div>

        {/* Mission, Vision, Values */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          <div className="bg-white p-8 rounded-lg shadow-md hover:shadow-lg transition-all duration-300">
            <div className="flex items-center mb-4">
              <FaBullseye className="w-6 h-6 text-sky-600 mr-2" />
              <h2 className="text-2xl font-bold text-gray-800">Our Mission</h2>
            </div>
            <p className="text-gray-600">
              We strive to deliver exceptional, patient-centered surgical care by embracing innovation, ethical practices, and advanced medical technologies.
            </p>
          </div>

          <div className="bg-white p-8 rounded-lg shadow-md hover:shadow-lg transition-all duration-300">
            <div className="flex items-center mb-4">
              <FaAward className="w-6 h-6 text-sky-600 mr-2" />
              <h2 className="text-2xl font-bold text-gray-800">Our Vision</h2>
            </div>
            <p className="text-gray-600">
              To be a leading provider of top-tier surgical care, setting the standard for excellence and patient safety in Jigjiga and surrounding regions.
            </p>
          </div>

          <div className="bg-white p-8 rounded-lg shadow-md hover:shadow-lg transition-all duration-300">
            <div className="flex items-center mb-4">
              <FaHandHoldingMedical className="w-6 h-6 text-sky-600 mr-2" />
              <h2 className="text-2xl font-bold text-gray-800">Our Core Values</h2>
            </div>
            <p className="text-gray-600">
              We are committed to compassionate care, excellence, and integrity,
              prioritizing patient well-being. Through collaboration and ethical practices,
              we aim to improve outcomes and the health of our communities.
            </p>
          </div>
        </div>

        {/* Stats Section */}
        <div className="bg-sky-600 text-white rounded-lg p-8 mb-16">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {Object.entries(t('achievements.stats', { returnObjects: true })).map(([key, stat]) => (
              <div key={key} className="transform hover:scale-105 transition-transform duration-300">
                <div className="text-4xl font-bold mb-2">
                  <CountUpNumber end={stat.number.replace('+', '')} />
                </div>
                <div className="text-xl mb-1">
                  {key === 'patients' && <FaUsers className="inline-block mr-2 text-xl" />}
                  {key === 'hospitals' && <FaHospitalAlt className="inline-block mr-2 text-xl" />}
                  {key === 'heart' && <FaHeartbeat className="inline-block mr-2 text-xl" />}
                  {key === 'awards' && <FaAward className="inline-block mr-2 text-xl" />}
                  {stat.title}
                </div>
                <div className="text-sm text-sky-100">{stat.description}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Testimonials Section */}
        <Testimonials />
      </div>

      <ScrollToTop />
    </div>
  );
};

export default About;
