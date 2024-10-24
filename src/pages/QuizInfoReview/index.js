import { useEffect, useState } from "react";
import { Navigate, useLocation, useNavigate, useParams } from "react-router-dom";
import QuizService from "../../services/QuizService";
import "./index.css";

const QuizInfoReview = () => {
    const { quizId } = useParams();
    const [quizInfo, setQuizInfo] = useState({});
    const [isPreparing, setIsPreparing] = useState(false); // State for preparing the test
    const [countdown, setCountdown] = useState(15); // Countdown timer
    const navigate = useNavigate();

    useEffect(() => {
        getQuizInfo(quizId);
    }, [quizId]);

    const getQuizInfo = async (quizId) => {
        const response = await QuizService.findQuizInfoById(quizId);
        if (response?.status !== 400) {
            setQuizInfo(response);
        }
    };

    const handleDoTestClick = () => {
        setIsPreparing(true);
        setCountdown(15);
        
        const timer = setInterval(() => {
            setCountdown((prev) => {
                if (prev <= 1) {
                    clearInterval(timer);
                    navigate(`/quiz/${quizId}`);
                    return 0; // Stop countdown
                }
                return prev - 1; // Decrease countdown
            });
        }, 700);
    };

    return (
        <>
            <div className="card quiz-info-review">
                <div className="card-body">
                    <h2><b>YOUR TEST IS READY!</b></h2>
                    <div className="test-details">
                        <table className="table">
                            <thead>
                                <tr>
                                    <th>Duration</th>
                                    <th>Language</th>
                                    <th>Level</th>
                                    <th>Type</th>
                                    <th>Number questions</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td>{quizInfo.duration / 60} minutes</td>
                                    <td>{quizInfo.language}</td>
                                    <td>{quizInfo.level}</td>
                                    <td>{quizInfo.type}</td>
                                    <td>{quizInfo.problemNumber}</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>

                    {/* Buttons */}
                    <div className="actions">
                        <button className="btn btn-secondary">Invite link</button>
                        <button 
                            className="btn btn-primary" 
                            onClick={handleDoTestClick} 
                            disabled={isPreparing} // Disable button if preparing
                        >
                            {isPreparing ? `Preparing... (${countdown})` : "Do test"}
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
};

export default QuizInfoReview;
