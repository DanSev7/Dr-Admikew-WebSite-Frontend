import React, { useState } from "react";
import { Link } from "react-router-dom";
// import { PhoneIcon } from "@heroicons/react/solid";
// import { PhoneIcon } from '@heroicons/react/24/outline';
import { MdPhone } from 'react-icons/md';

import Img from '../../assets/images/Logo.png';

import {
  FaFacebook,
  FaTwitter,
  FaInstagram,
  FaYoutube,
  FaMapMarkerAlt,
  FaArrowRight,
} from "react-icons/fa";
import { useTranslation } from "react-i18next";

const Footer = () => {
  const { t } = useTranslation();
  const [hovered, setHovered] = useState(false);

  return (
    <footer className="bg-sky-500 text-white py-6">
      <div className="container mx-auto pr-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-left ">
          {/* About Section - Kept at Left on Mobile */}
          <div className="md:ml-24">
            {/* <h3 className="text-xl font-semibold mb-4">{t("footer.aboutUs")}</h3> */}
            {/* Logo */}
            <Link to="/" className="flex justify-start">
              <img src={Img} alt="Logo" className="h-12 w-auto object-contain" />
            </Link>
            <p className="text-sky-950 font-medium mb-2 ml-10">{t("slogan")}</p>
            <p className="mb-4 text-justify text-sky-100 ml-10">{t("footer.aboutDescription")}</p>
            <div className="flex space-x-4 ml-10">
              <a href="#" className="text-sky-200 hover:text-white transition-colors">
                <FaFacebook size={20} />
              </a>
              <a href="#" className="text-sky-200 hover:text-white transition-colors">
                <FaTwitter size={20} />
              </a>
              <a href="#" className="text-sky-200 hover:text-white transition-colors">
                <FaInstagram size={20} />
              </a>
              <a href="#" className="text-sky-200 hover:text-white transition-colors">
                <FaYoutube size={20} />
              </a>
            </div>
          </div>

          {/* Quick Links - Kept at Left on Mobile */}
          <div className="md:ml-24 ml-10">
            <h3 className="text-xl font-semibold text-white mb-4">{t("footer.siteLinks")}</h3>
            <ul className="space-y-2">
              {["home", "services", "about", "doctors", "contact"].map((item) => (
                <li key={item}>
                  <Link
                    to={`/${item === "home" ? "" : item}`}
                    className="flex items-center space-x-2 text-white transition-colors"
                  >
                    <span className="hover:text-gray-300 transition-colors">{t(`nav.${item}`)}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info - Kept Right */}
          <div className="ml-10">
            <h3 className="text-xl font-semibold mb-4">{t("footer.contact")}</h3>
            <div className="space-y-4">
              <p className="flex items-center">
                <FaMapMarkerAlt className="mr-2" />
                Jigjiga, Somali  (9Q6X+M86)
              </p>

              <a
                href="https://maps.app.goo.gl/7xXF2XV3xLLfDpzi6"
                target="_blank"
                rel="noopener noreferrer"
                className="relative inline-flex items-center px-4 py-2 rounded-full text-white bg-gradient-to-r from-sky-300 to-sky-400 hover:from-sky-200 hover:to-sky-300 transition-all duration-500 ease-in-out shadow-lg overflow-hidden"
                onMouseEnter={() => setHovered(true)}
                onMouseLeave={() => setHovered(false)}
              >
                {/* Default: Text + Arrow */}
                <span
                  className={`flex items-center gap-2 transition-all duration-500 ${
                    hovered ? "translate-x-5 opacity-0" : "translate-x-0 opacity-100"
                  }`}
                >
                  <span>Get directions on the map</span>
                  <FaArrowRight className="w-4 h-4" />
                </span>

                {/* Hover: Map Icon + Text */}
                <span
                  className={`absolute flex items-center gap-2 transition-all duration-500 ${
                    hovered ? "translate-x-0 opacity-100" : "-translate-x-5 opacity-0"
                  }`}
                >
                  <FaMapMarkerAlt className="w-4 h-4" />
                  <span>Get directions on the map</span>
                </span>
              </a>

              <p className="flex items-center">
                <MdPhone className="w-5 h-5 text-white mr-2" /> +251 25 278 2051 / 4095
              </p>

              <p>
                <strong>{t("footer.hours")}:</strong>
                <br />
                {t("footer.working")}
              </p>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-8 pt-6 border-t border-sky-600 text-center">
          <p>© {new Date().getFullYear()} - {t("centerName")}</p>
          {/* <p className="mt-2">{t("footer.developedBy")}</p> */}
        </div>
      </div>
    </footer>
  );
};

export default Footer;
