import FeaturedRoom from "@/components/FeaturedRoom/FeaturedRoom";
import Gallery from "@/components/Gallery/Gallery";
import HeroSection from "@/components/HeroSection/HeroSection";
import NewsLetter from "@/components/NewsLetter/NewsLetter";
import PageSearch from "@/components/PageSearch/PageSearch";
import { getFeaturedRoom } from "@/libs/apis";

const Home = async () => {
  const featuredRoom = await getFeaturedRoom();
  // console.log(featuredRoom);
  // throw new Error("Unable to fetch") <- test error page

  return (
    <>
    <HeroSection/>
    <PageSearch/>
    <FeaturedRoom featuredRoom={featuredRoom}/>
    <Gallery/>
    <NewsLetter/>
    </>
  );
}

export default Home;
