import React from 'react';
import Image from 'next/image';

// Card component implementation
// Accepts `className` so callers can style the outer container.

type CardProps = {
  children: React.ReactNode;
  className?: string;
};

const LoginCard = ({ children, className }: CardProps) => {
  const base = 'flex';
  const classes = className ? `${base} ${className}` : base;

  return (
    <div className={classes}>
      <div className="w-1/2">
        <Image src="/student.svg" alt="Student" width={500} height={500} />
      </div>
      <div className="w-1/2">
        {children}
      </div>
    </div>
  );
};

export default  LoginCard;


