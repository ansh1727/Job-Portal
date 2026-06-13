import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { Search, Briefcase, Users, ArrowRight } from 'lucide-react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../components/ui/Button';

const Home = () => {
  const navigate = useNavigate();
  const [keyword, setKeyword] = useState('');

  const handleSearch = (e) => {
    e.preventDefault();
    navigate(`/jobs?keyword=${encodeURIComponent(keyword)}`);
  };

  return (
    <>
      <Helmet>
        <title>Job Portal</title>
        <meta name="description" content="Search jobs, apply online, and track applications." />
      </Helmet>

      <section className="relative overflow-hidden bg-gradient-to-br from-primary-600 via-primary-700 to-primary-900 py-20 text-white">
        <div className="container-app relative z-10">
          <div className="mx-auto max-w-3xl text-center">
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
              Find your next job
            </h1>
            <p className="mt-6 text-lg text-primary-100">
              Search openings, apply with your profile, and check application status in one place.
            </p>
            <form onSubmit={handleSearch} className="mt-10 flex flex-col gap-3 sm:flex-row">
              <div className="relative flex-1">
                <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Title, skill, company..."
                  value={keyword}
                  onChange={(e) => setKeyword(e.target.value)}
                  className="w-full rounded-lg border-0 py-3.5 pl-12 pr-4 text-gray-900 focus:ring-2 focus:ring-white"
                />
              </div>
              <Button type="submit" variant="secondary" size="lg" className="shrink-0">
                Search
              </Button>
            </form>
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="container-app">
          <div className="grid gap-8 md:grid-cols-3">
            <div className="rounded-xl border border-gray-200 bg-white p-8 text-center dark:border-gray-800 dark:bg-gray-900">
              <Briefcase className="mx-auto h-10 w-10 text-primary-600" />
              <h3 className="mt-4 text-lg font-semibold">Browse jobs</h3>
              <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                Filter by location, salary, and job type.
              </p>
            </div>
            <div className="rounded-xl border border-gray-200 bg-white p-8 text-center dark:border-gray-800 dark:bg-gray-900">
              <Users className="mx-auto h-10 w-10 text-primary-600" />
              <h3 className="mt-4 text-lg font-semibold">For recruiters</h3>
              <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                Post roles and manage applicants from the dashboard.
              </p>
            </div>
            <div className="rounded-xl border border-gray-200 bg-white p-8 text-center dark:border-gray-800 dark:bg-gray-900">
              <ArrowRight className="mx-auto h-10 w-10 text-primary-600" />
              <h3 className="mt-4 text-lg font-semibold">Track applications</h3>
              <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                Candidates can save jobs and see status updates.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-gray-100 py-16 dark:bg-gray-900">
        <div className="container-app text-center">
          <h2 className="text-2xl font-bold">Get started</h2>
          <p className="mt-3 text-gray-600 dark:text-gray-400">
            Create an account as a candidate or recruiter.
          </p>
          <div className="mt-6 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link to="/register">
              <Button size="lg">Sign up</Button>
            </Link>
            <Link to="/jobs">
              <Button variant="outline" size="lg">View jobs</Button>
            </Link>
          </div>
        </div>
      </section>
    </>
  );
};

export default Home;
