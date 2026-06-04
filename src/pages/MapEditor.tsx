import { useRef, useState, useEffect, useCallback } from 'react';
import { ArrowLeft, Save, Square, Apple, Eraser, Mountain, Layers } from 'lucide-react';
import useStore, { type EditorTool } from '@/store/useStore';
import { createMap, updateMap } from '@/api/maps';
import { AssetRegistry } from '@/render/AssetRegistry';
import { TERRAIN_TILES } from '@/render/assets/TerrainTiles';
import { OBSTACLE_TILES } from '@/render/assets/ObstacleTiles';
import { FOOD_SPRITES, foodSizeFromQty } from '@/render/assets/FoodSprites';

const CELL_SIZE = 4;

// 纹理 key 映射
const TERRAIN_KEY: Record<TerrainType, string> = {
  0: 'terrain_grass',
  1: 'terrain_sand',
  2: 'terrain_water',
  3: 'terrain_rock',
};
const OBSTACLE_KEY: Record<ObstacleType, string> = {
  0: '',
  1: 'obstacle_brick',
  2: 'obstacle_ice',
  3: 'obstacle_wood',
  4: 'obstacle_fence',
};
function foodKey(type: FoodType, size: 'small' | 'medium' | 'large'): string {
  return `food_${type}_${size}`;
}

// UI美化（task 21）：地形/障碍物/食物类型枚举
type TerrainType = 0 | 1 | 2 | 3;  // 0=grass 1=sand 2=water 3=rock
type ObstacleType = 0 | 1 | 2 | 3 | 4;  // 0=none 1=brick 2=ice 3=wood 4=fence
type FoodType = 0 | 1 | 2 | 3;  // 0=chicken 1=apple 2=bread 3=berry

const TERRAIN_COLORS: Record<TerrainType, string> = {
  0: '#4a7a2a',  // grass
  1: '#c8a878',  // sand
  2: '#3a5a8a',  // water
  3: '#6a6a6a',  // rock
};

const OBSTACLE_COLORS: Record<ObstacleType, string> = {
  0: '#4a4a4a',  // placeholder
  1: '#a04030',  // red brick
  2: '#9acfe0',  // ice
  3: '#8a5a30',  // wood
  4: '#7a7a82',  // fence
};

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
  const [terrainType, setTerrainType] = useState<TerrainType>(0);
  const [obstacleType, setObstacleType] = useState<ObstacleType>(1);
  const [foodType, setFoodType] = useState<FoodType>(0);
  const [brushSize, setBrushSize] = useState(3);
  const [mapName, setMapName] = useState(editorMapName || '新地图');
  const [saving, setSaving] = useState(false);
  const [saveMsg, setSaveMsg] = useState('');
  const [drawing, setDrawing] = useState(false);

  // UI美化（task 21）：地形/障碍物并行 Map（cellIdx → type）
  const gridRef = useRef<Uint8Array | null>(null);  // 0=empty 1=wall 2+=food(qty+1)
  const terrainRef = useRef<Map<number, TerrainType>>(new Map());
  const obstacleRef = useRef<Map<number, ObstacleType>>(new Map());
  const foodTypeRef = useRef<Map<number, FoodType>>(new Map());
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
    const newTerrain = new Map<number, TerrainType>();
    const newObstacle = new Map<number, ObstacleType>();
    const newFoodType = new Map<number, FoodType>();

    // Load existing grid data if editing an existing map
    if (editorGridData) {
      try {
        const data = JSON.parse(editorGridData);
        for (const w of data.walls || []) {
          const cx = w[0] as number, cy = w[1] as number;
          if (cx >= 0 && cx < gridW && cy >= 0 && cy < gridH) {
            newGrid[cy * gridW + cx] = 1;
            if (w.length >= 3) newObstacle.set(cy * gridW + cx, w[2] as ObstacleType);
          }
        }
        for (const f of data.foods || []) {
          const cx = f[0] as number, cy = f[1] as number, qty = f[2] as number;
          if (cx >= 0 && cx < gridW && cy >= 0 && cy < gridH) {
            newGrid[cy * gridW + cx] = Math.max(1, qty) + 1;
            if (f.length >= 4) newFoodType.set(cy * gridW + cx, f[3] as FoodType);
          }
        }
        for (const t of data.terrain || []) {
          const cx = t[0] as number, cy = t[1] as number, type = t[2] as TerrainType;
          if (cx >= 0 && cx < gridW && cy >= 0 && cy < gridH) {
            newTerrain.set(cy * gridW + cx, type);
          }
        }
      } catch (e) {
        console.error('Failed to parse editorGridData:', e);
      }
    }
    gridRef.current = newGrid;
    terrainRef.current = newTerrain;
    obstacleRef.current = newObstacle;
    foodTypeRef.current = newFoodType;
    dirtyRef.current = new Set();
  }, [gridW, gridH, editorGridData]);

  // 纹理预加载 + 等首帧完成后再渲染
  const [texturesReady, setTexturesReady] = useState(false);
  useEffect(() => {
    let cancelled = false;
    AssetRegistry.setCellSize(CELL_SIZE);
    for (const t of [0, 1, 2, 3] as TerrainType[]) {
      AssetRegistry.preloadSVG(TERRAIN_TILES[t].svg, TERRAIN_KEY[t]);
    }
    for (const t of [1, 2, 3, 4] as ObstacleType[]) {
      AssetRegistry.preloadSVG(OBSTACLE_TILES[t].svg, OBSTACLE_KEY[t]);
    }
    for (const t of [0, 1, 2, 3] as FoodType[]) {
      for (const size of ['small', 'medium', 'large'] as const) {
        AssetRegistry.preloadSVG(FOOD_SPRITES[t][size], foodKey(t, size));
      }
    }
    AssetRegistry.waitForLoad().then(() => {
      if (!cancelled) setTexturesReady(true);
    });
    return () => { cancelled = true; };
  }, []);

  // Render
  const render = useCallback(() => {
    const canvas = canvasRef.current;
    const grid = gridRef.current;
    const terrain = terrainRef.current;
    const obstacle = obstacleRef.current;
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

    // UI美化（bug fix）：用 SVG 纹理绘制地形（fallback 到纯色）
    for (let y = sy; y <= ey; y++) {
      for (let x = sx; x <= ex; x++) {
        const idx = y * gridW + x;
        const t = terrain.get(idx);
        if (t === undefined) continue;
        const key = TERRAIN_KEY[t];
        if (AssetRegistry.has(key)) {
          AssetRegistry.drawTile(ctx, key, x * CELL_SIZE, y * CELL_SIZE, CELL_SIZE);
        } else {
          ctx.fillStyle = TERRAIN_COLORS[t];
          ctx.fillRect(x * CELL_SIZE, y * CELL_SIZE, CELL_SIZE, CELL_SIZE);
        }
      }
    }

    // 障碍物
    const wallCells: Array<[number, number, ObstacleType]> = [];
    const foodCells: Array<[number, number, number, FoodType]> = [];
    for (let y = sy; y <= ey; y++) {
      for (let x = sx; x <= ex; x++) {
        const idx = y * gridW + x;
        const val = grid[idx];
        if (val === 1) {
          wallCells.push([x, y, obstacle.get(idx) ?? 1]);
        } else if (val >= 2) {
          foodCells.push([x, y, val, foodTypeRef.current.get(idx) ?? 0]);
        }
      }
    }

    // 障碍物用 SVG 纹理绘制
    for (const [x, y, type] of wallCells) {
      const key = OBSTACLE_KEY[type];
      if (key && AssetRegistry.has(key)) {
        AssetRegistry.drawTile(ctx, key, x * CELL_SIZE, y * CELL_SIZE, CELL_SIZE);
      } else {
        ctx.fillStyle = OBSTACLE_COLORS[type] || '#4a4a4a';
        ctx.fillRect(x * CELL_SIZE, y * CELL_SIZE, CELL_SIZE, CELL_SIZE);
      }
    }

    // 食物用 SVG 纹理绘制（按 qty 决定尺寸）
    for (const [x, y, val, type] of foodCells) {
      const qty = val - 1;
      const size = foodSizeFromQty(qty);
      const key = foodKey(type, size);
      if (AssetRegistry.has(key)) {
        AssetRegistry.drawTile(ctx, key, x * CELL_SIZE, y * CELL_SIZE, CELL_SIZE);
      } else {
        const g = Math.min(255, 100 + (type + 1) * 30) | 0;
        ctx.fillStyle = `rgb(0,${g},0)`;
        ctx.fillRect(x * CELL_SIZE, y * CELL_SIZE, CELL_SIZE, CELL_SIZE);
      }
    }

    // UI美化：地图区域明亮边线（双层：内亮外淡）
    ctx.strokeStyle = 'rgba(66, 153, 66, 0.35)';
    ctx.lineWidth = 5;
    ctx.strokeRect(0, 0, editorMapWidth, editorMapHeight);
    ctx.strokeStyle = '#7fe07f';
    ctx.lineWidth = 2;
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
  }, [render, texturesReady]);

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
          obstacleRef.current.set(idx, obstacleType);
          terrainRef.current.delete(idx);
        } else if (tool === 'food') {
          grid[idx] = Math.max(grid[idx], 2);
          foodTypeRef.current.set(idx, foodType);
        } else if (tool === 'erase') {
          grid[idx] = 0;
          terrainRef.current.delete(idx);
          obstacleRef.current.delete(idx);
          foodTypeRef.current.delete(idx);
        } else if (tool === 'terrain') {
          // 地形不写入 grid（grid 仍为空），仅记录到 terrainRef
          terrainRef.current.set(idx, terrainType);
          // 地形为水时自动标记为墙
          if (terrainType === 2) {
            grid[idx] = 1;
          }
        } else if (tool === 'obstacle') {
          grid[idx] = 1;
          obstacleRef.current.set(idx, obstacleType);
        }
        dirtyRef.current.add(idx);
      }
    }
    render();
  }, [tool, brushSize, gridW, gridH, render, terrainType, obstacleType, foodType]);

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
      const terrain: number[][] = [];
      const seen = new Set<number>();
      for (let i = 0; i < grid.length; i++) {
        if (seen.has(i)) continue;
        const val = grid[i];
        const gx = i % gridW;
        const gy = Math.floor(i / gridW);
        // 地形（仅当非空）
        const t = terrainRef.current.get(i);
        if (t !== undefined) terrain.push([gx, gy, t]);
        if (val === 1) {
          const o = obstacleRef.current.get(i) ?? 1;
          walls.push([gx, gy, o]);
        } else if (val >= 2) {
          const f = foodTypeRef.current.get(i) ?? 0;
          foods.push([gx, gy, val - 1, f]);
        }
        seen.add(i);
      }
      const gridData = JSON.stringify({ cellSize: CELL_SIZE, terrain, walls, foods });

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

  // Size presets - 4 档 × 2 比例 + 自定义（比例输入）
  type Ratio = '1:1' | '4:3' | '16:9' | '9:16' | '21:9';
  const RATIOS: { id: Ratio; label: string; w: number; h: number }[] = [
    { id: '1:1', label: '1:1', w: 1, h: 1 },
    { id: '4:3', label: '4:3', w: 4, h: 3 },
    { id: '16:9', label: '16:9', w: 16, h: 9 },
    { id: '9:16', label: '9:16', w: 9, h: 16 },
    { id: '21:9', label: '21:9', w: 21, h: 9 },
  ];
  // 按当前宽高推断比例
  function detectRatio(w: number, h: number): Ratio {
    const r = w / h;
    let best: Ratio = '1:1';
    let bestDiff = Infinity;
    for (const x of RATIOS) {
      const diff = Math.abs(x.w / x.h - r);
      if (diff < bestDiff) { bestDiff = diff; best = x.id; }
    }
    return best;
  }
  const [ratio, setRatio] = useState<Ratio>(detectRatio(editorMapWidth, editorMapHeight));
  const [customW, setCustomW] = useState<number>(editorMapWidth);
  const [customH, setCustomH] = useState<number>(editorMapHeight);
  // 同步 editorMap 变化
  useEffect(() => {
    setRatio(detectRatio(editorMapWidth, editorMapHeight));
    setCustomW(editorMapWidth);
    setCustomH(editorMapHeight);
  }, [editorMapWidth, editorMapHeight]);

  const SIZE_PRESETS: { tier: string; items: { label: string; w: number; h: number }[] }[] = [
    {
      tier: '极小', items: [
        { label: '240×135', w: 240, h: 135 },
        { label: '240×426', w: 240, h: 426 },
      ],
    },
    {
      tier: '小', items: [
        { label: '480×270', w: 480, h: 270 },
        { label: '480×854', w: 480, h: 854 },
      ],
    },
    {
      tier: '中', items: [
        { label: '960×540', w: 960, h: 540 },
        { label: '960×1706', w: 960, h: 1706 },
      ],
    },
    {
      tier: '大', items: [
        { label: '1920×1080', w: 1920, h: 1080 },
        { label: '1920×3408', w: 1920, h: 3408 },
      ],
    },
  ];

  // 按当前比例计算对应高
  function calcHeightByRatio(r: Ratio, w: number): number {
    const found = RATIOS.find((x) => x.id === r)!;
    return Math.round(w * found.h / found.w);
  }
  // 比例变更时同步
  function handleRatioChange(r: Ratio) {
    setRatio(r);
    const newH = calcHeightByRatio(r, customW);
    setCustomH(newH);
  }
  // 宽变更时按比例更新高
  function handleWidthChange(w: number) {
    setCustomW(w);
    setCustomH(calcHeightByRatio(ratio, w));
  }
  // 高变更时按比例更新宽
  function handleHeightChange(h: number) {
    setCustomH(h);
    const found = RATIOS.find((x) => x.id === ratio)!;
    setCustomW(Math.round(h * found.w / found.h));
  }
  // 应用自定义尺寸
  function applyCustomSize() {
    if (customW < 100 || customH < 100) return;
    if (customW > 6000 || customH > 6000) return;
    setEditorMap(null, mapName, customW, customH);
  }

  const tools: { id: EditorTool; icon: React.ReactNode; label: string }[] = [
    { id: 'wall', icon: <Square size={16} />, label: '墙壁(W)' },
    { id: 'obstacle', icon: <Layers size={16} />, label: '障碍(O)' },
    { id: 'food', icon: <Apple size={16} />, label: '食物(F)' },
    { id: 'terrain', icon: <Mountain size={16} />, label: '地形(T)' },
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

        {/* UI美化（task 21）：地形/障碍/食物类型二级选择 */}
        {tool === 'terrain' && (
          <div className="border-t border-white/5 mt-1 pt-2 px-1 flex flex-col gap-1">
            <div className="text-[10px]" style={{ color: 'var(--text-secondary)' }}>地形</div>
            {([[0, '草地', '#4a7a2a'], [1, '沙地', '#c8a878'], [2, '水', '#3a5a8a'], [3, '石头', '#6a6a6a']] as [TerrainType, string, string][]).map(([v, label, color]) => (
              <button
                key={v}
                onClick={() => setTerrainType(v)}
                className="flex items-center gap-1 rounded px-2 py-1 text-[10px] transition-colors"
                style={{
                  background: terrainType === v ? color : 'transparent',
                  color: terrainType === v ? '#fff' : 'var(--text-secondary)',
                }}
              >
                <div className="w-3 h-3 rounded-sm" style={{ background: color }} />
                {label}
              </button>
            ))}
          </div>
        )}

        {tool === 'obstacle' && (
          <div className="border-t border-white/5 mt-1 pt-2 px-1 flex flex-col gap-1">
            <div className="text-[10px]" style={{ color: 'var(--text-secondary)' }}>障碍</div>
            {([1, 2, 3, 4] as ObstacleType[]).map((v) => (
              <button
                key={v}
                onClick={() => setObstacleType(v)}
                className="flex items-center gap-1 rounded px-2 py-1 text-[10px] transition-colors"
                style={{
                  background: obstacleType === v ? OBSTACLE_COLORS[v] : 'transparent',
                  color: obstacleType === v ? '#fff' : 'var(--text-secondary)',
                }}
              >
                <div className="w-3 h-3 rounded-sm" style={{ background: OBSTACLE_COLORS[v] }} />
                {(['红砖', '冰砖', '木板', '铁栅'] as const)[v - 1]}
              </button>
            ))}
          </div>
        )}

        {tool === 'food' && (
          <div className="border-t border-white/5 mt-1 pt-2 px-1 flex flex-col gap-1">
            <div className="text-[10px]" style={{ color: 'var(--text-secondary)' }}>食物</div>
            {([0, 1, 2, 3] as FoodType[]).map((v) => (
              <button
                key={v}
                onClick={() => setFoodType(v)}
                className="flex items-center gap-1 rounded px-2 py-1 text-[10px] transition-colors"
                style={{
                  background: foodType === v ? 'var(--accent-green)' : 'transparent',
                  color: foodType === v ? '#000' : 'var(--text-secondary)',
                }}
              >
                {(['鸡腿', '苹果', '面包', '浆果'] as const)[v]}
              </button>
            ))}
          </div>
        )}

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

      {/* Right: size panel */}
      <div className="absolute right-4 top-20 z-10 glass-panel p-3 w-52 flex flex-col gap-3">
        <div className="text-xs font-semibold" style={{ color: 'var(--text-secondary)' }}>地图尺寸</div>

        {/* 比例选择 */}
        <div className="flex flex-col gap-1">
          <div className="text-[10px]" style={{ color: 'var(--text-secondary)' }}>比例</div>
          <div className="grid grid-cols-5 gap-1">
            {RATIOS.map((r) => (
              <button
                key={r.id}
                onClick={() => handleRatioChange(r.id)}
                className="rounded px-1 py-1 text-[10px] transition-colors"
                style={{
                  background: ratio === r.id ? 'var(--accent-green)' : 'rgba(255,255,255,0.05)',
                  color: ratio === r.id ? '#000' : 'var(--text-secondary)',
                }}
                title={r.id}
              >
                {r.label}
              </button>
            ))}
          </div>
        </div>

        {/* 自定义宽高 */}
        <div className="flex flex-col gap-1">
          <div className="text-[10px]" style={{ color: 'var(--text-secondary)' }}>自定义（按比例）</div>
          <div className="flex items-center gap-1">
            <span className="text-[10px]" style={{ color: 'var(--text-secondary)' }}>宽</span>
            <input
              type="number"
              min={100}
              max={6000}
              value={customW}
              onChange={(e) => handleWidthChange(Math.max(100, Math.min(6000, Number(e.target.value) || 0)))}
              className="flex-1 rounded bg-white/5 px-2 py-1 text-xs text-[#e0e8e0] outline-none border border-white/10 focus:border-[#429942]/50 w-0"
            />
            <span className="text-[10px]" style={{ color: 'var(--text-secondary)' }}>高</span>
            <input
              type="number"
              min={100}
              max={6000}
              value={customH}
              onChange={(e) => handleHeightChange(Math.max(100, Math.min(6000, Number(e.target.value) || 0)))}
              className="flex-1 rounded bg-white/5 px-2 py-1 text-xs text-[#e0e8e0] outline-none border border-white/10 focus:border-[#429942]/50 w-0"
            />
          </div>
          <button
            onClick={applyCustomSize}
            className="rounded-lg py-1 text-xs font-bold transition-colors"
            style={{
              background: 'var(--accent-green)',
              color: '#000',
            }}
          >
            应用尺寸
          </button>
        </div>

        <div className="border-t border-white/5" />

        {/* 预设分组 */}
        <div className="flex flex-col gap-2">
          <div className="text-[10px]" style={{ color: 'var(--text-secondary)' }}>预设（16:9 / 9:16）</div>
          {SIZE_PRESETS.map((g) => (
            <div key={g.tier} className="flex flex-col gap-1">
              <div className="text-[10px] opacity-70" style={{ color: 'var(--text-secondary)' }}>{g.tier}</div>
              <div className="grid grid-cols-2 gap-1">
                {g.items.map((p) => {
                  const active = editorMapWidth === p.w && editorMapHeight === p.h;
                  return (
                    <button
                      key={p.w + 'x' + p.h}
                      onClick={() => setEditorMap(null, mapName, p.w, p.h)}
                      className="rounded px-1 py-1 text-[10px] transition-colors"
                      style={{
                        background: active ? 'var(--accent-green)' : 'rgba(255,255,255,0.05)',
                        color: active ? '#000' : 'var(--text-secondary)',
                      }}
                    >
                      {p.label}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Keyboard shortcuts */}
      <div className="absolute bottom-4 left-4 z-10 text-[10px]" style={{ color: 'var(--text-secondary)' }}>
        Alt+拖拽: 平移 | 滚轮: 缩放 | W: 墙壁 | O: 障碍 | F: 食物 | T: 地形 | E: 擦除
      </div>
    </div>
  );
}
