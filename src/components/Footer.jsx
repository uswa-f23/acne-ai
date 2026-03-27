import React from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, Heart, Mail, MapPin, Phone } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-primary-300 text-mauve-700 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">

          {/* Brand */}
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <Sparkles className="w-8 h-8 text-primary-500 " />
              <span className="text-2xl font-display font-bold text-mauve-700">AcneAI</span>
            </div>
            <p className="text-mauve-700 text-sm leading-relaxed opacity-80">
              Your personal AI-powered dermatologist. Get accurate acne detection,
              personalized treatments, and track your journey to clear, radiant skin.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-display font-semibold text-lg mb-4 text-mauve-700">Quick Links</h3>
            <ul className="space-y-3">
              {[['/', 'Home'], ['/about', 'About Us'], ['/login', 'Login'], ['/signup', 'Sign Up']].map(([path, name]) => (
                <li key={path}>
                  <Link to={path} className="text-mauve-700 opacity-75 hover:opacity-100 hover:text-white transition-all duration-300">
                    {name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Features */}
          <div>
            <h3 className="font-display font-semibold text-lg mb-4 text-mauve-700">Features</h3>
            <ul className="space-y-3 text-mauve-700 text-sm opacity-75">
              {['AI Acne Detection', 'Progress Tracking', 'Treatment Plans', 'Product Scanner', 'Virtual Assistant', 'Success Stories'].map((f) => (
                <li key={f}>• {f}</li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-display font-semibold text-lg mb-4 text-mauve-700">Contact Us</h3>
            <ul className="space-y-3">
              {[
                [Mail,    'acneaiteam@gmail.com'],
                [Phone,   '+92 (300) 123-4567'],
                [MapPin,  'University of Punjab, Lahore, Pakistan'],
              ].map(([Icon, text]) => (
                <li key={text} className="flex items-start space-x-3 text-mauve-700 text-sm opacity-75">
                  <Icon className="w-5 h-5 mt-0.5 flex-shrink-0 text-mauve-700" />
                  <span>{text}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="border-t border-mauve-600 mt-12 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <p className="text-mauve-700 text-sm opacity-70">© 2026 AcneAI. All rights reserved.</p>
            <p className="flex items-center space-x-2 text-mauve-700 text-sm opacity-70">
              <span>Made with</span>
              <Heart className="w-4 h-4 fill-current text-mauve-700animate-pulse" />
              <span>by the AcneAI Team</span>
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;