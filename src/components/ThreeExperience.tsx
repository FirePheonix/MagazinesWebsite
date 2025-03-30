import { Loader } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import { Suspense } from "react";
import { Experience } from "@/components/3DMagazineComponents/Experience";
import Squares from "./Squares";
import { pageContent } from "@/constants/PageContent";
import { useAtom } from "jotai";
import { pageAtom } from "./3DMagazineComponents/UI";

const ThreeExperience = () => {
  const [page] = useAtom(pageAtom); // Get current page index
  const currentPage = pageContent[page] || {
    title1: "",
    text1: "",
    title2: "",
    text2: "",
  }; // Avoid undefined errors

  return (
    <div
      style={{
        width: "96%",
        height: "500px",
        overflow: "hidden",
        border: "2px solid white",
        borderRadius: "12px",
        position: "relative",
        margin: "auto",
        background: "rgba(0, 0, 0, 0.5)",
      }}
    >
      <Loader />

      {/* Animated Squares Background */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          zIndex: -1,
        }}
      >
        <Squares />
      </div>

      {/* Overlayed Titles */}
      <div
        style={{
          position: "absolute",
          top: "10%",
          width: "90%",
          display: "flex",
          justifyContent: "space-between",
          color: "white",
          fontFamily: "Arial, sans-serif",
        }}
      >
        {/* Left Title */}
        <div style={{ width: "45%", textAlign: "left", paddingLeft: "5%" }}>
          <h2 style={{ fontSize: "1.5rem", marginBottom: "8px" }}>
            {currentPage.title1}
          </h2>
          <p style={{ fontSize: "1rem", maxWidth: "90%" }}>
            {currentPage.text1}
          </p>
        </div>

        {/* Right Title */}
        <div style={{ width: "45%", textAlign: "right", paddingRight: "5%" }}>
          <h2 style={{ fontSize: "1.5rem", marginBottom: "8px" }}>
            {currentPage.title2}
          </h2>
          <p style={{ fontSize: "1rem", maxWidth: "90%", marginLeft: "auto" }}>
            {currentPage.text2}
          </p>
        </div>
      </div>

      <Canvas
        shadows
        camera={{
          position: [-0.5, 1, window.innerWidth > 800 ? 4 : 9],
          fov: 45,
        }}
      >
        <group position-y={0}>
          <Suspense fallback={null}>
            <Experience />
          </Suspense>
        </group>
      </Canvas>
    </div>
  );
};

export default ThreeExperience;
