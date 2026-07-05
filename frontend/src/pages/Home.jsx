import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from '../utils/axiosConfig';
import { 
  FiBriefcase, 
  FiUsers, 
  FiAward, 
  FiClock, 
  FiMapPin, 
  FiSearch, 
  FiArrowRight,
  FiTrendingUp,
  FiStar,
  FiBookmark,
  FiShare2,
  FiChevronRight,
  FiChevronLeft,
  FiBarChart2,
  FiFileText,
  FiCheckCircle,
  FiUpload,
  FiPercent,
  FiTarget,
  FiZap,
  FiShield,
  FiArrowLeft,
  FiGlobe,
  FiCpu,
  FiLayers,
  FiDatabase,
  FiCloud,
  FiCode,
  FiSmartphone,
  FiMonitor,
  FiServer,
  FiTrendingUp as FiTrend,
  FiAward as FiAwardIcon,
  FiUsers as FiUsersIcon,
  FiMic,
  FiVideo,
  FiMessageCircle,
  FiMail,
  FiThumbsUp,
  FiAward as FiBadge,
  FiUsers as FiPeople,
  FiBriefcase as FiJob,
  FiBarChart as FiChart,
  FiUserCheck,
  FiTrendingUp as FiGrowth
} from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

const Home = () => {
  const { user, isAuthenticated, isCandidate } = useAuth();
  const navigate = useNavigate();
  const [featuredJobs, setFeaturedJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentSlide, setCurrentSlide] = useState(0);
  const [savedJobs, setSavedJobs] = useState([]);
  const [searchLocation, setSearchLocation] = useState('');
  const [searchType, setSearchType] = useState('');
  const statsRef = useRef(null);
  const videoRef = useRef(null);

  const testimonials = [
    {
      id: 1,
      name: "Sarah Johnson",
      role: "Software Engineer",
      company: "Google",
      text: "This platform helped me find my dream job at Google. The process was seamless and efficient.",
      image: "https://ui-avatars.com/api/?name=Sarah+Johnson&background=random"
    },
    {
      id: 2,
      name: "Michael Chen",
      role: "Product Manager",
      company: "Microsoft",
      text: "I've used many job platforms, but this one stands out with its user-friendly interface and great opportunities.",
      image: "https://ui-avatars.com/api/?name=Michael+Chen&background=random"
    },
    {
      id: 3,
      name: "Emily Rodriguez",
      role: "UX Designer",
      company: "Apple",
      text: "The job recommendations were spot on. I found my current position within two weeks of joining.",
      image: "https://ui-avatars.com/api/?name=Emily+Rodriguez&background=random"
    }
  ];

  const features = [
    {
      icon: FiBarChart2,
      title: "ATS Score Checker",
      description: "Analyze your resume against Applicant Tracking Systems and get a detailed score with improvement suggestions.",
      color: "blue",
      link: "/candidate/ats-check",
      benefits: ["Keyword matching", "Format analysis", "Section scoring"],
      bgGradient: "from-blue-50 to-blue-100/50",
      borderColor: "border-blue-200",
      iconBg: "bg-blue-100 text-blue-600",
      buttonBg: "bg-blue-600 hover:bg-blue-700",
      detailedDescription: "Our advanced AI analyzes your resume against thousands of ATS patterns to provide a comprehensive score across multiple dimensions.",
      stat: "95% Accuracy"
    },
    {
      icon: FiTarget,
      title: "Smart Job Matching",
      description: "Find jobs that perfectly match your skills, experience, and career goals with our AI-powered matching engine.",
      color: "green",
      link: "/candidate/matched-jobs",
      benefits: ["Skill-based matching", "Experience alignment", "Career path suggestions"],
      bgGradient: "from-green-50 to-green-100/50",
      borderColor: "border-green-200",
      iconBg: "bg-green-100 text-green-600",
      buttonBg: "bg-green-600 hover:bg-green-700",
      detailedDescription: "Our intelligent matching algorithm considers your unique skills, work experience, and career aspirations to find the perfect opportunities.",
      stat: "10,000+ Matches"
    },
    {
      icon: FiFileText,
      title: "Resume Optimization",
      description: "Get personalized recommendations to optimize your resume for better ATS performance and higher visibility.",
      color: "purple",
      link: "/candidate/resume",
      benefits: ["Content improvement", "Keyword optimization", "Format enhancement"],
      bgGradient: "from-purple-50 to-purple-100/50",
      borderColor: "border-purple-200",
      iconBg: "bg-purple-100 text-purple-600",
      buttonBg: "bg-purple-600 hover:bg-purple-700",
      detailedDescription: "Receive actionable insights to transform your resume into a compelling document that passes through ATS filters with flying colors.",
      stat: "80% Higher Response"
    }
  ];

  const employerFeatures = [
    {
      icon: FiZap,
      title: "AI-Powered Job Posting",
      description: "Create optimized job postings with AI assistance that attract the right candidates faster.",
      benefits: ["Smart job descriptions", "Candidate matching", "Analytics dashboard"],
      color: "orange"
    },
    {
      icon: FiUsers,
      title: "Smart Talent Sourcing",
      description: "Discover qualified candidates through AI-powered matching and advanced filtering.",
      benefits: ["Skill-based search", "Automated screening", "Interview scheduling"],
      color: "blue"
    },
    {
      icon: FiBarChart2,
      title: "Real-Time Analytics",
      description: "Track your job postings performance with detailed insights and candidate engagement metrics.",
      benefits: ["Application tracking", "Candidate quality scoring", "Time-to-hire metrics"],
      color: "green"
    }
  ];

  const steps = [
    {
      icon: FiUpload,
      title: "Upload Your Resume",
      description: "Upload your resume in PDF or DOC format to get started with the analysis.",
      color: "blue",
      detail: "Supports all major file formats"
    },
    {
      icon: FiBarChart2,
      title: "Get ATS Score",
      description: "Receive a detailed ATS score with breakdown of keywords, format, and content analysis.",
      color: "purple",
      detail: "Comprehensive 360° analysis"
    },
    {
      icon: FiTarget,
      title: "Find Matching Jobs",
      description: "Discover job opportunities that match your skills and experience perfectly.",
      color: "green",
      detail: "AI-powered recommendations"
    },
    {
      icon: FiCheckCircle,
      title: "Apply with Confidence",
      description: "Apply to jobs with a resume that's optimized for ATS and stands out to recruiters.",
      color: "orange",
      detail: "Track your applications"
    }
  ];

  const stats = [
    { icon: FiUsersIcon, number: "50,000+", label: "Active Users" },
    { icon: FiBriefcase, number: "10,000+", label: "Job Listings" },
    { icon: FiAwardIcon, number: "5,000+", label: "Companies" },
    { icon: FiTrend, number: "95%", label: "Success Rate" }
  ];

  useEffect(() => {
    fetchFeaturedJobs();
  }, []);

  const fetchFeaturedJobs = async () => {
    try {
      const response = await axios.get('/api/jobs?limit=6');
      setFeaturedJobs(response.data.jobs || []);
    } catch (error) {
      console.error('Error fetching featured jobs:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (searchTerm) params.append('search', searchTerm);
    if (searchLocation) params.append('location', searchLocation);
    if (searchType) params.append('type', searchType);
    navigate(`/jobs?${params.toString()}`);
    toast.success(`Searching for: ${searchTerm || 'all jobs'}`);
  };

  const toggleSaveJob = (jobId) => {
    setSavedJobs(prev => 
      prev.includes(jobId) 
        ? prev.filter(id => id !== jobId)
        : [...prev, jobId]
    );
  };

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % testimonials.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  const fadeInUp = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6 }
  };

  const staggerContainer = {
    animate: {
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const JobCardSkeleton = () => (
    <div className="bg-white rounded-xl shadow-md p-5 md:p-6 relative animate-pulse">
      <div className="flex justify-between items-start mb-3">
        <div className="flex-1">
          <div className="h-6 bg-gray-200 rounded w-3/4 mb-2"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2"></div>
        </div>
        <div className="w-5 h-5 bg-gray-200 rounded"></div>
      </div>
      <div className="flex items-center mb-2">
        <div className="w-4 h-4 bg-gray-200 rounded mr-2"></div>
        <div className="h-4 bg-gray-200 rounded w-1/3"></div>
      </div>
      <div className="flex flex-wrap gap-2 mb-3">
        <div className="h-6 bg-gray-200 rounded-full w-16"></div>
        <div className="h-6 bg-gray-200 rounded-full w-20"></div>
      </div>
      <div className="space-y-2 mb-3">
        <div className="h-4 bg-gray-200 rounded w-full"></div>
        <div className="h-4 bg-gray-200 rounded w-3/4"></div>
      </div>
      <div className="flex justify-between items-center mt-3 pt-3 border-t border-gray-100">
        <div className="w-5 h-5 bg-gray-200 rounded"></div>
        <div className="h-4 bg-gray-200 rounded w-24"></div>
      </div>
    </div>
  );

  return (
    <div style={{ backgroundColor: '#fcfaf4' }}>
      {/* Hero Section */}
      <section className="relative overflow-hidden py-20 md:py-28 flex items-center min-h-[600px]">
        <div className="absolute inset-0 w-full h-full">
          <video
            ref={videoRef}
            autoPlay
            loop
            muted
            playsInline
            className="w-full h-full object-cover"
            poster="https://images.unsplash.com/photo-1521737604893-d14cc237f11d?w=1920"
          >
            <source 
              src="https://sample-videos.com/video321/mp4/720/big_buck_bunny_720p_1mb.mp4" 
              type="video/mp4" 
            />
            <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-blue-800"></div>
          </video>
          <div className="absolute inset-0 bg-black/60"></div>
        </div>
        
        <div className="container mx-auto px-4 relative z-10">
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center max-w-5xl mx-auto"
          >
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold mb-6 text-white leading-tight">
              Find Your <span className="text-blue-400">Dream Job</span> Today
            </h1>
            <p className="text-xl md:text-2xl text-gray-200 mb-8 max-w-3xl mx-auto">
              Discover thousands of job opportunities from top companies worldwide. Your next career move starts here.
            </p>
            
            <motion.form 
              onSubmit={handleSearch}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="max-w-4xl mx-auto mb-8"
            >
              <div className="flex flex-col md:flex-row gap-3 bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/20">
                <div className="flex-1 relative">
                  <FiSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-black-400" size={20} />
                  <input
                    type="text"
                    placeholder="Search jobs, companies, or keywords..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-12 pr-4 py-3.5 rounded-xl border border-black-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all bg-white/95 backdrop-blur-sm text-black-800 placeholder-black-400"
                  />
                </div>
                <div className="flex-1 relative">
                  <FiMapPin className="absolute left-4 top-1/2 transform -translate-y-1/2 text-black-400" size={20} />
                  <input
                    type="text"
                    placeholder="Location (e.g., New York)"
                    value={searchLocation}
                    onChange={(e) => setSearchLocation(e.target.value)}
                    className="w-full pl-12 pr-4 py-3.5 rounded-xl border border-black-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all bg-white/95 backdrop-blur-sm text-black-800 placeholder-black-400"
                  />
                </div>
                <div className="flex-1 relative">
                  <FiBriefcase className="absolute left-4 top-1/2 transform -translate-y-1/2 text-black-400" size={20} />
                  <select
                    value={searchType}
                    onChange={(e) => setSearchType(e.target.value)}
                    className="w-full pl-12 pr-4 py-3.5 rounded-xl border border-black-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all bg-white/95 backdrop-blur-sm text-black-800 appearance-none cursor-pointer"
                  >
                    <option value="">All Job Types</option>
                    <option value="full-time">Full Time</option>
                    <option value="part-time">Part Time</option>
                    <option value="contract">Contract</option>
                    <option value="internship">Internship</option>
                    <option value="remote">Remote</option>
                  </select>
                </div>
                <button
                  type="submit"
                  className="px-8 py-3.5 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition-all whitespace-nowrap shadow-lg hover:shadow-xl"
                >
                  <FiSearch className="inline mr-2" size={20} />
                  Search
                </button>
              </div>
            </motion.form>
            
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="flex flex-wrap justify-center gap-4"
            >
              <Link
                to="/jobs"
                className="inline-flex items-center bg-blue-600 text-white px-8 py-3.5 rounded-xl font-semibold hover:bg-blue-700 transition-all shadow-lg hover:shadow-xl"
              >
                Browse All Jobs <FiArrowRight className="ml-2" />
              </Link>
              <Link
                to="/register"
                className="inline-flex items-center bg-white/20 backdrop-blur-sm text-white px-8 py-3.5 rounded-xl font-semibold border-2 border-white/30 hover:bg-white/30 transition-all"
              >
                Post a Job
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ATS Score Checker Section */}
      <section className="py-20" style={{ backgroundColor: '#fcfaf4' }}>
        <div className="container mx-auto px-4 max-w-7xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-12"
          >
            <span className="text-blue-600 font-semibold text-sm uppercase tracking-wider">Featured Tool</span>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mt-3">
              ATS Score Checker
            </h2>
            <p className="text-lg text-gray-600 mt-4 max-w-3xl">
              Analyze your resume against Applicant Tracking Systems and get a detailed score with improvement suggestions.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="space-y-6"
            >
              <div className="bg-white rounded-2xl shadow-lg p-8 border border-blue-100">
                <div className="flex items-start gap-4">
                  <div className="p-3 rounded-full bg-blue-100 text-blue-600">
                    <FiBarChart2 className="text-2xl" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-800 mb-2">Why ATS Score Matters</h3>
                    <p className="text-gray-600">
                      Over 75% of resumes are rejected by ATS before reaching human eyes. Our checker ensures your resume passes through automated filters.
                    </p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {features[0].benefits.map((benefit, index) => (
                  <div key={index} className="bg-white rounded-xl shadow p-4 text-center border border-blue-50 hover:shadow-lg transition-all">
                    <FiCheckCircle className="text-blue-500 mx-auto mb-2" size={24} />
                    <p className="font-semibold text-gray-700">{benefit}</p>
                  </div>
                ))}
              </div>

              <div className="bg-gradient-to-r from-blue-50 to-blue-100/30 rounded-xl p-6 border border-blue-200">
                <div className="flex items-center gap-3 mb-2">
                  <FiZap className="text-blue-600" size={24} />
                  <span className="font-semibold text-blue-800">95% Accuracy Rate</span>
                </div>
                <p className="text-gray-700">{features[0].detailedDescription}</p>
              </div>

              <Link
                to={features[0].link}
                className="inline-flex items-center bg-blue-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-blue-700 transition-all"
              >
                Check Your ATS Score <FiArrowRight className="ml-2" />
              </Link>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="bg-white rounded-2xl shadow-xl p-8 border border-blue-100"
            >
              <div className="flex items-center justify-between mb-6">
                <h4 className="font-bold text-gray-800">Score Breakdown</h4>
                <span className="text-3xl font-bold text-blue-600">85%</span>
              </div>
              <div className="space-y-4">
                {[
                  { label: "Keyword Matching", score: 90, color: "blue" },
                  { label: "Format Analysis", score: 85, color: "green" },
                  { label: "Section Scoring", score: 78, color: "purple" },
                  { label: "Content Quality", score: 82, color: "orange" }
                ].map((item, index) => (
                  <div key={index}>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-gray-600">{item.label}</span>
                      <span className="font-semibold">{item.score}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2.5">
                      <div
                        className={`bg-${item.color}-600 h-2.5 rounded-full transition-all duration-1000`}
                        style={{ width: `${item.score}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Smart Job Matching Section */}
      <section className="py-20" style={{ backgroundColor: '#fcfaf4' }}>
        <div className="container mx-auto px-4 max-w-7xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-12 text-right"
          >
            <span className="text-green-600 font-semibold text-sm uppercase tracking-wider">Smart Technology</span>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mt-3">
              Smart Job Matching
            </h2>
            <p className="text-lg text-gray-600 mt-4 max-w-3xl ml-auto">
              Find jobs that perfectly match your skills, experience, and career goals with our AI-powered matching engine.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="order-2 lg:order-1"
            >
              <div className="bg-white rounded-2xl shadow-xl p-8 border border-green-100">
                <div className="flex items-center gap-3 mb-6">
                  <FiTarget className="text-green-600 text-2xl" />
                  <h4 className="font-bold text-gray-800">Your Perfect Match</h4>
                </div>
                <div className="space-y-4">
                  {[
                    { skill: "React.js", match: 95 },
                    { skill: "Node.js", match: 88 },
                    { skill: "TypeScript", match: 82 },
                    { skill: "AWS", match: 76 }
                  ].map((item, index) => (
                    <div key={index}>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-gray-600">{item.skill}</span>
                        <span className="font-semibold text-green-600">{item.match}% Match</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2.5">
                        <div
                          className="bg-green-600 h-2.5 rounded-full transition-all duration-1000"
                          style={{ width: `${item.match}%` }}
                        ></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="order-1 lg:order-2 space-y-6"
            >
              <div className="bg-white rounded-2xl shadow-lg p-8 border border-green-100">
                <div className="flex items-start gap-4">
                  <div className="p-3 rounded-full bg-green-100 text-green-600">
                    <FiTarget className="text-2xl" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-800 mb-2">AI-Powered Matching</h3>
                    <p className="text-gray-600">
                      Our intelligent algorithm considers your unique skills, work experience, and career aspirations to find the perfect opportunities.
                    </p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {features[1].benefits.map((benefit, index) => (
                  <div key={index} className="bg-white rounded-xl shadow p-4 text-center border border-green-50 hover:shadow-lg transition-all">
                    <FiCheckCircle className="text-green-500 mx-auto mb-2" size={24} />
                    <p className="font-semibold text-gray-700">{benefit}</p>
                  </div>
                ))}
              </div>

              <div className="bg-gradient-to-r from-green-50 to-green-100/30 rounded-xl p-6 border border-green-200">
                <div className="flex items-center gap-3 mb-2">
                  <FiUsers className="text-green-600" size={24} />
                  <span className="font-semibold text-green-800">10,000+ Successful Matches</span>
                </div>
                <p className="text-gray-700">{features[1].detailedDescription}</p>
              </div>

              <Link
                to={features[1].link}
                className="inline-flex items-center bg-green-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-green-700 transition-all"
              >
                Find Your Match <FiArrowRight className="ml-2" />
              </Link>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Resume Optimization Section */}
      <section className="py-20" style={{ backgroundColor: '#fcfaf4' }}>
        <div className="container mx-auto px-4 max-w-7xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-12"
          >
            <span className="text-purple-600 font-semibold text-sm uppercase tracking-wider">Optimization Tool</span>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mt-3">
              Resume Optimization
            </h2>
            <p className="text-lg text-gray-600 mt-4 max-w-3xl">
              Get personalized recommendations to optimize your resume for better ATS performance and higher visibility.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="space-y-6"
            >
              <div className="bg-white rounded-2xl shadow-lg p-8 border border-purple-100">
                <div className="flex items-start gap-4">
                  <div className="p-3 rounded-full bg-purple-100 text-purple-600">
                    <FiFileText className="text-2xl" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-800 mb-2">Smart Recommendations</h3>
                    <p className="text-gray-600">
                      Receive actionable insights to transform your resume into a compelling document that passes through ATS filters.
                    </p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {features[2].benefits.map((benefit, index) => (
                  <div key={index} className="bg-white rounded-xl shadow p-4 text-center border border-purple-50 hover:shadow-lg transition-all">
                    <FiCheckCircle className="text-purple-500 mx-auto mb-2" size={24} />
                    <p className="font-semibold text-gray-700">{benefit}</p>
                  </div>
                ))}
              </div>

              <div className="bg-gradient-to-r from-purple-50 to-purple-100/30 rounded-xl p-6 border border-purple-200">
                <div className="flex items-center gap-3 mb-2">
                  <FiTrendingUp className="text-purple-600" size={24} />
                  <span className="font-semibold text-purple-800">80% Higher Response Rate</span>
                </div>
                <p className="text-gray-700">{features[2].detailedDescription}</p>
              </div>

              <Link
                to={features[2].link}
                className="inline-flex items-center bg-purple-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-purple-700 transition-all"
              >
                Optimize Your Resume <FiArrowRight className="ml-2" />
              </Link>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="bg-white rounded-2xl shadow-xl p-8 border border-purple-100"
            >
              <div className="flex items-center justify-between mb-6">
                <h4 className="font-bold text-gray-800">Optimization Score</h4>
                <span className="text-3xl font-bold text-purple-600">92%</span>
              </div>
              <div className="space-y-4">
                {[
                  { label: "Content Quality", score: 94, color: "purple" },
                  { label: "Keyword Density", score: 88, color: "blue" },
                  { label: "Format Structure", score: 95, color: "green" },
                  { label: "Readability", score: 91, color: "orange" }
                ].map((item, index) => (
                  <div key={index}>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-gray-600">{item.label}</span>
                      <span className="font-semibold">{item.score}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2.5">
                      <div
                        className={`bg-${item.color}-600 h-2.5 rounded-full transition-all duration-1000`}
                        style={{ width: `${item.score}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-6 p-4 bg-purple-50 rounded-xl">
                <p className="text-sm text-purple-800">
                  <FiZap className="inline mr-2" />
                  Pro tip: Add more quantifiable achievements to improve your score further.
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20" style={{ backgroundColor: '#fcfaf4' }}>
        <div className="container mx-auto px-4 max-w-7xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <span className="text-blue-600 font-semibold text-sm uppercase tracking-wider">Simple Process</span>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mt-3">
              How It Works
            </h2>
            <p className="text-lg text-gray-600 mt-4 max-w-3xl mx-auto">
              Four simple steps to find your perfect job and start your career journey
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {steps.map((step, index) => {
              const Icon = step.icon;
              const colorMap = {
                blue: "bg-blue-100 text-blue-600 border-blue-200",
                purple: "bg-purple-100 text-purple-600 border-purple-200",
                green: "bg-green-100 text-green-600 border-green-200",
                orange: "bg-orange-100 text-orange-600 border-orange-200"
              };
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-white rounded-2xl shadow-lg p-6 text-center hover:shadow-2xl transition-all hover:-translate-y-1 border border-gray-100 relative"
                >
                  <div className="absolute -top-3 -right-3 bg-blue-600 text-white w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold shadow-lg">
                    {index + 1}
                  </div>
                  <div className={`w-16 h-16 rounded-full ${colorMap[step.color]} flex items-center justify-center mx-auto mb-4 border-2`}>
                    <Icon className="text-2xl" />
                  </div>
                  <h4 className="font-bold text-gray-800 text-lg mb-2">{step.title}</h4>
                  <p className="text-gray-600 text-sm mb-2">{step.description}</p>
                  <span className="text-xs text-blue-600 font-medium">{step.detail}</span>
                </motion.div>
              );
            })}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mt-16 text-center"
          >
            <Link
              to="/register"
              className="inline-flex items-center bg-blue-600 text-white px-8 py-4 rounded-xl font-semibold hover:bg-blue-700 transition-all text-lg shadow-lg hover:shadow-xl"
            >
              Get Started Now <FiArrowRight className="ml-2" size={22} />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Employer AI-Powered Job Posting Section */}
      <section className="py-20" style={{ backgroundColor: '#fcfaf4' }}>
        <div className="container mx-auto px-4 max-w-7xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <span className="text-orange-600 font-semibold text-sm uppercase tracking-wider">For Employers</span>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mt-3">
              AI-Powered Job Posting
            </h2>
            <p className="text-lg text-gray-600 mt-4 max-w-3xl mx-auto">
              Create optimized job postings with AI assistance that attract the right candidates faster
            </p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {employerFeatures.map((feature, index) => {
              const Icon = feature.icon;
              const colorMap = {
                orange: "bg-orange-100 text-orange-600 border-orange-200",
                blue: "bg-blue-100 text-blue-600 border-blue-200",
                green: "bg-green-100 text-green-600 border-green-200"
              };
              const bgMap = {
                orange: "from-orange-50 to-orange-100/30",
                blue: "from-blue-50 to-blue-100/30",
                green: "from-green-50 to-green-100/30"
              };
              const borderMap = {
                orange: "border-orange-200",
                blue: "border-blue-200",
                green: "border-green-200"
              };
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-all hover:-translate-y-1 border border-gray-100"
                >
                  <div className={`p-6 bg-gradient-to-br ${bgMap[feature.color]}`}>
                    <div className={`w-14 h-14 rounded-full ${colorMap[feature.color]} flex items-center justify-center mb-4 border-2`}>
                      <Icon className="text-2xl" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-800 mb-2">{feature.title}</h3>
                    <p className="text-gray-600">{feature.description}</p>
                  </div>
                  <div className="p-6 border-t border-gray-100">
                    <div className="space-y-2">
                      {feature.benefits.map((benefit, idx) => (
                        <div key={idx} className="flex items-center gap-2 text-gray-700">
                          <FiCheckCircle className={`text-${feature.color}-500 flex-shrink-0`} size={18} />
                          <span>{benefit}</span>
                        </div>
                      ))}
                    </div>
                    <Link
                      to="/employer/post-job"
                      className={`mt-4 inline-flex items-center bg-${feature.color}-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-${feature.color}-700 transition-all text-sm`}
                    >
                      Learn More <FiArrowRight className="ml-2" size={16} />
                    </Link>
                  </div>
                </motion.div>
              );
            })}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mt-12 text-center"
          >
            <Link
              to="/employer"
              className="inline-flex items-center bg-orange-600 text-white px-8 py-4 rounded-xl font-semibold hover:bg-orange-700 transition-all text-lg shadow-lg hover:shadow-xl"
            >
              Post a Job Now <FiArrowRight className="ml-2" size={22} />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16" style={{ backgroundColor: '#fcfaf4' }}>
        <div className="container mx-auto px-4">
          <motion.div 
            ref={statsRef}
            variants={staggerContainer}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8"
          >
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                variants={fadeInUp}
                className="bg-white rounded-2xl shadow-lg p-6 md:p-8 text-center hover:shadow-2xl transition-all hover:-translate-y-1"
              >
                <div className="inline-block p-3 md:p-4 rounded-full bg-blue-50 text-blue-600 mb-3 md:mb-4">
                  <stat.icon className="text-3xl md:text-4xl" />
                </div>
                <motion.h3 
                  className="text-3xl md:text-4xl font-bold text-gray-800"
                  initial={{ scale: 0 }}
                  whileInView={{ scale: 1 }}
                  transition={{ delay: 0.2 + index * 0.1 }}
                >
                  {stat.number}
                </motion.h3>
                <p className="text-base md:text-lg text-gray-600">{stat.label}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Featured Jobs */}
      <section className="py-16 md:py-20" style={{ backgroundColor: '#fcfaf4' }}>
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12 md:mb-16"
          >
            <span className="text-blue-600 font-semibold text-sm uppercase tracking-wider">Opportunities</span>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mt-3">Featured Jobs</h2>
            <p className="text-lg text-gray-600 mt-4 max-w-2xl mx-auto">
              Explore the most exciting opportunities from top companies around the world
            </p>
          </motion.div>
          
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
              <JobCardSkeleton />
              <JobCardSkeleton />
              <JobCardSkeleton />
              <JobCardSkeleton />
              <JobCardSkeleton />
              <JobCardSkeleton />
            </div>
          ) : (
            <motion.div 
              variants={staggerContainer}
              initial="initial"
              whileInView="animate"
              viewport={{ once: true }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8"
            >
              {featuredJobs.map((job, index) => (
                <motion.div
                  key={job._id}
                  variants={fadeInUp}
                  className="bg-white rounded-2xl shadow-md p-6 md:p-8 relative hover:shadow-2xl transition-all hover:-translate-y-1"
                >
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex-1">
                      <h3 className="text-xl md:text-2xl font-semibold text-gray-800 hover:text-blue-600 transition-colors">
                        <Link to={`/jobs/${job._id}`}>{job.title}</Link>
                      </h3>
                      <p className="text-gray-600 text-base md:text-lg">{job.company}</p>
                    </div>
                    <button
                      onClick={() => toggleSaveJob(job._id)}
                      className="text-gray-400 hover:text-red-500 transition-colors p-2 hover:bg-red-50 rounded-lg"
                    >
                      <FiBookmark className={savedJobs.includes(job._id) ? "fill-current text-red-500" : ""} size={22} />
                    </button>
                  </div>
                  
                  <div className="flex items-center text-gray-500 mb-3">
                    <FiMapPin className="mr-2 flex-shrink-0" size={18} />
                    <span className="text-base">{job.location}</span>
                  </div>
                  
                  <div className="flex flex-wrap gap-2 mb-4">
                    <span className="inline-block bg-blue-50 text-blue-600 px-4 py-1.5 rounded-full text-sm font-semibold">
                      {job.type}
                    </span>
                    {job.salary && (
                      <span className="inline-block bg-green-50 text-green-600 px-4 py-1.5 rounded-full text-sm font-semibold">
                        {job.salary
                          ? `${job.salary.currency} ${job.salary.min.toLocaleString()} - ${job.salary.max.toLocaleString()}`
                          : "Not disclosed"}
                      </span>
                    )}
                    {job.remote && (
                      <span className="inline-block bg-purple-50 text-purple-600 px-4 py-1.5 rounded-full text-sm font-semibold">
                        Remote
                      </span>
                    )}
                  </div>
                  
                  <p className="text-gray-600 text-base mb-4 line-clamp-2">
                    {job.description || "Great opportunity to join a dynamic team and grow your career."}
                  </p>
                  
                  <div className="flex justify-between items-center mt-4 pt-4 border-t border-gray-100">
                    <button className="text-gray-400 hover:text-blue-600 transition-colors p-2 hover:bg-blue-50 rounded-lg">
                      <FiShare2 size={20} />
                    </button>
                    <Link
                      to={`/jobs/${job._id}`}
                      className="inline-flex items-center text-blue-600 hover:text-blue-800 font-semibold text-base"
                    >
                      View Details <FiArrowRight className="ml-2" />
                    </Link>
                  </div>
                  
                  {job.featured && (
                    <div className="absolute -top-3 -right-3">
                      <div className="bg-gradient-to-r from-yellow-400 to-yellow-500 text-white text-sm font-bold px-4 py-1.5 rounded-full shadow-lg">
                        <FiStar className="inline mr-1" /> Featured
                      </div>
                    </div>
                  )}
                </motion.div>
              ))}
            </motion.div>
          )}
          
          <div className="text-center mt-12 md:mt-16">
            <Link
              to="/jobs"
              className="inline-flex items-center bg-blue-600 text-white px-8 md:px-10 py-4 md:py-5 rounded-xl font-semibold hover:bg-blue-700 transition-all text-lg shadow-lg hover:shadow-xl"
            >
              View All Jobs <FiChevronRight className="ml-2" size={22} />
            </Link>
          </div>
        </div>
      </section>

      {/* Testimonials Carousel */}
      <section className="py-16 md:py-20" style={{ backgroundColor: '#fcfaf4' }}>
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12 md:mb-16"
          >
            <span className="text-blue-600 font-semibold text-sm uppercase tracking-wider">Testimonials</span>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mt-3">What Our Users Say</h2>
          </motion.div>
          
          <div className="relative max-w-5xl mx-auto">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentSlide}
                initial={{ opacity: 0, x: 100 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -100 }}
                transition={{ duration: 0.5 }}
                className="bg-white rounded-2xl shadow-xl p-8 md:p-10"
              >
                <div className="flex flex-col md:flex-row items-center gap-6 md:gap-8">
                  <img
                    src={testimonials[currentSlide].image}
                    alt={testimonials[currentSlide].name}
                    className="w-24 h-24 md:w-28 md:h-28 rounded-full border-4 border-blue-100"
                  />
                  <div className="flex-1 text-center md:text-left">
                    <div className="flex items-center justify-center md:justify-start mb-3">
                      {[...Array(5)].map((_, i) => (
                        <FiStar key={i} className="text-yellow-400 fill-current" size={20} />
                      ))}
                    </div>
                    <p className="text-gray-700 text-lg md:text-xl mb-4 italic">
                      "{testimonials[currentSlide].text}"
                    </p>
                    <div>
                      <h4 className="font-semibold text-gray-900 text-lg">{testimonials[currentSlide].name}</h4>
                      <p className="text-gray-600 text-base">
                        {testimonials[currentSlide].role} at {testimonials[currentSlide].company}
                      </p>
                    </div>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
            
            <div className="flex justify-center gap-4 mt-8">
              <button
                onClick={prevSlide}
                className="p-3 bg-white rounded-full shadow-md hover:bg-gray-50 transition-colors hover:shadow-lg"
              >
                <FiChevronLeft size={28} />
              </button>
              <div className="flex gap-2">
                {testimonials.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentSlide(index)}
                    className={`w-4 h-4 rounded-full transition-all ${
                      currentSlide === index ? 'bg-blue-600 w-8' : 'bg-gray-300'
                    }`}
                  />
                ))}
              </div>
              <button
                onClick={nextSlide}
                className="p-3 bg-white rounded-full shadow-md hover:bg-gray-50 transition-colors hover:shadow-lg"
              >
                <FiChevronRight size={28} />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative py-20 md:py-28 overflow-hidden" style={{ backgroundColor: '#fcfaf4' }}>
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 opacity-90"></div>
        <div className="absolute inset-0">
          <div className="absolute top-0 right-0 w-96 h-96 bg-white opacity-10 rounded-full filter blur-3xl"></div>
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-white opacity-10 rounded-full filter blur-3xl"></div>
        </div>
        
        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center text-white max-w-4xl mx-auto"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-4">Ready to Find Your Dream Job?</h2>
            <p className="text-xl md:text-2xl mb-8 max-w-2xl mx-auto opacity-90">
              Join thousands of job seekers and employers on our platform. Start your journey today.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link
                to="/register"
                className="inline-flex items-center bg-white text-blue-600 px-8 md:px-10 py-4 md:py-5 rounded-xl font-semibold hover:bg-gray-100 transition-all text-lg shadow-lg hover:shadow-xl"
              >
                Get Started <FiArrowRight className="ml-2" size={22} />
              </Link>
              <Link
                to="/about"
                className="inline-flex items-center bg-transparent border-2 border-white text-white px-8 md:px-10 py-4 md:py-5 rounded-xl font-semibold hover:bg-white/10 transition-all text-lg"
              >
                Learn More
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Home;