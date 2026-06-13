import { Helmet } from 'react-helmet-async';
import { useNavigate, useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { jobAPI } from '../../api/services';
import Input from '../../components/ui/Input';
import Textarea from '../../components/ui/Textarea';
import Select from '../../components/ui/Select';
import Button from '../../components/ui/Button';
import Card, { CardTitle } from '../../components/ui/Card';
import { jobTypes } from '../../utils/helpers';

const PostJob = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = Boolean(id);
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    title: '',
    description: '',
    location: '',
    skills: '',
    jobType: 'full-time',
    'salary.min': '',
    'salary.max': '',
    'experienceRequired.min': '',
    'experienceRequired.max': '',
    deadline: '',
  });

  useEffect(() => {
    if (isEdit) {
      jobAPI.getById(id).then(({ data }) => {
        const job = data.job;
        setForm({
          title: job.title,
          description: job.description,
          location: job.location || '',
          skills: job.skills?.join(', ') || '',
          jobType: job.jobType,
          'salary.min': job.salary?.min || '',
          'salary.max': job.salary?.max || '',
          'experienceRequired.min': job.experienceRequired?.min || '',
          'experienceRequired.max': job.experienceRequired?.max || '',
          deadline: job.deadline ? job.deadline.split('T')[0] : '',
        });
      });
    }
  }, [id, isEdit]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const payload = {
        title: form.title,
        description: form.description,
        location: form.location,
        skills: form.skills.split(',').map((s) => s.trim()).filter(Boolean),
        jobType: form.jobType,
        salary: { min: Number(form['salary.min']) || 0, max: Number(form['salary.max']) || 0 },
        experienceRequired: {
          min: Number(form['experienceRequired.min']) || 0,
          max: Number(form['experienceRequired.max']) || 0,
        },
        deadline: form.deadline || undefined,
      };

      if (isEdit) {
        await jobAPI.update(id, payload);
        toast.success('Job updated');
      } else {
        await jobAPI.create(payload);
        toast.success('Job posted successfully');
      }
      navigate('/recruiter/jobs');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to save job');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Helmet><title>{isEdit ? 'Edit Job' : 'Post Job'} - Job Portal</title></Helmet>
      <div className="container-app py-8">
        <h1 className="text-3xl font-bold">{isEdit ? 'Edit Job' : 'Post a New Job'}</h1>

        <form onSubmit={handleSubmit} className="mt-8 max-w-2xl space-y-6">
          <Card>
            <CardTitle>Job Details</CardTitle>
            <div className="mt-4 space-y-4">
              <Input label="Job Title" required value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
              <Textarea label="Description" required value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={6} />
              <Input label="Location" value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} />
              <Input label="Skills Required (comma separated)" value={form.skills} onChange={(e) => setForm({ ...form, skills: e.target.value })} />
              <Select label="Job Type" value={form.jobType} onChange={(e) => setForm({ ...form, jobType: e.target.value })} options={jobTypes} />
            </div>
          </Card>

          <Card>
            <CardTitle>Compensation & Requirements</CardTitle>
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              <Input label="Min Salary" type="number" value={form['salary.min']} onChange={(e) => setForm({ ...form, 'salary.min': e.target.value })} />
              <Input label="Max Salary" type="number" value={form['salary.max']} onChange={(e) => setForm({ ...form, 'salary.max': e.target.value })} />
              <Input label="Min Experience (years)" type="number" value={form['experienceRequired.min']} onChange={(e) => setForm({ ...form, 'experienceRequired.min': e.target.value })} />
              <Input label="Max Experience (years)" type="number" value={form['experienceRequired.max']} onChange={(e) => setForm({ ...form, 'experienceRequired.max': e.target.value })} />
              <Input label="Application Deadline" type="date" value={form.deadline} onChange={(e) => setForm({ ...form, deadline: e.target.value })} className="sm:col-span-2" />
            </div>
          </Card>

          <Button type="submit" loading={loading} size="lg">
            {isEdit ? 'Update Job' : 'Post Job'}
          </Button>
        </form>
      </div>
    </>
  );
};

export default PostJob;
