import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from '../../utils/axiosConfig';
import { 
  FiArrowLeft, 
  FiUser, 
  FiMail, 
  FiCalendar, 
  FiClock,
  FiUsers,
  FiBriefcase,
  FiMapPin,
  FiCheckCircle,
  FiXCircle,
  FiAlertCircle,
  FiEye,
  FiStar,
  FiAward,
  FiFileText,
  FiDollarSign,
  FiClock as FiTime,
  FiRefreshCw,
  FiFilter,
  FiSearch,
  FiDownload,
  FiMessageSquare,
  FiUserCheck,
  FiUserX,
  FiFile,
  FiExternalLink,
  FiImage
} from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';

const JobApplications = () => {
  const { jobId } = useParams();
  const [applications, setApplications] = useState([]);
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [filterStatus, setFilterStatus] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedApplication, setSelectedApplication] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showResumeModal, setShowResumeModal] = useState(false);
  const [resumeUrl, setResumeUrl] = useState('');
  const [resumeName, setResumeName] = useState('');
  const [resumePreviewType, setResumePreviewType] = useState('iframe'); // 'iframe', 'image', 'download'

  useEffect(() => {
    fetchApplications();
  }, [jobId]);

  const fetchApplications = async () => {
    try {
      const [jobRes, appsRes] = await Promise.all([
        axios.get(`/api/jobs/${jobId}`),
        axios.get(`/api/applications/job/${jobId}`)
      ]);
      
      setJob(jobRes.data);
      setApplications(appsRes.data || []);
    } catch (error) {
      console.error('Error fetching applications:', error);
      toast.error('Failed to load applications');
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchApplications();
    setRefreshing(false);
    toast.success('Applications refreshed successfully!');
  };

  const updateApplicationStatus = async (applicationId, status) => {
    try {
      await axios.put(`/api/applications/${applicationId}/status`, { status });
      toast.success('Application status updated');
      fetchApplications();
    } catch (error) {
      console.error('Error updating application:', error);
      toast.error('Failed to update application');
    }
  };

  // Helper function to get proper resume preview URL
  const getResumePreviewUrl = (url) => {
    if (!url) return null;
    
    // Check if it's a Cloudinary URL
    if (url.includes('cloudinary.com')) {
      // Cloudinary PDF preview - convert to image
      try {
        const urlObj = new URL(url);
        const pathParts = urlObj.pathname.split('/');
        const uploadIndex = pathParts.indexOf('upload');
        
        if (uploadIndex !== -1) {
          // Insert transformation for PDF preview
          pathParts.splice(uploadIndex + 1, 0, 'fl_pdf:1');
          const newPath = pathParts.join('/');
          return `${urlObj.origin}${newPath}`;
        }
      } catch (e) {
        console.error('Error parsing Cloudinary URL:', e);
      }
    }
    
    return url;
  };

  // Get download URL
  const getDownloadUrl = (url) => {
    if (!url) return null;
    
    // For Cloudinary, add attachment flag
    if (url.includes('cloudinary.com')) {
      return url.replace('/upload/', '/upload/fl_attachment/');
    }
    
    return url;
  };

  const handleViewResume = (application) => {
    if (application.resume) {
      setResumeUrl(application.resume);
      setResumeName(application.candidate?.name || 'Candidate');
      
      // Check if it's a PDF file
      const isPdf = application.resume.toLowerCase().includes('.pdf') || 
                     application.resume.includes('application/pdf');
      
      // Check if it's a Cloudinary URL
      const isCloudinary = application.resume.includes('cloudinary.com');
      
      if (isCloudinary) {
        setResumePreviewType('cloudinary');
      } else if (isPdf) {
        setResumePreviewType('pdf');
      } else {
        setResumePreviewType('download');
      }
      
      setShowResumeModal(true);
    } else {
      toast.error('No resume uploaded for this application');
    }
  };

  const handleDownloadResume = async (url, name) => {
    try {
      // If it's a Cloudinary URL, open in new tab with download flag
      if (url.includes('cloudinary.com')) {
        const downloadUrl = getDownloadUrl(url);
        window.open(downloadUrl, '_blank');
        toast.success('Resume download started!');
        return;
      }
      
      // For local files
      const response = await axios.get(url, {
        responseType: 'blob'
      });
      
      const blob = new Blob([response.data]);
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = `resume-${name}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(link.href);
      
      toast.success('Resume downloaded successfully!');
    } catch (error) {
      console.error('Error downloading resume:', error);
      toast.error('Failed to download resume');
    }
  };

  // Render resume in modal based on type
  const renderResumeContent = () => {
    if (!resumeUrl) {
      return (
        <div className="flex items-center justify-center h-full">
          <div className="text-center text-gray-500">
            <FiFile className="text-4xl mx-auto mb-2" />
            <p>No resume available to display</p>
          </div>
        </div>
      );
    }

    // For Cloudinary - try to show as image preview
    if (resumePreviewType === 'cloudinary') {
      const previewUrl = getResumePreviewUrl(resumeUrl);
      return (
        <div className="flex items-center justify-center h-full bg-gray-100">
          <div className="w-full h-full flex flex-col items-center justify-center">
            <div className="bg-white shadow-lg rounded-lg p-8 max-w-2xl w-full">
              <img 
                src={previewUrl} 
                alt="Resume Preview"
                className="w-full h-auto rounded-lg"
                onError={() => {
                  // If image fails, show download option
                  setResumePreviewType('download');
                }}
              />
              <div className="mt-4 text-center text-sm text-gray-500">
                <p>Preview of first page only. Click download for full resume.</p>
              </div>
            </div>
          </div>
        </div>
      );
    }

    // For PDF files - use iframe
    if (resumePreviewType === 'pdf') {
      return (
        <iframe
          src={resumeUrl}
          title="Resume Viewer"
          className="w-full h-full min-h-[500px]"
          style={{ border: 'none' }}
          sandbox="allow-scripts allow-same-origin allow-modals"
        />
      );
    }

    // Default - show download option
    return (
      <div className="flex flex-col items-center justify-center h-full p-8">
        <div className="bg-gray-50 rounded-xl p-12 text-center max-w-md">
          <FiFile className="text-6xl text-blue-500 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-800 mb-2">Resume Preview Unavailable</h3>
          <p className="text-gray-600 mb-4">
            The resume file cannot be previewed directly. Please download to view.
          </p>
          <button
            onClick={() => handleDownloadResume(resumeUrl, resumeName)}
            className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all"
          >
            <FiDownload size={18} />
            Download Resume
          </button>
          <button
            onClick={() => window.open(resumeUrl, '_blank')}
            className="inline-flex items-center gap-2 px-6 py-3 ml-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-all"
          >
            <FiExternalLink size={18} />
            Open in New Tab
          </button>
        </div>
      </div>
    );
  };

  const getStatusColor = (status) => {
    switch(status) {
      case 'pending': return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      case 'reviewed': return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'shortlisted': return 'bg-purple-100 text-purple-700 border-purple-200';
      case 'interviewed': return 'bg-indigo-100 text-indigo-700 border-indigo-200';
      case 'offered': return 'bg-green-100 text-green-700 border-green-200';
      case 'hired': return 'bg-teal-100 text-teal-700 border-teal-200';
      case 'rejected': return 'bg-red-100 text-red-700 border-red-200';
      default: return 'bg-gray-100 text-gray-600 border-gray-200';
    }
  };

  const getStatusIcon = (status) => {
    switch(status) {
      case 'pending': return <FiClock className="text-yellow-500" size={14} />;
      case 'reviewed': return <FiEye className="text-blue-500" size={14} />;
      case 'shortlisted': return <FiStar className="text-purple-500" size={14} />;
      case 'interviewed': return <FiMessageSquare className="text-indigo-500" size={14} />;
      case 'offered': return <FiAward className="text-green-500" size={14} />;
      case 'hired': return <FiCheckCircle className="text-teal-500" size={14} />;
      case 'rejected': return <FiXCircle className="text-red-500" size={14} />;
      default: return null;
    }
  };

  const getStatusBadgeColor = (status) => {
    switch(status) {
      case 'pending': return 'bg-yellow-100 text-yellow-700';
      case 'reviewed': return 'bg-blue-100 text-blue-700';
      case 'shortlisted': return 'bg-purple-100 text-purple-700';
      case 'interviewed': return 'bg-indigo-100 text-indigo-700';
      case 'offered': return 'bg-green-100 text-green-700';
      case 'hired': return 'bg-teal-100 text-teal-700';
      case 'rejected': return 'bg-red-100 text-red-700';
      default: return 'bg-gray-100 text-gray-600';
    }
  };

  // Filter and search applications
  const filteredApplications = applications.filter(app => {
    const matchesFilter = filterStatus === '' || app.status === filterStatus;
    const matchesSearch = 
      app.candidate?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.candidate?.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.coverLetter?.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  // Calculate stats
  const totalApplications = applications.length;
  const pendingCount = applications.filter(a => a.status === 'pending').length;
  const reviewedCount = applications.filter(a => a.status === 'reviewed').length;
  const shortlistedCount = applications.filter(a => a.status === 'shortlisted').length;
  const hiredCount = applications.filter(a => a.status === 'hired').length;
  const rejectedCount = applications.filter(a => a.status === 'rejected').length;

  if (loading) {
    return (
      <div className="min-h-screen py-8" style={{ backgroundColor: '#fcfaf4' }}>
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="h-5 bg-gray-200 rounded w-32 mb-6 animate-pulse"></div>
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
            <div className="h-8 bg-gray-200 rounded w-64 mb-2 animate-pulse"></div>
            <div className="h-4 bg-gray-200 rounded w-48 animate-pulse"></div>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
            {[1, 2, 3, 4, 5].map((item) => (
              <div key={item} className="bg-white rounded-xl shadow-sm border border-gray-200 p-3 animate-pulse">
                <div className="h-3 bg-gray-200 rounded w-16 mb-1"></div>
                <div className="h-6 bg-gray-200 rounded w-8"></div>
              </div>
            ))}
          </div>
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 mb-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 h-10 bg-gray-200 rounded-lg animate-pulse"></div>
              <div className="h-10 bg-gray-200 rounded-lg w-40 animate-pulse"></div>
            </div>
          </div>
          <div className="space-y-4">
            {[1, 2, 3].map((item) => (
              <div key={item} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 animate-pulse">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                  <div className="flex-1">
                    <div className="flex items-center mb-2">
                      <div className="h-10 w-10 bg-gray-200 rounded-full mr-3"></div>
                      <div className="flex-1">
                        <div className="h-5 bg-gray-200 rounded w-32 mb-1"></div>
                        <div className="h-4 bg-gray-200 rounded w-48"></div>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                      <div className="h-4 bg-gray-200 rounded w-24"></div>
                      <div className="h-4 bg-gray-200 rounded w-20"></div>
                      <div className="h-4 bg-gray-200 rounded w-28"></div>
                    </div>
                  </div>
                  <div className="mt-4 md:mt-0 md:ml-4 flex flex-col items-end space-y-2">
                    <div className="h-6 bg-gray-200 rounded-full w-20"></div>
                    <div className="h-9 bg-gray-200 rounded-md w-32"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-8" style={{ backgroundColor: '#fcfaf4' }}>
      <div className="container mx-auto px-4 max-w-7xl">
        {/* Back Button */}
        <Link
          to="/employer/my-jobs"
          className="inline-flex items-center text-blue-600 hover:text-blue-800 mb-6 font-medium transition-colors group"
        >
          <FiArrowLeft className="mr-2 group-hover:-translate-x-1 transition-transform" />
          Back to My Jobs
        </Link>

        {/* Job Info */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                <FiBriefcase className="text-blue-600" />
                {job?.title}
              </h1>
              <div className="flex flex-wrap items-center gap-3 mt-1">
                <p className="text-gray-600">{job?.company}</p>
                <span className="w-1 h-1 bg-gray-300 rounded-full"></span>
                <span className="text-gray-500 flex items-center gap-1">
                  <FiMapPin size={14} />
                  {job?.location}
                </span>
                <span className="w-1 h-1 bg-gray-300 rounded-full"></span>
                <span className="text-gray-500">Type: {job?.type}</span>
              </div>
            </div>
            <div className="flex items-center gap-4 mt-3 md:mt-0">
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <FiUsers size={16} />
                <span className="font-medium">{applications.length}</span>
                <span>applications</span>
              </div>
              <button
                onClick={handleRefresh}
                disabled={refreshing}
                className="flex items-center gap-2 px-3 py-1.5 bg-gray-100 border border-gray-200 rounded-lg hover:bg-gray-200 transition-all text-gray-700 font-medium text-sm"
              >
                <FiRefreshCw className={`${refreshing ? 'animate-spin' : ''}`} size={14} />
                Refresh
              </button>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
          {[
            { label: 'Total', value: totalApplications, icon: FiUsers, color: 'from-blue-500 to-blue-600' },
            { label: 'Pending', value: pendingCount, icon: FiClock, color: 'from-yellow-500 to-yellow-600' },
            { label: 'Reviewed', value: reviewedCount, icon: FiEye, color: 'from-blue-500 to-blue-600' },
            { label: 'Shortlisted', value: shortlistedCount, icon: FiStar, color: 'from-purple-500 to-purple-600' },
            { label: 'Hired', value: hiredCount, icon: FiCheckCircle, color: 'from-green-500 to-green-600' }
          ].map((stat, index) => {
            const Icon = stat.icon;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white rounded-xl shadow-sm border border-gray-200 p-3 hover:shadow-md transition-all"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs font-medium text-gray-500">{stat.label}</p>
                    <p className="text-xl font-bold text-gray-900">{stat.value}</p>
                  </div>
                  <div className={`bg-gradient-to-br ${stat.color} p-1.5 rounded-full text-white`}>
                    <Icon size={14} />
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Search & Filter */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 mb-6">
          <div className="flex flex-col md:flex-row md:items-center md:space-x-4 space-y-4 md:space-y-0">
            <div className="flex-1 relative">
              <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search by candidate name, email, or cover letter..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              />
            </div>
            <div className="flex items-center gap-2">
              <FiFilter className="text-gray-400" />
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all bg-white text-gray-700"
              >
                <option value="">All Status</option>
                <option value="pending">Pending</option>
                <option value="reviewed">Reviewed</option>
                <option value="shortlisted">Shortlisted</option>
                <option value="interviewed">Interviewed</option>
                <option value="offered">Offered</option>
                <option value="hired">Hired</option>
                <option value="rejected">Rejected</option>
              </select>
            </div>
          </div>
        </div>

        {/* Applications List */}
        {filteredApplications.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-16 text-center">
            <div className="flex flex-col items-center max-w-sm mx-auto">
              <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                <FiUserX className="text-4xl text-gray-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">No applications found</h3>
              <p className="text-gray-500">
                {searchTerm || filterStatus 
                  ? 'Try adjusting your search or filter criteria' 
                  : 'No applications have been submitted for this job yet'}
              </p>
              {(searchTerm || filterStatus) && (
                <button
                  onClick={() => {
                    setSearchTerm('');
                    setFilterStatus('');
                  }}
                  className="mt-4 text-blue-600 hover:text-blue-700 font-medium"
                >
                  Clear all filters
                </button>
              )}
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredApplications.map((application, index) => (
              <motion.div
                key={application._id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-all hover:border-blue-200"
              >
                <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between">
                  <div className="flex-1">
                    {/* Candidate Info */}
                    <div className="flex items-start gap-3 mb-3">
                      <div className="w-12 h-12 rounded-full bg-gradient-to-r from-blue-400 to-blue-600 flex items-center justify-center text-white font-bold text-lg flex-shrink-0">
                        {application.candidate?.name?.charAt(0).toUpperCase() || 'U'}
                      </div>
                      <div className="flex-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <h3 className="text-lg font-semibold text-gray-900">
                            {application.candidate?.name || 'Unknown Candidate'}
                          </h3>
                          <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium border flex items-center gap-1 ${getStatusColor(application.status)}`}>
                            {getStatusIcon(application.status)}
                            {application.status}
                          </span>
                        </div>
                        <p className="text-sm text-gray-500 flex items-center gap-1">
                          <FiMail size={14} />
                          {application.candidate?.email || 'No email provided'}
                        </p>
                      </div>
                    </div>

                    {/* Application Details */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2 text-sm text-gray-500">
                      <div className="flex items-center gap-1">
                        <FiCalendar size={14} />
                        Applied: {new Date(application.appliedAt).toLocaleDateString('en-US', { 
                          month: 'short', 
                          day: 'numeric',
                          year: 'numeric' 
                        })}
                      </div>
                      {application.expectedSalary && (
                        <div className="flex items-center gap-1">
                          <FiDollarSign size={14} />
                          Expected: ₹{application.expectedSalary.toLocaleString()}
                        </div>
                      )}
                      {application.availability && (
                        <div className="flex items-center gap-1">
                          <FiTime size={14} />
                          Available: {new Date(application.availability).toLocaleDateString('en-US', { 
                            month: 'short', 
                            day: 'numeric',
                            year: 'numeric' 
                          })}
                        </div>
                      )}
                      <div className="flex items-center gap-1">
                        <FiFileText size={14} />
                        {application.resume ? 'Resume attached' : 'No resume'}
                      </div>
                    </div>

                    {/* Cover Letter */}
                    {application.coverLetter && (
                      <div className="mt-3">
                        <div className="bg-gray-50 rounded-lg p-3 border border-gray-100">
                          <div className="flex items-center gap-1 text-xs text-gray-500 mb-1">
                            <FiMessageSquare size={12} />
                            Cover Letter
                          </div>
                          <p className="text-sm text-gray-600">{application.coverLetter}</p>
                        </div>
                      </div>
                    )}

                    {/* Interviews */}
                    {application.interviews && application.interviews.length > 0 && (
                      <div className="mt-3">
                        <h4 className="text-xs font-medium text-gray-700 mb-1 flex items-center gap-1">
                          <FiClock size={12} />
                          Interviews Scheduled
                        </h4>
                        <div className="space-y-1">
                          {application.interviews.map((interview, idx) => (
                            <div key={idx} className="text-sm text-gray-600 bg-blue-50 p-2 rounded-lg border border-blue-100 flex items-center gap-2">
                              <FiCalendar size={12} className="text-blue-500" />
                              {new Date(interview.date).toLocaleString()}
                              <span className="w-1 h-1 bg-gray-300 rounded-full"></span>
                              <span className="capitalize">{interview.type}</span>
                              {interview.notes && (
                                <>
                                  <span className="w-1 h-1 bg-gray-300 rounded-full"></span>
                                  <span className="text-gray-500">{interview.notes}</span>
                                </>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="mt-4 lg:mt-0 lg:ml-6 flex flex-wrap lg:flex-col items-center lg:items-end gap-3">
                    <select
                      value={application.status}
                      onChange={(e) => updateApplicationStatus(application._id, e.target.value)}
                      className={`px-3 py-1.5 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all ${getStatusBadgeColor(application.status)}`}
                    >
                      <option value="pending">Pending</option>
                      <option value="reviewed">Reviewed</option>
                      <option value="shortlisted">Shortlisted</option>
                      <option value="interviewed">Interviewed</option>
                      <option value="offered">Offered</option>
                      <option value="hired">Hired</option>
                      <option value="rejected">Rejected</option>
                    </select>
                    
                    {/* View Resume Button */}
                    {application.resume && (
                      <button
                        onClick={() => handleViewResume(application)}
                        className="text-green-600 hover:text-green-700 text-sm font-medium flex items-center gap-1"
                      >
                        <FiFile size={14} />
                        View Resume
                      </button>
                    )}
                    
                    <button
                      onClick={() => {
                        setSelectedApplication(application);
                        setShowDetailsModal(true);
                      }}
                      className="text-blue-600 hover:text-blue-700 text-sm font-medium flex items-center gap-1"
                    >
                      <FiEye size={14} />
                      View Details
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {/* Application Details Modal */}
        <AnimatePresence>
          {showDetailsModal && selectedApplication && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 backdrop-blur-sm"
            >
              <motion.div
                initial={{ scale: 0.9, y: 20 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.9, y: 20 }}
                className="bg-white rounded-2xl p-8 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto shadow-2xl"
              >
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                    <FiUser className="text-blue-600" />
                    Application Details
                  </h2>
                  <button
                    onClick={() => setShowDetailsModal(false)}
                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <FiXCircle size={24} className="text-gray-500" />
                  </button>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="w-16 h-16 rounded-full bg-gradient-to-r from-blue-400 to-blue-600 flex items-center justify-center text-white font-bold text-2xl">
                      {selectedApplication.candidate?.name?.charAt(0).toUpperCase() || 'U'}
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold text-gray-900">
                        {selectedApplication.candidate?.name || 'Unknown Candidate'}
                      </h3>
                      <p className="text-gray-500">{selectedApplication.candidate?.email}</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-gray-50 rounded-lg p-3">
                      <p className="text-xs text-gray-500">Status</p>
                      <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium mt-1 ${getStatusBadgeColor(selectedApplication.status)}`}>
                        {getStatusIcon(selectedApplication.status)}
                        {selectedApplication.status}
                      </span>
                    </div>
                    <div className="bg-gray-50 rounded-lg p-3">
                      <p className="text-xs text-gray-500">Applied</p>
                      <p className="text-sm font-medium text-gray-800">
                        {new Date(selectedApplication.appliedAt).toLocaleDateString('en-US', { 
                          month: 'long', 
                          day: 'numeric',
                          year: 'numeric' 
                        })}
                      </p>
                    </div>
                    {selectedApplication.expectedSalary && (
                      <div className="bg-gray-50 rounded-lg p-3">
                        <p className="text-xs text-gray-500">Expected Salary</p>
                        <p className="text-sm font-medium text-gray-800">
                          ₹{selectedApplication.expectedSalary.toLocaleString()}
                        </p>
                      </div>
                    )}
                    {selectedApplication.availability && (
                      <div className="bg-gray-50 rounded-lg p-3">
                        <p className="text-xs text-gray-500">Available From</p>
                        <p className="text-sm font-medium text-gray-800">
                          {new Date(selectedApplication.availability).toLocaleDateString('en-US', { 
                            month: 'long', 
                            day: 'numeric',
                            year: 'numeric' 
                          })}
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Resume Section in Modal */}
                  {selectedApplication.resume && (
                    <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <FiFile className="text-blue-600" size={20} />
                          <div>
                            <p className="text-sm font-medium text-gray-700">Resume</p>
                            <p className="text-xs text-gray-500">
                              {selectedApplication.candidate?.name}'s resume
                            </p>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleViewResume(selectedApplication)}
                            className="flex items-center gap-1 px-3 py-1.5 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700 transition-all"
                          >
                            <FiEye size={14} />
                            View
                          </button>
                          <button
                            onClick={() => handleDownloadResume(
                              selectedApplication.resume, 
                              selectedApplication.candidate?.name || 'candidate'
                            )}
                            className="flex items-center gap-1 px-3 py-1.5 bg-gray-600 text-white rounded-lg text-sm hover:bg-gray-700 transition-all"
                          >
                            <FiDownload size={14} />
                            Download
                          </button>
                        </div>
                      </div>
                    </div>
                  )}

                  {selectedApplication.coverLetter && (
                    <div>
                      <h4 className="text-sm font-medium text-gray-700 mb-2 flex items-center gap-1">
                        <FiFileText size={14} />
                        Cover Letter
                      </h4>
                      <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                        <p className="text-gray-700">{selectedApplication.coverLetter}</p>
                      </div>
                    </div>
                  )}
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Resume View Modal - Updated with better preview */}
        <AnimatePresence>
          {showResumeModal && resumeUrl && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 backdrop-blur-sm"
            >
              <motion.div
                initial={{ scale: 0.9, y: 20 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.9, y: 20 }}
                className="bg-white rounded-2xl p-6 max-w-4xl w-full mx-4 max-h-[90vh] flex flex-col shadow-2xl"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <FiFile className="text-blue-600" size={24} />
                    <div>
                      <h3 className="text-lg font-bold text-gray-900">Resume Preview</h3>
                      <p className="text-sm text-gray-500">{resumeName}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleDownloadResume(resumeUrl, resumeName)}
                      className="flex items-center gap-1 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all text-sm"
                    >
                      <FiDownload size={14} />
                      Download
                    </button>
                    <button
                      onClick={() => window.open(resumeUrl, '_blank')}
                      className="flex items-center gap-1 px-3 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-all text-sm"
                    >
                      <FiExternalLink size={14} />
                      Open in New Tab
                    </button>
                    <button
                      onClick={() => setShowResumeModal(false)}
                      className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                      <FiXCircle size={24} className="text-gray-500" />
                    </button>
                  </div>
                </div>

                <div className="flex-1 bg-gray-100 rounded-lg overflow-auto min-h-[500px] p-4">
                  {renderResumeContent()}
                </div>

                <div className="mt-4 text-xs text-gray-400 text-center">
                  <p>Resume is displayed for preview purposes only</p>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default JobApplications;