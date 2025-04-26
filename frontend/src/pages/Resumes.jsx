import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Eye, Upload, Trash, Star, File } from 'lucide-react';
import axios from 'axios';
import BASE_URL from '@/config';
import { toast } from 'react-toastify';

const ResumeManagement = () => {
  const [resumes, setResumes] = useState([]);
  const [selectedFile, setSelectedFile] = useState(null);
  const [jobTitle, setJobTitle] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    fetchResumes();
  }, []);

  const fetchResumes = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get(`${BASE_URL}/resume/getUserResumes`, {
        withCredentials: true,
      });
      const data = response.data.data;
      setResumes(data);
    } catch (error) {
      const msg = error.response?.message || 'Error fetching resumes';
      setResumes([]);
      console.log(msg);     
    } finally {
      setIsLoading(false);
    }
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setSelectedFile(file);
    
      if (!jobTitle) {
        const fileName = file.name.replace(/\.[^/.]+$/, ""); 
        setJobTitle(fileName);
      }
    }
  };

  const handleUpload = async () => {
    if (!selectedFile || !jobTitle) {
      toast.warning('Please select a file and enter a job title');
      return;
    }

    setIsLoading(true);
    const formData = new FormData();
    formData.append('Resume', selectedFile);
    formData.append('jobTitle', jobTitle);

    try {
      await axios.post(`${BASE_URL}/resume/uploadResume`, formData, {
        withCredentials: true,
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setSelectedFile(null);
      setJobTitle('');
      document.getElementById('resume-upload').value = '';
      fetchResumes();
      toast.success('Resume uploaded successfully');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Error uploading resume');
      console.error('Error uploading resume:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (resumeId, fileName) => {
    if (window.confirm(`Are you sure you want to delete ${fileName}?`)) {
      setIsLoading(true);
      try {
        await axios.delete(`${BASE_URL}/resume/deleteResume/${resumeId}`, {
          withCredentials: true,
        });
        fetchResumes();
        toast.success('Resume deleted successfully');
      } catch (error) {
        toast.error(error.response?.data?.message || 'Error deleting resume');
        console.error('Error deleting resume:', error);
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleSetPrimary = async (resumeId) => {
    setIsLoading(true);
    try {
      const response = await axios.get(`${BASE_URL}/resume/set-primary/${resumeId}`, {
        withCredentials: true,
      });
      fetchResumes();
      toast.success(response.data.message);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Error setting primary resume');
    } finally {
      setIsLoading(false);
    }
  };

  const handlePreview = (resumeUrl) => {
    window.open(resumeUrl, '_blank');
  };

  const formatFileSize = (bytes) => {
    if (bytes < 1024) return bytes + ' bytes';
    else if (bytes < 1048576) return (bytes / 1024).toFixed(1) + ' KB';
    else return (bytes / 1048576).toFixed(1) + ' MB';
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6 text-black">Resume Management</h1>

      <Card className="mb-8 border border-gray-200 shadow-sm overflow-hidden">
        <CardContent className="p-6">
          <h2 className="text-xl font-semibold mb-4 text-black">Upload New Resume</h2>
          
          <div className="space-y-4">
            <div>
              <label htmlFor="job-title" className="block text-sm font-medium text-gray-700 mb-1">
                Job Title
              </label>
              <input
                id="job-title"
                type="text"
                placeholder="e.g. Senior Software Engineer"
                value={jobTitle}
                onChange={(e) => setJobTitle(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label htmlFor="resume-upload" className="block text-sm font-medium text-gray-700">
                  Resume File
                </label>
                {selectedFile && (
                  <span className="text-xs text-gray-500">
                    {formatFileSize(selectedFile.size)}
                  </span>
                )}
              </div>
              
              <div className="flex items-center gap-3">
                <input
                  type="file"
                  id="resume-upload"
                  onChange={handleFileChange}
                  className="hidden"
                  accept=".pdf,.doc,.docx"
                />
                
                <label
                  htmlFor="resume-upload"
                  className="flex-1 flex items-center justify-center px-4 py-2 border border-gray-300 border-dashed rounded-md cursor-pointer hover:bg-gray-50"
                >
                  <div className="flex flex-col items-center justify-center space-y-2 py-4">
                    <File className="h-8 w-8 text-gray-400" />
                    <div className="flex text-sm text-gray-600">
                      <span className="relative font-medium text-purple-700 hover:underline">
                        Click to upload
                      </span>
                      <p className="pl-1">or drag and drop</p>
                    </div>
                    <p className="text-xs text-gray-500">
                      PDF, DOC, DOCX up to 10MB
                    </p>
                  </div>
                </label>
                
                <Button
                  onClick={handleUpload}
                  disabled={!selectedFile || !jobTitle || isLoading}
                  className="bg-[#491B6D] hover:bg-[#A26DB1] text-white py-2 px-4 transition-colors duration-200"
                >
                  <Upload className="mr-2 h-5 w-5" />
                  Upload
                </Button>
              </div>
              
              {selectedFile && (
                <div className="flex items-center gap-2 bg-purple-50 p-2 rounded text-sm">
                  <File className="h-4 w-4 text-[#491B6D]" />
                  <span className="text-[#491B6D] font-medium truncate">{selectedFile.name}</span>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="mb-6 flex justify-between items-center">
        <h2 className="text-xl font-semibold text-black">Your Resumes</h2>
        <Button
          onClick={fetchResumes}
          variant="outline"
          className="border-[#491B6D] text-[#491B6D] hover:bg-purple-50"
          disabled={isLoading}
        >
          Refresh
        </Button>
      </div>

      {isLoading ? (
        <div className="text-center py-10">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-[#491B6D] border-r-transparent align-[-0.125em]"></div>
          <p className="mt-2 text-[#4B4B4B]">Loading resumes...</p>
        </div>
      ) : resumes.length === 0 ? (
        <div className="text-center py-10 bg-gray-50 rounded-lg border border-[#E6E6E6]">
          <File className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">No resumes</h3>
          <p className="mt-1 text-sm text-gray-500">Upload your first resume to get started</p>
        </div>
      ) : (
        <div className="grid gap-4">
          {resumes.map((resume) => (
            <Card 
              key={resume._id} 
              className={`overflow-hidden transition-all duration-200 hover:shadow-md ${
                resume.isPrimary 
                  ? 'border-2 border-[#491B6D] bg-purple-50' 
                  : 'border border-[#D9D9D9]'
              }`}
            >
              <CardContent className="flex justify-between items-center p-4">
                <div className="flex items-center gap-3">
                  {resume.isPrimary && (
                    <div className="bg-[#491B6D] p-1 rounded-full">
                      <Star className="h-4 w-4 text-white" />
                    </div>
                  )}
                  <div>
                    <p className="font-medium text-black">{resume.fileName}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-sm text-[#4B4B4B]">
                        For: <span className="font-medium">{resume.jobTitle || 'General'}</span>
                      </span>
                      <span className="text-xs px-2 py-0.5 bg-purple-100 text-[#491B6D] rounded-full">
                        ATS Score: {resume.atsScore || 'N/A'}
                      </span>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">
                      {resume.fileType} • Uploaded {new Date(resume.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                
                <div className="flex gap-2">
                  <Button 
                    variant="outline" 
                    onClick={() => handlePreview(resume.resumeFileUrl)}
                    className="border-[#D9D9D9] hover:border-[#A26DB1] hover:bg-purple-50"
                  >
                    <Eye className="h-4 w-4 mr-1" /> Preview
                  </Button>
                  
                  {!resume.isPrimary && (
                    <Button 
                      variant="outline" 
                      onClick={() => handleSetPrimary(resume._id)}
                      className="border-[#D9D9D9] hover:border-[#A26DB1] hover:bg-purple-50"
                    >
                      <Star className="h-4 w-4 mr-1" /> Set Primary
                    </Button>
                  )}
                  
                  <Button 
                    variant="outline" 
                    onClick={() => handleDelete(resume._id, resume.fileName)}
                    className="border-[#D9D9D9] hover:border-red-500 hover:bg-red-50 text-gray-500 hover:text-red-500"
                  >
                    <Trash className="h-4 w-4" />
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

export default ResumeManagement;