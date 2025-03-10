import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const Dashboard = () => {
  const [stats, setStats] = useState({ totalInterviews: 0, avgScore: 0 });
  const [recentInterviews, setRecentInterviews] = useState([]);

  useEffect(() => {
    // Placeholder for API call to fetch performance metrics
    const fetchStats = async () => {
      // Simulated data
      setStats({ totalInterviews: 12, avgScore: 85 });
    };

    // Placeholder for API call to fetch recent interview history
    const fetchRecentInterviews = async () => {
      setRecentInterviews([
        { id: 1, title: "SDE Mock", score: 90, date: "2025-03-05" },
        { id: 2, title: "Frontend Role", score: 78, date: "2025-02-28" },
      ]);
    };

    fetchStats();
    fetchRecentInterviews();
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold">Welcome back!</h1>

      <div className="mt-6 grid grid-cols-2 gap-6">
        <div className="p-4 bg-[#491B6D] text-white rounded-2xl shadow-md">
          <h2 className="text-xl">Total Interviews</h2>
          <p className="text-4xl font-bold">{stats.totalInterviews}</p>
        </div>
        <div className="p-4 bg-[#A26DB1] text-white rounded-2xl shadow-md">
          <h2 className="text-xl">Average Score</h2>
          <p className="text-4xl font-bold">{stats.avgScore}%</p>
        </div>
      </div>

      <Link
        to="/start-interview"
        className="block mt-8 bg-[#491B6D] text-white text-center py-3 rounded-2xl text-xl shadow-md hover:bg-[#A26DB1]"
      >
        Start New Interview
      </Link>

      <div className="mt-10">
        <h2 className="text-2xl font-bold">Recent Interviews</h2>
        <ul>
          {recentInterviews.map((interview) => (
            <li
              key={interview.id}
              className="mt-4 p-4 bg-[#E6E6E6] rounded-2xl shadow-sm"
            >
              <h3 className="text-lg font-bold">{interview.title}</h3>
              <p>Score: {interview.score}%</p>
              <p>Date: {interview.date}</p>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Dashboard;
