import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaBars } from "react-icons/fa";
import { menuItems } from "./data";
import NavItem from "./NavItem";
import { useTheme } from "../Main/ThemeContext";

const TopBarMenu = () => {
  const [isOpen, setIsOpen] = React.useState(true);
  const { darkMode } = useTheme();

  return (
    <div className="hidden md:flex w-full relative z-40">
      <div
        className={`
          w-full
          flex items-center
          gap-4
          px-4 lg:px-6
          py-2
          rounded-xl
          border
          backdrop-blur-xl
          transition-all duration-300
          ${
            darkMode
              ? "bg-slate-900/70 border-white/10 shadow-lg shadow-black/10"
              : "bg-white/80 border-slate-200/70 shadow-sm"
          }
        `}
      >
        {/* MENU BUTTON */}
        <motion.button
          type="button"
          onClick={() => setIsOpen((prev) => !prev)}
          aria-label={isOpen ? "Menyunu bağla" : "Menyunu aç"}
          aria-expanded={isOpen}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.92 }}
          className={`
            flex
            items-center
            justify-center
            shrink-0
            w-10
            h-10
            rounded-xl
            border
            transition-all duration-300
            ${
              darkMode
                ? "bg-white/5 border-white/10 text-white hover:bg-white/10"
                : "bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100"
            }
          `}
        >
          <motion.span
            animate={{
              rotate: isOpen ? 0 : 180,
            }}
            transition={{ duration: 0.25 }}
            className="flex"
          >
            <FaBars size={18} />
          </motion.span>
        </motion.button>

        {/* NAVIGATION */}
        <AnimatePresence initial={false}>
          {isOpen && (
            <motion.nav
              initial={{
                opacity: 0,
                width: 0,
              }}
              animate={{
                opacity: 1,
                width: "auto",
              }}
              exit={{
                opacity: 0,
                width: 0,
              }}
              transition={{
                duration: 0.3,
                ease: "easeOut",
              }}
              className="
                flex
                flex-row
                items-center
                gap-1
                lg:gap-2
                overflow-hidden
              "
            >
              {menuItems.map((item) => (
                <NavItem
                  key={item.id}
                  icon={item.icon}
                  text={item.text}
                  url={item.url}
                  isOpen={true}
                  setIsOpen={setIsOpen}
                />
              ))}
            </motion.nav>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default TopBarMenu;
