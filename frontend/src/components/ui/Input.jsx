import React from 'react';

const Input = ({ 
  label, 
  error, 
  className = '', 
  required = false,
  ...props 
}) => {
  const inputClasses = `
    w-full px-3 py-2.5 border rounded-lg transition-colors focus-ring
    ${error 
      ? 'border-error-300 focus:border-error-500' 
      : 'border-secondary-200 focus:border-primary-500'
    }
    ${className}
  `;
  
  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-medium text-secondary-700 mb-2">
          {label}
          {required && <span className="text-error-500 ml-1">*</span>}
        </label>
      )}
      <input 
        className={inputClasses}
        {...props}
      />
      {error && (
        <p className="mt-1 text-sm text-error-600">{error}</p>
      )}
    </div>
  );
};

export default Input;