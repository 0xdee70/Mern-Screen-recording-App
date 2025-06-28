import React from 'react';

const Input = ({ 
  label, 
  error, 
  className = '', 
  required = false,
  ...props 
}) => {
  const inputClasses = `
    w-full px-4 py-3 border-2 rounded-xl transition-all duration-200 focus-ring bg-white
    ${error 
      ? 'border-error-300 focus:border-error-500 bg-error-50' 
      : 'border-secondary-200 focus:border-primary-500 hover:border-secondary-300'
    }
    placeholder:text-secondary-400
    ${className}
  `;
  
  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-semibold text-secondary-700 mb-3">
          {label}
          {required && <span className="text-error-500 ml-1">*</span>}
        </label>
      )}
      <input 
        className={inputClasses}
        {...props}
      />
      {error && (
        <p className="mt-2 text-sm text-error-600 font-medium">{error}</p>
      )}
    </div>
  );
};

export default Input;