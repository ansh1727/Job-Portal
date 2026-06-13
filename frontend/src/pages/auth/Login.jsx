import { Helmet } from 'react-helmet-async';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { login, clearError } from '../../redux/slices/authSlice';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Card from '../../components/ui/Card';

const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { loading, error, isAuthenticated, user } = useSelector((state) => state.auth);
  const [form, setForm] = useState({ email: '', password: '' });

  const getRedirectPath = (role, fromPath) => {
    const roleRoutes = {
      candidate: '/candidate/dashboard',
      recruiter: '/recruiter/dashboard',
      admin: '/admin/dashboard',
    };

    if (fromPath) {
      if (fromPath.startsWith('/admin') && role === 'admin') return fromPath;
      if (fromPath.startsWith('/recruiter') && role === 'recruiter') return fromPath;
      if (fromPath.startsWith('/candidate') && role === 'candidate') return fromPath;
    }

    return roleRoutes[role] || '/';
  };

  const fromPath = location.state?.from?.pathname;

  useEffect(() => {
    if (isAuthenticated && user) {
      navigate(getRedirectPath(user.role, fromPath), { replace: true });
    }
  }, [isAuthenticated, user, navigate, fromPath]);

  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch(clearError());
    }
  }, [error, dispatch]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const result = await dispatch(login(form));
    if (login.fulfilled.match(result)) {
      toast.success('Welcome back!');
      navigate(getRedirectPath(result.payload.role, fromPath), { replace: true });
    }
  };

  return (
    <>
      <Helmet><title>Login - Job Portal</title></Helmet>
      <div className="flex min-h-[calc(100vh-8rem)] items-center justify-center py-12">
        <Card className="w-full max-w-md">
          <h1 className="text-2xl font-bold">Welcome Back</h1>
          <p className="mt-2 text-gray-600 dark:text-gray-400">Sign in to your account</p>

          <form onSubmit={handleSubmit} className="mt-8 space-y-4">
            <Input
              label="Email"
              type="email"
              required
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
            />
            <Input
              label="Password"
              type="password"
              required
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
            />
            <Button type="submit" className="w-full" loading={loading}>
              Sign In
            </Button>
          </form>

          <p className="mt-6 text-center text-sm text-gray-600 dark:text-gray-400">
            Don&apos;t have an account?{' '}
            <Link to="/register" className="font-medium text-primary-600 hover:underline">
              Register
            </Link>
          </p>
        </Card>
      </div>
    </>
  );
};

export default Login;
