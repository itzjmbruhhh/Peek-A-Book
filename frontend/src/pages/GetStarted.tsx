import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import "../styles/pages/GetStarted.css";
import { useState } from "react";
import questions_1 from "../utils/question1.json";
import questions_2 from "../utils/question2.json";
import questions_3 from "../utils/question3.json";
import questions_4 from "../utils/question4.json";

function GetStarted() {
  interface Question {
    id: string;
    option: string;
  }

  // State to track selected checkboxes
  const [selected, setSelected] = useState<string[]>([]);

  const handleChange = (id: string) => {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  // Add separate state for question 2
  const [selectedQ2, setSelectedQ2] = useState<string[]>([]);

  const handleChangeQ2 = (id: string) => {
    setSelectedQ2((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  // Add separate state for question 3
  const [selectedQ3, setSelectedQ3] = useState<string[]>([]);

  const handleChangeQ3 = (id: string) => {
    setSelectedQ3((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  // Add separate state for question 3
  const [selectedQ4, setSelectedQ4] = useState<string[]>([]);

  const handleChangeQ4 = (id: string) => {
    setSelectedQ3((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  return (
    <section id="Get-Started">
      <Navbar />

      <div className="wrapper">
        {/* Header */}
        <div>
          <h1 className="font-bold text-3xl md:text-4xl xl:text-5xl text-left">
            Get Started
          </h1>
        </div>

        {/* Question 1 Start */}
        <div className="mt-15">
          <h2 className="h2 question">
            What kinds of stories or topics do you usually enjoy?
          </h2>
          <h4 className="h4">Check all that apply.</h4>

          {/* Checkbox container */}
          <div className="checkbox-container">
            {questions_1.map((option: Question, index) => (
              <label
                key={option.id}
                className="checkbox"
              >
                <input
                  type="checkbox"
                  value={option.id}
                  checked={selected.includes(option.id)}
                  onChange={() => handleChange(option.id)}
                  className="min-w-6 min-h-6 accent-(--color-red) md:w-6 md:h-6 xl:w-8 xl:h-8"
                />
                <span className="ml-2 md:text-xl xl:text-2xl">
                  {option.option}
                </span>
              </label>
            ))}
          </div>
        </div>
        {/* Question 1 End */}

        {/* Question 2 Start */}
        <div className="mt-10 border-t pt-10">
          <h2 className="h2 question">
            What’s your usual intent when you read?
          </h2>
          <h4 className="h4">Check all that apply.</h4>

          {/* Checkbox container */}
          <div className="checkbox-container">
            {questions_2.map((option: Question, index) => (
              <label
                key={option.id}
                className="checkbox"
              >
                <input
                  type="checkbox"
                  value={option.id}
                  checked={selectedQ2.includes(option.id)}
                  onChange={() => handleChangeQ2(option.id)}
                  className="min-w-6 min-h-6 accent-(--color-red) md:w-6 md:h-6 xl:w-8 xl:h-8"
                />
                <span className="ml-2 md:text-xl xl:text-2xl">
                  {option.option}
                </span>
              </label>
            ))}
          </div>
        </div>
        {/* Question 2 End */}

        {/* Question 3 Start */}
        <div className="mt-10 border-t pt-10">
          <h2 className="h2 question">
            What type of reading experience do you prefer?
          </h2>
          <h4 className="h4">Check all that apply.</h4>

          {/* Checkbox container */}
          <div className="checkbox-container">
            {questions_3.map((option: Question, index) => (
              <label
                key={option.id}
                className="checkbox"
              >
                <input
                  type="checkbox"
                  value={option.id}
                  checked={selectedQ3.includes(option.id)}
                  onChange={() => handleChangeQ3(option.id)}
                  className="min-w-6 min-h-6 accent-(--color-red) md:w-6 md:h-6 xl:w-8 xl:h-8"
                />
                <span className="ml-2 md:text-xl xl:text-2xl">
                  {option.option}
                </span>
              </label>
            ))}
          </div>
        </div>
        {/* Question 3 End */}

        {/* Question 4 Start */}
        <div className="mt-10 border-t pt-10">
          <h2 className="h2 question">
            Are there types of books you usually avoid?
          </h2>
          <h4 className="h4">Check all that apply.</h4>

          {/* Checkbox container */}
          <div className="checkbox-container">
            {questions_4.map((option: Question, index) => (
              <label
                key={option.id}
                className="checkbox"
              >
                <input
                  type="checkbox"
                  value={option.id}
                  checked={selectedQ4.includes(option.id)}
                  onChange={() => handleChangeQ4(option.id)}
                  className="min-w-6 min-h-6 accent-(--color-red) md:w-6 md:h-6 xl:w-8 xl:h-8"
                />
                <span className="ml-2 md:text-xl xl:text-2xl">
                  {option.option}
                </span>
              </label>
            ))}
          </div>
        </div>
        {/* Question 4 End */}

      </div>
    </section>
  );
}

export default GetStarted;
