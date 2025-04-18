import React, { useState, useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { FaCalendarAlt, FaChevronDown } from "react-icons/fa";
import Img from '../../assets/images/Logo.png';

const Header = () => {
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLangDropdownOpen, setIsLangDropdownOpen] = useState(false);
  const [isServiceDropdownOpen, setIsServiceDropdownOpen] = useState(false);
  const headerRef = useRef(null);
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();

  const languages = [
    { code: 'en', name: 'English' },
    { code: 'am', name: 'አማርኛ' },
    { code: 'so', name: 'Af-Soomaali' }
  ];

  const changeLanguage = (langCode) => {
    i18n.changeLanguage(langCode);
    localStorage.setItem('preferredLanguage', langCode);
    setIsLangDropdownOpen(false);
  };

  const handleHomeServiceClick = () => {
    navigate('/contact', { state: { serviceType: 'home' } });
    setIsServiceDropdownOpen(false);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (headerRef.current && !headerRef.current.contains(event.target)) {
        setIsServiceDropdownOpen(false);
        setIsLangDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header ref={headerRef} className="fixed top-0 left-0 w-full bg-white shadow-md z-30">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center">
            <img src={Img} alt="Logo" className="h-12 w-auto" />
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            {/* Regular Nav Items */}
            <Link to="/" className="text-gray-700 hover:text-sky-600 transition-colors">
              {t("nav.home")}
            </Link>
            <Link to="/about" className="text-gray-700 hover:text-sky-600 transition-colors">
              {t("nav.about")}
            </Link>

            {/* Services Dropdown */}
            <div className="relative group">
              <button 
                className="flex items-center text-gray-700 hover:text-sky-600 transition-colors"
                onClick={() => setIsServiceDropdownOpen(!isServiceDropdownOpen)}
              >
                {t("nav.services")}
                <FaChevronDown className="ml-1 w-3 h-3" />
              </button>
              {isServiceDropdownOpen && (
                <div className="absolute top-full left-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-2 z-50">
                  <Link
                    to="/services"
                    className="block px-4 py-2 text-gray-700 hover:bg-sky-50 hover:text-sky-600"
                    onClick={() => setIsServiceDropdownOpen(false)}
                  >
                    {t("nav.servicesMenu.overview")}
                  </Link>
                  <button
                    onClick={handleHomeServiceClick}
                    className="w-full text-left px-4 py-2 text-gray-700 hover:bg-sky-50 hover:text-sky-600"
                  >
                    {t("nav.servicesMenu.home")}
                  </button>
                </div>
              )}
            </div>

            <Link to="/doctors" className="text-gray-700 hover:text-sky-600 transition-colors">
              {t("nav.doctors")}
            </Link>
            <Link to="/contact" className="text-gray-700 hover:text-sky-600 transition-colors">
              {t("nav.contact")}
            </Link>

            {/* Book Appointment Button */}
            <button
              onClick={() => navigate('/contact')}
              className="bg-sky-600 text-white px-6 py-2 rounded-full hover:bg-sky-700 transition-colors flex items-center"
            >
              <FaCalendarAlt className="mr-2" />
              {t("nav.bookAppointment")}
            </button>

            {/* Language Selector */}
            <div className="relative">
              <button
                onClick={() => setIsLangDropdownOpen(!isLangDropdownOpen)}
                className="flex items-center text-gray-700 hover:text-sky-600 transition-colors"
              >
                {languages.find(lang => lang.code === i18n.language)?.name || 'English'}
                <FaChevronDown className="ml-1 w-3 h-3" />
              </button>
              {isLangDropdownOpen && (
                <div className="absolute top-full right-0 mt-2 w-36 bg-white rounded-lg shadow-lg py-2 z-50">
                  {languages.map((lang) => (
                    <button
                      key={lang.code}
                      onClick={() => changeLanguage(lang.code)}
                      className={`block w-full text-left px-4 py-2 text-sm hover:bg-sky-50 ${
                        i18n.language === lang.code ? 'text-sky-600 font-medium' : 'text-gray-700'
                      }`}
                    >
                      {lang.name}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </nav>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 text-gray-600 hover:text-gray-900"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {isMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden">
            <nav className="py-4 space-y-2">
              <Link to="/" className="block px-4 py-2 text-gray-700 hover:bg-gray-100" onClick={() => setIsMenuOpen(false)}>
                {t("nav.home")}
              </Link>
              <Link to="/about" className="block px-4 py-2 text-gray-700 hover:bg-gray-100" onClick={() => setIsMenuOpen(false)}>
                {t("nav.about")}
              </Link>
              <Link to="/services" className="block px-4 py-2 text-gray-700 hover:bg-gray-100" onClick={() => setIsMenuOpen(false)}>
                {t("nav.servicesMenu.overview")}
              </Link>
              <Link to="/services/home" className="block px-4 py-2 text-gray-700 hover:bg-gray-100" onClick={() => setIsMenuOpen(false)}>
                {t("nav.servicesMenu.home")}
              </Link>
              <Link to="/doctors" className="block px-4 py-2 text-gray-700 hover:bg-gray-100" onClick={() => setIsMenuOpen(false)}>
                {t("nav.doctors")}
              </Link>
              <Link to="/contact" className="block px-4 py-2 text-gray-700 hover:bg-gray-100" onClick={() => setIsMenuOpen(false)}>
                {t("nav.contact")}
              </Link>
              <button
                onClick={() => {
                  navigate('/contact');
                  setIsMenuOpen(false);
                }}
                className="w-full text-left px-4 py-2 text-sky-600 hover:bg-gray-100"
              >
                {t("nav.bookAppointment")}
              </button>
              
              {/* Mobile Language Selector */}
              <div className="px-4 py-2">
                <div className="flex flex-col space-y-2">
                  {languages.map((lang) => (
                    <button
                      key={lang.code}
                      onClick={() => {
                        changeLanguage(lang.code);
                        setIsMenuOpen(false);
                      }}
                      className={`text-left py-1 ${
                        i18n.language === lang.code ? 'text-sky-600 font-medium' : 'text-gray-700'
                      }`}
                    >
                      {lang.name}
                    </button>
                  ))}
                </div>
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
