/**
 * Page: GetStarted
 * Purpose: Onboarding page where users select reading preferences.
 * - Manages preference state, presets (load/save) and device id.
 * - When the user proceeds, the upload overlay is opened to add a photo.
 */
import "../styles/pages/GetStarted.css";
import Upload_Results from "./Upload_Results";
import { useState, useEffect, useMemo } from "react";
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
  // backend model uses `reading_interests`
  reading_interests: string[];
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
  // initialize all keys so checks like `selected[section.id]?.includes` are safe
  const [selected, setSelected] = useState<SelectedPrefs>({
    favorite_genres: [],
    reading_intent: [],
    reading_preferences: [],
    avoid_types: [],
  });
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
  const [recommendedBooks, setRecommendedBooks] = useState<any[]>([]);

  useEffect(() => {
    let id = localStorage.getItem("deviceId");
    if (!id) {
      id = crypto.randomUUID();
      localStorage.setItem("deviceId", id);
    }
    setDeviceId(id);
  }, []);

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

  const handlePresetSelect = (presetId: number) => {
    const preset = presets.find((p) => p.id === presetId);
    if (!preset) return;

    setSelectedPresetId(presetId);

    setAnswers({
      favorite_genres: preset.favorite_genres,
      // map backend `reading_interests` -> frontend `reading_intent`
      reading_intent: (preset as any).reading_interests || [],
      reading_preferences: preset.reading_experience,
      avoid_types: preset.avoid_types,
    });

    setSelected({
      favorite_genres: preset.favorite_genres,
      reading_intent: (preset as any).reading_interests || [],
      reading_preferences: preset.reading_experience,
      avoid_types: preset.avoid_types,
    });

    setPresetName("");
    setSavePresetChecked(false);
  };

  const handleDeletePreset = async () => {
    if (!selectedPresetId) return;
    if (!deviceId) return console.error("Device ID not set");
    const confirmed = window.confirm(
      "Delete this preset? This cannot be undone."
    );
    if (!confirmed) return;

    try {
      const res = await fetch(
        `http://localhost:8000/api/preferences/${selectedPresetId}/`,
        {
          method: "DELETE",
          headers: { "X-DEVICE-ID": deviceId },
        }
      );

      if (!res.ok) {
        const err = await res.text();
        console.error("Failed to delete preset:", err);
        return;
      }

      // Remove from local state and clear selection
      setPresets((prev) =>
        prev.filter((p) => p.id !== (selectedPresetId as number))
      );
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
    } catch (err) {
      console.error("Error deleting preset:", err);
    }
  };

  const savePreset = async () => {
    if (!savePresetChecked) return;
    const payload = {
      favorite_genres: answers.favorite_genres,
      // backend expects `reading_interests`
      reading_interests: answers.reading_intent,
      reading_experience: answers.reading_preferences,
      avoid_types: answers.avoid_types,
      name: presetName || null,
    };
    if (!deviceId) return console.error("Device ID not set");
    try {
      // If a preset name was provided, check for an existing preset with the same name (case-insensitive)
      const nameToCheck = presetName?.trim();
      if (nameToCheck) {
        const existing = presets.find(
          (p) =>
            p.name && p.name.trim().toLowerCase() === nameToCheck.toLowerCase()
        );

        if (existing) {
          // Ask the user to confirm overwrite before proceeding
          const confirmOverwrite = window.confirm(
            `A preset named "${nameToCheck}" already exists. Overwrite it?`
          );
          if (!confirmOverwrite) return;
          // overwrite existing preset via PUT
          const res = await fetch(
            `http://localhost:8000/api/preferences/${existing.id}/`,
            {
              method: "PUT",
              headers: {
                "Content-Type": "application/json",
                "X-DEVICE-ID": deviceId,
              },
              body: JSON.stringify(payload),
            }
          );
          if (!res.ok) {
            const err = await res.text();
            console.error("Failed to update preset:", err);
          } else {
            const updated = await res.json();
            setPresets((prev) =>
              prev.map((p) => (p.id === updated.id ? updated : p))
            );
            setSelectedPresetId(updated.id);
          }
          return;
        }
      }

      // No existing preset with same name — create a new one
      const res = await fetch("http://localhost:8000/api/preferences/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-DEVICE-ID": deviceId,
        },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      // POST returns { message, preset } — normalize to add the saved preset
      const newPreset = data?.preset ?? data;
      if (newPreset) {
        setPresets((prev) => [...prev, newPreset]);
        setSelectedPresetId(newPreset.id ?? "");
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleProceed = async () => {
    await savePreset();
    setUploadOpen(true);
  };

  const allQuestionsAnswered = useMemo(() => {
    return questions.every((section) => {
      const vals = answers[section.id as CategoryKey] as string[] | undefined;
      return Array.isArray(vals) && vals.length > 0;
    });
  }, [answers]);

  return (
    <section id="Get-Started">
      <div className="wrapper">
        <h1 className="font-bold text-3xl md:text-4xl xl:text-5xl text-left">
          Get Started
        </h1>

        {presets.length > 0 && (
          <div className="mb-8">
            <label className="block mb-2 font-medium">
              Select a saved preset:
            </label>
            <div className="relative flex">
              <select
                value={selectedPresetId}
                onChange={(e) => {
                  const val = e.target.value;
                  if (val === "") {
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
                className="appearance-none px-4 py-2 w-full xl:w-[20%] border rounded-md text-sm text-left bg-(--color-secondary)"
              >
                <option value="">-- None --</option>
                {presets.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name || `Preset #${p.id}`}
                  </option>
                ))}
              </select>
              <button
                type="button"
                onClick={handleDeletePreset}
                disabled={selectedPresetId === ""}
                className="ml-2 px-3 rounded-md bg-(--color-red) text-white disabled:opacity-50"
              >
                Delete
              </button>
            </div>
          </div>
        )}

        <div className="mt-15">
          {questions.map((section: QuestionSection) => (
            <div key={section.id} className="mb-12">
              <h2 className="h2 question">{section.question}</h2>
              <h4 className="h4">Check all that apply. Atleast 1 required.</h4>
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

        <div className="flex flex-col items-center md:items-end xl:items-end! gap-1 px-2 xl:mr-20">
          <label className="text-lg font-medium text-(--color-text-primary)">
            {allQuestionsAnswered
              ? "Ready to upload your photo?"
              : "Check atleast one box per question before proceeding"}
          </label>
          <button
            className={`getStarted mt-0! ${
              !allQuestionsAnswered ? "opacity-50 cursor-not-allowed" : ""
            }`}
            onClick={handleProceed}
            disabled={!allQuestionsAnswered}
          >
            Proceed
          </button>
        </div>

        {uploadOpen && (
          <Upload_Results
            uploadOpen={uploadOpen}
            setUploadOpen={setUploadOpen}
            answers={answers}
            setRecommendedBooks={setRecommendedBooks}
          />
        )}
      </div>
    </section>
  );
}

export default GetStarted;
