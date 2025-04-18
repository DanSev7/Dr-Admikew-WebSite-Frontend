import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { FaChevronDown, FaChevronUp } from 'react-icons/fa';

const FAQ = () => {
  const { t } = useTranslation(); // Initialize translation
  const [activeIndex, setActiveIndex] = useState(null);

  const faqs = [
    {
      question: t("faq.questions.surgeryTypes.question"),
      answer: t("faq.questions.surgeryTypes.answer")
    },
    {
      question: t("faq.questions.consultation.question"),
      answer: t("faq.questions.consultation.answer")
    },
    {
      question: t("faq.questions.insurance.question"),
      answer: t("faq.questions.insurance.answer")
    },
    {
      question: t("faq.questions.beforeSurgery.question"),
      answer: t("faq.questions.beforeSurgery.answer")
    },
    {
      question: t("faq.questions.postCare.question"),
      answer: t("faq.questions.postCare.answer")
    }
  ];

  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-8">
        <div className="grid md:grid-cols-2 gap-12">
          <div>
            {/* Flex container for the Question mark and title */}
            <div className="flex justify-center items-center space-x-4 mb-6">
              <div className="flex justify-center items-center bg-sky-500 text-white w-12 h-12 rounded-full">
                <span className="text-2xl font-bold">?</span>
              </div>
              <h2 className="text-3xl font-bold text-gray-800">
                {t("faq.title")}
              </h2>
            </div>

            <p className="text-gray-600 mb-4 pl-12 pr-12 font-bold text-justify">
              {t("faq.description")}
            </p>
            <p className="text-sky-600 pl-12 font-semibold text-justify">
              {t("faq.available")}
            </p>
          </div>

          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <div key={index} className="border rounded-lg overflow-hidden">
                <button
                  className="w-full px-6 py-4 text-left flex items-center justify-between bg-gray-50 hover:bg-gray-100"
                  onClick={() => setActiveIndex(activeIndex === index ? null : index)}
                >
                  <span className="font-semibold text-gray-800">{faq.question}</span>
                  {activeIndex === index ? (
                    <FaChevronUp className="text-sky-600" />
                  ) : (
                    <FaChevronDown className="text-sky-600" />
                  )}
                </button>
                <div className={`px-6 overflow-hidden transition-all duration-300 ${activeIndex === index ? 'py-4' : 'max-h-0'}`}>
                  <p className="text-gray-600 text-justify">{faq.answer}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default FAQ;
