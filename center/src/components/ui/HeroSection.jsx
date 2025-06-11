import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  FaCalendarAlt, FaArrowRight, FaUserMd, FaHospital, FaAward,
  FaHandHoldingMedical, FaPlay, FaPause, FaVolumeMute, FaVolumeUp
} from 'react-icons/fa';
import { useTranslation } from 'react-i18next';
import { useInView } from 'react-intersection-observer';
import Videos from '../../assets/videos/dr-admikew.mp4';

const CountUpNumber = ({ end, suffix, duration = 2000 }) => {
  const [count, setCount] = useState(0);
  const { ref, inView } = useInView({ threshold: 0.3, triggerOnce: true });

  useEffect(() => {
    if (inView) {
      let startTime;
      const endValue = parseInt(end);

      const animate = (currentTime) => {
        if (!startTime) startTime = currentTime;
        const progress = (currentTime - startTime) / duration;

        if (progress < 1) {
          const currentCount = Math.round((endValue) * progress);
          setCount(currentCount);
          requestAnimationFrame(animate);
        } else {
          setCount(endValue);
        }
      };

      requestAnimationFrame(animate);
    }
  }, [end, duration, inView]);

  return (
    <div ref={ref} className="inline-flex">
      {count}{suffix}
    </div>
  );
};

const HeroSection = () => {
  const { t } = useTranslation();
  const videoRef = useRef(null);
  const hiddenVideoRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const [playCount, setPlayCount] = useState(0);
  const [thumbnail, setThumbnail] = useState('');

  const handleTogglePlay = () => {
    const video = videoRef.current;
    if (!video) return;

    if (isPlaying) {
      video.pause();
    } else {
      video.currentTime = 0;
      video.play();
    }

    setIsPlaying(!isPlaying);
  };

  const handleToggleMute = () => {
    setIsMuted(!isMuted);
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
    }
  };

  useEffect(() => {
    const video = hiddenVideoRef.current;
    if (!video) return;

    const captureThumbnail = () => {
      const canvas = document.createElement('canvas');
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      const imageUrl = canvas.toDataURL('image/png');
      setThumbnail(imageUrl);
    };

    const onLoadedMetadata = () => {
      video.currentTime = 8;
    };

    const onSeeked = () => {
      captureThumbnail();
    };

    video.addEventListener('loadedmetadata', onLoadedMetadata);
    video.addEventListener('seeked', onSeeked);

    return () => {
      video.removeEventListener('loadedmetadata', onLoadedMetadata);
      video.removeEventListener('seeked', onSeeked);
    };
  }, []);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleEnded = () => {
      const newPlayCount = playCount + 1;
      setPlayCount(newPlayCount);

      if (newPlayCount < 2) {
        video.currentTime = 0;
        video.play();
      } else {
        setIsPlaying(false);
        video.currentTime = 0;
        video.pause();
      }
    };

    video.addEventListener('ended', handleEnded);
    return () => {
      video.removeEventListener('ended', handleEnded);
    };
  }, [playCount]);

  const icons = {
    doctors: <FaUserMd className="w-6 h-6 text-sky-600" />,
    surgeries: <FaHospital className="w-6 h-6 text-sky-600" />,
    satisfaction: <FaAward className="w-6 h-6 text-sky-600" />,
    experience: <FaHandHoldingMedical className="w-6 h-6 text-sky-600" />
  };

  return (
    <div className="relative bg-gradient-to-r from-sky-50 to-sky-100 py-20 md:py-26">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div className="text-center md:text-left">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-6">
              {t('centerName')}
            </h1>
            <span className="text-sky-600 font-medium mb-4 block text-2xl">{t('slogan')}</span>
            <p className="text-xl text-gray-600 mb-8">
              {t('hero.description')}
            </p>
            <div className="flex flex-col md:flex-row gap-4 justify-center md:justify-start">
              <Link to="/appointment" className="inline-flex items-center justify-center px-6 py-3 bg-sky-600 text-white rounded-full hover:bg-sky-700 transition-colors duration-300">
                <FaCalendarAlt className="mr-2" />
                {t('hero.bookAppointment')}
              </Link>
              <Link to="/services" className="inline-flex items-center justify-center px-6 py-3 border-2 border-sky-600 text-sky-600 rounded-full hover:bg-sky-50 transition-colors duration-300">
                {t('nav.services')}
                <FaArrowRight className="ml-2" />
              </Link>
            </div>
          </div>

          {/* Video Section */}
          <div className="relative rounded-lg shadow-xl overflow-hidden w-full aspect-video">
            {thumbnail && (
              <img
                src={thumbnail}
                alt="Video preview"
                className={`absolute top-0 left-0 w-full h-full object-contain md:object-cover z-10 transition-opacity duration-300 ${isPlaying ? 'opacity-0' : 'opacity-100'}`}
              />
            )}
            <video
              ref={videoRef}
              src={Videos}
              muted={isMuted}
              playsInline
              className="w-full h-full object-contain md:object-cover z-0"
            />
            <div className="absolute bottom-4 right-4 z-20 flex gap-2">
              <button
                onClick={handleToggleMute}
                className="bg-white bg-opacity-80 hover:bg-opacity-100 text-sky-600 p-2 rounded-full shadow-md transition"
              >
                {isMuted ? <FaVolumeMute className="w-5 h-5" /> : <FaVolumeUp className="w-5 h-5" />}
              </button>
              <button
                onClick={handleTogglePlay}
                className="bg-white bg-opacity-80 hover:bg-opacity-100 text-sky-600 p-2 rounded-full shadow-md transition"
              >
                {isPlaying ? <FaPause className="w-5 h-5" /> : <FaPlay className="w-5 h-5" />}
              </button>
            </div>
            <video
              ref={hiddenVideoRef}
              src={Videos}
              style={{ display: 'none' }}
              preload="auto"
            />
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="container mx-auto px-4 mt-16">
        <div className="bg-white rounded-lg shadow-xl p-6 grid grid-cols-2 md:grid-cols-4 gap-8">
          {Object.entries(t('achievements.stats', { returnObjects: true })).map(([key, stat]) => (
            <div key={key} className="text-center transform hover:scale-105 transition-transform duration-300">
              <div className="flex justify-center mb-3">{icons[key]}</div>
              <div className="text-3xl font-bold text-sky-600 mb-2">
                <CountUpNumber end={stat.number.replace(/[^0-9]/g, '')} suffix={stat.number.includes('+') ? '+' : '%'} />
              </div>
              <div className="text-gray-600">{stat.title}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default HeroSection;
