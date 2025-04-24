import { useEffect, useRef, useState } from 'react';
import type { Dispatch, SetStateAction } from 'react';

export function useLocalStorage<T>(
  defaultValue: T,
  key: string,
): [T, Dispatch<SetStateAction<T>>] {
  const [value, setValue] = useState<T>(
    JSON.parse(localStorage.getItem(key) ?? 'null') ?? defaultValue,
  );

  useEffect(() => {
    localStorage.setItem(key, JSON.stringify(value));
  }, [value, key]);

  return [value, setValue];
}

export function useWakeLock(lock: boolean) {
  const sentinelRef = useRef<WakeLockSentinel | null>(null);

  useEffect(() => {
    let good = true;

    if (!('wakeLock' in navigator)) return;
    if (lock) {
      if (sentinelRef.current === null) {
        navigator.wakeLock.request().then((sentinel) => {
          if (good) {
            sentinelRef.current = sentinel;
          } else {
            sentinel.release();
          }
        });
      }
    } else {
      if (sentinelRef.current) {
        sentinelRef.current.release();
        sentinelRef.current = null;
      }
    }

    return () => {
      good = false;
    };
  }, [lock]);
}
