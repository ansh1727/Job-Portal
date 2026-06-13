import { Helmet } from 'react-helmet-async';
import { useSearchParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { jobAPI, savedJobAPI } from '../../api/services';
import { useSelector } from 'react-redux';
import JobCard from '../../components/jobs/JobCard';
import { JobCardSkeleton } from '../../components/ui/Skeleton';
import Input from '../../components/ui/Input';
import Select from '../../components/ui/Select';
import Button from '../../components/ui/Button';
import { jobTypes } from '../../utils/helpers';

const Jobs = () => {
  const { isAuthenticated, user } = useSelector((state) => state.auth);
  const [searchParams, setSearchParams] = useSearchParams();
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({ total: 0, totalPages: 1, currentPage: 1 });
  const [savedIds, setSavedIds] = useState(new Set());

  const [filters, setFilters] = useState({
    keyword: searchParams.get('keyword') || '',
    location: searchParams.get('location') || '',
    jobType: searchParams.get('jobType') || '',
    company: searchParams.get('company') || '',
    'salary.min': searchParams.get('salary.min') || '',
    sort: searchParams.get('sort') || '-createdAt',
    page: searchParams.get('page') || '1',
  });

  const fetchJobs = async () => {
    setLoading(true);
    try {
      const params = Object.fromEntries(
        Object.entries(filters).filter(([, v]) => v !== '')
      );
      const { data } = await jobAPI.getAll(params);
      setJobs(data.jobs);
      setPagination({
        total: data.total,
        totalPages: data.totalPages,
        currentPage: data.currentPage,
      });
    } catch {
      toast.error('Failed to load jobs');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, [filters]);

  const handleFilter = (e) => {
    e.preventDefault();
    setFilters({ ...filters, page: '1' });
    const params = new URLSearchParams(
      Object.fromEntries(Object.entries(filters).filter(([, v]) => v !== ''))
    );
    setSearchParams(params);
  };

  const handleSave = async (jobId) => {
    if (!isAuthenticated || user?.role !== 'candidate') {
      toast.error('Please login as a candidate to save jobs');
      return;
    }
    try {
      if (savedIds.has(jobId)) {
        await savedJobAPI.remove(jobId);
        setSavedIds((prev) => {
          const next = new Set(prev);
          next.delete(jobId);
          return next;
        });
        toast.success('Job removed from saved');
      } else {
        await savedJobAPI.save(jobId);
        setSavedIds((prev) => new Set(prev).add(jobId));
        toast.success('Job saved');
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to save job');
    }
  };

  return (
    <>
      <Helmet>
        <title>Browse Jobs - Job Portal</title>
        <meta name="description" content="Browse and search thousands of job opportunities." />
      </Helmet>

      <div className="container-app py-8">
        <h1 className="text-3xl font-bold">Browse Jobs</h1>
        <p className="mt-2 text-gray-600 dark:text-gray-400">
          {pagination.total} jobs found
        </p>

        <form onSubmit={handleFilter} className="mt-8 grid gap-4 rounded-xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-gray-900 sm:grid-cols-2 lg:grid-cols-4">
          <Input
            label="Keyword"
            placeholder="Job title, skills..."
            value={filters.keyword}
            onChange={(e) => setFilters({ ...filters, keyword: e.target.value })}
          />
          <Input
            label="Location"
            placeholder="City, state..."
            value={filters.location}
            onChange={(e) => setFilters({ ...filters, location: e.target.value })}
          />
          <Input
            label="Company"
            placeholder="Company name"
            value={filters.company}
            onChange={(e) => setFilters({ ...filters, company: e.target.value })}
          />
          <Select
            label="Job Type"
            value={filters.jobType}
            onChange={(e) => setFilters({ ...filters, jobType: e.target.value })}
            options={[{ value: '', label: 'All Types' }, ...jobTypes]}
          />
          <Input
            label="Min Salary"
            type="number"
            value={filters['salary.min']}
            onChange={(e) => setFilters({ ...filters, 'salary.min': e.target.value })}
          />
          <Select
            label="Sort By"
            value={filters.sort}
            onChange={(e) => setFilters({ ...filters, sort: e.target.value })}
            options={[
              { value: '-createdAt', label: 'Newest First' },
              { value: 'createdAt', label: 'Oldest First' },
              { value: '-salary.max', label: 'Salary: High to Low' },
              { value: 'salary.min', label: 'Salary: Low to High' },
            ]}
          />
          <div className="flex items-end sm:col-span-2">
            <Button type="submit" className="w-full sm:w-auto">Apply Filters</Button>
          </div>
        </form>

        <div className="mt-8 space-y-4">
          {loading
            ? [...Array(5)].map((_, i) => <JobCardSkeleton key={i} />)
            : jobs.map((job) => (
                <JobCard
                  key={job._id}
                  job={job}
                  showSave={user?.role === 'candidate'}
                  isSaved={savedIds.has(job._id)}
                  onSave={handleSave}
                />
              ))}
          {!loading && jobs.length === 0 && (
            <p className="py-12 text-center text-gray-500">No jobs found matching your criteria.</p>
          )}
        </div>

        {pagination.totalPages > 1 && (
          <div className="mt-8 flex justify-center gap-2">
            <Button
              variant="outline"
              disabled={pagination.currentPage <= 1}
              onClick={() => setFilters({ ...filters, page: String(pagination.currentPage - 1) })}
            >
              Previous
            </Button>
            <span className="flex items-center px-4 text-sm">
              Page {pagination.currentPage} of {pagination.totalPages}
            </span>
            <Button
              variant="outline"
              disabled={pagination.currentPage >= pagination.totalPages}
              onClick={() => setFilters({ ...filters, page: String(pagination.currentPage + 1) })}
            >
              Next
            </Button>
          </div>
        )}
      </div>
    </>
  );
};

export default Jobs;
