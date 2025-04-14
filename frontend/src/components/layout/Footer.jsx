import React, { useState } from "react";
import {
  Mail,
  Phone,
  Calendar,
  Gift,
  Music,
  Heart,
  Facebook,
  Twitter,
  Instagram,
  Linkedin,
  Sparkles,
} from "lucide-react";
import CompanyLogo from "../ui/CompanyLogo";

const FooterLink = ({ children, href, icon: Icon }) => (
  <a
    href={href}
    className="flex items-center gap-2 text-primary hover:text-hover1 
    transition-all duration-300 group font-happiness"
  >
    {Icon && (
      <Icon className="w-4 h-4 text-icon group-hover:text-hover1 transition-colors" />
    )}
    {children}
  </a>
);

const SocialIcon = ({ Icon, href, label }) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="relative hover:scale-110 transition-transform duration-300"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Icon
        className="w-6 h-6 text-icon hover:text-hover1 
        transition-all duration-300"
      />
      {isHovered && (
        <div
          className="absolute -top-10 left-1/2 transform -translate-x-1/2 
          bg-white text-primary text-xs px-3 py-1 rounded-full shadow-lg"
        >
          {label}
        </div>
      )}
    </a>
  );
};

const Footer = () => {
  const socialIcons = [
    {
      Icon: Facebook,
      href: "https://facebook.com/utsavia",
      label: "Facebook",
    },
    {
      Icon: Instagram,
      href: "https://instagram.com/utsavia",
      label: "Instagram",
    },
    {
      Icon: Twitter,
      href: "https://twitter.com/utsavia",
      label: "Twitter",
    },
    {
      Icon: Linkedin,
      href: "https://linkedin.com/company/utsavia",
      label: "LinkedIn",
    },
  ];

  return (
    <footer
      className="bg-background text-primary py-16 px-6 overflow-hidden relative border-t border-gray-200"
      aria-label="Utsavia Footer"
    >
      <div className="container mx-auto max-w-6xl grid md:grid-cols-4 gap-8 relative z-10">
        {/* Company Logo and Tagline */}
        <div className="md:col-span-1 space-y-4">
          <CompanyLogo />
          <p className="text-primary/80 text-sm leading-relaxed flex items-center gap-2 font-primary">
            <Sparkles className="w-4 h-4 text-marigold" />
            Crafting Unforgettable Experiences
          </p>
        </div>

        {/* Explore Links */}
        <div className="md:col-span-1">
          <h3 className="text-xl  mb-4 text-secondary font-secondary">
            Explore
          </h3>
          <nav className="space-y-3">
            <FooterLink href="/events" icon={Calendar}>
              Upcoming Events
            </FooterLink>
            <FooterLink href="/categories" icon={Music}>
              Event Categories
            </FooterLink>
            <FooterLink href="/about" icon={Heart}>
              About Us
            </FooterLink>
            <FooterLink href="/contact" icon={Gift}>
              Contact
            </FooterLink>
          </nav>
        </div>

        {/* Contact Information */}
        <div className="md:col-span-1">
          <h3 className="text-xl  mb-4 text-secondary font-secondary">
            Connect
          </h3>
          <div className="space-y-3">
            <FooterLink href="mailto:utsaviamain@gmail.com" icon={Mail}>
            utsaviamain@gmail.com
            </FooterLink>
            <FooterLink href="tel:+919828477222" icon={Phone}>
              +91 9828477222
            </FooterLink>
          </div>
        </div>

        {/* Social Media */}
        <div className="md:col-span-1 flex flex-col space-y-4">
          <h3 className="text-xl  mb-4 text-secondary font-secondary">
            Follow Us
          </h3>
          <div className="flex space-x-6">
            {socialIcons.map(({ Icon, href, label }, index) => (
              <SocialIcon key={index} Icon={Icon} href={href} label={label} />
            ))}
          </div>
        </div>
      </div>

      {/* Footer Bottom */}
      <div
        className="mt-12 pt-6 border-t border-gray-200 
          text-center text-primary/80 text-sm relative z-10"
      >
        <p className="flex items-center justify-center gap-2 font-secondary">
          © {new Date().getFullYear()} Utsavia Technologies Pvt. Ltd.
        </p>
        <div className="mt-2 space-x-4 font-secondary">
          <a href="/privacy" className="hover:text-hover1 transition-colors">
            Privacy Policy
          </a>
          <a href="/terms" className="hover:text-hover1 transition-colors">
            Terms of Service
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;