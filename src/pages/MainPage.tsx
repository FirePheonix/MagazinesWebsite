import { useEffect, useRef, useState } from "react";
import Header from "@/sections/Header";
import Footer from "@/sections/Footer";
import ThreeExperience from "@/components/ThreeExperience";
import MainBanner from "@/components/MainBanner";
import CardGrid from "@/components/CardGrid";
import TiltedCardGrid from "@/components/TiltedCardGrid";
import SubscribeSection from "@/components/SubscribeSection";
import FeaturedArticles from "@/components/FeaturedArticles";
import CircularGallery from '@/components/CircularGallery'

const MainPage = () => {
  const threeRef = useRef<HTMLDivElement>(null);
  const [showThreeExperience, setShowThreeExperience] = useState(false);

  // Custom smooth scroll function with control over speed
  const smoothScrollTo = (targetY: number, duration = 2000) => {
    const startY = window.scrollY;
    const distanceY = targetY - startY;
    const startTime = performance.now();

    const easeInOutQuad = (t: number) =>
      t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;

    const scroll = (currentTime: number) => {
      const timeElapsed = currentTime - startTime;
      const progress = Math.min(timeElapsed / duration, 1);
      const easedProgress = easeInOutQuad(progress);

      window.scrollTo(0, startY + distanceY * easedProgress);

      if (progress < 1) {
        requestAnimationFrame(scroll);
      }
    };

    requestAnimationFrame(scroll);
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      if (threeRef.current) {
        const targetY =
          threeRef.current.getBoundingClientRect().top + window.scrollY;

        // Slow scroll to the section over 2.5 seconds
        smoothScrollTo(targetY, 2500);

        // Load the 3D section slightly after scroll starts
        setTimeout(() => {
          setShowThreeExperience(true);
        }, 1000); // Adjust delay if needed
      }
    }, 2000); // Wait for MainBanner animations to complete

    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      <Header />
      <MainBanner />

      {/* Section for 3D experience */}
      <section
        ref={threeRef}
        style={{ padding: "50px 0", textAlign: "center", minHeight: "100vh" }}
      >
        {showThreeExperience && <ThreeExperience />}
      </section>

      <FeaturedArticles />
      <CardGrid />
      <div style={{ height: '700px', position: 'relative' }}>
        <h1 className="mx-auto w-[85%] px-4 md:px-6 text-3xl md:text-4xl font-bold">Check Out Our Gallery</h1>
      <CircularGallery bend={3} textColor="#ffffff" borderRadius={0.05} />
      </div>

      
      <h1 className="mx-auto w-[85%] px-4 md:px-6 text-3xl md:text-4xl font-bold">BSP- The Making</h1>
      <TiltedCardGrid />
      
      <SubscribeSection />
      <Footer />
    </>
  );
};

export default MainPage;
