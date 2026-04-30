import type { ComponentProps, ReactElement } from 'react';

type EmptyStateProps = {
  icon: ReactElement;
  description: string;
} & ComponentProps<'div'>;

export const EmptyState = ({
  icon,
  description,
  ...props
}:EmptyStateProps) => {
  return (
    <div
      className="flex flex-col items-center justify-center gap-6 mt-16 mb-12"
      {...props}
    >
      {icon}

      <p className="text-xs text-gray-500 uppercase text-center">
        {description}
      </p>
    </div>
  );
};