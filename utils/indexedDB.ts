import { openDB } from 'idb';

export const saveAddressToDB = async (key: string, value: string) => {
  const db = await openDB('conditionDatabase', 1, {
    upgrade(db) {
      db.createObjectStore('addresses');
    },
  });

  const tx = db.transaction('addresses', 'readwrite');
  const store = tx.objectStore('addresses');
  await store.put(value, key);
  await tx.done;
};

export const getAddressFromDB = async (key: string): Promise<string | undefined> => {
  const db = await openDB('conditionDatabase', 1, {
    upgrade(db) {
      if (!db.objectStoreNames.contains('addresses')) {
        db.createObjectStore('addresses');
      }
    },
  });

  try {
    const tx = db.transaction('addresses', 'readonly');
    const store = tx.objectStore('addresses');
    const value = await store.get(key);
    await tx.done;
    return value;
  } catch (error) {
    console.error('Error reading from indexedDB:', error);
    return undefined;
  }
};
