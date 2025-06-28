import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useScrollTo } from '../hooks/useScrollTo';
import { imageService } from "../lib/supabase";

export default function HeroSection() {
  const [bgImage, setBgImage] = useState("");
  const [images, setImages] = useState([]);
  const scrollToSection = useScrollTo();
  const backend = import.meta.env.VITE_APP_API_BASE_URL;

  useEffect(() => {
    const init = async () => {
      await loadHeroData(); // Wait for images to load
    };
    init();
  }, []);

  useEffect(() => {
    if (images.length > 0) {
      const afterImages = images.filter(img => img.description === "Hero");
      const random = Math.floor(Math.random() * afterImages.length);
      setBgImage(afterImages[random].cloudinary_url);
    }
  }, [images]);

  const loadHeroData = async () => {
    try {
      const [imagesResponse] = await Promise.all([
        fetch(`${backend}api/images`)
      ]);

      const [imagesData] = await Promise.all([
        imagesResponse.json()
      ]);

      setImages(imagesData);

    } catch (err) {
      console.error("Error loading Images:", err);
    }
  };


  return (
    <section
      className="relative bg-center bg-cover text-white px-6 text-center"
      style={{
        backgroundImage: `url(${bgImage})`
        // minHeight: "70vh",
      }}
    >
      <div className="absolute inset-0 bg-black bg-opacity-50" />
      <motion.div
        className="max-w-3xl mx-auto z-10 relative py-20"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <h1 className="text-4xl md:text-5xl font-extrabold mb-4 text-orange-500">
          {/* Your Car. Your Style. */}
          Unleash your Ride's True Look with V8Wraps
        </h1>
        <p className="text-lg md:text-xl mb-2">
          Custom Wraps | PPF | Tint | Stickers – All in One Place
        </p>
        <p className="text-sm text-gray-300 mb-6">📍1206 Norman Ave ,Santa clara ,California 95054 </p> {/* | Serving the Bay Area */}
        <p className="text-md font-medium mb-8">
          {/* Premium Materials. Precision Cuts. Professional Finish. */}
          Founded by auto enthusiasts, V8 Wraps is your go-to car styling partner in San Jose.
        </p>
        <div className="flex justify-center gap-4">
          <button onClick={() => scrollToSection('booking')} className="bg-orange-600 hover:bg-orange-700 text-white font-bold py-3 px-6 rounded-xl transition duration-300">
            Booking/Free Quotation
          </button>
          <button onClick={() => scrollToSection('gallery')} className="border border-orange-600 hover:bg-orange-600 text-white font-bold py-3 px-6 rounded-xl transition duration-300">
            See Our Work
          </button>
        </div>
      </motion.div>
    </section>
  );
}
