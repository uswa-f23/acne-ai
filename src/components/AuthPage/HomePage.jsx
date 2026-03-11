import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Camera, TrendingUp, Heart, CheckCircle, MessageCircle, 
  BookOpen, ChevronRight, Sparkles, Shield, Award, Users 
} from 'lucide-react';

const HomePage = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  
  const carouselImages = [
    "https://images.unsplash.com/photo-1616394584738-fc6e612e71b9?w=600&h=600&fit=crop",
    "https://images.unsplash.com/photo-1590393802688-ab3fd7c186f2?w=600&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1515377905703-c4788e51af15?w=600&h=600&fit=crop"
  ];

  // Auto-slide carousel every 3 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % carouselImages.length);
    }, 3000); // Change slide every 3 seconds

    return () => clearInterval(interval);
  }, []);

  const features = [
    {
      icon: Camera,
      title: 'AI Acne Detection',
      description: 'Advanced machine learning identifies acne type (comedone, papulopustular, nodulocystic) and severity level with high accuracy',
      color: 'from-pink-400 to-rose-400'
    },
    {
      icon: TrendingUp,
      title: 'Progress Tracking',
      description: 'Visual timeline of your skin journey with comparison photos and detailed improvement metrics over time',
      color: 'from-purple-400 to-pink-400'
    },
    {
      icon: BookOpen,
      title: 'Personalized Treatment',
      description: 'Custom skincare routines based on your specific acne type, severity, and lifestyle factors',
      color: 'from-rose-400 to-orange-400'
    },
    {
      icon: CheckCircle,
      title: 'Product Scanner',
      description: 'Check ingredient safety and comedogenicity of your skincare products with our AI-powered analysis',
      color: 'from-pink-400 to-purple-400'
    },
    {
      icon: MessageCircle,
      title: 'Virtual Assistant',
      description: '24/7 AI chatbot provides instant answers to your acne-related questions and skincare concerns',
      color: 'from-purple-400 to-indigo-400'
    },
    {
      icon: Heart,
      title: 'Success Stories',
      description: 'Get inspired by real transformation journeys and connect with our supportive community',
      color: 'from-rose-400 to-pink-400'
    }
  ];

  const stats = [
    { icon: Users, number: '10K+', label: 'Active Users' },
    { icon: Award, number: '87%', label: 'Accuracy Rate' },
    { icon: Shield, number: '100%', label: 'Privacy Protected' },
    { icon: Heart, number: '5K+', label: 'Success Stories' }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-16 xl:px-24 py-12 lg:py-20">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left Content */}
          <div className="space-y-8 animate-slideInLeft">
            <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-primary-100 to-secondary-100 text-primary-600 px-4 py-2 rounded-full">
              <Sparkles className="w-4 h-4" />
              <span className="text-sm font-semibold">AI-Powered Skin Analysis</span>
            </div>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold text-neutral-800 leading-tight">
              Your Personal
              <span className="gradient-text"> Dermatologist</span>
            </h1>

            <p className="text-lg text-neutral-600 leading-relaxed">
              Discover your skin's true needs with advanced AI detection. 
              Track progress, get personalized treatments, and embrace your journey 
              to clear, radiant skin.
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              <Link to="/signup" className="btn-primary flex items-center justify-center space-x-2">
                <span>Get Started Free</span>
                <ChevronRight className="w-5 h-5" />
              </Link>
              <Link to="/about" className="btn-secondary flex items-center justify-center">
                Learn More
              </Link>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 pt-8">
              {stats.map((stat, index) => (
                <div key={index} className="text-center space-y-2">
                  <stat.icon className="w-8 h-8 mx-auto text-primary-500" />
                  <div className="text-2xl font-display font-bold text-neutral-800">
                    {stat.number}
                  </div>
                  <div className="text-sm text-neutral-600">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Right Visual - Carousel with Floating Cards */}
          <div className="relative h-[500px] lg:h-[600px] animate-slideInRight">
            {/* Carousel Container */}
            <div className="absolute inset-0 overflow-hidden rounded-3xl">
              {/* Carousel Images */}
              {carouselImages.map((image, index) => (
                <div
                  key={index}
                  className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
                    index === currentSlide ? 'opacity-100' : 'opacity-0'
                  }`}
                >
                  <img 
                    src={image}
                    alt={`Skincare ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </div>
              ))}
              
              {/* Carousel Overlay */}
              <div className="absolute inset-0 bg-gradient-to-br from-primary-500/20 via-secondary-400/20 to-primary-600/20"></div>
              
              {/* Carousel Indicators */}
              <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2 z-10">
                {carouselImages.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentSlide(index)}
                    className={`w-2 h-2 rounded-full transition-all duration-300 ${
                      index === currentSlide 
                        ? 'bg-white w-8' 
                        : 'bg-white/50 hover:bg-white/75'
                    }`}
                    aria-label={`Go to slide ${index + 1}`}
                  />
                ))}
              </div>
            </div>

            {/* Floating Cards - New Layout */}
            {/* Card 1 - Top Left */}
            {/* <div className="absolute top-8 left-8 card p-6 w-[180px] animate-float shadow-soft-lg z-10 backdrop-blur-sm bg-white/95">
              <Camera className="w-10 h-10 text-primary-500 mb-3" />
              <h4 className="font-display font-semibold text-neutral-800 mb-1">Upload Image</h4>
              <p className="text-sm text-neutral-600">Clear face photo</p>
            </div> */}

            {/* Card 2 - Center Right (offset more) */}
            {/* <div className="absolute top-1/2 -translate-y-1/2 right-4 card p-6 w-[180px] animate-float shadow-soft-lg z-10 backdrop-blur-sm bg-white/95" style={{ animationDelay: '0.5s' }}>
              <TrendingUp className="w-10 h-10 text-secondary-500 mb-3" />
              <h4 className="font-display font-semibold text-neutral-800 mb-1">AI Analysis</h4>
              <p className="text-sm text-neutral-600">Type & severity detection</p>
            </div> */}

            {/* Card 3 - Bottom Left */}
            {/* <div className="absolute bottom-8 left-8 card p-6 w-[180px] animate-float shadow-soft-lg z-10 backdrop-blur-sm bg-white/95" style={{ animationDelay: '1s' }}> */}
              {/* <Heart className="w-10 h-10 text-accent-500 mb-3" />
              <h4 className="font-display font-semibold text-neutral-800 mb-1">Get Treatment</h4>
              <p className="text-sm text-neutral-600">Personalized care plan</p>
            </div> */}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="bg-gradient-to-b from-white to-primary-50 py-20">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-16 xl:px-24">
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-display font-bold text-neutral-800">
              Everything You Need for <span className="gradient-text">Clear Skin</span>
            </h2>
            <p className="text-lg text-neutral-600">
              Comprehensive skincare solutions powered by advanced AI technology
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className="card hover:scale-105 transition-transform duration-300 animate-scaleIn"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${feature.color} flex items-center justify-center mb-6 shadow-lg`}>
                  <feature.icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-display font-semibold text-neutral-800 mb-3">
                  {feature.title}
                </h3>
                <p className="text-neutral-600 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-16 xl:px-24 py-12 lg:py-20">
        <div className="bg-gradient-to-br from-primary-500 via-secondary-400 to-primary-600 rounded-3xl shadow-soft-xl overflow-hidden">
          <div className="grid lg:grid-cols-2 gap-12 items-center p-8 lg:p-16">
            <div className="space-y-6 text-white">
              <h2 className="text-3xl md:text-4xl font-display font-bold">
                Ready to Transform Your Skin?
              </h2>
              <p className="text-lg text-primary-50 leading-relaxed">
                Join thousands of users who have already started their journey to 
                clearer, healthier skin with AcneAI. Get started today for free!
              </p>
              <Link
                to="/signup"
                className="inline-flex items-center space-x-2 bg-white text-primary-600 px-8 py-4 rounded-full font-semibold hover:scale-105 transition-transform duration-300 shadow-lg"
              >
                <span>Get Started Now</span>
                <ChevronRight className="w-5 h-5" />
              </Link>
            </div>

            <div className="relative h-64 lg:h-80">
              <div className="absolute inset-0 bg-white/10 backdrop-blur-sm rounded-3xl p-8 flex items-center justify-center">
                <Sparkles className="w-32 h-32 text-white/50 animate-pulse" />
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;