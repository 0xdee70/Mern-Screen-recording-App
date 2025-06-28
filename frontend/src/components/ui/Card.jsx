import React from 'react';

const Card = ({ children, className = '', ...props }) => {
  return (
    <div 
      className={`bg-white rounded-xl shadow-lg border border-secondary-100 ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};

const CardHeader = ({ children, className = '' }) => {
  return (
    <div className={`p-6 pb-4 ${className}`}>
      {children}
    </div>
  );
};

const CardContent = ({ children, className = '' }) => {
  return (
    <div className={`p-6 pt-0 ${className}`}>
      {children}
    </div>
  );
};

Card.Header = CardHeader;
Card.Content = CardContent;

export default Card;