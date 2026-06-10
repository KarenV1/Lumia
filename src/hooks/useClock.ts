import { useEffect, useState } from 'react';
import { formatClock } from '../utils/dateHelper.ts';

/**
 * Devuelve la hora del sistema "HH:MM", actualizándose cada minuto.
 */
export const useClock = (): string => {
  const [time, setTime] = useState(() => formatClock());

  useEffect(() => {
    const tick = () => setTime(formatClock());
    // Alinear el primer tick al cambio de minuto
    const now = new Date();
    const msToNextMinute = (60 - now.getSeconds()) * 1000;

    let interval: ReturnType<typeof setInterval>;
    const timeout = setTimeout(() => {
      tick();
      interval = setInterval(tick, 60_000);
    }, msToNextMinute);

    return () => {
      clearTimeout(timeout);
      if (interval) clearInterval(interval);
    };
  }, []);

  return time;
};
