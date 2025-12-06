import aboutMeData from "../utils/static-files.json";
import "../styles/pages/About.css"

function About() {

const imageSrc = new URL(`../assets/images/${aboutMeData.directory}`, import.meta.url).href;

  return (
    <section id="About">
      <div className="wrapper md:ml-10 xl:ml-20">
         {/* Title Start */}
          <div>
          <h1 className="font-bold text-3xl md:text-4xl xl:text-5xl text-left">About Peek-A-Book</h1>
          </div>
          {/* Title End */}

          {/* About Container Start */}
          <div className="container">

              {/* About Card Left Start */}
              <div className="about-card xl:w-[70%] p-10!">
                <h1 className="text-2xl font-medium mb-3">How it works?</h1>
                <ul>
                  <li>Step 1</li>
                  <li>Step 2</li>
                  <li>Step 3</li>
                  <li>Step 4</li>
                </ul>
              </div>
              {/* About Card Left End */}

              {/* About Card Right Start */}
              <div className="about-card xl:w-[30%]">

                {/* Image */}
                  <div className="about-image p-5">
                      <img src={imageSrc} alt={aboutMeData.name} className="border-0 rounded-full w-40 md:w-50 xl:w-50 m-auto"/>
                  </div>

                {/* Bio */}
                  <div className="about-bio">
                      <h1 className="text-2xl font-medium mb-3">Meet the Creator</h1>
                      <p className="text-sm font-light"><span className="text-xl font-normal">Hi I am JM Reyes.</span> <br/> I am a student developer. Specializing in Web and Machine Learning Development. I built Peek-A-Book as a side project to help fellow readers to discover books with ease with the help of AI.</p>
                  </div>

              </div>
              {/* About Card Right End */}

          </div>
          {/* About Container End */}

      </div>
    </section>
  )
}

export default About