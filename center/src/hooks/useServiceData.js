// Create a custom hook for service data management
import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';

export const useServiceData = (serviceId) => {
  const { t } = useTranslation();
  const [serviceData, setServiceData] = useState(null);

  useEffect(() => {
    const data = {
      title: t(`services.items.${serviceId}.title`),
      description: t(`services.items.${serviceId}.description`),
      procedures: t(`services.items.${serviceId}.procedures`, { returnObjects: true }),
      faq: t(`services.items.${serviceId}.faq`, { returnObjects: true, defaultValue: [] })
    };
    setServiceData(data);
  }, [serviceId, t]);

  return serviceData;
}; 