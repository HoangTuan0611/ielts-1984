import React, { useEffect, useState } from "react";
import Draggable from "react-draggable";
import "./App.css";

const App = () => {
  const [filledWords, setFilledWords] = useState();
  const [isCorrect, setIsCorrect] = useState(null);
  const [questionData, setData] = useState();

  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch("http://localhost:3000/api/question");
      const data = await response.json();
      if (data.success) {
        setData(data.data.question);
        const initialFilledWords = {};
        data.data.question.blanks.forEach((blank) => {
          initialFilledWords[blank.id] = "";
        });
        setFilledWords(initialFilledWords);
      }
    };
    fetchData();
  }, []);

  const checkAnswer = () => {
    if (questionData) {
      const isAllCorrect = questionData.blanks.every(
        (blank) => filledWords[blank.id] === blank.correctAnswer
      );
      setIsCorrect(isAllCorrect);
    }
  };

  const handleDrop = (blankId, word) => {
    const correctBlank = questionData.blanks.find(
      (blank) => blank.id === blankId
    );
    if (correctBlank && word === correctBlank.correctAnswer) {
      setFilledWords((prev) => ({ ...prev, [blankId]: word }));
    }
  };

  const handleInputChange = (e, blankId) => {
    setFilledWords((prev) => ({ ...prev, [blankId]: e.target.value }));
  };

  if (!questionData) return <div>Loading...</div>;

  const questionDataAfterSplit = questionData?.paragraph.split(/(\[_input\])/);
  // console.log('questionDataAfterSplit', questionDataAfterSplit);
  // console.log('filledWords', filledWords);
  let increaseBlank = 0;

  return (
    <div className="App">
      <h3>
        Hey. Please fill in the blanks, you can input or select suggest words to
        drag in correctly
      </h3>
      <p>
        {questionDataAfterSplit.map((part, index) => {
          if (part === "[_input]") {
            // console.log(index);
            const blank = questionData?.blanks[increaseBlank];
            // console.log(blank);
            // console.log(filledWords);
            // console.log(filledWords[blank.id]);
            // console.log(blank.correctAnswer);

            if (!blank) return null;
            // console.log('increaseBlank', increaseBlank);
            increaseBlank++;
            return (
              <input
                key={blank.id}
                className="blank"
                value={filledWords[blank.id]}
                onChange={(e) => handleInputChange(e, blank.id)}
                onDrop={(e) => {
                  e.preventDefault();
                  handleDrop(blank.id, e.dataTransfer.getData("text"));
                }}
                disabled={filledWords[blank.id] === blank.correctAnswer}
              />
            );
          }
          return part;
        })}
      </p>
      <div className="words">
        {questionData?.dragWords.map((word) => (
          <Draggable
            key={word.id}
            onStart={(e) => e.dataTransfer.setData("text", word.word)}
          >
            <span
              className="draggable-word"
              style={{ color: word.color === "red" ? "red" : "black" }}
              draggable
              onDragStart={(e) => e.dataTransfer.setData("text", word.word)}
            >
              {word.word}
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
