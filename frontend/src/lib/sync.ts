import axios from 'axios';
import { getPendingShowings, clearPendingShowing } from './db';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '';

export async function syncPendingShowings() {
  if (!navigator.onLine) return;

  const pendingShowings = await getPendingShowings();
  if (pendingShowings.length === 0) return;

  console.log(`Syncing ${pendingShowings.length} pending showings...`);

  for (const showing of pendingShowings) {
    try {
      // The showing object includes unitId and prospectEmail from IndexedDB
      await axios.post(`${API_BASE_URL}/api/Showings`, {
        unitId: showing.unitId,
        prospectEmail: showing.prospectEmail
      });
      await clearPendingShowing(showing.id);
      console.log(`Synced showing for ${showing.prospectEmail}`);
    } catch (error) {
      console.error(`Failed to sync showing for ${showing.prospectEmail}`, error);
    }
  }
}
