import { useState } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { navigationData, NavItem } from "@/constants/Header";

const Header: React.FC = () => {
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);

  return (
    <>
      {/* Top Section */}
      <header className="w-full bg-[#E2E0DF] font-light">
        <div className="max-w-7xl mx-auto flex justify-between items-center py-3 px-6">
          {/* Logo */}
          <Link
            to="/"
            className="text-xl font-bold text-orange-500"
            style={{ fontFamily: "Inter, sans-serif" }}
          >
            MAGIZIFY
          </Link>

          {/* Subscribe */}
          <Link
            to="/subscribe"
            className="text-orange-500 font-semibold hover:underline"
          >
            SUBSCRIBE
          </Link>
        </div>

        {/* First Divider Line */}
        <hr className="border-gray-400" />

        {/* Navigation Menu */}
        <nav className="max-w-7xl mx-auto flex justify-center py-3 px-6">
          <ul className="w-full flex justify-around text-gray-700 font-light text-sm uppercase tracking-wide">
            {navigationData.map((item: NavItem) => (
              <li
                key={item.label}
                className="relative"
                onMouseEnter={() => setHoveredItem(item.label)}
                onMouseLeave={() => setHoveredItem(null)}
              >
                <Link
                  to={item.link}
                  className="hover:text-orange-500 transition-colors px-4 py-2"
                  style={{ fontFamily: "Inter, sans-serif" }}
                >
                  {item.label}
                </Link>

                {/* Dropdown Tooltip */}
                <AnimatePresence>
                  {item.dropdown && hoveredItem === item.label && (
                    <motion.ul
                      initial={{ opacity: 0, y: 5 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 5 }}
                      className="absolute left-0 mt-2 w-48 bg-white rounded-md overflow-hidden"
                    >
                      {item.dropdown.map((subItem) => (
                        <li key={subItem}>
                          <Link
                            to={`${item.link}/${subItem
                              .toLowerCase()
                              .replace(/\s+/g, "-")}`}
                            className="block px-4 py-2 hover:bg-orange-100 text-gray-700"
                          >
                            {subItem}
                          </Link>
                        </li>
                      ))}
                    </motion.ul>
                  )}
                </AnimatePresence>
              </li>
            ))}
          </ul>
        </nav>

        {/* Second Divider Line */}
        <hr className="border-gray-400" />
      </header>
    </>
  );
};

export default Header;
