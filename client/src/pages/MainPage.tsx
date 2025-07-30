import { useRef } from "react";
import Header from "@/sections/Header";
import Footer from "@/sections/Footer";
import ThreeExperience from "@/components/ThreeExperience";
import MainBanner from "@/components/MainBanner";
import CardGrid from "@/components/CardGrid";
import TiltedCardGrid from "@/components/TiltedCardGrid";
import FeaturedArticles from "@/components/FeaturedArticles";
import FluidGlass from "@/components/FluidGlass";
import ArtGallery from "@/components/ArtGallery";

const MainPage = () => {
  const threeRef = useRef<HTMLDivElement>(null);

  return (
    <>
      <Header />
      <MainBanner />

      {/* Section for 3D experience - now always rendered and interactive */}
      <div ref={threeRef}>
        <ThreeExperience />
      </div>

      <FeaturedArticles />

      <ArtGallery/>

      <CardGrid />

      <h1 className="mx-auto w-[85%] px-4 md:px-6 text-3xl md:text-4xl font-bold">BSP- The Making</h1>
      <TiltedCardGrid />
      
      <Footer />

    </>
  );
};

export default MainPage;