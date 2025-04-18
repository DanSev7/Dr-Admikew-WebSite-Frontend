import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { FaTimes } from 'react-icons/fa';
import { createClient } from '@supabase/supabase-js';

// Initialize Supabase client
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

const ServiceSelectionModal = ({ isOpen, onClose, type, onSelect, selectedServices }) => {
  const { t } = useTranslation();
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  // Temporary selection state that only gets applied when user confirms
  const [tempSelectedServices, setTempSelectedServices] = useState([]);

  // Initialize temp selection when modal opens or selectedServices changes
  useEffect(() => {
    if (isOpen) {
      setTempSelectedServices(selectedServices);
    }
  }, [isOpen, selectedServices]);

  // Fetch services based on type
  useEffect(() => {
    if (!isOpen || !type) return;

    const fetchServices = async () => {
      setLoading(true);
      setError('');
      const { data, error } = await supabase
        .from('services')
        .select('id, code, name, type, category, price')
        .eq('type', type.charAt(0).toUpperCase() + type.slice(1)); // Capitalize type
      if (error) {
        setError('Failed to load services');
      } else {
        setServices(data);
      }
      setLoading(false);
    };
    fetchServices();
  }, [isOpen, type]);

  // Check if a service is selected based on its code
  const isServiceSelected = (serviceCode) => {
    return tempSelectedServices.some(service => service.code === serviceCode);
  };

  // Handle toggling a service selection in the temporary state
  const handleToggleSelection = (service) => {
    // Check if any service with this code is already selected
    const isSelected = isServiceSelected(service.code);
    
    if (isSelected) {
      // If selected, remove all services with this code
      const updatedServices = tempSelectedServices.filter(s => s.code !== service.code);
      setTempSelectedServices(updatedServices);
    } else {
      // If not selected, add all services with this code
      const servicesWithSameCode = services.filter(s => s.code === service.code);
      const updatedServices = [...tempSelectedServices, ...servicesWithSameCode];
      setTempSelectedServices(updatedServices);
    }
  };

  // Only update parent state when user confirms
  const handleSubmit = () => {
    onSelect(tempSelectedServices);
    onClose();
  };

  if (!isOpen) return null;

  const categories = [...new Set(services.map(s => s.category || 'General'))];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-[60] flex items-center justify-center">
      <div className="bg-white rounded-lg w-full max-w-2xl p-6 relative max-h-[90vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
        >
          <FaTimes />
        </button>

        <h2 className="text-2xl font-bold mb-6">
          {t(`booking.services.${type}Title`)}
        </h2>

        {loading && <p className="text-gray-600">Loading services...</p>}
        {error && <p className="text-red-500">{error}</p>}

        <div className="space-y-6">
          {categories.map(category => (
            <div key={category} className="space-y-3">
              <h3 className="font-semibold text-md text-gray-700">{category}</h3>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                {services
                  .filter(service => (service.category || 'General') === category)
                  .map(service => (
                    <label
                      key={service.id}
                      className="flex items-center space-x-3 p-3 border rounded-lg cursor-pointer hover:bg-gray-50 text-sm"
                    >
                      <input
                        type="checkbox"
                        checked={isServiceSelected(service.code)}
                        onChange={() => handleToggleSelection(service)}
                        className="w-4 h-4 text-sky-600 rounded focus:ring-sky-500"
                      />
                      <span className="text-gray-700 text-sm">
                        {service.name}
                         {/* ({service.price.toFixed(2)} ETB) */}
                      </span>
                    </label>
                  ))}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-6 flex justify-end space-x-3">
          <button
            onClick={onClose}
            className="px-4 py-2 border rounded-lg hover:bg-gray-50"
          >
            {t('common.cancel')}
          </button>
          <button
            onClick={handleSubmit}
            className="px-4 py-2 bg-sky-600 text-white rounded-lg hover:bg-sky-700"
          >
            {t('common.confirm')}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ServiceSelectionModal;