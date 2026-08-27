// mobile-client/constants/api.ts
import type { TaskGig } from '@/components/TaskMarketplace';

export const API_BASE_URL =
  process.env.EXPO_PUBLIC_API_BASE_URL ?? 'http://192.168.1.4:8000/api/v1';

export type AuthUser = {
  id: string;
  clerk_id: string;
  email: string;
  role: string;
  is_verified: boolean;
};

let authProfileExists: boolean | null = null;

export function getAuthProfileCache(): boolean | null {
  return authProfileExists;
}

export function setAuthProfileCache(exists: boolean): void {
  authProfileExists = exists;
}

export function resetAuthProfileCache(): void {
  authProfileExists = null;
}

export async function fetchAuthUserByClerkId(
  clerkId: string
): Promise<{ status: number; user: AuthUser | null }> {
  const response = await fetch(`${API_BASE_URL}/auth/user/clerk/${clerkId}`, {
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
  });

  if (response.status === 404) {
    return { status: 404, user: null };
  }

  if (!response.ok) {
    return { status: response.status, user: null };
  }

  const user = (await response.json()) as AuthUser;
  return { status: response.status, user };
}

export async function fetchAllGigs(): Promise<TaskGig[]> {
  try {
    const response = await fetch(`${API_BASE_URL}/gigs/all`, {
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      console.error('Backend error status:', response.status);
      return [];
    }

    return await response.json();
  } catch (error) {
    console.error('Network Fetch Error:', error);
    return [];
  }
}
