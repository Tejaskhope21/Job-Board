import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  FiUser, 
  FiMail, 
  FiLock, 
  FiBriefcase, 
  FiArrowRight,
  FiCheckCircle,
  FiUserPlus,
  FiShield
} from 'react-icons/fi';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'candidate'
  });
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (formData.password !== formData.confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }
    
    if (formData.password.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }
    
    setLoading(true);
    
    const { confirmPassword, ...registerData } = formData;
    const result = await register(registerData);
    
    if (result.success) {
      if (result.user?.role === 'employer') {
        navigate('/employer/dashboard');
      } else if (result.user?.role === 'admin') {
        navigate('/admin/dashboard');
      } else {
        navigate('/');
      }
    }
    
    setLoading(false);
  };

  // Animation variants
  const fadeInUp = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.5 }
  };

  const staggerContainer = {
    animate: {
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8" style={{ backgroundColor: '#fcfaf4' }}>
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-4xl"
      >
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-8 py-6">
            <h2 className="text-2xl font-bold text-white">
              Let's get you started
            </h2>
            <p className="text-blue-100 mt-1">
              Enter the details to get going
            </p>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="px-8 py-6">
              <motion.div 
                variants={staggerContainer}
                initial="initial"
                animate="animate"
                className="space-y-5"
              >
                {/* Full Name */}
                <motion.div variants={fadeInUp}>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Full Name <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FiUser className="text-gray-400 text-lg" />
                    </div>
                    <input
                      type="text"
                      name="name"
                      required
                      className="w-full pl-12 pr-4 py-3.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none text-base"
                      placeholder="Enter your full name"
                      value={formData.name}
                      onChange={handleChange}
                    />
                  </div>
                </motion.div>

                {/* Email */}
                <motion.div variants={fadeInUp}>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FiMail className="text-gray-400 text-lg" />
                    </div>
                    <input
                      type="email"
                      name="email"
                      required
                      className="w-full pl-12 pr-4 py-3.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none text-base"
                      placeholder="Enter your email address"
                      value={formData.email}
                      onChange={handleChange}
                    />
                  </div>
                </motion.div>

                {/* Password */}
                <motion.div variants={fadeInUp}>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Password <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FiLock className="text-gray-400 text-lg" />
                    </div>
                    <input
                      type={showPassword ? "text" : "password"}
                      name="password"
                      required
                      minLength="6"
                      className="w-full pl-12 pr-14 py-3.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none text-base"
                      placeholder="Min 6 characters"
                      value={formData.password}
                      onChange={handleChange}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-gray-600 text-xl"
                    >
                      {showPassword ? '👁️' : '👁️‍🗨️'}
                    </button>
                  </div>
                  <div className="mt-2 text-xs text-gray-500">
                    Must be at least 6 characters long
                  </div>
                </motion.div>

                {/* Confirm Password */}
                <motion.div variants={fadeInUp}>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Confirm Password <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FiLock className="text-gray-400 text-lg" />
                    </div>
                    <input
                      type={showConfirmPassword ? "text" : "password"}
                      name="confirmPassword"
                      required
                      className="w-full pl-12 pr-14 py-3.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none text-base"
                      placeholder="Confirm your password"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-gray-600 text-xl"
                    >
                      {showConfirmPassword ? '👁️' : '👁️‍🗨️'}
                    </button>
                  </div>
                </motion.div>

                {/* Role Selection */}
                <motion.div variants={fadeInUp}>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    I want to: <span className="text-red-500">*</span>
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <button
                      type="button"
                      onClick={() => setFormData({ ...formData, role: 'candidate' })}
                      className={`flex flex-col items-center justify-center p-6 border-2 rounded-xl transition-all ${
                        formData.role === 'candidate'
                          ? 'border-blue-500 bg-blue-50 text-blue-600 shadow-lg'
                          : 'border-gray-200 text-gray-600 hover:border-gray-300 hover:bg-gray-50'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <FiUser className={`text-3xl ${formData.role === 'candidate' ? 'text-blue-500' : 'text-gray-400'}`} />
                        <div className="text-left">
                          <span className="font-semibold text-lg block">Find Jobs</span>
                          <span className="text-sm text-gray-500">Job Seeker / Candidate</span>
                        </div>
                      </div>
                      {formData.role === 'candidate' && (
                        <FiCheckCircle className="absolute top-3 right-3 text-blue-500" size={20} />
                      )}
                    </button>
                    <button
                      type="button"
                      onClick={() => setFormData({ ...formData, role: 'employer' })}
                      className={`flex flex-col items-center justify-center p-6 border-2 rounded-xl transition-all relative ${
                        formData.role === 'employer'
                          ? 'border-blue-500 bg-blue-50 text-blue-600 shadow-lg'
                          : 'border-gray-200 text-gray-600 hover:border-gray-300 hover:bg-gray-50'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <FiBriefcase className={`text-3xl ${formData.role === 'employer' ? 'text-blue-500' : 'text-gray-400'}`} />
                        <div className="text-left">
                          <span className="font-semibold text-lg block">Post Jobs</span>
                          <span className="text-sm text-gray-500">Employer / Company</span>
                        </div>
                      </div>
                      {formData.role === 'employer' && (
                        <FiCheckCircle className="absolute top-3 right-3 text-blue-500" size={20} />
                      )}
                    </button>
                  </div>
                </motion.div>

                {/* Terms and Conditions */}
                <motion.div variants={fadeInUp} className="flex items-start pt-2">
                  <input
                    id="terms"
                    type="checkbox"
                    required
                    className="h-5 w-5 text-blue-600 focus:ring-blue-500 border-gray-300 rounded mt-0.5 cursor-pointer"
                  />
                  <label htmlFor="terms" className="ml-3 text-sm text-gray-600">
                    I agree to the{' '}
                    <Link to="/terms" className="text-blue-600 hover:text-blue-700 font-medium">
                      Terms of Service
                    </Link>
                    {' '}and{' '}
                    <Link to="/privacy" className="text-blue-600 hover:text-blue-700 font-medium">
                      Privacy Policy
                    </Link>
                  </label>
                </motion.div>

                {/* Submit Button */}
                <motion.div variants={fadeInUp}>
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full flex items-center justify-center py-4 px-6 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl font-semibold text-lg hover:shadow-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed group"
                  >
                    {loading ? (
                      <>
                        <svg className="animate-spin -ml-1 mr-3 h-6 w-6 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Creating Account...
                      </>
                    ) : (
                      <>
                        Create Account
                        <FiArrowRight className="ml-3 group-hover:translate-x-1 transition-transform" size={20} />
                      </>
                    )}
                  </button>
                </motion.div>
              </motion.div>
            </div>

            {/* Divider */}
            <div className="px-8 pb-2">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-200"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-6 bg-white text-gray-500">
                    Already have an account?
                  </span>
                </div>
              </div>
            </div>

            {/* Login Link */}
            <div className="px-8 pb-8">
              <Link
                to="/login"
                className="flex items-center justify-center w-full py-3.5 px-6 border-2 border-gray-200 text-gray-700 rounded-xl font-medium hover:bg-gray-50 hover:border-gray-300 transition-all text-base"
              >
                <FiArrowRight className="mr-2 rotate-180" size={18} />
                Sign in to your account
              </Link>
            </div>
          </form>
        </div>
      </motion.div>
    </div>
  );
};

export default Register;