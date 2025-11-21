import { useEffect, useRef, useState } from 'react';
import * as Y from 'yjs';

interface Point {
  x: number;
  y: number;
  pressure: number;
  timestamp: number;
}

interface Stroke {
  id: string;
  points: Point[];
  color: string;
  width: number;
  tool: 'pen' | 'highlighter' | 'eraser';
}

interface InkCanvasProps {
  ydoc: Y.Doc;
  width: number;
  height: number;
}

export function InkCanvas({ ydoc, width, height }: InkCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [currentStroke, setCurrentStroke] = useState<Point[]>([]);
  const [tool, setTool] = useState<'pen' | 'highlighter' | 'eraser'>('pen');
  const [color, setColor] = useState('#000000');
  const [penWidth, setPenWidth] = useState(2);
  const [strokes, setStrokes] = useState<Stroke[]>([]);

  useEffect(() => {
    const yStrokes = ydoc.getArray('ink-strokes');
    
    const updateStrokes = () => {
      const strokeArray: Stroke[] = [];
      yStrokes.forEach((value: any) => {
        strokeArray.push(value);
      });
      setStrokes(strokeArray);
    };

    yStrokes.observe(updateStrokes);
    updateStrokes();

    return () => {
      yStrokes.unobserve(updateStrokes);
    };
  }, [ydoc]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, width, height);

    strokes.forEach((stroke) => {
      if (stroke.points.length < 2) return;

      ctx.beginPath();
      ctx.strokeStyle = stroke.color;
      ctx.lineWidth = stroke.width;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';

      if (stroke.tool === 'highlighter') {
        ctx.globalAlpha = 0.3;
      } else {
        ctx.globalAlpha = 1.0;
      }

      ctx.moveTo(stroke.points[0].x, stroke.points[0].y);

      for (let i = 1; i < stroke.points.length; i++) {
        const point = stroke.points[i];
        const prevPoint = stroke.points[i - 1];
        
        const midX = (prevPoint.x + point.x) / 2;
        const midY = (prevPoint.y + point.y) / 2;
        
        ctx.quadraticCurveTo(prevPoint.x, prevPoint.y, midX, midY);
      }

      ctx.stroke();
      ctx.globalAlpha = 1.0;
    });

    if (currentStroke.length > 0) {
      ctx.beginPath();
      ctx.strokeStyle = color;
      ctx.lineWidth = penWidth;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';

      if (tool === 'highlighter') {
        ctx.globalAlpha = 0.3;
      }

      ctx.moveTo(currentStroke[0].x, currentStroke[0].y);

      for (let i = 1; i < currentStroke.length; i++) {
        const point = currentStroke[i];
        const prevPoint = currentStroke[i - 1];
        
        const midX = (prevPoint.x + point.x) / 2;
        const midY = (prevPoint.y + point.y) / 2;
        
        ctx.quadraticCurveTo(prevPoint.x, prevPoint.y, midX, midY);
      }

      ctx.stroke();
      ctx.globalAlpha = 1.0;
    }
  }, [strokes, currentStroke, width, height, color, penWidth, tool]);

  const getPointerPosition = (e: React.PointerEvent): Point => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0, pressure: 0.5, timestamp: Date.now() };

    const rect = canvas.getBoundingClientRect();
    return {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
      pressure: e.pressure || 0.5,
      timestamp: Date.now(),
    };
  };

  const handlePointerDown = (e: React.PointerEvent) => {
    setIsDrawing(true);
    const point = getPointerPosition(e);
    setCurrentStroke([point]);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDrawing) return;

    const point = getPointerPosition(e);
    setCurrentStroke((prev) => [...prev, point]);
  };

  const handlePointerUp = () => {
    if (!isDrawing || currentStroke.length === 0) return;

    const yStrokes = ydoc.getArray('ink-strokes');
    const stroke: Stroke = {
      id: `stroke-${Date.now()}-${Math.random()}`,
      points: currentStroke,
      color,
      width: penWidth,
      tool,
    };
    yStrokes.push([stroke]);

    setIsDrawing(false);
    setCurrentStroke([]);
  };

  const clearCanvas = () => {
    const yStrokes = ydoc.getArray('ink-strokes');
    yStrokes.delete(0, yStrokes.length);
  };

  return (
    <div className="flex flex-col h-full">
      <div className="border-b p-2 flex gap-2 bg-white items-center">
        <button
          onClick={() => setTool('pen')}
          className={`px-3 py-1 rounded ${
            tool === 'pen' ? 'bg-blue-600 text-white' : 'bg-gray-200'
          }`}
        >
          Pen
        </button>
        <button
          onClick={() => setTool('highlighter')}
          className={`px-3 py-1 rounded ${
            tool === 'highlighter' ? 'bg-blue-600 text-white' : 'bg-gray-200'
          }`}
        >
          Highlighter
        </button>
        <button
          onClick={() => setTool('eraser')}
          className={`px-3 py-1 rounded ${
            tool === 'eraser' ? 'bg-blue-600 text-white' : 'bg-gray-200'
          }`}
        >
          Eraser
        </button>
        
        <div className="flex items-center gap-2 ml-4">
          <label className="text-sm">Color:</label>
          <input
            type="color"
            value={color}
            onChange={(e) => setColor(e.target.value)}
            className="w-8 h-8 cursor-pointer"
          />
        </div>

        <div className="flex items-center gap-2 ml-4">
          <label className="text-sm">Width:</label>
          <input
            type="range"
            min="1"
            max="20"
            value={penWidth}
            onChange={(e) => setPenWidth(Number(e.target.value))}
            className="w-24"
          />
          <span className="text-sm w-8">{penWidth}px</span>
        </div>

        <button
          onClick={clearCanvas}
          className="px-3 py-1 rounded bg-red-600 text-white ml-auto"
        >
          Clear All
        </button>
      </div>

      <div className="flex-1 relative bg-white">
        <canvas
          ref={canvasRef}
          width={width}
          height={height}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerLeave={handlePointerUp}
          className="absolute top-0 left-0 touch-none cursor-crosshair"
          style={{ touchAction: 'none' }}
        />
      </div>
    </div>
  );
}
