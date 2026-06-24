// mobile-client/constants/api.ts
import type { TaskGig } from '@/components/TaskMarketplace';

const MAC_IP = '192.168.7.2'; // Your Mac's IP
export const API_BASE_URL = `http://${MAC_IP}:8000/api/v1`; 

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