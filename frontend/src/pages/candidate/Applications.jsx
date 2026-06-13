import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { applicationAPI } from '../../api/services';
import Badge from '../../components/ui/Badge';
import Card from '../../components/ui/Card';
import { TableSkeleton } from '../../components/ui/Skeleton';
import { formatDate, formatStatus, statusColors } from '../../utils/helpers';
import Select from '../../components/ui/Select';
import { applicationStatuses } from '../../utils/helpers';

const CandidateApplications = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('');

  useEffect(() => {
    setLoading(true);
    applicationAPI.getMy({ status: statusFilter || undefined })
      .then(({ data }) => setApplications(data.applications))
      .finally(() => setLoading(false));
  }, [statusFilter]);

  return (
    <>
      <Helmet><title>My Applications - Job Portal</title></Helmet>
      <div className="container-app py-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold">My Applications</h1>
            <p className="mt-2 text-gray-600 dark:text-gray-400">Track your job application status</p>
          </div>
          <Select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            options={[
              { value: '', label: 'All Statuses' },
              ...applicationStatuses.map((s) => ({ value: s, label: formatStatus(s) })),
            ]}
            className="w-full sm:w-48"
          />
        </div>

        <div className="mt-8 space-y-4">
          {loading ? (
            <TableSkeleton />
          ) : applications.length === 0 ? (
            <Card className="text-center py-12">
              <p className="text-gray-500">No applications yet.</p>
              <Link to="/jobs" className="mt-4 inline-block text-primary-600 hover:underline">
                Browse Jobs
              </Link>
            </Card>
          ) : (
            applications.map((app) => (
              <Card key={app._id}>
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <Link to={`/jobs/${app.job?._id}`} className="text-lg font-semibold hover:text-primary-600">
                      {app.job?.title}
                    </Link>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {app.job?.company?.companyName}
                    </p>
                    <p className="mt-1 text-xs text-gray-500">Applied on {formatDate(app.createdAt)}</p>
                  </div>
                  <span className={`inline-flex rounded-full px-3 py-1 text-xs font-medium ${statusColors[app.status]}`}>
                    {formatStatus(app.status)}
                  </span>
                </div>
              </Card>
            ))
          )}
        </div>
      </div>
    </>
  );
};

export default CandidateApplications;
