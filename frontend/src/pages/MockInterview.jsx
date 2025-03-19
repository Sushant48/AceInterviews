import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import BASE_URL from "@/config";

const MockInterview = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { resumeId, jobTitle } = location.state || {};

  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [loading, setLoading] = useState(false);
  const [answer, setAnswer] = useState("");
  const [interviewId, setInterviewId] = useState("");
  const [isRecording, setIsRecording] = useState(false);
  const [feedback, setFeedback] = useState(null);
  const recognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  let speechRecognizer;


  useEffect(() => {
    if (!resumeId || !jobTitle) {
      navigate("/dashboard");
    }
  }, [resumeId, jobTitle, navigate]);

  const startInterview = async () => {
    setLoading(true);
    try {
      const response = await axios.post(
        `${BASE_URL}/interview/startInterview`,
        { resumeId, jobTitle },
        { withCredentials: true }
      );
      
      setQuestions(response.data.data.questions);
      setInterviewId(response.data.data._id);
    } catch (error) {
      console.error("Error starting interview", error);
    }
    setLoading(false);
  };

  const handleSubmitAnswer = async () => {
    
    try {
      await axios.post(
        `${BASE_URL}/interview/submitAnswer`,
        {
          interviewId,
          questionId: questions[currentQuestionIndex]._id,
          userAnswer: answer,
        },
        { withCredentials: true }
      );
      setAnswer("");
      if (currentQuestionIndex < questions.length - 1) {
        setCurrentQuestionIndex((prev) => prev + 1);
      } else {
        completeInterview(interviewId);
      }
    } catch (error) {
      console.error("Error submitting answer", error);
    }
  };

  const completeInterview = async (interviewId) => {
    try {
      const response = await axios.post(
        `${BASE_URL}/interview/completeInterview`,
        { interviewId },
        { withCredentials: true }
      );
      
      setFeedback(response.data.data);
    } catch (error) {
      console.error("Error completing interview", error);
    }
  };

  const startSpeechRecognition = () => {
    if (!recognition) return;
    setIsRecording(true);
    speechRecognizer = new recognition();
    speechRecognizer.continuous = false;
    speechRecognizer.interimResults = false;
    speechRecognizer.lang = "en-US";
    speechRecognizer.start();

    speechRecognizer.onresult = (event) => {
      setAnswer(event.results[0][0].transcript);
    };

    speechRecognizer.onerror = (event) => {
      console.error("Speech Recognition Error", event);
    };

    speechRecognizer.onend = () => {
      setIsRecording(false);
    };
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-[var(--color-background)] text-[var(--color-textDark)]">
      <h1 className="text-3xl font-bold text-[var(--color-primary)] mb-6">Mock Interview</h1>
      {questions.length === 0 ? (
        <button
          onClick={startInterview}
          className="px-6 py-3 bg-[var(--color-primary)] text-white text-xl rounded-2xl shadow-md hover:bg-[var(--color-accent)] transition"
          disabled={loading}
        >
          {loading ? "Starting..." : "Start Interview"}
        </button>
      ) : feedback ? (
        <div className="w-3/4 p-6 bg-white shadow-lg rounded-2xl border border-[var(--color-borderLight)]">
          <h2 className="text-xl font-semibold">Interview Feedback</h2>
          <p className="mt-3"><strong>Score:</strong> {feedback.overallScore}%</p>
          <p className="mt-2"><strong>Strengths:</strong> {feedback.strengths.join(", ")}</p>
          <p className="mt-2"><strong>Weaknesses:</strong> {feedback.weaknesses.join(", ")}</p>
          <p className="mt-2"><strong>Comments:</strong> {feedback.comments}</p>
          <button
            onClick={() => navigate("/dashboard")}
            className="mt-4 px-6 py-3 bg-[var(--color-primary)] text-white text-xl rounded-2xl shadow-md hover:bg-[var(--color-accent)] transition"
          >
            Back to Dashboard
          </button>
        </div>
      ) : (
        <div className="w-3/4 p-6 bg-white shadow-lg rounded-2xl border border-[var(--color-borderLight)]">
          <h2 className="text-xl font-semibold">Question {currentQuestionIndex + 1}</h2>
          <p className="text-lg mt-3">{questions[currentQuestionIndex].question}</p>

          <textarea
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
            placeholder="Type your answer here..."
            className="w-full mt-4 p-3 border border-[var(--color-borderDark)] rounded-lg"
          />

          <div className="flex gap-4 mt-4">
            <button
              onClick={startSpeechRecognition}
              className={`px-6 py-3 text-white text-xl rounded-2xl shadow-md transition ${isRecording ? "bg-gray-500" : "bg-[var(--color-accent)] hover:bg-[var(--color-primary)]"}`}
              disabled={isRecording}
            >
              {isRecording ? "Listening..." : "Use Voice Input"}
            </button>
            <button
              onClick={handleSubmitAnswer}
              className="px-6 py-3 bg-[var(--color-primary)] text-white text-xl rounded-2xl shadow-md hover:bg-[var(--color-accent)] transition"
            >
              Submit Answer
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default MockInterview;
