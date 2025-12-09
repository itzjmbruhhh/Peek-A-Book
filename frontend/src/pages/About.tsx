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
        <div className="container-about flex-col! xl:flex-row! md:flex-row! gap-10 p-3">
          {/* About Card Left Start */}
          <div className="about-card xl:w-[70%] p-10! space-y-8 max-h-[458px] overflow-auto pr-4">
            {/* Section: How it works */}
            <div className="pb-10">
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
                Peek-A-Book is built with <strong>React</strong> for the
                frontend and <strong>Django</strong> for the backend.
              </p>
            </div>

            {/* Section: AI Model */}
            <div>
              <h2 className="text-2xl font-semibold mb-4">AI Model</h2>
              <p className="text-lg">
                The app uses free-tier AI models, so results may vary in
                quality.
              </p>
            </div>

            {/* Section: Data & Privacy */}
            <div>
              <h2 className="text-2xl font-semibold mb-4">Data & Privacy</h2>
              <p className="text-lg">
                We only store a non-identifying device ID to let you save
                reading presets. Uploaded images are processed by the server’s
                OCR and AI pipelines and are not used for any other purpose. You
                can delete saved presets at any time from the Get Started page.
              </p>
            </div>

            {/* Section: Rate limits */}
            <div>
              <h2 className="text-2xl font-semibold mb-4">Rate Limits</h2>
              <p className="text-lg">
                To prevent abuse and keep the free backend responsive, uploads
                are rate-limited. Typical limits are small (for example, 2
                uploads per minute). If you hit the limit, the UI will show a
                message with timing information.
              </p>
            </div>

            {/* Section: How recommendations are generated */}
            <div>
              <h2 className="text-2xl font-semibold mb-4">
                How recommendations are generated
              </h2>
              <p className="text-lg">
                After extracting text from your photo, the system builds a
                structured prompt and queries an AI model to match detected
                titles to your reading preferences. The assistant returns a
                curated set of matches and short explanations for why each book
                fits your preferences.
              </p>
            </div>

            {/* Section: Limitations & Tips */}
            <div>
              <h2 className="text-2xl font-semibold mb-4">
                Limitations & Tips
              </h2>
              <ul className="list-disc pl-6 space-y-2 text-lg">
                <li>
                  OCR may miss or misread some titles from low-quality photos.
                </li>
                <li>
                  AI recommendations are probabilistic and may vary between
                  runs.
                </li>
                <li>
                  For best results, use clear, well-lit photos of book spines or
                  covers.
                </li>
                <li>
                  Report issues or suggest improvements via the project repo.
                </li>
              </ul>
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
                <br />I am a student developer specializing in Web and Machine
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
