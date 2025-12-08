/**
 * Page: GetStarted
 * Purpose: Onboarding page where users select reading preferences.
 * - Manages preference state, presets (load/save) and device id.
 * - When the user proceeds, the upload overlay is opened to add a photo.
 */
import "../styles/pages/GetStarted.css";
import Upload_Results from "./Upload_Results";
import { useState, useEffect } from "react";
import questions from "../utils/Questions.json";

interface QuestionSection {
  id: string;
  question: string;
  choices: string[];
}

type SelectedPrefs = {
  [key: string]: string[];
};

type AnswersState = {
  favorite_genres: string[];
  reading_intent: string[];
  reading_preferences: string[];
  avoid_types: string[];
};

type Preset = {
  id: number;
  name: string | null;
  favorite_genres: string[];
  reading_intents: string[];
  reading_experience: string[];
  avoid_types: string[];
};

type CategoryKey =
  | "favorite_genres"
  | "reading_intent"
  | "reading_preferences"
  | "avoid_types";

function GetStarted() {
  const [deviceId, setDeviceId] = useState("");
  const [uploadOpen, setUploadOpen] = useState(false);
  const [selected, setSelected] = useState<SelectedPrefs>({});
  const [answers, setAnswers] = useState<AnswersState>({
    favorite_genres: [],
    reading_intent: [],
    reading_preferences: [],
    avoid_types: [],
  });
  const [presetName, setPresetName] = useState("");
  const [savePresetChecked, setSavePresetChecked] = useState(false);
  const [presets, setPresets] = useState<Preset[]>([]);
  const [selectedPresetId, setSelectedPresetId] = useState<number | "">("");

  // Initialize deviceId
  useEffect(() => {
    let id = localStorage.getItem("deviceId");
    if (!id) {
      id = crypto.randomUUID();
      localStorage.setItem("deviceId", id);
    }
    setDeviceId(id);
  }, []);

  // Fetch existing presets for this device
  useEffect(() => {
    if (!deviceId) return;

    const fetchPresets = async () => {
      try {
        const res = await fetch("http://localhost:8000/api/preferences/", {
          headers: { "X-DEVICE-ID": deviceId },
        });
        const data: Preset[] = await res.json();
        setPresets(data);
      } catch (err) {
        console.error("Failed to fetch presets:", err);
      }
    };

    fetchPresets();
  }, [deviceId]);

  // Handle checkbox toggle
  const handleToggle = (categoryId: CategoryKey, choice: string) => {
    setAnswers((prev) => {
      const alreadySelected = prev[categoryId].includes(choice);
      return {
        ...prev,
        [categoryId]: alreadySelected
          ? prev[categoryId].filter((item) => item !== choice)
          : [...prev[categoryId], choice],
      };
    });
  };

  const handleChange = (sectionId: CategoryKey, choice: string) => {
    handleToggle(sectionId, choice);

    setSelected((prev) => {
      const current = prev[sectionId] || [];
      const updated = current.includes(choice)
        ? current.filter((item) => item !== choice)
        : [...current, choice];
      return { ...prev, [sectionId]: updated };
    });
  };

  // Prefill answers when a preset is selected
  const handlePresetSelect = (presetId: number) => {
    const preset = presets.find((p) => p.id === presetId);
    if (!preset) return;

    setSelectedPresetId(presetId);

    // Prefill state
    setAnswers({
      favorite_genres: preset.favorite_genres,
      reading_intent: preset.reading_intents,
      reading_preferences: preset.reading_experience,
      avoid_types: preset.avoid_types,
    });

    setSelected({
      favorite_genres: preset.favorite_genres,
      reading_intent: preset.reading_intents,
      reading_preferences: preset.reading_experience,
      avoid_types: preset.avoid_types,
    });

    // Clear Save Preset and name
    setPresetName("");
    setSavePresetChecked(false);
  };

  // Save preset to backend only if checked
  const savePreset = async () => {
    if (!savePresetChecked) return;

    const payload = {
      favorite_genres: answers.favorite_genres,
      reading_intents: answers.reading_intent,
      reading_experience: answers.reading_preferences,
      avoid_types: answers.avoid_types,
      name: presetName || null,
    };

    if (!deviceId) {
      console.error("Device ID not set");
      return;
    }

    try {
      const res = await fetch("http://localhost:8000/api/preferences/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-DEVICE-ID": deviceId,
        },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      console.log("Preset saved:", data);
      setPresets((prev) => [...prev, data]);
    } catch (err) {
      console.error("Failed to save preset:", err);
    }
  };

  const handleProceed = async () => {
    await savePreset();
    setUploadOpen(true);
  };

  return (
    <section id="Get-Started">
      <div className="wrapper">
        <h1 className="font-bold text-3xl md:text-4xl xl:text-5xl text-left">
          Get Started
        </h1>

        {/* Preset dropdown */}
        {presets.length > 0 && (
          <div className="mb-8">
            <label className="block mb-2 font-medium">
              Select a saved preset:
            </label>
            <div className="relative">
              <select
                value={selectedPresetId}
                onChange={(e) => {
                  const val = e.target.value;
                  if (val === "") {
                    // None clicked: reset everything
                    setSelectedPresetId("");
                    setSelected({
                      favorite_genres: [],
                      reading_intent: [],
                      reading_preferences: [],
                      avoid_types: [],
                    });
                    setAnswers({
                      favorite_genres: [],
                      reading_intent: [],
                      reading_preferences: [],
                      avoid_types: [],
                    });
                    setPresetName("");
                    setSavePresetChecked(false);
                  } else {
                    handlePresetSelect(Number(val));
                  }
                }}
                className="appearance-none mt-1 px-4 py-2 w-full xl:w-[20%] border rounded-md text-sm text-left bg-(--color-secondary)"
              >
                <option value="" className="hover:bg-(--color-red)!">
                  -- None --
                </option>
                {presets.map((p) => (
                  <option
                    key={p.id}
                    value={p.id}
                    className="hover:bg-(--color-secondary)"
                  >
                    {p.name || `Preset #${p.id}`}
                  </option>
                ))}
              </select>
            </div>
          </div>
        )}

        {/* Questions */}
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
                    <span className="ml-2 md:text-xl xl:text-2xl">
                      {choice}
                    </span>
                  </label>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Save Preset */}
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
              value={presetName}
              onChange={(e) => setPresetName(e.target.value)}
              className="border rounded-[5px] h-10 p-5 md:w-[400px] xl:w-[400px] bg-(--color-secondary) placeholder-(--color-text-secondary)"
              placeholder="Name your preset"
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
