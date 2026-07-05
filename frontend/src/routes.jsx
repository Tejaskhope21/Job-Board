import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Home from './pages/Home';
import About from './pages/About';
import Contact from './pages/Contact';
import Login from './components/auth/Login';
import Register from './components/auth/Register';
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

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/about" element={<About />} />
      <Route path="/contact" element={<Contact />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/jobs" element={<JobListings />} />
      <Route path="/jobs/:id" element={<JobDetails />} />
      
      {/* Candidate Routes */}
      <Route element={<PrivateRoute allowedRoles={['candidate']} />}>
        <Route path="/candidate/dashboard" element={<CandidateDashboard />} />
        <Route path="/candidate/applications" element={<MyApplications />} />
        <Route path="/candidate/profile" element={<Profile />} />
      </Route>
      
      {/* Employer Routes */}
      <Route element={<PrivateRoute allowedRoles={['employer']} />}>
        <Route path="/employer/dashboard" element={<EmployerDashboard />} />
        <Route path="/employer/post-job" element={<PostJob />} />
        <Route path="/employer/jobs" element={<MyJobs />} />
        <Route path="/employer/applications/:jobId" element={<JobApplications />} />
      </Route>
      
      {/* Admin Routes */}
      <Route element={<PrivateRoute allowedRoles={['admin']} />}>
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
        <Route path="/admin/users" element={<ManageUsers />} />
        <Route path="/admin/jobs" element={<ManageJobs />} />
      </Route>
      
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
};

export default AppRoutes;