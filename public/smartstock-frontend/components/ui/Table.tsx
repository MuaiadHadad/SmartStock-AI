import React from 'react';

export const Table: React.FC<React.TableHTMLAttributes<HTMLTableElement>> = ({ className='', ...props }) => (
  <table className={`min-w-full text-sm ${className}`} {...props} />
);
export const Thead: React.FC<React.HTMLAttributes<HTMLTableSectionElement>> = ({ className='', ...props }) => (
  <thead className={`bg-slate-900/60 text-slate-300 ${className}`} {...props} />
);
export const Trow: React.FC<React.HTMLAttributes<HTMLTableRowElement>> = ({ className='', ...props }) => (
  <tr className={`border-t border-slate-800 hover:bg-slate-900/30 ${className}`} {...props} />
);
export const Th: React.FC<React.ThHTMLAttributes<HTMLTableCellElement>> = ({ className='', ...props }) => (
  <th className={`p-3 text-left ${className}`} {...props} />
);
export const Td: React.FC<React.TdHTMLAttributes<HTMLTableCellElement>> = ({ className='', ...props }) => (
  <td className={`p-3 ${className}`} {...props} />
);
export default Table;

