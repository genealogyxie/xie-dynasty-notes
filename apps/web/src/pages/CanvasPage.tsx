import { useEffect, useState, useRef } from 'react';
import * as Y from 'yjs';
import { WebsocketProvider } from 'y-websocket';
import { IndexeddbPersistence } from 'y-indexeddb';

interface Block {
  id: string;
  type: 'text' | 'image' | 'ink';
  x: number;
  y: number;
  width: number;
  height: number;
  zIndex: number;
}

interface CanvasPageProps {
  pageId: number;
  userId: number;
  userName: string;
}

const WS_URL = import.meta.env.VITE_WS_URL || 'ws://localhost:8000';
const GRID_SIZE = 20;

export function CanvasPage({ pageId, userId }: CanvasPageProps) {
  const [ydoc] = useState(() => new Y.Doc());
  const [, setProvider] = useState<WebsocketProvider | null>(null);
  const [blocks, setBlocks] = useState<Block[]>([]);
  const [selectedBlockId, setSelectedBlockId] = useState<string | null>(null);
  const [draggingBlockId, setDraggingBlockId] = useState<string | null>(null);
  const [resizingBlockId, setResizingBlockId] = useState<string | null>(null);
  const [dragStart, setDragStart] = useState<{ x: number; y: number } | null>(null);
  const canvasRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const indexeddbProvider = new IndexeddbPersistence(`canvas-page-${pageId}`, ydoc);
    
    const wsProvider = new WebsocketProvider(
      WS_URL,
      `/sync/ws/${pageId}?user_id=${userId}`,
      ydoc
    );
    
    setProvider(wsProvider);

    const yBlocks = ydoc.getMap('blocks');
    
    const updateBlocks = () => {
      const blockArray: Block[] = [];
      yBlocks.forEach((value: any, key: string) => {
        blockArray.push({ id: key, ...value });
      });
      setBlocks(blockArray.sort((a, b) => a.zIndex - b.zIndex));
    };

    yBlocks.observe(updateBlocks);
    updateBlocks();

    return () => {
      yBlocks.unobserve(updateBlocks);
      wsProvider.destroy();
      indexeddbProvider.destroy();
    };
  }, [pageId, userId, ydoc]);

  const snapToGrid = (value: number) => {
    return Math.round(value / GRID_SIZE) * GRID_SIZE;
  };

  const createTextBlock = () => {
    const yBlocks = ydoc.getMap('blocks');
    const id = `block-${Date.now()}-${Math.random()}`;
    const newBlock = {
      type: 'text',
      x: 100,
      y: 100,
      width: 400,
      height: 200,
      zIndex: blocks.length,
    };
    yBlocks.set(id, newBlock);
  };

  const handleMouseDown = (blockId: string, e: React.MouseEvent) => {
    if ((e.target as HTMLElement).classList.contains('resize-handle')) {
      setResizingBlockId(blockId);
    } else {
      setDraggingBlockId(blockId);
    }
    setSelectedBlockId(blockId);
    setDragStart({ x: e.clientX, y: e.clientY });
    e.stopPropagation();
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!dragStart) return;

    const deltaX = e.clientX - dragStart.x;
    const deltaY = e.clientY - dragStart.y;

    if (draggingBlockId) {
      const block = blocks.find(b => b.id === draggingBlockId);
      if (block) {
        const yBlocks = ydoc.getMap('blocks');
        yBlocks.set(draggingBlockId, {
          ...block,
          x: snapToGrid(block.x + deltaX),
          y: snapToGrid(block.y + deltaY),
        });
        setDragStart({ x: e.clientX, y: e.clientY });
      }
    } else if (resizingBlockId) {
      const block = blocks.find(b => b.id === resizingBlockId);
      if (block) {
        const yBlocks = ydoc.getMap('blocks');
        yBlocks.set(resizingBlockId, {
          ...block,
          width: Math.max(100, snapToGrid(block.width + deltaX)),
          height: Math.max(100, snapToGrid(block.height + deltaY)),
        });
        setDragStart({ x: e.clientX, y: e.clientY });
      }
    }
  };

  const handleMouseUp = () => {
    setDraggingBlockId(null);
    setResizingBlockId(null);
    setDragStart(null);
  };

  const handleCanvasClick = () => {
    setSelectedBlockId(null);
  };

  return (
    <div className="h-full flex flex-col bg-gray-50">
      <div className="border-b p-2 flex gap-2 bg-white">
        <button
          onClick={createTextBlock}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Add Text Block
        </button>
        <div className="text-sm text-gray-600 flex items-center ml-4">
          Canvas Mode (Experimental) - Movable & Resizable Blocks
        </div>
      </div>
      
      <div
        ref={canvasRef}
        className="flex-1 relative overflow-auto"
        style={{
          backgroundImage: `
            linear-gradient(to right, #e5e7eb 1px, transparent 1px),
            linear-gradient(to bottom, #e5e7eb 1px, transparent 1px)
          `,
          backgroundSize: `${GRID_SIZE}px ${GRID_SIZE}px`,
        }}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onClick={handleCanvasClick}
      >
        {blocks.map((block) => (
          <div
            key={block.id}
            className={`absolute border-2 bg-white shadow-md ${
              selectedBlockId === block.id ? 'border-blue-500' : 'border-gray-300'
            }`}
            style={{
              left: block.x,
              top: block.y,
              width: block.width,
              height: block.height,
              zIndex: block.zIndex,
              cursor: draggingBlockId === block.id ? 'grabbing' : 'grab',
            }}
            onMouseDown={(e) => handleMouseDown(block.id, e)}
          >
            <div className="p-4 h-full">
              {block.type === 'text' && (
                <div className="text-sm">
                  Text Block {block.id.slice(-8)}
                  <br />
                  <span className="text-xs text-gray-500">
                    Position: ({block.x}, {block.y})
                    <br />
                    Size: {block.width}x{block.height}
                  </span>
                </div>
              )}
            </div>
            {selectedBlockId === block.id && (
              <div
                className="resize-handle absolute bottom-0 right-0 w-4 h-4 bg-blue-500 cursor-se-resize"
                style={{ cursor: 'se-resize' }}
              />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
