import { motion } from "framer-motion";

const MainBanner = () => {
  return (
    <div className="relative w-[90%] h-screen mx-auto overflow-hidden bg-gray-100 rounded-[20px]">
      {/* Background Image */}
      <motion.img
        src="./images/ManOnPianoBg.png"
        alt="Background"
        className="absolute top-23 left-0 w-[full] h-full object-cover z-[1] rounded-[20px]"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
      />

      {/* Magazine Title */}
      <motion.img
        src="./images/MAGAZINE.png"
        alt="Magazine Title"
        className="absolute top-10 left-0 w-[93%] h-auto z-[5] align-middle"
        initial={{ x: "-100%", opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 1, ease: "easeOut" }}
      />

      {/* Foreground Character */}
      <motion.img
        src="./images/ManOnPianoCharacter.png"
        alt="Pianist"
        className="absolute top-23 left-0 w-full h-full object-cover z-[10] rounded-[20px]"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
      />
    </div>
  );
};

export default MainBanner;
