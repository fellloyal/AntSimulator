import { useRef, useState, useEffect, useCallback } from 'react';
import { ArrowLeft, Save, Square, Apple, Eraser } from 'lucide-react';
import useStore, { type EditorTool } from '@/store/useStore';
import { createMap, updateMap } from '@/api/maps';

const CELL_SIZE = 4;

export default function MapEditor() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const setPage = useStore((s) => s.setPage);
  const editorMapId = useStore((s) => s.editorMapId);
  const editorMapName = useStore((s) => s.editorMapName);
  const editorMapWidth = useStore((s) => s.editorMapWidth);
  const editorMapHeight = useStore((s) => s.editorMapHeight);
  const editorGridData = useStore((s) => s.editorGridData);
  const setEditorMap = useStore((s) => s.setEditorMap);

  const [tool, setTool] = useState<EditorTool>('wall');
  const [brushSize, setBrushSize] = useState(3);
  const [mapName, setMapName] = useState(editorMapName || '新地图');
  const [saving, setSaving] = useState(false);
  const [saveMsg, setSaveMsg] = useState('');
  const [drawing, setDrawing] = useState(false);

  // Grid data: 0=empty, 1=wall, 2+=food
  const gridRef = useRef<Uint8Array | null>(null);
  const dirtyRef = useRef<Set<number>>(new Set());

  // Viewport
  const viewportRef = useRef({ offsetX: 0, offsetY: 0, zoom: 1 });
  const [dragging, setDragging] = useState(false);
  const dragStartRef = useRef({ x: 0, y: 0, offsetX: 0, offsetY: 0 });

  const gridW = Math.ceil(editorMapWidth / CELL_SIZE);
  const gridH = Math.ceil(editorMapHeight / CELL_SIZE);

  // Initialize grid
  useEffect(() => {
    const newGrid = new Uint8Array(gridW * gridH);
    // Load existing grid data if editing an existing map
    if (editorGridData) {
      try {
        const data = JSON.parse(editorGridData);
        for (const [cx, cy] of data.walls || []) {
          const gx = cx as number;
          const gy = cy as number;
          if (gx >= 0 && gx < gridW && gy >= 0 && gy < gridH) {
            newGrid[gy * gridW + gx] = 1;
          }
        }
        for (const [cx, cy, qty] of data.foods || []) {
          const gx = cx as number;
          const gy = cy as number;
          if (gx >= 0 && gx < gridW && gy >= 0 && gy < gridH) {
            newGrid[gy * gridW + gx] = Math.max(1, qty as number) + 1;
          }
        }
      } catch (e) {
        console.error('Failed to parse editorGridData:', e);
      }
    }
    gridRef.current = newGrid;
    dirtyRef.current = new Set();
  }, [gridW, gridH, editorGridData]);

  // Render
  const render = useCallback(() => {
    const canvas = canvasRef.current;
    const grid = gridRef.current;
    if (!canvas || !grid) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const cw = canvas.width;
    const ch = canvas.height;
    const vp = viewportRef.current;

    ctx.clearRect(0, 0, cw, ch);
    ctx.fillStyle = '#111111';
    ctx.fillRect(0, 0, cw, ch);

    ctx.save();
    ctx.translate(vp.offsetX, vp.offsetY);
    ctx.scale(vp.zoom, vp.zoom);

    // Visible range
    const invZoom = 1.0 / vp.zoom;
    const vl = -vp.offsetX * invZoom;
    const vt = -vp.offsetY * invZoom;
    const vr = vl + cw * invZoom;
    const vb = vt + ch * invZoom;

    const sx = Math.max(0, Math.floor(vl / CELL_SIZE));
    const sy = Math.max(0, Math.floor(vt / CELL_SIZE));
    const ex = Math.min(gridW - 1, Math.ceil(vr / CELL_SIZE));
    const ey = Math.min(gridH - 1, Math.ceil(vb / CELL_SIZE));

    // Batch by type
    const wallCells: [number, number][] = [];
    const foodCells: [number, number, number][] = [];

    for (let y = sy; y <= ey; y++) {
      for (let x = sx; x <= ex; x++) {
        const val = grid[y * gridW + x];
        if (val === 1) wallCells.push([x, y]);
        else if (val >= 2) foodCells.push([x, y, val]);
      }
    }

    ctx.fillStyle = '#726b6b';
    for (const [x, y] of wallCells) {
      ctx.fillRect(x * CELL_SIZE, y * CELL_SIZE, CELL_SIZE, CELL_SIZE);
    }

    for (const [x, y, qty] of foodCells) {
      const g = Math.min(255, 100 + qty * 10) | 0;
      ctx.fillStyle = `rgb(0,${g},0)`;
      ctx.fillRect(x * CELL_SIZE, y * CELL_SIZE, CELL_SIZE, CELL_SIZE);
    }

    // Grid border
    ctx.strokeStyle = 'rgba(255,255,255,0.1)';
    ctx.lineWidth = 1;
    ctx.strokeRect(0, 0, editorMapWidth, editorMapHeight);

    ctx.restore();
  }, [gridW, gridH, editorMapWidth, editorMapHeight]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const resize = () => {
      canvas.width = canvas.clientWidth;
      canvas.height = canvas.clientHeight;
      render();
    };
    resize();
    window.addEventListener('resize', resize);
    return () => window.removeEventListener('resize', resize);
  }, [render]);

  // Paint on grid
  const paint = useCallback((canvasX: number, canvasY: number) => {
    const grid = gridRef.current;
    if (!grid) return;
    const vp = viewportRef.current;
    const worldX = (canvasX - vp.offsetX) / vp.zoom;
    const worldY = (canvasY - vp.offsetY) / vp.zoom;
    const cx = Math.floor(worldX / CELL_SIZE);
    const cy = Math.floor(worldY / CELL_SIZE);

    for (let dy = -brushSize + 1; dy < brushSize; dy++) {
      for (let dx = -brushSize + 1; dx < brushSize; dx++) {
        const gx = cx + dx;
        const gy = cy + dy;
        if (gx < 0 || gx >= gridW || gy < 0 || gy >= gridH) continue;
        const idx = gy * gridW + gx;
        if (tool === 'wall') {
          grid[idx] = 1;
        } else if (tool === 'food') {
          grid[idx] = Math.max(grid[idx], 2);
        } else if (tool === 'erase') {
          grid[idx] = 0;
        }
        dirtyRef.current.add(idx);
      }
    }
    render();
  }, [tool, brushSize, gridW, gridH, render]);

  // Mouse handlers
  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    if (e.button === 1 || (e.button === 0 && e.altKey)) {
      // Middle click or alt+left: pan
      setDragging(true);
      dragStartRef.current = {
        x: e.clientX, y: e.clientY,
        offsetX: viewportRef.current.offsetX,
        offsetY: viewportRef.current.offsetY,
      };
    } else if (e.button === 0) {
      setDrawing(true);
      paint(e.clientX, e.clientY);
    }
  }, [paint]);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (dragging) {
      const dx = e.clientX - dragStartRef.current.x;
      const dy = e.clientY - dragStartRef.current.y;
      viewportRef.current.offsetX = dragStartRef.current.offsetX + dx;
      viewportRef.current.offsetY = dragStartRef.current.offsetY + dy;
      render();
    } else if (drawing) {
      paint(e.clientX, e.clientY);
    }
  }, [dragging, drawing, paint, render]);

  const handleMouseUp = useCallback(() => {
    setDragging(false);
    setDrawing(false);
  }, []);

  const handleWheel = useCallback((e: React.WheelEvent) => {
    const vp = viewportRef.current;
    const oldZoom = vp.zoom;
    const factor = e.deltaY > 0 ? 0.9 : 1.1;
    const newZoom = Math.max(0.1, Math.min(10, oldZoom * factor));
    const ratio = newZoom / oldZoom;
    vp.offsetX = e.clientX - (e.clientX - vp.offsetX) * ratio;
    vp.offsetY = e.clientY - (e.clientY - vp.offsetY) * ratio;
    vp.zoom = newZoom;
    render();
  }, [render]);

  // Save
  const handleSave = useCallback(async () => {
    const grid = gridRef.current;
    if (!grid) return;
    setSaving(true);
    try {
      const walls: number[][] = [];
      const foods: number[][] = [];
      for (let i = 0; i < grid.length; i++) {
        const val = grid[i];
        if (val === 1) {
          walls.push([i % gridW, Math.floor(i / gridW)]);
        } else if (val >= 2) {
          foods.push([i % gridW, Math.floor(i / gridW), val - 1]);
        }
      }
      const gridData = JSON.stringify({ cellSize: CELL_SIZE, walls, foods });

      // Generate thumbnail
      const canvas = canvasRef.current;
      let thumbnail = '';
      if (canvas) {
        const thumbCanvas = document.createElement('canvas');
        thumbCanvas.width = 200;
        thumbCanvas.height = Math.round(200 * editorMapHeight / editorMapWidth);
        const tctx = thumbCanvas.getContext('2d')!;
        tctx.drawImage(canvas, 0, 0, thumbCanvas.width, thumbCanvas.height);
        thumbnail = thumbCanvas.toDataURL('image/jpeg', 0.6);
      }

      if (editorMapId) {
        await updateMap(editorMapId, { name: mapName, grid_data: gridData, thumbnail });
      } else {
        const result = await createMap({ name: mapName, width: editorMapWidth, height: editorMapHeight });
        await updateMap(result.id, { grid_data: gridData, thumbnail });
        setEditorMap(result.id, mapName, editorMapWidth, editorMapHeight);
      }
      setSaveMsg(`地图 "${mapName}" 保存成功`);
      setTimeout(() => setSaveMsg(''), 3000);
    } catch (err) {
      console.error('Save failed:', err);
      setSaveMsg('保存失败');
      setTimeout(() => setSaveMsg(''), 3000);
    }
    setSaving(false);
  }, [editorMapId, mapName, editorMapWidth, editorMapHeight, gridW, setEditorMap]);

  // Size presets
  const sizePresets = [
    { label: '小 960×540', w: 960, h: 540 },
    { label: '中 1920×1080', w: 1920, h: 1080 },
    { label: '大 3840×2160', w: 3840, h: 2160 },
  ];

  const tools: { id: EditorTool; icon: React.ReactNode; label: string }[] = [
    { id: 'wall', icon: <Square size={16} />, label: '墙壁(W)' },
    { id: 'food', icon: <Apple size={16} />, label: '食物(F)' },
    { id: 'erase', icon: <Eraser size={16} />, label: '擦除(E)' },
  ];

  return (
    <div className="relative h-screen w-screen overflow-hidden bg-[#0a0f0a]">
      <canvas
        ref={canvasRef}
        className="absolute inset-0 h-full w-full cursor-crosshair"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onWheel={handleWheel}
        onContextMenu={(e) => e.preventDefault()}
      />

      {/* Top bar */}
      <div className="absolute left-4 right-4 top-4 z-10 flex items-center gap-3">
        <button
          onClick={() => setPage('menu')}
          className="flex items-center gap-2 rounded-lg bg-white/5 px-3 py-2 text-sm text-[#8a9a8a] transition-colors hover:bg-white/10"
        >
          <ArrowLeft size={16} />
          返回
        </button>

        <input
          type="text"
          value={mapName}
          onChange={(e) => setMapName(e.target.value)}
          className="rounded-lg bg-white/5 px-3 py-2 text-sm text-[#e0e8e0] outline-none border border-white/10 focus:border-[#429942]/50"
          style={{ width: 160 }}
          placeholder="地图名称"
        />

        <div className="flex gap-1">
          {sizePresets.map((p) => (
            <button
              key={p.w}
              onClick={() => setEditorMap(null, mapName, p.w, p.h)}
              className="rounded-lg px-2 py-1 text-xs transition-colors"
              style={{
                background: editorMapWidth === p.w ? 'var(--accent-green)' : 'rgba(255,255,255,0.05)',
                color: editorMapWidth === p.w ? '#000' : 'var(--text-secondary)',
              }}
            >
              {p.label}
            </button>
          ))}
        </div>

        <div className="flex-1" />

        {saveMsg && (
          <span className="text-sm font-medium px-3 py-1 rounded-lg" style={{
            color: saveMsg.includes('成功') ? '#429942' : '#ff4944',
            background: saveMsg.includes('成功') ? 'rgba(66,153,66,0.1)' : 'rgba(255,73,68,0.1)',
          }}>
            {saveMsg}
          </span>
        )}

        <button
          onClick={handleSave}
          disabled={saving}
          className="flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-bold transition-colors"
          style={{
            background: saving ? 'rgba(66,153,66,0.3)' : 'var(--accent-green)',
            color: '#000',
          }}
        >
          <Save size={16} />
          {saving ? '保存中...' : '保存'}
        </button>
      </div>

      {/* Left toolbar */}
      <div className="absolute left-4 top-20 z-10 glass-panel p-2 flex flex-col gap-1">
        {tools.map((t) => (
          <button
            key={t.id}
            onClick={() => setTool(t.id)}
            className="flex items-center gap-2 rounded-lg px-3 py-2 text-xs transition-colors"
            style={{
              background: tool === t.id ? 'var(--accent-green)' : 'transparent',
              color: tool === t.id ? '#000' : 'var(--text-secondary)',
            }}
            title={t.label}
          >
            {t.icon}
          </button>
        ))}
        <div className="border-t border-white/5 my-1" />
        <div className="px-2 py-1 text-[10px]" style={{ color: 'var(--text-secondary)' }}>
          笔刷
        </div>
        <input
          type="range"
          min={1}
          max={8}
          value={brushSize}
          onChange={(e) => setBrushSize(Number(e.target.value))}
          className="w-full custom-range"
        />
      </div>

      {/* Keyboard shortcuts */}
      <div className="absolute bottom-4 left-4 z-10 text-[10px]" style={{ color: 'var(--text-secondary)' }}>
        Alt+拖拽: 平移 | 滚轮: 缩放 | W: 墙壁 | F: 食物 | E: 擦除
      </div>
    </div>
  );
}
