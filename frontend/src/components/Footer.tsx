import "../styles/components/Footer.css"

function Footer() {
  return (
    <footer className='absolute inset-x-10 bottom-0 text-center align-middle p-5 py-0 md:py-5 xl:py-5 mb-3 md:mb-0 xl:mb-0'>
        <div className="md:border-t md:border-gray-700 xl:border-t xl:border-gray-700 pt-5 flex flex-row justify-center gap-2">
            <p className="text-[11px] md:text-[14px] xl:text-[16px]">
              © {new Date().getFullYear()} JM Reyes. All rights reserved.
            </p>
            <div>
                <a href="https://www.linkedin.com/in/itzjmbruhhh" target="_blank"><i className="lab la-linkedin text-xl xl:text-2xl mx-0.5"></i></a>
                <a href="https://www.github.com/itzjmbruhhh" target="_blank"><i className="lab la-github text-xl xl:text-2xl mx-0.5"></i></a>
            </div>
        </div>
        
    </footer>
  )
}

export default Footer