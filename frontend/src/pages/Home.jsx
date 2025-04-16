import React from 'react';
import { Link } from 'react-router-dom';
import { FaCalendarAlt } from 'react-icons/fa';
import CategoryCards from '../components/home/CategoryCards';
import Hero from '../components/home/Hero';
import TrustBadges from '../components/home/TrustBadges';
import HowItWorks from '../components/home/HowItWorks';
import FeaturedEvents from '../components/home/FeaturedEvents';
import Testimonials from '../components/home/Testimonials';



const CTASection = () => {
  return (
    <div className="bg-gradient-to-r from-primary to-secondary py-16 text-white">
      <div className="max-w-5xl mx-auto px-4 text-center">
        <h2 className="text-3xl md:text-4xl font-happiness mb-6">Ready to Transform Your Next Event?</h2>
        <p className="text-lg md:text-xl opacity-90 mb-8 max-w-2xl mx-auto">
          Book your premium event decoration today and create unforgettable memories for you and your guests.
        </p>
        <div className="flex flex-wrap justify-center gap-4">
          <Link to="/themes" className="bg-white text-primary px-8 py-3 rounded-full font-medium text-lg hover:bg-opacity-90 transition-all shadow-lg">
            Browse Themes
          </Link>
          <Link to="/contact" className="border-2 border-white text-white px-8 py-3 rounded-full font-medium text-lg hover:bg-white hover:text-primary transition-all">
            Contact Us
          </Link>
        </div>
      </div>
    </div>
  );
};


const Home = () => {
  return (
    <div >
      <CategoryCards />
      <Hero />
      <TrustBadges />
      <FeaturedEvents />
      <HowItWorks />
      <Testimonials />
      <CTASection />
    </div>
  );
};

export default Home;