import React from 'react';
import { Link } from 'react-router-dom';
import { FaUserMd, FaArrowRight } from 'react-icons/fa';
import { useTranslation } from 'react-i18next';

// Import images from assets
// import admikewImage from '../assets/images/admikew.jpg';
import birukImage from '../../assets/images/biruk.png';
// import girmaImage from '../../assets/images/girma.jpg';
import biniamImage from '../../assets/images/bini.jpg';
import haileyesusImage from '../../assets/images/haile.jpg';
import tensayeImage from '../../assets/images/Tensaye.png';
const Doctors = () => {
  const { t } = useTranslation();
  
  
  const doctors = [
    // {
    //   name: "Dr. Admikew Bekele",
    //   specialty: "Cardiothoracic Surgeon",
    //   image: admikewImage,
    // },
    {
      name: 'Dr. Biruk Umer',
      specialty: 'General Surgeon',
      image: birukImage,
    },
    {
      name: 'Dr. Haileyesus Yeneabat',
      specialty: 'Internist',
      image: haileyesusImage,
    },
    {
      name: 'Dr. Biniam Maasho',
      specialty: 'Consultant Internist & Hematologist',
      image: biniamImage,
    },
    {
      name: 'Dr.Tensaye Kebede',
      specialty: 'Anesthesiologists',
      image: tensayeImage,
    },
  ];
  
  

  return (
    <section className="py-16 bg-white ml-10 mr-10">
   
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between mb-12">
          <div>
            <h2 className="text-3xl font-bold text-gray-800 mb-2">Our Expert Doctors</h2>
            <p className="text-gray-600">Meet our team of experienced surgical specialists</p>
          </div>
          <Link 
            to="/doctors" 
            className="hidden md:flex items-center text-sky-600 hover:text-sky-700 transition-colors"
          >
            View All Doctors <FaArrowRight className="ml-2" />
          </Link>
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
                  className="w-full h-[360px] object-cover transform group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t group-hover:bg-sky-300/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
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

export default Doctors; 