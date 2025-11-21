import { useState } from 'react';
import * as Y from 'yjs';
import { WebsocketProvider } from 'y-websocket';
import { IndexeddbPersistence } from 'y-indexeddb';
import { useEffect } from 'react';
import { InkCanvas } from '../components/InkCanvas';

interface InkPageProps {
  pageId: number;
  userId: number;
  userName: string;
}

const WS_URL = import.meta.env.VITE_WS_URL || 'ws://localhost:8000';

export function InkPage({ pageId, userId }: InkPageProps) {
  const [ydoc] = useState(() => new Y.Doc());
  const [, setProvider] = useState<WebsocketProvider | null>(null);

  useEffect(() => {
    const indexeddbProvider = new IndexeddbPersistence(`ink-page-${pageId}`, ydoc);
    
    const wsProvider = new WebsocketProvider(
      WS_URL,
      `/sync/ws/${pageId}?user_id=${userId}`,
      ydoc
    );
    
    setProvider(wsProvider);

    return () => {
      wsProvider.destroy();
      indexeddbProvider.destroy();
    };
  }, [pageId, userId, ydoc]);

  return (
    <div className="h-full flex flex-col">
      <div className="border-b p-2 bg-gray-100">
        <div className="text-sm text-gray-600">
          Ink Mode (Experimental) - Draw with pen, highlighter, or eraser
        </div>
      </div>
      <InkCanvas ydoc={ydoc} width={1920} height={1080} />
    </div>
  );
}
