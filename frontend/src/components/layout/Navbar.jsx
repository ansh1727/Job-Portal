import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Briefcase, Moon, Sun, Menu, X, LogOut, User } from 'lucide-react';
import { useState } from 'react';
import { logout } from '../../redux/slices/authSlice';
import { toggleTheme } from '../../redux/slices/themeSlice';
import Button from '../ui/Button';
import { cn } from '../../utils/helpers';

const Navbar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isAuthenticated, user } = useSelector((state) => state.auth);
  const { mode } = useSelector((state) => state.theme);
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleLogout = async () => {
    await dispatch(logout());
    navigate('/');
  };

  const dashboardLinks = {
    candidate: [
      { to: '/candidate/dashboard', label: 'Dashboard' },
      { to: '/jobs', label: 'Browse Jobs' },
      { to: '/candidate/applications', label: 'Applications' },
      { to: '/candidate/saved', label: 'Saved Jobs' },
      { to: '/candidate/profile', label: 'Profile' },
    ],
    recruiter: [
      { to: '/recruiter/dashboard', label: 'Dashboard' },
      { to: '/recruiter/company', label: 'Company' },
      { to: '/recruiter/jobs', label: 'My Jobs' },
      { to: '/recruiter/jobs/new', label: 'Post Job' },
    ],
    admin: [
      { to: '/admin/dashboard', label: 'Dashboard' },
      { to: '/admin/users', label: 'Users' },
      { to: '/admin/jobs', label: 'Jobs' },
      { to: '/admin/companies', label: 'Companies' },
    ],
  };

  const links = isAuthenticated && user ? dashboardLinks[user.role] || [] : [];

  return (
    <nav className="sticky top-0 z-50 border-b border-gray-200 bg-white/80 backdrop-blur-md dark:border-gray-800 dark:bg-gray-950/80">
      <div className="container-app flex h-16 items-center justify-between">
        <Link to="/" className="flex items-center gap-2 text-xl font-bold text-primary-600">
          <Briefcase className="h-7 w-7" />
          Job Portal
        </Link>

        <div className="hidden items-center gap-6 md:flex">
          {!isAuthenticated && (
            <>
              <Link to="/jobs" className="text-sm font-medium text-gray-600 hover:text-primary-600 dark:text-gray-300">
                Browse Jobs
              </Link>
              <Link to="/login" className="text-sm font-medium text-gray-600 hover:text-primary-600 dark:text-gray-300">
                Login
              </Link>
              <Link to="/register">
                <Button size="sm">Get Started</Button>
              </Link>
            </>
          )}

          {links.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className="text-sm font-medium text-gray-600 hover:text-primary-600 dark:text-gray-300"
            >
              {link.label}
            </Link>
          ))}

          <button
            onClick={() => dispatch(toggleTheme())}
            className="rounded-lg p-2 text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800"
            aria-label="Toggle theme"
          >
            {mode === 'dark' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
          </button>

          {isAuthenticated && (
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 text-sm">
                <User className="h-4 w-4" />
                <span className="font-medium">{user?.name}</span>
              </div>
              <Button variant="ghost" size="sm" onClick={handleLogout}>
                <LogOut className="h-4 w-4" />
              </Button>
            </div>
          )}
        </div>

        <div className="flex items-center gap-2 md:hidden">
          <button
            onClick={() => dispatch(toggleTheme())}
            className="rounded-lg p-2 text-gray-600 dark:text-gray-300"
          >
            {mode === 'dark' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
          </button>
          <button onClick={() => setMobileOpen(!mobileOpen)} className="rounded-lg p-2">
            {mobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {mobileOpen && (
        <div className="border-t border-gray-200 bg-white px-4 py-4 dark:border-gray-800 dark:bg-gray-950 md:hidden">
          <div className="flex flex-col gap-3">
            {!isAuthenticated ? (
              <>
                <Link to="/jobs" onClick={() => setMobileOpen(false)}>Browse Jobs</Link>
                <Link to="/login" onClick={() => setMobileOpen(false)}>Login</Link>
                <Link to="/register" onClick={() => setMobileOpen(false)}>Register</Link>
              </>
            ) : (
              <>
                {links.map((link) => (
                  <Link key={link.to} to={link.to} onClick={() => setMobileOpen(false)}>
                    {link.label}
                  </Link>
                ))}
                <button onClick={handleLogout} className="text-left text-red-600">Logout</button>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
