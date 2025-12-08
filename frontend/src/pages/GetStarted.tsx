import "../styles/pages/GetStarted.css";
import Upload_Results from "./Upload_Results";
import { useState, useEffect } from "react";
import questions from "../utils/Questions.json";

interface QuestionSection {
  id: string;
  question: string;
  choices: string[];
}

// For selected checkboxes per question
type SelectedPrefs = {
  [key: string]: string[];
};

// Keys must match your answers state
type CategoryKey =
  | "favorite_genres"
  | "reading_intent"
  | "reading_preferences"
  | "avoid_types";

type AnswersState = {
  favorite_genres: string[];
  reading_intent: string[];
  reading_preferences: string[];
  avoid_types: string[];
};

function GetStarted() {
  // Device ID for backend
  const [deviceId, setDeviceId] = useState("");
  useEffect(() => {
    let id = localStorage.getItem("deviceId");
    if (!id) {
      id = crypto.randomUUID();
      localStorage.setItem("deviceId", id);
    }
    setDeviceId(id);
  }, []);

  // Upload overlay
  const [uploadOpen, setUploadOpen] = useState(false);

  // Track selected checkboxes for UI
  const [selected, setSelected] = useState<SelectedPrefs>({});

  // Track answers for backend
  const [answers, setAnswers] = useState<AnswersState>({
    favorite_genres: [],
    reading_intent: [],
    reading_preferences: [],
    avoid_types: [],
  });

  // Preset name and save checkbox
  const [presetName, setPresetName] = useState("");
  const [savePresetChecked, setSavePresetChecked] = useState(false);

  // Handle checkbox toggle for UI + backend
  const handleChange = (sectionId: CategoryKey, choice: string) => {
    // Update backend answers
    setAnswers((prev) => {
      const alreadySelected = prev[sectionId].includes(choice);
      return {
        ...prev,
        [sectionId]: alreadySelected
          ? prev[sectionId].filter((item) => item !== choice)
          : [...prev[sectionId], choice],
      };
    });

    // Update UI selected state
    setSelected((prev) => {
      const current = prev[sectionId] || [];
      const updated = current.includes(choice)
        ? current.filter((item) => item !== choice)
        : [...current, choice];
      return { ...prev, [sectionId]: updated };
    });
  };

  // Save preset to backend
  const savePreset = async () => {
    if (!savePresetChecked) return; // Only save if checkbox is checked
    if (!deviceId) {
      console.error("Device ID not set");
      return;
    }

    const formattedPayload = {
      favorite_genres: answers.favorite_genres,
      reading_intents: answers.reading_intent,
      reading_experience: answers.reading_preferences,
      avoid_types: answers.avoid_types,
      name: presetName || null,
    };

    try {
      const res = await fetch("http://localhost:8000/api/preferences/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-DEVICE-ID": deviceId,
        },
        body: JSON.stringify(formattedPayload),
      });

      const data = await res.json();
      console.log("Preset saved:", data);
    } catch (err) {
      console.error("Error saving preset:", err);
    }
  };

  // Handle Proceed button
  const handleProceed = async () => {
    console.log("Sending with deviceId:", deviceId);
    await savePreset();
    setUploadOpen(true);
  };

  return (
    <section id="Get-Started">
      <div className="wrapper">
        <h1 className="font-bold text-3xl md:text-4xl xl:text-5xl text-left">
          Get Started
        </h1>

        {/* Render questions dynamically */}
        <div className="mt-15">
          {questions.map((section: QuestionSection) => (
            <div key={section.id} className="mb-12">
              <h2 className="h2 question">{section.question}</h2>
              <h4 className="h4">Check all that apply.</h4>
              <div className="checkbox-container mt-4">
                {section.choices.map((choice) => (
                  <label
                    key={choice}
                    className="checkbox flex items-center mb-2"
                  >
                    <input
                      type="checkbox"
                      checked={selected[section.id]?.includes(choice) ?? false}
                      onChange={() =>
                        handleChange(section.id as CategoryKey, choice)
                      }
                      className="min-w-6 min-h-6 accent-(--color-red) md:w-6 md:h-6 xl:w-8 xl:h-8"
                    />
                    <span className="ml-2 md:text-xl xl:text-2xl">{choice}</span>
                  </label>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Preset Save */}
        <div className="border-t mt-10">
          <div className="checkbox-container xl:ml-10! flex-col!">
            <label className="checkbox flex items-center mb-2">
              <input
                type="checkbox"
                checked={savePresetChecked}
                onChange={() => setSavePresetChecked((prev) => !prev)}
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
              value={presetName}
              onChange={(e) => setPresetName(e.target.value)}
            />
          </div>
        </div>

        {/* Proceed */}
        <div className="flex flex-col items-center md:items-end xl:items-end gap-1 px-2 xl:mr-20">
          <label className="text-lg font-medium text-(--color-text-primary)">
            Ready to upload photo?
          </label>
          <button className="getStarted mt-0! mx-2" onClick={handleProceed}>
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