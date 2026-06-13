import { Helmet } from 'react-helmet-async';
import { useEffect, useState } from 'react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  LineChart, Line, PieChart, Pie, Cell,
} from 'recharts';
import { adminAPI } from '../../api/services';
import StatCard from '../../components/ui/StatCard';
import Card, { CardTitle } from '../../components/ui/Card';
import { DashboardSkeleton } from '../../components/ui/Skeleton';
import { Users, Briefcase, FileText, Building2 } from 'lucide-react';

const COLORS = ['#3b82f6', '#10b981', '#8b5cf6', '#f59e0b'];

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [trends, setTrends] = useState([]);
  const [recruiterActivity, setRecruiterActivity] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      adminAPI.getStats(),
      adminAPI.getApplicationTrends(),
      adminAPI.getRecruiterActivity(),
    ]).then(([statsRes, trendsRes, activityRes]) => {
      setStats(statsRes.data.stats);
      setTrends(trendsRes.data.trends);
      setRecruiterActivity(activityRes.data.activity);
    }).finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="container-app py-8">
        <DashboardSkeleton />
      </div>
    );
  }

  const userPieData = [
    { name: 'Candidates', value: stats?.totalCandidates || 0 },
    { name: 'Recruiters', value: stats?.totalRecruiters || 0 },
  ];

  return (
    <>
      <Helmet><title>Admin Dashboard - Job Portal</title></Helmet>
      <div className="container-app py-8">
        <h1 className="text-3xl font-bold">Admin Dashboard</h1>
        <p className="mt-2 text-gray-600 dark:text-gray-400">Platform analytics and management</p>

        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard title="Total Users" value={stats?.totalUsers || 0} icon={Users} color="primary" />
          <StatCard title="Total Jobs" value={stats?.totalJobs || 0} icon={Briefcase} color="green" />
          <StatCard title="Applications" value={stats?.totalApplications || 0} icon={FileText} color="purple" />
          <StatCard title="Companies" value={stats?.totalCompanies || 0} icon={Building2} color="orange" />
        </div>

        <div className="mt-8 grid gap-6 lg:grid-cols-2">
          <Card>
            <CardTitle>Application Trends</CardTitle>
            <div className="mt-4 h-72">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={trends}>
                  <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                  <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                  <YAxis tick={{ fontSize: 12 }} />
                  <Tooltip />
                  <Line type="monotone" dataKey="applications" stroke="#3b82f6" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </Card>

          <Card>
            <CardTitle>User Distribution</CardTitle>
            <div className="mt-4 h-72">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={userPieData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={100} label>
                    {userPieData.map((_, i) => (
                      <Cell key={i} fill={COLORS[i % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </Card>

          <Card className="lg:col-span-2">
            <CardTitle>Recruiter Activity</CardTitle>
            <div className="mt-4 h-72">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={recruiterActivity}>
                  <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                  <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                  <YAxis tick={{ fontSize: 12 }} />
                  <Tooltip />
                  <Bar dataKey="jobsPosted" fill="#3b82f6" name="Jobs Posted" />
                  <Bar dataKey="totalApplications" fill="#10b981" name="Applications" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </div>
      </div>
    </>
  );
};

export default AdminDashboard;
