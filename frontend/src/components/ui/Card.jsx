import { cn } from '../../utils/helpers';

const Card = ({ children, className, ...props }) => (
  <div
    className={cn(
      'rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900',
      className
    )}
    {...props}
  >
    {children}
  </div>
);

export const CardHeader = ({ children, className }) => (
  <div className={cn('mb-4', className)}>{children}</div>
);

export const CardTitle = ({ children, className }) => (
  <h3 className={cn('text-lg font-semibold text-gray-900 dark:text-gray-100', className)}>
    {children}
  </h3>
);

export default Card;
