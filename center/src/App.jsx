import React, { Suspense, lazy } from "react";
import Header from "./components/layout/Header";
import Footer from "./components/layout/Footer";
import { Routes, Route } from 'react-router-dom';

// Lazy load components
const Home = lazy(() => import("./pages/Home"));
const About = lazy(() => import("./pages/About"));
const Contact = lazy(() => import("./pages/Contact"));
const OurDoctors = lazy(() => import("./pages/OurDoctors"));
const Services = lazy(() => import("./pages/Services"));
const ServiceDetail = lazy(() => import('./pages/ServiceDetail'));
const ServiceAreaDetailPage = lazy(() => import("./pages/ServiceAreaDetailPage"));
const PaymentSuccess = lazy(() => import("./pages/PaymentSuccess"));
const Appointment = lazy(() => import("./pages/appointment"));
const ServiceArea = lazy(() => import("./pages/ServiceArea"));


// Loading component
const LoadingFallback = () => (
  <div className="min-h-screen flex items-center justify-center">
    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-sky-600"></div>
  </div>
);

const App = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow">
        <Suspense fallback={<LoadingFallback />}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/doctors" element={<OurDoctors />} />
            <Route path="/services" element={<Services />} />
            <Route path="/services/:serviceId" element={<ServiceDetail />} />
            <Route path="/service-area/:serviceId" element={<ServiceAreaDetailPage />} />
            <Route path="/service-areas" element={<ServiceArea />} />
            <Route path="/payment-success" element={<PaymentSuccess />} />
            <Route path="/appointment" element={<Appointment />} />
          </Routes>
        </Suspense>
      </main>
      <Footer />
    </div>
  );
};

export default App;