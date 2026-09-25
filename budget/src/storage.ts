import AsyncStorage from '@react-native-async-storage/async-storage';
import { useCallback, useEffect, useState } from 'react';
import type { Data } from './types';

const KEY = 'budget:data:v1';
const EMPTY: Data = { expenses: [], budget: 0 };

/** App data persisted on the device. */
export function useData() {
  const [data, setData] = useState<Data>(EMPTY);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    AsyncStorage.getItem(KEY)
      .then((raw) => raw && setData({ ...EMPTY, ...JSON.parse(raw) }))
      .catch(() => {})
      .finally(() => setLoaded(true));
  }, []);

  const update = useCallback((fn: (d: Data) => Data) => {
    setData((prev) => {
      const next = fn(prev);
      AsyncStorage.setItem(KEY, JSON.stringify(next)).catch(() => {});
      return next;
    });
  }, []);

  return { data, loaded, update };
}
