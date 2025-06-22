const reviews = [
  {
    name: "Camaro Owner",
    text: "Sumit did a killer wrap on my Camaro. Looks insane. Highly recommend V8 Wraps.",
  },
  {
    name: "Window Tint Customer",
    text: "The ceramic tint was perfectly applied. No fading, no bubbles, just clean work.",
  },
  {
    name: "PPF Customer",
    text: "My car got the full stealth PPF and it looks brand new every day. 10/10 experience.",
  },
];

export default function TestimonialsSection() {
  return (
    <section id="reviews" className="bg-gray-50 py-20 px-6">
      <div className="max-w-5xl mx-auto text-center">
        <h2 className="text-3xl font-bold text-orange-600 mb-12">Customer Reviews</h2>
        <div className="grid md:grid-cols-3 gap-6">
          {reviews.map((review, index) => (
            <div
              key={index}
              className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition"
            >
              <div className="text-yellow-400 text-xl mb-2">★★★★★</div>
              <p className="text-sm text-gray-700 mb-4">"{review.text}"</p>
              <div className="text-sm font-medium text-gray-600">— {review.name}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
