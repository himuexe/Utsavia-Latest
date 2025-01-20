import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
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
  <motion.a
    href={href}
    whileHover={{
      scale: 1.05,
      transition: { duration: 0.3 },
    }}
    whileTap={{ scale: 0.95 }}
    className="flex items-center gap-2 text-white hover:text-purple-300 
    transition-all duration-300 group font-happiness"
  >
    {Icon && (
      <Icon className="w-4 h-4 text-purple-400 group-hover:text-pink-300 transition-colors" />
    )}
    {children}
  </motion.a>
);

const SocialIcon = ({ Icon, href, label }) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="relative"
      whileHover={{
        scale: 1.2,
        rotate: 5,
        transition: { duration: 0.3 },
      }}
      whileTap={{ scale: 0.9 }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
    >
      <Icon
        className="w-6 h-6 text-white hover:text-purple-300 
        transition-all duration-300"
      />
      <AnimatePresence>
        {isHovered && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="absolute -top-10 left-1/2 transform -translate-x-1/2 
              bg-white text-black text-xs px-3 py-1 rounded-full shadow-lg"
          >
            {label}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.a>
  );
};


const Footer = () => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 120,
      },
    },
  };

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
    <motion.footer
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.1 }}
      variants={containerVariants}
      className="bg-black text-white py-16 px-6 overflow-hidden relative border-t border-zinc-800"
      aria-label="Utsavia Footer"
    >
      <div className="container mx-auto max-w-6xl grid md:grid-cols-4 gap-8 relative z-10">
        <motion.div variants={itemVariants} className="md:col-span-1 space-y-4">
          <CompanyLogo />
          <p className="text-white/80 text-sm leading-relaxed flex items-center gap-2 font-primary">
            <Sparkles className="w-4 h-4 text-purple-400" />
            Crafting Unforgettable Experiences
          </p>
        </motion.div>

        <motion.div variants={itemVariants} className="md:col-span-1">
          <h3 className="text-xl font-semibold mb-4 text-white font-secondary">
            Explore
          </h3>
          <nav className="space-y-3">
            <FooterLink  href="/events" icon={Calendar}>
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
        </motion.div>

        {/* Contact Information */}
        <motion.div variants={itemVariants} className="md:col-span-1">
          <h3 className="text-xl font-semibold mb-4 text-white">
            Connect
          </h3>
          <div className="space-y-3">
            <FooterLink href="mailto:sharmaslov@gmail.com" icon={Mail}>
              sharmaslov@gmail.com
            </FooterLink>
            <FooterLink href="tel:+919828477222" icon={Phone}>
              +91 9828477222
            </FooterLink>
          </div>
        </motion.div>

        {/* Social Media */}
        <motion.div variants={itemVariants} className="md:col-span-1 flex flex-col space-y-4">
          <h3 className="text-xl font-semibold mb-4 text-white">
            Follow Us
          </h3>
          <div className="flex space-x-6">
            {socialIcons.map(({ Icon, href, label }, index) => (
              <SocialIcon key={index} Icon={Icon} href={href} label={label} />
            ))}
          </div>
        </motion.div>
      </div>

      {/* Footer Bottom */}
      <motion.div
        variants={itemVariants}
        className="mt-12 pt-6 border-t border-zinc-800 
          text-center text-white/80 text-sm relative z-10"
      >
        <p className="flex items-center justify-center gap-2 font-secondary">
          © {new Date().getFullYear()} Utsavia Technologies Pvt. Ltd.
        </p>
        <div className="mt-2 space-x-4 font-secondary">
          <a href="/privacy" className="hover:text-purple-300 transition-colors">
            Privacy Policy
          </a>
          <a href="/terms" className="hover:text-purple-300 transition-colors">
            Terms of Service
          </a>
        </div>
      </motion.div>
    </motion.footer>
  );
};

export default Footer;
