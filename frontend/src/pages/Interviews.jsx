import { useEffect, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import BASE_URL from '@/config';
import { FileText, Calendar, ChevronRight, ChevronLeft, ChevronsLeft, ChevronsRight } from 'lucide-react';

const InterviewHistory = () => {
  const [interviews, setInterviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totalInterviews, setTotalInterviews] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [itemsPerPage] = useState(5);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchInterviews = async () => {
      setLoading(true);
      try {
        const response = await axios.get(`${BASE_URL}/interview/history`, {
          params: { page: currentPage, limit: itemsPerPage },
          withCredentials: true,
        });
        
        setInterviews(response.data.data.data);
        setTotalInterviews(response.data.data.pagination.total);
        setTotalPages(response.data.data.pagination.totalPages);
      } catch (error) {
        console.error('Failed to fetch interview history', error);
      } finally {
        setLoading(false);
      }
    };

    fetchInterviews();
  }, [currentPage, itemsPerPage]);

  const handleViewDetails = (interviewId) => {
    navigate(`/interview/${interviewId}`);
  };

  const getStatusStyle = (status) => {
    switch (status?.toLowerCase()) {
      case 'completed':
        return 'bg-green-100 text-green-800 border border-green-200';
      case 'in-progress':
        return 'bg-yellow-100 text-yellow-800 border border-yellow-200';
      default:
        return 'bg-gray-100 text-gray-800 border border-gray-200';
    }
  };

  const getStatusLabel = (status) => {
    switch (status?.toLowerCase()) {
      case 'completed':
        return 'Completed';
      case 'in-progress':
        return 'In Progress';
      default:
        return status || 'Unknown';
    }
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const renderPagination = () => {
    if (totalPages <= 1) return null;

    const pageNumbers = [];
    const maxPageButtons = 5;
    
    let startPage = Math.max(1, currentPage - Math.floor(maxPageButtons / 2));
    let endPage = Math.min(totalPages, startPage + maxPageButtons - 1);
    
    if (endPage - startPage + 1 < maxPageButtons) {
      startPage = Math.max(1, endPage - maxPageButtons + 1);
    }


    pageNumbers.push(
      <Button 
        key="first" 
        variant="ghost" 
        size="sm"
        disabled={currentPage === 1}
        onClick={() => handlePageChange(1)}
        className="hidden sm:flex items-center justify-center p-2 text-gray-500 hover:text-[#491B6D]"
      >
        <ChevronsLeft className="w-4 h-4" />
      </Button>
    );
    
    pageNumbers.push(
      <Button 
        key="prev" 
        variant="ghost" 
        size="sm"
        disabled={currentPage === 1}
        onClick={() => handlePageChange(currentPage - 1)}
        className="flex items-center justify-center p-2 text-gray-500 hover:text-[#491B6D]"
      >
        <ChevronLeft className="w-4 h-4" />
      </Button>
    );

    // Page numbers
    for (let i = startPage; i <= endPage; i++) {
      pageNumbers.push(
        <Button
          key={i}
          variant={currentPage === i ? "default" : "ghost"}
          size="sm"
          onClick={() => handlePageChange(i)}
          className={`w-8 h-8 ${
            currentPage === i 
              ? 'bg-[#491B6D] text-white hover:bg-[#3a1457]' 
              : 'text-gray-600 hover:text-[#491B6D]'
          }`}
        >
          {i}
        </Button>
      );
    }

    // Next and last buttons
    pageNumbers.push(
      <Button 
        key="next" 
        variant="ghost" 
        size="sm"
        disabled={currentPage === totalPages}
        onClick={() => handlePageChange(currentPage + 1)}
        className="flex items-center justify-center p-2 text-gray-500 hover:text-[#491B6D]"
      >
        <ChevronRight className="w-4 h-4" />
      </Button>
    );
    
    pageNumbers.push(
      <Button 
        key="last" 
        variant="ghost" 
        size="sm"
        disabled={currentPage === totalPages}
        onClick={() => handlePageChange(totalPages)}
        className="hidden sm:flex items-center justify-center p-2 text-gray-500 hover:text-[#491B6D]"
      >
        <ChevronsRight className="w-4 h-4" />
      </Button>
    );

    return (
      <div className="flex items-center justify-between mt-6 bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
        <div className="text-sm text-gray-500">
          Showing {((currentPage - 1) * itemsPerPage) + 1} to {Math.min(currentPage * itemsPerPage, totalInterviews)} of {totalInterviews} interviews
        </div>
        <div className="flex items-center space-x-1">
          {pageNumbers}
        </div>
      </div>
    );
  };

  if (loading && interviews.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="w-8 h-8 border-4 border-[#491B6D] border-t-transparent rounded-full animate-spin"></div>
        <span className="ml-2 text-lg text-gray-600">Loading interviews...</span>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8 animate-fade-in">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-[#491B6D] mb-2">
            Interview History
          </h1>
          <p className="text-gray-600">
            Review your past interviews and feedback
          </p>
        </div>

        {interviews.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-2xl shadow-sm animate-fade-in-up">
            <div className="w-16 h-16 bg-[#F4ECF7] rounded-full flex items-center justify-center mx-auto mb-4">
              <FileText className="w-8 h-8 text-[#491B6D]" />
            </div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">No Interviews Yet</h3>
            <p className="text-gray-600 mb-6">Start your first interview to see your progress here</p>
            <Button 
              onClick={() => navigate('/dashboard')}
              className="bg-[#491B6D] hover:bg-[#3a1457] text-white"
            >
              Start New Interview
            </Button>
          </div>
        ) : (
          <>
            <div className="grid gap-6">
              {loading ? (
                Array(itemsPerPage).fill(0).map((_, index) => (
                  <Card key={index} className="bg-white border border-gray-100 rounded-2xl shadow-sm">
                    <CardContent className="p-6">
                      <div className="flex flex-col sm:flex-row justify-between gap-4">
                        <div className="flex-1">
                          <div className="flex items-center mb-2">
                            <div className="w-10 h-10 bg-gray-100 rounded-full animate-pulse"></div>
                            <div className="ml-4 flex-1">
                              <div className="h-5 bg-gray-200 rounded animate-pulse w-3/4 mb-2"></div>
                              <div className="h-4 bg-gray-100 rounded animate-pulse w-1/2"></div>
                            </div>
                          </div>
                          <div className="mt-3 h-6 bg-gray-100 rounded animate-pulse w-1/4"></div>
                          <div className="mt-3 h-4 bg-gray-100 rounded animate-pulse w-full"></div>
                        </div>
                        <div>
                          <div className="h-10 bg-gray-100 rounded animate-pulse w-32"></div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              ) : (
                interviews.map((interview, index) => (
                  <Card 
                    key={interview._id}
                    className="bg-white border border-gray-100 rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 animate-slide-in group"
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    <CardContent className="p-6">
                      <div className="flex flex-col sm:flex-row justify-between gap-4">
                        <div className="flex-1">
                          <div className="flex items-center mb-2">
                            <div className="w-10 h-10 bg-[#F4ECF7] rounded-full flex items-center justify-center">
                              <FileText className="w-5 h-5 text-[#491B6D]" />
                            </div>
                            <div className="ml-4">
                              <h3 className="font-semibold text-lg text-gray-900">
                                {interview.title}
                              </h3>
                              <div className="flex items-center text-gray-500 text-sm mt-1">
                                <Calendar className="w-4 h-4 mr-1" />
                                {new Date(interview.createdAt).toLocaleDateString()}
                              </div>
                            </div>
                          </div>
                          
                          <div className="mt-3 flex items-center gap-3">
                            <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusStyle(interview.status)}`}>
                              {getStatusLabel(interview.status)}
                            </span>
                            {interview.interviewFeedback && (
                              <span className="flex items-center text-sm text-gray-600">
                                <span className="w-1.5 h-1.5 bg-gray-400 rounded-full mr-2"></span>
                                Feedback available
                              </span>
                            )}
                          </div>
                          
                          {interview.interviewFeedback?.comments && (
                            <p className="mt-3 text-sm text-gray-600 line-clamp-2">
                              {interview.interviewFeedback.comments}
                            </p>
                          )}
                        </div>
                        
                        <div className="flex items-center sm:items-start">
                          <Button 
                            variant="outline" 
                            onClick={() => handleViewDetails(interview._id)}
                            className="w-full sm:w-auto flex items-center justify-center gap-2 group-hover:border-[#491B6D] group-hover:text-[#491B6D] transition-colors duration-300"
                          >
                            View Details
                            <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
            
            {renderPagination()}
          </>
        )}
      </div>
    </div>
  );
};

export default InterviewHistory;