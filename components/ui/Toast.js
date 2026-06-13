'use client';

import { createContext, useContext, useCallback, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { CheckCircle2, Info, AlertTriangle, X } from 'lucide-react';

const ToastContext = createContext(null);

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) return { toast: () => {} };
  return ctx;
}

let counter = 0;

const ICONS = {
  success: <CheckCircle2 size={18} className="text-accent-green" />,
  info: <Info size={18} className="text-accent-blue" />,
  error: <AlertTriangle size={18} className="text-accent-red" />,
};

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const remove = useCallback((id) => {
    setToasts((t) => t.filter((x) => x.id !== id));
  }, []);

  const toast = useCallback(
    (message, type = 'success', duration = 3000) => {
      const id = ++counter;
      setToasts((t) => [...t, { id, message, type }]);
      setTimeout(() => remove(id), duration);
    },
    [remove]
  );

  return (
    <ToastContext.Provider value={{ toast }}>
      {children}
      <div className="fixed top-20 right-4 z-[100] flex flex-col gap-2 pointer-events-none">
        <AnimatePresence>
          {toasts.map((t) => (
            <motion.div
              key={t.id}
              initial={{ opacity: 0, x: 60, scale: 0.9 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: 60, scale: 0.9 }}
              transition={{ type: 'spring', stiffness: 380, damping: 30 }}
              className="pointer-events-auto flex items-center gap-3 rounded-xl border border-subtle bg-bg-elevated px-4 py-3 shadow-card min-w-[260px]"
            >
              {ICONS[t.type]}
              <span className="text-sm text-text-primary flex-1">{t.message}</span>
              <button
                onClick={() => remove(t.id)}
                className="text-text-secondary hover:text-text-primary transition-colors"
                aria-label="Dismiss"
              >
                <X size={15} />
              </button>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
}
