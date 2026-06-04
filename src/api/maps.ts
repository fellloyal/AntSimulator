export interface MapInfo {
  id: number;
  name: string;
  width: number;
  height: number;
  thumbnail: string | null;
  created_at: string;
  updated_at: string;
}

export interface MapDetail extends MapInfo {
  grid_data: string;
}

export interface GridData {
  cellSize: number;
  walls: number[][];   // [[cx, cy], ...]
  foods: number[][];   // [[cx, cy, qty], ...]
}

const API_BASE = '/api/maps';

export async function fetchMaps(): Promise<MapInfo[]> {
  const res = await fetch(API_BASE);
  return res.json();
}

export async function fetchMap(id: number): Promise<MapDetail> {
  const res = await fetch(`${API_BASE}/${id}`);
  return res.json();
}

export async function createMap(data: { name: string; width: number; height: number }): Promise<{ id: number }> {
  const res = await fetch(API_BASE, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  return res.json();
}

export async function updateMap(id: number, data: { name?: string; grid_data?: string; thumbnail?: string }): Promise<{ ok: boolean }> {
  const res = await fetch(`${API_BASE}/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  return res.json();
}

export async function deleteMap(id: number): Promise<{ ok: boolean }> {
  const res = await fetch(`${API_BASE}/${id}`, { method: 'DELETE' });
  return res.json();
}
