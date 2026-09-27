import { useCallback, useEffect, useRef, useState } from "react";

export const useConfirmation = (delay: number = 5000) => {
  const [isConfirmed, setIsConfirmed] = useState(false);
  const timerRef = useRef<number | null>(null);

  const triggerConfirmation = useCallback(() => {
    setIsConfirmed(true);

    if (timerRef.current) clearTimeout(timerRef.current);

    timerRef.current = setTimeout(() => {
      setIsConfirmed(false);
    }, delay);
  }, [delay]);

  const resetConfirmation = useCallback(() => {
    if (timerRef.current) clearTimeout(timerRef.current);

    setIsConfirmed(false);
  }, []);

  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  return { isConfirmed, triggerConfirmation, resetConfirmation };
};
