import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import BASE_URL from "@/config";
import { Card, CardContent } from "@/components/ui/card";

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
        console.log("Interview response" , response);
        
        setInterview(response.data.data);
      } catch (error) {
        console.error("Failed to fetch interview details", error);
      } finally {
        setLoading(false);
      }
    };

    fetchInterviewDetails();
  }, [id]);

  if (loading) return <p className="text-center mt-10">Loading interview details...</p>;
  if (!interview) return <p className="text-center mt-10">Interview not found.</p>;

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold text-[#491B6D]">Interview Details</h1>

      <Card className="mt-6 bg-[#F4ECF7] rounded-2xl shadow-md">
        <CardContent className="p-6">
          <p className="text-xl font-medium">{interview.title}</p>
          <p className="text-gray-600">Date: {new Date(interview.createdAt).toLocaleDateString()}</p>
          <p className={`text-lg ${interview.status === 'completed' ? 'text-green-500' : 'text-yellow-500'}`}>
            Status: {interview.status}
          </p>
          {interview.interviewFeedback && (
            <div className="mt-4 bg-white p-4 rounded-2xl shadow">
              <h2 className="text-xl font-bold text-[#491B6D]">Interview Feedback</h2>
              <p className="text-gray-700 mt-2">Overall Score: {interview.interviewFeedback.overallScore}%</p>
              <div className="text-gray-700 mt-2">
                <h3 className="font-medium">Strengths:</h3>
                <ul className="list-disc list-inside">
                  {interview.interviewFeedback.strengths.length > 0 ? (
                    interview.interviewFeedback.strengths.map((strength, index) => (
                      <li key={index}>{strength}</li>
                    ))
                  ) : (
                    <li>None</li>
                  )}
                </ul>
              </div>
              <div className="text-gray-700 mt-2">
                <h3 className="font-medium">Weaknesses:</h3>
                <ul className="list-disc list-inside">
                  {interview.interviewFeedback.weaknesses.length > 0 ? (
                    interview.interviewFeedback.weaknesses.map((weakness, index) => (
                      <li key={index}>{weakness}</li>
                    ))
                  ) : (
                    <li>None</li>
                  )}
                </ul>
              </div>
              <p className="text-gray-700 mt-2">Comments: {interview.interviewFeedback.comments || 'No comments'}</p>
            </div>
          )}
        </CardContent>
      </Card>

      <div className="mt-8">
        <h2 className="text-2xl font-bold text-[#491B6D]">Questions & Answers</h2>
        {interview.questions.map((q, index) => (
          <Card key={index} className="mt-4 bg-[#E6E6E6] rounded-2xl shadow-sm">
            <CardContent className="p-4">
              <p className="font-medium">Q{index + 1}: {q.question}</p>
              <p className="text-gray-700 mt-2">Your Answer: {q.userAnswer || "Not answered"}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default InterviewDetails;
