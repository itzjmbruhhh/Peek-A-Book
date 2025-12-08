import "../styles/pages/GetStarted.css";
import Upload_Results from "./Upload_Results";
import { useState } from "react";

import questions from "../utils/Questions.json";

interface QuestionSection {
  id: string;
  question: string;
  choices: string[];
}

// selected state: { favorite_genres: [...], reading_intent: [...], ... }
type SelectedPrefs = {
  [key: string]: string[];
};

function GetStarted() {
  const [uploadOpen, setUploadOpen] = useState(false);

  // unified selected preferences for all 4 questions
  const [selected, setSelected] = useState<SelectedPrefs>({});

  const handleChange = (sectionId: string, choice: string) => {
    setSelected(prev => {
      const current = prev[sectionId] || [];

      const updated = current.includes(choice)
        ? current.filter(item => item !== choice)
        : [...current, choice];

      return { ...prev, [sectionId]: updated };
    });
  };

  return (
    <section id="Get-Started">
      <div className="wrapper">
        <h1 className="font-bold text-3xl md:text-4xl xl:text-5xl text-left">
          Get Started
        </h1>

        {/* Render all questions dynamically */}
        <div className="mt-15">
          {questions.map((section: QuestionSection) => (
            <div key={section.id} className="mb-12">
              <h2 className="h2 question">{section.question}</h2>
              <h4 className="h4">Check all that apply.</h4>

              <div className="checkbox-container mt-4">
                {section.choices.map(choice => (
                  <label
                    key={choice}
                    className="checkbox flex items-center mb-2"
                  >
                    <input
                      type="checkbox"
                      checked={selected[section.id]?.includes(choice) ?? false}
                      onChange={() => handleChange(section.id, choice)}
                      className="min-w-6 min-h-6 accent-(--color-red) md:w-6 md:h-6 xl:w-8 xl:h-8"
                    />

                    <span className="ml-2 md:text-xl xl:text-2xl">
                      {choice}
                    </span>
                  </label>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Preset Save */}
        <div className="border-t mt-10">
          <div className="checkbox-container xl:ml-10! flex-col!">
            <label className="checkbox">
              <input
                type="checkbox"
                className="min-w-6 min-h-6 accent-(--color-red) md:w-6 md:h-6 xl:w-8 xl:h-8"
              />
              <span className="ml-2 md:text-xl xl:text-2xl font-bold">
                Save Preset
              </span>
            </label>

            <input
              type="text"
              className="border rounded-[5px] h-10 p-5 md:w-[400px] xl:w-[400px]"
              placeholder="Name your preset"
            />
          </div>
        </div>

        {/* Proceed */}
        <div className="flex flex-col items-center md:items-end xl:items-end gap-1 px-2 xl:mr-20">
          <label className="text-lg font-medium text-(--color-text-primary)">
            Ready to upload photo?
          </label>
          <button className="getStarted mt-0! mx-2" onClick={() => setUploadOpen(true)}>
            Proceed
          </button>
        </div>

        {/* Upload Overlay */}
        {uploadOpen && (
          <Upload_Results
            uploadOpen={uploadOpen}
            setUploadOpen={setUploadOpen}
          />
        )}
      </div>
    </section>
  );
}

export default GetStarted;
