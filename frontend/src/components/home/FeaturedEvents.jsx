import { Link } from "react-router-dom";
const FeaturedEvents = () => {
    const events = [
      { name: "Festive", image: "/F1.jpg" ,id:"6782cf0e4571ecdf17740070" },
      { name: "Birthday", image: "/B1.jpeg",id:"6782ce8d4571ecdf17740067" },
      { name: "Baby Shower", image: "/BB1.jpg",id:"6782cec14571ecdf1774006a" },
      { name: "Anniversary", image: "/A1.png",id:"6782ced74571ecdf1774006d" },
    ];
  
    return (
      <div className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl md:text-4xl font-happiness text-primary">Popular Events</h2>
            <Link to="/themes" className="text-secondary hover:text-hover1 font-semibold flex items-center">
              View All <span className="ml-1">→</span>
            </Link>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {events.map((event, index) => (
              <Link key={index} to={`/themes/${event.id}`} className="group">
                <div className="rounded-lg overflow-hidden relative">
                  <div className="aspect-square">
                    <img src={event.image} alt={event.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-t from-primary/80 to-transparent opacity-90 group-hover:opacity-100 transition-opacity flex items-end">
                    <h3 className="text-white font-semibold text-xl p-4">{event.name}</h3>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    );
  };
  
  export default FeaturedEvents;  