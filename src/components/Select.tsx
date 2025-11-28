

import type { ChangeEvent } from 'react';
import clsx from 'clsx';

interface SelectOption {
  value: string;
  label: string;
}

interface SelectProps {
  heading: string;
  name: string;
  value: string;
  options: SelectOption[];
  onChange: (event: ChangeEvent<HTMLSelectElement>) => void;
  className?: string;
}

export default function Select({ heading, name, value, options, onChange, className = "" }: SelectProps) {
  return (
    <div>
      <label className="block mb-1 font-medium" htmlFor={name}>{heading}:</label>
      <select 
        id={name} 
        defaultValue={value}
        className={clsx(`select select-ghost focus:border-0 hover:border-0 bg-input`, className)}
        onChange={onChange}
      >
        {options.map(option => (
          <option key={option.value} className="hover:bg-input" value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
}