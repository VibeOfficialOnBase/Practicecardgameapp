import React from 'react';

export default function Section({ children, className = '', title, action }) {
  return (
    <section className={`mb-8 ${className}`}>
      {(title || action) && (
        <div className="flex items-center justify-between mb-4 px-1">
          {title && <h2 className="text-xl font-bold">{title}</h2>}
          {action && <div>{action}</div>}
        </div>
      )}
      {children}
    </section>
  );
}
