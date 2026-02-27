import { UseFormRegister } from 'react-hook-form';
import type { EvaluationFormData } from '@/lib/schemas/evaluation-form-schema';
import { errorClass } from '@/lib/form-styles';

interface YesNoFieldProps {
  id: keyof EvaluationFormData;
  label: string;
  register: UseFormRegister<EvaluationFormData>;
  error?: boolean;
  tYes: string;
  tNo: string;
}

export default function YesNoField({
  id,
  label,
  register,
  error,
  tYes,
  tNo,
}: YesNoFieldProps) {
  return (
    <div>
      <div className="flex items-center justify-between gap-4 py-2">
        <span className="text-sm text-gray-900">{label}</span>
        <div className="flex shrink-0 gap-1">
          <label className="cursor-pointer">
            <input
              type="radio"
              value="yes"
              {...register(id)}
              className="peer sr-only"
            />
            <span className="inline-block border border-gray-300 px-3 py-1.5 text-xs font-medium uppercase tracking-wider text-gray-500 transition-colors peer-checked:border-[#4a9ead] peer-checked:bg-[#4a9ead] peer-checked:text-white">
              {tYes}
            </span>
          </label>
          <label className="cursor-pointer">
            <input
              type="radio"
              value="no"
              {...register(id)}
              className="peer sr-only"
            />
            <span className="inline-block border border-gray-300 px-3 py-1.5 text-xs font-medium uppercase tracking-wider text-gray-500 transition-colors peer-checked:border-gray-900 peer-checked:bg-gray-900 peer-checked:text-white">
              {tNo}
            </span>
          </label>
        </div>
      </div>
      {error && <p className={errorClass}>*</p>}
    </div>
  );
}
