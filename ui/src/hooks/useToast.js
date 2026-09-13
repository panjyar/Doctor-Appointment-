import { useState, useCallback } from 'react';

export function useToast() {
  const [toast, setToast] = useState(null);

  const notify = useCallback((message, type = 'success') => {
    setToast({ message, type });
    window.setTimeout(() => setToast(null), 3500);
  }, []);

  const closeToast = useCallback(() => setToast(null), []);

  return { toast, notify, closeToast };
}
