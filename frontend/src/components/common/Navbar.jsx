import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { 
  FiUser, 
  FiLogOut, 
  FiBriefcase, 
  FiUsers, 
  FiHome,
  FiMenu,
  FiX,
  FiChevronDown,
  FiUserPlus,
  FiLogIn,
  FiLayout,
  FiSettings,
  FiUserCheck,
  FiList,
  FiPlusCircle,
  FiUpload,
  FiFileText,
  FiTrendingUp,
  FiCheckCircle,
  FiAlertCircle,
  FiBarChart2
} from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';
import logo from '../../../public/logo.png';

const Navbar = () => {
  const { user, logout, isAuthenticated, isAdmin, isEmployer, isCandidate } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/');
    setIsMenuOpen(false);
    setIsDropdownOpen(false);
  };

  const getDashboardLink = () => {
    if (isAdmin) return '/admin/dashboard';
    if (isEmployer) return '/employer/dashboard';
    if (isCandidate) return '/candidate/dashboard';
    return '#';
  };

  const getDashboardLabel = () => {
    if (isAdmin) return 'Admin Dashboard';
    if (isEmployer) return 'Employer Dashboard';
    if (isCandidate) return 'My Dashboard';
    return 'Dashboard';
  };

  const getDashboardIcon = () => {
    if (isAdmin) return <FiUsers className="mr-2" />;
    if (isEmployer) return <FiBriefcase className="mr-2" />;
    if (isCandidate) return <FiUserCheck className="mr-2" />;
    return <FiLayout className="mr-2" />;
  };

  const getRoleBadge = () => {
    if (isAdmin) return { label: 'Admin', color: 'bg-purple-100 text-purple-700' };
    if (isEmployer) return { label: 'Employer', color: 'bg-blue-100 text-blue-700' };
    if (isCandidate) return { label: 'Candidate', color: 'bg-green-100 text-green-700' };
    return null;
  };

  const isActiveRoute = (path) => {
    if (path === '/') return location.pathname === '/';
    return location.pathname.startsWith(path);
  };

  // Base nav links for all users
  const baseNavLinks = [
    { path: '/', label: 'Home', icon: <FiHome className="mr-1" /> },
    { path: '/jobs', label: 'Jobs', icon: <FiBriefcase className="mr-1" /> },
  ];

  // Add role-specific links
  const roleLinks = [];
  
  if (isAuthenticated && isEmployer) {
    roleLinks.push(
      { path: '/employer/post-job', label: 'Post Job', icon: <FiPlusCircle className="mr-1" /> },
      { path: '/employer/my-jobs', label: 'My Jobs', icon: <FiList className="mr-1" /> }
    );
  }

  if (isAuthenticated && isCandidate) {
    roleLinks.push(
      { path: '/candidate/applications', label: 'My Applications', icon: <FiList className="mr-1" /> },
      { path: '/candidate/matched-jobs', label: 'Matched Jobs', icon: <FiTrendingUp className="mr-1" /> },
      { path: '/candidate/ats-check', label: 'ATS Check', icon: <FiBarChart2 className="mr-1" /> }
    );
  }

  // Build full nav links
  const navLinks = [...baseNavLinks];
  
  // Add dashboard link if authenticated
  if (isAuthenticated) {
    const dashboardPath = getDashboardLink();
    if (dashboardPath !== '#') {
      navLinks.push({
        path: dashboardPath,
        label: getDashboardLabel(),
        icon: getDashboardIcon()
      });
    }
  }
  
  // Add role-specific links
  navLinks.push(...roleLinks);

  const roleBadge = getRoleBadge();

  // Check if user has resume uploaded
  const hasResume = user?.resume || user?.resumeUrl;

  return (
    <>
      <nav 
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled 
            ? 'bg-[#fcfaf4]/95 backdrop-blur-md shadow-lg' 
            : 'bg-[#fcfaf4] shadow-sm'
        }`}
      >
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center h-16 md:h-20">
            {/* Logo */}
            <Link 
              to="/" 
              className="flex items-center"
              onClick={() => setIsMenuOpen(false)}
            >
              <div className="w-20 h-20 flex items-center justify-center">
                <img 
                  src={logo} 
                  alt="JobBoard Logo" 
                  className="w-full h-full object-contain"
                />
              </div>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-1">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`flex items-center px-4 py-2 rounded-lg transition-all duration-200 ${
                    isActiveRoute(link.path)
                      ? 'bg-blue-50/80 text-blue-600 font-semibold'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100/50'
                  }`}
                >
                  {link.icon}
                  <span>{link.label}</span>
                </Link>
              ))}

              {isAuthenticated ? (
                <div className="relative ml-2">
                  <button
                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                    className="flex items-center space-x-2 px-3 py-2 rounded-lg hover:bg-gray-100/50 transition-colors border-2 border-transparent hover:border-gray-200"
                  >
                    <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-400 to-blue-600 flex items-center justify-center text-white font-semibold text-sm">
                      {user?.name?.charAt(0).toUpperCase() || 'U'}
                    </div>
                    <span className="text-gray-700 font-medium max-w-[100px] truncate">
                      {user?.name}
                    </span>
                    <FiChevronDown className={`text-gray-400 transition-transform duration-200 ${isDropdownOpen ? 'rotate-180' : ''}`} />
                  </button>

                  <AnimatePresence>
                    {isDropdownOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: -10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -10, scale: 0.95 }}
                        transition={{ duration: 0.2 }}
                        className="absolute right-0 mt-2 w-80 bg-[#fcfaf4] rounded-xl shadow-2xl border border-gray-100 overflow-hidden"
                      >
                        <div className="p-4 border-b border-gray-100">
                          <div className="flex items-center space-x-3">
                            <div className="w-12 h-12 rounded-full bg-gradient-to-r from-blue-400 to-blue-600 flex items-center justify-center text-white font-bold text-lg">
                              {user?.name?.charAt(0).toUpperCase() || 'U'}
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="font-semibold text-gray-800 truncate">
                                {user?.name}
                              </p>
                              <p className="text-sm text-gray-500 truncate">
                                {user?.email}
                              </p>
                              {roleBadge && (
                                <span className={`inline-block text-xs px-2 py-0.5 rounded-full mt-1 ${roleBadge.color}`}>
                                  {roleBadge.label}
                                </span>
                              )}
                            </div>
                          </div>
                          {/* Resume Status */}
                          {isCandidate && (
                            <div className="mt-2 flex items-center gap-2 text-xs">
                              {hasResume ? (
                                <>
                                  <FiCheckCircle className="text-green-500" size={14} />
                                  <span className="text-green-600">Resume uploaded</span>
                                </>
                              ) : (
                                <>
                                  <FiAlertCircle className="text-yellow-500" size={14} />
                                  <span className="text-yellow-600">No resume uploaded</span>
                                </>
                              )}
                            </div>
                          )}
                        </div>

                        <div className="py-1">
                          {/* Dashboard link in dropdown */}
                          {isAuthenticated && getDashboardLink() !== '#' && (
                            <Link
                              to={getDashboardLink()}
                              onClick={() => setIsDropdownOpen(false)}
                              className="flex items-center px-4 py-2.5 text-gray-700 hover:bg-gray-100/50 transition-colors"
                            >
                              <span className="w-8 flex justify-center text-gray-400">
                                {getDashboardIcon()}
                              </span>
                              <span>{getDashboardLabel()}</span>
                            </Link>
                          )}

                          {/* Role-specific links in dropdown */}
                          {isEmployer && (
                            <>
                              <Link
                                to="/employer/post-job"
                                onClick={() => setIsDropdownOpen(false)}
                                className="flex items-center px-4 py-2.5 text-gray-700 hover:bg-gray-100/50 transition-colors"
                              >
                                <span className="w-8 flex justify-center text-gray-400">
                                  <FiPlusCircle />
                                </span>
                                <span>Post a Job</span>
                              </Link>
                              <Link
                                to="/employer/my-jobs"
                                onClick={() => setIsDropdownOpen(false)}
                                className="flex items-center px-4 py-2.5 text-gray-700 hover:bg-gray-100/50 transition-colors"
                              >
                                <span className="w-8 flex justify-center text-gray-400">
                                  <FiList />
                                </span>
                                <span>My Jobs</span>
                              </Link>
                            </>
                          )}

                          {isCandidate && (
                            <>
                              <Link
                                to="/candidate/applications"
                                onClick={() => setIsDropdownOpen(false)}
                                className="flex items-center px-4 py-2.5 text-gray-700 hover:bg-gray-100/50 transition-colors"
                              >
                                <span className="w-8 flex justify-center text-gray-400">
                                  <FiList />
                                </span>
                                <span>My Applications</span>
                              </Link>
                              <Link
                                to="/candidate/matched-jobs"
                                onClick={() => setIsDropdownOpen(false)}
                                className="flex items-center px-4 py-2.5 text-gray-700 hover:bg-gray-100/50 transition-colors"
                              >
                                <span className="w-8 flex justify-center text-gray-400">
                                  <FiTrendingUp />
                                </span>
                                <span>Matched Jobs</span>
                              </Link>
                              <Link
                                to="/candidate/ats-check"
                                onClick={() => setIsDropdownOpen(false)}
                                className="flex items-center px-4 py-2.5 text-gray-700 hover:bg-gray-100/50 transition-colors"
                              >
                                <span className="w-8 flex justify-center text-gray-400">
                                  <FiBarChart2 />
                                </span>
                                <span>ATS Check</span>
                              </Link>
                              <Link
                                to="/candidate/resume"
                                onClick={() => setIsDropdownOpen(false)}
                                className="flex items-center px-4 py-2.5 text-gray-700 hover:bg-gray-100/50 transition-colors"
                              >
                                <span className="w-8 flex justify-center text-gray-400">
                                  <FiUpload />
                                </span>
                                <span>My Resume</span>
                                {!hasResume && (
                                  <span className="ml-auto text-xs bg-red-100 text-red-600 px-2 py-0.5 rounded-full">
                                    Upload
                                  </span>
                                )}
                              </Link>
                            </>
                          )}

                          <Link
                            to="/profile"
                            onClick={() => setIsDropdownOpen(false)}
                            className="flex items-center px-4 py-2.5 text-gray-700 hover:bg-gray-100/50 transition-colors"
                          >
                            <span className="w-8 flex justify-center text-gray-400">
                              <FiSettings />
                            </span>
                            <span>Profile Settings</span>
                          </Link>
                        </div>

                        <div className="border-t border-gray-100 py-1">
                          <button
                            onClick={handleLogout}
                            className="w-full flex items-center px-4 py-2.5 text-red-600 hover:bg-red-50 transition-colors"
                          >
                            <span className="w-8 flex justify-center">
                              <FiLogOut />
                            </span>
                            <span>Logout</span>
                          </button>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ) : (
                <div className="flex items-center space-x-2 ml-2">
                  <Link
                    to="/login"
                    className="flex items-center px-4 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100/50 rounded-lg transition-colors"
                  >
                    <FiLogIn className="mr-1" />
                    Login
                  </Link>
                  <Link
                    to="/register"
                    className="flex items-center px-5 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg font-semibold hover:shadow-lg transition-all duration-200 hover:scale-105"
                  >
                    <FiUserPlus className="mr-1" />
                    Register
                  </Link>
                </div>
              )}
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden p-2 rounded-lg hover:bg-gray-100/50 transition-colors"
            >
              {isMenuOpen ? <FiX size={24} /> : <FiMenu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="md:hidden bg-[#fcfaf4] border-t border-gray-100 overflow-hidden"
            >
              <div className="container mx-auto px-4 py-4">
                <div className="space-y-1">
                  {navLinks.map((link) => (
                    <Link
                      key={link.path}
                      to={link.path}
                      onClick={() => setIsMenuOpen(false)}
                      className={`flex items-center px-4 py-3 rounded-lg transition-colors ${
                        isActiveRoute(link.path)
                          ? 'bg-blue-50/80 text-blue-600 font-semibold'
                          : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100/50'
                      }`}
                    >
                      <span className="w-6 flex justify-center">{link.icon}</span>
                      <span className="ml-3">{link.label}</span>
                    </Link>
                  ))}

                  {isAuthenticated ? (
                    <>
                      <div className="border-t border-gray-100 my-2"></div>
                      <div className="px-4 py-3 bg-gray-100/50 rounded-lg">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-400 to-blue-600 flex items-center justify-center text-white font-bold">
                            {user?.name?.charAt(0).toUpperCase() || 'U'}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="font-semibold text-gray-800 truncate">
                              {user?.name}
                            </p>
                            <p className="text-sm text-gray-500 truncate">
                              {user?.email}
                            </p>
                            {roleBadge && (
                              <span className={`inline-block text-xs px-2 py-0.5 rounded-full mt-1 ${roleBadge.color}`}>
                                {roleBadge.label}
                              </span>
                            )}
                            {isCandidate && (
                              <div className="mt-1 flex items-center gap-1 text-xs">
                                {hasResume ? (
                                  <>
                                    <FiCheckCircle className="text-green-500" size={12} />
                                    <span className="text-green-600">Resume uploaded</span>
                                  </>
                                ) : (
                                  <>
                                    <FiAlertCircle className="text-yellow-500" size={12} />
                                    <span className="text-yellow-600">No resume</span>
                                  </>
                                )}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                      
                      {isCandidate && (
                        <>
                          <Link
                            to="/candidate/ats-check"
                            onClick={() => setIsMenuOpen(false)}
                            className="flex items-center px-4 py-3 text-gray-600 hover:text-gray-900 hover:bg-gray-100/50 rounded-lg transition-colors"
                          >
                            <span className="w-6 flex justify-center"><FiBarChart2 /></span>
                            <span className="ml-3">ATS Check</span>
                          </Link>
                          <Link
                            to="/candidate/resume"
                            onClick={() => setIsMenuOpen(false)}
                            className="flex items-center px-4 py-3 text-gray-600 hover:text-gray-900 hover:bg-gray-100/50 rounded-lg transition-colors"
                          >
                            <span className="w-6 flex justify-center"><FiUpload /></span>
                            <span className="ml-3">My Resume</span>
                            {!hasResume && (
                              <span className="ml-auto text-xs bg-red-100 text-red-600 px-2 py-0.5 rounded-full">
                                Upload
                              </span>
                            )}
                          </Link>
                        </>
                      )}

                      <Link
                        to="/profile"
                        onClick={() => setIsMenuOpen(false)}
                        className="flex items-center px-4 py-3 text-gray-600 hover:text-gray-900 hover:bg-gray-100/50 rounded-lg transition-colors"
                      >
                        <span className="w-6 flex justify-center"><FiSettings /></span>
                        <span className="ml-3">Profile Settings</span>
                      </Link>
                      
                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center px-4 py-3 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      >
                        <span className="w-6 flex justify-center"><FiLogOut /></span>
                        <span className="ml-3">Logout</span>
                      </button>
                    </>
                  ) : (
                    <div className="space-y-2 pt-2">
                      <Link
                        to="/login"
                        onClick={() => setIsMenuOpen(false)}
                        className="flex items-center justify-center px-4 py-3 border-2 border-gray-200 text-gray-600 rounded-lg hover:bg-gray-100/50 transition-colors"
                      >
                        <FiLogIn className="mr-2" />
                        Login
                      </Link>
                      <Link
                        to="/register"
                        onClick={() => setIsMenuOpen(false)}
                        className="flex items-center justify-center px-4 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg font-semibold hover:shadow-lg transition-all"
                      >
                        <FiUserPlus className="mr-2" />
                        Register
                      </Link>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      {/* Spacer to prevent content from hiding behind fixed navbar */}
      <div className="h-16 md:h-20"></div>
    </>
  );
};

export default Navbar;