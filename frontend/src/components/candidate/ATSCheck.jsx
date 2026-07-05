// components/candidate/ATSCheck.jsx
import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import axios from '../../utils/axiosConfig';
import { 
  FiUpload, 
  FiFileText, 
  FiCheckCircle, 
  FiXCircle, 
  FiAlertCircle,
  FiTrendingUp,
  FiBarChart2,
  FiArrowLeft,
  FiDownload,
  FiEye,
  FiTrash2,
  FiRefreshCw,
  FiStar,
  FiAward,
  FiTarget,
  FiBriefcase,
  FiUsers,
  FiDollarSign,
  FiClock,
  FiMapPin,
  FiMail,
  FiPhone,
  FiUser,
  FiCalendar,
  FiInfo,
  FiThumbsUp,
  FiThumbsDown,
  FiList,
  FiGrid,
  FiPieChart,
  FiActivity,
  FiBookOpen,
  FiZap,
  FiShield,
  FiCheck,
  FiX,
  FiPlus,
  FiMinus,
  FiCompass
} from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

const ATSCheck = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [uploadedFile, setUploadedFile] = useState(null);
  const [activeTab, setActiveTab] = useState('overview');
  const [downloading, setDownloading] = useState(false);
  const fileInputRef = useRef(null);

  useEffect(() => {
    // Check if user has resume uploaded
    if (user?.resumeUrl) {
      setUploadedFile({
        name: user.resumeName || 'Resume.pdf',
        url: user.resumeUrl,
        uploadedAt: user.resumeUploadedAt
      });
    }
  }, [user]);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      const validTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
      if (!validTypes.includes(selectedFile.type)) {
        toast.error('Please upload a PDF or Word document');
        return;
      }
      if (selectedFile.size > 5 * 1024 * 1024) {
        toast.error('File size should be less than 5MB');
        return;
      }
      setFile(selectedFile);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile) {
      const validTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
      if (!validTypes.includes(droppedFile.type)) {
        toast.error('Please upload a PDF or Word document');
        return;
      }
      if (droppedFile.size > 5 * 1024 * 1024) {
        toast.error('File size should be less than 5MB');
        return;
      }
      setFile(droppedFile);
    }
  };

  const handleAnalyze = async () => {
    if (!file) {
      toast.error('Please select a resume file first');
      return;
    }

    setLoading(true);
    const formData = new FormData();
    formData.append('resume', file);

    try {
      const response = await axios.post('/api/resume/ats-check', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      
      setResult(response.data);
      setUploadedFile({
        name: file.name,
        size: file.size,
        uploadedAt: new Date().toISOString()
      });
      toast.success('ATS analysis completed successfully!');
    } catch (error) {
      console.error('Error analyzing resume:', error);
      toast.error(error.response?.data?.message || 'Failed to analyze resume');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteResume = async () => {
    try {
      await axios.delete('/api/resume');
      setUploadedFile(null);
      setResult(null);
      setFile(null);
      toast.success('Resume deleted successfully');
    } catch (error) {
      console.error('Error deleting resume:', error);
      toast.error('Failed to delete resume');
    }
  };

  const getScoreColor = (score) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getScoreBg = (score) => {
    if (score >= 80) return 'bg-green-100';
    if (score >= 60) return 'bg-yellow-100';
    return 'bg-red-100';
  };

  const getScoreRingColor = (score) => {
    if (score >= 80) return '#10B981';
    if (score >= 60) return '#F59E0B';
    return '#EF4444';
  };

  const getScoreStatus = (score) => {
    if (score >= 80) return 'Excellent';
    if (score >= 60) return 'Good';
    return 'Needs Improvement';
  };

  // ============================================================
  // PROFESSIONAL PDF REPORT GENERATOR
  // Uses jspdf-autotable for clean grid layouts instead of
  // manually-positioned lines of text.
  // ============================================================
  const generatePDFReport = () => {
    if (!result) {
      toast.error('No analysis results to download');
      return;
    }

    setDownloading(true);

    try {
      const doc = new jsPDF('p', 'mm', 'a4');
      const pageWidth = doc.internal.pageSize.getWidth();
      const pageHeight = doc.internal.pageSize.getHeight();
      const margin = 15;
      const contentWidth = pageWidth - margin * 2;

      const colors = {
        primary: [37, 99, 235],
        primaryDark: [29, 78, 216],
        success: [16, 185, 129],
        warning: [245, 158, 11],
        danger: [239, 68, 68],
        dark: [31, 41, 55],
        gray: [107, 114, 128],
        lightGray: [249, 250, 251],
        border: [209, 213, 219],
        slate: [55, 65, 81]
      };

      const score = result.overallScore || 0;
      const scoreColor = score >= 80 ? colors.success : score >= 60 ? colors.warning : colors.danger;
      const status = getScoreStatus(score);
      const halfWidth = (contentWidth - 6) / 2;

      let y = 0;

      // ---------------- HEADER BANNER ----------------
      doc.setFillColor(...colors.primary);
      doc.rect(0, 0, pageWidth, 36, 'F');
      doc.setFillColor(...colors.primaryDark);
      doc.rect(0, 34, pageWidth, 2, 'F');

      doc.setTextColor(255, 255, 255);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(20);
      doc.text('ATS Resume Analysis Report', margin, 17);

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(9);
      doc.text('Applicant Tracking System Compatibility Assessment', margin, 25);

      const genDate = new Date().toLocaleDateString('en-US', {
        year: 'numeric', month: 'long', day: 'numeric'
      });
      doc.setFontSize(9);
      doc.text(genDate, pageWidth - margin, 17, { align: 'right' });

      // ---------------- CANDIDATE INFO BAR ----------------
      y = 46;
      doc.setFillColor(...colors.lightGray);
      doc.setDrawColor(...colors.border);
      doc.roundedRect(margin, y, contentWidth, 22, 2, 2, 'FD');

      doc.setTextColor(...colors.gray);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(8);
      doc.text('CANDIDATE', margin + 5, y + 8);
      doc.text('EMAIL', margin + 5 + contentWidth * 0.36, y + 8);
      doc.text('RESUME FILE', margin + 5 + contentWidth * 0.68, y + 8);

      doc.setTextColor(...colors.dark);
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(10);
      doc.text(String(user?.name || 'Candidate').substring(0, 24), margin + 5, y + 16);
      doc.text(String(user?.email || 'N/A').substring(0, 28), margin + 5 + contentWidth * 0.36, y + 16);
      const fileName = String(uploadedFile?.name || result.file?.name || 'Resume').substring(0, 22);
      doc.text(fileName, margin + 5 + contentWidth * 0.68, y + 16);

      y += 30;

      // ---------------- SCORE CARD ----------------
      const scoreCardH = 42;
      doc.setFillColor(255, 255, 255);
      doc.setDrawColor(...colors.border);
      doc.roundedRect(margin, y, contentWidth, scoreCardH, 2, 2, 'FD');

      doc.setTextColor(...scoreColor);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(30);
      doc.text(`${score}%`, margin + 8, y + 25);

      doc.setTextColor(...colors.dark);
      doc.setFontSize(10);
      doc.setFont('helvetica', 'normal');
      doc.text('Overall ATS Score', margin + 8, y + 34);

      // Status badge
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(9);
      const badgeW = doc.getTextWidth(status) + 10;
      const badgeX = margin + 55;
      doc.setFillColor(...scoreColor);
      doc.roundedRect(badgeX, y + 7, badgeW, 8, 4, 4, 'F');
      doc.setTextColor(255, 255, 255);
      doc.text(status, badgeX + badgeW / 2, y + 12.3, { align: 'center' });

      // Progress bar
      const barX = badgeX;
      const barY = y + 20;
      const barW = contentWidth - (badgeX - margin) - 8;
      const barH = 5;
      doc.setFillColor(...colors.border);
      doc.roundedRect(barX, barY, barW, barH, 2, 2, 'F');
      doc.setFillColor(...scoreColor);
      doc.roundedRect(barX, barY, Math.max((score / 100) * barW, 4), barH, 2, 2, 'F');

      // Keyword counters
      const foundCount = result.foundKeywords?.length || 0;
      const missingCount = result.missingKeywords?.length || 0;

      doc.setFont('helvetica', 'bold');
      doc.setFontSize(13);
      doc.setTextColor(...colors.success);
      doc.text(`${foundCount}`, barX, y + 34);
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(7.5);
      doc.setTextColor(...colors.gray);
      doc.text('Keywords Found', barX, y + 38.5);

      doc.setFont('helvetica', 'bold');
      doc.setFontSize(13);
      doc.setTextColor(...colors.danger);
      doc.text(`${missingCount}`, barX + 40, y + 34);
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(7.5);
      doc.setTextColor(...colors.gray);
      doc.text('Keywords Missing', barX + 40, y + 38.5);

      y += scoreCardH + 10;

      const checkPageBreak = (needed) => {
        if (y + needed > pageHeight - 22) {
          doc.addPage();
          y = 20;
        }
      };

      // ---------------- SECTION-WISE BREAKDOWN TABLE ----------------
      if (result.sections && result.sections.length > 0) {
        checkPageBreak(30);
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(12);
        doc.setTextColor(...colors.dark);
        doc.text('Section-Wise Breakdown', margin, y);
        y += 4;

        autoTable(doc, {
          startY: y,
          margin: { left: margin, right: margin },
          head: [['Section', 'Score', 'Feedback']],
          body: result.sections.map(s => [s.name, `${s.score}%`, s.feedback || '']),
          theme: 'grid',
          styles: { font: 'helvetica', lineColor: colors.border, lineWidth: 0.2 },
          headStyles: { fillColor: colors.primary, textColor: 255, fontStyle: 'bold', fontSize: 9 },
          bodyStyles: { fontSize: 8.5, textColor: colors.dark },
          columnStyles: {
            0: { cellWidth: 38, fontStyle: 'bold' },
            1: { cellWidth: 20, halign: 'center' },
            2: { cellWidth: 'auto' }
          },
          didParseCell: (data) => {
            if (data.section === 'body' && data.column.index === 1) {
              const val = parseInt(data.cell.raw, 10);
              if (val >= 80) data.cell.styles.textColor = colors.success;
              else if (val >= 60) data.cell.styles.textColor = colors.warning;
              else data.cell.styles.textColor = colors.danger;
              data.cell.styles.fontStyle = 'bold';
            }
          }
        });

        y = doc.lastAutoTable.finalY + 10;
      }

      // ---------------- STRENGTHS & WEAKNESSES (side by side) ----------------
      if ((result.strengths?.length > 0) || (result.weaknesses?.length > 0)) {
        checkPageBreak(30);
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(12);
        doc.setTextColor(...colors.dark);
        doc.text('Strengths & Areas for Improvement', margin, y);
        y += 4;

        const sectionStartY = y;
        let leftFinalY = sectionStartY;
        let rightFinalY = sectionStartY;

        if (result.strengths?.length > 0) {
          autoTable(doc, {
            startY: sectionStartY,
            margin: { left: margin },
            tableWidth: halfWidth,
            head: [['Strengths']],
            body: result.strengths.map(s => [s]),
            theme: 'grid',
            styles: { font: 'helvetica', lineColor: colors.border, lineWidth: 0.2 },
            headStyles: { fillColor: colors.success, textColor: 255, fontSize: 9 },
            bodyStyles: { fontSize: 8.3, textColor: colors.dark, cellPadding: 3 }
          });
          leftFinalY = doc.lastAutoTable.finalY;
        }

        if (result.weaknesses?.length > 0) {
          autoTable(doc, {
            startY: sectionStartY,
            margin: { left: margin + halfWidth + 6 },
            tableWidth: halfWidth,
            head: [['Areas for Improvement']],
            body: result.weaknesses.map(w => [w]),
            theme: 'grid',
            styles: { font: 'helvetica', lineColor: colors.border, lineWidth: 0.2 },
            headStyles: { fillColor: colors.danger, textColor: 255, fontSize: 9 },
            bodyStyles: { fontSize: 8.3, textColor: colors.dark, cellPadding: 3 }
          });
          rightFinalY = doc.lastAutoTable.finalY;
        }

        y = Math.max(leftFinalY, rightFinalY) + 10;
      }

      // ---------------- KEYWORD ANALYSIS ----------------
      checkPageBreak(30);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(12);
      doc.setTextColor(...colors.dark);
      doc.text('Keyword Analysis', margin, y);
      y += 4;

      autoTable(doc, {
        startY: y,
        margin: { left: margin, right: margin },
        head: [['Found Keywords', 'Missing Keywords']],
        body: [[
          result.foundKeywords?.length ? result.foundKeywords.join(', ') : 'None detected',
          result.missingKeywords?.length ? result.missingKeywords.join(', ') : 'None'
        ]],
        theme: 'grid',
        styles: { font: 'helvetica', lineColor: colors.border, lineWidth: 0.2 },
        headStyles: { fillColor: colors.slate, textColor: 255, fontSize: 9 },
        bodyStyles: { fontSize: 8, cellPadding: 4 },
        columnStyles: {
          0: { cellWidth: halfWidth, textColor: colors.success },
          1: { cellWidth: halfWidth, textColor: colors.danger }
        }
      });
      y = doc.lastAutoTable.finalY + 10;

      // ---------------- IMPROVEMENT SUGGESTIONS ----------------
      if (result.suggestions?.length > 0) {
        checkPageBreak(25);
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(12);
        doc.setTextColor(...colors.dark);
        doc.text('Improvement Suggestions', margin, y);
        y += 4;

        autoTable(doc, {
          startY: y,
          margin: { left: margin, right: margin },
          head: [['#', 'Suggestion']],
          body: result.suggestions.map((s, i) => [`${i + 1}`, s]),
          theme: 'striped',
          styles: { font: 'helvetica', lineColor: colors.border, lineWidth: 0.2 },
          headStyles: { fillColor: colors.primary, textColor: 255, fontSize: 9 },
          bodyStyles: { fontSize: 8.5, textColor: colors.dark },
          columnStyles: { 0: { cellWidth: 10, halign: 'center', fontStyle: 'bold' } }
        });
        y = doc.lastAutoTable.finalY + 10;
      }

      // ---------------- FOOTER (every page) ----------------
      const pageCount = doc.internal.getNumberOfPages();
      for (let i = 1; i <= pageCount; i++) {
        doc.setPage(i);
        doc.setDrawColor(...colors.border);
        doc.line(margin, pageHeight - 15, pageWidth - margin, pageHeight - 15);
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(8);
        doc.setTextColor(...colors.gray);
        doc.text('Generated by JobNest - Tejas Khope', margin, pageHeight - 10);
        doc.text(`Page ${i} of ${pageCount}`, pageWidth - margin, pageHeight - 10, { align: 'right' });
      }

      const safeName = user?.name ? user.name.replace(/\s+/g, '_') + '_' : '';
      doc.save(`ATS_Report_${safeName}${new Date().toISOString().split('T')[0]}.pdf`);
      toast.success('Report downloaded successfully!');

    } catch (error) {
      console.error('Error generating PDF:', error);
      toast.error('Failed to generate report. Please try again.');
    } finally {
      setDownloading(false);
    }
  };

  // Skeleton Components
  const ScoreCardSkeleton = () => (
    <div className="bg-white rounded-xl p-6 border border-gray-200 animate-pulse">
      <div className="h-4 bg-gray-200 rounded w-32 mb-3"></div>
      <div className="h-10 bg-gray-200 rounded w-20"></div>
      <div className="h-3 bg-gray-200 rounded w-24 mt-2"></div>
    </div>
  );

  const SectionSkeleton = () => (
    <div className="bg-gray-50 rounded-xl p-6 border border-gray-200 animate-pulse">
      <div className="flex items-center justify-between mb-3">
        <div className="h-6 bg-gray-200 rounded w-32"></div>
        <div className="h-8 bg-gray-200 rounded-full w-16"></div>
      </div>
      <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
      <div className="h-4 bg-gray-200 rounded w-3/4"></div>
      <div className="mt-3">
        <div className="h-3 bg-gray-200 rounded w-20 mb-2"></div>
        <div className="h-3 bg-gray-200 rounded w-40"></div>
        <div className="h-3 bg-gray-200 rounded w-36 mt-1"></div>
      </div>
    </div>
  );

  const ATSCheckSkeleton = () => (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <ScoreCardSkeleton />
        <ScoreCardSkeleton />
        <ScoreCardSkeleton />
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl p-6 border border-gray-200 animate-pulse">
          <div className="h-6 bg-gray-200 rounded w-40 mb-4"></div>
          <div className="space-y-3">
            {[1, 2, 3, 4, 5].map((item) => (
              <div key={item} className="flex justify-between">
                <div className="h-4 bg-gray-200 rounded w-32"></div>
                <div className="h-4 bg-gray-200 rounded w-12"></div>
              </div>
            ))}
          </div>
        </div>
        <div className="bg-white rounded-xl p-6 border border-gray-200 animate-pulse">
          <div className="h-6 bg-gray-200 rounded w-40 mb-4"></div>
          <div className="space-y-3">
            {[1, 2, 3, 4].map((item) => (
              <div key={item} className="flex justify-between">
                <div className="h-4 bg-gray-200 rounded w-32"></div>
                <div className="h-4 bg-gray-200 rounded w-12"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="mt-6">
        <div className="h-6 bg-gray-200 rounded w-48 mb-4 animate-pulse"></div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <SectionSkeleton />
          <SectionSkeleton />
          <SectionSkeleton />
          <SectionSkeleton />
        </div>
      </div>
    </div>
  );

  // Render Score Ring Component
  const ScoreRing = ({ score, label, sublabel, size = 'md' }) => {
    const circumference = 2 * Math.PI * 45;
    const offset = circumference - (score / 100) * circumference;
    const color = getScoreRingColor(score);
    const sizeClasses = {
      sm: 'w-24 h-24',
      md: 'w-32 h-32',
      lg: 'w-40 h-40'
    };
    const textSizes = {
      sm: 'text-2xl',
      md: 'text-3xl',
      lg: 'text-4xl'
    };

    return (
      <div className="flex flex-col items-center">
        <div className="relative">
          <svg className={`${sizeClasses[size]} transform -rotate-90`}>
            <circle
              className="text-gray-200"
              strokeWidth="8"
              stroke="currentColor"
              fill="transparent"
              r="45"
              cx="64"
              cy="64"
            />
            <circle
              className="transition-all duration-1000 ease-in-out"
              strokeWidth="8"
              strokeDasharray={circumference}
              strokeDashoffset={offset}
              strokeLinecap="round"
              stroke={color}
              fill="transparent"
              r="45"
              cx="64"
              cy="64"
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className={`${textSizes[size]} font-bold text-gray-800`}>{score}%</span>
            <span className="text-xs text-gray-500">{sublabel || 'Overall'}</span>
          </div>
        </div>
        <p className="mt-2 text-sm font-medium text-gray-600">{label}</p>
      </div>
    );
  };

  // Status Badge Component
  const StatusBadge = ({ status, score }) => {
    const configs = {
      'Excellent': { icon: FiStar, color: 'text-green-600 bg-green-100 border-green-200' },
      'Good': { icon: FiThumbsUp, color: 'text-blue-600 bg-blue-100 border-blue-200' },
      'Needs Improvement': { icon: FiAlertCircle, color: 'text-yellow-600 bg-yellow-100 border-yellow-200' }
    };
    const config = configs[status] || configs['Needs Improvement'];
    const Icon = config.icon;

    return (
      <span className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium border ${config.color}`}>
        <Icon size={16} />
        {status}
      </span>
    );
  };

  return (
    <div className="min-h-screen py-8" style={{ backgroundColor: '#fcfaf4' }}>
      <div className="container mx-auto px-4 max-w-6xl">
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
                <FiBarChart2 className="text-blue-600" />
                ATS Resume Checker
              </h1>
              <p className="text-gray-500 mt-1">
                Analyze your resume against ATS standards and get detailed feedback
              </p>
            </div>
            {uploadedFile && (
              <button
                onClick={handleDeleteResume}
                className="text-red-600 hover:text-red-700 text-sm flex items-center gap-1 transition-colors"
              >
                <FiTrash2 />
                Delete Resume
              </button>
            )}
          </div>

          {/* Upload Section */}
          {!result && (
            <div className="mb-8">
              <div
                className={`border-2 border-dashed rounded-xl p-12 text-center transition-all ${
                  file ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-blue-400 hover:bg-gray-50'
                }`}
                onDragOver={(e) => e.preventDefault()}
                onDrop={handleDrop}
              >
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  accept=".pdf,.doc,.docx"
                  className="hidden"
                />
                
                {file ? (
                  <div className="flex flex-col items-center">
                    <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                      <FiFileText className="text-3xl text-blue-600" />
                    </div>
                    <p className="text-lg font-semibold text-gray-800">{file.name}</p>
                    <p className="text-sm text-gray-500">
                      {(file.size / 1024).toFixed(1)} KB
                    </p>
                    <div className="flex gap-3 mt-4">
                      <button
                        onClick={() => {
                          setFile(null);
                          if (fileInputRef.current) fileInputRef.current.value = '';
                        }}
                        className="text-red-600 hover:text-red-700 text-sm font-medium transition-colors"
                      >
                        <FiX className="inline mr-1" />
                        Remove
                      </button>
                      <button
                        onClick={() => fileInputRef.current?.click()}
                        className="text-blue-600 hover:text-blue-700 text-sm font-medium transition-colors"
                      >
                        <FiRefreshCw className="inline mr-1" />
                        Change File
                      </button>
                    </div>
                  </div>
                ) : (
                  <div>
                    <div className="w-20 h-20 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-4">
                      <FiUpload className="text-4xl text-blue-500" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-800 mb-2">
                      Upload Your Resume
                    </h3>
                    <p className="text-gray-500 mb-4">
                      Drag and drop or click to upload (PDF, DOC, DOCX)
                    </p>
                    <button
                      onClick={() => fileInputRef.current?.click()}
                      className="bg-blue-600 text-white px-6 py-2.5 rounded-lg hover:bg-blue-700 transition-all font-medium shadow-sm hover:shadow-md"
                    >
                      <FiUpload className="inline mr-2" />
                      Choose File
                    </button>
                    <p className="text-xs text-gray-400 mt-3">
                      Max file size: 5MB
                    </p>
                  </div>
                )}
              </div>

              {file && (
                <div className="flex justify-center mt-4">
                  <button
                    onClick={handleAnalyze}
                    disabled={loading}
                    className="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition-all font-semibold flex items-center gap-2 disabled:opacity-50 shadow-sm hover:shadow-md"
                  >
                    {loading ? (
                      <>
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                        Analyzing...
                      </>
                    ) : (
                      <>
                        <FiBarChart2 />
                        Analyze Resume
                      </>
                    )}
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Loading State with Skeleton */}
          {loading && !result && (
            <div className="mt-8">
              <div className="text-center py-12">
                <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto"></div>
                <p className="text-gray-600 mt-6 font-medium">Analyzing your resume...</p>
                <p className="text-sm text-gray-400 mt-1">This may take a few seconds</p>
              </div>
            </div>
          )}

          {/* Results Section */}
          {result && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              {/* Overall Score Card */}
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6 mb-6 border border-blue-100">
                <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                  <div className="flex items-center gap-6">
                    <ScoreRing score={result.overallScore} size="md" />
                    <div>
                      <h2 className="text-xl font-bold text-gray-800">ATS Score</h2>
                      <StatusBadge status={getScoreStatus(result.overallScore)} score={result.overallScore} />
                      <p className="text-sm text-gray-600 mt-2">
                        <FiActivity className="inline mr-1" />
                        {result.overallScore >= 80 ? 'Your resume is well-optimized for ATS systems' : 
                         result.overallScore >= 60 ? 'Your resume has good ATS compatibility' : 
                         'Your resume needs optimization for ATS systems'}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-6">
                    <div className="text-center">
                      <div className="text-3xl font-bold text-gray-800">
                        {result.foundKeywords?.length || 0}
                      </div>
                      <p className="text-sm text-gray-500 flex items-center gap-1">
                        <FiCheck className="text-green-500" />
                        Keywords Found
                      </p>
                    </div>
                    <div className="w-px h-12 bg-gray-300"></div>
                    <div className="text-center">
                      <div className="text-3xl font-bold text-gray-800">
                        {result.missingKeywords?.length || 0}
                      </div>
                      <p className="text-sm text-gray-500 flex items-center gap-1">
                        <FiX className="text-red-500" />
                        Missing Keywords
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Tabs */}
              <div className="border-b border-gray-200 mb-6">
                <div className="flex gap-4 overflow-x-auto">
                  {[
                    { id: 'overview', label: 'Overview', icon: FiPieChart },
                    { id: 'keywords', label: 'Keywords', icon: FiList },
                    { id: 'sections', label: 'Sections', icon: FiGrid },
                    { id: 'suggestions', label: 'Suggestions', icon: FiCompass }
                  ].map((tab) => {
                    const Icon = tab.icon;
                    return (
                      <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`flex items-center gap-2 px-4 py-2 font-medium text-sm transition-all border-b-2 whitespace-nowrap ${
                          activeTab === tab.id
                            ? 'border-blue-600 text-blue-600'
                            : 'border-transparent text-gray-500 hover:text-gray-700'
                        }`}
                      >
                        <Icon size={16} />
                        {tab.label}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Tab Content */}
              <div className="min-h-[300px]">
                {activeTab === 'overview' && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Strengths */}
                    <div className="bg-green-50 rounded-xl p-6 border border-green-200">
                      <h3 className="text-lg font-semibold text-green-700 mb-3 flex items-center gap-2">
                        <FiThumbsUp />
                        Strengths
                      </h3>
                      <ul className="space-y-2">
                        {result.strengths?.map((strength, index) => (
                          <li key={index} className="flex items-start text-gray-700">
                            <FiCheck className="text-green-500 mr-2 mt-0.5 flex-shrink-0" size={16} />
                            {strength}
                          </li>
                        )) || <li className="text-gray-500">No strengths identified</li>}
                      </ul>
                    </div>

                    {/* Weaknesses */}
                    <div className="bg-red-50 rounded-xl p-6 border border-red-200">
                      <h3 className="text-lg font-semibold text-red-700 mb-3 flex items-center gap-2">
                        <FiThumbsDown />
                        Areas for Improvement
                      </h3>
                      <ul className="space-y-2">
                        {result.weaknesses?.map((weakness, index) => (
                          <li key={index} className="flex items-start text-gray-700">
                            <FiX className="text-red-500 mr-2 mt-0.5 flex-shrink-0" size={16} />
                            {weakness}
                          </li>
                        )) || <li className="text-gray-500">No weaknesses identified</li>}
                      </ul>
                    </div>
                  </div>
                )}

                {activeTab === 'keywords' && (
                  <div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="bg-green-50 rounded-xl p-6 border border-green-200">
                        <h3 className="text-lg font-semibold text-green-700 mb-3 flex items-center gap-2">
                          <FiCheckCircle />
                          Found Keywords
                        </h3>
                        <div className="flex flex-wrap gap-2">
                          {result.foundKeywords?.map((keyword, index) => (
                            <span key={index} className="bg-white text-green-700 px-3 py-1.5 rounded-lg text-sm font-medium border border-green-200 shadow-sm">
                              {keyword}
                            </span>
                          )) || <span className="text-gray-500">No keywords found</span>}
                        </div>
                      </div>
                      <div className="bg-yellow-50 rounded-xl p-6 border border-yellow-200">
                        <h3 className="text-lg font-semibold text-yellow-700 mb-3 flex items-center gap-2">
                          <FiAlertCircle />
                          Missing Keywords
                        </h3>
                        <div className="flex flex-wrap gap-2">
                          {result.missingKeywords?.map((keyword, index) => (
                            <span key={index} className="bg-white text-yellow-700 px-3 py-1.5 rounded-lg text-sm font-medium border border-yellow-200 shadow-sm">
                              {keyword}
                            </span>
                          )) || <span className="text-gray-500">No missing keywords</span>}
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === 'sections' && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {result.sections?.map((section, index) => (
                      <div key={index} className="bg-white rounded-xl p-6 border border-gray-200 hover:shadow-md transition-shadow">
                        <div className="flex items-center justify-between mb-3">
                          <h3 className="text-lg font-semibold text-gray-800">
                            {section.name}
                          </h3>
                          <span className={`px-3 py-1 rounded-full text-sm font-medium ${getScoreBg(section.score)} ${getScoreColor(section.score)}`}>
                            {section.score}%
                          </span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2 mb-3">
                          <div 
                            className={`h-2 rounded-full transition-all duration-1000 ${
                              section.score >= 80 ? 'bg-green-500' :
                              section.score >= 60 ? 'bg-yellow-500' : 'bg-red-500'
                            }`}
                            style={{ width: `${section.score}%` }}
                          />
                        </div>
                        <p className="text-sm text-gray-600">{section.feedback}</p>
                        {section.missingItems && section.missingItems.length > 0 && (
                          <div className="mt-3 pt-3 border-t border-gray-100">
                            <p className="text-xs text-gray-500 font-medium flex items-center gap-1">
                              <FiAlertCircle size={12} />
                              Missing Items:
                            </p>
                            <ul className="mt-1 space-y-1">
                              {section.missingItems.map((item, idx) => (
                                <li key={idx} className="text-xs text-gray-400 flex items-center gap-1">
                                  <FiMinus size={10} />
                                  {item}
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>
                    )) || (
                      <div className="col-span-2 text-center text-gray-500 py-8">
                        <FiInfo className="text-2xl mx-auto mb-2" />
                        No section analysis available
                      </div>
                    )}
                  </div>
                )}

                {activeTab === 'suggestions' && (
                  <div className="bg-purple-50 rounded-xl p-6 border border-purple-200">
                    <h3 className="text-lg font-semibold text-purple-700 mb-4 flex items-center gap-2">
                      <FiCompass />
                      Improvement Suggestions
                    </h3>
                    <ul className="space-y-3">
                      {result.suggestions?.map((suggestion, index) => (
                        <li key={index} className="flex items-start text-gray-700 bg-white rounded-lg p-4 border border-purple-100 shadow-sm hover:shadow-md transition-shadow">
                          <span className="text-purple-500 mr-3 mt-0.5">
                            <FiCompass size={18} />
                          </span>
                          <span>{suggestion}</span>
                        </li>
                      )) || (
                        <li className="text-gray-500 text-center py-4">
                          <FiCheckCircle className="text-2xl text-green-500 mx-auto mb-2" />
                          No suggestions available. Your resume looks great!
                        </li>
                      )}
                    </ul>
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap gap-3 mt-8 pt-6 border-t border-gray-200">
                <button
                  onClick={() => {
                    setResult(null);
                    setFile(null);
                    if (fileInputRef.current) fileInputRef.current.value = '';
                  }}
                  className="flex items-center gap-2 px-4 py-2 text-blue-600 hover:text-blue-700 font-medium transition-colors border border-blue-200 rounded-lg hover:bg-blue-50"
                >
                  <FiRefreshCw />
                  Analyze Another Resume
                </button>
                <button
                  onClick={generatePDFReport}
                  disabled={downloading}
                  className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all font-medium shadow-sm hover:shadow-md disabled:opacity-50"
                >
                  {downloading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      Generating...
                    </>
                  ) : (
                    <>
                      <FiDownload />
                      Download Report
                    </>
                  )}
                </button>
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ATSCheck;