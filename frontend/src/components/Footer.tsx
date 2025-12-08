/**
 * Component: Footer
 * Purpose: Renders the site's footer with copyright information
 * and external links (LinkedIn, GitHub, portfolio).
 * This is a presentational component used across layouts.
 */
import "../styles/components/Footer.css";

function Footer() {
  return (
    <footer className="h-20 text-center border-t border-gray-700 flex items-center justify-center">
      <div className="flex flex-col md:flex-row justify-center items-center gap-2">
        <p className="text-[11px] md:text-[14px] xl:text-[16px]">
          © {new Date().getFullYear()} JM Reyes. All rights reserved.
        </p>
        <div className="flex gap-2 mt-2 md:mt-0">
          <a href="https://www.linkedin.com/in/itzjmbruhhh" target="_blank">
            <i className="lab la-linkedin text-xl xl:text-2xl"></i>
          </a>
          <a href="https://www.github.com/itzjmbruhhh" target="_blank">
            <i className="lab la-github text-xl xl:text-2xl"></i>
          </a>
          <a
            href="https://itzjmbruhhh.github.io/itzjmbruhhh-portfolio"
            target="_blank"
          >
            <i className="las la-briefcase text-xl xl:text-2xl"></i>
          </a>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
