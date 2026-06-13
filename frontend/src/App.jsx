import { Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import AuthInitializer from './components/auth/AuthInitializer';
import ScrollToTop from './components/layout/ScrollToTop';
import Layout from './components/layout/Layout';
import ProtectedRoute from './components/auth/ProtectedRoute';
import Home from './pages/Home';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import Jobs from './pages/jobs/Jobs';
import JobDetail from './pages/jobs/JobDetail';
import CandidateDashboard from './pages/candidate/Dashboard';
import CandidateProfile from './pages/candidate/Profile';
import CandidateApplications from './pages/candidate/Applications';
import SavedJobs from './pages/candidate/SavedJobs';
import RecruiterDashboard from './pages/recruiter/Dashboard';
import CompanyProfile from './pages/recruiter/CompanyProfile';
import ManageJobs from './pages/recruiter/ManageJobs';
import PostJob from './pages/recruiter/PostJob';
import Applicants from './pages/recruiter/Applicants';
import AdminDashboard from './pages/admin/Dashboard';
import AdminUsers from './pages/admin/Users';
import AdminJobs from './pages/admin/Jobs';
import AdminCompanies from './pages/admin/Companies';

function App() {
  return (
    <AuthInitializer>
      <>
        <ScrollToTop />
        <Toaster
        position="top-right"
        toastOptions={{
          className: 'dark:bg-gray-800 dark:text-gray-100',
          duration: 4000,
        }}
      />
      <Routes>
        <Route element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="login" element={<Login />} />
          <Route path="register" element={<Register />} />
          <Route path="jobs" element={<Jobs />} />
          <Route path="jobs/:id" element={<JobDetail />} />

          <Route
            path="candidate/dashboard"
            element={
              <ProtectedRoute roles={['candidate']}>
                <CandidateDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="candidate/profile"
            element={
              <ProtectedRoute roles={['candidate']}>
                <CandidateProfile />
              </ProtectedRoute>
            }
          />
          <Route
            path="candidate/applications"
            element={
              <ProtectedRoute roles={['candidate']}>
                <CandidateApplications />
              </ProtectedRoute>
            }
          />
          <Route
            path="candidate/saved"
            element={
              <ProtectedRoute roles={['candidate']}>
                <SavedJobs />
              </ProtectedRoute>
            }
          />

          <Route
            path="recruiter/dashboard"
            element={
              <ProtectedRoute roles={['recruiter']}>
                <RecruiterDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="recruiter/company"
            element={
              <ProtectedRoute roles={['recruiter']}>
                <CompanyProfile />
              </ProtectedRoute>
            }
          />
          <Route
            path="recruiter/jobs"
            element={
              <ProtectedRoute roles={['recruiter']}>
                <ManageJobs />
              </ProtectedRoute>
            }
          />
          <Route
            path="recruiter/jobs/new"
            element={
              <ProtectedRoute roles={['recruiter']}>
                <PostJob />
              </ProtectedRoute>
            }
          />
          <Route
            path="recruiter/jobs/:id/edit"
            element={
              <ProtectedRoute roles={['recruiter']}>
                <PostJob />
              </ProtectedRoute>
            }
          />
          <Route
            path="recruiter/jobs/:jobId/applicants"
            element={
              <ProtectedRoute roles={['recruiter']}>
                <Applicants />
              </ProtectedRoute>
            }
          />

          <Route
            path="admin/dashboard"
            element={
              <ProtectedRoute roles={['admin']}>
                <AdminDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="admin/users"
            element={
              <ProtectedRoute roles={['admin']}>
                <AdminUsers />
              </ProtectedRoute>
            }
          />
          <Route
            path="admin/jobs"
            element={
              <ProtectedRoute roles={['admin']}>
                <AdminJobs />
              </ProtectedRoute>
            }
          />
          <Route
            path="admin/companies"
            element={
              <ProtectedRoute roles={['admin']}>
                <AdminCompanies />
              </ProtectedRoute>
            }
          />
        </Route>
      </Routes>
      </>
    </AuthInitializer>
  );
}

export default App;
