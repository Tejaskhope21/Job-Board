// components/candidate/ResumePage.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from '../../utils/axiosConfig';
import { 
  FiUpload, 
  FiFile, 
  FiCheckCircle, 
  FiAlertCircle,
  FiDownload,
  FiTrash2,
  FiArrowLeft
} from 'react-icons/fi';  // <-- Make sure FiUpload is imported
import toast from 'react-hot-toast';
import ResumeUpload from './ResumeUpload';

const ResumePage = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [resumeData, setResumeData] = useState(null);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [skills, setSkills] = useState([]);

  useEffect(() => {
    fetchResumeStatus();
  }, []);

  const fetchResumeStatus = async () => {
    try {
      const response = await axios.get('/api/resume/resume-status');
      setResumeData(response.data);
      setSkills(response.data.skills || []);
    } catch (error) {
      console.error('Error fetching resume status:', error);
      toast.error('Failed to load resume data');
    } finally {
      setLoading(false);
    }
  };

  const handleUploadSuccess = (data) => {
    setResumeData(data);
    setSkills(data.skills || []);
    toast.success('Resume uploaded successfully!');
    fetchResumeStatus();
  };

  const handleDeleteResume = async () => {
    if (!confirm('Are you sure you want to delete your resume?')) return;
    
    try {
      await axios.delete('/api/resume/delete-resume');
      setResumeData(null);
      setSkills([]);
      toast.success('Resume deleted successfully');
      fetchResumeStatus();
    } catch (error) {
      console.error('Error deleting resume:', error);
      toast.error('Failed to delete resume');
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]" style={{ backgroundColor: '#fcfaf4' }}>
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#fcfaf4' }}>
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="inline-flex items-center text-blue-600 hover:text-blue-800 mb-6 font-medium"
        >
          <FiArrowLeft className="mr-2" />
          Back
        </button>

        <div className="bg-white border border-gray-200 rounded-xl p-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">My Resume</h1>
              <p className="text-gray-500 mt-1">Upload and manage your resume</p>
            </div>
            {!resumeData?.hasResume && (
              <button
                onClick={() => setShowUploadModal(true)}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-all flex items-center gap-2"
              >
                <FiUpload />
                Upload Resume
              </button>
            )}
          </div>

          {resumeData?.hasResume ? (
            <div>
              {/* Resume Status */}
              <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <FiCheckCircle className="text-green-500 text-2xl" />
                  <div>
                    <p className="font-medium text-green-700">Resume Uploaded</p>
                    <p className="text-sm text-green-600">
                      Your resume has been parsed and skills extracted
                    </p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => setShowUploadModal(true)}
                    className="text-sm text-blue-600 hover:text-blue-700 font-medium"
                  >
                    Update
                  </button>
                  <button
                    onClick={handleDeleteResume}
                    className="text-sm text-red-600 hover:text-red-700 font-medium flex items-center gap-1"
                  >
                    <FiTrash2 size={14} />
                    Delete
                  </button>
                </div>
              </div>

              {/* Extracted Skills */}
              {skills.length > 0 && (
                <div className="mb-6">
                  <h3 className="text-sm font-medium text-gray-700 mb-3">Extracted Skills</h3>
                  <div className="flex flex-wrap gap-2">
                    {skills.map((skill, index) => (
                      <span key={index} className="bg-blue-50 text-blue-700 px-3 py-1.5 rounded-lg text-sm font-medium">
                        {skill}
                      </span>
                    ))}
                  </div>
                  <p className="text-xs text-gray-500 mt-2">
                    {skills.length} skills extracted from your resume
                  </p>
                </div>
              )}

              {/* Resume Info */}
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="flex items-center gap-3">
                  <FiFile className="text-blue-500 text-xl" />
                  <div>
                    <p className="font-medium text-gray-800">Resume File</p>
                    <p className="text-sm text-gray-500">
                      Uploaded on {new Date().toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <FiFile className="text-3xl text-gray-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">No Resume Uploaded</h3>
              <p className="text-gray-500 mb-6 max-w-md mx-auto">
                Upload your resume to help employers find you and get matched with relevant job opportunities
              </p>
              <button
                onClick={() => setShowUploadModal(true)}
                className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-all flex items-center gap-2 mx-auto"
              >
                <FiUpload />
                Upload Resume
              </button>
            </div>
          )}
        </div>

        {/* Upload Modal */}
        {showUploadModal && (
          <ResumeUpload
            onClose={() => setShowUploadModal(false)}
            onUploadSuccess={handleUploadSuccess}
          />
        )}
      </div>
    </div>
  );
};

export default ResumePage;