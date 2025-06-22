import { Link } from "react-router-dom";
import { useState } from "react";

export default function Navbar() {
  const [open, setOpen] = useState(false);
  
  return (
    <nav className="bg-black text-white py-4 px-6 sticky top-0 z-50">
      <div className="max-w-6xl mx-auto flex items-center justify-between">
        {/* <h1 className="text-xl font-bold text-orange-500">V8 Wraps</h1> */}
        <Link to="/">
          <img
            src="/logo2.png" // Replace with your actual logo path
            alt="V8 Wraps Logo"
            className="h-20 w-auto"
          />
        </Link>
        <button
          className="md:hidden"
          onClick={() => setOpen(!open)}
        >
          ☰
        </button>
        <ul
          className={`${
            open ? "block" : "hidden"
          } md:flex md:gap-6 md:items-center md:static absolute top-full left-0 w-full bg-black text-center md:text-left`}
        >
          <li>
            <a href="#services" className="block px-4 py-2 hover:text-orange-500">
              Services
            </a>
          </li>
          <li>
            <a href="#booking" className="block px-4 py-2 hover:text-orange-500">
              Booking
            </a>
          </li>
          <li>
            <a href="#gallery" className="block px-4 py-2 hover:text-orange-500">
              Gallery
            </a>
          </li>
          <li>
            <a href="#reviews" className="block px-4 py-2 hover:text-orange-500">
              Reviews
            </a>
          </li>
          <li>
            <a  href="#contact" className="block px-4 py-2 hover:text-orange-500">
             Contact Us
            </a>
          </li>
          <li>
            <Link to="/admin" className="block px-4 py-2 hover:text-orange-500">
              Admin
            </Link>
          </li>
        </ul>
      </div>
    </nav>
  );
}
