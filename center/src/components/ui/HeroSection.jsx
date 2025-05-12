import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaCalendarAlt, FaArrowRight, FaUserMd, FaHospital, FaAward, FaHandHoldingMedical } from 'react-icons/fa';
import { useTranslation } from 'react-i18next';
import { useInView } from 'react-intersection-observer';

const CountUpNumber = ({ end, suffix, duration = 2000 }) => {
  const [count, setCount] = useState(0);
  const { ref, inView } = useInView({
    threshold: 0.3,
    triggerOnce: true
  });

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

  return (
    <div ref={ref} className="inline-flex">
      {count}{suffix}
    </div>
  );
};

const HeroSection = () => {
  const { t } = useTranslation();
  
  const icons = {
    doctors: <FaUserMd className="w-6 h-6 text-sky-600" />,
    surgeries: <FaHospital className="w-6 h-6 text-sky-600" />,
    satisfaction: <FaAward className="w-6 h-6 text-sky-600" />,
    experience: <FaHandHoldingMedical className="w-6 h-6 text-sky-600" />
  };
  
  return (
    <div className="relative bg-gradient-to-r from-sky-50 to-sky-100 py-20 md:py-24">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div className="text-center md:text-left">
            <span className="text-sky-600 font-medium mb-4 block">{t('slogan')}</span>
            <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-6">
              {t('centerName')}
            </h1>
            <p className="text-xl text-gray-600 mb-8">
              {t('hero.description')}
            </p>
            <div className="flex flex-col md:flex-row gap-4 justify-center md:justify-start">
                {/* Book Appointment */}
              <Link
                to="/appointment"
                className="inline-flex items-center justify-center px-6 py-3 bg-sky-600 text-white rounded-full hover:bg-sky-700 transition-colors duration-300"
              >
                <FaCalendarAlt className="mr-2" />
                {t('hero.bookAppointment')}
              </Link>
              <Link
                to="/services"
                className="inline-flex items-center justify-center px-6 py-3 border-2 border-sky-600 text-sky-600 rounded-full hover:bg-sky-50 transition-colors duration-300"
              >
                {t('nav.services')}
                <FaArrowRight className="ml-2" />
              </Link>
            </div>
          </div>
          <div className="hidden md:block relative overflow-hidden rounded-lg shadow-xl">
            <img
                src="https://images.unsplash.com/photo-1551076805-e1869033e561?q=80&w=2000&auto=format&fit=crop"
                alt="Modern Surgery Center"
                className="w-full h-auto transform hover:scale-105 transition-transform duration-300"
            />
            </div>

        </div>
      </div>
      
      {/* Stats Section - Moved below hero with proper spacing */}
      <div className="container mx-auto px-4 mt-16">
        <div className="bg-white rounded-lg shadow-xl p-6 grid grid-cols-2 md:grid-cols-4 gap-8">
          {Object.entries(t('achievements.stats', { returnObjects: true })).map(([key, stat]) => (
            <div 
              key={key} 
              className="text-center transform hover:scale-105 transition-transform duration-300"
            >
              <div className="flex justify-center mb-3">
                {icons[key]}
              </div>
              <div className="text-3xl font-bold text-sky-600 mb-2">
                <CountUpNumber 
                  end={stat.number.replace(/[^0-9]/g, '')} 
                  suffix={stat.number.includes('+') ? '+' : '%'} 
                />
              </div>
              <div className="text-gray-600">{stat.title}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default HeroSection; 