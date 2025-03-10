import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Upload, Trash, Star } from 'lucide-react';

const ResumeManagement = () => {
  const [resumes, setResumes] = useState([
    {
      _id: '1',
      fileName: 'Sample Resume.pdf',
      fileType: 'PDF',
      uploadDate: '2025-03-01',
      isPrimary: true
    },
    {
      _id: '2',
      fileName: 'Web Developer Resume.docx',
      fileType: 'DOCX',
      uploadDate: '2025-03-05',
      isPrimary: false
    }
  ]);

  const handleUpload = () => {
    console.log('Upload resume placeholder');
  };

  const handleDelete = (resumeId) => {
    console.log(`Delete resume placeholder for ID: ${resumeId}`);
  };

  const handleSetPrimary = (resumeId) => {
    console.log(`Set primary resume placeholder for ID: ${resumeId}`);
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Resume Management</h1>

      <div className="mb-4">
        <input type="file" onChange={handleUpload} className="hidden" id="resume-upload" />
        <label htmlFor="resume-upload">
          <Button>
            <Upload className="mr-2" /> Upload Resume
          </Button>
        </label>
      </div>

      {resumes.length === 0 ? (
        <p>No resumes uploaded yet.</p>
      ) : (
        <div className="grid gap-4">
          {resumes.map(resume => (
            <Card key={resume._id} className={resume.isPrimary ? 'border-2 border-purple-500' : ''}>
              <CardContent className="flex justify-between items-center p-4">
                <div>
                  <p className="font-medium">{resume.fileName}</p>
                  <p className="text-sm text-gray-500">{resume.fileType} - {new Date(resume.uploadDate).toLocaleDateString()}</p>
                </div>

                <div className="flex gap-2">
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
