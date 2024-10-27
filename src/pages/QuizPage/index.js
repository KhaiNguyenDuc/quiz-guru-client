import { StompSessionProvider } from "react-stomp-hooks";
import Quiz from "../../components/Quiz/Quiz";
import "./index.css";


const QuizPage = () => {

  return (
    <>
             <StompSessionProvider
      url={"http://localhost:8083/quizzes/ws-endpoint"}
    >
      <Quiz/>

    </StompSessionProvider>

    </>
  );
};
export default QuizPage;
