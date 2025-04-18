import React, { useState, useEffect } from 'react';
import { FaArrowUp, FaArrowDown } from 'react-icons/fa';

const ScrollToTop = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const toggleVisibility = () => {
      if (window.pageYOffset > 200) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener('scroll', toggleVisibility);

    return () => {
      window.removeEventListener('scroll', toggleVisibility);
    };
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  return (
    <>
      {isVisible && (
        <>
          <button
            onClick={scrollToTop}
            className="fixed bottom-16 right-10 p-3 bg-sky-600 text-white rounded-full shadow-lg hover:bg-sky-700 transition-colors duration-300 z-50"
            aria-label="Scroll to top"
          >
            <FaArrowUp />
          </button>
        </>
      )}
    </>
  );
};

export default ScrollToTop;
