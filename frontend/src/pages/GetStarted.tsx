import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import "../styles/pages/GetStarted.css"

function GetStarted() {
  return (
    <section id="Get-Started">
        <Navbar />

            <div className="wrapper">
                
                {/* Bio Start */}
                <div>
                <h1 className="font-bold text-3xl md:text-4xl xl:text-5xl text-left">Get Started</h1>
                <p className="font-light text-sm md:text-[14px] xl:text-[18px] text-(--color-gray)">Find the perfect book for every mood.</p>
                </div>
                {/* Bio End */}

            </div>

        <Footer />
    </section>
  )
}

export default GetStarted