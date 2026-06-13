import { Helmet } from 'react-helmet-async';
import { useParams, Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { useSelector } from 'react-redux';
import {
  MapPin, DollarSign, Clock, Building2, Briefcase, Bookmark, BookmarkCheck, Send,
} from 'lucide-react';
import { jobAPI, applicationAPI, savedJobAPI } from '../../api/services';
import Button from '../../components/ui/Button';
import Badge from '../../components/ui/Badge';
import Card from '../../components/ui/Card';
import { Skeleton } from '../../components/ui/Skeleton';
import { formatSalary, formatDate } from '../../utils/helpers';

const JobDetail = () => {
  const { id } = useParams();
  const { isAuthenticated, user } = useSelector((state) => state.auth);
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [applying, setApplying] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [coverLetter, setCoverLetter] = useState('');

  useEffect(() => {
    const fetchJob = async () => {
      try {
        const { data } = await jobAPI.getById(id);
        setJob(data.job);
      } catch {
        toast.error('Job not found');
      } finally {
        setLoading(false);
      }
    };
    fetchJob();
  }, [id]);

  useEffect(() => {
    if (isAuthenticated && user?.role === 'candidate') {
      savedJobAPI.check(id).then(({ data }) => setIsSaved(data.isSaved)).catch(() => {});
    }
  }, [id, isAuthenticated, user]);

  const handleApply = async () => {
    if (!isAuthenticated) {
      toast.error('Please login to apply');
      return;
    }
    if (user?.role !== 'candidate') {
      toast.error('Only candidates can apply for jobs');
      return;
    }
    setApplying(true);
    try {
      const formData = new FormData();
      if (coverLetter) formData.append('coverLetter', coverLetter);
      await applicationAPI.apply(id, formData);
      toast.success('Application submitted successfully!');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to apply');
    } finally {
      setApplying(false);
    }
  };

  const handleSave = async () => {
    try {
      if (isSaved) {
        await savedJobAPI.remove(id);
        setIsSaved(false);
        toast.success('Removed from saved jobs');
      } else {
        await savedJobAPI.save(id);
        setIsSaved(true);
        toast.success('Job saved');
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to save job');
    }
  };

  if (loading) {
    return (
      <div className="container-app py-8">
        <Skeleton className="h-8 w-1/2 mb-4" />
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }

  if (!job) return null;

  return (
    <>
      <Helmet>
        <title>{job.title} at {job.company?.companyName} - Job Portal</title>
        <meta name="description" content={job.description?.slice(0, 160)} />
      </Helmet>

      <div className="container-app py-8">
        <Card>
          <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
            <div className="flex gap-4">
              <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-xl bg-primary-100 dark:bg-primary-900/30">
                {job.company?.logo?.url ? (
                  <img src={job.company.logo.url} alt="" className="h-16 w-16 rounded-xl object-cover" />
                ) : (
                  <Building2 className="h-8 w-8 text-primary-600" />
                )}
              </div>
              <div>
                <h1 className="text-2xl font-bold lg:text-3xl">{job.title}</h1>
                <p className="mt-1 text-lg text-gray-600 dark:text-gray-400">
                  {job.company?.companyName}
                </p>
                <div className="mt-3 flex flex-wrap gap-3 text-sm text-gray-500">
                  {job.location && (
                    <span className="flex items-center gap-1"><MapPin className="h-4 w-4" />{job.location}</span>
                  )}
                  <span className="flex items-center gap-1">
                    <DollarSign className="h-4 w-4" />
                    {formatSalary(job.salary?.min, job.salary?.max)}
                  </span>
                  <span className="flex items-center gap-1">
                    <Briefcase className="h-4 w-4" />{job.jobType?.replace('-', ' ')}
                  </span>
                  {job.deadline && (
                    <span className="flex items-center gap-1">
                      <Clock className="h-4 w-4" />Deadline: {formatDate(job.deadline)}
                    </span>
                  )}
                </div>
                <div className="mt-3 flex flex-wrap gap-2">
                  {job.skills?.map((skill) => <Badge key={skill}>{skill}</Badge>)}
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row lg:flex-col">
              {user?.role === 'candidate' && (
                <>
                  <Button onClick={handleApply} loading={applying}>
                    <Send className="h-4 w-4" /> Apply Now
                  </Button>
                  <Button variant="outline" onClick={handleSave}>
                    {isSaved ? <BookmarkCheck className="h-4 w-4" /> : <Bookmark className="h-4 w-4" />}
                    {isSaved ? 'Saved' : 'Save Job'}
                  </Button>
                </>
              )}
              {!isAuthenticated && (
                <Link to="/login"><Button className="w-full">Login to Apply</Button></Link>
              )}
            </div>
          </div>
        </Card>

        {user?.role === 'candidate' && (
          <Card className="mt-6">
            <h3 className="font-semibold">Cover Letter (Optional)</h3>
            <textarea
              className="mt-2 w-full rounded-lg border border-gray-300 p-3 text-sm dark:border-gray-600 dark:bg-gray-900"
              rows={4}
              placeholder="Tell the employer why you're a great fit..."
              value={coverLetter}
              onChange={(e) => setCoverLetter(e.target.value)}
            />
          </Card>
        )}

        <Card className="mt-6">
          <h2 className="text-xl font-semibold">Job Description</h2>
          <div className="prose mt-4 max-w-none whitespace-pre-wrap text-gray-700 dark:text-gray-300">
            {job.description}
          </div>
        </Card>

        {job.experienceRequired && (
          <Card className="mt-6">
            <h2 className="text-xl font-semibold">Experience Required</h2>
            <p className="mt-2 text-gray-600 dark:text-gray-400">
              {job.experienceRequired.min} - {job.experienceRequired.max} years
            </p>
          </Card>
        )}
      </div>
    </>
  );
};

export default JobDetail;
