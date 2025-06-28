import React from 'react';
import { CheckCircle, XCircle, AlertTriangle, Info } from 'lucide-react';

const Alert = ({ type = 'info', children, className = '' }) => {
  const types = {
    success: {
      bg: 'bg-success-50',
      border: 'border-success-200',
      text: 'text-success-800',
      icon: CheckCircle,
      iconColor: 'text-success-600'
    },
    error: {
      bg: 'bg-error-50',
      border: 'border-error-200',
      text: 'text-error-800',
      icon: XCircle,
      iconColor: 'text-error-600'
    },
    warning: {
      bg: 'bg-warning-50',
      border: 'border-warning-200',
      text: 'text-warning-800',
      icon: AlertTriangle,
      iconColor: 'text-warning-600'
    },
    info: {
      bg: 'bg-primary-50',
      border: 'border-primary-200',
      text: 'text-primary-800',
      icon: Info,
      iconColor: 'text-primary-600'
    }
  };
  
  const config = types[type];
  const Icon = config.icon;
  
  return (
    <div className={`flex items-start p-4 rounded-xl border-2 ${config.bg} ${config.border} shadow-sm ${className}`}>
      <Icon className={`h-5 w-5 ${config.iconColor} mr-3 mt-0.5 flex-shrink-0`} />
      <div className={`text-sm font-medium ${config.text}`}>
        {children}
      </div>
    </div>
  );
};

export default Alert;