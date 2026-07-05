// components/candidate/MatchedJobs.js - Improved version with skeleton loading and enhanced styling
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from '../../utils/axiosConfig';
import { 
  FiBriefcase, 
  FiMapPin, 
  FiClock, 
  FiTrendingUp,
  FiCheckCircle,
  FiPercent,
  FiAlertCircle,
  FiArrowLeft,
  FiUsers,
  FiDollarSign,
  FiUpload,
  FiStar,
  FiAward,
  FiBarChart2,
  FiBookmark,
  FiShare2
} from 'react-icons/fi';
import toast from 'react-hot-toast';
import ResumeUpload from './ResumeUpload';

const MatchedJobs = () => {
  const navigate = useNavigate();
  const [matchedJobs, setMatchedJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [userSkills, setUserSkills] = useState([]);
  const [hasResume, setHasResume] = useState(false);
  const [stats, setStats] = useState({
    totalMatches: 0,
    averageMatch: 0,
    topSkill: ''
  });

  useEffect(() => {
    fetchMatchedJobs();
    checkResumeStatus();
  }, []);

  const fetchMatchedJobs = async () => {
    try {
      const response = await axios.get('/api/resume/matched-jobs');
      setMatchedJobs(response.data.jobs || []);
      setUserSkills(response.data.skills || []);
      
      // Calculate stats
      const jobs = response.data.jobs || [];
      if (jobs.length > 0) {
        const totalMatch = jobs.reduce((sum, job) => sum + (job.matchPercentage || 0), 0);
        const avgMatch = Math.round(totalMatch / jobs.length);
        setStats({
          totalMatches: jobs.length,
          averageMatch: avgMatch,
          topSkill: response.data.skills?.[0] || 'N/A'
        });
      }
    } catch (error) {
      console.error('Error fetching matched jobs:', error);
      toast.error('Failed to load matched jobs');
    } finally {
      setLoading(false);
    }
  };

  const checkResumeStatus = async () => {
    try {
      const response = await axios.get('/api/resume/resume-status');
      setHasResume(response.data.hasResume);
    } catch (error) {
      console.error('Error checking resume status:', error);
    }
  };

  const handleUploadSuccess = (data) => {
    setUserSkills(data.skills || []);
    fetchMatchedJobs();
    setShowUploadModal(false);
  };

  // Skeleton Components
  const MatchedJobsSkeleton = () => (
    <div className="min-h-screen" style={{ backgroundColor: '#fcfaf4' }}>
      <div className="container mx-auto px-4 py-8 max-w-5xl">
        {/* Back Button Skeleton */}
        <div className="h-6 bg-gray-200 rounded w-24 mb-6 animate-pulse"></div>

        <div className="bg-white border border-gray-200 rounded-xl p-8">
          {/* Header Skeleton */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <div className="h-8 bg-gray-200 rounded w-64 mb-2 animate-pulse"></div>
              <div className="h-4 bg-gray-200 rounded w-72 animate-pulse"></div>
            </div>
            <div className="h-10 bg-gray-200 rounded-lg w-36 animate-pulse"></div>
          </div>

          {/* Skills Display Skeleton */}
          <div className="mb-6 p-4 bg-gray-50 rounded-lg border border-gray-100">
            <div className="h-4 bg-gray-200 rounded w-24 mb-3 animate-pulse"></div>
            <div className="flex flex-wrap gap-2">
              {[1, 2, 3, 4, 5, 6, 7, 8].map((item) => (
                <div key={item} className="h-8 bg-gray-200 rounded-lg w-20 animate-pulse"></div>
              ))}
            </div>
          </div>

          {/* Stats Skeleton */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            {[1, 2, 3].map((item) => (
              <div key={item} className="bg-gray-50 rounded-lg p-4 animate-pulse">
                <div className="h-4 bg-gray-200 rounded w-20 mb-2"></div>
                <div className="h-8 bg-gray-200 rounded w-16"></div>
              </div>
            ))}
          </div>

          {/* Job Cards Skeleton */}
          <div className="space-y-4">
            {[1, 2, 3, 4].map((item) => (
              <div key={item} className="rounded-xl p-5 border border-gray-200 animate-pulse">
                <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 bg-gray-200 rounded-lg flex-shrink-0"></div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <div className="h-6 bg-gray-200 rounded w-48"></div>
                          <div className="h-5 bg-gray-200 rounded-full w-20"></div>
                        </div>
                        <div className="h-4 bg-gray-200 rounded w-32 mt-1"></div>
                        <div className="flex flex-wrap items-center gap-3 mt-2">
                          <div className="h-4 bg-gray-200 rounded w-24"></div>
                          <div className="h-4 bg-gray-200 rounded w-20"></div>
                          <div className="h-4 bg-gray-200 rounded w-24"></div>
                          <div className="h-5 bg-gray-200 rounded-full w-16"></div>
                        </div>
                        <div className="flex flex-wrap gap-1.5 mt-2">
                          {[1, 2, 3, 4].map((skill) => (
                            <div key={skill} className="h-6 bg-gray-200 rounded-full w-16"></div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="flex-shrink-0">
                    <div className="h-8 bg-gray-200 rounded w-32"></div>
                    <div className="h-3 bg-gray-200 rounded w-12 mt-1 ml-auto"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  // Job Card Component
  const JobCard = ({ job }) => (
    <Link
      to={`/jobs/${job._id}`}
      className="block group hover:bg-gray-50 rounded-xl p-5 border border-gray-200 transition-all hover:border-blue-200 hover:shadow-md"
    >
      <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
        <div className="flex-1 min-w-0">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center text-white font-bold text-sm flex-shrink-0 shadow-sm">
              {job.company?.charAt(0).toUpperCase()}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className="text-lg font-semibold text-gray-800 group-hover:text-blue-600 transition-colors">
                  {job.title}
                </h3>
                <span className={`text-xs font-medium px-2.5 py-1 rounded-full flex items-center gap-1 ${
                  job.matchPercentage >= 70 ? 'bg-green-100 text-green-700 border border-green-200' :
                  job.matchPercentage >= 40 ? 'bg-yellow-100 text-yellow-700 border border-yellow-200' :
                  'bg-gray-100 text-gray-600 border border-gray-200'
                }`}>
                  <FiPercent size={12} />
                  {job.matchPercentage}% Match
                </span>
                {job.matchPercentage >= 70 && (
                  <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full flex items-center gap-1">
                    <FiStar size={12} />
                    Top Pick
                  </span>
                )}
              </div>
              <p className="text-gray-600 text-sm font-medium">{job.company}</p>
              <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5 mt-1.5 text-sm text-gray-500">
                <span className="flex items-center">
                  <FiMapPin className="mr-1" size={14} />
                  {job.location}
                </span>
                <span className="flex items-center">
                  <FiBriefcase className="mr-1" size={14} />
                  {job.type}
                </span>
                <span className="flex items-center">
                  <FiClock className="mr-1" size={14} />
                  {new Date(job.createdAt).toLocaleDateString('en-US', { 
                    month: 'short', 
                    day: 'numeric',
                    year: 'numeric'
                  })}
                </span>
                {job.remote && (
                  <span className="bg-green-50 text-green-600 px-2 py-0.5 rounded-full text-xs font-medium border border-green-200">
                    Remote
                  </span>
                )}
              </div>
              {job.matchingSkills && job.matchingSkills.length > 0 && (
                <div className="flex flex-wrap gap-1.5 mt-2">
                  {job.matchingSkills.slice(0, 5).map((skill, idx) => (
                    <span key={idx} className="bg-green-50 text-green-700 px-2.5 py-0.5 rounded-full text-xs font-medium border border-green-200">
                      {skill}
                    </span>
                  ))}
                  {job.matchingSkills.length > 5 && (
                    <span className="text-gray-400 text-xs flex items-center">
                      +{job.matchingSkills.length - 5} more
                    </span>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
        {job.salary?.min && job.salary?.max && (
          <div className="flex-shrink-0 text-left md:text-right">
            <p className="text-sm font-semibold text-gray-800">
              ${job.salary.min.toLocaleString()} - ${job.salary.max.toLocaleString()}
            </p>
            <p className="text-xs text-gray-500">/ year</p>
          </div>
        )}
      </div>
    </Link>
  );

  if (loading) {
    return <MatchedJobsSkeleton />;
  }

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#fcfaf4' }}>
      <div className="container mx-auto px-4 py-8 max-w-5xl">
        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="inline-flex items-center text-blue-600 hover:text-blue-800 mb-6 font-medium transition-colors group"
        >
          <FiArrowLeft className="mr-2 group-hover:-translate-x-1 transition-transform" />
          Back
        </button>

        <div className="bg-white border border-gray-200 rounded-xl p-8 shadow-sm">
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                <FiTrendingUp className="text-blue-600" />
                Jobs Matching Your Skills
              </h1>
              <p className="text-gray-500 mt-1">
                {userSkills.length > 0 
                  ? `Found ${matchedJobs.length} jobs matching your ${userSkills.length} skills`
                  : 'Upload your resume to get matched with jobs'}
              </p>
            </div>
            {!hasResume && (
              <button
                onClick={() => setShowUploadModal(true)}
                className="bg-blue-600 text-white px-5 py-2.5 rounded-lg hover:bg-blue-700 transition-all flex items-center gap-2 text-sm font-medium shadow-sm hover:shadow-md"
              >
                <FiUpload size={16} />
                Upload Resume
              </button>
            )}
          </div>

          {/* Skills Display */}
          {userSkills.length > 0 && (
            <div className="mb-6 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-100">
              <div className="flex items-center gap-2 mb-2">
                <FiAward className="text-blue-600" />
                <p className="text-sm font-semibold text-gray-700">Your Skills Profile</p>
                <span className="text-xs text-gray-500 ml-auto">
                  {userSkills.length} skills detected
                </span>
              </div>
              <div className="flex flex-wrap gap-2">
                {userSkills.slice(0, 15).map((skill, index) => (
                  <span key={index} className="bg-white text-blue-700 px-3 py-1.5 rounded-lg text-sm font-medium border border-blue-200 shadow-sm hover:shadow-md transition-shadow">
                    {skill}
                  </span>
                ))}
                {userSkills.length > 15 && (
                  <span className="text-gray-500 text-sm flex items-center px-3 py-1.5 bg-gray-50 rounded-lg border border-gray-200">
                    +{userSkills.length - 15} more
                  </span>
                )}
              </div>
            </div>
          )}

          {/* Stats Cards */}
          {hasResume && matchedJobs.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-4 border border-blue-200">
                <p className="text-sm text-blue-700 font-medium flex items-center gap-1">
                  <FiBarChart2 size={16} />
                  Total Matches
                </p>
                <p className="text-2xl font-bold text-blue-900 mt-1">{stats.totalMatches}</p>
              </div>
              <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-4 border border-green-200">
                <p className="text-sm text-green-700 font-medium flex items-center gap-1">
                  <FiPercent size={16} />
                  Average Match
                </p>
                <p className="text-2xl font-bold text-green-900 mt-1">{stats.averageMatch}%</p>
              </div>
              <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg p-4 border border-purple-200">
                <p className="text-sm text-purple-700 font-medium flex items-center gap-1">
                  <FiAward size={16} />
                  Top Skill
                </p>
                <p className="text-2xl font-bold text-purple-900 mt-1 truncate">{stats.topSkill}</p>
              </div>
            </div>
          )}

          {/* Jobs List */}
          {!hasResume ? (
            <div className="text-center py-16">
              <div className="w-20 h-20 bg-gradient-to-br from-blue-100 to-blue-200 rounded-full flex items-center justify-center mx-auto mb-4">
                <FiAlertCircle className="text-4xl text-blue-500" />
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">No Resume Uploaded</h3>
              <p className="text-gray-500 mb-6 max-w-md mx-auto">
                Upload your resume to find jobs that match your skills and experience
              </p>
              <button
                onClick={() => setShowUploadModal(true)}
                className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-all inline-flex items-center gap-2 font-medium shadow-sm hover:shadow-md"
              >
                <FiUpload size={18} />
                Upload Resume Now
              </button>
            </div>
          ) : matchedJobs.length === 0 ? (
            <div className="text-center py-16">
              <div className="w-20 h-20 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
                <FiAlertCircle className="text-4xl text-gray-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">No Matching Jobs Found</h3>
              <p className="text-gray-500 max-w-md mx-auto mb-6">
                We couldn't find jobs matching your skills. Try uploading a more detailed resume or add more skills to your profile.
              </p>
              <button
                onClick={() => setShowUploadModal(true)}
                className="text-blue-600 hover:text-blue-700 font-medium inline-flex items-center gap-1 transition-colors"
              >
                <FiUpload size={16} />
                Update Resume
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {matchedJobs.map((job) => (
                <JobCard key={job._id} job={job} />
              ))}
              
              {/* Footer Message */}
              <div className="text-center pt-4 border-t border-gray-200 mt-2">
                <p className="text-sm text-gray-500">
                  Showing {matchedJobs.length} job{matchedJobs.length > 1 ? 's' : ''} matching your skills
                </p>
              </div>
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

export default MatchedJobs;