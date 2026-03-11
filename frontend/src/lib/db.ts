import { openDB, type IDBPDatabase } from 'idb';

const DB_NAME = 'broker-showings-db';
const STORE_NAME = 'pending-showings';

export async function getDb(): Promise<IDBPDatabase> {
  return openDB(DB_NAME, 1, {
    upgrade(db) {
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: 'id', autoIncrement: true });
      }
    },
  });
}

export async function savePendingShowing(showing: any) {
  const db = await getDb();
  await db.add(STORE_NAME, showing);
}

export async function getPendingShowings() {
  const db = await getDb();
  return db.getAll(STORE_NAME);
}

export async function clearPendingShowing(id: number) {
  const db = await getDb();
  await db.delete(STORE_NAME, id);
}
