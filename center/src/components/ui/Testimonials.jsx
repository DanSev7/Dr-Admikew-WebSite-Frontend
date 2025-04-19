import React, { useState } from "react";
import { FaQuoteLeft, FaChevronLeft, FaChevronRight, FaStar } from "react-icons/fa";
import { useSwipeable } from "react-swipeable";

const Testimonials = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const testimonials = [
    {
      name: "Abdi Mohamed",
      procedure: "Cardiac Surgery",
      text: "The care I received at Dr. Admikew Surgery Center was exceptional. The medical team was professional and caring throughout my cardiac procedure.",
      rating: 5,
    },
    {
      name: "Hodan Muktar",
      procedure: "Neurosurgery",
      text: "I was nervous about my surgery, but the doctors and staff made me feel comfortable and safe. The follow-up care was excellent.",
      rating: 5,
    },
    {
      name: "Solomon Tsegaye",
      procedure: "General Surgery",
      text: "State-of-the-art facilities and a highly skilled medical team. I couldn't have asked for better care during my recovery.",
      rating: 5,
    },
  ];

  const nextTestimonial = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === testimonials.length - 1 ? 0 : prevIndex + 1
    );
  };

  const prevTestimonial = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? testimonials.length - 1 : prevIndex - 1
    );
  };

  // Swipe handlers for mobile
  const handlers = useSwipeable({
    onSwipedLeft: nextTestimonial,
    onSwipedRight: prevTestimonial,
    preventScrollOnSwipe: true,
    trackMouse: true,
  });

  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-12">
          Patient Testimonials
        </h2>
        <div {...handlers} className="max-w-3xl mx-auto relative overflow-hidden">
          <div className="bg-white rounded-lg shadow-lg p-8 relative">
            <FaQuoteLeft className="text-4xl text-sky-600 mb-6" />
            <div className="min-h-[200px]">
              <p className="text-gray-600 text-lg mb-6">
                {testimonials[currentIndex].text}
              </p>
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-semibold text-gray-800">
                    {testimonials[currentIndex].name}
                  </h3>
                  <p className="text-sky-600">{testimonials[currentIndex].procedure}</p>
                </div>
                <div className="flex text-yellow-400">
                  {[...Array(testimonials[currentIndex].rating)].map((_, i) => (
                    <FaStar key={i} />
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Desktop Arrows (Hidden on Mobile) */}
          <button
            onClick={prevTestimonial}
            className="absolute top-1/2 -translate-y-1/2 bg-white p-2 rounded-full shadow-md hover:bg-gray-100"
          >
            <FaChevronLeft className="text-sky-600" />
          </button>

          <button
            onClick={nextTestimonial}
            className="absolute right-1 top-1/2 -translate-y-1/2 bg-white p-2 rounded-full shadow-md hover:bg-gray-100"
          >
            <FaChevronRight className="text-sky-600" />
          </button>


          {/* Dots Indicator */}
          <div className="flex justify-center mt-6 space-x-2">
            {testimonials.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={`w-2 h-2 rounded-full transition-colors duration-300 ${
                  index === currentIndex ? "bg-sky-600" : "bg-gray-300"
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
