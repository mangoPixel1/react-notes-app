import { useContext } from "react";
import { X } from "lucide-react";

import { UIContext } from "../contexts/UIContext";

function ToastContainer() {
  const { toasts, removeToast } = useContext(UIContext);

  if (toasts.length === 0) return null;

  return (
    <div className="fixed top-4 left-1/2 z-[70] flex w-full max-w-sm -translate-x-1/2 flex-col gap-2 px-4">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className="animate-toast-in flex w-full items-center justify-between gap-3 rounded-2xl border border-black/5 dark:border-white/10 bg-white/40 dark:bg-zinc-800/35 px-4 py-3 text-sm text-zinc-800 dark:text-zinc-100 shadow-lg backdrop-blur-md"
        >
          <span>{toast.message}</span>
          <div className="flex shrink-0 items-center gap-3">
            {toast.actionLabel && (
              <button
                onClick={() => {
                  toast.onAction?.();
                  removeToast(toast.id);
                }}
                className="cursor-pointer font-semibold text-amber-600 hover:text-amber-700 dark:text-amber-500 dark:hover:text-amber-400"
              >
                {toast.actionLabel}
              </button>
            )}
            <button
              onClick={() => removeToast(toast.id)}
              title="Dismiss"
              className="cursor-pointer text-zinc-400 hover:text-zinc-600 dark:text-zinc-500 dark:hover:text-zinc-300"
            >
              <X size={14} />
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}

export default ToastContainer;
