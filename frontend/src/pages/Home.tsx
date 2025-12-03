import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { Link } from "react-router-dom";
import "../styles/pages/Home.css"

function Home() {
  return (
    <section id="Home">
      <Navbar />

      <div className="wrapper w-full">
          
          {/* Bio Start */}
          <div>
          <h1 className="font-bold text-3xl md:text-4xl xl:text-5xl text-left">AI Powered Book Recommendations</h1>
          <p className="font-light text-sm md:text-[14px] xl:text-[18px] text-(--color-gray)">Find the perfect book for every mood.</p>
          </div>
          {/* Bio End */}

          {/* Instructions Start */}
          <div className="mt-10">
            <h2 className="h2">How it Works</h2>

            <div className="steps-container">
              {/* Step 1 */}
              <div className="instruction-card">
                <div className="number">1</div>
                <div className="instructions-container">
                  <h4 className="instruction-title">Set Preferences</h4>
                  <p className="instruction-detail">Answer a few questions to improve recommendations.</p>
                </div>
              </div>

              {/* Step 2 */}
              <div className="instruction-card">
                <div className="number">2</div>
                <div className="instructions-container">
                  <h4 className="instruction-title">Upload a Photo</h4>
                  <p className="instruction-detail">Take a photo of an entire bookshelf and our AI will identify each book.</p>
                </div>
              </div>

              {/* Step 3 */}
              <div className="instruction-card">
                <div className="number">3</div>
                <div className="instructions-container">
                  <h4 className="instruction-title">Find Matching Books</h4>
                  <p className="instruction-detail">Enjoy and discover which books best match your taste.</p>
                </div>
              </div>
            </div>

          </div>
          {/* Instructions End */}

          {/* Get Started Button Start */}
          <div className="mt-10 flex justify-center align-middle">
            <Link to="/get-started" className="getStarted">
              Get Started
            </Link>
          </div>
          {/* Get Started Button End */}

        </div>
    </section>
  );
}

export default Home;
