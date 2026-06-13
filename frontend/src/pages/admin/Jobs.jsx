import { Helmet } from 'react-helmet-async';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { adminAPI } from '../../api/services';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Badge from '../../components/ui/Badge';
import { TableSkeleton } from '../../components/ui/Skeleton';
import { formatDate, formatSalary } from '../../utils/helpers';

const AdminJobs = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    adminAPI.getJobs()
      .then(({ data }) => setJobs(data.jobs))
      .finally(() => setLoading(false));
  }, []);

  const toggleStatus = async (id) => {
    try {
      const { data } = await adminAPI.toggleJobStatus(id);
      setJobs((prev) => prev.map((j) => (j._id === id ? data.job : j)));
      toast.success('Job status updated');
    } catch {
      toast.error('Failed to update job');
    }
  };

  return (
    <>
      <Helmet><title>Manage Jobs - Job Portal</title></Helmet>
      <div className="container-app py-8">
        <h1 className="text-3xl font-bold">Manage Jobs</h1>

        <div className="mt-8 space-y-3">
          {loading ? (
            <TableSkeleton />
          ) : (
            jobs.map((job) => (
              <Card key={job._id}>
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <h3 className="font-semibold">{job.title}</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {job.company?.companyName} · {formatSalary(job.salary?.min, job.salary?.max)}
                    </p>
                    <p className="text-xs text-gray-500">Posted by {job.postedBy?.name} · {formatDate(job.createdAt)}</p>
                    <Badge variant={job.isActive ? 'success' : 'danger'} className="mt-2">
                      {job.isActive ? 'Active' : 'Inactive'}
                    </Badge>
                  </div>
                  <Button variant="outline" size="sm" onClick={() => toggleStatus(job._id)}>
                    {job.isActive ? 'Deactivate' : 'Activate'}
                  </Button>
                </div>
              </Card>
            ))
          )}
        </div>
      </div>
    </>
  );
};

export default AdminJobs;
