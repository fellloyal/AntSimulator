import { useRef, useState, useEffect, useCallback } from 'react';
import { ArrowLeft, Play, Trash2, Pencil } from 'lucide-react';
import useStore from '@/store/useStore';
import { fetchMaps, fetchMap, deleteMap, type MapInfo } from '@/api/maps';

export default function GameSetup() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const setPage = useStore((s) => s.setPage);
  const startSimulation = useStore((s) => s.startSimulation);
  const selectedMapId = useStore((s) => s.selectedMapId);
  const setSelectedMapId = useStore((s) => s.setSelectedMapId);
  const setEditorMap = useStore((s) => s.setEditorMap);
  const colonyPositions = useStore((s) => s.colonyPositions);
  const setColonyPositions = useStore((s) => s.setColonyPositions);

  const [maps, setMaps] = useState<MapInfo[]>([]);
  const [loading, setLoading] = useState(true);
  const [gridData, setGridData] = useState<string>('');
  const [mapWidth, setMapWidth] = useState(1920);
  const [mapHeight, setMapHeight] = useState(1080);
  const [workerCount, setWorkerCount] = useState(400);
  const [soldierCount, setSoldierCount] = useState(50);
  const [colonyCount, setColonyCount] = useState(1);

  // Viewport
  const viewportRef = useRef({ offsetX: 0, offsetY: 0, zoom: 1 });
  const [dragging, setDragging] = useState(false);
  const dragStartRef = useRef({ x: 0, y: 0, offsetX: 0, offsetY: 0 });

  // Load maps list
  useEffect(() => {
    fetchMaps().then((data) => {
      setMaps(data);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  // Load selected map data
  useEffect(() => {
    if (selectedMapId === null) {
      setGridData('');
      return;
    }
    fetchMap(selectedMapId).then((data) => {
      setGridData(data.grid_data);
      setMapWidth(data.width);
      setMapHeight(data.height);
      setColonyPositions([]);
    });
  }, [selectedMapId, setColonyPositions]);

  // Render map preview
  const render = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
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

    // Parse and render grid data
    if (gridData) {
      try {
        const data = JSON.parse(gridData);
        const cs = data.cellSize || 4;
        ctx.fillStyle = '#726b6b';
        for (const [cx, cy] of data.walls || []) {
          ctx.fillRect((cx as number) * cs, (cy as number) * cs, cs, cs);
        }
        for (const [cx, cy, qty] of data.foods || []) {
          const g = Math.min(255, 100 + (qty as number) * 10) | 0;
          ctx.fillStyle = `rgb(0,${g},0)`;
          ctx.fillRect((cx as number) * cs, (cy as number) * cs, cs, cs);
        }
      } catch { /* ignore */ }
    }

    // Render colony positions
    const colors = ['#ff4944', '#4488ff', '#ffdd44', '#32ffff'];
    for (let i = 0; i < colonyPositions.length; i++) {
      const pos = colonyPositions[i];
      ctx.strokeStyle = colors[i] || '#ffffff';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(pos.x, pos.y, 20, 0, Math.PI * 2);
      ctx.stroke();
      ctx.fillStyle = colors[i] || '#ffffff';
      ctx.globalAlpha = 0.3;
      ctx.fill();
      ctx.globalAlpha = 1.0;
      ctx.font = '12px sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(`${i + 1}`, pos.x, pos.y);
    }

    // Map border
    ctx.strokeStyle = 'rgba(255,255,255,0.2)';
    ctx.lineWidth = 1;
    ctx.strokeRect(0, 0, mapWidth, mapHeight);

    ctx.restore();
  }, [gridData, mapWidth, mapHeight, colonyPositions]);

  // Canvas resize
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

  // Re-render on data change
  useEffect(() => { render(); }, [render]);

  // Helper: convert client coords to canvas-local coords
  const clientToCanvas = useCallback((clientX: number, clientY: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return { cx: 0, cy: 0 };
    const rect = canvas.getBoundingClientRect();
    return { cx: clientX - rect.left, cy: clientY - rect.top };
  }, []);

  // Mouse handlers
  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    if (e.button === 1 || (e.button === 0 && e.altKey)) {
      setDragging(true);
      dragStartRef.current = {
        x: e.clientX, y: e.clientY,
        offsetX: viewportRef.current.offsetX,
        offsetY: viewportRef.current.offsetY,
      };
      e.preventDefault();
    } else if (e.button === 0 && selectedMapId !== null) {
      const { cx, cy } = clientToCanvas(e.clientX, e.clientY);
      const vp = viewportRef.current;
      const worldX = (cx - vp.offsetX) / vp.zoom;
      const worldY = (cy - vp.offsetY) / vp.zoom;
      if (worldX >= 0 && worldX <= mapWidth && worldY >= 0 && worldY <= mapHeight) {
        const newPositions = [...colonyPositions];
        if (newPositions.length < colonyCount) {
          newPositions.push({ x: worldX, y: worldY });
        } else {
          newPositions[colonyCount - 1] = { x: worldX, y: worldY };
        }
        setColonyPositions(newPositions);
      }
    }
  }, [selectedMapId, mapWidth, mapHeight, colonyPositions, colonyCount, setColonyPositions, clientToCanvas]);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (dragging) {
      const dx = e.clientX - dragStartRef.current.x;
      const dy = e.clientY - dragStartRef.current.y;
      viewportRef.current.offsetX = dragStartRef.current.offsetX + dx;
      viewportRef.current.offsetY = dragStartRef.current.offsetY + dy;
      render();
    }
  }, [dragging, render]);

  const handleMouseUp = useCallback(() => { setDragging(false); }, []);

  const handleWheel = useCallback((e: React.WheelEvent) => {
    e.preventDefault();
    const { cx, cy } = clientToCanvas(e.clientX, e.clientY);
    const vp = viewportRef.current;
    const oldZoom = vp.zoom;
    const factor = e.deltaY > 0 ? 0.9 : 1.1;
    const newZoom = Math.max(0.1, Math.min(10, oldZoom * factor));
    const ratio = newZoom / oldZoom;
    vp.offsetX = cx - (cx - vp.offsetX) * ratio;
    vp.offsetY = cy - (cy - vp.offsetY) * ratio;
    vp.zoom = newZoom;
    render();
  }, [render, clientToCanvas]);

  const handleDeleteMap = useCallback(async (id: number) => {
    await deleteMap(id);
    setMaps((prev) => prev.filter((m) => m.id !== id));
    if (selectedMapId === id) setSelectedMapId(null);
  }, [selectedMapId, setSelectedMapId]);

  const handleEditMap = useCallback(async (id: number) => {
    const data = await fetchMap(id);
    setEditorMap(data.id, data.name, data.width, data.height, data.grid_data);
    setPage('editor');
  }, [setEditorMap, setPage]);

  const handleStart = useCallback(() => {
    if (selectedMapId === null) return;
    // Auto-generate positions if not enough placed
    const positions = [...colonyPositions];
    while (positions.length < colonyCount) {
      const angle = (positions.length / colonyCount) * 2 * Math.PI;
      positions.push({
        x: mapWidth / 2 + Math.cos(angle) * 300,
        y: mapHeight / 2 + Math.sin(angle) * 300,
      });
    }
    startSimulation({
      workerCount,
      soldierCount,
      colonyCount,
      mapId: selectedMapId,
      mapWidth,
      mapHeight,
      colonyPositions: positions.slice(0, colonyCount),
      gridData,
    });
  }, [selectedMapId, colonyPositions, colonyCount, workerCount, soldierCount, mapWidth, mapHeight, gridData, startSimulation]);

  return (
    <div className="relative h-screen w-screen overflow-hidden bg-[#0a0f0a] flex">
      {/* Left panel: map list */}
      <div className="w-72 h-full glass-panel rounded-none border-r border-white/5 flex flex-col">
        <div className="p-4 border-b border-white/5 flex items-center justify-between">
          <h2 className="text-sm font-bold" style={{ color: 'var(--text-primary)' }}>选择地图</h2>
          <button
            onClick={() => setPage('menu')}
            className="text-[#8a9a8a] hover:text-[#e0e8e0] transition-colors"
          >
            <ArrowLeft size={16} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-3 space-y-2">
          {loading && (
            <p className="text-xs text-center" style={{ color: 'var(--text-secondary)' }}>加载中...</p>
          )}
          {!loading && maps.length === 0 && (
            <p className="text-xs text-center" style={{ color: 'var(--text-secondary)' }}>
              暂无地图，请先制作地图
            </p>
          )}
          {maps.map((m) => (
            <div
              key={m.id}
              onClick={() => setSelectedMapId(m.id)}
              className="rounded-lg p-3 cursor-pointer transition-colors"
              style={{
                background: selectedMapId === m.id ? 'rgba(66,153,66,0.15)' : 'rgba(255,255,255,0.03)',
                border: selectedMapId === m.id ? '1px solid rgba(66,153,66,0.3)' : '1px solid transparent',
              }}
            >
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>{m.name}</p>
                  <p className="text-[10px] mt-1" style={{ color: 'var(--text-secondary)' }}>
                    {m.width}×{m.height}
                  </p>
                </div>
                <div className="flex gap-1">
                  <button
                    onClick={(e) => { e.stopPropagation(); handleEditMap(m.id); }}
                    className="text-[#8a9a8a] hover:text-[#429942] transition-colors p-1"
                    title="编辑地图"
                  >
                    <Pencil size={12} />
                  </button>
                  <button
                    onClick={(e) => { e.stopPropagation(); handleDeleteMap(m.id); }}
                    className="text-[#8a9a8a] hover:text-red-400 transition-colors p-1"
                  >
                    <Trash2 size={12} />
                  </button>
                </div>
              </div>
              {m.thumbnail && (
                <img
                  src={m.thumbnail}
                  alt={m.name}
                  className="mt-2 w-full rounded"
                  style={{ imageRendering: 'pixelated' }}
                />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Center: map preview */}
      <div className="flex-1 relative">
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

        {selectedMapId === null && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>请从左侧选择一个地图</p>
          </div>
        )}
      </div>

      {/* Right panel: config */}
      <div className="w-64 h-full glass-panel rounded-none border-l border-white/5 flex flex-col">
        <div className="p-4 border-b border-white/5">
          <h2 className="text-sm font-bold" style={{ color: 'var(--text-primary)' }}>游戏配置</h2>
        </div>

        {selectedMapId !== null ? (
          <div className="flex-1 overflow-y-auto p-4 space-y-5">
            {/* Colony count */}
            <div>
              <label className="text-xs mb-2 block" style={{ color: 'var(--text-secondary)' }}>蚁群数量</label>
              <div className="flex gap-2">
                {[1, 2, 3, 4].map((n) => (
                  <button
                    key={n}
                    onClick={() => {
                      setColonyCount(n);
                      setColonyPositions(colonyPositions.slice(0, n));
                    }}
                    className="flex-1 py-2 rounded-lg text-sm font-medium transition-all"
                    style={{
                      background: colonyCount === n ? 'var(--accent-green)' : 'rgba(255,255,255,0.05)',
                      color: colonyCount === n ? '#000' : 'var(--text-secondary)',
                    }}
                  >
                    {n}
                  </button>
                ))}
              </div>
            </div>

            {/* Worker count */}
            <div>
              <label className="flex items-center justify-between text-xs mb-2">
                <span style={{ color: 'var(--text-secondary)' }}>工蚁数量</span>
                <span className="font-mono" style={{ color: 'var(--text-primary)' }}>{workerCount}</span>
              </label>
              <input
                type="range"
                min={100}
                max={4000}
                step={100}
                value={workerCount}
                onChange={(e) => setWorkerCount(Number(e.target.value))}
                className="w-full custom-range"
              />
            </div>

            {/* Soldier count */}
            <div>
              <label className="flex items-center justify-between text-xs mb-2">
                <span style={{ color: 'var(--text-secondary)' }}>兵蚁数量</span>
                <span className="font-mono" style={{ color: 'var(--text-primary)' }}>{soldierCount}</span>
              </label>
              <input
                type="range"
                min={0}
                max={1000}
                step={50}
                value={soldierCount}
                onChange={(e) => setSoldierCount(Number(e.target.value))}
                className="w-full custom-range"
              />
            </div>

            {/* Colony positions hint */}
            <div className="rounded-lg p-3" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid var(--border-glass)' }}>
              <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>
                点击地图放置蚁巢位置
              </p>
              <p className="text-[10px] mt-1" style={{ color: 'var(--text-secondary)' }}>
                已放置: {colonyPositions.length}/{colonyCount}
                {colonyPositions.length < colonyCount && ' (不足则自动分配)'}
              </p>
            </div>

            <button
              onClick={handleStart}
              className="flex items-center justify-center gap-2 w-full py-3 rounded-lg text-sm font-bold tracking-wider transition-all"
              style={{ background: 'var(--accent-green)', color: '#000' }}
            >
              <Play size={16} />
              开始模拟
            </button>
          </div>
        ) : (
          <div className="flex-1 flex items-center justify-center p-4">
            <p className="text-xs text-center" style={{ color: 'var(--text-secondary)' }}>
              选择地图后可配置蚁群
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
