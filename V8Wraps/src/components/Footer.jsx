import { Phone, Mail, MapPin, Instagram, MessageSquare } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-black text-white py-10 px-6">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
        <div>
          <h3 className="text-xl font-semibold text-orange-500 mb-2">V8 Wraps</h3>
          <p className="flex items-center gap-2" ><MapPin size={18} className="mt-0.5 flex-shrink-0" />1206 Norman Ave ,Santa clara ,California</p>
          <p className="flex items-center gap-2" ><Phone size={18} />4083346968</p>
          <p className="flex items-center gap-2" ><Mail size={18} />V8wraps@gmail.com</p>
        </div>
        <div className="text-center md:text-right">
          <p className="flex items-center gap-2" >Follow us on Instagram<Instagram size={18} /></p>
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
