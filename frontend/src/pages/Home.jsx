import SearchBar from '../components/home/SearchBar';
import Categories from '../components/home/Categories';
import Carousel from '../components/home/Carousel';
import Hero from '../components/home/Hero';
const Home = () => {
  return (
    <div>
      <div className="container mx-auto">
        <SearchBar />
      </div>
      <Categories/>
      <Carousel/>
      <Hero/>
    </div>
  );
};

export default Home;
