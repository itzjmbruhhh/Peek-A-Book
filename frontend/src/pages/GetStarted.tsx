import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import "../styles/pages/GetStarted.css";
import { useState } from "react";
import questions_1 from "../utils/question1.json";

function GetStarted() {

  interface Question {
    id: string;
    option: string;
  }

  // State to track selected checkboxes
  const [selected, setSelected] = useState<string[]>([]);

  const handleChange = (id: string) => {
    setSelected(prev =>
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  return (
    <section id="Get-Started">
      <Navbar />

      <div className="wrapper">
        {/* Header */}
        <div>
          <h1 className="font-bold text-3xl md:text-4xl xl:text-5xl text-left">Get Started</h1>
        </div>

        {/* Question 1 Start */}
        <div className="mt-10">
          <h2 className="h2 question">What kinds of stories or topics do you usually enjoy?</h2>
          <h4 className="h4">Check all that apply.</h4>

          {/* Checkbox container */}
          <div className="checkbox-container flex flex-col md:space-x-20 md:flex-row md:flex-wrap md:gap-4 md:ml-15 xl:flex-row xl:flex-wrap p-6 gap-4 xl:gap-6 xl:ml-15">
            {questions_1.map((option: Question, index) => (
              <label
                key={option.id}
                className="checkbox flex items-center w-full md:w-1/3 xl:w-1/4"
              >
                <input
                  type="checkbox"
                  value={option.id}
                  checked={selected.includes(option.id)}
                  onChange={() => handleChange(option.id)}
                  className="min-w-6 min-h-6 accent-(--color-red) md:w-6 md:h-6 xl:w-8 xl:h-8"
                />
                <span className="ml-2 md:text-xl xl:text-2xl">{option.option}</span>
              </label>
            ))}
          </div>
        </div>
        {/* Question 1 End */}

      </div>

    </section>
  );
}

export default GetStarted;
