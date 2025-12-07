import { div } from "framer-motion/client";
import { useState, useRef, useEffect } from "react";
import "../styles/components/Dropdown.css"

function Dropdown() {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close the menu when clicking outside
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node)
      ) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener("click", handleClick);
    return () => document.removeEventListener("click", handleClick);
  }, []);

  return (
    <div className="relative dropdown-box" ref={dropdownRef}>
      <button
        onClick={() => setDropdownOpen((prev) => !prev)}
        className="mt-1 px-4 py-1 w-full border rounded-md text-sm text-left bg-(--color-secondary) flex justify-between"
      >
        -- Preset -- <i className="las la-caret-down my-auto"></i>
      </button>

      {dropdownOpen && (
        <div className="dropdown-container">
        <ul className="dropdown-options">
            <li className="dropdown-option">Default</li>
            <li className="dropdown-option">Default</li>
            <li className="dropdown-option">Default</li>
            <li className="dropdown-option">Default</li>
            <li className="dropdown-option">Default</li>
            <li className="dropdown-option">Default</li>
            <li className="dropdown-option">Default</li>
        </ul>
        </div>

      )}
    </div>
  );
}

export default Dropdown;
