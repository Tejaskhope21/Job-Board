import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import axios from '../../utils/axiosConfig';
import { 
  FiSearch, 
  FiMapPin, 
  FiBriefcase, 
  FiFilter, 
  FiClock,
  FiDollarSign,
  FiChevronRight,
  FiX,
  FiSliders
} from 'react-icons/fi';
import toast from 'react-hot-toast';

const JobListings = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totalPages, setTotalPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const [filters, setFilters] = useState({
    search: searchParams.get('search') || '',
    location: searchParams.get('location') || '',
    type: searchParams.get('type') || '',
    category: searchParams.get('category') || '',
    experienceLevel: searchParams.get('experienceLevel') || '',
    remote: searchParams.get('remote') === 'true',
    minSalary: searchParams.get('minSalary') || '',
    maxSalary: searchParams.get('maxSalary') || ''
  });

  const jobTypes = ['Full-time', 'Part-time', 'Contract', 'Internship', 'Remote', 'Freelance'];
  const experienceLevels = ['Entry Level', 'Junior', 'Mid Level', 'Senior', 'Lead', 'Manager'];
  const categories = ['Technology', 'Healthcare', 'Finance', 'Education', 'Construction', 'Marketing', 'Sales', 'Design', 'Legal', 'Consulting'];

  useEffect(() => {
    fetchJobs();
  }, [currentPage, filters]);

  const fetchJobs = async () => {
    setLoading(true);
    try {
      const params = {
        page: currentPage,
        limit: 10,
        ...filters
      };
      
      Object.keys(params).forEach(key => {
        if (params[key] === '' || params[key] === null || params[key] === undefined) {
          delete params[key];
        }
      });
      
      const response = await axios.get('/api/jobs', { params });
      setJobs(response.data.jobs || []);
      setTotalPages(response.data.pages || 1);
      
      const urlParams = {};
      if (filters.search) urlParams.search = filters.search;
      if (filters.location) urlParams.location = filters.location;
      if (filters.type) urlParams.type = filters.type;
      if (filters.category) urlParams.category = filters.category;
      if (filters.experienceLevel) urlParams.experienceLevel = filters.experienceLevel;
      if (filters.remote) urlParams.remote = 'true';
      if (filters.minSalary) urlParams.minSalary = filters.minSalary;
      if (filters.maxSalary) urlParams.maxSalary = filters.maxSalary;
      setSearchParams(urlParams);
    } catch (error) {
      console.error('Error fetching jobs:', error);
      toast.error('Failed to load jobs');
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
    setCurrentPage(1);
  };

  const clearFilters = () => {
    setFilters({
      search: '',
      location: '',
      type: '',
      category: '',
      experienceLevel: '',
      remote: false,
      minSalary: '',
      maxSalary: ''
    });
    setCurrentPage(1);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    fetchJobs();
  };

  const getActiveFiltersCount = () => {
    let count = 0;
    if (filters.type) count++;
    if (filters.category) count++;
    if (filters.experienceLevel) count++;
    if (filters.remote) count++;
    if (filters.minSalary) count++;
    if (filters.maxSalary) count++;
    return count;
  };

  // Job Card Skeleton Component
  const JobCardSkeleton = () => (
    <div className="bg-white border border-gray-200 rounded-xl p-6 animate-pulse">
      <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
        <div className="flex-1 min-w-0">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 bg-gray-200 rounded-lg flex-shrink-0"></div>
            <div className="flex-1 min-w-0">
              <div className="h-6 bg-gray-200 rounded w-3/4 mb-2"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2"></div>
            </div>
          </div>
          
          <div className="flex flex-wrap items-center gap-3 mt-3">
            <div className="h-4 bg-gray-200 rounded w-24"></div>
            <div className="h-4 bg-gray-200 rounded w-20"></div>
            <div className="h-5 bg-gray-200 rounded-full w-16"></div>
            <div className="h-4 bg-gray-200 rounded w-24"></div>
          </div>

          <div className="mt-2 space-y-2">
            <div className="h-4 bg-gray-200 rounded w-full"></div>
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
          </div>
          
          <div className="mt-3 flex flex-wrap gap-1.5">
            <div className="h-6 bg-gray-200 rounded-full w-16"></div>
            <div className="h-6 bg-gray-200 rounded-full w-20"></div>
            <div className="h-6 bg-gray-200 rounded-full w-14"></div>
          </div>
        </div>

        <div className="flex flex-row md:flex-col items-center md:items-end gap-3 md:gap-2 flex-shrink-0">
          <div className="text-right">
            <div className="h-5 bg-gray-200 rounded w-28"></div>
            <div className="h-3 bg-gray-200 rounded w-12 mt-1"></div>
          </div>
          <div className="h-10 bg-gray-200 rounded-lg w-28"></div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#fcfaf4' }}>
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900">Browse Jobs</h1>
          <p className="text-gray-500 mt-1">Find your dream job from thousands of opportunities</p>
        </div>

        {/* Search Bar */}
        <form onSubmit={handleSearch} className="bg-white border border-gray-200 rounded-xl p-4 mb-6">
          <div className="flex flex-col md:flex-row gap-3">
            <div className="flex-1 relative">
              <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search jobs, companies, or keywords..."
                value={filters.search}
                onChange={(e) => handleFilterChange('search', e.target.value)}
                className="w-full pl-10 pr-3 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none"
              />
            </div>
            <div className="flex-1 relative">
              <FiMapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Location"
                value={filters.location}
                onChange={(e) => handleFilterChange('location', e.target.value)}
                className="w-full pl-10 pr-3 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none"
              />
            </div>
            <button
              type="submit"
              className="bg-blue-600 text-white px-6 py-2.5 rounded-lg hover:bg-blue-700 transition-all font-medium whitespace-nowrap"
            >
              Search Jobs
            </button>
          </div>
        </form>

        {/* Mobile Filter Toggle */}
        <div className="lg:hidden flex items-center justify-between mb-4">
          <button
            onClick={() => setShowMobileFilters(!showMobileFilters)}
            className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-all"
          >
            <FiSliders />
            <span className="font-medium">Filters</span>
            {getActiveFiltersCount() > 0 && (
              <span className="bg-blue-600 text-white text-xs px-2 py-0.5 rounded-full">
                {getActiveFiltersCount()}
              </span>
            )}
          </button>
          <span className="text-sm text-gray-500">{!loading ? `${jobs.length} jobs found` : 'Loading...'}</span>
        </div>

        {/* Main Content - Flex Layout */}
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Left Side - Filters */}
          <div className={`lg:w-72 flex-shrink-0 ${showMobileFilters ? 'block' : 'hidden lg:block'}`}>
            <div className="lg:sticky lg:top-8">
              <div className="bg-white border border-gray-200 rounded-xl p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <FiFilter className="text-blue-600" />
                    <h3 className="font-semibold text-gray-800">Filters</h3>
                    {getActiveFiltersCount() > 0 && (
                      <span className="bg-blue-100 text-blue-600 text-xs px-2 py-0.5 rounded-full">
                        {getActiveFiltersCount()}
                      </span>
                    )}
                  </div>
                  {getActiveFiltersCount() > 0 && (
                    <button
                      onClick={clearFilters}
                      className="text-sm text-blue-600 hover:text-blue-700 font-medium"
                    >
                      Clear All
                    </button>
                  )}
                </div>

                {/* Job Type */}
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Job Type</label>
                  <select
                    value={filters.type}
                    onChange={(e) => handleFilterChange('type', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none bg-white text-sm"
                  >
                    <option value="">All Types</option>
                    {jobTypes.map(type => (
                      <option key={type} value={type.toLowerCase()}>{type}</option>
                    ))}
                  </select>
                </div>

                {/* Category */}
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Category</label>
                  <select
                    value={filters.category}
                    onChange={(e) => handleFilterChange('category', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none bg-white text-sm"
                  >
                    <option value="">All Categories</option>
                    {categories.map(category => (
                      <option key={category} value={category}>{category}</option>
                    ))}
                  </select>
                </div>

                {/* Experience Level */}
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Experience Level</label>
                  <select
                    value={filters.experienceLevel}
                    onChange={(e) => handleFilterChange('experienceLevel', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none bg-white text-sm"
                  >
                    <option value="">All Levels</option>
                    {experienceLevels.map(level => (
                      <option key={level} value={level.toLowerCase()}>{level}</option>
                    ))}
                  </select>
                </div>

                {/* Salary Range */}
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Salary Range</label>
                  <div className="flex gap-2">
                    <div className="relative flex-1">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <FiDollarSign className="text-gray-400 text-sm" />
                      </div>
                      <input
                        type="number"
                        placeholder="Min"
                        value={filters.minSalary}
                        onChange={(e) => handleFilterChange('minSalary', e.target.value)}
                        className="w-full pl-7 pr-2 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none text-sm"
                      />
                    </div>
                    <div className="relative flex-1">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <FiDollarSign className="text-gray-400 text-sm" />
                      </div>
                      <input
                        type="number"
                        placeholder="Max"
                        value={filters.maxSalary}
                        onChange={(e) => handleFilterChange('maxSalary', e.target.value)}
                        className="w-full pl-7 pr-2 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none text-sm"
                      />
                    </div>
                  </div>
                </div>

                {/* Remote */}
                <div className="mb-4">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={filters.remote}
                      onChange={(e) => handleFilterChange('remote', e.target.checked)}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded cursor-pointer"
                    />
                    <span className="text-sm font-medium text-gray-700">Remote Only</span>
                  </label>
                </div>

                {/* Apply Filters Button (Mobile) */}
                <button
                  onClick={() => setShowMobileFilters(false)}
                  className="w-full lg:hidden bg-blue-600 text-white py-2.5 rounded-lg font-medium hover:bg-blue-700 transition-all"
                >
                  Apply Filters
                </button>
              </div>
            </div>
          </div>

          {/* Right Side - Job Listings */}
          <div className="flex-1">
            {/* Results count */}
            <div className="hidden lg:flex items-center justify-between mb-4">
              <span className="text-sm text-gray-500">
                {loading ? 'Loading...' : `${jobs.length} jobs found`}
              </span>
            </div>

            {loading ? (
              // Show skeleton cards while loading
              <div className="space-y-4">
                <JobCardSkeleton />
                <JobCardSkeleton />
                <JobCardSkeleton />
                <JobCardSkeleton />
                <JobCardSkeleton />
              </div>
            ) : (
              <>
                {jobs.length === 0 ? (
                  <div className="bg-white border border-gray-200 rounded-xl p-12 text-center">
                    <FiBriefcase className="text-5xl text-gray-300 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-gray-800 mb-2">No jobs found</h3>
                    <p className="text-gray-500">Try adjusting your filters or search terms</p>
                    <button
                      onClick={clearFilters}
                      className="mt-4 text-blue-600 hover:text-blue-700 font-medium"
                    >
                      Clear all filters
                    </button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {jobs.map((job) => (
                      <div key={job._id} className="bg-white border border-gray-200 rounded-xl p-6 hover:border-blue-300 transition-all">
                        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                          <div className="flex-1 min-w-0">
                            <div className="flex items-start gap-3">
                              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center text-blue-600 font-bold text-sm flex-shrink-0">
                                {job.company?.charAt(0).toUpperCase()}
                              </div>
                              <div className="flex-1 min-w-0">
                                <Link to={`/jobs/${job._id}`} className="group">
                                  <h3 className="text-lg font-semibold text-gray-800 group-hover:text-blue-600 transition-colors">
                                    {job.title}
                                  </h3>
                                </Link>
                                <p className="text-gray-600 text-sm">{job.company}</p>
                              </div>
                            </div>
                            
                            <div className="flex flex-wrap items-center gap-3 mt-3 text-sm text-gray-500">
                              <span className="flex items-center">
                                <FiMapPin className="mr-1.5" size={14} />
                                {job.location}
                              </span>
                              <span className="flex items-center">
                                <FiBriefcase className="mr-1.5" size={14} />
                                {job.type}
                              </span>
                              {job.remote && (
                                <span className="bg-green-50 text-green-600 px-2 py-0.5 rounded-full text-xs font-medium">
                                  Remote
                                </span>
                              )}
                              <span className="flex items-center">
                                <FiClock className="mr-1.5" size={14} />
                                {new Date(job.createdAt).toLocaleDateString('en-US', { 
                                  month: 'short', 
                                  day: 'numeric' 
                                })}
                              </span>
                            </div>

                            <p className="mt-2 text-gray-600 text-sm line-clamp-2">{job.description}</p>
                            
                            {job.skills?.length > 0 && (
                              <div className="mt-3 flex flex-wrap gap-1.5">
                                {job.skills.slice(0, 4).map((skill, index) => (
                                  <span key={index} className="bg-gray-100 text-gray-600 px-2.5 py-0.5 rounded-full text-xs">
                                    {skill}
                                  </span>
                                ))}
                                {job.skills.length > 4 && (
                                  <span className="text-gray-400 text-xs">+{job.skills.length - 4} more</span>
                                )}
                              </div>
                            )}
                          </div>

                          <div className="flex flex-row md:flex-col items-center md:items-end gap-3 md:gap-2 flex-shrink-0">
                            {job.salary?.min && job.salary?.max && (
                              <div className="text-right">
                                <p className="text-sm font-semibold text-gray-800">
                                  ₹{job.salary.min.toLocaleString()} - ₹{job.salary.max.toLocaleString()}
                                </p>
                                <p className="text-xs text-gray-500">/ year</p>
                              </div>
                            )}
                            <Link
                              to={`/jobs/${job._id}`}
                              className="inline-flex items-center gap-1 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-all text-sm font-medium whitespace-nowrap"
                            >
                              View Details
                              <FiChevronRight size={16} />
                            </Link>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="flex items-center justify-between mt-6 pt-4 border-t border-gray-200">
                    <button
                      onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                      disabled={currentPage === 1}
                      className="px-4 py-2 border border-gray-200 rounded-lg disabled:opacity-50 hover:bg-gray-50 transition-all text-sm font-medium"
                    >
                      Previous
                    </button>
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-gray-600">
                        Page {currentPage} of {totalPages}
                      </span>
                    </div>
                    <button
                      onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                      disabled={currentPage === totalPages}
                      className="px-4 py-2 border border-gray-200 rounded-lg disabled:opacity-50 hover:bg-gray-50 transition-all text-sm font-medium"
                    >
                      Next
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default JobListings;