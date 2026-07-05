import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import axios from '../../utils/axiosConfig';
import { useNavigate } from 'react-router-dom';
import { 
  FiSave, 
  FiX, 
  FiBriefcase, 
  FiMapPin, 
  FiClock, 
  FiDollarSign,
  FiFileText,
  FiList,
  FiTag,
  FiUser,
  FiMail,
  FiGlobe,
  FiCalendar,
  FiCheckCircle,
  FiAlertCircle,
  FiArrowLeft,
  FiPlus,
  FiMinus,
  FiStar,
  FiAward,
  FiTarget,
  FiInfo,
  FiCpu,
  FiZap // FiSparkles ki jagah FiZap
} from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';

const PostJob = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [aiLoading, setAiLoading] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [showAISuggestions, setShowAISuggestions] = useState(false);
  const [aiSuggestions, setAiSuggestions] = useState({
    description: '',
    requirements: [],
    responsibilities: [],
    skills: []
  });
  
  const [formData, setFormData] = useState({
    title: '',
    company: user?.profile?.company || '',
    description: '',
    requirements: [],
    responsibilities: [],
    location: '',
    type: 'full-time',
    category: '',
    experienceLevel: 'entry',
    salary: {
      min: '',
      max: '',
      currency: 'USD'
    },
    skills: [],
    remote: false,
    deadline: '',
    status: 'active',
    benefits: [],
    education: ''
  });

  const [requirement, setRequirement] = useState('');
  const [responsibility, setResponsibility] = useState('');
  const [skill, setSkill] = useState('');
  const [benefit, setBenefit] = useState('');

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (name.startsWith('salary.')) {
      const field = name.split('.')[1];
      setFormData(prev => ({
        ...prev,
        salary: { ...prev.salary, [field]: value }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: type === 'checkbox' ? checked : value
      }));
    }
  };

  const addItem = (field, value, setValue) => {
    if (value.trim()) {
      setFormData(prev => ({
        ...prev,
        [field]: [...prev[field], value.trim()]
      }));
      setValue('');
    }
  };

  const removeItem = (field, index) => {
    setFormData(prev => ({
      ...prev,
      [field]: prev[field].filter((_, i) => i !== index)
    }));
  };

  // Google Gemini AI Suggestion Function
  const generateAISuggestions = async () => {
    if (!formData.title.trim()) {
      toast.error('Please enter a job title first');
      return;
    }

    if (!formData.company.trim()) {
      toast.error('Please enter a company name');
      return;
    }

    setAiLoading(true);
    setShowAISuggestions(true);

    try {
      // API call to your backend which will use Google Gemini
      const response = await axios.post('/api/ai/generate-job-description', {
        jobTitle: formData.title,
        company: formData.company,
        experienceLevel: formData.experienceLevel,
        jobType: formData.type,
        category: formData.category,
        location: formData.location
      });

      const data = response.data;
      
      setAiSuggestions({
        description: data.description || '',
        requirements: data.requirements || [],
        responsibilities: data.responsibilities || [],
        skills: data.skills || []
      });

      toast.success('AI suggestions generated successfully!');
    } catch (error) {
      console.error('Error generating AI suggestions:', error);
      toast.error(error.response?.data?.message || 'Failed to generate AI suggestions');
      setShowAISuggestions(false);
    } finally {
      setAiLoading(false);
    }
  };

  // Apply AI suggestions to form
 // Apply AI suggestions to form
const applyAISuggestions = () => {
  let applied = false;

  if (aiSuggestions.description && !formData.description) {
    setFormData(prev => ({
      ...prev,
      description: aiSuggestions.description
    }));
    applied = true;
  }

  if (aiSuggestions.requirements.length > 0 && formData.requirements.length === 0) {
    setFormData(prev => ({
      ...prev,
      requirements: aiSuggestions.requirements
    }));
    applied = true;
  }

  if (aiSuggestions.responsibilities.length > 0 && formData.responsibilities.length === 0) {
    setFormData(prev => ({
      ...prev,
      responsibilities: aiSuggestions.responsibilities
    }));
    applied = true;
  }

  if (aiSuggestions.skills.length > 0 && formData.skills.length === 0) {
    setFormData(prev => ({
      ...prev,
      skills: aiSuggestions.skills
    }));
    applied = true;
  }

  setShowAISuggestions(false);
  if (applied) {
    toast.success('AI suggestions applied successfully!');
  } else {
    // toast.info ko toast me change karo
    toast('All suggestions already applied or fields are not empty', {
      icon: 'ℹ️',
      duration: 3000,
    });
  }
};
  // Apply single suggestion
  const applySingleSuggestion = (field, value) => {
    if (field === 'description') {
      setFormData(prev => ({
        ...prev,
        description: value
      }));
      toast.success('Description updated with AI suggestion');
    } else if (field === 'requirements') {
      setFormData(prev => ({
        ...prev,
        requirements: value
      }));
      toast.success(`${value.length} requirements added`);
    } else if (field === 'responsibilities') {
      setFormData(prev => ({
        ...prev,
        responsibilities: value
      }));
      toast.success(`${value.length} responsibilities added`);
    } else if (field === 'skills') {
      setFormData(prev => ({
        ...prev,
        skills: value
      }));
      toast.success(`${value.length} skills added`);
    }
  };

  const validateStep = (step) => {
    switch(step) {
      case 1:
        if (!formData.title.trim()) {
          toast.error('Please enter a job title');
          return false;
        }
        if (!formData.company.trim()) {
          toast.error('Please enter a company name');
          return false;
        }
        if (!formData.location.trim()) {
          toast.error('Please enter a job location');
          return false;
        }
        if (!formData.category.trim()) {
          toast.error('Please select a category');
          return false;
        }
        return true;
      case 2:
        if (!formData.description.trim()) {
          toast.error('Please enter a job description');
          return false;
        }
        if (formData.requirements.length === 0) {
          toast.error('Please add at least one requirement');
          return false;
        }
        return true;
      case 3:
        return true;
      default:
        return false;
    }
  };

  const nextStep = (e) => {
    e.preventDefault();
    if (validateStep(currentStep)) {
      setCurrentStep(prev => Math.min(prev + 1, 3));
    }
  };

  const prevStep = (e) => {
    e.preventDefault();
    setCurrentStep(prev => Math.max(prev - 1, 1));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateStep(1) || !validateStep(2) || !validateStep(3)) {
      return;
    }

    setLoading(true);

    try {
      const jobData = {
        ...formData,
        salary: {
          min: parseInt(formData.salary.min) || 0,
          max: parseInt(formData.salary.max) || 0,
          currency: formData.salary.currency
        }
      };
      
      await axios.post('/api/jobs', jobData);
      toast.success('Job posted successfully!');
      navigate('/employer/my-jobs');
    } catch (error) {
      console.error('Error posting job:', error);
      toast.error(error.response?.data?.message || 'Failed to post job');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen py-8" style={{ backgroundColor: '#fcfaf4' }}>
      <div className="container mx-auto px-4 max-w-5xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <button
              onClick={() => navigate('/employer/my-jobs')}
              className="inline-flex items-center text-blue-600 hover:text-blue-800 mb-2 font-medium transition-colors group"
            >
              <FiArrowLeft className="mr-2 group-hover:-translate-x-1 transition-transform" />
              Back to My Jobs
            </button>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
              <FiBriefcase className="text-blue-600" />
              Post a New Job
            </h1>
            <p className="text-gray-500 mt-1">Fill in the details below to create a new job listing</p>
          </div>
          <div className="text-sm text-gray-400">
            Step {currentStep} of 3
          </div>
        </div>

        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            {['Basic Info', 'Job Details', 'Additional Info'].map((step, index) => (
              <div key={index} className="flex items-center flex-1">
                <div className="flex flex-col items-center">
                  <div 
                    className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold text-sm transition-all cursor-pointer ${
                      currentStep > index + 1 
                        ? 'bg-green-500 text-white' 
                        : currentStep === index + 1 
                          ? 'bg-blue-600 text-white shadow-lg' 
                          : 'bg-gray-200 text-gray-500'
                    }`}
                    onClick={() => {
                      if (index + 1 < currentStep) {
                        setCurrentStep(index + 1);
                      } else if (index + 1 > currentStep) {
                        if (validateStep(currentStep)) {
                          setCurrentStep(index + 1);
                        }
                      }
                    }}
                  >
                    {currentStep > index + 1 ? <FiCheckCircle size={20} /> : index + 1}
                  </div>
                  <span className={`text-xs mt-1 font-medium ${
                    currentStep >= index + 1 ? 'text-blue-600' : 'text-gray-400'
                  }`}>
                    {step}
                  </span>
                </div>
                {index < 2 && (
                  <div className={`flex-1 h-0.5 mx-2 ${
                    currentStep > index + 1 ? 'bg-green-500' : 'bg-gray-200'
                  }`} />
                )}
              </div>
            ))}
          </div>
        </div>

        <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 md:p-8">
          <div className="space-y-6">
            {/* Step 1: Basic Information */}
            {currentStep === 1 && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                {/* AI Suggestion Button at the top */}
                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg p-4 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <FiCpu className="text-blue-600 text-2xl" />
                    <div>
                      <h4 className="font-semibold text-blue-800">✨ AI Job Description Generator</h4>
                      <p className="text-sm text-blue-600">Powered by Google Gemini - Enter job title and let AI help you</p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={generateAISuggestions}
                    disabled={aiLoading}
                    className="bg-blue-600 text-white px-5 py-2 rounded-lg hover:bg-blue-700 transition-all flex items-center gap-2 font-medium disabled:opacity-50 shadow-md hover:shadow-lg"
                  >
                    {aiLoading ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                        Generating...
                      </>
                    ) : (
                      <>
                        <FiZap />
                        Generate with AI
                      </>
                    )}
                  </button>
                </div>

                {/* AI Suggestions Panel */}
                <AnimatePresence>
                  {showAISuggestions && (
                    <motion.div
                      initial={{ opacity: 0, y: -20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      className="bg-gradient-to-r from-indigo-50 to-purple-50 border border-indigo-200 rounded-lg p-5 shadow-lg"
                    >
                      <div className="flex items-center justify-between mb-4">
                        <h4 className="font-semibold text-indigo-800 flex items-center gap-2">
                          <FiZap className="text-indigo-600 animate-pulse" />
                          AI Generated Suggestions
                          <span className="text-xs bg-indigo-200 text-indigo-700 px-2 py-1 rounded-full ml-2">
                            Google Gemini
                          </span>
                        </h4>
                        <button
                          type="button"
                          onClick={() => setShowAISuggestions(false)}
                          className="text-gray-500 hover:text-gray-700 hover:bg-gray-100 p-1 rounded-full transition-all"
                        >
                          <FiX size={20} />
                        </button>
                      </div>

                      {aiLoading ? (
                        <div className="text-center py-8">
                          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
                          <p className="text-gray-600 mt-3">Generating AI suggestions with Google Gemini...</p>
                          <p className="text-xs text-gray-400 mt-1">This may take a few seconds</p>
                        </div>
                      ) : (
                        <div className="space-y-4">
                          {/* Description */}
                          {aiSuggestions.description && (
                            <div className="bg-white rounded-lg p-3 border border-indigo-100 hover:border-indigo-300 transition-all">
                              <div className="flex items-center justify-between mb-2">
                                <span className="text-sm font-medium text-gray-700 flex items-center gap-2">
                                  <FiFileText className="text-indigo-600" />
                                  Description
                                </span>
                                {!formData.description && (
                                  <button
                                    type="button"
                                    onClick={() => applySingleSuggestion('description', aiSuggestions.description)}
                                    className="text-xs bg-indigo-600 text-white px-3 py-1 rounded hover:bg-indigo-700 transition-all font-medium"
                                  >
                                    Apply
                                  </button>
                                )}
                              </div>
                              <p className="text-sm text-gray-600 line-clamp-3">{aiSuggestions.description}</p>
                            </div>
                          )}

                          {/* Requirements */}
                          {aiSuggestions.requirements.length > 0 && (
                            <div className="bg-white rounded-lg p-3 border border-indigo-100 hover:border-indigo-300 transition-all">
                              <div className="flex items-center justify-between mb-2">
                                <span className="text-sm font-medium text-gray-700 flex items-center gap-2">
                                  <FiCheckCircle className="text-indigo-600" />
                                  Requirements ({aiSuggestions.requirements.length})
                                </span>
                                {formData.requirements.length === 0 && (
                                  <button
                                    type="button"
                                    onClick={() => applySingleSuggestion('requirements', aiSuggestions.requirements)}
                                    className="text-xs bg-indigo-600 text-white px-3 py-1 rounded hover:bg-indigo-700 transition-all font-medium"
                                  >
                                    Apply All
                                  </button>
                                )}
                              </div>
                              <div className="flex flex-wrap gap-1">
                                {aiSuggestions.requirements.map((req, idx) => (
                                  <span key={idx} className="text-xs bg-indigo-100 text-indigo-700 px-2 py-1 rounded">
                                    • {req}
                                  </span>
                                ))}
                              </div>
                            </div>
                          )}

                          {/* Responsibilities */}
                          {aiSuggestions.responsibilities.length > 0 && (
                            <div className="bg-white rounded-lg p-3 border border-green-100 hover:border-green-300 transition-all">
                              <div className="flex items-center justify-between mb-2">
                                <span className="text-sm font-medium text-gray-700 flex items-center gap-2">
                                  <FiTarget className="text-green-600" />
                                  Responsibilities ({aiSuggestions.responsibilities.length})
                                </span>
                                {formData.responsibilities.length === 0 && (
                                  <button
                                    type="button"
                                    onClick={() => applySingleSuggestion('responsibilities', aiSuggestions.responsibilities)}
                                    className="text-xs bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700 transition-all font-medium"
                                  >
                                    Apply All
                                  </button>
                                )}
                              </div>
                              <div className="flex flex-wrap gap-1">
                                {aiSuggestions.responsibilities.map((resp, idx) => (
                                  <span key={idx} className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded">
                                    • {resp}
                                  </span>
                                ))}
                              </div>
                            </div>
                          )}

                          {/* Skills */}
                          {aiSuggestions.skills.length > 0 && (
                            <div className="bg-white rounded-lg p-3 border border-purple-100 hover:border-purple-300 transition-all">
                              <div className="flex items-center justify-between mb-2">
                                <span className="text-sm font-medium text-gray-700 flex items-center gap-2">
                                  <FiStar className="text-purple-600" />
                                  Skills ({aiSuggestions.skills.length})
                                </span>
                                {formData.skills.length === 0 && (
                                  <button
                                    type="button"
                                    onClick={() => applySingleSuggestion('skills', aiSuggestions.skills)}
                                    className="text-xs bg-purple-600 text-white px-3 py-1 rounded hover:bg-purple-700 transition-all font-medium"
                                  >
                                    Apply All
                                  </button>
                                )}
                              </div>
                              <div className="flex flex-wrap gap-1">
                                {aiSuggestions.skills.map((skill, idx) => (
                                  <span key={idx} className="text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded">
                                    • {skill}
                                  </span>
                                ))}
                              </div>
                            </div>
                          )}

                          {/* Apply All Button */}
                          <div className="flex justify-end gap-3 mt-4 pt-3 border-t border-indigo-200">
                            <button
                              type="button"
                              onClick={() => setShowAISuggestions(false)}
                              className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-all text-sm font-medium"
                            >
                              Close
                            </button>
                            <button
                              type="button"
                              onClick={applyAISuggestions}
                              className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-6 py-2 rounded-lg hover:shadow-lg transition-all text-sm font-medium flex items-center gap-2"
                            >
                              <FiCheckCircle />
                              Apply All Suggestions
                            </button>
                          </div>
                        </div>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                      Job Title <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="title"
                      required
                      value={formData.title}
                      onChange={handleChange}
                      className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                      placeholder="e.g., Senior Software Engineer"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                      Company Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="company"
                      required
                      value={formData.company}
                      onChange={handleChange}
                      className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                      placeholder="Your company name"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                      Location <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <FiMapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                      <input
                        type="text"
                        name="location"
                        required
                        value={formData.location}
                        onChange={handleChange}
                        className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                        placeholder="e.g., New York, NY"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                      Job Type <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <FiBriefcase className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                      <select
                        name="type"
                        required
                        value={formData.type}
                        onChange={handleChange}
                        className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all bg-white"
                      >
                        <option value="full-time">Full Time</option>
                        <option value="part-time">Part Time</option>
                        <option value="contract">Contract</option>
                        <option value="internship">Internship</option>
                        <option value="remote">Remote</option>
                      </select>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                      Category <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <FiTag className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                      <input
                        type="text"
                        name="category"
                        required
                        value={formData.category}
                        onChange={handleChange}
                        className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                        placeholder="e.g., Technology, Healthcare"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                      Experience Level <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <FiAward className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                      <select
                        name="experienceLevel"
                        required
                        value={formData.experienceLevel}
                        onChange={handleChange}
                        className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all bg-white"
                      >
                        <option value="entry">Entry Level</option>
                        <option value="junior">Junior</option>
                        <option value="mid">Mid Level</option>
                        <option value="senior">Senior</option>
                        <option value="lead">Lead</option>
                      </select>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col md:flex-row items-start md:items-center gap-4">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      name="remote"
                      checked={formData.remote}
                      onChange={handleChange}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <span className="text-sm font-medium text-gray-700">Remote Position</span>
                  </label>
                  <div className="flex-1 w-full md:w-auto">
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                      Application Deadline
                    </label>
                    <input
                      type="date"
                      name="deadline"
                      value={formData.deadline}
                      onChange={handleChange}
                      className="w-full md:w-auto px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    />
                  </div>
                </div>
              </motion.div>
            )}

            {/* Step 2: Job Details */}
            {currentStep === 2 && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                {/* Quick AI Generate button for this step */}
                <div className="flex justify-end">
                  <button
                    type="button"
                    onClick={generateAISuggestions}
                    disabled={aiLoading}
                    className="text-sm bg-indigo-50 text-indigo-600 px-4 py-2 rounded-lg hover:bg-indigo-100 transition-all flex items-center gap-2 font-medium border border-indigo-200"
                  >
                    <FiZap />
                    Regenerate with AI
                  </button>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    Job Description <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <FiFileText className="absolute left-3 top-3 text-gray-400" />
                    <textarea
                      name="description"
                      required
                      rows="6"
                      value={formData.description}
                      onChange={handleChange}
                      className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-y"
                      placeholder="Describe the job role, responsibilities, and what makes this position great..."
                    />
                    {aiSuggestions.description && formData.description === aiSuggestions.description && (
                      <div className="absolute bottom-3 right-3 text-xs text-indigo-600 flex items-center gap-1 bg-white px-2 py-1 rounded shadow">
                        <FiZap size={12} />
                        AI Generated
                      </div>
                    )}
                  </div>
                </div>

                {/* Requirements */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    Requirements <span className="text-red-500">*</span>
                  </label>
                  <div className="flex gap-2 mb-3">
                    <input
                      type="text"
                      value={requirement}
                      onChange={(e) => setRequirement(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && addItem('requirements', requirement, setRequirement)}
                      className="flex-1 px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                      placeholder="Add a requirement"
                    />
                    <button
                      type="button"
                      onClick={() => addItem('requirements', requirement, setRequirement)}
                      className="bg-blue-600 text-white px-5 py-2.5 rounded-lg hover:bg-blue-700 transition-all flex items-center gap-1 font-medium"
                    >
                      <FiPlus size={18} />
                      Add
                    </button>
                  </div>
                  {formData.requirements.length === 0 && (
                    <p className="text-sm text-yellow-600 mb-2 flex items-center gap-1">
                      <FiAlertCircle size={16} />
                      Add at least one requirement
                    </p>
                  )}
                  <div className="flex flex-wrap gap-2">
                    {formData.requirements.map((req, index) => (
                      <span key={index} className="bg-blue-50 text-blue-700 px-3 py-1.5 rounded-lg text-sm flex items-center gap-2 border border-blue-200">
                        <FiCheckCircle className="text-blue-500" size={14} />
                        {req}
                        <button
                          type="button"
                          onClick={() => removeItem('requirements', index)}
                          className="text-blue-400 hover:text-red-500 transition-colors ml-1"
                        >
                          <FiX size={14} />
                        </button>
                      </span>
                    ))}
                  </div>
                </div>

                {/* Responsibilities */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    Responsibilities
                  </label>
                  <div className="flex gap-2 mb-3">
                    <input
                      type="text"
                      value={responsibility}
                      onChange={(e) => setResponsibility(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && addItem('responsibilities', responsibility, setResponsibility)}
                      className="flex-1 px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                      placeholder="Add a responsibility"
                    />
                    <button
                      type="button"
                      onClick={() => addItem('responsibilities', responsibility, setResponsibility)}
                      className="bg-green-600 text-white px-5 py-2.5 rounded-lg hover:bg-green-700 transition-all flex items-center gap-1 font-medium"
                    >
                      <FiPlus size={18} />
                      Add
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {formData.responsibilities.map((resp, index) => (
                      <span key={index} className="bg-green-50 text-green-700 px-3 py-1.5 rounded-lg text-sm flex items-center gap-2 border border-green-200">
                        <FiTarget className="text-green-500" size={14} />
                        {resp}
                        <button
                          type="button"
                          onClick={() => removeItem('responsibilities', index)}
                          className="text-green-400 hover:text-red-500 transition-colors ml-1"
                        >
                          <FiX size={14} />
                        </button>
                      </span>
                    ))}
                  </div>
                </div>

                {/* Skills */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    Required Skills
                  </label>
                  <div className="flex gap-2 mb-3">
                    <input
                      type="text"
                      value={skill}
                      onChange={(e) => setSkill(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && addItem('skills', skill, setSkill)}
                      className="flex-1 px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                      placeholder="Add a skill"
                    />
                    <button
                      type="button"
                      onClick={() => addItem('skills', skill, setSkill)}
                      className="bg-purple-600 text-white px-5 py-2.5 rounded-lg hover:bg-purple-700 transition-all flex items-center gap-1 font-medium"
                    >
                      <FiPlus size={18} />
                      Add
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {formData.skills.map((skill, index) => (
                      <span key={index} className="bg-purple-50 text-purple-700 px-3 py-1.5 rounded-lg text-sm flex items-center gap-2 border border-purple-200">
                        <FiStar className="text-purple-500" size={14} />
                        {skill}
                        <button
                          type="button"
                          onClick={() => removeItem('skills', index)}
                          className="text-purple-400 hover:text-red-500 transition-colors ml-1"
                        >
                          <FiX size={14} />
                        </button>
                      </span>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}

            {/* Step 3: Additional Info */}
            {currentStep === 3 && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4 flex items-start gap-3">
                  <FiInfo className="text-blue-600 text-xl flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm text-blue-800 font-medium">Additional Information</p>
                    <p className="text-sm text-blue-600">Add optional details to make your job posting more attractive to candidates</p>
                  </div>
                </div>

                {/* Salary */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    Salary Range
                  </label>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-xs text-gray-500 mb-1">Min</label>
                      <div className="relative">
                        <FiDollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                        <input
                          type="number"
                          name="salary.min"
                          value={formData.salary.min}
                          onChange={handleChange}
                          className="w-full pl-8 pr-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                          placeholder="Min"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs text-gray-500 mb-1">Max</label>
                      <div className="relative">
                        <FiDollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                        <input
                          type="number"
                          name="salary.max"
                          value={formData.salary.max}
                          onChange={handleChange}
                          className="w-full pl-8 pr-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                          placeholder="Max"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs text-gray-500 mb-1">Currency</label>
                      <select
                        name="salary.currency"
                        value={formData.salary.currency}
                        onChange={handleChange}
                        className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all bg-white"
                      >
                        <option value="USD">USD ($)</option>
                        <option value="EUR">EUR (€)</option>
                        <option value="GBP">GBP (£)</option>
                        <option value="INR">INR (₹)</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* Benefits */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    Benefits & Perks
                  </label>
                  <div className="flex gap-2 mb-3">
                    <input
                      type="text"
                      value={benefit}
                      onChange={(e) => setBenefit(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && addItem('benefits', benefit, setBenefit)}
                      className="flex-1 px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                      placeholder="Add a benefit (e.g., Health Insurance)"
                    />
                    <button
                      type="button"
                      onClick={() => addItem('benefits', benefit, setBenefit)}
                      className="bg-indigo-600 text-white px-5 py-2.5 rounded-lg hover:bg-indigo-700 transition-all flex items-center gap-1 font-medium"
                    >
                      <FiPlus size={18} />
                      Add
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {formData.benefits.map((benefit, index) => (
                      <span key={index} className="bg-indigo-50 text-indigo-700 px-3 py-1.5 rounded-lg text-sm flex items-center gap-2 border border-indigo-200">
                        <FiAward className="text-indigo-500" size={14} />
                        {benefit}
                        <button
                          type="button"
                          onClick={() => removeItem('benefits', index)}
                          className="text-indigo-400 hover:text-red-500 transition-colors ml-1"
                        >
                          <FiX size={14} />
                        </button>
                      </span>
                    ))}
                  </div>
                </div>

                {/* Education */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    Education Requirements
                  </label>
                  <div className="relative">
                    <FiUser className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <input
                      type="text"
                      name="education"
                      value={formData.education}
                      onChange={handleChange}
                      className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                      placeholder="e.g., Bachelor's degree in Computer Science"
                    />
                  </div>
                </div>

                {/* Summary of all entered data */}
                <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                  <h4 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                    <FiCheckCircle className="text-green-500" />
                    Summary
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                    <div>
                      <span className="text-gray-500">Title:</span>
                      <span className="ml-2 font-medium text-gray-800">{formData.title || 'Not set'}</span>
                    </div>
                    <div>
                      <span className="text-gray-500">Company:</span>
                      <span className="ml-2 font-medium text-gray-800">{formData.company || 'Not set'}</span>
                    </div>
                    <div>
                      <span className="text-gray-500">Location:</span>
                      <span className="ml-2 font-medium text-gray-800">{formData.location || 'Not set'}</span>
                    </div>
                    <div>
                      <span className="text-gray-500">Type:</span>
                      <span className="ml-2 font-medium text-gray-800">{formData.type || 'Not set'}</span>
                    </div>
                    <div>
                      <span className="text-gray-500">Category:</span>
                      <span className="ml-2 font-medium text-gray-800">{formData.category || 'Not set'}</span>
                    </div>
                    <div>
                      <span className="text-gray-500">Requirements:</span>
                      <span className="ml-2 font-medium text-gray-800">{formData.requirements.length} items</span>
                    </div>
                    {formData.salary.min && formData.salary.max && (
                      <div className="col-span-2">
                        <span className="text-gray-500">Salary:</span>
                        <span className="ml-2 font-medium text-gray-800">
                          {formData.salary.currency} {formData.salary.min} - {formData.salary.max}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            )}

            {/* Navigation Buttons */}
            <div className="flex justify-between items-center pt-4 border-t border-gray-200">
              <button
                type="button"
                onClick={() => navigate('/employer/my-jobs')}
                className="px-6 py-2.5 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-all font-medium"
              >
                Cancel
              </button>
              <div className="flex gap-3">
                {currentStep > 1 && (
                  <button
                    type="button"
                    onClick={prevStep}
                    className="px-6 py-2.5 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-all font-medium"
                  >
                    Previous
                  </button>
                )}
                {currentStep < 3 ? (
                  <button
                    type="button"
                    onClick={nextStep}
                    className="px-6 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all font-medium"
                  >
                    Next Step
                  </button>
                ) : (
                  <button
                    type="submit"
                    disabled={loading}
                    className="px-6 py-2.5 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg hover:shadow-lg transition-all font-medium flex items-center gap-2 disabled:opacity-50"
                  >
                    {loading ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                        Posting...
                      </>
                    ) : (
                      <>
                        <FiSave />
                        Post Job
                      </>
                    )}
                  </button>
                )}
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PostJob;