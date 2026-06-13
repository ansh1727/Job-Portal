import { Helmet } from 'react-helmet-async';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { companyAPI } from '../../api/services';
import Input from '../../components/ui/Input';
import Textarea from '../../components/ui/Textarea';
import Button from '../../components/ui/Button';
import Card, { CardTitle } from '../../components/ui/Card';
import { Upload } from 'lucide-react';

const CompanyProfile = () => {
  const [loading, setLoading] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [logo, setLogo] = useState(null);
  const [form, setForm] = useState({
    companyName: '',
    website: '',
    description: '',
    industry: '',
    location: '',
  });
  const [existingLogo, setExistingLogo] = useState(null);

  useEffect(() => {
    companyAPI.getMy()
      .then(({ data }) => {
        setIsEdit(true);
        setForm({
          companyName: data.company.companyName,
          website: data.company.website || '',
          description: data.company.description || '',
          industry: data.company.industry || '',
          location: data.company.location || '',
        });
        setExistingLogo(data.company.logo?.url);
      })
      .catch(() => setIsEdit(false));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const formData = new FormData();
      Object.entries(form).forEach(([key, value]) => formData.append(key, value));
      if (logo) formData.append('logo', logo);

      const { data } = isEdit
        ? await companyAPI.update(formData)
        : await companyAPI.create(formData);

      toast.success(isEdit ? 'Company updated' : 'Company created');
      setExistingLogo(data.company.logo?.url);
      setIsEdit(true);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to save company');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Helmet><title>Company Profile - Job Portal</title></Helmet>
      <div className="container-app py-8">
        <h1 className="text-3xl font-bold">{isEdit ? 'Edit Company' : 'Create Company Profile'}</h1>

        <form onSubmit={handleSubmit} className="mt-8 max-w-2xl space-y-6">
          <Card>
            <CardTitle>Company Information</CardTitle>
            <div className="mt-4 space-y-4">
              <Input label="Company Name" required value={form.companyName} onChange={(e) => setForm({ ...form, companyName: e.target.value })} />
              <Input label="Website" value={form.website} onChange={(e) => setForm({ ...form, website: e.target.value })} />
              <Input label="Industry" value={form.industry} onChange={(e) => setForm({ ...form, industry: e.target.value })} />
              <Input label="Location" value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} />
              <Textarea label="Description" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
            </div>
          </Card>

          <Card>
            <CardTitle>Company Logo</CardTitle>
            {existingLogo && (
              <img src={existingLogo} alt="Company logo" className="mb-4 h-20 w-20 rounded-lg object-cover" />
            )}
            <label className="flex cursor-pointer items-center gap-3 rounded-lg border-2 border-dashed border-gray-300 p-6 dark:border-gray-600">
              <Upload className="h-8 w-8 text-gray-400" />
              <div>
                <p className="font-medium">{logo?.name || 'Upload Logo'}</p>
                <p className="text-sm text-gray-500">PNG, JPG up to 5MB</p>
              </div>
              <input type="file" accept="image/*" className="hidden" onChange={(e) => setLogo(e.target.files[0])} />
            </label>
          </Card>

          <Button type="submit" loading={loading} size="lg">
            {isEdit ? 'Update Company' : 'Create Company'}
          </Button>
        </form>
      </div>
    </>
  );
};

export default CompanyProfile;
