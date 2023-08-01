export const NOTIFY_STORAGE_KEY = {
    STAKING: 'STAKING',
    AIRDROP: 'AIRDROP',
    CONTEST: 'CONTEST',
    AMA: 'AMA',
  };
  
  export const StorageUtils = {
    setItem: (key: string, value: string) => {
      if (typeof window !== 'undefined') {
        localStorage.setItem(key, value);
      }
    },
    setSessionStorageItem: (key: string, value: string) => {
      if (typeof window !== 'undefined') {
        sessionStorage.setItem(key, value);
      }
    },
    getItem: (key: string) => {
      if (typeof window !== 'undefined') {
        return localStorage.getItem(key);
      }
      return null;
    },
    getSessionStorageItem: (key: string) => {
      if (typeof window !== 'undefined') {
        return sessionStorage.getItem(key);
      }
      return null;
    },
    removeItem: (key: string) => {
      if (typeof window !== 'undefined') {
        localStorage.removeItem(key);
      }
    },
    removeSessionStorageItem: (key: string) => {
      if (typeof window !== 'undefined') {
        sessionStorage.removeItem(key);
      }
    },
  };
  
  export const removeStorageNotify = () => {
    if (typeof window !== 'undefined') {
      for (const storageKeyItem in NOTIFY_STORAGE_KEY) {
        localStorage.removeItem(storageKeyItem);
      }
    }
  };
  