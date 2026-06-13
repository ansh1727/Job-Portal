import { cn } from '../../utils/helpers';

const Textarea = ({ label, error, className, ...props }) => (
  <div className="w-full">
    {label && (
      <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">
        {label}
      </label>
    )}
    <textarea
      className={cn(
        'w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm transition-colors placeholder:text-gray-400 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20 dark:border-gray-600 dark:bg-gray-900 dark:text-gray-100',
        error && 'border-red-500',
        className
      )}
      rows={4}
      {...props}
    />
    {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
  </div>
);

export default Textarea;
