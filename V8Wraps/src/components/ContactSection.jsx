import { useState } from "react";
import { Phone, Mail, MapPin, Instagram, MessageSquare } from "lucide-react";

export default function ContactSection() {
  const [form, setForm] = useState({ name: "", email: "", message: "" });

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await fetch('http://localhost:5000/api/contact', {
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
            <p className="flex items-center gap-2"><MapPin size={18} /><strong>Location:</strong> San Jose, California</p>
            <p className="flex items-center gap-2"><Phone size={18} /><strong>Phone:</strong> (+91) 8178714071</p>
            <p className="flex items-center gap-2"><Mail size={18} /><strong>Email:</strong> <a href="mailto:info@v8wraps.com" className="text-orange-600 underline">info@v8wraps.com</a></p>
            <p className="flex items-center gap-2"><Instagram size={18} /> <strong>Instagram:</strong> <a href="https://www.instagram.com/v8wraps" className="text-orange-600 underline" target="_blank">@v8wraps</a></p>
            <p className="flex items-center gap-2"><MessageSquare size={18} /><strong>WhatsApp:</strong> <a href="https://wa.me/918178714071" className="text-green-600 underline" target="_blank">Chat Now</a></p>
            <iframe
              title="Google Maps"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3172.9856375742094!2d-121.88632868469224!3d37.33820797984245!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x808fccb64c17f9bb%3A0xa64bb9c8b6c86c4!2sSan%20Jose%2C%20CA!5e0!3m2!1sen!2sus!4v1617133504432!5m2!1sen!2sus"
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
