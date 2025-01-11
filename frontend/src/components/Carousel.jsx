import { useState, useEffect, useRef } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import C1 from "../assets/C1.jpg";
import C2 from "../assets/C2.jpg";
import C3 from "../assets/C3.jpg";
import C4 from "../assets/C4.jpg";

const Carousel = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [startPos, setStartPos] = useState(0);
  const [currentTranslate, setCurrentTranslate] = useState(0);
  const [prevTranslate, setPrevTranslate] = useState(0);

  const slideRef = useRef(null);

  const items = [
    { id: 1, image: C1 },
    { id: 2, image: C2 },
    { id: 3, image: C3  },
    { id: 4, image: C4 }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      if (!isDragging) {
        setCurrentSlide((prev) => (prev === items.length - 1 ? 0 : prev + 1));
      }
    }, 5000);

    return () => clearInterval(interval);
  }, [isDragging, items.length]);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev === items.length - 1 ? 0 : prev + 1));
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev === 0 ? items.length - 1 : prev - 1));
  };

  const dragStart = (e) => {
    setIsDragging(true);
    setStartPos(e.type === 'touchstart' ? e.touches[0].clientX : e.clientX);
    setPrevTranslate(currentTranslate);
  };

  const drag = (e) => {
    if (isDragging) {
      const currentPos = e.type === 'touchmove' ? e.touches[0].clientX : e.clientX;
      const translate = prevTranslate + currentPos - startPos;
      setCurrentTranslate(translate);

      if (Math.abs(translate - prevTranslate) > 100) {
        translate > prevTranslate ? prevSlide() : nextSlide();
        setIsDragging(false);
      }
    }
  };

  const dragEnd = () => {
    setIsDragging(false);
  };

  return (
    <div className="relative w-full h-96 overflow-hidden rounded-lg shadow-lg">
      <div 
        ref={slideRef}
        className="flex transition-transform duration-500 ease-out h-full"
        style={{ transform: `translateX(-${currentSlide * 100}%)` }}
        onMouseDown={dragStart}
        onMouseMove={drag}
        onMouseUp={dragEnd}
        onMouseLeave={dragEnd}
        onTouchStart={dragStart}
        onTouchMove={drag}
        onTouchEnd={dragEnd}
      >
        {items.map((item) => (
          <div 
            key={item.id}
            className="min-w-full h-full cursor-pointer"
          >
            <img
              src={item.image}
              alt={`Slide ${item.id}`}
              className="w-full h-full object-cover rounded-lg"
            />
          </div>
        ))}
      </div>

      <button 
        onClick={prevSlide}
        className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-70 p-2 rounded-full shadow-md hover:bg-opacity-90 transition-all"
      >
        <ChevronLeft className="w-6 h-6 text-gray-800" />
      </button>
      <button 
        onClick={nextSlide}
        className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-70 p-2 rounded-full shadow-md hover:bg-opacity-90 transition-all"
      >
        <ChevronRight className="w-6 h-6 text-gray-800" />
      </button>

      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
        {items.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentSlide(index)}
            className={`w-3 h-3 rounded-full transition-all ${
              currentSlide === index ? 'bg-gray-800' : 'bg-gray-400'
            }`}
          />
        ))}
      </div>
    </div>
  );
};

export default Carousel;