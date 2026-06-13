import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { jobAPI } from '../../api/services';
import Button from '../../components/ui/Button';
import Card from '../../components/ui/Card';
import Badge from '../../components/ui/Badge';
import { TableSkeleton } from '../../components/ui/Skeleton';
import { formatDate, formatSalary } from '../../utils/helpers';
import { Edit, Trash2, Users } from 'lucide-react';

const ManageJobs = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    jobAPI.getMy()
      .then(({ data }) => setJobs(data.jobs))
      .catch(() => toast.error('Failed to load jobs'))
      .finally(() => setLoading(false));
  }, []);

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this job?')) return;
    try {
      await jobAPI.delete(id);
      setJobs((prev) => prev.filter((j) => j._id !== id));
      toast.success('Job deleted');
    } catch {
      toast.error('Failed to delete job');
    }
  };

  return (
    <>
      <Helmet><title>My Jobs - Job Portal</title></Helmet>
      <div className="container-app py-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">My Jobs</h1>
            <p className="mt-2 text-gray-600 dark:text-gray-400">{jobs.length} jobs posted</p>
          </div>
          <Link to="/recruiter/jobs/new"><Button>Post New Job</Button></Link>
        </div>

        <div className="mt-8 space-y-4">
          {loading ? (
            <TableSkeleton />
          ) : jobs.length === 0 ? (
            <Card className="py-12 text-center">
              <p className="text-gray-500">No jobs posted yet.</p>
              <Link to="/recruiter/jobs/new" className="mt-4 inline-block text-primary-600 hover:underline">
                Post your first job
              </Link>
            </Card>
          ) : (
            jobs.map((job) => (
              <Card key={job._id}>
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <h3 className="text-lg font-semibold">{job.title}</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {formatSalary(job.salary?.min, job.salary?.max)} · {job.location}
                    </p>
                    <div className="mt-2 flex gap-2">
                      <Badge variant={job.isActive ? 'success' : 'danger'}>
                        {job.isActive ? 'Active' : 'Inactive'}
                      </Badge>
                      <Badge>{job.applicationsCount || 0} applicants</Badge>
                      {job.deadline && <span className="text-xs text-gray-500">Deadline: {formatDate(job.deadline)}</span>}
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Link to={`/recruiter/jobs/${job._id}/applicants`}>
                      <Button variant="outline" size="sm"><Users className="h-4 w-4" /> Applicants</Button>
                    </Link>
                    <Link to={`/recruiter/jobs/${job._id}/edit`}>
                      <Button variant="outline" size="sm"><Edit className="h-4 w-4" /></Button>
                    </Link>
                    <Button variant="danger" size="sm" onClick={() => handleDelete(job._id)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </Card>
            ))
          )}
        </div>
      </div>
    </>
  );
};

export default ManageJobs;
