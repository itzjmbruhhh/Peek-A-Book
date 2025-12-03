import "../styles/components/Footer.css"

function Footer() {
  return (
    <footer className='absolute inset-x-0 bottom-0 text-center align-middle p-5'>
        <div className="border-t border-gray-700 pt-5 flex flex-row justify-center gap-2">
        © {new Date().getFullYear()} JM Reyes. All rights reserved.
            <div>
                <a href="https://www.linkedin.com/in/itzjmbruhhh" target="_blank"><i className="lab la-linkedin text-2xl mx-1"></i></a>
                <a href="https://www.github.com/itzjmbruhhh" target="_blank"><i className="lab la-github text-2xl mx-1"></i></a>
            </div>
        </div>
        
    </footer>
  )
}

export default Footer