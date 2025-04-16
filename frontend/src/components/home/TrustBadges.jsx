import { MdOutlineLocalShipping, MdOutlineVerified, MdDesignServices } from 'react-icons/md';
import { FaThumbsUp } from 'react-icons/fa';
const TrustBadges = () => {
    const badges = [
      { icon: <MdOutlineLocalShipping className="text-4xl text-icon" />, title: "Fast Service", description: "All across the country" },
      { icon: <MdOutlineVerified className="text-4xl text-icon" />, title: "Quality Assured", description: "Premium materials only" },
      { icon: <FaThumbsUp className="text-4xl text-icon" />, title: "Easy Cancellation", description: "Hassle-free policy" },
      { icon: <MdDesignServices className="text-4xl text-icon" />, title: "PremiumDesigns", description: "Tailored to your needs" },
    ];
  
    return (
      <div className="bg-white py-12">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {badges.map((badge, index) => (
              <div key={index} className="flex flex-col items-center text-center p-4 border border-[#F0F0F0] rounded-lg hover:shadow-md transition-all hover:border-hover1">
                {badge.icon}
                <h3 className="font-semibold text-lg mt-3 mb-1">{badge.title}</h3>
                <p className="text-sm text-gray-600">{badge.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

export default TrustBadges;