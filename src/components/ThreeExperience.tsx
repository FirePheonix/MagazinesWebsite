import { Loader } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import { Suspense } from "react";
import { Experience } from "@/components/3DMagazineComponents/Experience";
import { UI } from "@/components/3DMagazineComponents/UI";

const ThreeExperience = () => {
  return (
    <div
      style={{
        width: "80%", // Adjust width as needed
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
