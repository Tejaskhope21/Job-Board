import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Link } from 'react-router-dom';
import axios from '../../utils/axiosConfig';
import { 
  FiUsers, 
  FiBriefcase, 
  FiFileText, 
  FiTrendingUp, 
  FiUserCheck, 
  FiUserX,
  FiCalendar,
  FiClock,
  FiBarChart2,
  FiActivity,
  FiAward,
  FiTarget,
  FiEye,
  FiArrowRight,
  FiUsers as FiUserGroup,
  FiUserPlus,
  FiUserMinus,
  FiCheckCircle,
  FiXCircle,
  FiAlertCircle,
  FiDollarSign,
  FiStar,
  FiRefreshCw
} from 'react-icons/fi';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';

const AdminDashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [recentUsers, setRecentUsers] = useState([]);
  const [recentJobs, setRecentJobs] = useState([]);
  const [chartData, setChartData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const [statsRes, usersRes, jobsRes] = await Promise.all([
        axios.get('/api/admin/stats'),
        axios.get('/api/admin/users?limit=5'),
        axios.get('/api/jobs?limit=5')
      ]);
      
      setStats(statsRes.data);
      setRecentUsers(usersRes.data.users || []);
      setRecentJobs(jobsRes.data.jobs || []);
      
      // Generate chart data from stats
      if (statsRes.data) {
        setChartData([
          { name: 'Users', value: statsRes.data.totalUsers || 0, color: '#3B82F6' },
          { name: 'Jobs', value: statsRes.data.totalJobs || 0, color: '#10B981' },
          { name: 'Applications', value: statsRes.data.totalApplications || 0, color: '#8B5CF6' },
          { name: 'Employers', value: statsRes.data.totalEmployers || 0, color: '#F59E0B' },
          { name: 'Candidates', value: statsRes.data.totalCandidates || 0, color: '#EC4899' }
        ]);
      }
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      toast.error('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchDashboardData();
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

  const UserCardSkeleton = () => (
    <div className="flex items-center justify-between border-b border-gray-100 pb-3 animate-pulse">
      <div className="flex-1">
        <div className="h-5 bg-gray-200 rounded w-32 mb-1"></div>
        <div className="h-4 bg-gray-200 rounded w-40"></div>
      </div>
      <div className="h-6 bg-gray-200 rounded-full w-16"></div>
    </div>
  );

  const JobCardSkeleton = () => (
    <div className="flex items-center justify-between border-b border-gray-100 pb-3 animate-pulse">
      <div className="flex-1">
        <div className="h-5 bg-gray-200 rounded w-40 mb-1"></div>
        <div className="h-4 bg-gray-200 rounded w-48"></div>
      </div>
      <div className="h-6 bg-gray-200 rounded-full w-16"></div>
    </div>
  );

  const ChartSkeleton = () => (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 animate-pulse">
      <div className="flex items-center justify-between mb-4">
        <div className="h-6 bg-gray-200 rounded w-32"></div>
        <div className="h-4 bg-gray-200 rounded w-20"></div>
      </div>
      <div className="h-64 bg-gray-100 rounded-lg"></div>
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

          {/* Stats Grid Skeleton */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <StatCardSkeleton />
            <StatCardSkeleton />
            <StatCardSkeleton />
            <StatCardSkeleton />
          </div>

          {/* Charts Skeleton */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            <ChartSkeleton />
            <ChartSkeleton />
          </div>

          {/* Recent Activity Skeleton */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="h-6 bg-gray-200 rounded w-32 mb-4 animate-pulse"></div>
              <div className="space-y-3">
                <UserCardSkeleton />
                <UserCardSkeleton />
                <UserCardSkeleton />
                <UserCardSkeleton />
                <UserCardSkeleton />
              </div>
            </div>
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="h-6 bg-gray-200 rounded w-32 mb-4 animate-pulse"></div>
              <div className="space-y-3">
                <JobCardSkeleton />
                <JobCardSkeleton />
                <JobCardSkeleton />
                <JobCardSkeleton />
                <JobCardSkeleton />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const statCards = [
    { 
      title: 'Total Users', 
      value: stats?.totalUsers || 0, 
      icon: FiUsers, 
      color: 'bg-blue-500',
      gradient: 'from-blue-500 to-blue-600',
      detail: `${stats?.totalEmployers || 0} Employers, ${stats?.totalCandidates || 0} Candidates`,
      change: '+12%',
      changeColor: 'text-green-600'
    },
    { 
      title: 'Total Jobs', 
      value: stats?.totalJobs || 0, 
      icon: FiBriefcase, 
      color: 'bg-green-500',
      gradient: 'from-green-500 to-green-600',
      detail: `${stats?.activeJobs || 0} Active Jobs`,
      change: '+8%',
      changeColor: 'text-green-600'
    },
    { 
      title: 'Applications', 
      value: stats?.totalApplications || 0, 
      icon: FiFileText, 
      color: 'bg-purple-500',
      gradient: 'from-purple-500 to-purple-600',
      detail: `${stats?.recentApplications || 0} in last 30 days`,
      change: '+23%',
      changeColor: 'text-green-600'
    },
    { 
      title: 'Active Users', 
      value: stats?.activeUsers || stats?.totalUsers || 0, 
      icon: FiTrendingUp, 
      color: 'bg-orange-500',
      gradient: 'from-orange-500 to-orange-600',
      detail: 'Currently active on platform',
      change: '+5%',
      changeColor: 'text-green-600'
    }
  ];

  const COLORS = ['#3B82F6', '#10B981', '#8B5CF6', '#F59E0B', '#EC4899'];

  return (
    <div className="min-h-screen py-8" style={{ backgroundColor: '#fcfaf4' }}>
      <div className="container mx-auto px-4 max-w-7xl">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
            <p className="text-gray-500 mt-1">
              Welcome back, {user?.name}! Here's what's happening on your platform.
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
              Last updated: {new Date().toLocaleTimeString()}
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
                    <p className="text-3xl font-bold text-gray-900 mt-1">{stat.value.toLocaleString()}</p>
                    <p className="text-xs text-gray-400 mt-1">{stat.detail}</p>
                    <div className="flex items-center gap-2 mt-2">
                      <span className={`text-xs font-medium ${stat.changeColor}`}>
                        {stat.change}
                      </span>
                      <span className="text-xs text-gray-400">vs last month</span>
                    </div>
                  </div>
                  <div className={`bg-gradient-to-br ${stat.gradient} p-3 rounded-full text-white shadow-lg`}>
                    <Icon size={24} />
                  </div>
                </div>
              </motion.div>
            );
          })}
        </motion.div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Bar Chart */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                <FiBarChart2 className="text-blue-600" />
                Platform Overview
              </h3>
              <span className="text-xs text-gray-400">Last 30 days</span>
            </div>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                  <XAxis dataKey="name" tick={{ fontSize: 12, fill: '#6B7280' }} />
                  <YAxis tick={{ fontSize: 12, fill: '#6B7280' }} />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'white', 
                      border: '1px solid #E5E7EB',
                      borderRadius: '8px',
                      padding: '8px 12px'
                    }}
                  />
                  <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                    {chartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </motion.div>

          {/* Pie Chart */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                <FiActivity className="text-purple-600" />
                Distribution
              </h3>
              <span className="text-xs text-gray-400">Overall</span>
            </div>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={chartData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={2}
                    dataKey="value"
                  >
                    {chartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'white', 
                      border: '1px solid #E5E7EB',
                      borderRadius: '8px',
                      padding: '8px 12px'
                    }}
                  />
                  <Legend 
                    layout="vertical" 
                    align="right" 
                    verticalAlign="middle"
                    iconType="circle"
                    iconSize={8}
                    formatter={(value) => <span className="text-sm text-gray-600">{value}</span>}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </motion.div>
        </div>

        {/* Recent Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent Users */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                <FiUserCheck className="text-blue-600" />
                Recent Users
              </h3>
              <Link 
                to="/admin/users" 
                className="text-sm text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1"
              >
                View All <FiArrowRight size={14} />
              </Link>
            </div>
            <div className="space-y-3 max-h-80 overflow-y-auto">
              {recentUsers.length === 0 ? (
                <div className="text-center py-8">
                  <FiUserX className="text-4xl text-gray-300 mx-auto mb-2" />
                  <p className="text-gray-500">No recent users</p>
                </div>
              ) : (
                recentUsers.map((user, index) => (
                  <motion.div 
                    key={user._id} 
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 transition-colors border border-transparent hover:border-gray-200"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-400 to-blue-600 flex items-center justify-center text-white font-semibold text-sm">
                        {user.name?.charAt(0).toUpperCase() || 'U'}
                      </div>
                      <div>
                        <p className="font-medium text-gray-800">{user.name}</p>
                        <p className="text-sm text-gray-500">{user.email}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${
                        user.role === 'admin' ? 'bg-red-100 text-red-700' :
                        user.role === 'employer' ? 'bg-blue-100 text-blue-700' :
                        'bg-green-100 text-green-700'
                      }`}>
                        {user.role}
                      </span>
                      {user.isActive !== false && (
                        <FiCheckCircle className="text-green-500" size={14} />
                      )}
                    </div>
                  </motion.div>
                ))
              )}
            </div>
          </motion.div>

          {/* Recent Jobs */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                <FiBriefcase className="text-green-600" />
                Recent Jobs
              </h3>
              <Link 
                to="/admin/jobs" 
                className="text-sm text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1"
              >
                View All <FiArrowRight size={14} />
              </Link>
            </div>
            <div className="space-y-3 max-h-80 overflow-y-auto">
              {recentJobs.length === 0 ? (
                <div className="text-center py-8">
                  <FiBriefcase className="text-4xl text-gray-300 mx-auto mb-2" />
                  <p className="text-gray-500">No recent jobs</p>
                </div>
              ) : (
                recentJobs.map((job, index) => (
                  <motion.div 
                    key={job._id} 
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 transition-colors border border-transparent hover:border-gray-200"
                  >
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-gray-800 truncate">{job.title}</p>
                      <div className="flex items-center gap-2 text-sm text-gray-500">
                        <span>{job.company}</span>
                        <span className="w-1 h-1 bg-gray-300 rounded-full"></span>
                        <span>{job.location}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 flex-shrink-0">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${
                        job.status === 'active' ? 'bg-green-100 text-green-700' :
                        job.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                        'bg-gray-100 text-gray-600'
                      }`}>
                        {job.status || 'Active'}
                      </span>
                      {job.featured && (
                        <FiStar className="text-yellow-500" size={14} />
                      )}
                    </div>
                  </motion.div>
                ))
              )}
            </div>
          </motion.div>
        </div>

        {/* Quick Actions */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="mt-8 grid grid-cols-1 md:grid-cols-4 gap-4"
        >
          <Link 
            to="/admin/users"
            className="group bg-gradient-to-r from-blue-500 to-blue-600 text-white px-6 py-4 rounded-xl hover:shadow-lg transition-all flex items-center justify-center gap-2 hover:-translate-y-0.5"
          >
            <FiUsers className="text-xl group-hover:scale-110 transition-transform" />
            <span className="font-medium">Manage Users</span>
          </Link>
          <Link 
            to="/admin/jobs"
            className="group bg-gradient-to-r from-green-500 to-green-600 text-white px-6 py-4 rounded-xl hover:shadow-lg transition-all flex items-center justify-center gap-2 hover:-translate-y-0.5"
          >
            <FiBriefcase className="text-xl group-hover:scale-110 transition-transform" />
            <span className="font-medium">Manage Jobs</span>
          </Link>
          <Link 
            to="/admin/applications"
            className="group bg-gradient-to-r from-purple-500 to-purple-600 text-white px-6 py-4 rounded-xl hover:shadow-lg transition-all flex items-center justify-center gap-2 hover:-translate-y-0.5"
          >
            <FiFileText className="text-xl group-hover:scale-110 transition-transform" />
            <span className="font-medium">Applications</span>
          </Link>
          <button 
            onClick={handleRefresh}
            disabled={refreshing}
            className="group bg-gradient-to-r from-gray-600 to-gray-700 text-white px-6 py-4 rounded-xl hover:shadow-lg transition-all flex items-center justify-center gap-2 hover:-translate-y-0.5 disabled:opacity-50"
          >
            <FiRefreshCw className={`text-xl ${refreshing ? 'animate-spin' : 'group-hover:rotate-180'} transition-transform`} />
            <span className="font-medium">Refresh</span>
          </button>
        </motion.div>
      </div>
    </div>
  );
};

export default AdminDashboard;