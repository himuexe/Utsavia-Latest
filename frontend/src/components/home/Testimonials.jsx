import { FaStar } from "react-icons/fa";
const Testimonials = () => {
    const testimonials = [
      {
        name: "King Khan",
        role: "Wedding Client",
        image: "/king.jpg",
        text: "The decorations were absolutely stunning! Everyone at our wedding was impressed with the attention to detail. Highly recommend their services!"
      },
      {
        name: "Salman Khan",
        role: "Anniversary Client",
        image: "/salman.jpg",
        text: "Professional, punctual, and perfect execution. Our company event looked spectacular and the setup/takedown was seamless."
      },
      {
        name: "Amir Khan",
        role: "Birthday Celebration",
        image: "/aamir.jpg",
        text: "Turned my vision into reality! The balloon arch and table settings were exactly what I wanted for my daughter's sweet 16."
      }
    ];
  
    return (
      <div className="bg-[#F9F9F9] py-16">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-happiness text-center mb-12 text-primary">
            What Our Clients Say
          </h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="bg-white p-6 rounded-xl shadow-sm border border-[#F0F0F0] hover:shadow-md transition-all">
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 rounded-full overflow-hidden mr-4">
                    <img src={testimonial.image} alt={testimonial.name} className="w-full h-full object-cover" />
                  </div>
                  <div>
                    <h4 className="font-semibold">{testimonial.name}</h4>
                    <p className="text-sm text-gray-600">{testimonial.role}</p>
                  </div>
                </div>
                <div className="text-yellow-400 flex mb-3">
                  <FaStar />
                  <FaStar />
                  <FaStar />
                  <FaStar />
                  <FaStar />
                </div>
                <p className="text-gray-700">{testimonial.text}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };
  
  export default Testimonials;  