import { Helmet } from 'react-helmet-async';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { adminAPI } from '../../api/services';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Badge from '../../components/ui/Badge';
import { TableSkeleton } from '../../components/ui/Skeleton';
import { formatDate } from '../../utils/helpers';

const AdminCompanies = () => {
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    adminAPI.getCompanies()
      .then(({ data }) => setCompanies(data.companies))
      .finally(() => setLoading(false));
  }, []);

  const toggleStatus = async (id) => {
    try {
      const { data } = await adminAPI.toggleCompanyStatus(id);
      setCompanies((prev) => prev.map((c) => (c._id === id ? data.company : c)));
      toast.success('Company status updated');
    } catch {
      toast.error('Failed to update company');
    }
  };

  return (
    <>
      <Helmet><title>Manage Companies - Job Portal</title></Helmet>
      <div className="container-app py-8">
        <h1 className="text-3xl font-bold">Manage Companies</h1>

        <div className="mt-8 space-y-3">
          {loading ? (
            <TableSkeleton />
          ) : (
            companies.map((company) => (
              <Card key={company._id}>
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex gap-4">
                    {company.logo?.url && (
                      <img src={company.logo.url} alt="" className="h-12 w-12 rounded-lg object-cover" />
                    )}
                    <div>
                      <h3 className="font-semibold">{company.companyName}</h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {company.industry} · {company.location}
                      </p>
                      <p className="text-xs text-gray-500">
                        Recruiter: {company.recruiter?.name} · {formatDate(company.createdAt)}
                      </p>
                      <Badge variant={company.isActive ? 'success' : 'danger'} className="mt-2">
                        {company.isActive ? 'Active' : 'Inactive'}
                      </Badge>
                    </div>
                  </div>
                  <Button variant="outline" size="sm" onClick={() => toggleStatus(company._id)}>
                    {company.isActive ? 'Deactivate' : 'Activate'}
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

export default AdminCompanies;
