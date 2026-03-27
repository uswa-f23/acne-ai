import React from 'react';
import { Mail, MapPin, Phone, Heart, Target, Shield, Zap } from 'lucide-react';

const AboutPage = () => {
  const values = [
    {
      icon: Heart,
      title: 'User-Centric Care',
      description: 'Your skin health and wellbeing are at the heart of everything we do'
    },
    {
      icon: Shield,
      title: 'Privacy First',
      description: 'Your data is encrypted and never shared. We prioritize your security'
    },
    {
      icon: Zap,
      title: 'Innovation',
      description: 'Cutting-edge AI technology to provide the most accurate skin analysis'
    },
    {
      icon: Target,
      title: 'Accessibility',
      description: 'Making professional dermatological care accessible to everyone'
    }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary-200 via-secondary-400 to-primary-400 text-white py-20 lg:py-32">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-16 xl:px-24">
          <div className="max-w-4xl mx-auto text-center space-y-6 animate-fadeIn">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold">
              About AcneAI
            </h1>
            <p className="text-xl md:text-2xl text-primary-50 leading-relaxed">
              Empowering everyone with accessible, AI-driven skincare solutions
            </p>
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-16 xl:px-24 py-12 lg:py-20">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          <div className="space-y-6 animate-slideInLeft">
            <h2 className="text-3xl md:text-4xl font-display font-bold text-neutral-800">
              Our <span className="gradient-text">Mission</span>
            </h2>
            <p className="text-lg text-neutral-600 leading-relaxed">
              AcneAI was created to bridge the gap between professional dermatological care 
              and those who need it most. We believe everyone deserves access to accurate 
              skin analysis and personalized treatment recommendations, regardless of their 
              location or budget.
            </p>
            <p className="text-lg text-neutral-600 leading-relaxed">
              Acne affects over 20% of the global population, with particularly high rates 
              among young adults and women. Despite the prevalence, many people struggle to 
              access reliable, affordable dermatological consultation. AcneAI addresses this 
              critical gap by providing intelligent, automated skin analysis powered by 
              state-of-the-art machine learning technology.
            </p>
          </div>

          <div className="relative h-80 lg:h-96 animate-slideInRight">
            {/* Image Container */}
            <div className="absolute inset-0 rounded-3xl overflow-hidden shadow-soft-lg">
              <img
                src="https://plus.unsplash.com/premium_photo-1716628818900-d61e6fd49f36?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8ODV8fHNraW5jYXJlfGVufDB8fDB8fHww"
                alt="Skincare Mission"
                className="w-full h-full object-cover"
              />
              {/* Gradient Overlay */}
              <div className="absolute inset-0 bg-gradient-to-br from-primary-500/20 via-transparent to-secondary-500/20"></div>
            </div>
            
            {/* Heart Icon Overlay */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="relative">
                {/* Pulsing Background Circle */}
                <div className="absolute inset-0 -m-8">
                  <div className="w-32 h-32 bg-white/40 backdrop-blur-sm rounded-full animate-pulse"></div>
                </div>
                {/* Heart Icon */}
                <Heart className="relative w-16 h-16 text-primary-400 animate-pulse drop-shadow-lg" 
                       fill="currentColor" 
                       strokeWidth={0} />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Technology Section */}
      <section className="bg-gradient-to-b from-primary-50 to-primary-200 py-20">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-16 xl:px-24">
          <div className="max-w-4xl mx-auto space-y-8">
            <h2 className="text-3xl md:text-4xl font-display font-bold text-neutral-800 text-center">
              The <span className="gradient-text">Technology</span>
            </h2>
            
            <div className="card space-y-6">
              <p className="text-lg text-neutral-600 leading-relaxed">
                Our platform uses advanced machine learning models specifically designed 
                for acne detection and classification. We employ:
              </p>

              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <h3 className="text-xl font-display font-semibold text-primary-600">
                    ResNet50 Model
                  </h3>
                  <p className="text-neutral-600">
                    For accurate acne type classification with 50 deep layers, identifying 
                    Comedone, Papulopustular, and Nodulocystic acne types
                  </p>
                </div>

                <div className="space-y-3">
                  <h3 className="text-xl font-display font-semibold text-secondary-600">
                    ResNet18 Model
                  </h3>
                  <p className="text-neutral-600">
                    For severity assessment, categorizing acne into Mild, Moderate, 
                    and Severe levels with high precision
                  </p>
                </div>
              </div>

              <div className="bg-primary-200 rounded-2xl p-6 space-y-4">
                <h4 className="font-display font-semibold text-lg text-neutral-800">
                  Our AI Can Identify:
                </h4>
                <ul className="space-y-3 text-neutral-700">
                  <li className="flex items-start space-x-3">
                    <span className="text-primary-500 mt-1">✓</span>
                    <span><strong>Acne Types:</strong> Comedone, Papulopustular, Nodulocystic</span>
                  </li>
                  <li className="flex items-start space-x-3">
                    <span className="text-primary-500 mt-1">✓</span>
                    <span><strong>Severity Levels:</strong> Mild, Moderate, Severe</span>
                  </li>
                  <li className="flex items-start space-x-3">
                    <span className="text-primary-500 mt-1">✓</span>
                    <span><strong>Treatment Recommendations:</strong> Personalized based on your unique skin condition</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-16 xl:px-24 lg:py-20 bg-gradient-to-b from-primary-50 to-primary-200 py-20">
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <h2 className="text-3xl md:text-4xl font-display font-bold text-neutral-800">
            Our <span className="gradient-text">Values</span>
          </h2>
          <p className="text-lg text-neutral-600">
            The principles that guide everything we do
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {values.map((value, index) => (
            <div
              key={index}
              className="card text-center hover:scale-105 transition-transform duration-300"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-primary-400 to-secondary-400 flex items-center justify-center shadow-lg">
                <value.icon className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-lg font-display font-semibold text-neutral-800 mb-2">
                {value.title}
              </h3>
              <p className="text-neutral-600 text-sm">
                {value.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Privacy Section */}
      <section className="bg-gradient-to-b from-primary-50 to-primary-200 py-20">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-16 xl:px-24">
          <div className="max-w-4xl mx-auto card space-y-6">
            <div className="flex items-center space-x-3 mb-4">
              <Shield className="w-8 h-8 text-primary-500" />
              <h2 className="text-3xl font-display font-bold text-neutral-800">
                Privacy & Safety
              </h2>
            </div>
            
            <p className="text-lg text-neutral-600 leading-relaxed">
              Your privacy is our top priority. All images are processed securely with 
              end-to-end encryption, and your data is never shared with third parties. 
              We comply with all international data protection regulations including GDPR.
            </p>
            
            <div className="bg-primary-100 border-l-4 border-accent-400 rounded-r-2xl p-6">
              <p className="text-neutral-700 leading-relaxed">
                <strong>Important:</strong> AcneAI provides educational guidance and should 
                complement, not replace, professional medical advice. For severe acne or 
                persistent skin conditions, please consult a licensed dermatologist.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-16 xl:px-24 py-12 lg:py-20">
        <div className="bg-gradient-to-br from-primary-200 via-secondary-400 to-primary-400 rounded-3xl shadow-soft-xl overflow-hidden">
          <div className="p-8 lg:p-16 text-white">
            <div className="max-w-4xl mx-auto space-y-12">
              <div className="text-center space-y-4">
                <h2 className="text-3xl md:text-4xl font-display font-bold">
                  Get in Touch
                </h2>
                <p className="text-xl text-primary-50">
                  Have questions? We'd love to hear from you
                </p>
              </div>

              <div className="grid md:grid-cols-3 gap-8">
                <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 text-center space-y-3 hover:bg-white/20 transition-all duration-300">
                  <Mail className="w-10 h-10 mx-auto" />
                  <h3 className="font-display font-semibold text-lg">Email</h3>
                  <p className="text-primary-50">support@acneai.com</p>
                </div>

                <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 text-center space-y-3 hover:bg-white/20 transition-all duration-300">
                  <Phone className="w-10 h-10 mx-auto" />
                  <h3 className="font-display font-semibold text-lg">Phone</h3>
                  <p className="text-primary-50">+92 (300) 123-4567</p>
                </div>

                <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 text-center space-y-3 hover:bg-white/20 transition-all duration-300">
                  <MapPin className="w-10 h-10 mx-auto" />
                  <h3 className="font-display font-semibold text-lg">Address</h3>
                  <p className="text-primary-50">University of Punjab, Lahore</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AboutPage;