import { useOffline } from '../contexts/OfflineContext';

/**
 * Hook that provides a unified API interface that automatically switches
 * between OfflineAPI (for guest mode) and regular API (for authenticated mode)
 */
export function useDataAPI() {
  const { offlineAPI } = useOffline();
  const isGuestMode = localStorage.getItem('guest_mode') === 'true';

  if (isGuestMode) {
    return {
      workspaces: offlineAPI.workspaces,
      notebooks: offlineAPI.notebooks,
      sections: offlineAPI.sections,
      pages: offlineAPI.pages,
    };
  }

  return {
    workspaces: offlineAPI.workspaces,
    notebooks: offlineAPI.notebooks,
    sections: offlineAPI.sections,
    pages: offlineAPI.pages,
  };
}
