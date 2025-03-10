import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

const PerformanceMetrics = () => {
  const [metrics, setMetrics] = useState({
    totalInterviews: 10,
    averageScore: 85,
    strengths: ['Technical Knowledge', 'Communication'],
    weaknesses: ['Time Management', 'System Design'],
    performanceTrend: [
      { date: 'Feb 1', score: 70 },
      { date: 'Feb 5', score: 80 },
      { date: 'Feb 10', score: 90 },
      { date: 'Feb 15', score: 85 }
    ]
  });

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Performance Metrics</h1>

      <div className="grid grid-cols-2 gap-4 mb-4">
        <Card>
          <CardContent>
            <h2 className="text-xl font-semibold">Total Interviews</h2>
            <p className="text-3xl">{metrics.totalInterviews}</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent>
            <h2 className="text-xl font-semibold">Average Score</h2>
            <p className="text-3xl">{metrics.averageScore}%</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <Card>
          <CardContent>
            <h2 className="text-xl font-semibold">Strengths</h2>
            <ul className="list-disc pl-5">
              {metrics.strengths.map((strength, index) => (
                <li key={index}>{strength}</li>
              ))}
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardContent>
            <h2 className="text-xl font-semibold">Weaknesses</h2>
            <ul className="list-disc pl-5">
              {metrics.weaknesses.map((weakness, index) => (
                <li key={index}>{weakness}</li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>

      <div className="mt-8">
        <h2 className="text-xl font-semibold mb-4">Performance Trend</h2>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={metrics.performanceTrend}> 
            <XAxis dataKey="date" />
            <YAxis domain={[0, 100]} />
            <Tooltip />
            <Line type="monotone" dataKey="score" stroke="#491B6D" strokeWidth={2} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default PerformanceMetrics;
