import { Link, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import toast from 'react-hot-toast';
import { Briefcase } from 'lucide-react';

const roleDashboards = {
  candidate: '/candidate/dashboard',
  recruiter: '/recruiter/dashboard',
  admin: '/admin/dashboard',
};

const FooterLink = ({ to, children, requiredRole, registerRole }) => {
  const navigate = useNavigate();
  const { isAuthenticated, user } = useSelector((state) => state.auth);

  if (registerRole) {
    return (
      <li>
        <Link
          to={`/register?role=${registerRole}`}
          className="cursor-pointer hover:text-primary-600 dark:hover:text-primary-400"
        >
          {children}
        </Link>
      </li>
    );
  }

  if (!requiredRole) {
    return (
      <li>
        <Link
          to={to}
          className="cursor-pointer hover:text-primary-600 dark:hover:text-primary-400"
        >
          {children}
        </Link>
      </li>
    );
  }

  const handleClick = (e) => {
    e.preventDefault();

    if (!isAuthenticated) {
      navigate('/login', { state: { from: { pathname: to } } });
      return;
    }

    if (user?.role !== requiredRole) {
      toast.error(`This page is for ${requiredRole}s. Redirecting to your dashboard.`);
      navigate(roleDashboards[user?.role] || '/');
      return;
    }

    navigate(to);
  };

  return (
    <li>
      <button
        type="button"
        onClick={handleClick}
        className="cursor-pointer text-left hover:text-primary-600 dark:hover:text-primary-400"
      >
        {children}
      </button>
    </li>
  );
};

const Footer = () => (
  <footer className="relative z-10 border-t border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-950">
    <div className="container-app py-12">
      <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-5">
        <div className="lg:col-span-1">
          <Link
            to="/"
            className="flex items-center gap-2 text-lg font-bold text-primary-600 hover:text-primary-700"
          >
            <Briefcase className="h-6 w-6" />
            Job Portal
          </Link>
          <p className="mt-3 text-sm text-gray-600 dark:text-gray-400">
            Job search and hiring app built with React and Node.
          </p>
        </div>

        <div>
          <h4 className="mb-3 text-sm font-semibold">Explore</h4>
          <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
            <FooterLink to="/">Home</FooterLink>
            <FooterLink to="/jobs">Browse Jobs</FooterLink>
            <FooterLink to="/login">Login</FooterLink>
            <FooterLink to="/register">Register</FooterLink>
          </ul>
        </div>

        <div>
          <h4 className="mb-3 text-sm font-semibold">For Candidates</h4>
          <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
            <FooterLink registerRole="candidate">Create Account</FooterLink>
            <FooterLink to="/jobs">Search Jobs</FooterLink>
            <FooterLink to="/candidate/dashboard" requiredRole="candidate">Dashboard</FooterLink>
            <FooterLink to="/candidate/profile" requiredRole="candidate">My Profile</FooterLink>
            <FooterLink to="/candidate/applications" requiredRole="candidate">My Applications</FooterLink>
            <FooterLink to="/candidate/saved" requiredRole="candidate">Saved Jobs</FooterLink>
          </ul>
        </div>

        <div>
          <h4 className="mb-3 text-sm font-semibold">For Recruiters</h4>
          <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
            <FooterLink registerRole="recruiter">Sign Up as Recruiter</FooterLink>
            <FooterLink to="/login">Recruiter Login</FooterLink>
            <FooterLink to="/recruiter/dashboard" requiredRole="recruiter">Dashboard</FooterLink>
            <FooterLink to="/recruiter/company" requiredRole="recruiter">Company Profile</FooterLink>
            <FooterLink to="/recruiter/jobs" requiredRole="recruiter">My Jobs</FooterLink>
            <FooterLink to="/recruiter/jobs/new" requiredRole="recruiter">Post a Job</FooterLink>
          </ul>
        </div>

        <div>
          <h4 className="mb-3 text-sm font-semibold">Admin</h4>
          <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
            <FooterLink to="/admin/dashboard" requiredRole="admin">Admin Dashboard</FooterLink>
            <FooterLink to="/admin/users" requiredRole="admin">Manage Users</FooterLink>
            <FooterLink to="/admin/jobs" requiredRole="admin">Manage Jobs</FooterLink>
            <FooterLink to="/admin/companies" requiredRole="admin">Manage Companies</FooterLink>
          </ul>
        </div>
      </div>

      <div className="mt-8 border-t border-gray-200 pt-8 text-center text-sm text-gray-500 dark:border-gray-800">
        &copy; {new Date().getFullYear()} Job Portal
      </div>
    </div>
  </footer>
);

export default Footer;
