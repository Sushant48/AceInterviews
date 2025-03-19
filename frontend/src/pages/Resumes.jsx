import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import {Eye, Upload, Trash, Star } from 'lucide-react';
import axios from 'axios';
import BASE_URL from '@/config';
import { toast } from 'react-toastify';

const ResumeManagement = () => {
  const [resumes, setResumes] = useState([]);
  const [selectedFile, setSelectedFile] = useState(null);
  const [jobTitle, setJobTitle] = useState('');

  useEffect(() => {
    fetchResumes();
  }, []);

  const fetchResumes = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/resume/getUserResumes` , {
        withCredentials: true,
      });
      console.log(response);
      
      setResumes(response.data.data);
    } catch (error) {
      console.error('Error fetching resumes:', error);
    }
  };

  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
  };

  const handleUpload = async () => {
    if (!selectedFile || !jobTitle) return;

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
      fetchResumes();
    } catch (error) {
      console.error('Error uploading resume:', error);
    }
  };

  const handleDelete = async (resumeId) => {
    try {
      await axios.delete(`${BASE_URL}/resume/deleteResume/${resumeId}`, {
        withCredentials: true,});
      fetchResumes();
    } catch (error) {
      console.error('Error deleting resume:', error);
    }
  };

  const handleSetPrimary = async (resumeId) => {
    try {
      const response = await axios.get(`${BASE_URL}/resume/set-primary/${resumeId}`, {
        withCredentials: true,});
      console.log(response);
      
      fetchResumes();
      toast.success(response.data.message);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Error setting primary resume');
    }
  };

  const handlePreview = (resumeUrl) => {
    window.open(resumeUrl, '_blank');
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Resume Management</h1>

      <div className="mb-4">

      <input
          type="text"
          placeholder="Enter Job Title"
          value={jobTitle}
          onChange={(e) => setJobTitle(e.target.value)}
          className="border p-2 w-full mb-2"
        />
        <input 
          type="file" 
          onChange={handleFileChange} 
          className='hidden'  
          id="resume-upload" />
          
        <label htmlFor="resume-upload">
          <Button onClick={handleUpload} disabled={!selectedFile}>
            <Upload className="mr-2" /> Upload Resume
          </Button>
        </label>

      </div>

      {resumes.length === 0 ? (
        <p>No resumes uploaded yet.</p>
      ) : (
        <div className="grid gap-4">
          {resumes.map((resume) => (
            <Card key={resume._id} className={resume.isPrimary ? 'border-2 border-purple-500' : ''}>
              <CardContent className="flex justify-between items-center p-4">
                <div>
                  <p className="font-medium">{resume.fileName}</p>
                  <p className="text-sm text-gray-500">ATS Score - {resume.atsScore}</p>
                  <p className="text-sm text-gray-500">{resume.fileType} - {new Date(resume.createdAt).toLocaleDateString()}</p>
                </div>
                
                <div className="flex gap-2">
                  <Button variant="outline" onClick={() => handlePreview(resume.resumeFileUrl)}>
                    <Eye className="mr-1" /> Preview
                  </Button>
                  {!resume.isPrimary && (
                    <Button variant="outline" onClick={() => handleSetPrimary(resume._id)}>
                      <Star className="mr-1" /> Set Primary
                    </Button>
                  )}
                  <Button variant="destructive" onClick={() => handleDelete(resume._id)}>
                    <Trash />
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
