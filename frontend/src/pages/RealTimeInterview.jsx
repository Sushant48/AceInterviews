import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { io } from "socket.io-client";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Mic, MicOff, Send, X, CheckCircle, AlertCircle } from "lucide-react";

const socket = io(import.meta.env.VITE_BACKEND_URL, {
  withCredentials: true,
  transports: ["websocket", "polling"],
});

export default function RealTimeInterviewPage() {
  const location = useLocation();
  const navigate = useNavigate();

  const { interviewId } = location.state || {};
  const [question, setQuestion] = useState("");
  const [questionId, setQuestionId] = useState(null);
  const [answer, setAnswer] = useState("");
  const [feedback, setFeedback] = useState("");
  const [overallFeedback, setOverallFeedback] = useState(null);
  const [interviewCompleted, setInterviewCompleted] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [isAnswerSubmitted, setIsAnswerSubmitted] = useState(false);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(1);
  const [loading, setLoading] = useState(true);
  
  const recognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  let speechRecognizer;

  useEffect(() => {
    if (!interviewId) {
      setLoading(false);
      return;
    }
    
    setLoading(true);
    
    setTimeout(() => {
      setLoading(false);
    }, 1500);
    
    console.log(`🔄 Joining interview: ${interviewId}`);

    socket.emit("joinInterview", { interviewId, userId: "USER_ID" });

    socket.on("realTimeInterviewStarted", ({ fques }) => {
      console.log("Real time started, fques:", fques);
      setQuestion(fques.question);
      setQuestionId(fques._id);
      setFeedback("");
      setAnswer("");
      setIsAnswerSubmitted(false);
      setCurrentQuestionIndex(1);
    });

    socket.on("nextQuestion", ({ question, id, index }) => {
      setQuestion(question);
      setQuestionId(id);
      setFeedback("");
      setAnswer("");
      setIsAnswerSubmitted(false);
      setCurrentQuestionIndex(index || currentQuestionIndex + 1);
    });

    socket.on("liveFeedback", ({ message }) => {
      setFeedback(message);
    });

    socket.on("interviewCompleted", (feedback) => {
      setInterviewCompleted(true);
      setOverallFeedback(feedback);
    });

    return () => {
      socket.off("realTimeInterviewStarted");
      socket.off("nextQuestion");
      socket.off("liveFeedback");
      socket.off("interviewCompleted");
    };
  }, [interviewId]);

  const handleSendAnswer = () => {
    if (!answer.trim() || !questionId) return;
    socket.emit("sendAnswer", { interviewId, questionId, answer });
    setIsAnswerSubmitted(true);
  };

  const handleEndInterview = () => {
    socket.emit("endInterview", { interviewId });
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

  const stopSpeechRecognition = () => {
    if (speechRecognizer) {
      speechRecognizer.stop();
      setIsRecording(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-b from-white to-[#F4ECF7]">
        <div className="text-center animate-pulse">
          <div className="w-16 h-16 mx-auto mb-4 border-4 border-[#491B6D] border-t-transparent rounded-full animate-spin"></div>
          <p className="text-lg text-[#491B6D]">Connecting to interview...</p>
        </div>
      </div>
    );
  }

  if (!interviewId) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-b from-white to-[#F4ECF7]">
        <Card className="w-full max-w-lg p-6 border-0 shadow-lg animate-fade-in">
          <CardContent className="text-center">
            <AlertCircle className="w-16 h-16 mx-auto mb-4 text-red-500" />
            <h2 className="text-2xl font-bold text-[#491B6D] mb-4">Interview Not Found</h2>
            <p className="mb-6 text-gray-600">No interview ID was provided. Please start a new interview.</p>
            <Button 
              className="px-6 py-2 bg-[#491B6D] hover:bg-[#3a1457] text-white transition-colors duration-300"
              onClick={() => navigate("/dashboard")}
            >
              Return to Dashboard
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (interviewCompleted && overallFeedback) {
    const scoreColor = 
      overallFeedback.overallScore >= 80 ? "text-green-600" :
      overallFeedback.overallScore >= 60 ? "text-yellow-600" : "text-red-600";

    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-b from-white to-[#F4ECF7] p-4">
        <Card className="w-full max-w-2xl border-0 shadow-xl rounded-3xl overflow-hidden animate-scale-in">
          <div className="h-3 bg-[#491B6D]"></div>
          <CardContent className="p-8">
            <div className="flex items-center mb-6">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mr-4">
                <CheckCircle className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-[#491B6D]">Interview Complete</h2>
                <p className="text-gray-600">Here's your performance feedback</p>
              </div>
            </div>
            
            <div className="mb-6 p-6 bg-[#F4ECF7] rounded-xl">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-semibold text-[#491B6D]">Overall Score</h3>
                <div className={`text-2xl font-bold ${scoreColor} bg-white py-2 px-6 rounded-full shadow-sm`}>
                  {overallFeedback.overallScore}%
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <h4 className="font-semibold text-[#491B6D]">Strengths</h4>
                  <ul className="space-y-2">
                    {overallFeedback.strengths.length > 0 ? (
                      overallFeedback.strengths.map((strength, index) => (
                        <li 
                          key={index} 
                          className="flex items-center p-3 bg-green-50 rounded-lg text-green-700 animate-fade-in"
                          style={{ animationDelay: `${index * 100}ms` }}
                        >
                          <div className="w-1.5 h-1.5 bg-green-500 rounded-full mr-3"></div>
                          {strength}
                        </li>
                      ))
                    ) : (
                      <li className="p-3 bg-gray-50 rounded-lg text-gray-600">None identified</li>
                    )}
                  </ul>
                </div>
                
                <div className="space-y-3">
                  <h4 className="font-semibold text-[#491B6D]">Areas for Improvement</h4>
                  <ul className="space-y-2">
                    {overallFeedback.weaknesses.length > 0 ? (
                      overallFeedback.weaknesses.map((weakness, index) => (
                        <li 
                          key={index} 
                          className="flex items-center p-3 bg-yellow-50 rounded-lg text-yellow-700 animate-fade-in"
                          style={{ animationDelay: `${index * 100}ms` }}
                        >
                          <div className="w-1.5 h-1.5 bg-yellow-500 rounded-full mr-3"></div>
                          {weakness}
                        </li>
                      ))
                    ) : (
                      <li className="p-3 bg-gray-50 rounded-lg text-gray-600">None identified</li>
                    )}
                  </ul>
                </div>
              </div>
            </div>
            
            {overallFeedback.comments && (
              <div className="mb-8 p-4 bg-white border border-gray-200 rounded-lg">
                <h4 className="font-medium text-[#491B6D] mb-2">Additional Comments:</h4>
                <p className="text-gray-700">{overallFeedback.comments}</p>
              </div>
            )}
            
            <Button
              onClick={() => navigate("/dashboard")}
              className="w-full py-3 bg-[#491B6D] hover:bg-[#3a1457] text-white text-lg rounded-xl transition-colors duration-300"
            >
              Return to Dashboard
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-b from-white to-[#F4ECF7] p-4">
      <Card className="w-full max-w-2xl border-0 shadow-xl rounded-3xl overflow-hidden animate-fade-in">
        <div className="h-3 bg-[#491B6D]"></div>
        <CardContent className="p-6 md:p-8">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center">
              <div className="w-10 h-10 bg-[#F4ECF7] rounded-full flex items-center justify-center text-[#491B6D] font-bold mr-3">
                {currentQuestionIndex}
              </div>
              <h3 className="text-lg font-medium text-gray-600">Question</h3>
            </div>
            <Button
              variant="outline"
              className="border-red-300 text-red-500 hover:bg-red-50 hover:text-red-600"
              onClick={handleEndInterview}
            >
              <X className="w-4 h-4 mr-1" /> End Interview
            </Button>
          </div>
          
          <div className="p-5 bg-[#F4ECF7] rounded-xl mb-6 animate-slide-in">
            <h2 className="text-xl font-semibold text-[#491B6D]">
              {question || "Waiting for question..."}
            </h2>
          </div>
          
          <div className="mb-6">
            <label htmlFor="answer" className="block text-sm font-medium text-gray-700 mb-2">
              Your Answer:
            </label>
            <div className="relative">
              <Input
                id="answer"
                className="p-3 pr-12 border border-gray-300 rounded-xl text-base"
                placeholder="Type your answer here..."
                value={answer}
                onChange={(e) => setAnswer(e.target.value)}
                disabled={isAnswerSubmitted}
              />
              {isRecording && (
                <div className="absolute right-4 top-3">
                  <span className="flex h-3 w-3">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
                  </span>
                </div>
              )}
            </div>
          </div>
          
          <div className="flex flex-wrap gap-3 mb-6">
            {isRecording ? (
              <Button
                className="flex-1 sm:flex-none bg-red-500 hover:bg-red-600 text-white transition-colors duration-300"
                onClick={stopSpeechRecognition}
              >
                <MicOff className="w-4 h-4 mr-2" /> Stop Recording
              </Button>
            ) : (
              <Button
                className="flex-1 sm:flex-none bg-[#491B6D] hover:bg-[#3a1457] text-white transition-colors duration-300"
                onClick={startSpeechRecognition}
                disabled={!recognition || isAnswerSubmitted}
              >
                <Mic className="w-4 h-4 mr-2" /> Voice Input
              </Button>
            )}
            
            <Button
              className="flex-1 sm:flex-none bg-[#491B6D] hover:bg-[#3a1457] text-white transition-colors duration-300"
              onClick={handleSendAnswer}
              disabled={!answer.trim() || isAnswerSubmitted}
            >
              <Send className="w-4 h-4 mr-2" /> Submit Answer
            </Button>
          </div>
          
          {feedback && (
            <div className="p-4 bg-white border border-[#F4ECF7] rounded-xl animate-fade-in-up">
              <h4 className="font-medium text-[#491B6D] mb-2">AI Feedback:</h4>
              <p className="text-gray-700">{feedback}</p>
            </div>
          )}
          
          {isAnswerSubmitted && !feedback && (
            <div className="flex items-center justify-center p-4 animate-pulse">
              <div className="w-5 h-5 border-2 border-[#491B6D] border-t-transparent rounded-full animate-spin mr-3"></div>
              <p className="text-gray-600">Analyzing your answer...</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}