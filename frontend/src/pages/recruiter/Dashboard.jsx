import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { Briefcase, Building2, Users, Plus } from 'lucide-react';
import { jobAPI, companyAPI } from '../../api/services';
import StatCard from '../../components/ui/StatCard';
import Card, { CardTitle } from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import { DashboardSkeleton } from '../../components/ui/Skeleton';

const RecruiterDashboard = () => {
  const [stats, setStats] = useState({ jobs: 0, hasCompany: false });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      jobAPI.getMy(),
      companyAPI.getMy().catch(() => null),
    ]).then(([jobsRes, companyRes]) => {
      setStats({
        jobs: jobsRes.data.count,
        hasCompany: !!companyRes?.data?.company,
        totalApplications: jobsRes.data.jobs?.reduce((sum, j) => sum + (j.applicationsCount || 0), 0) || 0,
      });
    }).finally(() => setLoading(false));
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
      <Helmet><title>Recruiter Dashboard - Job Portal</title></Helmet>
      <div className="container-app py-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold">Recruiter Dashboard</h1>
            <p className="mt-2 text-gray-600 dark:text-gray-400">Manage your jobs and applicants</p>
          </div>
          <Link to="/recruiter/jobs/new">
            <Button><Plus className="h-4 w-4" /> Post New Job</Button>
          </Link>
        </div>

        {!stats.hasCompany && (
          <Card className="mt-8 border-yellow-300 bg-yellow-50 dark:border-yellow-700 dark:bg-yellow-900/20">
            <CardTitle>Create Your Company Profile</CardTitle>
            <p className="mt-2 text-gray-600 dark:text-gray-400">
              You need to set up your company profile before posting jobs.
            </p>
            <Link to="/recruiter/company" className="mt-4 inline-block">
              <Button>Set Up Company</Button>
            </Link>
          </Card>
        )}

        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          <StatCard title="Active Jobs" value={stats.jobs} icon={Briefcase} color="primary" link="/recruiter/jobs" />
          <StatCard title="Total Applications" value={stats.totalApplications} icon={Users} color="green" />
          <StatCard title="Company Profile" value={stats.hasCompany ? 'Complete' : 'Incomplete'} icon={Building2} color="purple" link="/recruiter/company" />
        </div>
      </div>
    </>
  );
};

export default RecruiterDashboard;
