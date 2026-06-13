import { Helmet } from 'react-helmet-async';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { adminAPI } from '../../api/services';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Badge from '../../components/ui/Badge';
import Input from '../../components/ui/Input';
import { TableSkeleton } from '../../components/ui/Skeleton';
import { formatDate } from '../../utils/helpers';

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [role, setRole] = useState('');

  const fetchUsers = () => {
    setLoading(true);
    adminAPI.getUsers({ search: search || undefined, role: role || undefined })
      .then(({ data }) => setUsers(data.users))
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchUsers(); }, [role]);

  const toggleStatus = async (id) => {
    try {
      const { data } = await adminAPI.toggleUserStatus(id);
      setUsers((prev) => prev.map((u) => (u._id === id ? data.user : u)));
      toast.success(data.message);
    } catch {
      toast.error('Failed to update user');
    }
  };

  return (
    <>
      <Helmet><title>Manage Users - Job Portal</title></Helmet>
      <div className="container-app py-8">
        <h1 className="text-3xl font-bold">Manage Users</h1>

        <div className="mt-6 flex flex-col gap-4 sm:flex-row">
          <Input placeholder="Search users..." value={search} onChange={(e) => setSearch(e.target.value)} />
          <select
            className="rounded-lg border border-gray-300 px-4 py-2.5 dark:border-gray-600 dark:bg-gray-900"
            value={role}
            onChange={(e) => setRole(e.target.value)}
          >
            <option value="">All Roles</option>
            <option value="candidate">Candidate</option>
            <option value="recruiter">Recruiter</option>
            <option value="admin">Admin</option>
          </select>
          <Button onClick={fetchUsers}>Search</Button>
        </div>

        <div className="mt-8 space-y-3">
          {loading ? (
            <TableSkeleton />
          ) : (
            users.map((user) => (
              <Card key={user._id}>
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <h3 className="font-semibold">{user.name}</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">{user.email}</p>
                    <div className="mt-2 flex gap-2">
                      <Badge variant="primary">{user.role}</Badge>
                      <Badge variant={user.isActive ? 'success' : 'danger'}>
                        {user.isActive ? 'Active' : 'Inactive'}
                      </Badge>
                    </div>
                    <p className="mt-1 text-xs text-gray-500">Joined {formatDate(user.createdAt)}</p>
                  </div>
                  {user.role !== 'admin' && (
                    <Button
                      variant={user.isActive ? 'danger' : 'primary'}
                      size="sm"
                      onClick={() => toggleStatus(user._id)}
                    >
                      {user.isActive ? 'Deactivate' : 'Activate'}
                    </Button>
                  )}
                </div>
              </Card>
            ))
          )}
        </div>
      </div>
    </>
  );
};

export default AdminUsers;
