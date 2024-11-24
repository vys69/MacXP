import { useEffect, useRef, useState } from 'react';
import './Whiteboard.css';

interface Point {
  x: number;
  y: number;
}

type Tool = 'pencil' | 'brush' | 'line' | 'rectangle' | 'text' | 'eraser' | 'circle';

const Whiteboard = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const overlayCanvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [currentTool, setCurrentTool] = useState<Tool>('pencil');
  const [currentColor, setCurrentColor] = useState('#000000');
  const [lineWidth, setLineWidth] = useState(1);
  const [startPoint, setStartPoint] = useState<Point | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const overlayCanvas = overlayCanvasRef.current;
    if (canvas && overlayCanvas) {
      const ctx = canvas.getContext('2d');
      const overlayCtx = overlayCanvas.getContext('2d');
      if (ctx && overlayCtx) {
        ctx.fillStyle = 'white';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
      }
    }
  }, []);

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    
    const point = {
      x: (e.clientX - rect.left) * scaleX,
      y: (e.clientY - rect.top) * scaleY
    };

    setIsDrawing(true);
    setStartPoint(point);

    if (currentTool === 'pencil' || currentTool === 'brush') {
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.beginPath();
        ctx.strokeStyle = currentColor;
        ctx.lineWidth = currentTool === 'brush' ? lineWidth * 3 : lineWidth;
        ctx.lineCap = 'round';
        ctx.moveTo(point.x, point.y);
      }
    }
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing || !startPoint) return;

    const canvas = canvasRef.current;
    const overlayCanvas = overlayCanvasRef.current;
    if (!canvas || !overlayCanvas) return;

    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    
    const currentPoint = {
      x: (e.clientX - rect.left) * scaleX,
      y: (e.clientY - rect.top) * scaleY
    };

    if (currentTool === 'pencil' || currentTool === 'brush') {
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.lineTo(currentPoint.x, currentPoint.y);
        ctx.stroke();
      }
    } else {
      const overlayCtx = overlayCanvas.getContext('2d');
      if (overlayCtx) {
        overlayCtx.clearRect(0, 0, canvas.width, canvas.height);
        overlayCtx.beginPath();
        overlayCtx.strokeStyle = currentColor;
        overlayCtx.lineWidth = lineWidth;

        if (currentTool === 'line') {
          overlayCtx.moveTo(startPoint.x, startPoint.y);
          overlayCtx.lineTo(currentPoint.x, currentPoint.y);
        } else if (currentTool === 'rectangle') {
          const width = currentPoint.x - startPoint.x;
          const height = currentPoint.y - startPoint.y;
          overlayCtx.strokeRect(startPoint.x, startPoint.y, width, height);
        }
        overlayCtx.stroke();
      }
    }
  };

  const stopDrawing = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing || !startPoint) return;

    const canvas = canvasRef.current;
    const overlayCanvas = overlayCanvasRef.current;
    if (!canvas || !overlayCanvas) return;

    if (currentTool === 'line' || currentTool === 'rectangle') {
      const ctx = canvas.getContext('2d');
      const rect = canvas.getBoundingClientRect();
      const scaleX = canvas.width / rect.width;
      const scaleY = canvas.height / rect.height;
      
      const currentPoint = {
        x: (e.clientX - rect.left) * scaleX,
        y: (e.clientY - rect.top) * scaleY
      };

      if (ctx) {
        ctx.beginPath();
        ctx.strokeStyle = currentColor;
        ctx.lineWidth = lineWidth;

        if (currentTool === 'line') {
          ctx.moveTo(startPoint.x, startPoint.y);
          ctx.lineTo(currentPoint.x, currentPoint.y);
        } else if (currentTool === 'rectangle') {
          const width = currentPoint.x - startPoint.x;
          const height = currentPoint.y - startPoint.y;
          ctx.strokeRect(startPoint.x, startPoint.y, width, height);
        }
        ctx.stroke();
      }

      const overlayCtx = overlayCanvas.getContext('2d');
      if (overlayCtx) {
        overlayCtx.clearRect(0, 0, canvas.width, canvas.height);
      }
    }

    setIsDrawing(false);
    setStartPoint(null);
  };

  const colors = [
    '#800080', '#000000', '#808080', '#808080', '#FF0000', '#FF0000',
    '#FF8000', '#FFFF00', '#00FF00', '#008000', '#00FFFF', '#0000FF',
    '#000080', '#800080', '#FFFFFF', '#C0C0C0', '#808080', '#804000',
    '#FFC0CB', '#FFB6C1', '#FFE4C4', '#FFFDD0', '#98FB98', '#90EE90',
    '#87CEFA', '#B0C4DE', '#E6E6FA', '#DDA0DD'
  ];

  return (
    <div style={{ 
      width: '100%', 
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
      gap: '10px'
    }}>
      <div style={{ 
        display: 'flex', 
        gap: '10px',
        flex: 1,
        minHeight: 0
      }}>
        {/* Tools Panel */}
        <div style={{ 
          width: '60px',
          backgroundColor: '#f0f0f0',
          border: '1px solid #999',
          padding: '5px',
          display: 'flex',
          flexDirection: 'column',
          gap: '5px',
          flexShrink: 0
        }}>
          <button 
            className={`tool-button ${currentTool === 'pencil' ? 'selected' : ''}`}
            onClick={() => setCurrentTool('pencil')}
          >✏️</button>
          <button 
            className={`tool-button ${currentTool === 'brush' ? 'selected' : ''}`}
            onClick={() => setCurrentTool('brush')}
          >🖌️</button>
          <button 
            className={`tool-button ${currentTool === 'eraser' ? 'selected' : ''}`}
            onClick={() => setCurrentTool('eraser')}
          >⌫</button>
          <button 
            className={`tool-button ${currentTool === 'line' ? 'selected' : ''}`}
            onClick={() => setCurrentTool('line')}
          >╱</button>
          <button 
            className={`tool-button ${currentTool === 'rectangle' ? 'selected' : ''}`}
            onClick={() => setCurrentTool('rectangle')}
          >□</button>
          <button 
            className={`tool-button ${currentTool === 'circle' ? 'selected' : ''}`}
            onClick={() => setCurrentTool('circle')}
          >○</button>
          <button 
            className={`tool-button ${currentTool === 'text' ? 'selected' : ''}`}
            onClick={() => setCurrentTool('text')}
          >A</button>
        </div>

        {/* Canvas Container */}
        <div style={{ 
          position: 'relative', 
          flex: 1,
          minWidth: 0
        }}>
          <canvas
            ref={canvasRef}
            width={800}
            height={600}
            style={{ 
              border: '1px solid #999',
              width: '100%',
              height: '100%',
              backgroundColor: 'white',
              display: 'block'
            }}
            onMouseDown={startDrawing}
            onMouseMove={draw}
            onMouseUp={stopDrawing}
            onMouseLeave={stopDrawing}
          />
          <canvas
            ref={overlayCanvasRef}
            width={800}
            height={600}
            style={{
              position: 'absolute',
              left: 0,
              top: 0,
              pointerEvents: 'none',
              width: '100%',
              height: '100%'
            }}
          />
        </div>
      </div>

      {/* Color Palette */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(14, 1fr)',
        gap: '2px',
        padding: '5px',
        backgroundColor: '#f0f0f0',
        border: '1px solid #999'
      }}>
        {colors.map((color, index) => (
          <div
            key={index}
            style={{
              width: '20px',
              height: '20px',
              backgroundColor: color,
              border: currentColor === color ? '2px solid #000' : '1px solid #666',
              padding: 0,
              cursor: 'pointer'
            }}
            onClick={() => setCurrentColor(color)}
          />
        ))}
      </div>

      {/* Line Width Control */}
      <input
        type="range"
        min="1"
        max="10"
        value={lineWidth}
        onChange={(e) => setLineWidth(Number(e.target.value))}
        style={{ width: '100%' }}
      />
    </div>
  );
};

export default Whiteboard;
