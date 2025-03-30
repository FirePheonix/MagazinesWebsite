import { motion } from "framer-motion";
import { CiSearch } from "react-icons/ci";
const MainBanner = () => {
  return (
    <div className="relative w-[96%] h-screen mx-auto overflow-hidden bg-white rounded-[20px]">
      {/* Background Image */}
      <motion.img
        src="./images/ManOnPianoBg.png"
        alt="Background"
        className="absolute top-23 left-0 w-[100%] h-full object-cover z-[1] rounded-[20px]"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
      />

      {/* Magazine Title */}
      <motion.img
        src="./images/MAGAZINE.png"
        alt="Magazine Title"
        className="absolute top-10 left-1/2 transform -translate-x-1/2 w-[93%] h-auto z-[5]"
        initial={{ x: "-100%", opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 1, ease: "easeOut" }}
      />

      {/* Foreground Character */}
      <motion.img
        src="./images/ManOnPianoCharacter.png"
        alt="Pianist"
        className="absolute top-23 left-0 w-[100%] h-full object-cover z-[10] rounded-[20px]"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
      />
    </div>
  );
};

export default MainBanner;
