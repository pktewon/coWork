import type { ReactNode } from 'react';

type BadgeVariant = 'default' | 'primary' | 'success' | 'warning' | 'danger' | 'info';
type BadgeSize = 'sm' | 'md';

interface BadgeProps {
  children: ReactNode;
  variant?: BadgeVariant;
  size?: BadgeSize;
  className?: string;
}

const variantStyles: Record<BadgeVariant, string> = {
  default: 'bg-gray-100 text-gray-700',
  primary: 'bg-primary-100 text-primary-700',
  success: 'bg-green-100 text-green-700',
  warning: 'bg-amber-100 text-amber-700',
  danger: 'bg-red-100 text-red-700',
  info: 'bg-blue-100 text-blue-700',
};

const sizeStyles: Record<BadgeSize, string> = {
  sm: 'px-2 py-0.5 text-xs',
  md: 'px-2.5 py-1 text-sm',
};

export function Badge({ 
  children, 
  variant = 'default', 
  size = 'sm',
  className = '' 
}: BadgeProps) {
  return (
    <span
      className={`
        inline-flex items-center font-medium rounded-full
        ${variantStyles[variant]}
        ${sizeStyles[size]}
        ${className}
      `}
    >
      {children}
    </span>
  );
}

// 역할 뱃지
export function RoleBadge({ role }: { role: 'LEADER' | 'MEMBER' }) {
  return (
    <Badge variant={role === 'LEADER' ? 'primary' : 'default'} size="sm">
      {role === 'LEADER' ? '👑 Leader' : 'Member'}
    </Badge>
  );
}

// 상태 뱃지
export function StatusBadge({ status }: { status: 'TODO' | 'IN_PROGRESS' | 'DONE' }) {
  const config = {
    TODO: { variant: 'warning' as const, label: 'To Do' },
    IN_PROGRESS: { variant: 'info' as const, label: 'In Progress' },
    DONE: { variant: 'success' as const, label: 'Done' },
  };

  const { variant, label } = config[status];

  return (
    <Badge variant={variant} size="sm">
      {label}
    </Badge>
  );
}

// 우선순위 뱃지
export function PriorityBadge({ priority }: { priority: 'LOW' | 'MEDIUM' | 'HIGH' }) {
  const config = {
    LOW: { variant: 'default' as const, label: 'Low' },
    MEDIUM: { variant: 'warning' as const, label: 'Medium' },
    HIGH: { variant: 'danger' as const, label: 'High' },
  };

  const { variant, label } = config[priority];

  return (
    <Badge variant={variant} size="sm">
      {label}
    </Badge>
  );
}
