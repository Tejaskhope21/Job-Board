import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import axios from '../../utils/axiosConfig';
import { Link } from 'react-router-dom';
import { 
  FiBriefcase, 
  FiFileText, 
  FiCheckCircle, 
  FiClock, 
  FiTrendingUp,
  FiUserCheck,
  FiUpload,
  FiAlertCircle
} from 'react-icons/fi';
import toast from 'react-hot-toast';
import MatchedJobs from './MatchedJobs';

const CandidateDashboard = () => {
  const { user } = useAuth();
  const [applications, setApplications] = useState([]);
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    interviewed: 0,
    offered: 0,
    hired: 0,
    rejected: 0
  });
  const [loading, setLoading] = useState(true);
  const [hasResume, setHasResume] = useState(false);

  useEffect(() => {
    fetchApplications();
    checkResumeStatus();
  }, []);

  const fetchApplications = async () => {
    try {
      const response = await axios.get('/api/applications/my');
      const apps = response.data || [];
      setApplications(apps);
      
      setStats({
        total: apps.length,
        pending: apps.filter(a => a.status === 'pending').length,
        interviewed: apps.filter(a => a.status === 'interviewed').length,
        offered: apps.filter(a => a.status === 'offered').length,
        hired: apps.filter(a => a.status === 'hired').length,
        rejected: apps.filter(a => a.status === 'rejected').length
      });
    } catch (error) {
      console.error('Error fetching applications:', error);
      toast.error('Failed to load applications');
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

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]" style={{ backgroundColor: '#fcfaf4' }}>
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  const statCards = [
    { title: 'Total Applications', value: stats.total, icon: FiBriefcase, color: 'bg-blue-500' },
    { title: 'Pending Review', value: stats.pending, icon: FiClock, color: 'bg-yellow-500' },
    { title: 'Interviews', value: stats.interviewed, icon: FiFileText, color: 'bg-purple-500' },
    { title: 'Offers Received', value: stats.offered + stats.hired, icon: FiCheckCircle, color: 'bg-green-500' }
  ];

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#fcfaf4' }}>
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Candidate Dashboard</h1>
          <p className="text-gray-600 mt-1">
            Welcome back, {user?.name}! Track your job applications and find new opportunities.
          </p>
        </div>

        {/* Resume Status Alert */}
        <div className={`mb-6 p-4 rounded-xl border flex items-center justify-between ${
          hasResume 
            ? 'bg-green-50 border-green-200' 
            : 'bg-yellow-50 border-yellow-200'
        }`}>
          <div className="flex items-center gap-3">
            {hasResume ? (
              <FiCheckCircle className="text-green-500 text-xl" />
            ) : (
              <FiAlertCircle className="text-yellow-500 text-xl" />
            )}
            <div>
              <p className={`font-medium ${hasResume ? 'text-green-700' : 'text-yellow-700'}`}>
                {hasResume ? 'Resume Uploaded' : 'Resume Not Uploaded'}
              </p>
              <p className={`text-sm ${hasResume ? 'text-green-600' : 'text-yellow-600'}`}>
                {hasResume 
                  ? 'Your resume is ready. Get matched with jobs!' 
                  : 'Upload your resume to get personalized job recommendations'}
              </p>
            </div>
          </div>
          <Link
            to="/candidate/resume"
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              hasResume 
                ? 'bg-green-600 text-white hover:bg-green-700' 
                : 'bg-yellow-600 text-white hover:bg-yellow-700'
            }`}
          >
            {hasResume ? 'View Resume' : 'Upload Resume'}
          </Link>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-8">
          {statCards.map((stat, index) => (
            <div key={index} className="bg-white border border-gray-200 rounded-xl p-6 hover:border-blue-300 transition-all">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-500 text-sm font-medium">{stat.title}</p>
                  <p className="text-3xl font-bold text-gray-900 mt-1">{stat.value}</p>
                </div>
                <div className={`${stat.color} p-3 rounded-xl text-white`}>
                  <stat.icon size={24} />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 mb-8">
          <Link
            to="/jobs"
            className="bg-blue-600 text-white p-5 rounded-xl hover:bg-blue-700 transition-all flex items-center justify-center gap-2 group"
          >
            <FiBriefcase size={22} />
            <span className="text-base font-semibold">Browse Jobs</span>
          </Link>
          <Link
            to="/candidate/applications"
            className="bg-green-600 text-white p-5 rounded-xl hover:bg-green-700 transition-all flex items-center justify-center gap-2 group"
          >
            <FiFileText size={22} />
            <span className="text-base font-semibold">My Applications</span>
          </Link>
          <Link
            to="/candidate/matched-jobs"
            className="bg-purple-600 text-white p-5 rounded-xl hover:bg-purple-700 transition-all flex items-center justify-center gap-2 group"
          >
            <FiTrendingUp size={22} />
            <span className="text-base font-semibold">Matched Jobs</span>
            {!hasResume && (
              <span className="ml-2 text-xs bg-white/20 px-2 py-0.5 rounded-full">
                Upload Resume
              </span>
            )}
          </Link>
        </div>

        {/* Matched Jobs Section */}
        <div className="mb-8">
          <MatchedJobs />
        </div>

        {/* Recent Applications */}
        <div className="bg-white border border-gray-200 rounded-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
              <FiClock className="text-blue-600" />
              Recent Applications
            </h3>
            {applications.length > 0 && (
              <Link 
                to="/candidate/applications" 
                className="text-sm text-blue-600 hover:text-blue-700 font-medium"
              >
                View All →
              </Link>
            )}
          </div>
          
          {applications.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <FiBriefcase className="text-2xl text-gray-400" />
              </div>
              <p className="text-gray-500 font-medium">No applications yet</p>
              <p className="text-sm text-gray-400 mt-1">
                Start exploring jobs and apply to your dream position
              </p>
              <Link 
                to="/jobs" 
                className="inline-block mt-4 text-blue-600 hover:text-blue-700 font-medium"
              >
                Browse Jobs →
              </Link>
            </div>
          ) : (
            <div className="space-y-3">
              {applications.slice(0, 5).map((app) => (
                <div key={app._id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-all">
                  <div className="flex-1 min-w-0">
                    <h4 className="font-medium text-gray-800 truncate">
                      {app.job?.title || 'Job not found'}
                    </h4>
                    <p className="text-sm text-gray-500 truncate">
                      {app.job?.company || 'Company not found'} • {app.job?.location || 'Location not specified'}
                    </p>
                  </div>
                  <div className="flex items-center gap-3 flex-shrink-0 ml-4">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${
                      app.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                      app.status === 'reviewed' ? 'bg-blue-100 text-blue-700' :
                      app.status === 'shortlisted' ? 'bg-purple-100 text-purple-700' :
                      app.status === 'interviewed' ? 'bg-indigo-100 text-indigo-700' :
                      app.status === 'offered' ? 'bg-green-100 text-green-700' :
                      app.status === 'hired' ? 'bg-teal-100 text-teal-700' :
                      app.status === 'rejected' ? 'bg-red-100 text-red-700' :
                      'bg-gray-100 text-gray-600'
                    }`}>
                      {app.status || 'Pending'}
                    </span>
                    <span className="text-xs text-gray-400 whitespace-nowrap">
                      {new Date(app.appliedAt).toLocaleDateString('en-US', { 
                        month: 'short', 
                        day: 'numeric' 
                      })}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CandidateDashboard;