import { Helmet } from 'react-helmet-async';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { savedJobAPI } from '../../api/services';
import JobCard from '../../components/jobs/JobCard';
import { JobCardSkeleton } from '../../components/ui/Skeleton';

const SavedJobs = () => {
  const [savedJobs, setSavedJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchSaved = async () => {
    try {
      const { data } = await savedJobAPI.getAll();
      setSavedJobs(data.savedJobs);
    } catch {
      toast.error('Failed to load saved jobs');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSaved();
  }, []);

  const handleRemove = async (jobId) => {
    try {
      await savedJobAPI.remove(jobId);
      setSavedJobs((prev) => prev.filter((s) => s.job._id !== jobId));
      toast.success('Job removed from saved list');
    } catch {
      toast.error('Failed to remove job');
    }
  };

  return (
    <>
      <Helmet><title>Saved Jobs - Job Portal</title></Helmet>
      <div className="container-app py-8">
        <h1 className="text-3xl font-bold">Saved Jobs</h1>
        <p className="mt-2 text-gray-600 dark:text-gray-400">{savedJobs.length} jobs saved</p>

        <div className="mt-8 space-y-4">
          {loading
            ? [...Array(3)].map((_, i) => <JobCardSkeleton key={i} />)
            : savedJobs.map(({ job }) => (
                <JobCard
                  key={job._id}
                  job={job}
                  showSave
                  isSaved
                  onSave={handleRemove}
                />
              ))}
          {!loading && savedJobs.length === 0 && (
            <p className="py-12 text-center text-gray-500">No saved jobs yet.</p>
          )}
        </div>
      </div>
    </>
  );
};

export default SavedJobs;
