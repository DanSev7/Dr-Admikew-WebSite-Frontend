import React from 'react';
import HeroSection from '../components/ui/HeroSection';
import WhyChooseUs from '../components/ui/WhyChooseUs';
import OurServices from '../components/ui/OurServices';
import OurDoctors from '../components/ui/OurDoctors';
import EmergencyContact from '../components/ui/EmergencyContact';
import Testimonials from '../components/ui/Testimonials';
import FAQ from '../components/ui/FAQ';
import ScrollToTop from '../components/common/ScrollToTop';

const Home = () => {
  return (
    <div className="home">
      <HeroSection />
      <WhyChooseUs />
      <OurServices />
      <EmergencyContact />
      <OurDoctors />
      <Testimonials />
      <FAQ />
      <ScrollToTop />
    </div>
  );
};

export default Home;