import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import axios from '../../utils/axiosConfig';
import { 
  FiMapPin, 
  FiBriefcase, 
  FiClock, 
  FiUsers, 
  FiArrowLeft, 
  FiSend, 
  FiCheckCircle,
  FiCalendar,
  FiDollarSign,
  FiAward,
  FiBookmark,
  FiShare2,
  FiExternalLink,
  FiUserCheck,
  FiFileText,
  FiUpload,
  FiFile,
  FiX,
  FiCheck
} from 'react-icons/fi';
import toast from 'react-hot-toast';

const JobDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [applying, setApplying] = useState(false);
  const [hasApplied, setHasApplied] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [userResume, setUserResume] = useState(null);
  const [userResumeUrl, setUserResumeUrl] = useState(null);
  const [uploadingResume, setUploadingResume] = useState(false);
  const [applicationData, setApplicationData] = useState({
    coverLetter: '',
    expectedSalary: '',
    availability: '',
    resume: null,
    resumeUrl: ''
  });
  const [showApplicationForm, setShowApplicationForm] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);

  useEffect(() => {
    fetchJobDetails();
    if (isAuthenticated && user?.role === 'candidate') {
      fetchUserResume();
    }
  }, [id]);

  const fetchJobDetails = async () => {
    try {
      const response = await axios.get(`/api/jobs/${id}`);
      setJob(response.data);
      
      if (isAuthenticated && user?.role === 'candidate') {
        const appsRes = await axios.get('/api/applications/my');
        const applied = appsRes.data?.some(app => app.job?._id === id);
        setHasApplied(applied);
      }
    } catch (error) {
      console.error('Error fetching job details:', error);
      toast.error('Failed to load job details');
      navigate('/jobs');
    } finally {
      setLoading(false);
    }
  };

  const fetchUserResume = async () => {
    try {
      const response = await axios.get('/api/resume/resume-status');
      if (response.data.success && response.data.hasResume) {
        setUserResumeUrl(response.data.resumeUrl);
        setUserResume(response.data.resumeName || 'Resume');
        setApplicationData(prev => ({
          ...prev,
          resumeUrl: response.data.resumeUrl,
          resume: response.data.resumeName
        }));
      }
    } catch (error) {
      console.error('Error fetching resume:', error);
    }
  };

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate file type
    const allowedTypes = [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'text/plain'
    ];
    
    if (!allowedTypes.includes(file.type)) {
      toast.error('Please upload PDF, DOC, DOCX, or TXT file');
      return;
    }

    // Validate file size (5MB max)
    if (file.size > 5 * 1024 * 1024) {
      toast.error('File size should be less than 5MB');
      return;
    }

    setSelectedFile(file);
    setApplicationData(prev => ({
      ...prev,
      resume: file
    }));
  };

  const handleRemoveFile = () => {
    setSelectedFile(null);
    setApplicationData(prev => ({
      ...prev,
      resume: null
    }));
    // Reset file input
    const fileInput = document.getElementById('resume-upload');
    if (fileInput) fileInput.value = '';
  };

  const handleApply = async (e) => {
    e.preventDefault();
    
    // Validate resume
    if (!applicationData.resume && !applicationData.resumeUrl) {
      toast.error('Please upload your resume');
      return;
    }

    if (!applicationData.coverLetter) {
      toast.error('Please write a cover letter');
      return;
    }

    setApplying(true);
    
    try {
      let resumeUrl = applicationData.resumeUrl;
      
      // If new resume is selected, upload it first
      if (applicationData.resume && applicationData.resume instanceof File) {
        const formData = new FormData();
        formData.append('resume', applicationData.resume);
        
        const uploadRes = await axios.post('/api/resume/upload-resume', formData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        });
        
        if (uploadRes.data.success) {
          resumeUrl = uploadRes.data.user.resumeUrl;
          toast.success('Resume uploaded successfully!');
        } else {
          throw new Error('Failed to upload resume');
        }
      }

      // Submit application
      await axios.post('/api/applications', {
        jobId: id,
        coverLetter: applicationData.coverLetter,
        expectedSalary: parseInt(applicationData.expectedSalary) || 0,
        availability: applicationData.availability || null,
        resume: resumeUrl || applicationData.resumeUrl
      });
      
      toast.success('Application submitted successfully! 🎉');
      setHasApplied(true);
      setShowApplicationForm(false);
      fetchJobDetails();
    } catch (error) {
      console.error('Error applying:', error);
      toast.error(error.response?.data?.message || 'Failed to submit application');
    } finally {
      setApplying(false);
    }
  };

  const handleSaveJob = () => {
    setIsSaved(!isSaved);
    toast.success(isSaved ? 'Job removed from saved' : 'Job saved successfully!');
  };

  const handleShareJob = () => {
    if (navigator.share) {
      navigator.share({
        title: job.title,
        text: `Check out this job: ${job.title} at ${job.company}`,
        url: window.location.href,
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast.success('Link copied to clipboard!');
    }
  };

  // Skeleton Components
  const JobDetailsSkeleton = () => (
    <div className="min-h-screen" style={{ backgroundColor: '#fcfaf4' }}>
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <div className="h-6 bg-gray-200 rounded w-40 mb-6 animate-pulse"></div>
        <div className="flex flex-col lg:flex-row gap-8">
          <div className="flex-1">
            <div className="border-b border-gray-200 pb-6 mb-6">
              <div className="flex items-start gap-4">
                <div className="w-14 h-14 bg-gray-200 rounded-lg flex-shrink-0 animate-pulse"></div>
                <div className="flex-1">
                  <div className="h-8 bg-gray-200 rounded w-3/4 mb-2 animate-pulse"></div>
                  <div className="h-6 bg-gray-200 rounded w-1/2 animate-pulse"></div>
                </div>
              </div>
              <div className="flex flex-wrap items-center gap-3 mt-4">
                <div className="h-5 bg-gray-200 rounded w-20 animate-pulse"></div>
                <div className="h-5 bg-gray-200 rounded w-24 animate-pulse"></div>
                <div className="h-5 bg-gray-200 rounded w-16 animate-pulse"></div>
              </div>
            </div>
            <div className="space-y-6">
              <div>
                <div className="h-7 bg-gray-200 rounded w-48 mb-3 animate-pulse"></div>
                <div className="space-y-2">
                  <div className="h-4 bg-gray-200 rounded w-full animate-pulse"></div>
                  <div className="h-4 bg-gray-200 rounded w-full animate-pulse"></div>
                  <div className="h-4 bg-gray-200 rounded w-3/4 animate-pulse"></div>
                </div>
              </div>
            </div>
          </div>
          <div className="lg:w-80 flex-shrink-0">
            <div className="lg:sticky lg:top-8">
              <div className="h-11 bg-gray-200 rounded-lg mb-4 animate-pulse"></div>
              <div className="border border-gray-200 rounded-lg p-6 text-center">
                <div className="w-12 h-12 bg-gray-200 rounded-full mx-auto mb-3 animate-pulse"></div>
                <div className="h-6 bg-gray-200 rounded w-32 mx-auto mb-2 animate-pulse"></div>
                <div className="h-4 bg-gray-200 rounded w-40 mx-auto mb-4 animate-pulse"></div>
                <div className="h-11 bg-gray-200 rounded-lg w-full animate-pulse"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  if (loading) {
    return <JobDetailsSkeleton />;
  }

  if (!job) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#fcfaf4' }}>
        <div className="text-center">
          <FiBriefcase className="text-6xl text-gray-300 mx-auto mb-4" />
          <h2 className="text-3xl font-bold text-gray-800">Job not found</h2>
          <p className="text-gray-500 mt-2">The job you're looking for doesn't exist or has been removed.</p>
          <Link to="/jobs" className="inline-block mt-6 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-all">
            Browse Jobs
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#fcfaf4' }}>
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Back Button */}
        <Link
          to="/jobs"
          className="inline-flex items-center text-blue-600 hover:text-blue-800 mb-6 font-medium"
        >
          <FiArrowLeft className="mr-2" />
          Back to Job Listings
        </Link>

        {/* Main Content - Flex Layout */}
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Left Side - Job Details */}
          <div className="flex-1">
            {/* Job Header */}
            <div className="border-b border-gray-200 pb-6 mb-6">
              <div className="flex items-start gap-4">
                <div className="w-14 h-14 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold text-xl flex-shrink-0">
                  {job.company?.charAt(0).toUpperCase()}
                </div>
                <div className="flex-1">
                  <h1 className="text-3xl font-bold text-gray-900">{job.title}</h1>
                  <p className="text-lg text-gray-600 mt-1">{job.company}</p>
                </div>
              </div>
              
              <div className="flex flex-wrap items-center gap-3 mt-4">
                <span className="inline-flex items-center text-sm text-gray-600">
                  <FiBriefcase className="mr-1.5" size={14} />
                  {job.type}
                </span>
                <span className="inline-flex items-center text-sm text-gray-600">
                  <FiMapPin className="mr-1.5" size={14} />
                  {job.location}
                </span>
                {job.remote && (
                  <span className="inline-flex items-center text-sm text-green-600">
                    <FiCheckCircle className="mr-1.5" size={14} />
                    Remote
                  </span>
                )}
                <span className="inline-flex items-center text-sm text-gray-500">
                  <FiClock className="mr-1.5" size={14} />
                  Posted {new Date(job.createdAt).toLocaleDateString('en-US', { 
                    year: 'numeric', 
                    month: 'short', 
                    day: 'numeric' 
                  })}
                </span>
              </div>

              {job.salary?.min && job.salary?.max && (
                <div className="mt-4">
                  <p className="text-sm text-gray-500">Salary Range</p>
                  <p className="text-xl font-bold text-blue-600">
                    ₹{job.salary.min.toLocaleString()} - ₹{job.salary.max.toLocaleString()}
                  </p>
                </div>
              )}

              {/* Stats */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6 pt-6 border-t border-gray-200">
                <div>
                  <p className="text-2xl font-bold text-gray-800">{job.applications?.length || 0}</p>
                  <p className="text-sm text-gray-500">Total Applicants</p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-800 capitalize">{job.type}</p>
                  <p className="text-sm text-gray-500">Job Type</p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-800">{job.experienceLevel || 'Mid'}</p>
                  <p className="text-sm text-gray-500">Experience Level</p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-800">{job.remote ? '✅' : '🏢'}</p>
                  <p className="text-sm text-gray-500">{job.remote ? 'Remote' : 'On-site'}</p>
                </div>
              </div>
            </div>

            {/* Job Description */}
            <div className="space-y-6">
              <div>
                <h2 className="text-xl font-bold text-gray-800 mb-3 flex items-center">
                  <FiFileText className="mr-2 text-blue-600" />
                  Job Description
                </h2>
                <p className="text-gray-600 whitespace-pre-line leading-relaxed">{job.description}</p>
              </div>

              {job.responsibilities && job.responsibilities.length > 0 && (
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center">
                    <FiCheckCircle className="mr-2 text-green-500" />
                    Responsibilities
                  </h3>
                  <ul className="space-y-2">
                    {job.responsibilities.map((resp, index) => (
                      <li key={index} className="flex items-start text-gray-600">
                        <span className="inline-block w-1.5 h-1.5 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                        {resp}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {job.requirements && job.requirements.length > 0 && (
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center">
                    <FiAward className="mr-2 text-purple-500" />
                    Requirements
                  </h3>
                  <ul className="space-y-2">
                    {job.requirements.map((req, index) => (
                      <li key={index} className="flex items-start text-gray-600">
                        <span className="inline-block w-1.5 h-1.5 bg-purple-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                        {req}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {job.skills && job.skills.length > 0 && (
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center">
                    <FiUsers className="mr-2 text-orange-500" />
                    Required Skills
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {job.skills.map((skill, index) => (
                      <span key={index} className="bg-blue-50 text-blue-700 px-3 py-1.5 rounded-lg text-sm font-medium">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Right Side - Apply Section */}
          <div className="lg:w-80 flex-shrink-0">
            <div className="lg:sticky lg:top-8">
              {/* Save & Share Buttons */}
              <div className="flex gap-2 mb-4">
                <button
                  onClick={handleSaveJob}
                  className="flex-1 flex items-center justify-center gap-2 py-2.5 border border-gray-300 rounded-lg hover:bg-gray-50 transition-all"
                >
                  <FiBookmark className={isSaved ? 'fill-current text-blue-600' : 'text-gray-600'} />
                  <span className="text-sm font-medium">{isSaved ? 'Saved' : 'Save'}</span>
                </button>
                <button
                  onClick={handleShareJob}
                  className="flex-1 flex items-center justify-center gap-2 py-2.5 border border-gray-300 rounded-lg hover:bg-gray-50 transition-all"
                >
                  <FiShare2 className="text-gray-600" />
                  <span className="text-sm font-medium">Share</span>
                </button>
              </div>

              {/* Apply Button / Form */}
              {!isAuthenticated ? (
                <div className="border border-gray-200 rounded-lg p-6 text-center">
                  <FiUserCheck className="text-3xl text-blue-500 mx-auto mb-3" />
                  <h3 className="text-base font-semibold text-gray-800 mb-2">Login to Apply</h3>
                  <p className="text-sm text-gray-600 mb-4">Please login to apply for this position</p>
                  <Link
                    to="/login"
                    state={{ from: `/jobs/${id}` }}
                    className="inline-flex items-center justify-center w-full bg-blue-600 text-white px-4 py-2.5 rounded-lg font-semibold hover:bg-blue-700 transition-all"
                  >
                    <FiExternalLink className="mr-2" />
                    Login to Apply
                  </Link>
                </div>
              ) : user?.role !== 'candidate' ? (
                <div className="border border-yellow-200 rounded-lg p-6 text-center">
                  <FiBriefcase className="text-3xl text-yellow-500 mx-auto mb-3" />
                  <h3 className="text-base font-semibold text-gray-800 mb-2">Employer Account</h3>
                  <p className="text-sm text-gray-600">Only candidates can apply</p>
                </div>
              ) : hasApplied ? (
                <div className="border border-green-200 rounded-lg p-6 text-center">
                  <FiCheckCircle className="text-3xl text-green-500 mx-auto mb-3" />
                  <h3 className="text-base font-semibold text-green-700 mb-2">Applied!</h3>
                  <p className="text-sm text-gray-600">You have already applied</p>
                  <p className="text-xs text-gray-500 mt-1">Employer will review</p>
                </div>
              ) : showApplicationForm ? (
                <div className="border border-gray-200 rounded-lg p-6">
                  <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                    <FiSend className="text-blue-600" />
                    Apply Now
                  </h3>
                  <form onSubmit={handleApply} className="space-y-4">
                    {/* Resume Upload Section */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1.5">
                        Resume <span className="text-red-500">*</span>
                      </label>
                      
                      {/* Show existing resume if available */}
                      {userResumeUrl && !selectedFile && (
                        <div className="flex items-center gap-2 p-2 bg-green-50 border border-green-200 rounded-lg mb-2">
                          <FiCheck className="text-green-600" />
                          <span className="text-sm text-gray-700 flex-1">
                            Using: {userResume || 'Uploaded Resume'}
                          </span>
                          <button
                            type="button"
                            onClick={() => {
                              setUserResumeUrl(null);
                              setUserResume(null);
                            }}
                            className="text-sm text-blue-600 hover:text-blue-800"
                          >
                            Change
                          </button>
                        </div>
                      )}

                      {/* File Upload Area */}
                      {(!userResumeUrl || selectedFile) && (
                        <div className="relative">
                          <div className={`
                            border-2 border-dashed rounded-lg p-4 text-center transition-all
                            ${selectedFile ? 'border-green-400 bg-green-50' : 'border-gray-300 hover:border-blue-400 bg-gray-50'}
                          `}>
                            {selectedFile ? (
                              <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                  <FiFile className="text-blue-600 text-xl" />
                                  <div className="text-left">
                                    <p className="text-sm font-medium text-gray-700 truncate max-w-[150px]">
                                      {selectedFile.name}
                                    </p>
                                    <p className="text-xs text-gray-500">
                                      {(selectedFile.size / 1024).toFixed(1)} KB
                                    </p>
                                  </div>
                                </div>
                                <button
                                  type="button"
                                  onClick={handleRemoveFile}
                                  className="text-red-500 hover:text-red-700 p-1"
                                >
                                  <FiX size={18} />
                                </button>
                              </div>
                            ) : (
                              <>
                                <FiUpload className="text-2xl text-gray-400 mx-auto mb-2" />
                                <p className="text-sm text-gray-600">
                                  Click to upload or drag & drop
                                </p>
                                <p className="text-xs text-gray-400 mt-1">
                                  PDF, DOC, DOCX, TXT (Max 5MB)
                                </p>
                              </>
                            )}
                          </div>
                          <input
                            id="resume-upload"
                            type="file"
                            accept=".pdf,.doc,.docx,.txt,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document,text/plain"
                            onChange={handleFileSelect}
                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                            disabled={applying}
                          />
                        </div>
                      )}
                    </div>

                    {/* Cover Letter */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Cover Letter <span className="text-red-500">*</span>
                      </label>
                      <textarea
                        value={applicationData.coverLetter}
                        onChange={(e) => setApplicationData({...applicationData, coverLetter: e.target.value})}
                        rows="4"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none text-sm"
                        placeholder="Why you're a great fit for this role..."
                        required
                      />
                    </div>

                    {/* Expected Salary */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Expected Salary (Annual CTC)
                      </label>
                      <input
                        type="number"
                        value={applicationData.expectedSalary}
                        onChange={(e) => setApplicationData({...applicationData, expectedSalary: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none text-sm"
                        placeholder="e.g., 800000"
                      />
                    </div>

                    {/* Availability Date */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Available From
                      </label>
                      <input
                        type="date"
                        value={applicationData.availability}
                        onChange={(e) => setApplicationData({...applicationData, availability: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none text-sm"
                      />
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-2 pt-2">
                      <button
                        type="submit"
                        disabled={applying}
                        className="flex-1 bg-blue-600 text-white px-4 py-2.5 rounded-lg font-semibold hover:bg-blue-700 transition-all disabled:opacity-50 text-sm flex items-center justify-center gap-2"
                      >
                        {applying ? (
                          <>
                            <span className="animate-spin">⏳</span>
                            Submitting...
                          </>
                        ) : (
                          <>
                            <FiSend />
                            Submit Application
                          </>
                        )}
                      </button>
                      <button
                        type="button"
                        onClick={() => setShowApplicationForm(false)}
                        className="px-4 py-2.5 bg-gray-200 text-gray-700 rounded-lg font-semibold hover:bg-gray-300 transition-all text-sm"
                      >
                        Cancel
                      </button>
                    </div>
                  </form>
                </div>
              ) : (
                <div className="border border-gray-200 rounded-lg p-6 text-center">
                  <FiUserCheck className="text-3xl text-blue-600 mx-auto mb-3" />
                  <h3 className="text-lg font-bold text-gray-800 mb-2">Ready to Apply?</h3>
                  <p className="text-sm text-gray-600 mb-4">Take the next step in your career</p>
                  <button
                    onClick={() => setShowApplicationForm(true)}
                    className="w-full bg-blue-600 text-white px-4 py-2.5 rounded-lg font-semibold hover:bg-blue-700 transition-all flex items-center justify-center"
                  >
                    <FiSend className="mr-2" />
                    Apply Now
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default JobDetails;