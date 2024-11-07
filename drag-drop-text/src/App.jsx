import React, { useState } from "react";
import Draggable from "react-draggable";
import "./App.css";

const App = () => {
  const [filledWords, setFilledWords] = useState({ blank1: "", blank2: "" });
  const [isCorrect, setIsCorrect] = useState(null);

  console.log(filledWords);

  const suggestWords = [
    { text: "blue", target: "blank1" },
    { text: "green", target: "blank2" },
    { text: "red", target: "" },
    { text: "yellow", target: "" },
  ];

  const checkAnswer = () => {
    setIsCorrect(
      filledWords.blank1 === "blue" && filledWords.blank2 === "green"
    );
  };

  const handleDrop = (target, word) => {
    if (target === "blank1" && word === "blue") {
      setFilledWords((prev) => ({ ...prev, blank1: "blue" }));
    } else if (target === "blank2" && word === "green") {
      setFilledWords((prev) => ({ ...prev, blank2: "green" }));
    }
  };

  const handleInputChange = (e, target) => {
    setFilledWords((prev) => ({ ...prev, [target]: e.target.value}));
  }

  return (
    <div className="App">
      <h3>Hey. Please fill in the blanks, you can input or select suggest words to drag in correctly</h3>
      <p>
        The sky is
        <input
          className="blank"
          value={filledWords.blank1}
          onChange={(e) => handleInputChange(e, "blank1")}
          onDrop={(e) => {
            e.preventDefault();
            handleDrop("blank1", e.dataTransfer.getData("text"));
          }}
          disabled={filledWords.blank1 === "blue"}
        />
        and the grass is
        <input
          className="blank"
          value={filledWords.blank2}
          onChange={(e) => handleInputChange(e, "blank2")}
          onDrop={(e) => {
            e.preventDefault();
            handleDrop("blank2", e.dataTransfer.getData("text"));
          }}
          disabled={filledWords.blank2 === "green"} 
        />
      </p>

      <div className="words">
        {suggestWords.map((word, index) => (
          <Draggable
            key={index}
            onStart={(e) => e.dataTransfer.setData("text", word.text)}
          >
            <span
              className="draggable-word"
              style={{ color: word.text === "green" ? "red" : "black" }}
              draggable
              onDragStart={(e) => e.dataTransfer.setData("text", word.text)}
            >
              {word.text}
            </span>
          </Draggable>
        ))}
      </div>

      <button onClick={checkAnswer}>Submit</button>
      {isCorrect !== null && (
        <p>{isCorrect ? "Correct answer!" : "Incorrect answer. Try again."}</p>
      )}
    </div>
  );
};

export default App;
