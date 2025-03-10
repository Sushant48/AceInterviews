import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

const InterviewHistory = () => {
  const [interviews, setInterviews] = useState([
    {
      _id: '1',
      jobTitle: 'Frontend Developer',
      date: '2025-02-28',
      status: 'Completed',
      feedback: 'Great performance, but improve on system design questions.'
    },
    {
      _id: '2',
      jobTitle: 'Full Stack Engineer',
      date: '2025-03-05',
      status: 'In Progress',
      feedback: ''
    }
  ]);

  const handleViewDetails = (interviewId) => {
    console.log(`View details for interview ID: ${interviewId}`);
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
                    <p className="font-medium">{interview.jobTitle}</p>
                    <p className="text-sm text-gray-500">{new Date(interview.date).toLocaleDateString()}</p>
                    <p className={`text-sm ${interview.status === 'Completed' ? 'text-green-500' : 'text-yellow-500'}`}>
                      {interview.status}
                    </p>
                    {interview.feedback && (
                      <p className="text-sm text-gray-700 mt-2">Feedback: {interview.feedback}</p>
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
