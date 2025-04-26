import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import BASE_URL from "@/config";
import { useAuth } from "@/context/AuthContext";
import { toast } from "react-toastify";

const Dashboard = () => {
  const [stats, setStats] = useState({});
  const [recentInterviews, setRecentInterviews] = useState([]);
  const [primaryResume, setPrimaryResume] = useState(null);
  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/interview/performance-metrics`, {
          withCredentials: true,
        });
        setStats(response?.data?.data);
      } catch (error) {
        const message = error.response?.data?.message || "Failed to fetch performance metrics";
        console.error(message);
      }
    };

    const fetchRecentInterviews = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/interview/history?limit=5&sort=-date`, {
          withCredentials: true,
        });
        setRecentInterviews(response.data.data.data);
      } catch (error) {
        const message = error.response?.data?.message || "Failed to fetch recent interviews";
        console.error(message);
      }
    };

    const fetchPrimaryResume = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/resume/getUserResumes`, {
          withCredentials: true,
        });
        const primary = response.data.data.find((resume) => resume.isPrimary);
        setPrimaryResume(primary || null);
      } catch (error) {
        console.error("Failed to fetch primary resume", error);
      }
    };

    fetchStats();
    fetchRecentInterviews();
    fetchPrimaryResume();
  }, []);

  const handleMockInterview = () => {
    if (!primaryResume) {
      toast.error("Please set a primary resume before starting the interview.");
      navigate("/resumes");
      return;
    }
    navigate("/mock-interview", {
      state: { resumeId: primaryResume._id, jobTitle: primaryResume.jobTitle },
    });
  };

  const handleRealTimeInterview = async () => {
    try {
      const response = await axios.post(
        `${BASE_URL}/interview/start-realtime`,
        { resumeId: primaryResume._id, jobTitle: primaryResume.jobTitle },
        { withCredentials: true }
      );

      console.log("handleRealTimeInterview ", response);
      const interviewId = response.data.data.interviewId;

      if (response.data.success) {
        navigate("/real-time-interview", {
          state: { interviewId },
        });
      } else {
        console.error("Failed to start interview:", response.data.message);
      }
    } catch (error) {
      console.error("Error starting interview:", error);
    }
  };

  return (
    <div className="min-h-screen bg-[#FFFFFF] p-6">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-[#000000] mb-2">Welcome back, {user.username}!</h1>
        <p className="text-[#4B4B4B] mb-8">Here's what's happening today</p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="p-6 bg-gradient-to-br from-[#491B6D] to-[#A26DB1] text-white rounded-xl shadow-lg transition-transform hover:scale-105">
            <h2 className="text-lg font-medium mb-2">Total Interviews</h2>
            <p className="text-4xl font-bold mb-1">{stats?.totalInterviews || 0}</p>
            <p className="text-[rgba(255,255,255,0.8)] text-sm">Completed sessions</p>
          </div>
          <div className="p-6 bg-gradient-to-br from-[#A26DB1] to-[#491B6D] text-white rounded-xl shadow-lg transition-transform hover:scale-105">
            <h2 className="text-lg font-medium mb-2">Average Score</h2>
            <p className="text-4xl font-bold mb-1">{stats?.averageScore || 0}%</p>
            <p className="text-[rgba(255,255,255,0.8)] text-sm">Performance rating</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-10">
          <button
            onClick={handleMockInterview}
            className="bg-[#491B6D] hover:bg-[#A26DB1] text-white font-semibold py-4 px-6 rounded-xl shadow-lg transition-all hover:shadow-xl flex items-center justify-center border border-[#491B6D]"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
            </svg>
            Start Mock Interview
          </button>

          <button
            onClick={handleRealTimeInterview}
            className="bg-[#491B6D] hover:bg-[#A26DB1] text-white font-semibold py-4 px-6 rounded-xl shadow-lg transition-all hover:shadow-xl flex items-center justify-center border border-[#491B6D]"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z" />
            </svg>
            Start Real-Time Interview
          </button>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6 border border-[#E6E6E6]">
          <h2 className="text-2xl font-bold text-[#000000] mb-6">Recent Interviews</h2>
          {recentInterviews.length > 0 ? (
            <div className="space-y-4">
              {recentInterviews.map((interview) => (
                <div
                  key={interview._id}
                  className="bg-[#E6E6E6] rounded-lg p-4 hover:bg-[#D9D9D9] transition-colors"
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-lg font-semibold text-[#000000]">{interview?.title}</h3>
                      <p className="text-sm text-[#4B4B4B] mt-1">
                        {new Date(interview?.createdAt).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </p>
                    </div>
                    <div className="text-right">
                      <span className="text-2xl font-bold text-[#491B6D]">
                        {interview?.interviewFeedback?.overallScore}%
                      </span>
                      <p className="text-sm text-[#4B4B4B]">Score</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 bg-[#E6E6E6] rounded-lg">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto text-[#4B4B4B] mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
              <p className="text-[#4B4B4B]">No recent interviews found</p>
              <p className="text-sm text-[#4B4B4B] opacity-75 mt-1">Start your first interview to see it here</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;