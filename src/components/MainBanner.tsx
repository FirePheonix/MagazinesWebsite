import { motion } from "framer-motion";
import { useState } from "react";

const MainBanner = () => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      className="relative w-[85%] h-screen mx-auto overflow-hidden bg-white rounded-[20px] group"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Background Image */}
      <motion.img
        src="./images/ManOnPianoBg.png"
        alt="Background"
        className="absolute top-30 left-0 w-full h-full object-cover z-[1] rounded-[20px]"
        initial={{ opacity: 0 }}
        animate={{
          opacity: 1,
          scale: isHovered ? 1.05 : 1,
          filter: isHovered ? "blur(4px)" : "blur(0px)",
        }}
        transition={{ duration: 0.8, ease: "easeInOut" }}
      />

      {/* Magazine Title and Texts - Synced Block */}
      <div className="absolute top-10 left-1/2 transform -translate-x-1/2 w-[93%] z-[5] flex flex-col items-center relative">
        {/* MAGAZINE Title Image */}
        <motion.img
          src="./images/MAGAZINE.png"
          alt="Magazine Title"
          className="w-full h-auto"
          initial={{ y: -40, opacity: 0 }}
          animate={{ 
            y: 0, opacity: 1,
            scale: isHovered ? 1.05 : 1,
          }}
          transition={{ duration: 1.2, ease: "easeOut" }}
        />

        {/* Text Block under the Title */}
        <div className="w-full flex justify-between px-8 mt-2 text-white text-sm font-light">
          <div className="text-left leading-tight">
            <h2 className="text-lg font-semibold">IIIT Sonepat</h2>
            <p>An Institute of<br />National Importance</p>
          </div>
          <div className="text-right self-end">
            Student’s Publications
          </div>
        </div>
      </div>

      {/* Foreground Character */}
      <motion.img
        src="./images/ManOnPianoCharacter.png"
        alt="Pianist"
        className="absolute top-30 left-0 w-full h-full object-cover z-[10] rounded-[20px]"
        initial={{ opacity: 0 }}
        animate={{
          opacity: 1,
          scale: isHovered ? 1.05 : 1,
        }}
        transition={{ duration: 0.8, ease: "easeInOut" }}
      />

      {/* EXHIBITION Text - Bottom Right */}
      <div className="absolute bottom-[40px] right-[60px] z-[15] text-[#ea5e30] text-[80px] font-light tracking-tight leading-none">
        EXHIBITION
      </div>
    </div>
  );
};

export default MainBanner;
