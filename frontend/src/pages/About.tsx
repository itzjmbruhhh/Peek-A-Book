import aboutMeData from "../utils/static-files.json";
import "../styles/pages/About.css";

function About() {
  const imageSrc = new URL(
    `../assets/images/${aboutMeData.directory}`,
    import.meta.url
  ).href;

  return (
    <section id="About">
      <div className="wrapper md:ml-10 xl:ml-20">
        {/* Title Start */}
        <div>
          <h1 className="font-bold text-3xl md:text-4xl xl:text-5xl text-left mb-8">
            About Peek-A-Book
          </h1>
        </div>
        {/* Title End */}

        {/* About Container Start */}
        <div className="container-about flex-col! xl:flex-row! md:flex-row! gap-10">
          {/* About Card Left Start */}
          <div className="about-card xl:w-[70%] p-10! space-y-8">
            
            {/* Section: How it works */}
            <div>
              <h2 className="text-2xl font-semibold mb-4">How it works</h2>
              <ol className="list-decimal pl-6 space-y-2 text-lg">
                <li>
                  The system runs AI models locally or via free hosted APIs to
                  generate responses or recommendations.
                </li>
                <li>
                  It only stores a device ID to save your presets; no sensitive
                  user data is stored.
                </li>
                <li>
                  You can upload or select items, and the AI will process them
                  using the chosen model.
                </li>
                <li>
                  The results are returned to your device and can be saved as
                  presets for future use.
                </li>
              </ol>
            </div>

            {/* Section: Tech Stack */}
            <div>
              <h2 className="text-2xl font-semibold mb-4">Tech Stack</h2>
              <p className="text-lg">
                Peek-A-Book is built with <strong>React</strong> for the frontend
                and <strong>Django</strong> for the backend.
              </p>
            </div>

            {/* Section: AI Model */}
            <div>
              <h2 className="text-2xl font-semibold mb-4">AI Model</h2>
              <p className="text-lg">
                The app uses free-tier AI models, so results may vary in quality.
              </p>
            </div>
          </div>
          {/* About Card Left End */}

          {/* About Card Right Start */}
          <div className="about-card xl:w-[30%] space-y-6">
            {/* Image */}
            <div className="about-image p-5">
              <img
                src={imageSrc}
                alt={aboutMeData.name}
                className="border-0 rounded-full w-40 md:w-50 xl:w-50 m-auto"
              />
            </div>

            {/* Bio */}
            <div className="about-bio">
              <h2 className="text-2xl font-medium mb-3">Meet the Creator</h2>
              <p className="text-sm font-light">
                <span className="text-xl font-normal">Hi, I am JM Reyes.</span>{" "}
                <br />
                I am a student developer specializing in Web and Machine
                Learning Development. I built Peek-A-Book as a side project to
                help fellow readers discover books easily with the help of AI.
              </p>
            </div>
          </div>
          {/* About Card Right End */}
        </div>
        {/* About Container End */}
      </div>
    </section>
  );
}

export default About;
