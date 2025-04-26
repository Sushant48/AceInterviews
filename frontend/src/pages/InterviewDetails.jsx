import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import BASE_URL from "@/config";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, AlertCircle, Calendar, ClipboardList, Loader2 } from "lucide-react";

const Separator = ({ className = "" }) => (
  <div className={`border-b border-gray-200 ${className}`} />
);

const InterviewDetails = () => {
  const { id } = useParams();
  const [interview, setInterview] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchInterviewDetails = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/interview/${id}`, {
          withCredentials: true,
        });
        setInterview(response.data.data);
      } catch (error) {
        console.error("Failed to fetch interview details", error);
      } finally {
        setLoading(false);
      }
    };

    fetchInterviewDetails();
  }, [id]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin text-[#491B6D]" />
        <span className="ml-2 text-lg text-gray-600">Loading interview details...</span>
      </div>
    );
  }

  if (!interview) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <AlertCircle className="w-8 h-8 text-red-500" />
        <span className="ml-2 text-lg text-gray-600">Interview not found.</span>
      </div>
    );
  }

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case 'completed':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getScoreColor = (score) => {
    if (score >= 80) return 'text-green-600 bg-green-50';
    if (score >= 60) return 'text-yellow-600 bg-yellow-50';
    return 'text-red-600 bg-red-50';
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8">
      <div className="max-w-6xl mx-auto">
       
        <div className="mb-8 animate-fade-in">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-[#491B6D] mb-2">
            Interview Details
          </h1>
          <p className="text-gray-600">
            Review your interview performance and feedback
          </p>
        </div>

      
        <Card className="bg-[#F4ECF7] rounded-2xl shadow-md mb-8 hover:shadow-lg transition-shadow duration-300 animate-slide-in">
          <CardContent className="p-6">
            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
              <div>
                <h2 className="text-xl sm:text-2xl font-semibold text-[#491B6D] mb-2">
                  {interview.title}
                </h2>
                <div className="flex items-center text-gray-600 mb-3">
                  <Calendar className="w-4 h-4 mr-2" />
                  <span>{new Date(interview.createdAt).toLocaleDateString()}</span>
                </div>
              </div>
              <Badge 
                variant="outline" 
                className={`px-4 py-2 text-sm font-medium ${getStatusColor(interview.status)} self-start`}
              >
                {interview.status.charAt(0).toUpperCase() + interview.status.slice(1)}
              </Badge>
            </div>

            {interview.interviewFeedback && (
              <div className="mt-6 bg-white p-6 rounded-xl shadow-sm animate-scale-in">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-bold text-[#491B6D]">Feedback Summary</h3>
                  <div className={`px-4 py-2 rounded-lg font-semibold ${getScoreColor(interview.interviewFeedback.overallScore)}`}>
                    Score: {interview.interviewFeedback.overallScore}%
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Strengths */}
                  <div className="space-y-3">
                    <h4 className="font-semibold text-[#491B6D] flex items-center">
                      <CheckCircle2 className="w-5 h-5 mr-2 text-green-500" />
                      Strengths
                    </h4>
                    <ul className="space-y-2">
                      {interview.interviewFeedback.strengths.length > 0 ? (
                        interview.interviewFeedback.strengths.map((strength, index) => (
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
                        <li className="p-3 bg-gray-50 rounded-lg text-gray-600">None</li>
                      )}
                    </ul>
                  </div>

                  {/* Weaknesses */}
                  <div className="space-y-3">
                    <h4 className="font-semibold text-[#491B6D] flex items-center">
                      <AlertCircle className="w-5 h-5 mr-2 text-yellow-500" />
                      Areas for Improvement
                    </h4>
                    <ul className="space-y-2">
                      {interview.interviewFeedback.weaknesses.length > 0 ? (
                        interview.interviewFeedback.weaknesses.map((weakness, index) => (
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
                        <li className="p-3 bg-gray-50 rounded-lg text-gray-600">None</li>
                      )}
                    </ul>
                  </div>
                </div>

                {interview.interviewFeedback.comments && (
                  <div className="mt-6 p-4 bg-[#F4ECF7] rounded-lg">
                    <h4 className="font-semibold text-[#491B6D] mb-2">Additional Comments</h4>
                    <p className="text-gray-700">{interview.interviewFeedback.comments}</p>
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Questions & Answers */}
        <div className="space-y-6 animate-fade-in-up">
          <div className="flex items-center gap-2 mb-6">
            <ClipboardList className="w-6 h-6 text-[#491B6D]" />
            <h2 className="text-2xl font-bold text-[#491B6D]">Questions & Answers</h2>
          </div>
          
          {interview.questions.map((q, index) => (
            <Card 
              key={index} 
              className="bg-white border border-gray-200 rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 animate-slide-in"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-10 h-10 bg-[#491B6D] text-white rounded-full flex items-center justify-center font-semibold">
                    {index + 1}
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg text-[#491B6D] mb-3">
                      {q.question}
                    </h3>
                    <Separator className="my-4" />
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <p className="text-gray-700">
                        {q.userAnswer || <span className="text-gray-400 italic">Not answered</span>}
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default InterviewDetails;