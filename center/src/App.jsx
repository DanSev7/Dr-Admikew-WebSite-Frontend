import React from "react";
import Header from "./components/layout/Header";
import Footer from "./components/layout/Footer"; // Import the Footer
import AppRouter from "./routes/AppRouter";
import { Routes, Route } from 'react-router-dom';
import ServiceDetail from './pages/ServiceDetail';
import Services from "./pages/Services";
import Home from "./pages/Home";
import About from "./pages/About";
import Contact from "./pages/Contact";
import OurDoctors from "./components/ui/OurDoctors";
import ServiceAreaDetailPage from "./pages/ServiceAreaDetailPage";
import PaymentSuccess from "./pages/PaymentSuccess";

const App = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/doctors" element={<OurDoctors />} />
          <Route path="/services" element={<Services />} />
          <Route path="/services/:serviceId" element={<ServiceDetail />} />
          <Route path="/service-area/:serviceId" element={<ServiceAreaDetailPage />} />
          <Route path="/payment-success" element={<PaymentSuccess />} />
        </Routes>
      </main>
      <Footer /> {/* Add the Footer here */}
    </div>
  );
};

export default App;