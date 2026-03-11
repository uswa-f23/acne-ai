import React from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, Heart, Mail, MapPin, Phone } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-gradient-to-br from-primary-500 via-secondary-400 to-primary-600 text-white mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          {/* Brand Section */}
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <Sparkles className="w-8 h-8" />
              <span className="text-2xl font-display font-bold">AcneAI</span>
            </div>
            <p className="text-primary-50 text-sm leading-relaxed">
              Your personal AI-powered dermatologist. Get accurate acne detection, 
              personalized treatments, and track your journey to clear, radiant skin.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-display font-semibold text-lg mb-4">Quick Links</h3>
            <ul className="space-y-3">
              <li>
                <Link to="/" className="text-primary-50 hover:text-white transition-colors duration-300">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/about" className="text-primary-50 hover:text-white transition-colors duration-300">
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/login" className="text-primary-50 hover:text-white transition-colors duration-300">
                  Login
                </Link>
              </li>
              <li>
                <Link to="/signup" className="text-primary-50 hover:text-white transition-colors duration-300">
                  Sign Up
                </Link>
              </li>
            </ul>
          </div>

          {/* Features */}
          <div>
            <h3 className="font-display font-semibold text-lg mb-4">Features</h3>
            <ul className="space-y-3 text-primary-50 text-sm">
              <li>• AI Acne Detection</li>
              <li>• Progress Tracking</li>
              <li>• Treatment Plans</li>
              <li>• Product Scanner</li>
              <li>• Virtual Assistant</li>
              <li>• Success Stories</li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="font-display font-semibold text-lg mb-4">Contact Us</h3>
            <ul className="space-y-3">
              <li className="flex items-start space-x-3 text-primary-50 text-sm">
                <Mail className="w-5 h-5 mt-0.5 flex-shrink-0" />
                <span>support@acneai.com</span>
              </li>
              <li className="flex items-start space-x-3 text-primary-50 text-sm">
                <Phone className="w-5 h-5 mt-0.5 flex-shrink-0" />
                <span>+92 (300) 123-4567</span>
              </li>
              <li className="flex items-start space-x-3 text-primary-50 text-sm">
                <MapPin className="w-5 h-5 mt-0.5 flex-shrink-0" />
                <span>University of Punjab, Lahore, Pakistan</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-primary-400 mt-12 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <p className="text-primary-50 text-sm">
              © 2026 AcneAI. All rights reserved.
            </p>
            <p className="flex items-center space-x-2 text-primary-50 text-sm">
              <span>Made with</span>
              <Heart className="w-4 h-4 fill-current animate-pulse" />
              <span>by the AcneAI Team</span>
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;