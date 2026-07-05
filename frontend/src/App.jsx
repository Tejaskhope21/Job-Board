import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/common/Navbar';
import Footer from './components/common/Footer';
import Home from './pages/Home';
import About from './pages/About';
import Contact from './pages/Contact';
import Login from './auth/Login';
import Register from './auth/Register';
import CandidateDashboard from './components/candidate/CandidateDashboard';
import JobListings from './components/candidate/JobListings';
import JobDetails from './components/candidate/JobDetails';
import MyApplications from './components/candidate/MyApplications';
import Profile from './components/candidate/Profile';
import EmployerDashboard from './components/employer/EmployerDashboard';
import PostJob from './components/employer/PostJob';
import MyJobs from './components/employer/MyJobs';
import JobApplications from './components/employer/JobApplications';
import AdminDashboard from './components/admin/AdminDashboard';
import ManageUsers from './components/admin/ManageUsers';
import ManageJobs from './components/admin/ManageJobs';
import PrivateRoute from './components/common/PrivateRoute';
import MatchedJobs from './components/candidate/MatchedJobs';
import ResumePage from './components/candidate/ResumePage';
import ATSCheck from './components/candidate/ATSCheck';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen flex flex-col" style={{ backgroundColor: '#fcfaf4' }}>
          <Navbar />
          <main className="flex-grow">
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<Home />} />
              <Route path="/about" element={<About />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/jobs" element={<JobListings />} />
              <Route path="/jobs/:id" element={<JobDetails />} />
              <Route path="/ats-check" element={<ATSCheck />} />
              
              {/* Protected Routes - All authenticated users */}
              <Route element={<PrivateRoute />}>
                <Route path="/profile" element={<Profile />} />
              </Route>
              
              {/* Candidate Routes */}
              <Route element={<PrivateRoute allowedRoles={['candidate']} />}>
                <Route path="/candidate/dashboard" element={<CandidateDashboard />} />
                <Route path="/candidate/applications" element={<MyApplications />} />
                <Route path="/candidate/matched-jobs" element={<MatchedJobs />} />
                <Route path="/candidate/resume" element={<ResumePage />} />
                <Route path="/candidate/ats-check" element={<ATSCheck />} />

              </Route>
              
              {/* Employer Routes */}
              <Route element={<PrivateRoute allowedRoles={['employer']} />}>
                <Route path="/employer/dashboard" element={<EmployerDashboard />} />
                <Route path="/employer/post-job" element={<PostJob />} />
                <Route path="/employer/my-jobs" element={<MyJobs />} />
                <Route path="/employer/applications/:jobId" element={<JobApplications />} />
              </Route>
              
              {/* Admin Routes */}
              <Route element={<PrivateRoute allowedRoles={['admin']} />}>
                <Route path="/admin/dashboard" element={<AdminDashboard />} />
                <Route path="/admin/users" element={<ManageUsers />} />
                <Route path="/admin/jobs" element={<ManageJobs />} />
              </Route>
              
              {/* 404 - Catch all */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </main>
          <Footer />
          <Toaster 
            position="top-right"
            toastOptions={{
              duration: 4000,
              style: {
                background: '#fff',
                color: '#333',
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
                marginTop: '80px', // Add margin to push toast below navbar
              },
              success: {
                iconTheme: {
                  primary: '#10B981',
                  secondary: '#fff',
                },
              },
              error: {
                iconTheme: {
                  primary: '#EF4444',
                  secondary: '#fff',
                },
              },
            }}
          />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;