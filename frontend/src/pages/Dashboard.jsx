import { useEffect, useState } from "react";
import { Link, useNavigate} from "react-router-dom";
import axios from "axios";
import BASE_URL from "@/config";
import { useAuth } from "@/context/AuthContext";
import { toast } from "react-toastify";

const Dashboard = () => {
  const [stats, setStats] = useState({});
  const [recentInterviews, setRecentInterviews] = useState([]);
  const [primaryResume, setPrimaryResume] = useState(null);
  const navigate = useNavigate();
  const {user} = useAuth();

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
        setRecentInterviews(response.data.data);
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
      toast.error("Please set a primary resume before starting the interview.")
      navigate("/resumes")
      return;
    }
    navigate("/mock-interview", {
      state: { resumeId: primaryResume._id, jobTitle: primaryResume.jobTitle },
    });
  };

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold">Welcome back! {user.username}</h1>

      <div className="mt-6 grid grid-cols-2 gap-6">
        <div className="p-4 bg-[#491B6D] text-white rounded-2xl shadow-md">
          <h2 className="text-xl">Total Interviews</h2>
          <p className="text-4xl font-bold">{stats?.totalInterviews || 0}</p>
        </div>
        <div className="p-4 bg-[#A26DB1] text-white rounded-2xl shadow-md">
          <h2 className="text-xl">Average Score</h2>
          <p className="text-4xl font-bold">{stats?.averageScore || 0}%</p>
        </div>
      </div>

      <button
        onClick={handleMockInterview}
        className="block mt-8 bg-[#491B6D] text-white text-center py-3 rounded-2xl text-xl shadow-md hover:bg-[#A26DB1] w-full"
      >
        Start Mock Interview
      </button>

      <button
        className="block mt-4 bg-[#491B6D] text-white text-center py-3 rounded-2xl text-xl shadow-md hover:bg-[#A26DB1] w-full"
      >
        Start Real-Time Interview
      </button>

      <div className="mt-10">
        <h2 className="text-2xl font-bold">Recent Interviews</h2>
        <ul>
          {recentInterviews.length>0 ? (recentInterviews?.map((interview) => (
            <li
              key={interview._id}
              className="mt-4 p-4 bg-[#E6E6E6] rounded-2xl shadow-sm"
            >
              <h3 className="text-lg font-bold">{interview?.title}</h3>
              <p>Score: {interview?.interviewFeedback?.overallScore}%</p>
              <p>Date: {new Date(interview?.createdAt).toLocaleDateString()}</p>
            </li>
          ))) : ("Empty recent interviews")}
        </ul>
      </div>
    </div>
  );
};

export default Dashboard;
