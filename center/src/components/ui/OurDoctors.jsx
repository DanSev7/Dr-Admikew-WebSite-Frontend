import React from 'react';
import { Link } from 'react-router-dom';
import { FaUserMd, FaArrowRight } from 'react-icons/fa';
// import { useTranslation } from 'react-i18next';

const OurDoctors = () => {
  // const { t } = useTranslation();
  
  const doctors = [
    {
      name: "Dr. Admikew Bekele",
      specialty: "Cardiothoracic Surgeon",
      image: "https://images.unsplash.com/photo-1603398399627-a6fefe1f6585?auto=format&fit=crop&w=500&q=80",
    },
    {
      name: "Dr. Biruk Belay",
      specialty: "General Surgeon",
      // image: "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?auto=format&fit=crop&w=500&q=80",
    },
    {
      name: "Dr. Girma Moges",
      specialty: "Plastic Surgeon",
      image: "https://images.unsplash.com/photo-1622253692159-30f3f0600c13?auto=format&fit=crop&w=500&q=80",
    },
    {
      name: "Dr. Haileyesus",
      specialty: "Internist",
      image: "https://images.unsplash.com/photo-1621451537084-4f2da7a4c79c?auto=format&fit=crop&w=500&q=80",
    },
  ];
  
  

  return (
    <section className="py-16 bg-gray-50 ml-10 mr-10">
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
                  className="w-full h-64 object-cover transform group-hover:scale-105 transition-transform duration-300"
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