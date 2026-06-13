import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { FileText, Bookmark, User, TrendingUp } from 'lucide-react';
import { userAPI } from '../../api/services';
import StatCard from '../../components/ui/StatCard';
import Card, { CardTitle } from '../../components/ui/Card';
import { DashboardSkeleton } from '../../components/ui/Skeleton';
import Button from '../../components/ui/Button';
import { useSelector } from 'react-redux';

const CandidateDashboard = () => {
  const { user } = useSelector((state) => state.auth);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    userAPI.getDashboard()
      .then(({ data }) => setStats(data.data))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="container-app py-8">
        <DashboardSkeleton />
      </div>
    );
  }

  return (
    <>
      <Helmet><title>Dashboard - Job Portal</title></Helmet>
      <div className="container-app py-8">
        <h1 className="text-3xl font-bold">Welcome, {user?.name}!</h1>
        <p className="mt-2 text-gray-600 dark:text-gray-400">Track your job search progress</p>

        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard
            title="Total Applications"
            value={stats?.totalApplications || 0}
            icon={FileText}
            color="primary"
            link="/candidate/applications"
          />
          <StatCard
            title="Saved Jobs"
            value={stats?.savedJobs || 0}
            icon={Bookmark}
            color="green"
            link="/candidate/saved"
          />
          <StatCard
            title="Profile Completion"
            value={`${stats?.profileCompletion || 0}%`}
            icon={TrendingUp}
            color="purple"
            link="/candidate/profile"
          />
          <StatCard title="Account Status" value="Active" icon={User} color="orange" />
        </div>

        {stats?.profileCompletion < 100 && (
          <Card className="mt-8">
            <CardTitle>Complete Your Profile</CardTitle>
            <p className="mt-2 text-gray-600 dark:text-gray-400">
              Your profile is {stats?.profileCompletion}% complete. A complete profile increases your chances of getting hired.
            </p>
            <div className="mt-4 h-2 overflow-hidden rounded-full bg-gray-200 dark:bg-gray-700">
              <div
                className="h-full rounded-full bg-primary-600 transition-all"
                style={{ width: `${stats?.profileCompletion}%` }}
              />
            </div>
            <Link to="/candidate/profile" className="mt-4 inline-block">
              <Button>Update Profile</Button>
            </Link>
          </Card>
        )}

        <div className="mt-8 grid gap-6 md:grid-cols-2">
          <Card>
            <CardTitle>Quick Actions</CardTitle>
            <div className="mt-4 flex flex-wrap gap-3">
              <Link to="/jobs"><Button variant="outline">Browse Jobs</Button></Link>
              <Link to="/candidate/applications"><Button variant="outline">View Applications</Button></Link>
              <Link to="/candidate/saved"><Button variant="outline">Saved Jobs</Button></Link>
            </div>
          </Card>
        </div>
      </div>
    </>
  );
};

export default CandidateDashboard;
