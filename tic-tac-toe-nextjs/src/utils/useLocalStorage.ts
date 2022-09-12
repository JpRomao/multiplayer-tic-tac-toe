import { useCallback, useMemo } from "react";

type UseStorageReturnValue = {
  getItem: (key: string) => any;
  setItem: (key: string, value: string | object) => boolean;
  removeItem: (key: string) => void;
};

export const useLocalStorage = (): UseStorageReturnValue => {
  const storageType = "localStorage";

  const isBrowser: boolean = ((): boolean => typeof window !== "undefined")();

  const getItem = useCallback(
    (key: string): any => {
      if (isBrowser) {
        const item = window[storageType].getItem(key);

        return item ? JSON.parse(item) : null;
      }

      return null;
    },
    [isBrowser]
  );

  const setItem = useCallback(
    (key: string, value: string | object): boolean => {
      if (isBrowser) {
        if (typeof value === "object") {
          window[storageType][key] = JSON.stringify(value);
        } else {
          window[storageType].setItem(key, value);
        }

        return true;
      }

      return false;
    },
    [isBrowser]
  );

  const removeItem = useCallback((key: string): void => {
    window[storageType].removeItem(key);
  }, []);

  return useMemo(
    () => ({ getItem, setItem, removeItem }),
    [getItem, setItem, removeItem]
  );
};
