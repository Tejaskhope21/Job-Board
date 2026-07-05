import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import axios from '../../utils/axiosConfig';
import { Link } from 'react-router-dom';
import { 
  FiBriefcase, 
  FiUsers, 
  FiFileText, 
  FiTrendingUp, 
  FiPlus, 
  FiEye,
  FiCalendar,
  FiClock,
  FiCheckCircle,
  FiXCircle,
  FiAlertCircle,
  FiArrowRight,
  FiBarChart2,
  FiUserCheck,
  FiUserPlus,
  FiActivity,
  FiStar,
  FiAward,
  FiTarget,
  FiRefreshCw
} from 'react-icons/fi';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';

const EmployerDashboard = () => {
  const { user } = useAuth();
  const [jobs, setJobs] = useState([]);
  const [stats, setStats] = useState({
    totalJobs: 0,
    totalApplications: 0,
    activeJobs: 0,
    pendingApplications: 0,
    featuredJobs: 0,
    views: 0
  });
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    fetchEmployerData();
  }, []);

  const fetchEmployerData = async () => {
    try {
      const jobsRes = await axios.get('/api/jobs/employer');
      const jobsData = jobsRes.data || [];
      setJobs(jobsData);
      
      // Calculate stats
      const totalApplications = jobsData.reduce((acc, job) => acc + (job.applications?.length || 0), 0);
      const activeJobs = jobsData.filter(job => job.status === 'active').length;
      const pendingApplications = jobsData.reduce((acc, job) => {
        return acc + (job.applications?.filter(app => app.status === 'pending').length || 0);
      }, 0);
      const featuredJobs = jobsData.filter(job => job.featured).length;
      const views = jobsData.reduce((acc, job) => acc + (job.views || 0), 0);
      
      setStats({
        totalJobs: jobsData.length,
        totalApplications,
        activeJobs,
        pendingApplications,
        featuredJobs,
        views
      });
    } catch (error) {
      console.error('Error fetching employer data:', error);
      toast.error('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchEmployerData();
    setRefreshing(false);
    toast.success('Dashboard refreshed successfully!');
  };

  // Skeleton Components
  const StatCardSkeleton = () => (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 animate-pulse">
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <div className="h-4 bg-gray-200 rounded w-24 mb-2"></div>
          <div className="h-8 bg-gray-200 rounded w-16 mb-1"></div>
          <div className="h-3 bg-gray-200 rounded w-32"></div>
        </div>
        <div className="w-12 h-12 bg-gray-200 rounded-full"></div>
      </div>
    </div>
  );

  const JobSkeleton = () => (
    <div className="flex items-center justify-between border-b border-gray-100 pb-3 animate-pulse">
      <div className="flex-1">
        <div className="h-5 bg-gray-200 rounded w-48 mb-1"></div>
        <div className="h-4 bg-gray-200 rounded w-64"></div>
      </div>
      <div className="flex items-center gap-3">
        <div className="h-6 bg-gray-200 rounded-full w-16"></div>
        <div className="h-5 bg-gray-200 rounded w-28"></div>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="min-h-screen py-8" style={{ backgroundColor: '#fcfaf4' }}>
        <div className="container mx-auto px-4 max-w-7xl">
          {/* Header Skeleton */}
          <div className="mb-8">
            <div className="h-8 bg-gray-200 rounded w-64 mb-2 animate-pulse"></div>
            <div className="h-4 bg-gray-200 rounded w-96 animate-pulse"></div>
          </div>

          {/* Stats Skeleton */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <StatCardSkeleton />
            <StatCardSkeleton />
            <StatCardSkeleton />
            <StatCardSkeleton />
          </div>

          {/* Quick Actions Skeleton */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div className="h-20 bg-gray-200 rounded-xl animate-pulse"></div>
            <div className="h-20 bg-gray-200 rounded-xl animate-pulse"></div>
          </div>

          {/* Recent Jobs Skeleton */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="h-6 bg-gray-200 rounded w-48 mb-4 animate-pulse"></div>
            <div className="space-y-4">
              <JobSkeleton />
              <JobSkeleton />
              <JobSkeleton />
              <JobSkeleton />
              <JobSkeleton />
            </div>
          </div>
        </div>
      </div>
    );
  }

  const statCards = [
    { 
      title: 'Total Jobs', 
      value: stats.totalJobs, 
      icon: FiBriefcase, 
      color: 'from-blue-500 to-blue-600',
      detail: `${stats.activeJobs} active jobs`
    },
    { 
      title: 'Active Jobs', 
      value: stats.activeJobs, 
      icon: FiTrendingUp, 
      color: 'from-green-500 to-green-600',
      detail: `${stats.featuredJobs} featured`
    },
    { 
      title: 'Applications', 
      value: stats.totalApplications, 
      icon: FiFileText, 
      color: 'from-purple-500 to-purple-600',
      detail: `${stats.pendingApplications} pending review`
    },
    { 
      title: 'Pending Review', 
      value: stats.pendingApplications, 
      icon: FiUsers, 
      color: 'from-orange-500 to-orange-600',
      detail: 'Awaiting response'
    }
  ];

  const getStatusColor = (status) => {
    switch(status) {
      case 'active': return 'bg-green-100 text-green-700 border-green-200';
      case 'closed': return 'bg-red-100 text-red-700 border-red-200';
      case 'draft': return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      default: return 'bg-gray-100 text-gray-600 border-gray-200';
    }
  };

  const getStatusIcon = (status) => {
    switch(status) {
      case 'active': return <FiCheckCircle className="text-green-500" size={12} />;
      case 'closed': return <FiXCircle className="text-red-500" size={12} />;
      case 'draft': return <FiAlertCircle className="text-yellow-500" size={12} />;
      default: return null;
    }
  };

  return (
    <div className="min-h-screen py-8" style={{ backgroundColor: '#fcfaf4' }}>
      <div className="container mx-auto px-4 max-w-7xl">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
              <FiBriefcase className="text-blue-600" />
              Employer Dashboard
            </h1>
            <p className="text-gray-500 mt-1">
              Welcome back, {user?.name}! Manage your job postings and applications.
            </p>
          </div>
          <div className="flex items-center gap-3 mt-4 md:mt-0">
            <button
              onClick={handleRefresh}
              disabled={refreshing}
              className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-all text-gray-700 font-medium text-sm"
            >
              <FiRefreshCw className={`${refreshing ? 'animate-spin' : ''}`} size={16} />
              Refresh
            </button>
            <span className="flex items-center gap-1 text-sm text-gray-400">
              <FiClock size={14} />
              {new Date().toLocaleTimeString()}
            </span>
          </div>
        </div>

        {/* Statistics Cards */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
        >
          {statCards.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <motion.div 
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-all hover:-translate-y-1"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-500 text-sm font-medium">{stat.title}</p>
                    <p className="text-3xl font-bold text-gray-900 mt-1">{stat.value}</p>
                    <p className="text-xs text-gray-400 mt-1">{stat.detail}</p>
                  </div>
                  <div className={`bg-gradient-to-br ${stat.color} p-3 rounded-full text-white shadow-lg`}>
                    <Icon size={24} />
                  </div>
                </div>
              </motion.div>
            );
          })}
        </motion.div>

        {/* Quick Actions */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8"
        >
          <Link
            to="/employer/post-job"
            className="group bg-gradient-to-r from-blue-500 to-blue-600 text-white p-6 rounded-xl hover:shadow-lg transition-all hover:-translate-y-0.5"
          >
            <div className="flex items-center justify-center gap-3">
              <FiPlus size={28} className="group-hover:scale-110 transition-transform" />
              <div>
                <span className="text-lg font-semibold">Post a New Job</span>
                <p className="text-sm text-blue-100 opacity-80">Create a new job listing</p>
              </div>
              <FiArrowRight className="ml-auto group-hover:translate-x-1 transition-transform" size={20} />
            </div>
          </Link>
          <Link
            to="/employer/my-jobs"
            className="group bg-gradient-to-r from-green-500 to-green-600 text-white p-6 rounded-xl hover:shadow-lg transition-all hover:-translate-y-0.5"
          >
            <div className="flex items-center justify-center gap-3">
              <FiEye size={28} className="group-hover:scale-110 transition-transform" />
              <div>
                <span className="text-lg font-semibold">View My Jobs</span>
                <p className="text-sm text-green-100 opacity-80">Manage all your listings</p>
              </div>
              <FiArrowRight className="ml-auto group-hover:translate-x-1 transition-transform" size={20} />
            </div>
          </Link>
        </motion.div>

        {/* Recent Jobs */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
              <FiBriefcase className="text-blue-600" />
              Recent Job Postings
            </h3>
            {jobs.length > 0 && (
              <Link 
                to="/employer/my-jobs" 
                className="text-sm text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1"
              >
                View All <FiArrowRight size={14} />
              </Link>
            )}
          </div>

          {jobs.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-20 h-20 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-4">
                <FiBriefcase className="text-4xl text-blue-400" />
              </div>
              <h4 className="text-lg font-semibold text-gray-800 mb-2">No Jobs Posted Yet</h4>
              <p className="text-gray-500 mb-4">
                Start your journey by posting your first job
              </p>
              <Link
                to="/employer/post-job"
                className="inline-flex items-center gap-2 bg-blue-600 text-white px-6 py-2.5 rounded-lg hover:bg-blue-700 transition-all font-medium"
              >
                <FiPlus size={18} />
                Post Your First Job
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {jobs.slice(0, 5).map((job, index) => (
                <motion.div 
                  key={job._id} 
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-gray-100 pb-3 last:border-0 last:pb-0 hover:bg-gray-50 rounded-lg p-2 -mx-2 transition-colors"
                >
                  <div className="flex-1 min-w-0">
                    <h4 className="font-semibold text-gray-800 truncate">{job.title}</h4>
                    <div className="flex flex-wrap items-center gap-2 text-sm text-gray-500">
                      <span>{job.location}</span>
                      <span className="w-1 h-1 bg-gray-300 rounded-full"></span>
                      <span>{job.type}</span>
                      <span className="w-1 h-1 bg-gray-300 rounded-full"></span>
                      <span className="flex items-center gap-1">
                        <FiUsers size={12} />
                        {job.applications?.length || 0} applications
                      </span>
                      <span className="flex items-center gap-1">
                        <FiBarChart2 size={12} />
                        {job.views || 0} views
                      </span>
                    </div>
                    <div className="flex items-center gap-2 mt-1">
                      <span className={`px-2 py-0.5 rounded-full text-xs font-medium border flex items-center gap-1 ${getStatusColor(job.status)}`}>
                        {getStatusIcon(job.status)}
                        {job.status}
                      </span>
                      {job.featured && (
                        <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-700 border border-yellow-200 flex items-center gap-1">
                          <FiStar size={10} />
                          Featured
                        </span>
                      )}
                      <span className="text-xs text-gray-400">
                        <FiCalendar className="inline mr-1" size={10} />
                        {new Date(job.createdAt).toLocaleDateString('en-US', { 
                          month: 'short', 
                          day: 'numeric',
                          year: 'numeric'
                        })}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 mt-2 sm:mt-0">
                    {job.applications?.length > 0 && (
                      <Link
                        to={`/employer/applications/${job._id}`}
                        className="text-sm text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1"
                      >
                        <FiUserCheck size={14} />
                        View Applications
                      </Link>
                    )}
                    <Link
                      to={`/jobs/${job._id}`}
                      className="text-sm text-gray-500 hover:text-gray-700"
                      target="_blank"
                    >
                      <FiEye size={16} />
                    </Link>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>

        {/* Quick Stats Footer */}
        {jobs.length > 0 && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4"
          >
            <div className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-xl p-4 border border-blue-200">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-500 rounded-lg">
                  <FiTarget className="text-white" />
                </div>
                <div>
                  <p className="text-sm font-medium text-blue-700">Total Views</p>
                  <p className="text-xl font-bold text-blue-900">{stats.views}</p>
                </div>
              </div>
            </div>
            <div className="bg-gradient-to-r from-green-50 to-green-100 rounded-xl p-4 border border-green-200">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-green-500 rounded-lg">
                  <FiUserPlus className="text-white" />
                </div>
                <div>
                  <p className="text-sm font-medium text-green-700">Total Applicants</p>
                  <p className="text-xl font-bold text-green-900">{stats.totalApplications}</p>
                </div>
              </div>
            </div>
            <div className="bg-gradient-to-r from-purple-50 to-purple-100 rounded-xl p-4 border border-purple-200">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-purple-500 rounded-lg">
                  <FiAward className="text-white" />
                </div>
                <div>
                  <p className="text-sm font-medium text-purple-700">Featured Jobs</p>
                  <p className="text-xl font-bold text-purple-900">{stats.featuredJobs}</p>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default EmployerDashboard;