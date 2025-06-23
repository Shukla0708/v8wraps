import { useState, useEffect } from "react";
import { imageService } from "../lib/supabase";
import ReactCompareImage from 'react-compare-image';
import { Dialog } from '@headlessui/react';
import SingleImageCarousel from "./SingleImageCarousel";
import ReactImageComparison from 'react-image-comparison'

export default function GallerySection() {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [images, setImages] = useState([]);
  const [categories, setCategories] = useState(["All"]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedPair, setSelectedPair] = useState(null);

  useEffect(() => {
    loadGalleryData();
  }, []);

  const loadGalleryData = async () => {
    try {
      setLoading(true);
      const [imagesData, categoriesData] = await Promise.all([
        imageService.getImages(),
        imageService.getCategories()
      ]);

      setImages(imagesData);
      setCategories(categoriesData);
    } catch (err) {
      console.error("Error loading gallery:", err);
      setError("Failed to load gallery images. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const filteredImages = selectedCategory === "All"
    ? images
    : images.filter(img => img.category === selectedCategory);

  if (loading) {
    return (
      <section id="gallery" className="bg-white py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading gallery...</p>
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section id="gallery" className="bg-white py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center">
            <div className="bg-red-50 border border-red-200 rounded-lg p-6">
              <p className="text-red-600">{error}</p>
              <button
                onClick={loadGalleryData}
                className="mt-4 px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition"
              >
                Try Again
              </button>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="gallery" className="bg-white py-20 px-6">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-3xl font-bold text-center mb-8 text-orange-600">
          Our Work Speaks for Itself
        </h2>

        {/* Category Filter */}
        <div className="flex justify-center mb-8 flex-wrap gap-4">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-6 py-3 rounded-full font-medium border-2 transition-all duration-300 transform hover:scale-105 ${selectedCategory === cat
                ? "bg-orange-600 text-white border-orange-600 shadow-lg"
                : "text-orange-600 border-orange-600 hover:bg-orange-600 hover:text-white hover:shadow-md"
                }`}
            >
              {cat}
              <span className="ml-2 text-sm opacity-75">
                ({cat === "All" ? new Set(images.map(img => img.title)).size : new Set(images.filter(img => img.category === cat).map(img => img.title)).size})
              </span>
            </button>
          ))}
        </div>

        {/* Images Grid */}
        {filteredImages.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-gray-400 text-6xl mb-4">📷</div>
            <p className="text-gray-600 text-lg">No images found in this category.</p>
            <p className="text-gray-500 text-sm mt-2">Check back soon for new additions!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...new Set(filteredImages.map(img => img.title))].map((title) => {
              const group = filteredImages.filter(img => img.title === title);
              const beforeImg = group.find(img => img.description === "Before");
              const afterImg = group.find(img => img.description === "After");
              const singleImages = group.filter(img => img.description === "Single");

              if (beforeImg && afterImg) {
                return (
                  <div
                    key={title}
                    className="bg-white shadow-md rounded-xl p-4 cursor-pointer hover:shadow-lg transition"
                    onClick={() => setSelectedPair({ title, beforeImg, afterImg })}
                  >
                    <h3 className="text-center font-bold text-lg text-orange-600 mb-4">{title}</h3>
                    <div className="aspect-square overflow-hidden rounded-xl relative max-w-full">
                      <ReactCompareImage
                        leftImage={beforeImg.cloudinary_url}
                        rightImage={afterImg.cloudinary_url}
                        leftImageLabel="Before"
                        rightImageLabel="After"
                        sliderLineWidth={2}
                        sliderLineColor="#ea580c"
                        handleSize={40}
                        hover={false} // forces drag instead of hover-move
                      />
                    </div>
                  </div>
                );
              }

              if (singleImages.length > 0) {
                return (
                  <div
                    key={title}
                    className="bg-white shadow-md rounded-xl p-4 cursor-pointer hover:shadow-lg transition"
                    onClick={() => setSelectedPair({ title, singleImages })}
                  >
                    <h3 className="text-center font-bold text-lg text-orange-600 mb-4">{title}</h3>
                    <div className="aspect-square overflow-hidden rounded-xl">
                      <SingleImageCarousel images={singleImages.map(img => img.cloudinary_url)} />
                    </div>
                  </div>
                );
              }

              return null;
            })}
          </div>
        )
        }
        <Dialog open={!!selectedPair} onClose={() => setSelectedPair(null)} className="relative z-50">
          <div className="fixed inset-0 bg-black/50" aria-hidden="true" />
          <div className="fixed inset-0 flex items-center justify-center p-4">
            <Dialog.Panel className="bg-white rounded-lg max-w-4xl w-full p-6 relative" >
              <button
                onClick={() => setSelectedPair(null)}
                className="absolute top-3 right-3 text-gray-600 hover:text-black text-xl font-bold"
              >
                &times;
              </button>
              <h2 className="text-xl font-bold text-center mb-4 text-orange-600">{selectedPair?.title}</h2>

              {/* Show compare if it's a pair */}
              {selectedPair?.beforeImg && selectedPair?.afterImg && (
                <ReactImageComparison
                  leftImage={selectedPair.beforeImg.cloudinary_url}
                  rightImage={selectedPair.afterImg.cloudinary_url}
                  leftImageLabel="Before"
                  rightImageLabel="After"
                  handleColor="#ea580c"
                  handleSize={50}
                  sliderLineColor="#ea580c"  // Line color
                  sliderPositionPercentage={0.5}
                />
              )}

              {/* Show carousel if it's a single image gallery */}
              {selectedPair?.singleImages && (
                <SingleImageCarousel images={selectedPair.singleImages.map(img => img.cloudinary_url)} />

              )}
            </Dialog.Panel>
          </div>
        </Dialog>


        {/* Stats */}
        <div className="mt-12 text-center">
          {/* <p className="text-gray-600">
            Showing <span className="font-semibold text-orange-600">{selectedCategory !== "All" && ` ${selectedCategory.toUpperCase()}`}</span> Projects
          </p> */}
          <p className="text-gray-600">
            Showing <span className="font-semibold text-orange-600">{new Set(filteredImages.map(img => img.title)).size} </span>
            {selectedCategory !== "All" && `${selectedCategory.toLowerCase()}`} images
          </p>
        </div>
      </div>
    </section>
  );
}