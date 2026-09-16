import { type InputHTMLAttributes, type TextareaHTMLAttributes, type SelectHTMLAttributes, forwardRef } from 'react';

const fieldBase =
  'w-full rounded-sm border border-line bg-white px-3.5 py-2.5 text-[15px] text-ink placeholder:text-ink-mid/60 transition-colors focus:border-ink focus:outline-none disabled:bg-paper-dim disabled:text-ink-mid';
const fieldError = 'border-danger focus:border-danger';

interface WrapperProps {
  label?: string;
  error?: string;
  hint?: string;
  required?: boolean;
  id: string;
}

export const TextInput = forwardRef<HTMLInputElement, WrapperProps & InputHTMLAttributes<HTMLInputElement>>(
  ({ label, error, hint, required, id, className = '', ...rest }, ref) => (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label htmlFor={id} className="text-sm font-medium text-ink">
          {label}
          {required && <span className="text-cargo"> *</span>}
        </label>
      )}
      <input
        id={id}
        ref={ref}
        className={`${fieldBase} ${error ? fieldError : ''} ${className}`}
        aria-invalid={!!error}
        aria-describedby={error ? `${id}-error` : hint ? `${id}-hint` : undefined}
        {...rest}
      />
      {error && (
        <p id={`${id}-error`} className="text-sm text-danger">
          {error}
        </p>
      )}
      {!error && hint && (
        <p id={`${id}-hint`} className="text-sm text-ink-mid">
          {hint}
        </p>
      )}
    </div>
  )
);
TextInput.displayName = 'TextInput';

export const TextArea = forwardRef<HTMLTextAreaElement, WrapperProps & TextareaHTMLAttributes<HTMLTextAreaElement>>(
  ({ label, error, hint, required, id, className = '', rows = 5, ...rest }, ref) => (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label htmlFor={id} className="text-sm font-medium text-ink">
          {label}
          {required && <span className="text-cargo"> *</span>}
        </label>
      )}
      <textarea
        id={id}
        ref={ref}
        rows={rows}
        className={`${fieldBase} resize-y ${error ? fieldError : ''} ${className}`}
        aria-invalid={!!error}
        {...rest}
      />
      {error && <p className="text-sm text-danger">{error}</p>}
      {!error && hint && <p className="text-sm text-ink-mid">{hint}</p>}
    </div>
  )
);
TextArea.displayName = 'TextArea';

interface SelectProps extends Omit<WrapperProps, 'id'>, Omit<SelectHTMLAttributes<HTMLSelectElement>, 'id'> {
  id: string;
  options: { value: string; label: string }[];
  placeholder?: string;
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ label, error, hint, required, id, options, placeholder, className = '', ...rest }, ref) => (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label htmlFor={id} className="text-sm font-medium text-ink">
          {label}
          {required && <span className="text-cargo"> *</span>}
        </label>
      )}
      <select
        id={id}
        ref={ref}
        className={`${fieldBase} ${error ? fieldError : ''} ${className}`}
        aria-invalid={!!error}
        {...rest}
      >
        {placeholder && (
          <option value="" disabled>
            {placeholder}
          </option>
        )}
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
      {error && <p className="text-sm text-danger">{error}</p>}
      {!error && hint && <p className="text-sm text-ink-mid">{hint}</p>}
    </div>
  )
);
Select.displayName = 'Select';
