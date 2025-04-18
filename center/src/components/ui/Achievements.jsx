// import React from 'react';
// import { FaUserMd, FaHospital, FaSmile, FaAward } from 'react-icons/fa';
// import { useTranslation } from 'react-i18next';

// const Achievements = () => {
//   const { t } = useTranslation();

//   const stats = [
//     {
//       icon: <FaUserMd className="text-4xl text-sky-600 mb-4" />,
//       number: "20+",
//       title: "Specialist Doctors",
//       description: "Expert surgeons across multiple specialties"
//     },
//     {
//       icon: <FaHospital className="text-4xl text-sky-600 mb-4" />,
//       number: "15+",
//       title: "Successful Surgeries",
//       description: "Successfully completed operations"
//     },
//     {
//       icon: <FaSmile className="text-4xl text-sky-600 mb-4" />,
//       number: "98%",
//       title: "Patient Satisfaction",
//       description: "Positive feedback from our patients"
//     },
//     {
//       icon: <FaAward className="text-4xl text-sky-600 mb-4" />,
//       number: "6+",
//       title: "Months Experience",
//       description: "Months of dedicated medical service"
//     }
//   ];

//   return (
//     <section className="py-16 bg-white">
//       <div className="container mx-auto px-4">
//         <h2 className="text-3xl font-bold text-center text-gray-800 mb-12">
//           What We Have Achieved
//         </h2>
//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
//           {stats.map((stat, index) => (
//             <div 
//               key={index}
//               className="text-center p-6 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors duration-300"
//             >
//               <div className="flex flex-col items-center">
//                 {stat.icon}
//                 <span className="text-3xl font-bold text-sky-600 mb-2">
//                   {stat.number}
//                 </span>
//                 <h3 className="text-xl font-semibold text-gray-800 mb-2">
//                   {stat.title}
//                 </h3>
//                 <p className="text-gray-600">
//                   {stat.description}
//                 </p>
//               </div>
//             </div>
//           ))}
//         </div>
//       </div>
//     </section>
//   );
// };

// export default Achievements; 