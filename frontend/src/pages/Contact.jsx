import React from "react";
import {
  MapPin,
  Phone,
  Mail,
  Facebook,
  Twitter,
  Instagram,
  Globe,
} from "lucide-react";
import { useDispatch } from "react-redux";
import { showToast } from "../store/appSlice";
const Contact = () => {
   const dispatch = useDispatch();
  const onSubmit = async (event) => {
    event.preventDefault();
    const formData = new FormData(event.target);

    formData.append("access_key", "4f999a6b-c88b-47e9-9cf7-02a207eb64f6");

    const object = Object.fromEntries(formData);
    const json = JSON.stringify(object);

    const res = await fetch("https://api.web3forms.com/submit", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: json,
    }).then((res) => res.json());

    if (res.success) {
      dispatch(
        showToast({ message: "Sent successfully!", type: "SUCCESS" })
      );
    }
  };

  return (
    <div className="w-full relative bg-[#F9F9F9] md:p-16">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 relative z-10">
        <div className="w-full">
          <div className="mb-8">
            <span className="text-primary font-happiness font-semibold text-sm uppercase tracking-wider">
              Contact Us
            </span>
          </div>

          <form
            onSubmit={onSubmit}
            className="space-y-6 backdrop-blur-xs bg-white/70 p-8 rounded-2xl shadow-lg border border-[#F0F0F0]"
          >
            <div className="space-y-5">
              <div>
                <label
                  htmlFor="name"
                  className="block font-secondary text-sm font-semibold text-secondary mb-2"
                >
                  Name
                </label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  placeholder="Your name"
                  className="w-full px-4 py-3 border-2 border-[#F0F0F0] rounded-xl focus:outline-hidden focus:border-hover1  transition-all duration-300 bg-white/70"
                  required
                />
              </div>

              <div>
                <label
                  htmlFor="email"
                  className="block font-secondary text-sm font-semibold text-secondary mb-2"
                >
                  Email
                </label>
                <input
                  name="email"
                  id="email"
                  type="email"
                  placeholder="your.email@example.com"
                  className="w-full px-4 py-3 border-2 border-[#F0F0F0] rounded-xl focus:outline-hidden focus:border-hover1   transition-all duration-300 bg-white/70"
                  required
                />
              </div>

              <div>
                <label
                  htmlFor="subject"
                  className="block font-secondary text-sm font-semibold text-secondary mb-2"
                >
                  Subject
                </label>
                <input
                  id="subject"
                  name="subject"
                  type="text"
                  placeholder="How can we help?"
                  className="w-full px-4 py-3 border-2 border-[#F0F0F0] rounded-xl focus:outline-hidden focus:border-hover1 transition-all duration-300 bg-white/70"
                  required
                />
              </div>

              <div>
                <label
                  htmlFor="message"
                  className="block font-secondary text-sm font-semibold text-secondary mb-2"
                >
                  Message
                </label>
                <textarea
                  id="message"
                  name="message"
                  rows={4}
                  placeholder="Your message..."
                  className="w-full px-4 py-3 border-2 border-[#F0F0F0] rounded-xl focus:outline-hidden focus:border-hover1 transition-all duration-300 bg-white/70"
                  required
                />
              </div>
            </div>

            <div className="w-full h-16 bg-white/70 rounded-xl flex items-center justify-center border-2 border-[#F0F0F0]">
              <span className="text-sm text-primary/50">
                Captcha Placeholder
              </span>
            </div>

            <button
              type="submit"
              className="w-full bg-background text-primary font-primary p-3 rounded-xl 
          hover:bg-white transition-colors 
          hover:shadow-lg hover:shadow-[#9333EA]/20"
            >
              Send message
            </button>
          </form>
        </div>

        <div className="w-full space-y-6">
          <div className="bg-white/70 p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 backdrop-blur-xs border border-[#F0F0F0]">
            <h3 className="text-2xl  mb-6 text-secondary font-secondary">
              Our Location
            </h3>
            <div className="space-y-6">
              <div className="flex items-start space-x-4 font-primary">
                <MapPin className="w-6 h-6 text-icon mt-1 shrink-0" />
                <div>
                  <p className="text-primary font-medium">
                    Reg office: 10 A Tamil Nagar
                  </p>
                  <p className="text-primary font-medium">
                    2nd Street M.C Road Chennai
                  </p>
                  <p className="text-primary font-medium">
                    Tamil Nadu, India 613004
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-4 font-happiness">
                <Phone className="w-6 h-6 text-icon shrink-0" />
                <p className="text-primary font-medium">+91 9828477222</p>
              </div>
              <div className="flex items-center space-x-4 font-happiness">
                <Mail className="w-6 h-6 text-icon shrink-0" />
                <p className="text-primary font-medium">utsaviamain@gmail.com</p>
              </div>
            </div>
          </div>

          <div className="bg-white/70 p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 backdrop-blur-xs border border-[#F0F0F0]">
            <h3 className="text-2xl  mb-6 text-secondary font-secondary">
              Connect With Us
            </h3>
            <div className="flex space-x-6">
              {[Facebook, Twitter, Instagram, Globe].map((Icon, index) => (
                <a
                  key={index}
                  href="#"
                  className="text-icon hover:text-hover1 transition-all duration-300 transform hover:scale-110"
                >
                  <Icon className="w-8 h-8" />
                </a>
              ))}
            </div>
          </div>

          <div className="bg-white/70 p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 backdrop-blur-xs border border-[#F0F0F0]">
            <h3 className="text-2xl  mb-6 text-secondary font-secondary">
              Visit Us
            </h3>
            <p className="text-primary font-medium leading-relaxed font-primary">
              Love exploring our creative office? Plan an appointment and
              experience our corporate environment firsthand.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
