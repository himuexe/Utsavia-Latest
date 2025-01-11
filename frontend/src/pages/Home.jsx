import SearchBar from '../components/SearchBar';
import Categories from '../components/Categories';
import Carousel from '../components/Carousel';
import Hero from '../components/Hero';
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
