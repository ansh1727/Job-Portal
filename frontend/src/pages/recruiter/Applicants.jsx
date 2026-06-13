import { Helmet } from 'react-helmet-async';
import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { applicationAPI } from '../../api/services';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Select from '../../components/ui/Select';
import { TableSkeleton } from '../../components/ui/Skeleton';
import { formatStatus, statusColors, applicationStatuses } from '../../utils/helpers';
import { Download, Mail } from 'lucide-react';

const Applicants = () => {
  const { jobId } = useParams();
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    applicationAPI.getApplicants(jobId)
      .then(({ data }) => setApplications(data.applications))
      .catch(() => toast.error('Failed to load applicants'))
      .finally(() => setLoading(false));
  }, [jobId]);

  const handleStatusChange = async (applicationId, status) => {
    try {
      const { data } = await applicationAPI.updateStatus(applicationId, { status });
      setApplications((prev) =>
        prev.map((app) => (app._id === applicationId ? data.application : app))
      );
      toast.success('Status updated');
    } catch {
      toast.error('Failed to update status');
    }
  };

  return (
    <>
      <Helmet><title>Applicants - Job Portal</title></Helmet>
      <div className="container-app py-8">
        <h1 className="text-3xl font-bold">Applicants</h1>
        <p className="mt-2 text-gray-600 dark:text-gray-400">{applications.length} applicants</p>

        <div className="mt-8 space-y-4">
          {loading ? (
            <TableSkeleton />
          ) : applications.length === 0 ? (
            <Card className="py-12 text-center">
              <p className="text-gray-500">No applicants yet.</p>
            </Card>
          ) : (
            applications.map((app) => (
              <Card key={app._id}>
                <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                  <div>
                    <h3 className="text-lg font-semibold">{app.candidate?.name}</h3>
                    <p className="flex items-center gap-1 text-sm text-gray-600 dark:text-gray-400">
                      <Mail className="h-4 w-4" /> {app.candidate?.email}
                    </p>
                    {app.candidate?.profile?.skills && (
                      <p className="mt-2 text-sm">
                        Skills: {app.candidate.profile.skills.join(', ')}
                      </p>
                    )}
                    <span className={`mt-2 inline-flex rounded-full px-3 py-1 text-xs font-medium ${statusColors[app.status]}`}>
                      {formatStatus(app.status)}
                    </span>
                  </div>
                  <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
                    {app.resume?.url && (
                      <a href={app.resume.url} target="_blank" rel="noreferrer">
                        <Button variant="outline" size="sm">
                          <Download className="h-4 w-4" /> Resume
                        </Button>
                      </a>
                    )}
                    <Select
                      value={app.status}
                      onChange={(e) => handleStatusChange(app._id, e.target.value)}
                      options={applicationStatuses.map((s) => ({ value: s, label: formatStatus(s) }))}
                      className="w-48"
                    />
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

export default Applicants;
