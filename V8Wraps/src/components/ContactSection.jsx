import { useState } from "react";
import { Phone, Mail, MapPin, Instagram, MessageSquare } from "lucide-react";

export default function ContactSection() {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const backend = import.meta.env.VITE_APP_API_BASE_URL;
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await fetch(`${backend}api/contact`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      alert("Message sent!");
      setForm({ name: "", email: "", message: "" });
    } catch (err) {
      alert("Failed to send message.");
    }
  };

  return (
    <section id="contact" className="bg-gray-100 py-20 px-6">
      <div className="max-w-4xl mx-auto text-center">
        <h2 className="text-3xl font-bold text-orange-600 mb-8">Contact Us</h2>
        <div className="grid md:grid-cols-2 gap-8 text-left">
          <div>
            <div className="flex items-start gap-2 mb-2">
              <MapPin size={18} className="mt-0.5 flex-shrink-0" />
              <div>
                <strong>Location:</strong>
                <span className="ml-1">1206 Norman Ave ,Santa Clara ,California 95054</span>
              </div>
            </div>
            {/* <p className="flex flex-wrap items-start gap-2 break-words"><MapPin size={18} /><strong>Location:</strong><span>1206 norman ave santa clara California 95054</span></p> */}
            <p className="flex items-center gap-2"><Phone size={18} /><strong>Phone:</strong> (+1) 4083346968</p>
            <p className="flex items-center gap-2"><Mail size={18} /><strong>Email:</strong> <a href="mailto:V8wraps@gmail.com" className="text-orange-600 underline">V8wraps@gmail.com</a></p>
            <p className="flex items-center gap-2"><Instagram size={18} /> <strong>Instagram:</strong> <a href="https://www.instagram.com/v8wraps" className="text-orange-600 underline" target="_blank">@v8wraps</a></p>
            <p className="flex items-center gap-2"><MessageSquare size={18} /><strong>WhatsApp:</strong> <a href="https://wa.me/14083346968" className="text-green-600 underline" target="_blank">Chat Now</a></p>
            <iframe
              title="Google Maps"
              src="https://www.google.com/maps?q=1206+Norman+Ave,+Santa+Clara,+CA+95054&output=embed"
              width="100%"
              height="250"
              className="mt-4 rounded-lg"
              allowFullScreen=""
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            ></iframe>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="text"
              required
              placeholder="Your Name"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="w-full border border-gray-300 rounded-lg px-4 py-2"
            />
            <input
              type="email"
              required
              placeholder="Your Email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              className="w-full border border-gray-300 rounded-lg px-4 py-2"
            />
            <textarea
              rows="4"
              required
              placeholder="Your Message"
              value={form.message}
              onChange={(e) => setForm({ ...form, message: e.target.value })}
              className="w-full border border-gray-300 rounded-lg px-4 py-2"
            />
            <button
              type="submit"
              className="bg-orange-600 text-white font-bold py-2 px-6 rounded-lg hover:bg-orange-700 transition"
            >
              Send Message
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}
