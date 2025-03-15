import { useEffect, useState } from 'react';
import axios from 'axios';
import BASE_URL from '@/config';
import { Card, CardContent } from '@/components/ui/card';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

const PerformanceMetrics = () => {
  const [metrics, setMetrics] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPerformanceMetrics = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/interview/performance-metrics`, {
          withCredentials: true,
        });
        
        setMetrics(response.data.data);
      } catch (error) {
        console.error('Failed to fetch performance metrics', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPerformanceMetrics();
  }, []);

  if (loading) return <p className="text-center mt-10">Loading performance metrics...</p>;
  if (!metrics) return <p className="text-center mt-10">No performance data available.</p>;

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
            <h2 className="text-xl font-semibold">Top Strengths</h2>
            <ul className="list-disc pl-5">
              {metrics.topStrengths.length > 0 ? (
                metrics.topStrengths.map((strength, index) => <li key={index}>{strength}</li>)
              ) : (
                <li>No strengths identified</li>
              )}
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardContent>
            <h2 className="text-xl font-semibold">Top Weaknesses</h2>
            <ul className="list-disc pl-5">
              {metrics.topWeaknesses.length > 0 ? (
                metrics.topWeaknesses.map((weakness, index) => <li key={index}>{weakness}</li>)
              ) : (
                <li>No weaknesses identified</li>
              )}
            </ul>
          </CardContent>
        </Card>
      </div>

      <div className="mt-8">
        <h2 className="text-xl font-semibold mb-4">Performance Trend</h2>
        {metrics.performanceTrend.length > 0 ? (
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={metrics.performanceTrend}>
              <XAxis dataKey="date" />
              <YAxis domain={[0, 100]} />
              <Tooltip />
              <Line type="monotone" dataKey="score" stroke="#491B6D" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        ) : (
          <p>No performance trend data available</p>
        )}
      </div>
    </div>
  );
};

export default PerformanceMetrics;
