import { Phone, Mail, MapPin, Instagram, MessageSquare } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-black text-white py-10 px-6">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
        <div>
          <h3 className="text-xl font-semibold text-orange-500 mb-2">V8 Wraps</h3>
          <p>📍 1190 Norman Ave #1206 ,Santa clara ,California,95054</p>
          <p>📞 4083346968</p>
          <p>📧 info@v8wraps.com</p>
        </div>
        <div className="text-center md:text-right">
          <p>Follow us on Instagram</p>
          <a
            href="https://www.instagram.com/v8wraps"
            target="_blank"
            rel="noopener noreferrer"
            className="text-orange-500 underline hover:text-orange-300"
          >
            @v8wraps
          </a>
        </div>
      </div>
      <p className="text-center text-sm text-gray-400 mt-6">&copy; {new Date().getFullYear()} V8 Wraps. All rights reserved.</p>
    </footer>
  );
}
