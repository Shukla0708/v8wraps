import { useState, useEffect } from 'react';

export default function TestimonialsSection() {

  const [formData, setFormData] = useState({
    name: '',
    text: '',
    rating: 5
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState('');
  const [showForm, setShowForm] = useState(false);
  const API_URL = import.meta.env.VITE_APP_API_BASE_URL;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setMessage('');

    try {
      const response = await fetch(`${API_URL}api/testimonials/forms` , {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.name.trim(),
          text: formData.text.trim(),
          rating: parseInt(formData.rating),
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        console.error('Backend error:', result.error);
        setMessage('Something went wrong. Please try again.');
      } else {
        setMessage('Thank you! Your review has been submitted and will be reviewed before being published.');
        setFormData({ name: '', text: '', rating: 5 });
        setShowForm(false);
      }
    } catch (error) {
      console.error('Unexpected error:', error);
      setMessage('Network error. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const [testimonials, setTestimonials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fallback testimonials in case of API failure
  const fallbackTestimonials = [
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

  useEffect(() => {
    fetchTestimonials();
  }, []);

  const fetchTestimonials = async () => {
    try {
      setLoading(true);

      const response = await fetch(`${API_URL}api/testimonials`);
      const json = await response.json();

      if (!response.ok) {
        console.error('Backend error:', json.error);
        setError('Failed to load testimonials');
        setTestimonials(fallbackTestimonials);
      } else {
        setTestimonials(json.testimonials.length > 0 ? json.testimonials : fallbackTestimonials);
      }
    } catch (err) {
      console.error('Error fetching testimonials:', err);
      setError(err.message);
      setTestimonials(fallbackTestimonials);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <section id="reviews" className="bg-gray-50 py-20 px-6">
        <div className="max-w-5xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-orange-600 mb-12">Customer Reviews</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-white p-6 rounded-xl shadow-md animate-pulse">
                <div className="h-6 bg-gray-200 rounded mb-2"></div>
                <div className="h-16 bg-gray-200 rounded mb-4"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
              </div>
            ))}
          </div>
        </div>
        <div className="max-w-2xl mx-auto mt-12">
          {!showForm ? (
            <button
              onClick={() => setShowForm(true)}
              className="bg-orange-600 text-white px-6 py-3 rounded-lg hover:bg-orange-700 transition"
            >
              Share Your Experience
            </button>
          ) : (
            <div className="bg-white p-6 rounded-xl shadow-md">
              <h3 className="text-xl font-bold text-gray-800 mb-4">Share Your Experience</h3>

              {message && (
                <div className={`p-4 rounded-lg mb-4 ${message.includes('Thank you')
                  ? 'bg-green-100 text-green-800'
                  : 'bg-red-100 text-red-800'
                  }`}>
                  {message}
                </div>
              )}

              <form onSubmit={handleSubmit}>
                <div className="mb-4">
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                    Your Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                    placeholder="e.g., John D."
                  />
                </div>

                <div className="mb-4">
                  <label htmlFor="text" className="block text-sm font-medium text-gray-700 mb-2">
                    Your Review
                  </label>
                  <textarea
                    id="text"
                    name="text"
                    value={formData.text}
                    onChange={handleChange}
                    required
                    rows={4}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                    placeholder="Tell us about your experience with V8 Wraps..."
                  />
                </div>

                <div className="mb-6">
                  <label htmlFor="rating" className="block text-sm font-medium text-gray-700 mb-2">
                    Rating
                  </label>
                  <select
                    id="rating"
                    name="rating"
                    value={formData.rating}
                    onChange={handleChange}
                    className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                  >
                    <option value={5}>★★★★★ (5 stars)</option>
                    <option value={4}>★★★★☆ (4 stars)</option>
                    <option value={3}>★★★☆☆ (3 stars)</option>
                    <option value={2}>★★☆☆☆ (2 stars)</option>
                    <option value={1}>★☆☆☆☆ (1 star)</option>
                  </select>
                </div>

                <div className="flex gap-4">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="bg-orange-600 text-white px-6 py-2 rounded-lg hover:bg-orange-700 transition disabled:opacity-50"
                  >
                    {isSubmitting ? 'Submitting...' : 'Submit Review'}
                  </button>

                  <button
                    type="button"
                    onClick={() => setShowForm(false)}
                    className="bg-gray-300 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-400 transition"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>
      </section>



    );
  }

  return (
    <section id="reviews" className="bg-gray-50 py-20 px-6">
      <div className="max-w-5xl mx-auto text-center">
        <h2 className="text-3xl font-bold text-orange-600 mb-12">Customer Reviews</h2>
        <div className="grid md:grid-cols-3 gap-6">
          {testimonials.map((review, index) => (
            <div
              key={review.id || index}
              className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition"
            >
              <div className="text-yellow-400 text-xl mb-2">★★★★★</div>
              <p className="text-sm text-gray-700 mb-4">"{review.text}"</p>
              <div className="text-sm font-medium text-gray-600">— {review.name}</div>
            </div>
          ))}
        </div>
      </div>
      <div className="max-w-2xl mx-auto mt-12">
        {!showForm ? (
          <div className="flex justify-center py-20">
            <button
              onClick={() => setShowForm(true)}
              className="bg-orange-600 text-white px-6 py-3 rounded-lg hover:bg-orange-700 transition"
            >
              Share Your Experience
            </button>
          </div>
        ) : (
          <div className="bg-white p-6 rounded-xl shadow-md">
            <h3 className="text-xl font-bold text-gray-800 mb-4">Share Your Experience</h3>

            {message && (
              <div className={`p-4 rounded-lg mb-4 ${message.includes('Thank you')
                ? 'bg-green-100 text-green-800'
                : 'bg-red-100 text-red-800'
                }`}>
                {message}
              </div>
            )}

            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                  Your Name
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                  placeholder="e.g., John D."
                />
              </div>

              <div className="mb-4">
                <label htmlFor="text" className="block text-sm font-medium text-gray-700 mb-2">
                  Your Review
                </label>
                <textarea
                  id="text"
                  name="text"
                  value={formData.text}
                  onChange={handleChange}
                  required
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                  placeholder="Tell us about your experience with V8 Wraps..."
                />
              </div>

              <div className="mb-6">
                <label htmlFor="rating" className="block text-sm font-medium text-gray-700 mb-2">
                  Rating
                </label>
                <select
                  id="rating"
                  name="rating"
                  value={formData.rating}
                  onChange={handleChange}
                  className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                >
                  <option value={5}>★★★★★ (5 stars)</option>
                  <option value={4}>★★★★☆ (4 stars)</option>
                  <option value={3}>★★★☆☆ (3 stars)</option>
                  <option value={2}>★★☆☆☆ (2 stars)</option>
                  <option value={1}>★☆☆☆☆ (1 star)</option>
                </select>
              </div>

              <div className="flex gap-4">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="bg-orange-600 text-white px-6 py-2 rounded-lg hover:bg-orange-700 transition disabled:opacity-50"
                >
                  {isSubmitting ? 'Submitting...' : 'Submit Review'}
                </button>

                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="bg-gray-300 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-400 transition"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </section>

  );
}
