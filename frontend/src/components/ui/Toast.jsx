import { useEffect } from "react";

import { useJDStore } from "../../store/useJDStore";

function Toast() {
  const toasts = useJDStore((s) => s.toasts);

  const dismissToast = useJDStore((s) => s.dismissToast);

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-3 pointer-events-none">
      {toasts.map((toast) => (
        <ToastItem key={toast.id} toast={toast} onDismiss={dismissToast} />
      ))}
    </div>
  );
}

function ToastItem({ toast, onDismiss }) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onDismiss(toast.id);
    }, toast.duration || 3000);

    return () => clearTimeout(timer);
  }, [toast, onDismiss]);

  const styles = {
    success: "bg-green-600 text-white",

    error: "bg-red-600 text-white",

    info: "bg-blue-600 text-white",

    warning: "bg-yellow-500 text-white",
  };

  return (
    <div
      className={`${styles[toast.type] || styles.info}

      min-w-[280px]

      px-4

      py-3

      rounded-lg

      shadow-lg

      flex

      items-center

      justify-between`}
    >
      <span>{toast.message}</span>

      <button onClick={() => onDismiss(toast.id)} className="ml-4 font-bold">
        ×
      </button>
    </div>
  );
}

export default Toast;
