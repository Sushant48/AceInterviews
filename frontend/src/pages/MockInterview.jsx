import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import BASE_URL from "@/config";
import { Mic, Send, ArrowLeft, Award, Check, X } from "lucide-react";

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
  const [progress, setProgress] = useState(0);
  const recognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  let speechRecognizer;

  useEffect(() => {
    if (!resumeId || !jobTitle) {
      navigate("/dashboard");
    }
  }, [resumeId, jobTitle, navigate]);

  useEffect(() => {
    if (questions.length > 0) {
      setProgress(((currentQuestionIndex + 1) / questions.length) * 100);
    }
  }, [currentQuestionIndex, questions]);

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
    <div className="min-h-screen flex flex-col items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-purple-50 to-white">
    
      <div className="w-full max-w-4xl mb-8 text-center">
        <h1 className="text-3xl sm:text-4xl font-bold text-[#491B6D] inline-block relative">
          Mock Interview
          <span className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-[#491B6D] to-[#A26DB1]"></span>
        </h1>
        {questions.length > 0 && !feedback && (
          <div className="mt-6 mb-4">
            <p className="text-[#4B4B4B] mb-2">Question {currentQuestionIndex + 1} of {questions.length}</p>
            <div className="w-full bg-[#E6E6E6] h-2 rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-[#491B6D] to-[#A26DB1] transition-all duration-300 ease-out"
                style={{ width: `${progress}%` }}
              ></div>
            </div>
          </div>
        )}
      </div>

      {questions.length === 0 ? (
        <div className="max-w-md w-full bg-white p-8 rounded-2xl shadow-lg border border-[#E6E6E6] text-center">
          <div className="mb-6">
            <div className="w-24 h-24 mx-auto bg-purple-100 rounded-full flex items-center justify-center">
              <Mic className="w-12 h-12 text-[#491B6D]" />
            </div>
          </div>
          <h2 className="text-2xl font-semibold text-[#000000] mb-4">Ready for your interview?</h2>
          <p className="text-[#4B4B4B] mb-6">Prepare to answer questions related to your resume and the job position.</p>
          <button
            onClick={startInterview}
            className="w-full px-6 py-4 bg-[#491B6D] text-white text-xl rounded-xl shadow-md hover:bg-[#A26DB1] transition-all duration-300 transform hover:scale-105 flex items-center justify-center"
            disabled={loading}
          >
            {loading ? (
              <div className="flex items-center">
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <span>Starting...</span>
              </div>
            ) : (
              <span>Start Interview</span>
            )}
          </button>
        </div>
      ) : feedback ? (
        <div className="max-w-2xl w-full p-8 bg-white shadow-lg rounded-2xl border border-[#E6E6E6]">
          <div className="flex justify-center mb-6">
            <div className="w-20 h-20 rounded-full bg-purple-100 flex items-center justify-center">
              <Award className="w-10 h-10 text-[#491B6D]" />
            </div>
          </div>
          
          <h2 className="text-2xl font-bold text-center text-[#000000] mb-6">Interview Feedback</h2>
          
          <div className="mb-6 flex justify-center">
            <div className="relative w-32 h-32">
              <div className="w-full h-full rounded-full bg-gray-100 flex items-center justify-center">
                <span className="text-3xl font-bold text-[#491B6D]">{feedback.overallScore}%</span>
              </div>
              <svg className="absolute top-0 left-0 w-full h-full" viewBox="0 0 100 100">
                <circle 
                  cx="50" cy="50" r="45" 
                  fill="none" 
                  stroke="#E6E6E6" 
                  strokeWidth="8"
                />
                <circle 
                  cx="50" cy="50" r="45" 
                  fill="none" 
                  stroke="#491B6D" 
                  strokeWidth="8"
                  strokeDasharray={`${2 * Math.PI * 45}`}
                  strokeDashoffset={`${2 * Math.PI * 45 * (1 - feedback.overallScore / 100)}`}
                  strokeLinecap="round"
                  transform="rotate(-90 50 50)"
                />
              </svg>
            </div>
          </div>
          
          <div className="space-y-4 mb-6">
            <div className="p-4 rounded-xl bg-green-50 border border-green-200">
              <h3 className="text-lg font-semibold text-green-800 flex items-center">
                <Check className="w-5 h-5 mr-2" /> Strengths
              </h3>
              <ul className="mt-2 pl-7 list-disc text-[#4B4B4B]">
                {feedback.strengths.map((strength, index) => (
                  <li key={index}>{strength}</li>
                ))}
              </ul>
            </div>
            
            <div className="p-4 rounded-xl bg-red-50 border border-red-200">
              <h3 className="text-lg font-semibold text-red-800 flex items-center">
                <X className="w-5 h-5 mr-2" /> Areas to Improve
              </h3>
              <ul className="mt-2 pl-7 list-disc text-[#4B4B4B]">
                {feedback.weaknesses.map((weakness, index) => (
                  <li key={index}>{weakness}</li>
                ))}
              </ul>
            </div>
          </div>
          
          <div className="p-4 rounded-xl bg-purple-50 border border-purple-200 mb-6">
            <h3 className="text-lg font-semibold text-[#491B6D]">Feedback</h3>
            <p className="mt-2 text-[#4B4B4B]">{feedback.comments}</p>
          </div>
          
          <button
            onClick={() => navigate("/dashboard")}
            className="w-full flex items-center justify-center px-6 py-4 bg-[#491B6D] text-white text-xl rounded-xl shadow-md hover:bg-[#A26DB1] transition-all duration-300"
          >
            <ArrowLeft className="w-5 h-5 mr-2" /> Back to Dashboard
          </button>
        </div>
      ) : (
        <div className="max-w-3xl w-full p-6 sm:p-8 bg-white shadow-lg rounded-2xl border border-[#E6E6E6]">
          <div className="mb-6">
            <div className="p-4 rounded-xl bg-purple-50 border border-purple-100">
              <h2 className="text-xl font-semibold text-[#491B6D]">Question {currentQuestionIndex + 1}</h2>
              <p className="text-lg mt-2 text-[#000000]">{questions[currentQuestionIndex].question}</p>
            </div>
          </div>

          <div className="relative">
            <textarea
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
              placeholder="Type your answer here..."
              className="w-full p-4 min-h-40 border border-[#D9D9D9] rounded-xl focus:ring-2 focus:ring-[#A26DB1] focus:border-transparent transition-all duration-200 outline-none text-[#000000] placeholder-[#4B4B4B]/50"
            />
            
            {isRecording && (
              <div className="absolute top-4 right-4 bg-red-500 text-white px-3 py-1 rounded-full text-sm flex items-center">
                <span className="animate-pulse mr-2 inline-block w-2 h-2 bg-white rounded-full"></span>
                Recording
              </div>
            )}
          </div>

          <div className="flex flex-col sm:flex-row gap-4 mt-6">
            <button
              onClick={startSpeechRecognition}
              className={`flex-1 flex items-center justify-center px-6 py-3 text-white text-xl rounded-xl shadow-md transition-all duration-300 ${
                isRecording 
                ? "bg-gray-400 cursor-not-allowed" 
                : "bg-[#A26DB1] hover:bg-[#491B6D] transform hover:scale-105"
              }`}
              disabled={isRecording}
            >
              <Mic className="w-5 h-5 mr-2" />
              {isRecording ? "Listening..." : "Use Voice Input"}
            </button>
            
            <button
              onClick={handleSubmitAnswer}
              disabled={!answer.trim()}
              className={`flex-1 flex items-center justify-center px-6 py-3 text-white text-xl rounded-xl shadow-md transition-all duration-300 ${
                !answer.trim() 
                ? "bg-gray-300 cursor-not-allowed" 
                : "bg-[#491B6D] hover:bg-[#A26DB1] transform hover:scale-105"
              }`}
            >
              <Send className="w-5 h-5 mr-2" />
              Submit Answer
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default MockInterview;