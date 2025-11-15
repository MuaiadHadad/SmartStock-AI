import React from 'react';

type Props = React.SelectHTMLAttributes<HTMLSelectElement>;

const Select: React.FC<Props> = ({ className='', children, ...props }) => (
  <select className={`w-full bg-slate-900/40 border border-slate-700 rounded px-3 py-2 ${className}`} {...props}>
    {children}
  </select>
);

export default Select;

