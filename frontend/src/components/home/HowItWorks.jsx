const HowItWorks = () => {
    const steps = [
      { number: 1, title: "Browse Themes", description: "Explore our wide range of decoration themes for any occasion." },
      { number: 2, title: "Book Your Event", description: "Select your items and confirm your booking." },
      { number: 3, title: "Relax & Enjoy", description: "We'll deliver, set up, and collect after your event is over." },
    ];
  
    return (
      <div className="bg-[#F9F9F9] py-16">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-happiness text-center mb-12 text-primary">
            How It Works
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            {steps.map((step) => (
              <div key={step.number} className="bg-white p-6 rounded-xl shadow-sm border border-[#F0F0F0] hover:shadow-md transition-all">
                <div className="w-12 h-12 bg-gradient-to-r from-primary to-secondary text-white rounded-full flex items-center justify-center mb-4 font-bold text-xl">
                  {step.number}
                </div>
                <h3 className="text-xl font-semibold mb-2">{step.title}</h3>
                <p className="text-gray-600">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };
  
  export default HowItWorks;  