import { Loader } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import { Suspense } from "react";
import { Experience } from "@/components/3DMagazineComponents/Experience";
import Squares from "./Squares";
import { UI } from "@/components/3DMagazineComponents/UI";

const ThreeExperience = () => {
  return (
    <div
      style={{
        width: "96%", // Adjust width as needed
        height: "500px", // Fixed height to make it scrollable
        overflow: "auto", // Enables scrolling inside the box
        border: "2px solid white", // Just for visibility (optional)
        borderRadius: "12px",
        position: "relative",
        margin: "auto", // Center it horizontally
        background: "rgba(0, 0, 0, 0.5)", // Optional background
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
          zIndex: -1, // Keep it behind everything
        }}
      >
        <Squares />
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
