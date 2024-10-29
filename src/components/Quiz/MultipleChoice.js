import React from "react";

const MultipleChoice = ({
  question,
  currentQuestion,
  selectAnswer,
  selectedIndex,
  selectedResult,
}) => {
  const handleSelect = (index) => {
   
      selectAnswer(index);
    
  };
  return (
    <>
      <div className="question-box">
        <div className="question-text">
          <h2 className="question-title">Câu hỏi: {currentQuestion + 1}</h2>
          <h3 className="question">{question?.query}</h3>
        </div>
      </div>
      <div className="answers-boxes">
        {question?.choices.map((choice) => {
          var index = choice.id
          if(selectedResult && selectedResult?.correctIndex?.length > 0  ) {
            const result = selectedIndex.filter((selected) => selected === index)[0];
            const correctIndex = selectedResult.correctIndex
            return ( 
              <label

              key={index}
              htmlFor={index}
              className={

                correctIndex.includes(index)?
                "answer-label selected correct" 
                : result && !correctIndex.includes(index) ?
                "answer-label selected incorrect"
                : "answer-label"
              }
            >
              {choice.name}
              <input
                type="checkbox"
                name="answer"
                id={index}
                checked={selectedIndex.includes(index)}
              />
            </label>
            )
          }else {
            return (
              <label
              key={index}
              htmlFor={index}
              className={
                selectedIndex.includes(index)
                  ? "answer-label selected"
                  : "answer-label"
              }
            >
              {choice.name}
              <input
                type="checkbox"
                name="answer"
                id={index}
                checked={selectedIndex.includes(index)}
                onChange={() => handleSelect(index)}
              />
            </label>
            )
          }

        })}
      </div>
    </>
  );
};

export default MultipleChoice;
