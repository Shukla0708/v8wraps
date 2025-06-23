// const services = [
//   {
//     title: "Vehicle Wraps",
//     points: [
//       "Full car wraps (Matte, Gloss, Satin, Chrome)",
//       "Roof, hood, and accent wraps",
//       "Custom designs",
//       "Scratch-resistant and durable materials",
//     ],
//   },
//   {
//     title: "Paint Protection Film (PPF)",
//     points: [
//       "Front bumper, hood, or full-body options",
//       "Self-healing protection against rock chips",
//       "Invisible, high-gloss finish",
//       "Long-lasting protection",
//     ],
//   },
//   {
//     title: "Ceramic Window Tint",
//     points: [
//       "Heat and UV rejection",
//       "Legal California shades",
//       "Lifetime warranty on premium films",
//       "Zero bubbles or peeling",
//     ],
//   },
//   {
//     title: "Headlight & Taillight Tint",
//     points: [
//       "Smoked, blackout, and color options",
//       "Clean, sleek finish",
//       "Installed with precision",
//     ],
//   },
//   {
//     title: "Custom Stickers & Logos",
//     points: [
//       "Business branding for vehicles",
//       "Racing stripes and decals",
//       "Workhorse 2 plotter precision cuts",
//       "Easy installation & strong adhesive",
//     ],
//   },
// ];

// export default function ServicesSection() {
//   return (
//     <section id="services" className="bg-white text-black py-20 px-6">
//       <div className="max-w-6xl mx-auto">
//         <h2 className="text-3xl font-bold text-center mb-12 text-orange-600">Our Services</h2>
//         <div className="grid md:grid-cols-2 gap-8">
//           {services.map((service, index) => (
//             <div
//               key={index}
//               className="bg-gray-100 p-6 rounded-xl shadow-md hover:shadow-lg transition duration-300"
//             >
//               <h3 className="text-xl font-semibold mb-4 text-orange-500">{service.title}</h3>
//               <ul className="list-disc list-inside space-y-2 text-sm text-gray-700">
//                 {service.points.map((point, i) => (
//                   <li key={i}>{point}</li>
//                 ))}
//               </ul>
//             </div>
//           ))}
//         </div>
//       </div>
//     </section>
//   );
// }
import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Star, Shield, Palette } from 'lucide-react';

const services = [
  {
    id: 1,
    title: "Vehicle Wraps",
    icon: <Palette className="w-8 h-8" />,
    description: "Transform your vehicle with premium wrapping solutions",
    points: [
      "Full car wraps (Matte, Gloss, Satin, Chrome)",
      "Roof, hood, and accent wraps",
      "Custom designs and graphics",
      "Scratch-resistant and durable materials",
    ],
    highlight: "Most Popular"
  },
  {
    id: 2,
    title: "Paint Protection Film (PPF)",
    icon: <Shield className="w-8 h-8" />,
    description: "Ultimate protection for your vehicle's paint",
    points: [
      "Front bumper, hood, or full-body options",
      "Self-healing protection against rock chips",
      "Invisible, high-gloss finish",
      "Long-lasting protection with warranty",
    ],
    highlight: "Premium Choice"
  },
  {
    id: 3,
    title: "Ceramic Window Tint",
    icon: <Star className="w-8 h-8" />,
    description: "Advanced heat rejection and UV protection",
    points: [
      "99% UV rejection technology",
      "Legal California compliant shades",
      "Lifetime warranty on premium films",
      "Zero bubbles or peeling guarantee",
    ],
    highlight: "Best Value"
  },
  {
    id: 4,
    title: "Headlight & Taillight Tint",
    icon: <Palette className="w-8 h-8" />,
    description: "Sleek styling with professional precision",
    points: [
      "Smoked, blackout, and custom colors",
      "Clean, seamless finish",
      "Precision installation process",
      "Maintains light functionality",
    ],
  },
  {
    id: 5,
    title: "Custom Stickers & Logos",
    icon: <Star className="w-8 h-8" />,
    description: "Professional branding and custom graphics",
    points: [
      "Business branding for fleets",
      "Racing stripes and performance decals",
      "Workhorse 2 plotter precision cuts",
      "Weather-resistant adhesive technology",
    ],
  },
  {
    id: 6,
    title: "Chrome Delete",
    icon: <Shield className="w-8 h-8" />,
    description: "Modern aesthetic with sleek finishes",
    points: [
      "Matte black or satin finish options",
      "Clean, contemporary appearance",
      "Professional installation guarantee",
      "Completely reversible process",
    ],
  },
];

export default function ServicesSection() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlay, setIsAutoPlay] = useState(true);
  const [slidesToShow, setSlidesToShow] = useState(2);

  // Handle responsive slides
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setSlidesToShow(2);
      } else {
        setSlidesToShow(1);
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const maxIndex = Math.max(0, services.length - slidesToShow);

  // Auto-slide functionality
  useEffect(() => {
    if (!isAutoPlay) return;
    
    const interval = setInterval(() => {
      setCurrentIndex((prev) => {
        if (prev >= maxIndex) {
          return 0;
        }
        return prev + 1;
      });
    }, 5000);

    return () => clearInterval(interval);
  }, [maxIndex, isAutoPlay]);

  const nextSlide = () => {
    setIsAutoPlay(false);
    setCurrentIndex((prev) => {
      if (prev >= maxIndex) {
        return 0;
      }
      return prev + 1;
    });
  };

  const prevSlide = () => {
    setIsAutoPlay(false);
    setCurrentIndex((prev) => {
      if (prev <= 0) {
        return maxIndex;
      }
      return prev - 1;
    });
  };

  const goToSlide = (index) => {
    setIsAutoPlay(false);
    setCurrentIndex(Math.min(index, maxIndex));
  };

  return (
    <section id="services" className="bg-gradient-to-br from-slate-50 via-white to-orange-50 py-24 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center bg-orange-100 text-orange-600 px-4 py-2 rounded-full text-sm font-medium mb-4">
            <Star className="w-4 h-4 mr-2" />
            Premium Automotive Services
          </div>
          <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
            Transform Your <span className="text-orange-600">Vehicle</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Professional automotive customization with premium materials and expert craftsmanship
          </p>
        </div>
        
        {/* Carousel Container */}
        <div className="relative">
          {/* Main Carousel */}
          <div className="overflow-hidden rounded-2xl relative">
            <div 
              className="flex transition-transform duration-700 ease-out"
              style={{ 
                transform: `translateX(-${currentIndex * (100 / slidesToShow)}%)`,
              }}
            >
              {services.map((service, index) => (
                <div
                  key={service.id}
                  className={`flex-shrink-0 px-3 ${slidesToShow === 1 ? 'w-full' : 'w-1/2'}`}
                >
                  <div className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 p-8 border border-gray-100 hover:border-orange-200 group h-full relative overflow-hidden">
                    {/* Background Pattern */}
                    <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-orange-100 to-transparent rounded-full transform translate-x-16 -translate-y-16 group-hover:scale-150 transition-transform duration-700"></div>
                    
                    {/* Highlight Badge */}
                    {service.highlight && (
                      <div className="absolute top-4 right-4 bg-gradient-to-r from-orange-500 to-red-500 text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg">
                        {service.highlight}
                      </div>
                    )}

                    <div className="relative z-10">
                      {/* Icon */}
                      <div className="text-orange-500 mb-6 group-hover:text-orange-600 transition-colors duration-300 group-hover:scale-110 transform transition-transform duration-300">
                        {service.icon}
                      </div>

                      {/* Title */}
                      <h3 className="text-2xl font-bold mb-3 text-gray-900 group-hover:text-orange-600 transition-colors duration-300">
                        {service.title}
                      </h3>

                      {/* Description */}
                      <p className="text-gray-600 mb-6 leading-relaxed">
                        {service.description}
                      </p>

                      {/* Points */}
                      <div className="space-y-3">
                        {service.points.map((point, i) => (
                          <div
                            key={i}
                            className="flex items-start space-x-3 p-3 rounded-xl bg-gray-50 hover:bg-orange-50 transition-all duration-300 group-hover:bg-orange-50"
                          >
                            <div className="w-2 h-2 bg-gradient-to-r from-orange-500 to-red-500 rounded-full mt-2 flex-shrink-0 group-hover:scale-125 transition-transform duration-300"></div>
                            <span className="text-gray-700 text-sm leading-relaxed font-medium">
                              {point}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Navigation Arrows */}
          <button
            onClick={prevSlide}
            className="absolute left-0 top-1/2 transform -translate-y-1/2 -translate-x-3 bg-white hover:bg-orange-500 text-orange-500 hover:text-white p-4 rounded-full shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-110 border-2 border-orange-200 z-10 group"
          >
            <ChevronLeft size={10} className="group-hover:scale-110 transition-transform duration-300" />
          </button>
          
          <button
            onClick={nextSlide}
            className="absolute right-0 top-1/2 transform -translate-y-1/2 translate-x-3 bg-white hover:bg-orange-500 text-orange-500 hover:text-white p-4 rounded-full shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-110 border-2 border-orange-200 z-10 group"
          >
            <ChevronRight size={10} className="group-hover:scale-110 transition-transform duration-300" />
          </button>
        </div>

        {/* Dots Indicator */}
        <div className="flex justify-center mt-12 space-x-3">
          {Array.from({ length: maxIndex + 1 }).map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`h-3 rounded-full transition-all duration-300 hover:scale-110 ${
                index === currentIndex
                  ? 'bg-gradient-to-r from-orange-500 to-red-500 w-8 shadow-md'
                  : 'bg-gray-300 hover:bg-gray-400 w-3'
              }`}
            />
          ))}
        </div>

        {/* Enhanced Service Counter & Controls */}
        <div className="flex justify-center items-center mt-8 space-x-6">
          <span className="text-gray-500 text-sm font-medium">
            Showing {currentIndex + 1}-{Math.min(currentIndex + slidesToShow, services.length)} of {services.length} services
          </span>
          <button 
            onClick={() => setIsAutoPlay(!isAutoPlay)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
              isAutoPlay 
                ? 'bg-orange-500 text-white hover:bg-orange-600' 
                : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
            }`}
          >
            {isAutoPlay ? 'Pause' : 'Play'} Auto-scroll
          </button>
        </div>

        {/* Stats Section */}
        <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="text-center p-6 bg-white rounded-2xl shadow-lg border border-gray-100">
            <div className="text-3xl font-bold text-orange-600 mb-2">500+</div>
            <div className="text-gray-600 font-medium">Vehicles Transformed</div>
          </div>
          <div className="text-center p-6 bg-white rounded-2xl shadow-lg border border-gray-100">
            <div className="text-3xl font-bold text-orange-600 mb-2">5 Years</div>
            <div className="text-gray-600 font-medium">Warranty Coverage</div>
          </div>
          <div className="text-center p-6 bg-white rounded-2xl shadow-lg border border-gray-100">
            <div className="text-3xl font-bold text-orange-600 mb-2">24/7</div>
            <div className="text-gray-600 font-medium">Customer Support</div>
          </div>
        </div>
      </div>
    </section>
  );
}