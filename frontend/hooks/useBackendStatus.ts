import { useState, useEffect, useCallback } from 'react';
import { API_BASE_URL } from '@/services/api';

type Status = 'checking' | 'connected' | 'disconnected';

export function useBackendStatus() {
  const [status, setStatus] = useState<Status>('checking');

  const check = useCallback(async () => {
    setStatus('checking');
    try {
      const res = await fetch(API_BASE_URL, { method: 'GET' });
      setStatus(res.ok ? 'connected' : 'disconnected');
    } catch {
      setStatus('disconnected');
    }
  }, []);

  useEffect(() => {
    check();
  }, [check]);

  return { status, retry: check };
}
