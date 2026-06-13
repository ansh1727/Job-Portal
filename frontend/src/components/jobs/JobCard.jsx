import { Link } from 'react-router-dom';
import { MapPin, DollarSign, Clock, Building2, Bookmark, BookmarkCheck } from 'lucide-react';
import Card from '../ui/Card';
import Badge from '../ui/Badge';
import Button from '../ui/Button';
import { formatSalary, formatDate } from '../../utils/helpers';

const JobCard = ({ job, onSave, isSaved, showSave = false }) => (
  <Card className="transition-shadow hover:shadow-md">
    <div className="flex items-start gap-4">
      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-primary-100 dark:bg-primary-900/30">
        {job.company?.logo?.url ? (
          <img src={job.company.logo.url} alt="" className="h-12 w-12 rounded-lg object-cover" />
        ) : (
          <Building2 className="h-6 w-6 text-primary-600" />
        )}
      </div>
      <div className="min-w-0 flex-1">
        <div className="flex items-start justify-between gap-2">
          <div>
            <Link to={`/jobs/${job._id}`} className="text-lg font-semibold hover:text-primary-600">
              {job.title}
            </Link>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {job.company?.companyName}
            </p>
          </div>
          {showSave && onSave && (
            <Button variant="ghost" size="sm" onClick={() => onSave(job._id)}>
              {isSaved ? (
                <BookmarkCheck className="h-5 w-5 text-primary-600" />
              ) : (
                <Bookmark className="h-5 w-5" />
              )}
            </Button>
          )}
        </div>

        <div className="mt-3 flex flex-wrap gap-3 text-sm text-gray-500 dark:text-gray-400">
          {job.location && (
            <span className="flex items-center gap-1">
              <MapPin className="h-4 w-4" /> {job.location}
            </span>
          )}
          <span className="flex items-center gap-1">
            <DollarSign className="h-4 w-4" />
            {formatSalary(job.salary?.min, job.salary?.max, job.salary?.currency)}
          </span>
          {job.deadline && (
            <span className="flex items-center gap-1">
              <Clock className="h-4 w-4" /> Deadline: {formatDate(job.deadline)}
            </span>
          )}
        </div>

        <div className="mt-3 flex flex-wrap gap-2">
          <Badge variant="primary">{job.jobType?.replace('-', ' ')}</Badge>
          {job.skills?.slice(0, 3).map((skill) => (
            <Badge key={skill}>{skill}</Badge>
          ))}
        </div>
      </div>
    </div>
  </Card>
);

export default JobCard;
