import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "./Quiz.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import useGivenText from "../../hook/useGivenText";
import RecordService from "../../services/RecordService";
import CustomerService from "../../services/CustomerService";
import WordService from "../../services/WordService";
import PreLoader from "../PreLoader/PreLoader";
import SingleChoice from "./SingleChoice";
import MultipleChoice from "./MultipleChoice";
import Word from "../WordSet/Word/Word";
function Quiz({socket}) {
  
  const [selectedResult, setSelectedResult] = useState("No message received yet");
  const navigate = useNavigate();
  const { id } = useParams();
  const [recordId, setRecordId] = useState()
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [isNextButton, setIsNextButton] = useState(false);
  const [isAnswerButton, setIsAnswerButton] = useState(false);
  const [isFlip, setFlip] = useState(false);
  const [isResultButton, setIsResultButton] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState([]);
  const [recordItems, setRecordItems] = useState([]);
  const [questions, setQuestions] = useState([]);
  const [quizIndex, setQuizIndex] = useState(0);
  const [givenText, setGivenText] = useState("");
  const [duration, setDuration] = useState(30);
  const [isLoading, setLoading] = useState(false);
  const [words, setWords] = useState([]);
  const [isErrorMessage, setIsErrorMessage] = useState(false);
  let { showText, setShowText } = useGivenText();
  const publishMessage = (recordItems) => {
    if (socket) {
      socket.publish({
        destination: "/quizzes/submit",
        body: recordItems, // Make sure to stringify the body if it's an object
      });
    }
  };
  useEffect(() => {
    if (socket) {
      socket.onConnect = (frame) => {
        console.log("STOMP connection established!", frame);

        // Subscribe to a topic
        socket.subscribe("/topic/submit", (message) => {
          let response = JSON.parse(message.body)
          console.log(response)
          console.log(response.body.data.recordId)
          setSelectedResult(response.body.data);
          
          if(response.body.data.recordId  && response.body.data.recordId != ""){
            setRecordId(response.body.data.recordId)
          }
        });
      };

      socket.onStompError = (frame) => {
        console.error("Broker reported error: " + frame.headers["message"]);
        console.error("Additional details: " + frame.body);
      };
    }
  }, [socket]);

  const getById = async (id) => {
    setLoading(true);
    const response = await CustomerService.getCurrentUserQuizById(id);
    if (response?.status !== 400) {
      setQuestions(response?.questions);
      setGivenText(response?.givenText);
      setDuration(response?.duration);
      const words = response?.wordSet?.words;
      if (words) {
        const wordResponse = await WordService.getDefinition(words.map(w => w?.name), response?.wordSet?.id);
        if (wordResponse?.status !== 400) {
          setWords(wordResponse.map((wordResponse) => {
            let parsedDefinition = wordResponse.definition; // Default to the original definition
        
            // Attempt to parse the definition only if it's a non-empty string
            if (wordResponse.definition && typeof wordResponse.definition === 'string') {
              try {
                parsedDefinition = JSON.parse(wordResponse.definition);
              } catch (error) {
                // Parsing failed, keep the original definition
              }
            }
        
            return {
              ...wordResponse, // Keep the original fields
              definition: parsedDefinition // Replace the "definition" field with parsed value or the original value if parsing failed
            };
          }));
        }
      }
    }
    setLoading(false);
  };

  const selectAnswer = (index) => {
    if (quizIndex !== 0 && quizIndex % 2 === 0 && words[quizIndex - 1] !== undefined) {
      // If is flashcard so just render next button without doing anything
      setIsNextButton(true);
      return;
    }
    if (
      selectedIndex.includes(index) &&
      selectedIndex.length > 1 &&
      questions[currentQuestion]?.type === "MULTIPLE_CHOICE"
    ) {
      setSelectedIndex(selectedIndex.filter((element) => element !== index));
      return;
    }
    if (
      !selectedIndex.includes(index) &&
      questions[currentQuestion]?.type === "SINGLE_CHOICE"
    ) {
      setSelectedIndex([index]);
    } else if (
      !selectedIndex.includes(index) &&
      questions[currentQuestion]?.type === "MULTIPLE_CHOICE"
    ) {
      setSelectedIndex([...selectedIndex, index]);
    }
    if (currentQuestion === questions?.length - 1) {
      setIsAnswerButton(true);
    } else {
      setIsAnswerButton(true);
    }
  };
  const submitRecord = async (record) => {
    setLoading(true)
    let response = {};
    if (record) {
      response = await RecordService.createRecord(recordId, record, id, duration);
    } else {
      response = await RecordService.createRecord(recordId, recordItems, id, duration);
    }
    setLoading(false)
    if (response?.status === 201) {
      navigate(`/member/record/${response?.data?.data?.id}`, {
        state: {
          givenText: givenText,
        },
      });
    }
  };

  const chooseAnwser = async () => {
    if(currentQuestion === questions?.length - 1){
      setIsNextButton(false)
      setIsResultButton(true);
    }else{
      setIsNextButton(true)
    }
    setIsAnswerButton(false)
    setRecordItems([
      ...recordItems,
      {
        questionId: questions[currentQuestion].id,
        selectedChoiceIds: selectedIndex
      },
    ]);

    publishMessage(JSON.stringify({
      recordItems: [{
        questionId: questions[currentQuestion].id,
        selectedChoiceIds: selectedIndex
      }],
      quizId: id,
      timeLeft: duration,
      recordId: recordId
    }));
   


  }

  const nextQuestion = async () => {
    setQuizIndex(quizIndex + 1);
    setFlip(false)
    setSelectedIndex([]);
    setSelectedResult({})
    if (currentQuestion >= questions?.length - 1) {
      setCurrentQuestion(0);

      submitRecord([
        ...recordItems,
        {
          questionId: questions[currentQuestion].id,
          selectedChoiceIds: selectedIndex
        },
      ]);
    } else if(quizIndex===0 || quizIndex % 2 !== 0 || words[quizIndex - 1] === undefined){
      // If not flashcard so append to result to submit
      setCurrentQuestion(currentQuestion + 1);

      setIsNextButton(false);
      
    }
  };

  useEffect(() => {

    const timer = setInterval(() => {
      setDuration(duration - 1);
    }, 1000);
    duration <= 10 ? setIsErrorMessage(true) : setIsErrorMessage(false);
    if (duration == 0) {
      const answeredQuestionIds = recordItems.map(
        (recordItem) => recordItem.questionId
      );
      const unAnsweredQuestions = questions.filter(
        (question) => !answeredQuestionIds.includes(question.id)
      );

      // Create an array of objects for unanswered questions
      const unDoneAnswersArray = unAnsweredQuestions.map((question) => ({
        questionId: question.id,
        selectedChoiceIds: [],
      }));
      submitRecord([...recordItems, ...unDoneAnswersArray]);
    }

    return () => clearInterval(timer);
  }, [duration]);

  useEffect(() => {
    getById(id);
  }, [id]);

  const formatTime = (time) => {
    const hours = Math.floor(time / 3600);
    const minutes = Math.floor((time % 3600) / 60);
    const seconds = time % 60;

    let formattedTime = "";
    if (hours > 0) {
      formattedTime += `${hours}:`;
    }
    formattedTime += `${minutes < 10 ? "0" : ""}${minutes}:${
      seconds < 10 ? "0" : ""
    }${seconds}`;
    return formattedTime;
  };

  return (
    <>
      {isLoading ? (
        <PreLoader />
      ) : (
        <>
        {/* <div>{selectedResult}</div> */}
          <div
            className="progress-timer time mb-3"
            style={{ "--value": (duration / 1800) * 100 }}
          >
            <FontAwesomeIcon
              icon="clock"
              className="p-1"
              style={{ fontSize: "20px" }}
            />{" "}
            <span className="time">{formatTime(duration)}</span>
          </div>
          <div className="row">
            {showText && givenText !== "" && (
              <div className={`col-md col-lg scrollable-col `}>
                <div
                  className="given-text"
                  style={{
                    maxWidth: "100%",
                    maxHeight: "100%",
                    overflow: "auto",
                  }}
                >
                  <p
                    style={{
                      maxWidth: "100%",
                      maxHeight: "100%",
                      overflow: "auto",
                    }}
                    dangerouslySetInnerHTML={{ __html: givenText }}
                  />
                </div>
              </div>
            )}

            <div
              className={`quiz-section ${
                showText && givenText !== "" ? "col" : " full-width"
              }`}
            >
              <div>
                <div className="progress-box">
                  <div className="progress-top">
                    <div className="progress-texts">
                      <h2 className="progress-title">Tiến độ</h2>
                      <p className="progress-description">
                        Bạn đang làm bộ câu hỏi.
                      </p>
                    </div>
                    {givenText !== "" && (
                      <div className="progress-icon">
                        <button
                          className="btn toggle-button"
                          onClick={() => setShowText(!showText)}
                        >
                          <FontAwesomeIcon
                            icon={showText ? "eye-slash" : "eye"}
                          />
                        </button>
                      </div>
                    )}
                  </div>
                  <div className="progress-bottom">
                    <div
                      className="progress-circle"
                      aria-valuemin="0"
                      aria-valuemax="100"
                      style={{
                        "--value":
                          ((currentQuestion + 1) / questions?.length) * 100,
                      }}
                    >
                      <span className="progress-big">
                        {currentQuestion + 1}
                      </span>
                      <span className="progress-mini">
                        /{questions?.length}
                      </span>
                    </div>

                    <p className="progress-detail">
                      Bạn đã làm {currentQuestion + 1} câu hỏi trên tổng số{" "}
                      {questions?.length} câu hỏi
                    </p>
                  </div>
                </div>
  
                {quizIndex % 2 === 0 && words[quizIndex-1] !== undefined
                 ? (
                  <>
                   
                    {
                      isFlip ? (
                        <div style={{width: '100%'}}  onClick={() => setFlip(!isFlip)}>
                          <FontAwesomeIcon icon={"sync-alt"} className="flip position-absolute top-0 end-0 m-3" onClick={() => {setFlip(!isFlip)}}/>
                          
                        <Word word={words[quizIndex-1]?.definition} 
                        content={words[quizIndex-1]?.content} 
                        id={words[quizIndex-1]?.id} 
                        isFlashCard={true}
                        name={words[quizIndex-1]?.name}
                        />
                        </div>
                      ) : (
                        <div className="word-only card my-3" onClick={() => {setFlip(!isFlip); selectAnswer(quizIndex); }}>
                        <div className="card-body d-flex align-items-center justify-content-center text-center position-relative">
                          {/* <FontAwesomeIcon icon={"sync-alt"} className="flip position-absolute top-0 end-0 m-3" onClick={() => {setFlip(!isFlip); selectAnswer(quizIndex); }}/> */}
                          <h5 className="card-title">
                            {words[quizIndex - 1]?.name}
                          </h5>
                        </div>
                      </div>
                      )
                    }
                  </>
                ) : (
        
                    <>
                      {questions[currentQuestion]?.type ===
                      "MULTIPLE_CHOICE" ? (
                        <MultipleChoice
                          question={questions[currentQuestion]}
                          currentQuestion={currentQuestion}
                          selectAnswer={selectAnswer}
                          selectedIndex={selectedIndex}
                          selectedResult={selectedResult}
                        />
                      ) : questions[currentQuestion]?.type ===
                        "SINGLE_CHOICE" ? (
                        <SingleChoice
                          question={questions[currentQuestion]}
                          currentQuestion={currentQuestion}
                          selectAnswer={selectAnswer}
                          selectedIndex={selectedIndex}
                          selectedResult={selectedResult}
                        />
                      ) : (
                        <></>
                      )}
                    </>
   
                )}
                {isAnswerButton && (
                    <div className="next">
                    <button
                      onClick={() => chooseAnwser()}
                      type="button"
                      className="next-btn"
                    >
                      Chọn
                      <div className="icon">
                        <FontAwesomeIcon icon="arrow-right" />
                      </div>
                    </button>
                  </div>
                )}
                {isNextButton ? (
                  <div className="next">
                    <button
                      onClick={() => nextQuestion()}
                      type="button"
                      className="next-btn"
                    >
                      Câu tiếp theo
                      <div className="icon">
                        <FontAwesomeIcon icon="arrow-right" />
                      </div>
                    </button>
                  </div>
                ) : null}

                {isResultButton ? (
                  <div className="next">
                    <button
                      onClick={() => nextQuestion()}
                      type="button"
                      className="next-btn result-btn"
                    >
                      Xem kết quả
                      <div className="icon">
                        <FontAwesomeIcon icon="bar-chart" />
                      </div>
                    </button>
                  </div>
                ) : null}
              </div>
            </div>
          </div>
        </>
      )}
      {isErrorMessage ? (
        <div className="message animation">
          <div className="icon">
            <FontAwesomeIcon icon="exclamation-triangle" />
          </div>
          <span>Bạn phải nhanh lên!</span>
        </div>
      ) : null}
    </>
  );
}

export default Quiz;
