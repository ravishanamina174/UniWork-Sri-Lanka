import { Platform } from 'react-native';

import type { TaskGig } from '@/components/TaskMarketplace';

const DEV_HOST = Platform.OS === 'android' ? '10.0.2.2' : '127.0.0.1';

export const API_BASE_URL = `http://127.0.0.1:8000:8000/api/v1`;

export async function fetchAllGigs(): Promise<TaskGig[]> {
  try {
    const response = await fetch(`${API_BASE_URL}/gigs/all`, { cache: 'no-store' });
    if (!response.ok) return [];
    return response.json();
  } catch {
    return [];
  }
}
