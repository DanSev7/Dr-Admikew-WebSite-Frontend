import React from 'react';
import { Link } from 'react-router-dom';
import { FaUserMd, FaArrowRight } from 'react-icons/fa';
import { useTranslation } from 'react-i18next';

// Import images from assets
// import admikewImage from '../assets/images/admikew.jpg';
import birukImage from '../assets/images/biruk.jpg';
// import girmaImage from '../assets/images/girma.jpg';
import biniamImage from '../assets/images/bini.jpg';
import haileyesusImage from '../assets/images/haile.jpg';
import samrawitImage from '../assets/images/samra.jpg';

const OurDoctors = () => {
  const { t } = useTranslation();
  
  const doctors = [
    // {
    //   name: "Dr. Admikew Bekele",
    //   specialty: "Cardiothoracic Surgeon",
    //   image: admikewImage,
    // },
    {
      name: "Dr. Biruk Belay",
      specialty: "General Surgeon",
      image: birukImage,
    },
    // {
    //   name: "Dr. Girma Moges",
    //   specialty: "Plastic Surgeon",
    //   image: girmaImage,
    // },
    {
      name: "Dr. Biniam",
      specialty: "Hematologist",
      image: biniamImage,
    },
    {
      name: "Dr. Haileyesus",
      specialty: "Internist",
      image: haileyesusImage,
    },
    {
      name: "Dr. Samrawit",
      specialty: "Anistologist",
      image: samrawitImage,
    },
  ];
  
  return (
    <section className="py-20 bg-gray-50 pr-16">
      {/* Hero Section with Breadcrumb */}
      <div className="px-7 md:px-8 lg:px-14 xl:px-18 mb-16 mt-2">
        <nav className="mb-8">
          <ol className="flex items-center space-x-2 text-gray-500 font-medium text-md">
            <li><a href="/" className="hover:text-sky-600">{t('nav.home')}</a></li>
            <li>/</li>
            <li className="text-sky-600">{t('nav.doctors')}</li>
          </ol>
        </nav>
      </div>
      <div className="container mx-auto px-4 ml-10">
        <div className="flex items-center justify-between mb-12">
          <div>
            <h2 className="text-3xl font-bold text-gray-800 mb-2 text-center">Our Expert Doctors</h2>
            <p className="text-gray-600 text-center">Meet our team of experienced surgical specialists</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {doctors.map((doctor, index) => (
            <div 
              key={index}
              className="bg-white rounded-lg shadow-md overflow-hidden group hover:shadow-lg transition-shadow duration-300"
            >
              <div className="relative overflow-hidden">
                <img 
                  src={doctor.image} 
                  alt={doctor.name}
                  className="w-full h-80 object-cover transform group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </div>
              <div className="p-6">
                <h3 className="text-xl font-semibold text-gray-800 mb-1">{doctor.name}</h3>
                <p className="text-sky-600">{doctor.specialty}</p>
              </div>
            </div>
          ))}
        </div>

        <Link 
          to="/doctors" 
          className="mt-8 flex md:hidden items-center justify-center text-sky-600 hover:text-sky-700 transition-colors"
        >
          View All Doctors <FaArrowRight className="ml-2" />
        </Link>
      </div>
    </section>
  );
};

export default OurDoctors;