import React, { useEffect, useMemo, useState } from "react";

type Option = {
  value: string;
  label: string;
};

type SelectProps = {
  options?: Option[] | null;
  placeholder?: string;
  onChange?: (value: string) => void;
  onBlur?: (event: React.FocusEvent<HTMLSelectElement>) => void;
  className?: string;
  defaultValue?: string;
  value?: string;
  disabled?: boolean;
};

const Select: React.FC<SelectProps> = ({
  options,
  placeholder = "Select an option",
  onChange,
  onBlur,
  className = "",
  defaultValue = "",
  value,
  disabled = false,
}) => {
  const safeOptions = useMemo(() => (Array.isArray(options) ? options : []), [options]);
  const [selectedValue, setSelectedValue] = useState<string>(value ?? defaultValue ?? "");

  useEffect(() => {
    if (value !== undefined) {
      setSelectedValue(value ?? "");
    }
  }, [value]);

  const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const nextValue = event.target.value;
    if (value === undefined) {
      setSelectedValue(nextValue);
    }
    onChange?.(nextValue);
  };

  return (
    <select
      className={`h-11 w-full appearance-none rounded-lg border border-gray-300 px-4 py-2.5 pr-11 text-sm shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800 ${
        selectedValue ? "text-gray-800 dark:text-white/90" : "text-gray-400 dark:text-gray-400"
      } ${className}`}
      value={selectedValue}
      onChange={handleChange}
      onBlur={onBlur}
      disabled={disabled}
    >
      <option value="" disabled className="text-gray-700 dark:bg-gray-900 dark:text-gray-400">
        {placeholder}
      </option>
      {safeOptions.map((option) => (
        <option key={option.value} value={option.value} className="text-gray-700 dark:bg-gray-900 dark:text-gray-400">
          {option.label}
        </option>
      ))}
    </select>
  );
};

export default Select;
