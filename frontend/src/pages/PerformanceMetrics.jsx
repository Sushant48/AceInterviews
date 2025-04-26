import { useEffect, useState } from 'react';
import axios from 'axios';
import BASE_URL from '@/config';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { TrendingUp, Award, AlertTriangle, FileText, Percent } from 'lucide-react';

const PerformanceMetrics = () => {
  const [metrics, setMetrics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeMetric, setActiveMetric] = useState('score');
  const navigate = useNavigate();
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

  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-4 shadow-lg rounded-lg border border-[#E6E6E6]">
          <p className="text-sm text-[#4B4B4B] mb-1">{formatDate(label)}</p>
          <p className="text-[#491B6D] font-medium">
            Score: <span className="font-bold">{payload[0].value}%</span>
          </p>
        </div>
      );
    }
    return null;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-purple-50 to-white p-4 sm:p-8 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-[#491B6D] border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="mt-4 text-lg text-[#4B4B4B]">Loading your performance metrics...</p>
        </div>
      </div>
    );
  }

  if (!metrics) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-purple-50 to-white p-4 sm:p-8 flex flex-col items-center justify-center">
        <div className="text-center max-w-md">
          <div className="w-20 h-20 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <FileText className="w-10 h-10 text-[#491B6D]" />
          </div>
          <h2 className="text-2xl font-bold text-[#000000] mb-3">No Performance Data</h2>
          <p className="text-[#4B4B4B] mb-6">Complete your first interview to start tracking your progress and performance metrics.</p>
          <button 
            onClick={() => navigate('/dashboard')}
            className="px-6 py-3 bg-[#491B6D] text-white font-medium rounded-xl hover:bg-[#A26DB1] transition-all duration-300"
          >
            Start an Interview
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 to-white p-4 sm:p-8">
      <div className="max-w-6xl mx-auto">
        
        <header className="mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold text-[#000000] mb-2">Performance Dashboard</h1>
          <p className="text-[#4B4B4B]">Track your interview performance and improvement over time</p>
        </header>

        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {/* Total Interviews Card */}
          <Card className="bg-white border border-[#E6E6E6] rounded-xl shadow-sm hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-[#4B4B4B] text-sm font-medium mb-1">Total Interviews</p>
                  <h3 className="text-3xl font-bold text-[#000000]">{metrics.totalInterviews}</h3>
                </div>
                <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center">
                  <FileText className="w-5 h-5 text-[#491B6D]" />
                </div>
              </div>
              <div className="mt-4 pt-4 border-t border-[#E6E6E6]">
                <p className="text-xs text-[#4B4B4B]">
                  {metrics.totalInterviews > 0 
                    ? `${metrics.recentInterviews || 0} in the last 30 days` 
                    : "No interviews yet"}
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Average Score Card */}
          <Card className="bg-white border border-[#E6E6E6] rounded-xl shadow-sm hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-[#4B4B4B] text-sm font-medium mb-1">Average Score</p>
                  <h3 className="text-3xl font-bold text-[#000000]">{metrics.averageScore}%</h3>
                </div>
                <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center">
                  <Percent className="w-5 h-5 text-[#491B6D]" />
                </div>
              </div>
              <div className="mt-4 pt-4 border-t border-[#E6E6E6]">
                <p className="text-xs text-[#4B4B4B] flex items-center">
                  {metrics.scoreChange > 0 ? (
                    <>
                      <span className="text-green-600 mr-1">↑</span> 
                      Up {metrics.scoreChange}% from previous
                    </>
                  ) : metrics.scoreChange < 0 ? (
                    <>
                      <span className="text-red-600 mr-1">↓</span> 
                      Down {Math.abs(metrics.scoreChange)}% from previous
                    </>
                  ) : (
                    "No change from previous"
                  )}
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Best Performance Card */}
          <Card className="bg-white border border-[#E6E6E6] rounded-xl shadow-sm hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-[#4B4B4B] text-sm font-medium mb-1">Best Performance</p>
                  <h3 className="text-3xl font-bold text-[#000000]">{metrics.bestScore || 0}%</h3>
                </div>
                <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center">
                  <Award className="w-5 h-5 text-[#491B6D]" />
                </div>
              </div>
              <div className="mt-4 pt-4 border-t border-[#E6E6E6]">
                <p className="text-xs text-[#4B4B4B]">
                  {metrics.bestScoreDate 
                    ? `Achieved on ${new Date(metrics.bestScoreDate).toLocaleDateString()}` 
                    : "No interviews completed yet"}
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Areas to Improve Card */}
          <Card className="bg-white border border-[#E6E6E6] rounded-xl shadow-sm hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-[#4B4B4B] text-sm font-medium mb-1">Areas to Improve</p>
                  <h3 className="text-3xl font-bold text-[#000000]">{metrics.topWeaknesses?.length || 0}</h3>
                </div>
                <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center">
                  <TrendingUp className="w-5 h-5 text-[#491B6D]" />
                </div>
              </div>
              <div className="mt-4 pt-4 border-t border-[#E6E6E6]">
                <p className="text-xs text-[#4B4B4B]">
                  {metrics.topWeaknesses?.length > 0 
                    ? "Focusing on these will boost your score" 
                    : "No specific areas identified yet"}
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Performance Chart */}
        <Card className="bg-white border border-[#E6E6E6] rounded-xl shadow-sm mb-8">
          <CardContent className="p-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
              <h2 className="text-xl font-bold text-[#000000] mb-2 sm:mb-0">Performance Trend</h2>
              <div className="flex gap-2">
                <button 
                  className={`px-3 py-1 text-sm rounded-full ${
                    activeMetric === 'score' 
                      ? 'bg-[#491B6D] text-white' 
                      : 'bg-gray-100 text-[#4B4B4B] hover:bg-gray-200'
                  } transition-colors`}
                  onClick={() => setActiveMetric('score')}
                >
                  Score
                </button>
                <button 
                  className={`px-3 py-1 text-sm rounded-full ${
                    activeMetric === 'duration' 
                      ? 'bg-[#491B6D] text-white' 
                      : 'bg-gray-100 text-[#4B4B4B] hover:bg-gray-200'
                  } transition-colors`}
                  onClick={() => setActiveMetric('duration')}
                  disabled={!metrics.performanceTrend?.[0]?.duration}
                >
                  Duration
                </button>
              </div>
            </div>

            {metrics.performanceTrend?.length > 0 ? (
              <div className="h-[400px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart 
                    data={metrics.performanceTrend.map(item => ({
                      ...item,
                      date: formatDate(item.date)
                    }))}
                    margin={{ top: 10, right: 30, left: 0, bottom: 30 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="#E6E6E6" vertical={false} />
                    <XAxis 
                      dataKey="date" 
                      axisLine={false} 
                      tickLine={false}
                      tick={{ fill: '#4B4B4B', fontSize: 12 }}
                      dy={10}
                    />
                    <YAxis 
                      domain={activeMetric === 'score' ? [0, 100] : 'auto'}
                      axisLine={false}
                      tickLine={false}
                      tick={{ fill: '#4B4B4B', fontSize: 12 }}
                      dx={-10}
                    />
                    <Tooltip content={<CustomTooltip />} />
                    <Line 
                      type="monotone" 
                      dataKey={activeMetric}
                      name={activeMetric === 'score' ? 'Score' : 'Duration (min)'}
                      stroke="#491B6D" 
                      strokeWidth={3}
                      dot={{ fill: '#491B6D', r: 4 }}
                      activeDot={{ r: 6, fill: '#A26DB1' }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            ) : (
              <div className="h-[300px] flex items-center justify-center border border-dashed border-[#D9D9D9] rounded-lg">
                <div className="text-center p-6">
                  <p className="text-[#4B4B4B] mb-2">Not enough data to display performance trend</p>
                  <p className="text-sm text-[#4B4B4B]">Complete more interviews to see your progress over time</p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Strengths and Weaknesses */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Strengths Card */}
          <Card className="bg-white border border-[#E6E6E6] rounded-xl shadow-sm">
            <CardContent className="p-6">
              <div className="flex items-center mb-6">
                <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center mr-4">
                  <Award className="w-5 h-5 text-green-600" />
                </div>
                <h2 className="text-xl font-bold text-[#000000]">Your Strengths</h2>
              </div>
              
              {metrics.topStrengths?.length > 0 ? (
                <ul className="space-y-3">
                  {metrics.topStrengths.map((strength, index) => (
                    <li key={index} className="flex items-start">
                      <div className="w-5 h-5 rounded-full bg-green-100 flex items-center justify-center mt-1 mr-3">
                        <span className="text-green-600 text-xs font-bold">{index + 1}</span>
                      </div>
                      <div>
                        <p className="text-[#000000]">{strength}</p>
                      </div>
                    </li>
                  ))}
                </ul>
              ) : (
                <div className="text-center py-8 border border-dashed border-[#D9D9D9] rounded-lg">
                  <p className="text-[#4B4B4B]">No strengths identified yet</p>
                  <p className="text-sm text-[#4B4B4B] mt-1">Complete more interviews to discover your strengths</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Weaknesses Card */}
          <Card className="bg-white border border-[#E6E6E6] rounded-xl shadow-sm">
            <CardContent className="p-6">
              <div className="flex items-center mb-6">
                <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center mr-4">
                  <AlertTriangle className="w-5 h-5 text-red-600" />
                </div>
                <h2 className="text-xl font-bold text-[#000000]">Areas to Improve</h2>
              </div>
              
              {metrics.topWeaknesses?.length > 0 ? (
                <ul className="space-y-3">
                  {metrics.topWeaknesses.map((weakness, index) => (
                    <li key={index} className="flex items-start">
                      <div className="w-5 h-5 rounded-full bg-red-100 flex items-center justify-center mt-1 mr-3">
                        <span className="text-red-600 text-xs font-bold">{index + 1}</span>
                      </div>
                      <div>
                        <p className="text-[#000000]">{weakness}</p>
                      </div>
                    </li>
                  ))}
                </ul>
              ) : (
                <div className="text-center py-8 border border-dashed border-[#D9D9D9] rounded-lg">
                  <p className="text-[#4B4B4B]">No areas of improvement identified yet</p>
                  <p className="text-sm text-[#4B4B4B] mt-1">Complete more interviews to discover areas to focus on</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default PerformanceMetrics;