import React from 'react';
import { CheckCircle2, AlertCircle, Info } from 'lucide-react';

export interface ToastData {
  id: string;
  message: string;
  type: 'success' | 'info' | 'error';
}

interface ToastProps {
  toasts: ToastData[];
}

export const Toast: React.FC<ToastProps> = ({ toasts }) => {
  if (toasts.length === 0) return null;

  return (
    <div className="fixed top-5 left-1/2 -translate-x-1/2 z-50 flex flex-col items-center gap-2 pointer-events-none w-[90%] max-w-sm">
      {toasts.map((toast) => {
        const isSuccess = toast.type === 'success';
        const isError = toast.type === 'error';

        return (
          <div
            key={toast.id}
            className={`px-4 py-2.5 rounded-full shadow-2xl text-xs font-bold flex items-center gap-2 border pointer-events-auto transition-all animate-bounce ${
              isSuccess
                ? 'bg-[#0c1a30] text-white border-emerald-500/40 shadow-emerald-500/20'
                : isError
                ? 'bg-rose-900 text-white border-rose-500 shadow-rose-500/20'
                : 'bg-[#0c1a30] text-white border-slate-700 shadow-slate-900/50'
            }`}
          >
            {isSuccess && <CheckCircle2 size={16} className="text-[#ff6600] shrink-0" />}
            {isError && <AlertCircle size={16} className="text-rose-400 shrink-0" />}
            {!isSuccess && !isError && <Info size={16} className="text-sky-400 shrink-0" />}
            <span className="truncate max-w-[280px]">{toast.message}</span>
          </div>
        );
      })}
    </div>
  );
};
