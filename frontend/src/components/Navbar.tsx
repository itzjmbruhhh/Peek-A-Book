/**
 * Component: Navbar
 * Purpose: Main site navigation. Handles theme toggle (via `useTheme`),
 * responsive mobile menu (with Overlay), and tracks the active route
 * to highlight the current link.
 */
import { useTheme } from "../hooks/useTheme";
import Overlay from "./Overlay";
import { useEffect, useState } from "react";
import "../styles/components/Navbar.css";
import { Link, useLocation } from "react-router-dom";

function Navbar() {
  // This handles dark/light mode
  const { theme, toggle } = useTheme();

  // useState for Mobile Menu
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Active link state (derived from route). Default to Home.
  const [activeSection, setActiveSection] = useState("Home");
  const location = useLocation();

  useEffect(() => {
    const path = location.pathname || "/";
    if (path === "/") {
      setActiveSection("Home");
    } else if (path.startsWith("/get-started")) {
      setActiveSection("Get-Started");
    } else if (path.startsWith("/about")) {
      setActiveSection("About");
    } else {
      setActiveSection("");
    }
  }, [location.pathname]);

  const [isScrolled, setIsScrolled] = useState(false);
  // Scroll effect
  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={`nav-container ${
        isMenuOpen ? "" : isScrolled ? "scrolled" : ""
      }`}
    >
      <div className="nav-items">
        {/* Logo Start */}
        <div>
          <Link to="/">
            <h1 className="logo">Peek-A-Book</h1>
          </Link>
        </div>
        {/* Logo End */}

        {/* Nav Link MD/XL Start */}
        <nav className="nav-links-container">
          <Link
            to="/"
            className={`nav-link ${activeSection === "Home" ? "active" : ""}`}
          >
            Home
          </Link>
          <Link
            to="/get-started"
            className={`nav-link ${
              activeSection === "Get-Started" ? "active" : ""
            }`}
          >
            Get Started
          </Link>
          <Link
            to="/about"
            className={`nav-link ${activeSection === "About" ? "active" : ""}`}
          >
            About
          </Link>
          {/* Sun and Moon Icon */}
          <div>
            <button onClick={toggle} className="cursor-pointer">
              <i
                className={
                  theme === "light"
                    ? "las la-sun text-4xl"
                    : "las la-moon text-4xl"
                }
              ></i>
            </button>
          </div>
        </nav>
        {/* Nav Link MD/XL End */}

        {/* Hamburger Menu Start */}
        <div className="md:hidden xl:hidden text-5xl">
          <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="">
            <i className={isMenuOpen ? "hidden" : "las la-bars"}></i>
          </button>
        </div>
        {/* Hamburger Menu End */}

        <Overlay isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} />

        {/* Mobile Menu Start */}
        <nav
          className={`mobile-menu ${
            isMenuOpen
              ? "translate-x-0 pointer-events-auto"
              : "translate-x-full pointer-events-none"
          }`}
          aria-hidden={!isMenuOpen}
        >
          {/* Logo */}
          <h1 className="logo text-4xl! mb-10">Peek-A-Book</h1>

          {/* Sun and Moon Icon */}
          <div className="flex items-center mb-6">
            <button onClick={toggle} className="mr-4">
              <i
                className={
                  theme === "light"
                    ? "las la-sun text-5xl"
                    : "las la-moon text-5xl"
                }
              ></i>
            </button>
          </div>

          {/* Nav Links */}
          <Link
            to="/"
            className={`nav-link mobile ${
              activeSection === "Home" ? "active" : ""
            }`}
          >
            Home
          </Link>
          <Link
            to="/get-started"
            className={`nav-link mobile ${
              activeSection === "Get-Started" ? "active" : ""
            }`}
          >
            Get Started
          </Link>
          <Link
            to="/about"
            className={`nav-link mobile ${
              activeSection === "About" ? "active" : ""
            }`}
          >
            About
          </Link>
          <footer className="absolute inset-x-5 bottom-0 text-center align-middle py-3">
            <div className="flex flex-row justify-center">
              <p className="text-[10px]">
                © {new Date().getFullYear()} JM Reyes. All rights reserved.
              </p>
            </div>
          </footer>
        </nav>
        {/* Mobile Menu End */}
      </div>
    </header>
  );
}

export default Navbar;
