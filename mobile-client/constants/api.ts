// mobile-client/constants/api.ts
import type { TaskGig } from '@/components/TaskMarketplace';

// Use environment variable or fallback to local IP
export const API_BASE_URL = 'http://192.168.1.10:8000/api/v1'
  process.env.EXPO_PUBLIC_API_BASE_URL ?? 'http://192.168.1.10:8000/api/v1'; 

export async function fetchAllGigs(): Promise<TaskGig[]> {
  try {
    // Combine the base URL (/api/v1) with the endpoint (/gigs/all)
    const response = await fetch(`${API_BASE_URL}/gigs/all`, {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    });
    
    if (!response.ok) {
        console.error("Backend error status:", response.status);
        return [];
    }
    
    return await response.json();
  } catch (error) {
    console.error("Network Fetch Error:", error);
    return [];
  }
}