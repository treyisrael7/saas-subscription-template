const INPUT_CLASS =
  "w-full px-4 py-2 rounded-lg bg-neutral-900 border border-neutral-700 text-white placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-neutral-600 focus:border-neutral-600";

interface FormInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  id: string;
  label: string;
  labelRight?: React.ReactNode;
}

export function FormInput({ id, label, labelRight, className = "", ...props }: FormInputProps) {
  return (
    <div>
      <div className="flex items-center justify-between mb-1">
        <label htmlFor={id} className="block text-sm font-medium text-neutral-300">
          {label}
        </label>
        {labelRight}
      </div>
      <input id={id} className={`${INPUT_CLASS} ${className}`.trim()} {...props} />
    </div>
  );
}
