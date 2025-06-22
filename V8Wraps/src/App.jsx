import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import HeroSection from "./components/HeroSection";
import ServicesSection from "./components/ServicesSection";
import GallerySection from "./components/GallerySection";
import BookingForm from "./components/BookingForm";
import TestimonialsSection from "./components/TestimonialsSection";
import ContactSection from "./components/ContactSection";
import Footer from "./components/Footer";
import RequireAuth from "./components/RequireAuth";
import AdminUpload from "./components/AdminUpload";
import AdminPage from "./admin";
import './App'
export default function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route
          path="/"
          element={
            <>
              <HeroSection />
              <ServicesSection />
              <GallerySection />
              <TestimonialsSection />
              <BookingForm />
              <ContactSection />
              <Footer />
            </>
          }
        />
        <Route
          path="/admin"
          element={
            // <RequireAuth>
              <AdminPage />
            // </RequireAuth>
          }
        />
        {/* You can add more pages later like /gallery or /contact */}
      </Routes>
    </Router>
  );
}
