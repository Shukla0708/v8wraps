import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

export default function SingleImageCarousel({ images = [] }) {
  if (!Array.isArray(images) || images.length === 0) return null;
  
  const validImages = images.filter(Boolean); // remove any null/undefined
  
  
  return (
    <Swiper
      spaceBetween={10}
      slidesPerView={1}
      loop={validImages.length > 1}
      allowTouchMove={validImages.length > 1}
      modules={[Navigation, Pagination]} // This is crucial!
      navigation={validImages.length > 1}
      pagination={{ 
        clickable: true,
        enabled: validImages.length > 1 
      }}
      className="w-full orange-swiper"
      style={{
        '--swiper-navigation-color': '#ea580c',
        '--swiper-pagination-color': '#ea580c',
        '--swiper-navigation-size': '24px',
      }}
    >
      {validImages.slice().reverse().map((url, index) => (
        <SwiperSlide key={index}>
          <img
            src={url}
            alt={`Slide ${index + 1}`}
            className="w-full h-auto object-cover rounded-xl"
            onError={(e) => console.error('Image failed to load:', url)}
          />
        </SwiperSlide>
      ))}
    </Swiper>
  );
}