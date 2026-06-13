import { Helmet } from 'react-helmet-async';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { useDispatch, useSelector } from 'react-redux';
import { userAPI } from '../../api/services';
import { updateUser } from '../../redux/slices/authSlice';
import Input from '../../components/ui/Input';
import Textarea from '../../components/ui/Textarea';
import Button from '../../components/ui/Button';
import Card, { CardTitle } from '../../components/ui/Card';
import { Plus, Trash2, Upload } from 'lucide-react';

const CandidateProfile = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const [loading, setLoading] = useState(false);
  const [resume, setResume] = useState(null);

  const [form, setForm] = useState({
    name: user?.name || '',
    phone: user?.profile?.phone || '',
    skills: user?.profile?.skills?.join(', ') || '',
    linkedin: user?.profile?.linkedin || '',
    github: user?.profile?.github || '',
    portfolio: user?.profile?.portfolio || '',
    education: user?.profile?.education || [],
    experience: user?.profile?.experience || [],
  });

  useEffect(() => {
    if (!user) return;
    setForm({
      name: user.name || '',
      phone: user.profile?.phone || '',
      skills: user.profile?.skills?.join(', ') || '',
      linkedin: user.profile?.linkedin || '',
      github: user.profile?.github || '',
      portfolio: user.profile?.portfolio || '',
      education: user.profile?.education || [],
      experience: user.profile?.experience || [],
    });
  }, [user]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append('name', form.name);
      formData.append('phone', form.phone);
      formData.append('skills', JSON.stringify(form.skills.split(',').map((s) => s.trim()).filter(Boolean)));
      formData.append('linkedin', form.linkedin);
      formData.append('github', form.github);
      formData.append('portfolio', form.portfolio);
      formData.append('education', JSON.stringify(form.education));
      formData.append('experience', JSON.stringify(form.experience));
      if (resume) formData.append('resume', resume);

      const { data } = await userAPI.updateProfile(formData);
      dispatch(updateUser(data.user));
      toast.success('Profile updated successfully');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  const addEducation = () => {
    setForm({
      ...form,
      education: [...form.education, { degree: '', institution: '', year: '', field: '' }],
    });
  };

  const addExperience = () => {
    setForm({
      ...form,
      experience: [...form.experience, { title: '', company: '', startDate: '', endDate: '', description: '', current: false }],
    });
  };

  return (
    <>
      <Helmet><title>Profile - Job Portal</title></Helmet>
      <div className="container-app py-8">
        <h1 className="text-3xl font-bold">My Profile</h1>

        <form onSubmit={handleSubmit} className="mt-8 space-y-8">
          <Card>
            <CardTitle>Personal Information</CardTitle>
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              <Input label="Full Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
              <Input label="Email" value={user?.email} disabled />
              <Input label="Phone" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
              <Input label="Skills (comma separated)" value={form.skills} onChange={(e) => setForm({ ...form, skills: e.target.value })} />
              <Input label="LinkedIn" value={form.linkedin} onChange={(e) => setForm({ ...form, linkedin: e.target.value })} />
              <Input label="GitHub" value={form.github} onChange={(e) => setForm({ ...form, github: e.target.value })} />
              <Input label="Portfolio" value={form.portfolio} onChange={(e) => setForm({ ...form, portfolio: e.target.value })} className="sm:col-span-2" />
            </div>
          </Card>

          <Card>
            <div className="flex items-center justify-between">
              <CardTitle>Resume</CardTitle>
              {user?.profile?.resume?.url && (
                <a href={user.profile.resume.url} target="_blank" rel="noreferrer" className="text-sm text-primary-600 hover:underline">
                  View Current Resume
                </a>
              )}
            </div>
            <div className="mt-4">
              <label className="flex cursor-pointer items-center gap-3 rounded-lg border-2 border-dashed border-gray-300 p-6 dark:border-gray-600">
                <Upload className="h-8 w-8 text-gray-400" />
                <div>
                  <p className="font-medium">{resume?.name || 'Upload Resume (PDF)'}</p>
                  <p className="text-sm text-gray-500">Max 5MB</p>
                </div>
                <input type="file" accept=".pdf" className="hidden" onChange={(e) => setResume(e.target.files[0])} />
              </label>
            </div>
          </Card>

          <Card>
            <div className="flex items-center justify-between">
              <CardTitle>Education</CardTitle>
              <Button type="button" variant="outline" size="sm" onClick={addEducation}>
                <Plus className="h-4 w-4" /> Add
              </Button>
            </div>
            {form.education.map((edu, i) => (
              <div key={i} className="mt-4 grid gap-4 border-t pt-4 sm:grid-cols-2">
                <Input label="Degree" value={edu.degree} onChange={(e) => {
                  const updated = [...form.education];
                  updated[i].degree = e.target.value;
                  setForm({ ...form, education: updated });
                }} />
                <Input label="Institution" value={edu.institution} onChange={(e) => {
                  const updated = [...form.education];
                  updated[i].institution = e.target.value;
                  setForm({ ...form, education: updated });
                }} />
                <Input label="Field" value={edu.field} onChange={(e) => {
                  const updated = [...form.education];
                  updated[i].field = e.target.value;
                  setForm({ ...form, education: updated });
                }} />
                <Input label="Year" value={edu.year} onChange={(e) => {
                  const updated = [...form.education];
                  updated[i].year = e.target.value;
                  setForm({ ...form, education: updated });
                }} />
                <Button type="button" variant="ghost" size="sm" onClick={() => {
                  setForm({ ...form, education: form.education.filter((_, idx) => idx !== i) });
                }}>
                  <Trash2 className="h-4 w-4 text-red-500" />
                </Button>
              </div>
            ))}
          </Card>

          <Card>
            <div className="flex items-center justify-between">
              <CardTitle>Experience</CardTitle>
              <Button type="button" variant="outline" size="sm" onClick={addExperience}>
                <Plus className="h-4 w-4" /> Add
              </Button>
            </div>
            {form.experience.map((exp, i) => (
              <div key={i} className="mt-4 grid gap-4 border-t pt-4 sm:grid-cols-2">
                <Input label="Title" value={exp.title} onChange={(e) => {
                  const updated = [...form.experience];
                  updated[i].title = e.target.value;
                  setForm({ ...form, experience: updated });
                }} />
                <Input label="Company" value={exp.company} onChange={(e) => {
                  const updated = [...form.experience];
                  updated[i].company = e.target.value;
                  setForm({ ...form, experience: updated });
                }} />
                <Input label="Start Date" value={exp.startDate} onChange={(e) => {
                  const updated = [...form.experience];
                  updated[i].startDate = e.target.value;
                  setForm({ ...form, experience: updated });
                }} />
                <Input label="End Date" value={exp.endDate} onChange={(e) => {
                  const updated = [...form.experience];
                  updated[i].endDate = e.target.value;
                  setForm({ ...form, experience: updated });
                }} />
                <Textarea label="Description" value={exp.description} className="sm:col-span-2" onChange={(e) => {
                  const updated = [...form.experience];
                  updated[i].description = e.target.value;
                  setForm({ ...form, experience: updated });
                }} />
                <Button type="button" variant="ghost" size="sm" onClick={() => {
                  setForm({ ...form, experience: form.experience.filter((_, idx) => idx !== i) });
                }}>
                  <Trash2 className="h-4 w-4 text-red-500" />
                </Button>
              </div>
            ))}
          </Card>

          <Button type="submit" loading={loading} size="lg">Save Profile</Button>
        </form>
      </div>
    </>
  );
};

export default CandidateProfile;
