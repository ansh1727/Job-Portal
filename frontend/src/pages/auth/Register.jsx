import { Helmet } from 'react-helmet-async';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { register, clearError } from '../../redux/slices/authSlice';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Select from '../../components/ui/Select';
import Card from '../../components/ui/Card';

const Register = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const defaultRole = searchParams.get('role') === 'recruiter' ? 'recruiter' : 'candidate';
  const { loading, error, isAuthenticated, user } = useSelector((state) => state.auth);
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: defaultRole,
  });

  useEffect(() => {
    setForm((prev) => ({ ...prev, role: defaultRole }));
  }, [defaultRole]);

  useEffect(() => {
    if (isAuthenticated && user) {
      const routes = {
        candidate: '/candidate/dashboard',
        recruiter: '/recruiter/dashboard',
      };
      navigate(routes[user.role] || '/');
    }
  }, [isAuthenticated, user, navigate]);

  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch(clearError());
    }
  }, [error, dispatch]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.password !== form.confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }
    const result = await dispatch(
      register({ name: form.name, email: form.email, password: form.password, role: form.role })
    );
    if (register.fulfilled.match(result)) {
      toast.success('Account created successfully!');
      const routes = {
        candidate: '/candidate/dashboard',
        recruiter: '/recruiter/dashboard',
      };
      navigate(routes[result.payload.role] || '/');
    }
  };

  return (
    <>
      <Helmet><title>Register - Job Portal</title></Helmet>
      <div className="flex min-h-[calc(100vh-8rem)] items-center justify-center py-12">
        <Card className="w-full max-w-md">
          <h1 className="text-2xl font-bold">Create Account</h1>
          <p className="mt-2 text-gray-600 dark:text-gray-400">Join Job Portal today</p>

          <form onSubmit={handleSubmit} className="mt-8 space-y-4">
            <Input
              label="Full Name"
              required
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
            />
            <Input
              label="Email"
              type="email"
              required
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
            />
            <Select
              label="I am a"
              value={form.role}
              onChange={(e) => setForm({ ...form, role: e.target.value })}
              options={[
                { value: 'candidate', label: 'Job Seeker (Candidate)' },
                { value: 'recruiter', label: 'Recruiter / Employer' },
              ]}
            />
            <Input
              label="Password"
              type="password"
              required
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
            />
            <Input
              label="Confirm Password"
              type="password"
              required
              value={form.confirmPassword}
              onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })}
            />
            <Button type="submit" className="w-full" loading={loading}>
              Create Account
            </Button>
          </form>

          <p className="mt-6 text-center text-sm text-gray-600 dark:text-gray-400">
            Already have an account?{' '}
            <Link to="/login" className="font-medium text-primary-600 hover:underline">
              Sign In
            </Link>
          </p>
        </Card>
      </div>
    </>
  );
};

export default Register;
