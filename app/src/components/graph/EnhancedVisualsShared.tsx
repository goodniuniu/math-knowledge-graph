import React from 'react';
import { Slider } from '@/components/ui/slider';

// SVG dimensions
export const VW = 400, VH = 280, P = 32;
export const PW = VW - 2 * P, PH = VH - 2 * P;

// Math coords → SVG coords
export const sx = (x: number, xMin: number, xMax: number) => P + ((x - xMin) / (xMax - xMin)) * PW;
export const sy = (y: number, yMin: number, yMax: number) => VH - P - ((y - yMin) / (yMax - yMin)) * PH;

// Generate SVG path from y = f(x)
export function curve(fn: (x: number) => number, xMin: number, xMax: number, yMin: number, yMax: number, n = 150): string {
  let path = ''; let started = false; let prevY: number | null = null;
  for (let i = 0; i <= n; i++) {
    const x = xMin + (i / n) * (xMax - xMin);
    const y = fn(x);
    if (isFinite(y) && y > yMin - 50 && y < yMax + 50) {
      const isJump = prevY !== null && Math.abs(y - prevY) > (yMax - yMin);
      path += `${!started || isJump ? 'M' : 'L'}${sx(x, xMin, xMax).toFixed(1)},${sy(y, yMin, yMax).toFixed(1)}`;
      started = true; prevY = y;
    } else { prevY = null; }
  }
  return path;
}

// Generate SVG path from parametric (x(t), y(t))
export function paramCurve(xFn: (t: number) => number, yFn: (t: number) => number, tMin: number, tMax: number, xMin: number, xMax: number, yMin: number, yMax: number, n = 150): string {
  let path = ''; let started = false;
  for (let i = 0; i <= n; i++) {
    const t = tMin + (i / n) * (tMax - tMin);
    const x = xFn(t), y = yFn(t);
    if (isFinite(x) && isFinite(y) && x >= xMin - 5 && x <= xMax + 5 && y >= yMin - 5 && y <= yMax + 5) {
      path += `${started ? 'L' : 'M'}${sx(x, xMin, xMax).toFixed(1)},${sy(y, yMin, yMax).toFixed(1)}`;
      started = true;
    }
  }
  return path;
}

// Plot frame: grid + axes + tick labels
export function PlotFrame({ xMin, xMax, yMin, yMax, step = 1 }: { xMin: number; xMax: number; yMin: number; yMax: number; step?: number }) {
  const xt: number[] = []; for (let x = Math.ceil(xMin / step) * step; x <= xMax; x += step) xt.push(Math.round(x * 100) / 100);
  const yt: number[] = []; for (let y = Math.ceil(yMin / step) * step; y <= yMax; y += step) yt.push(Math.round(y * 100) / 100);
  return (
    <g>
      {xt.map((x, i) => <line key={`xg${i}`} x1={sx(x, xMin, xMax)} y1={sy(yMin, yMin, yMax)} x2={sx(x, xMin, xMax)} y2={sy(yMax, yMin, yMax)} className="stroke-gray-200 dark:stroke-gray-700" strokeWidth={0.5} />)}
      {yt.map((y, i) => <line key={`yg${i}`} x1={sx(xMin, xMin, xMax)} y1={sy(y, yMin, yMax)} x2={sx(xMax, xMin, xMax)} y2={sy(y, yMin, yMax)} className="stroke-gray-200 dark:stroke-gray-700" strokeWidth={0.5} />)}
      {yMin <= 0 && yMax >= 0 && <line x1={sx(xMin, xMin, xMax)} y1={sy(0, yMin, yMax)} x2={sx(xMax, xMin, xMax)} y2={sy(0, yMin, yMax)} className="stroke-gray-400 dark:stroke-gray-500" strokeWidth={1} />}
      {xMin <= 0 && xMax >= 0 && <line x1={sx(0, xMin, xMax)} y1={sy(yMin, yMin, yMax)} x2={sx(0, xMin, xMax)} y2={sy(yMax, yMin, yMax)} className="stroke-gray-400 dark:stroke-gray-500" strokeWidth={1} />}
      {xt.map((x, i) => <text key={`xt${i}`} x={sx(x, xMin, xMax)} y={sy(yMin, yMin, yMax) + 14} textAnchor="middle" className="fill-gray-500 dark:fill-gray-400" fontSize={9}>{x}</text>)}
      {yt.map((y, i) => <text key={`yt${i}`} x={sx(xMin, xMin, xMax) - 5} y={sy(y, yMin, yMax) + 3} textAnchor="end" className="fill-gray-500 dark:fill-gray-400" fontSize={9}>{y}</text>)}
    </g>
  );
}

// Parameter slider with label and formatted value
export function PSlider({ label, value, min, max, step, onChange, fmt }: { label: string; value: number; min: number; max: number; step: number; onChange: (v: number) => void; fmt?: (v: number) => string }) {
  return (
    <div>
      <div className="flex justify-between text-xs mb-1"><span className="text-gray-600 dark:text-gray-400">{label}</span><span className="font-bold text-gray-800 dark:text-gray-200">{fmt ? fmt(value) : value.toFixed(step < 1 ? 1 : 0)}</span></div>
      <Slider value={[value]} min={min} max={max} step={step} onValueChange={(v) => onChange(v[0])} />
    </div>
  );
}

export const Scenario = ({ children }: { children: React.ReactNode }) => <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">{children}</p>;
export const Insight = ({ children }: { children: React.ReactNode }) => <div className="text-xs p-2.5 rounded-lg bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 text-amber-800 dark:text-amber-300 leading-relaxed">{children}</div>;
