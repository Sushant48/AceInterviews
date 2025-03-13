import { useEffect, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import BASE_URL from '@/config';

const InterviewHistory = () => {
  const [interviews, setInterviews] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchInterviews = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/interview/history`, {
          withCredentials: true,
        });
        setInterviews(response.data.data);
      } catch (error) {
        console.error('Failed to fetch interview history', error);
      }
    };

    fetchInterviews();
  }, []);

  const handleViewDetails = (interviewId) => {
    navigate(`/interview/${interviewId}`);
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Interview History</h1>

      {interviews.length === 0 ? (
        <p>No interviews conducted yet.</p>
      ) : (
        <div className="grid gap-4">
          {interviews.map(interview => (
            <Card key={interview._id}>
              <CardContent className="p-4">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="font-medium">{interview.title}</p>
                    <p className="text-sm text-gray-500">{new Date(interview.createdAt).toLocaleDateString()}</p>
                    <p className={`text-sm ${interview.status === 'completed' ? 'text-green-500' : 'text-yellow-500'}`}>
                      {interview.status}
                    </p>
                    {interview.interviewFeedback && (
                      <p className="text-sm text-gray-700 mt-2">Feedback: {interview.interviewFeedback.comments}</p>
                    )}
                  </div>

                  <Button variant="outline" onClick={() => handleViewDetails(interview._id)}>
                    View Details
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default InterviewHistory;
