import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { IndexedDBAdapter } from '../lib/storage/IndexedDBAdapter';
import { OfflineAPI } from '../lib/storage/OfflineAPI';
import { OfflineDictionary, generateSampleDictionary } from '../lib/dictionary/OfflineDictionary';
import { OfflineAIProvider } from '../lib/ai/OfflineAIProvider';
import { SyncStatus } from '../lib/storage/types';

interface OfflineContextType {
  offlineAPI: OfflineAPI;
  dictionary: OfflineDictionary;
  aiProvider: OfflineAIProvider;
  syncStatus: SyncStatus;
  isInitialized: boolean;
}

const OfflineContext = createContext<OfflineContextType | null>(null);

export function OfflineProvider({ children }: { children: ReactNode }) {
  const [offlineAPI] = useState(() => {
    const storage = new IndexedDBAdapter();
    return new OfflineAPI(storage);
  });
  
  const [dictionary] = useState(() => new OfflineDictionary());
  const [aiProvider] = useState(() => new OfflineAIProvider());
  const [syncStatus, setSyncStatus] = useState<SyncStatus>({
    status: 'offline',
    lastSyncTime: null,
    pendingOperations: 0,
  });
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    const initialize = async () => {
      try {
        const isDictionaryReady = await dictionary.isReady();
        if (!isDictionaryReady) {
          console.log('Loading sample dictionary data...');
          const sampleData = generateSampleDictionary();
          await dictionary.loadDictionary(sampleData);
          console.log('Dictionary loaded successfully');
        }

        const unsubscribe = offlineAPI.getSyncEngine().onStatusChange((status) => {
          setSyncStatus(status);
        });

        const initialStatus = await offlineAPI.getSyncEngine().getStatus();
        setSyncStatus(initialStatus);

        setIsInitialized(true);

        return () => {
          unsubscribe();
        };
      } catch (error) {
        console.error('Failed to initialize offline features:', error);
        setIsInitialized(true); // Still mark as initialized to not block the app
      }
    };

    initialize();
  }, [offlineAPI, dictionary]);

  return (
    <OfflineContext.Provider
      value={{
        offlineAPI,
        dictionary,
        aiProvider,
        syncStatus,
        isInitialized,
      }}
    >
      {children}
    </OfflineContext.Provider>
  );
}

export function useOffline() {
  const context = useContext(OfflineContext);
  if (!context) {
    throw new Error('useOffline must be used within an OfflineProvider');
  }
  return context;
}
