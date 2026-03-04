import { Platform } from 'react-native';

// Android emulator uses 10.0.2.2 to reach host localhost
// iOS simulator and web use localhost directly
// For physical devices, replace with your machine's LAN IP (e.g. 192.168.1.105)
const getBaseUrl = (): string => {
  if (__DEV__) {
    if (Platform.OS === 'android') {
      return 'http://10.0.2.2:3000';
    }
    // iOS simulator or web
    return 'http://localhost:3000';
  }
  // Production URL — update when you deploy
  return 'https://your-production-api.com';
};

export const API_BASE_URL = getBaseUrl();

// ── Generic fetch helper ────────────────────────────────────────────
async function request<T>(
  endpoint: string,
  options: RequestInit = {},
): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`;

  const response = await fetch(url, {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  });

  if (!response.ok) {
    const errorBody = await response.text();
    throw new Error(`API ${response.status}: ${errorBody}`);
  }

  return response.json() as Promise<T>;
}

// ── Types (mirror backend DTOs) ─────────────────────────────────────
export interface GuideRequest {
  mode: string;
  screenTexts: string[];
}

export interface GuideResponse {
  sessionId: string;
  instruction: string;
}

// ── API methods ─────────────────────────────────────────────────────
export const api = {
  /** POST /assistance/guide */
  getGuide(body: GuideRequest): Promise<GuideResponse> {
    return request<GuideResponse>('/assistance/guide', {
      method: 'POST',
      body: JSON.stringify(body),
    });
  },

  /** Health check — GET / */
  ping(): Promise<unknown> {
    return request('/');
  },
};
