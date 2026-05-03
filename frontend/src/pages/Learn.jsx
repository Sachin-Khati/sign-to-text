import React, { useEffect, useState } from "react";
import signsData from "../assets/signs.json";

export default function Learn() {
  const [signs, setSigns] = useState([]);
  const [quizMode, setQuizMode] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState(null);
  const [options, setOptions] = useState([]);
  const [feedback, setFeedback] = useState("");
  const [score, setScore] = useState(0);
  const [questionCount, setQuestionCount] = useState(0);

  useEffect(() => {
    setSigns(signsData);
  }, []);

  // Start quiz
  const startQuiz = () => {
    setQuizMode(true);
    setScore(0);
    setQuestionCount(0);
    generateQuestion();
  };

  // Generate random question with 4 options
  const generateQuestion = () => {
    const randomSign =
      signsData[Math.floor(Math.random() * signsData.length)];

    // Pick 3 random incorrect answers
    let otherOptions = [...signsData]
      .filter((s) => s.id !== randomSign.id)
      .sort(() => 0.5 - Math.random())
      .slice(0, 3);

    // Mix correct answer + wrong ones
    const allOptions = [...otherOptions, randomSign].sort(
      () => 0.5 - Math.random()
    );

    setCurrentQuestion(randomSign);
    setOptions(allOptions);
    setFeedback("");
    setQuestionCount((prev) => prev + 1);
  };

  // Handle answer selection
  const handleAnswer = (choice) => {
    if (choice.title === currentQuestion.title) {
      setFeedback(" Correct!");
      setScore((prev) => prev + 1);
    } else {
      setFeedback(`Wrong! Correct answer: ${currentQuestion.title}`);
    }
  };
  
  return (
    <div className="px-6 py-10">
      <h1 className="text-4xl font-bold text-center text-sea-600 mb-8">
        Learn Sign Language
      </h1>

      {/* Toggle buttons */}
      <div className="flex justify-center gap-4 mb-8">
        <button
          onClick={() => setQuizMode(false)}
          className={`px-4 py-2 rounded-lg font-semibold ${
            !quizMode ? "bg-cyan-600 text-white" : "bg-gray-200 text-gray-800"
          }`}
        >
          Learn Mode
        </button>
        <button
          onClick={startQuiz}
          className={`px-4 py-2 rounded-lg font-semibold ${
            quizMode ? "bg-cyan-600 text-white" : "bg-gray-200 text-gray-800"
          }`}
        >
          Quiz Mode
        </button>
      </div>

      {/* Learn Mode */}
      {!quizMode && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {signs.map((sign) => (
            <div
              key={sign.id}
              className="bg-white rounded-2xl shadow-md p-6 flex flex-col items-center hover:shadow-lg transition duration-300"
            >
              <img
                src={sign.image}
                alt={sign.title}
                className="w-40 h-40 object-contain mb-4"
              />
              <h2 className="text-xl font-semibold text-gray-800">
                {sign.title}
              </h2>
              <p className="text-gray-600 text-center mt-2">
                {sign.description}
              </p>
            </div>
          ))}
        </div>
      )}

      {/* Quiz Mode */}
      {quizMode && currentQuestion && (
        <div className="max-w-md mx-auto bg-white rounded-2xl shadow-lg p-6 text-center">
          <h2 className="text-xl font-bold mb-4">
            Question {questionCount}
          </h2>
          <img
            src={currentQuestion.image}
            alt="Quiz sign"
            className="w-48 h-48 mx-auto object-contain mb-6"
          />

          <div className="grid grid-cols-1 gap-3">
            {options.map((opt) => (
              <button
                key={opt.id}
                onClick={() => handleAnswer(opt)}
                className="px-4 py-2 bg-gray-200 rounded-lg font-semibold hover:bg-sea-500 hover:text-white transition"
              >
                {opt.title}
              </button>
            ))}
          </div>

          {feedback && (
            <p className="mt-4 text-lg font-medium">{feedback}</p>
          )}

          <button
            onClick={generateQuestion}
            className="mt-6 bg-cyan-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-sea-700"
          >
            Next Question
          </button>

          <p className="mt-4 font-semibold">
            Score: {score} / {questionCount}
          </p>
        </div>
      )}
    </div>
  );
}
