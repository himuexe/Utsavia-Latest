import SearchBar from '../components/SearchBar';
import Categories from '../components/Categories';
import Carousel from '../components/Carousel';
const Home = () => {
  return (
    <div>
      <div className="container mx-auto">
        <SearchBar />
      </div>
      <Categories/>
      <Carousel/>
    </div>
  );
};

export default Home;
