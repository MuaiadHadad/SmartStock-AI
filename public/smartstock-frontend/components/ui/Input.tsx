import React from 'react';

type Props = React.InputHTMLAttributes<HTMLInputElement>;

const Input: React.FC<Props> = ({ className='', ...props }) => (
  <input className={`w-full bg-slate-900/40 border border-slate-700 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500 ${className}`} {...props} />
);

export default Input;

