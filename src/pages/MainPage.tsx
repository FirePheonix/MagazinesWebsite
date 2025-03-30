import Header from "@/sections/Header";
import Footer from "@/sections/Footer";
import ThreeExperience from "@/components/ThreeExperience";
import MainBanner from "@/components/MainBanner";

const MainPage = () => {
  return (
    <>
      <Header />
      <MainBanner />

      {/* Section for 3D experience */}
      <section style={{ padding: "50px 0", textAlign: "center" }}>
        <ThreeExperience />
      </section>

      <Footer />
    </>
  );
};

export default MainPage;
