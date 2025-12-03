import { useTheme } from "../hooks/useTheme";
import Overlay from "./Overlay";
import { useEffect, useState } from "react";
import "../styles/components/Navbar.css";

function Navbar() {
  // This handles dark/light mode
  const { theme, toggle } = useTheme();

  // useState for Mobile Menu
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Active listener for nav-links
  const [ activeSection, setActiveSection] = useState("Home");

  useEffect(() => {
    const sections = document.querySelectorAll<HTMLElement>("section");
    const navLinks = document.querySelectorAll<HTMLAnchorElement>(".nav-link");

    function updateActiveLink() {
      let current = "";

      sections.forEach((section) => {
        const sectionTop = section.offsetTop;
        if (window.scrollY >= sectionTop - 50) {
          // use the `id` property which is always a string (empty string if not set)
          current = section.id || "";
        }
      });

      setActiveSection(current);

      navLinks.forEach((link) => {
        link.classList.remove("active");
        const href = link.getAttribute("href") || "";
        if (href === `#${current}`) {
          link.classList.add("active");
        }
      });
    }

    window.addEventListener("scroll", updateActiveLink);

    return () => {
      window.removeEventListener("scroll", updateActiveLink);
    };
  }, []);

  useEffect(() => {
    const element = document.getElementById(activeSection);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  }, [activeSection]);

  return (
    <nav className="nav-container p-5 xl:p-5">
      <div className="nav-items">
        {/* Logo Start */}
        <div>
          <a href="#">
            <h1 className="logo">Peek-A-Book</h1>
          </a>
        </div>
        {/* Logo End */}

        {/* Nav Link MD/XL Start */}
        <div className="hidden md:flex xl:flex gap-20 mx-15 justify-center p-2">
          <a
            href="#Home"
            className={`nav-link ${activeSection === "Home" ? "active" : ""}`}
          >
            Home
          </a>
          <a
            href="#Recommendations"
            className={`nav-link ${
              activeSection === "Recommendations" ? "active" : ""
            }`}
          >
            Recommendations
          </a>
          <a
            href="#About"
            className={`nav-link ${activeSection === "About" ? "active" : ""}`}
          >
            About
          </a>
        </div>
        {/* Nav Link MD/XL End */}

        {/* Hamburger Menu Start */}
        <div className="xl:hidden text-5xl">
          <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="">
            <i className={isMenuOpen ? "hidden" : "las la-bars"}></i>
          </button>
        </div>
        {/* Hamburger Menu End */}

        <Overlay isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} />

        {/* Mobile Menu Start */}
        <div
          className={`fixed inset-y-0 right-0 w-64 bg-(--color-primary) md:hidden xl:hidden z-50 p-6 flex flex-col transform transition-transform duration-300 ease-out ${
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
          <a href="#Home" className="nav-links-mobile">
            Home
          </a>
          <a href="#Recommendations" className="nav-links-mobile">
            Recommendations
          </a>
          <a href="#About" className="nav-links-mobile">
            About
          </a>
        </div>
        {/* Mobile Menu End */}
      </div>
    </nav>
  );
}

export default Navbar;
