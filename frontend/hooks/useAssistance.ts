import { useState, useCallback } from 'react';
import { api, GuideResponse } from '@/services/api';

interface UseAssistanceState {
  loading: boolean;
  error: string | null;
  response: GuideResponse | null;
}

export function useAssistance() {
  const [state, setState] = useState<UseAssistanceState>({
    loading: false,
    error: null,
    response: null,
  });

  const requestGuide = useCallback(
    async (mode: string, screenTexts: string[]) => {
      setState({ loading: true, error: null, response: null });
      try {
        const data = await api.getGuide({ mode, screenTexts });
        setState({ loading: false, error: null, response: data });
        return data;
      } catch (err: unknown) {
        const message =
          err instanceof Error ? err.message : 'Error desconocido';
        setState({ loading: false, error: message, response: null });
        return null;
      }
    },
    [],
  );

  const clear = useCallback(() => {
    setState({ loading: false, error: null, response: null });
  }, []);

  return { ...state, requestGuide, clear };
}
