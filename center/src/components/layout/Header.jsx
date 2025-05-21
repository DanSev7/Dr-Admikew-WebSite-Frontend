import React, { useState, useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import { Link, useNavigate } from "react-router-dom";
import { FaCalendarAlt, FaChevronDown, FaTimes, FaBars } from "react-icons/fa";
import Img from '../../assets/images/Logo.png';

const Header = () => {
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLangDropdownOpen, setIsLangDropdownOpen] = useState(false);
  const [isServiceDropdownOpen, setIsServiceDropdownOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const headerRef = useRef(null);
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();

  const languages = [
    { code: 'en', name: 'English' },
    { code: 'am', name: 'አማርኛ' },
    { code: 'so', name: 'Af-Soomaali' }
  ];

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    window.addEventListener('scroll', handleScroll);
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (headerRef.current && !headerRef.current.contains(event.target)) {
        setIsServiceDropdownOpen(false);
        setIsLangDropdownOpen(false);
        setIsMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const changeLanguage = (langCode) => {
    i18n.changeLanguage(langCode);
    localStorage.setItem('preferredLanguage', langCode);
    setIsLangDropdownOpen(false);
    setIsMenuOpen(false);
  };

  const handleHomeServiceClick = () => {
    navigate('/appointment', { state: { serviceType: 'home' } });
    setIsServiceDropdownOpen(false);
    setIsMenuOpen(false);
  };
  const handleServiceAreaClick = () => {
    navigate('/service-areas', { state: { serviceType: 'serviceArea' } });
    setIsServiceDropdownOpen(false);
    setIsMenuOpen(false);
  };

  return (
    <header 
    ref={headerRef} 
    className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${
      isScrolled 
        ? 'bg-white/90 backdrop-blur-md shadow-lg' 
        : 'bg-transparent shadow-none'
    }`}
  >
    <div className="container mx-auto px-4">
      <div className="flex items-center justify-between h-20">
        <Link to="/" className="flex items-center">
          <img src={Img} alt="Logo" className="h-14 w-auto transition-transform duration-300 hover:scale-105" />
        </Link>

          <nav className="hidden lg:flex items-center space-x-10">
            <Link to="/" className="text-gray-700 hover:text-sky-600 transition-colors font-medium text-base">
              {t("nav.home")}
            </Link>
            <Link to="/about" className="text-gray-700 hover:text-sky-600 transition-colors font-medium text-base">
              {t("nav.about")}
            </Link>
            <div className="relative group">
              <button 
                className="flex items-center text-gray-700 hover:text-sky-600 transition-colors font-medium text-base"
                onClick={() => {
                  setIsServiceDropdownOpen(!isServiceDropdownOpen);
                  setIsLangDropdownOpen(false);
                }}
              >
                {t("nav.services")}
                <FaChevronDown className="ml-2 w-4 h-4 transition-transform duration-200" />
              </button>
              {isServiceDropdownOpen && (
                <div className="absolute top-full left-0 mt-3 w-56 bg-white rounded-xl shadow-xl py-3 border border-gray-100">
                  <Link
                    to="/services"
                    className="block px-4 py-2.5 text-gray-700 hover:bg-sky-50 hover:text-sky-600 font-medium text-sm"
                    onClick={() => setIsServiceDropdownOpen(false)}
                  >
                    {t("nav.servicesMenu.overview")}
                  </Link>
                  <button
                    onClick={handleHomeServiceClick}
                    className="w-full text-left px-4 py-2.5 text-gray-700 hover:bg-sky-50 hover:text-sky-600 font-medium text-sm"
                  >
                    {t("nav.servicesMenu.home")}
                  </button>
                  <button
                    onClick={handleServiceAreaClick}
                    className="w-full text-left px-4 py-2.5 text-gray-700 hover:bg-sky-50 hover:text-sky-600 font-medium text-sm"
                  >
                    {t("nav.servicesMenu.serviceArea")}
                  </button>
                </div>
              )}
            </div>
            <Link to="/doctors" className="text-gray-700 hover:text-sky-600 transition-colors font-medium text-base">
              {t("nav.doctors")}
            </Link>
            <Link to="/contact" className="text-gray-700 hover:text-sky-600 transition-colors font-medium text-base">
              {t("nav.contact")}
            </Link>
            <div className="relative">
              <button
                onClick={() => {
                  setIsLangDropdownOpen(!isLangDropdownOpen);
                  setIsServiceDropdownOpen(false);
                }}
                className="flex items-center text-gray-700 hover:text-sky-600 transition-colors font-medium text-base"
              >
                {languages.find(lang => lang.code === i18n.language)?.name || 'English'}
                <FaChevronDown className="ml-2 w-4 h-4 transition-transform duration-200 group-hover:rotate-180" />
              </button>
              {isLangDropdownOpen && (
                <div className="absolute top-full right-0 mt-3 w-48 bg-white rounded-xl shadow-xl py-3 border border-gray-100">
                  {languages.map((lang) => (
                    <button
                      key={lang.code}
                      onClick={() => changeLanguage(lang.code)}
                      className={`block w-full text-left px-4 py-2.5 text-sm font-medium hover:bg-sky-50 transition-colors ${
                        i18n.language === lang.code ? 'text-sky-600 bg-sky-50' : 'text-gray-700'
                      }`}
                    >
                      {lang.name}
                    </button>
                  ))}
                </div>
              )}
            </div>
            <button
              onClick={() => navigate('/appointment')}
              className="bg-sky-600 text-white px-6 py-2.5 rounded-full hover:bg-sky-700 transition-all duration-300 flex items-center shadow-md hover:shadow-lg"
            >
              <FaCalendarAlt className="mr-2" />
              {t("nav.bookAppointment")}
            </button>
          </nav>

          <button
            className="lg:hidden p-2 text-gray-600 hover:text-gray-900 transition-colors"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <FaTimes className="w-6 h-6" /> : <FaBars className="w-6 h-6" />}
          </button>
        </div>

        {isMenuOpen && (
          <div className="lg:hidden bg-white shadow-lg absolute top-20 left-0 w-full">
            <nav className="py-6 px-4 space-y-2">
              <Link 
                to="/" 
                className="block px-4 py-3 text-gray-700 hover:bg-sky-50 hover:text-sky-600 rounded-lg font-medium"
                onClick={() => setIsMenuOpen(false)}
              >
                {t("nav.home")}
              </Link>
              <Link 
                to="/about" 
                className="block px-4 py-3 text-gray-700 hover:bg-sky-50 hover:text-sky-600 rounded-lg font-medium"
                onClick={() => setIsMenuOpen(false)}
              >
                {t("nav.about")}
              </Link>
              <div>
                <button
                  className="w-full flex items-center justify-between px-4 py-3 text-gray-700 hover:bg-sky-50 hover:text-sky-600 rounded-lg font-medium"
                  onClick={() => setIsServiceDropdownOpen(!isServiceDropdownOpen)}
                >
                  {t("nav.services")}
                  <FaChevronDown className={`w-4 h-4 transition-transform duration-200 ${isServiceDropdownOpen ? 'rotate-180' : ''}`} />
                </button>
                {isServiceDropdownOpen && (
                  <div className="pl-4 mt-2 space-y-2">
                    <Link
                      to="/services"
                      className="block px-4 py-2 text-gray-700 hover:bg-sky-50 hover:text-sky-600 rounded-lg text-sm font-medium"
                      onClick={() => {
                        setIsServiceDropdownOpen(false);
                        setIsMenuOpen(false);
                      }}
                    >
                      {t("nav.servicesMenu.overview")}
                    </Link>
                    <button
                      onClick={handleHomeServiceClick}
                      className="w-full text-left px-4 py-2 text-gray-700 hover:bg-sky-50 hover:text-sky-600 rounded-lg text-sm font-medium"
                    >
                      {t("nav.servicesMenu.home")}
                    </button>
                    <button
                      onClick={handleServiceAreaClick}
                      className="w-full text-left px-4 py-2 text-gray-700 hover:bg-sky-50 hover:text-sky-600 rounded-lg text-sm font-medium"
                    >
                      {t("nav.servicesMenu.serviceArea")}
                    </button>
                  </div>
                )}
              </div>
              <Link 
                to="/doctors" 
                className="block px-4 py-3 text-gray-700 hover:bg-sky-50 hover:text-sky-600 rounded-lg font-medium"
                onClick={() => setIsMenuOpen(false)}
              >
                {t("nav.doctors")}
              </Link>
              <Link 
                to="/contact" 
                className="block px-4 py-3 text-gray-700 hover:bg-sky-50 hover:text-sky-600 rounded-lg font-medium"
                onClick={() => setIsMenuOpen(false)}
              >
                {t("nav.contact")}
              </Link>
              <div>
                <button
                  className="w-full flex items-center justify-between px-4 py-3 text-gray-700 hover:bg-sky-50 hover:text-sky-600 rounded-lg font-medium"
                  onClick={() => setIsLangDropdownOpen(!isLangDropdownOpen)}
                >
                  {languages.find(lang => lang.code === i18n.language)?.name || 'English'}
                  <FaChevronDown className={`w-4 h-4 transition-transform duration-200 ${isLangDropdownOpen ? 'rotate-180' : ''}`} />
                </button>
                {isLangDropdownOpen && (
                  <div className="pl-4 mt-2 space-y-2">
                    {languages.map((lang) => (
                      <button
                        key={lang.code}
                        onClick={() => changeLanguage(lang.code)}
                        className={`block w-full text-left px-4 py-2 text-sm font-medium rounded-lg ${
                          i18n.language === lang.code 
                            ? 'text-sky-600 bg-sky-50' 
                            : 'text-gray-700 hover:bg-sky-50 hover:text-sky-600'
                        }`}
                      >
                        {lang.name}
                      </button>
                    ))}
                  </div>
                )}
              </div>
              <button
                onClick={() => {
                  navigate('/appointment');
                  setIsMenuOpen(false);
                }}
                className="w-full px-4 py-3 bg-sky-600 text-white rounded-lg hover:bg-sky-700 transition-colors flex items-center justify-center font-medium"
              >
                <FaCalendarAlt className="mr-2" />
                {t("nav.bookAppointment")}
              </button>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;