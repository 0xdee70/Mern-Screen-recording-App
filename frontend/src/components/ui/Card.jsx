import React from 'react';

const Card = ({ children, className = '', hover = false, ...props }) => {
  const baseClasses = 'bg-white rounded-2xl border border-secondary-100 transition-all duration-300';
  const hoverClasses = hover ? 'hover:shadow-xl hover:scale-105 hover:border-secondary-200' : 'shadow-lg';
  
  return (
    <div 
      className={`${baseClasses} ${hoverClasses} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};

const CardHeader = ({ children, className = '' }) => {
  return (
    <div className={`p-8 pb-4 ${className}`}>
      {children}
    </div>
  );
};

const CardContent = ({ children, className = '' }) => {
  return (
    <div className={`p-8 pt-0 ${className}`}>
      {children}
    </div>
  );
};

Card.Header = CardHeader;
Card.Content = CardContent;

export default Card;