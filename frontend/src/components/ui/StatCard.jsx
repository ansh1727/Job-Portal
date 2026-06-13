import { Link } from 'react-router-dom';
import Card from '../ui/Card';

const StatCard = ({ title, value, icon: Icon, color = 'primary', link }) => {
  const colors = {
    primary: 'bg-primary-100 text-primary-600 dark:bg-primary-900/30',
    green: 'bg-green-100 text-green-600 dark:bg-green-900/30',
    purple: 'bg-purple-100 text-purple-600 dark:bg-purple-900/30',
    orange: 'bg-orange-100 text-orange-600 dark:bg-orange-900/30',
  };

  const content = (
    <Card className="transition-shadow hover:shadow-md">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-600 dark:text-gray-400">{title}</p>
          <p className="mt-1 text-3xl font-bold">{value}</p>
        </div>
        {Icon && (
          <div className={`rounded-lg p-3 ${colors[color]}`}>
            <Icon className="h-6 w-6" />
          </div>
        )}
      </div>
    </Card>
  );

  return link ? <Link to={link}>{content}</Link> : content;
};

export default StatCard;
