import { cn } from "../utils/cn";

const Select = ({ label, error, className = "", options = [], ...props }) => {
  return (
    <label className="block text-sm text-slate-700">
      {label && <span className="mb-1 block font-medium">{label}</span>}
      <select
        className={cn(
          "w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 shadow-sm focus:border-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-200",
          error && "border-rose-400 focus:ring-rose-100",
          className
        )}
        {...props}
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      {error && <span className="mt-1 block text-xs text-rose-600">{error}</span>}
    </label>
  );
};

export default Select;
