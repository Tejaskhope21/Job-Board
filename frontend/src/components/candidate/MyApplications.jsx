import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from '../../utils/axiosConfig';
import { 
  FiFileText, 
  FiClock, 
  FiCheckCircle, 
  FiXCircle, 
  FiEye,
  FiBriefcase,
  FiMapPin,
  FiCalendar,
  FiDollarSign,
  FiChevronRight,
  FiFilter,
  FiSearch
} from 'react-icons/fi';
import toast from 'react-hot-toast';

const MyApplications = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchApplications();
  }, []);

  const fetchApplications = async () => {
    try {
      const response = await axios.get('/api/applications/my');
      setApplications(response.data || []);
    } catch (error) {
      console.error('Error fetching applications:', error);
      toast.error('Failed to load applications');
    } finally {
      setLoading(false);
    }
  };

  const getStatusIcon = (status) => {
    switch(status) {
      case 'pending':
      case 'reviewed':
        return <FiClock className="text-yellow-500" />;
      case 'shortlisted':
      case 'interviewed':
        return <FiEye className="text-purple-500" />;
      case 'offered':
      case 'hired':
        return <FiCheckCircle className="text-green-500" />;
      case 'rejected':
        return <FiXCircle className="text-red-500" />;
      default:
        return <FiFileText className="text-gray-500" />;
    }
  };

  const getStatusColor = (status) => {
    switch(status) {
      case 'pending': return 'bg-yellow-50 text-yellow-700 border-yellow-200';
      case 'reviewed': return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'shortlisted': return 'bg-purple-50 text-purple-700 border-purple-200';
      case 'interviewed': return 'bg-indigo-50 text-indigo-700 border-indigo-200';
      case 'offered': return 'bg-green-50 text-green-700 border-green-200';
      case 'hired': return 'bg-teal-50 text-teal-700 border-teal-200';
      case 'rejected': return 'bg-red-50 text-red-700 border-red-200';
      default: return 'bg-gray-50 text-gray-700 border-gray-200';
    }
  };

  const getStatusBadgeStyle = (status) => {
    switch(status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'reviewed': return 'bg-blue-100 text-blue-800';
      case 'shortlisted': return 'bg-purple-100 text-purple-800';
      case 'interviewed': return 'bg-indigo-100 text-indigo-800';
      case 'offered': return 'bg-green-100 text-green-800';
      case 'hired': return 'bg-teal-100 text-teal-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusSteps = (status) => {
    const steps = ['applied', 'reviewed', 'shortlisted', 'interviewed', 'offered', 'hired'];
    const currentIndex = steps.indexOf(status);
    return steps.map((step, index) => ({
      step,
      completed: index <= currentIndex,
      active: index === currentIndex
    }));
  };

  const filteredApplications = applications.filter(app => {
    const matchesFilter = filter === 'all' || app.status === filter;
    const matchesSearch = app.job?.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         app.job?.company?.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  // Application Card Skeleton
  const ApplicationCardSkeleton = () => (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 animate-pulse">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between">
        <div className="flex-1">
          <div className="flex items-start">
            <div className="mr-4 mt-1">
              <div className="w-10 h-10 bg-gray-200 rounded-lg"></div>
            </div>
            <div className="flex-1">
              <div className="h-6 bg-gray-200 rounded w-3/4 mb-2"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2 mb-3"></div>
              <div className="flex flex-wrap items-center gap-4">
                <div className="h-4 bg-gray-200 rounded w-24"></div>
                <div className="h-4 bg-gray-200 rounded w-20"></div>
                <div className="h-4 bg-gray-200 rounded w-28"></div>
                <div className="h-4 bg-gray-200 rounded w-24"></div>
              </div>
              <div className="mt-3">
                <div className="h-16 bg-gray-100 rounded-lg border border-gray-100"></div>
              </div>
              <div className="mt-4 pt-4 border-t border-gray-100">
                <div className="flex items-center justify-between">
                  {[1, 2, 3, 4, 5, 6].map((item) => (
                    <div key={item} className="flex flex-col items-center">
                      <div className="w-8 h-8 bg-gray-200 rounded-full"></div>
                      <div className="h-3 bg-gray-200 rounded w-10 mt-1"></div>
                    </div>
                  ))}
                  {[1, 2, 3, 4, 5].map((item) => (
                    <div key={`line-${item}`} className="flex-1 h-0.5 bg-gray-200 mx-1"></div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="mt-4 md:mt-0 md:ml-4 flex flex-col items-start md:items-end space-y-2">
          <div className="h-6 bg-gray-200 rounded-full w-24"></div>
          <div className="h-4 bg-gray-200 rounded w-20"></div>
        </div>
      </div>
    </div>
  );

  // Status Timeline Component
  const StatusTimeline = ({ status }) => {
    const steps = ['applied', 'reviewed', 'shortlisted', 'interviewed', 'offered', 'hired'];
    const currentIndex = steps.indexOf(status);
    
    return (
      <div className="mt-4 pt-4 border-t border-gray-100">
        <div className="flex items-center justify-between">
          {steps.map((step, index) => (
            <React.Fragment key={step}>
              <div className="flex flex-col items-center">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium transition-all ${
                  index <= currentIndex 
                    ? 'bg-blue-600 text-white shadow-md' 
                    : 'bg-gray-200 text-gray-400'
                }`}>
                  {index <= currentIndex ? '✓' : index + 1}
                </div>
                <span className={`text-xs mt-1 whitespace-nowrap ${
                  index <= currentIndex ? 'text-blue-600 font-medium' : 'text-gray-400'
                }`}>
                  {step.charAt(0).toUpperCase() + step.slice(1)}
                </span>
              </div>
              {index < steps.length - 1 && (
                <div className={`flex-1 h-0.5 mx-1 ${
                  index < currentIndex ? 'bg-blue-600' : 'bg-gray-200'
                }`} />
              )}
            </React.Fragment>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen py-8" style={{ backgroundColor: '#fcfaf4' }}>
      <div className="container mx-auto px-4 max-w-7xl">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">My Applications</h1>
          <p className="text-gray-500">
            Track and manage all your job applications in one place
          </p>
        </div>

        {/* Search and Filter Section */}
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="flex-1 relative">
            <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search by job title or company..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none bg-white"
            />
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <FiFilter className="text-gray-400" />
            {['all', 'pending', 'reviewed', 'shortlisted', 'interviewed', 'offered', 'hired', 'rejected'].map((status) => (
              <button
                key={status}
                onClick={() => setFilter(status)}
                className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all ${
                  filter === status
                    ? 'bg-blue-600 text-white shadow-md'
                    : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-200'
                }`}
              >
                {status.charAt(0).toUpperCase() + status.slice(1)}
                {status !== 'all' && !loading && (
                  <span className={`ml-1.5 px-1.5 py-0.5 rounded-full text-xs ${
                    filter === status ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-600'
                  }`}>
                    {applications.filter(app => app.status === status).length}
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Results Count */}
        {!loading && (
          <div className="mb-4">
            <p className="text-sm text-gray-500">
              Showing {filteredApplications.length} application{filteredApplications.length !== 1 ? 's' : ''}
              {filter !== 'all' && ` with status "${filter}"`}
              {searchTerm && ` matching "${searchTerm}"`}
            </p>
          </div>
        )}

        {loading ? (
          // Show skeleton loaders while loading
          <div className="space-y-4">
            <ApplicationCardSkeleton />
            <ApplicationCardSkeleton />
            <ApplicationCardSkeleton />
            <ApplicationCardSkeleton />
            <ApplicationCardSkeleton />
          </div>
        ) : (
          <>
            {filteredApplications.length === 0 ? (
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-16 text-center">
                <div className="max-w-md mx-auto">
                  <div className="w-20 h-20 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-4">
                    <FiFileText className="text-4xl text-blue-500" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-800 mb-2">
                    {applications.length === 0 
                      ? "No applications yet"
                      : `No ${filter} applications found`}
                  </h3>
                  <p className="text-gray-500 mb-6">
                    {applications.length === 0 
                      ? "Start your job search journey by applying to positions that match your skills"
                      : "Try adjusting your filters or search terms to find what you're looking for"}
                  </p>
                  {applications.length === 0 && (
                    <Link
                      to="/jobs"
                      className="inline-flex items-center bg-blue-600 text-white px-6 py-2.5 rounded-lg hover:bg-blue-700 transition-all font-medium"
                    >
                      Browse Jobs <FiChevronRight className="ml-2" />
                    </Link>
                  )}
                  {applications.length > 0 && filter !== 'all' && (
                    <button
                      onClick={() => setFilter('all')}
                      className="text-blue-600 hover:text-blue-700 font-medium"
                    >
                      View all applications
                    </button>
                  )}
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredApplications.map((app) => (
                  <div key={app._id} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-all hover:border-blue-200">
                    <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between">
                      <div className="flex-1">
                        <div className="flex items-start gap-4">
                          <div className="flex-shrink-0 mt-1">
                            <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${getStatusColor(app.status)} border`}>
                              {getStatusIcon(app.status)}
                            </div>
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex flex-wrap items-start justify-between gap-2">
                              <div>
                                <h3 className="text-lg font-semibold text-gray-900 hover:text-blue-600 transition-colors">
                                  <Link to={app.job ? `/jobs/${app.job._id}` : '#'}>
                                    {app.job?.title || 'Job not found'}
                                  </Link>
                                </h3>
                                <p className="text-gray-600">{app.job?.company || 'Company not found'}</p>
                              </div>
                              <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${getStatusBadgeStyle(app.status)}`}>
                                {app.status.charAt(0).toUpperCase() + app.status.slice(1)}
                              </span>
                            </div>
                            
                            <div className="flex flex-wrap items-center gap-x-4 gap-y-2 mt-2 text-sm text-gray-500">
                              {app.job?.location && (
                                <span className="flex items-center">
                                  <FiMapPin className="mr-1.5" size={14} />
                                  {app.job.location}
                                </span>
                              )}
                              {app.job?.type && (
                                <span className="flex items-center">
                                  <FiBriefcase className="mr-1.5" size={14} />
                                  {app.job.type}
                                </span>
                              )}
                              <span className="flex items-center">
                                <FiCalendar className="mr-1.5" size={14} />
                                Applied: {new Date(app.appliedAt).toLocaleDateString('en-US', { 
                                  year: 'numeric', 
                                  month: 'short', 
                                  day: 'numeric' 
                                })}
                              </span>
                              {app.expectedSalary && (
                                <span className="flex items-center">
                                  <FiDollarSign className="mr-1.5" size={14} />
                                  Expected: ${app.expectedSalary.toLocaleString()}
                                </span>
                              )}
                            </div>

                            {app.coverLetter && (
                              <div className="mt-3">
                                <p className="text-sm text-gray-600 bg-gray-50 p-3 rounded-lg border border-gray-100">
                                  {app.coverLetter}
                                </p>
                              </div>
                            )}

                            {/* Status Timeline */}
                            <StatusTimeline status={app.status} />
                          </div>
                        </div>
                      </div>
                      
                      <div className="mt-4 lg:mt-0 lg:ml-6 flex lg:flex-col items-center lg:items-end gap-3">
                        {app.job && (
                          <Link
                            to={`/jobs/${app.job._id}`}
                            className="inline-flex items-center text-blue-600 hover:text-blue-800 font-medium text-sm transition-colors"
                          >
                            <FiEye className="mr-1.5" />
                            View Job Details
                          </Link>
                        )}
                        {app.status === 'pending' && (
                          <span className="text-xs text-gray-400">
                            Awaiting review
                          </span>
                        )}
                        {app.status === 'rejected' && (
                          <span className="text-xs text-red-400">
                            Not selected
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default MyApplications;