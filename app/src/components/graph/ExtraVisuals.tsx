import { useRef, useEffect, useState } from 'react';
import { Slider } from '@/components/ui/slider';

const W = 700;
const H = 400;

// ─── 复数平面（节点 29, 30）───
export const ComplexPlane: React.FC<{ mode: 'basic' | 'trig' }> = ({ mode }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [re, setRe] = useState(3);
  const [im, setIm] = useState(2);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const dpr = window.devicePixelRatio || 1;
    canvas.width = W * dpr; canvas.height = H * dpr;
    canvas.style.width = `${W}px`; canvas.style.height = `${H}px`;
    ctx.scale(dpr, dpr);

    ctx.fillStyle = '#fff'; ctx.fillRect(0, 0, W, H);
    const s = 40;
    const cx = W / 2, cy = H / 2;

    // Grid + axes
    ctx.strokeStyle = '#e5e7eb'; ctx.lineWidth = 0.5;
    for (let x = cx % (s * 0.5); x < W; x += s * 0.5) { ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, H); ctx.stroke(); }
    for (let y = cy % (s * 0.5); y < H; y += s * 0.5) { ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(W, y); ctx.stroke(); }
    ctx.strokeStyle = '#374151'; ctx.lineWidth = 1.5;
    ctx.beginPath(); ctx.moveTo(0, cy); ctx.lineTo(W, cy); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(cx, 0); ctx.lineTo(cx, H); ctx.stroke();
    ctx.fillStyle = '#6b7280'; ctx.font = '12px sans-serif';
    ctx.fillText('Re', W - 20, cy - 8);
    ctx.fillText('Im', cx + 8, 14);

    const px = cx + re * s;
    const py = cy - im * s;
    const mod = Math.sqrt(re * re + im * im);
    const arg = Math.atan2(im, re);

    // Modulus line
    ctx.strokeStyle = '#3b82f6'; ctx.lineWidth = 2.5;
    ctx.beginPath(); ctx.moveTo(cx, cy); ctx.lineTo(px, py); ctx.stroke();
    // Arrowhead
    const ang = Math.atan2(-im, re);
    ctx.fillStyle = '#3b82f6';
    ctx.beginPath(); ctx.moveTo(px, py);
    ctx.lineTo(px - 12 * Math.cos(ang - 0.4), py - 12 * Math.sin(ang - 0.4));
    ctx.lineTo(px - 12 * Math.cos(ang + 0.4), py - 12 * Math.sin(ang + 0.4)); ctx.fill();

    // Point
    ctx.beginPath(); ctx.arc(px, py, 5, 0, Math.PI * 2); ctx.fill();

    // Projection lines
    ctx.strokeStyle = '#9ca3af'; ctx.lineWidth = 1; ctx.setLineDash([4, 4]);
    ctx.beginPath(); ctx.moveTo(px, py); ctx.lineTo(px, cy); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(px, py); ctx.lineTo(cx, py); ctx.stroke();
    ctx.setLineDash([]);

    if (mode === 'trig') {
      // Argument arc
      ctx.strokeStyle = '#f59e0b'; ctx.lineWidth = 2;
      ctx.beginPath(); ctx.arc(cx, cy, 28, 0, -arg); ctx.stroke();
      ctx.fillStyle = '#f59e0b'; ctx.font = '12px sans-serif';
      ctx.fillText(`θ = ${(arg * 180 / Math.PI).toFixed(1)}°`, cx + 35, cy - 10);

      // Unit circle reference
      ctx.strokeStyle = '#e5e7eb'; ctx.lineWidth = 1;
      ctx.beginPath(); ctx.arc(cx, cy, s, 0, Math.PI * 2); ctx.stroke();
    }

    // Info
    ctx.font = 'bold 13px sans-serif';
    ctx.fillStyle = '#3b82f6';
    ctx.fillText(`z = ${re} + ${im}i`, 15, 25);
    ctx.fillStyle = '#10b981';
    ctx.fillText(`|z| = √(${re}²+${im}²) = ${mod.toFixed(3)}`, 15, 45);
    if (mode === 'trig') {
      ctx.fillStyle = '#f59e0b';
      ctx.fillText(`z = ${mod.toFixed(2)}(cos ${(arg * 180 / Math.PI).toFixed(1)}° + i·sin ${(arg * 180 / Math.PI).toFixed(1)}°)`, 15, 65);
    }
    ctx.fillStyle = '#8b5cf6';
    ctx.fillText(`z² = ${(re * re - im * im)} + ${2 * re * im}i`, 15, mode === 'trig' ? 85 : 65);
  }, [re, im, mode]);

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm">
      <div className="flex justify-center">
        <canvas ref={canvasRef} style={{ borderRadius: '8px', border: '1px solid #e5e7eb' }} />
      </div>
      <div className="mt-4 max-w-md mx-auto grid grid-cols-2 gap-4">
        <div className="space-y-1">
          <label className="text-xs font-medium text-blue-700">实部 Re = {re.toFixed(1)}</label>
          <Slider value={[re]} min={-5} max={5} step={0.5} onValueChange={(v) => setRe(v[0])} />
        </div>
        <div className="space-y-1">
          <label className="text-xs font-medium text-green-700">虚部 Im = {im.toFixed(1)}</label>
          <Slider value={[im]} min={-5} max={5} step={0.5} onValueChange={(v) => setIm(v[0])} />
        </div>
      </div>
    </div>
  );
};

// ─── 立体几何（节点 31, 32, 33）───
export const Geometry3D: React.FC<{ mode: 'position' | 'parallel' | 'perpendicular' }> = ({ mode }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const dpr = window.devicePixelRatio || 1;
    canvas.width = W * dpr; canvas.height = H * dpr;
    canvas.style.width = `${W}px`; canvas.style.height = `${H}px`;
    ctx.scale(dpr, dpr);
    ctx.fillStyle = '#fff'; ctx.fillRect(0, 0, W, H);

    // Draw a 3D cube in isometric view
    const cx = 350, cy = 200;
    const sz = 80;
    // Cube vertices (isometric projection)
    const dx = sz * 0.866, dy = sz * 0.5;

    const v = [
      { x: cx - sz, y: cy + sz },     // 0: front-bottom-left
      { x: cx + sz, y: cy + sz },     // 1: front-bottom-right
      { x: cx + sz, y: cy - sz },     // 2: front-top-right
      { x: cx - sz, y: cy - sz },     // 3: front-top-left
      { x: cx - sz + dx, y: cy + sz - dy }, // 4: back-bottom-left
      { x: cx + sz + dx, y: cy + sz - dy }, // 5: back-bottom-right
      { x: cx + sz + dx, y: cy - sz - dy }, // 6: back-top-right
      { x: cx - sz + dx, y: cy - sz - dy }, // 7: back-top-left
    ];

    const drawFace = (a: number, b: number, c: number, d: number, fill: string, stroke: string) => {
      ctx.fillStyle = fill; ctx.strokeStyle = stroke; ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(v[a].x, v[a].y); ctx.lineTo(v[b].x, v[b].y);
      ctx.lineTo(v[c].x, v[c].y); ctx.lineTo(v[d].x, v[d].y);
      ctx.closePath(); ctx.fill(); ctx.stroke();
    };

    if (mode === 'position') {
      // Show all faces semi-transparent
      drawFace(4, 5, 6, 7, 'rgba(16,185,129,0.1)', '#10b981'); // top
      drawFace(0, 4, 7, 3, 'rgba(59,130,246,0.1)', '#3b82f6'); // left
      drawFace(1, 5, 6, 2, 'rgba(245,158,11,0.1)', '#f59e0b'); // right
      drawFace(0, 1, 2, 3, 'rgba(139,92,246,0.08)', '#8b5cf6'); // front

      ctx.font = 'bold 14px sans-serif';
      ctx.fillStyle = '#374151';
      ctx.fillText('点、直线、平面的位置关系', 15, 25);
      ctx.font = '12px sans-serif'; ctx.fillStyle = '#6b7280';
      ctx.fillText('• 面 ABCD 与面 EFGH 平行', 15, 45);
      ctx.fillText('• 棱 AB ⊥ 面 BCGF', 15, 63);
      ctx.fillText('• 直线 AC 与 BD 相交', 15, 81);
      ctx.fillText('• 异面直线 AB 与 FG', 15, 99);

      // Vertex labels
      ctx.font = 'bold 11px sans-serif';
      ctx.fillStyle = '#374151';
      [['A',0],['B',1],['C',2],['D',3],['E',7],['F',4],['G',5],['H',6]].forEach(([l, i]) => {
        ctx.fillText(l as string, v[i as number].x - 4, v[i as number].y + 14);
      });

    } else if (mode === 'parallel') {
      // Highlight parallel edges
      drawFace(4, 5, 6, 7, 'rgba(16,185,129,0.1)', '#d1d5db');
      drawFace(0, 4, 7, 3, 'rgba(59,130,246,0.08)', '#d1d5db');
      drawFace(1, 5, 6, 2, 'rgba(245,158,11,0.08)', '#d1d5db');

      // Parallel lines highlighted
      const drawLine = (a: number, b: number, color: string, w: number = 3) => {
        ctx.strokeStyle = color; ctx.lineWidth = w;
        ctx.beginPath(); ctx.moveTo(v[a].x, v[a].y); ctx.lineTo(v[b].x, v[b].y); ctx.stroke();
      };
      drawLine(0, 1, '#ef4444'); // AB
      drawLine(4, 5, '#ef4444'); // FG parallel to AB
      drawLine(3, 2, '#ef4444'); // DC parallel to AB
      drawLine(2, 6, '#10b981'); // CH
      drawLine(3, 7, '#10b981'); // DE parallel to CH

      ctx.font = 'bold 14px sans-serif';
      ctx.fillStyle = '#374151';
      ctx.fillText('直线与平面的平行关系', 15, 25);
      ctx.font = '12px sans-serif';
      ctx.fillStyle = '#ef4444'; ctx.fillText('红线互相平行：AB ∥ FG ∥ DC', 15, 45);
      ctx.fillStyle = '#10b981'; ctx.fillText('绿线互相平行：CH ∥ DE', 15, 63);

    } else if (mode === 'perpendicular') {
      drawFace(4, 5, 6, 7, 'rgba(16,185,129,0.1)', '#d1d5db');
      drawFace(0, 4, 7, 3, 'rgba(59,130,246,0.08)', '#d1d5db');
      drawFace(1, 5, 6, 2, 'rgba(245,158,11,0.08)', '#d1d5db');

      const drawLine = (a: number, b: number, color: string, w: number = 3) => {
        ctx.strokeStyle = color; ctx.lineWidth = w;
        ctx.beginPath(); ctx.moveTo(v[a].x, v[a].y); ctx.lineTo(v[b].x, v[b].y); ctx.stroke();
      };

      // Highlight perpendicular line to face
      drawLine(0, 3, '#ef4444'); // AD perpendicular to bottom
      drawLine(1, 2, '#ef4444'); // BC
      drawLine(4, 7, '#ef4444'); // FG
      drawLine(5, 6, '#ef4444'); // EH

      // Bottom face highlighted
      ctx.strokeStyle = '#3b82f6'; ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(v[0].x, v[0].y); ctx.lineTo(v[1].x, v[1].y);
      ctx.lineTo(v[5].x, v[5].y); ctx.lineTo(v[4].x, v[4].y);
      ctx.closePath(); ctx.stroke();

      // Right angle symbol
      ctx.strokeStyle = '#374151'; ctx.lineWidth = 1.5;
      const sx = v[0].x + 15, sy = v[0].y - 15;
      ctx.beginPath(); ctx.moveTo(v[0].x, v[0].y); ctx.lineTo(sx, v[0].y); ctx.lineTo(sx, sy); ctx.stroke();

      ctx.font = 'bold 14px sans-serif';
      ctx.fillStyle = '#374151';
      ctx.fillText('直线与平面的垂直关系', 15, 25);
      ctx.font = '12px sans-serif';
      ctx.fillStyle = '#ef4444'; ctx.fillText('红线（棱 AD, BC, FG, EH）⊥ 底面 ABGE', 15, 45);
      ctx.fillStyle = '#3b82f6'; ctx.fillText('蓝框为底面', 15, 63);
    }
  }, [mode]);

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm">
      <div className="flex justify-center">
        <canvas ref={canvasRef} style={{ borderRadius: '8px', border: '1px solid #e5e7eb' }} />
      </div>
    </div>
  );
};

// ─── 统计可视化（节点 34, 55, 56, 57）───
export const StatsVisual: React.FC<{ mode: 'histogram' | 'scatter' | 'regression' | 'contingency' }> = ({ mode }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [correlation, setCorrelation] = useState(0.7);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const dpr = window.devicePixelRatio || 1;
    canvas.width = W * dpr; canvas.height = H * dpr;
    canvas.style.width = `${W}px`; canvas.style.height = `${H}px`;
    ctx.scale(dpr, dpr);
    ctx.fillStyle = '#fff'; ctx.fillRect(0, 0, W, H);

    const padding = { top: 40, right: 20, bottom: 45, left: 50 };
    const plotW = W - padding.left - padding.right;
    const plotH = H - padding.top - padding.bottom;

    // Grid
    ctx.strokeStyle = '#e5e7eb'; ctx.lineWidth = 0.5;
    for (let i = 0; i <= 10; i++) {
      const x = padding.left + (plotW / 10) * i;
      ctx.beginPath(); ctx.moveTo(x, padding.top); ctx.lineTo(x, padding.top + plotH); ctx.stroke();
    }
    for (let i = 0; i <= 8; i++) {
      const y = padding.top + (plotH / 8) * i;
      ctx.beginPath(); ctx.moveTo(padding.left, y); ctx.lineTo(padding.left + plotW, y); ctx.stroke();
    }

    if (mode === 'histogram') {
      // Frequency histogram
      const data = [2, 5, 12, 18, 22, 19, 14, 8, 4, 2];
      const maxVal = Math.max(...data);
      const barW = plotW / data.length;
      data.forEach((val, i) => {
        const bh = (val / maxVal) * plotH * 0.85;
        const bx = padding.left + i * barW;
        const by = padding.top + plotH - bh;
        ctx.fillStyle = `rgba(59,130,246,${0.3 + val / maxVal * 0.5})`;
        ctx.fillRect(bx + 2, by, barW - 4, bh);
        ctx.strokeStyle = '#3b82f6'; ctx.lineWidth = 1;
        ctx.strokeRect(bx + 2, by, barW - 4, bh);
        ctx.font = '10px sans-serif'; ctx.fillStyle = '#374151';
        ctx.fillText(String(val), bx + barW / 2 - 4, by - 4);
      });
      // Labels
      ctx.font = '12px sans-serif'; ctx.fillStyle = '#6b7280';
      for (let i = 0; i < 10; i++) ctx.fillText(`${i * 10}`, padding.left + i * barW + barW / 2 - 6, padding.top + plotH + 18);
      ctx.fillText('样本数据', W / 2 - 25, H - 8);
      ctx.save(); ctx.translate(15, H / 2); ctx.rotate(-Math.PI / 2);
      ctx.fillText('频数', -15, 0); ctx.restore();
      ctx.font = 'bold 14px sans-serif'; ctx.fillStyle = '#374151';
      ctx.fillText('频率分布直方图', 15, 25);

    } else if (mode === 'scatter' || mode === 'regression') {
      // Generate correlated random-looking data
      const n = 30;
      const points: { x: number; y: number }[] = [];
      // Deterministic pseudo-random for reproducibility
      let seed = 42;
      const rand = () => { seed = (seed * 1103515245 + 12345) & 0x7fffffff; return seed / 0x7fffffff; };
      for (let i = 0; i < n; i++) {
        const x = rand() * 8 + 1;
        const y = correlation * x + (1 - Math.abs(correlation)) * 4 * (rand() - 0.5) + 1;
        points.push({ x, y: Math.max(0, y) });
      }

      const xMin = 0, xMax = 10, yMin = 0, yMax = 10;
      const toPx = (x: number) => padding.left + ((x - xMin) / (xMax - xMin)) * plotW;
      const toPy = (y: number) => padding.top + plotH - ((y - yMin) / (yMax - yMin)) * plotH;

      // Axes
      ctx.strokeStyle = '#374151'; ctx.lineWidth = 1.5;
      ctx.beginPath(); ctx.moveTo(padding.left, padding.top + plotH); ctx.lineTo(padding.left + plotW, padding.top + plotH); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(padding.left, padding.top); ctx.lineTo(padding.left, padding.top + plotH); ctx.stroke();

      // Scatter points
      points.forEach(p => {
        ctx.fillStyle = mode === 'regression' ? 'rgba(59,130,246,0.6)' : 'rgba(59,130,246,0.5)';
        ctx.beginPath(); ctx.arc(toPx(p.x), toPy(p.y), 5, 0, Math.PI * 2); ctx.fill();
      });

      if (mode === 'regression') {
        // Compute regression line
        const xMean = points.reduce((s, p) => s + p.x, 0) / n;
        const yMean = points.reduce((s, p) => s + p.y, 0) / n;
        let num = 0, den = 0;
        points.forEach(p => { num += (p.x - xMean) * (p.y - yMean); den += (p.x - xMean) ** 2; });
        const slope = num / den;
        const intercept = yMean - slope * xMean;

        // Draw line
        ctx.strokeStyle = '#ef4444'; ctx.lineWidth = 2.5;
        ctx.beginPath();
        ctx.moveTo(toPx(0), toPy(intercept));
        ctx.lineTo(toPx(10), toPy(slope * 10 + intercept));
        ctx.stroke();

        // Residuals
        ctx.strokeStyle = '#fca5a5'; ctx.lineWidth = 1;
        points.forEach(p => {
          const yFit = slope * p.x + intercept;
          ctx.beginPath(); ctx.moveTo(toPx(p.x), toPy(p.y)); ctx.lineTo(toPx(p.x), toPy(yFit)); ctx.stroke();
        });

        ctx.font = 'bold 13px sans-serif'; ctx.fillStyle = '#374151';
        ctx.fillText('一元线性回归', 15, 25);
        ctx.font = '12px sans-serif'; ctx.fillStyle = '#ef4444';
        ctx.fillText(`ŷ = ${slope.toFixed(2)}x + ${intercept.toFixed(2)}`, 15, 45);
        ctx.fillStyle = '#6b7280';
        const r = correlation;
        ctx.fillText(`相关系数 r ≈ ${r.toFixed(2)}  ${Math.abs(r) > 0.7 ? '（强相关）' : Math.abs(r) > 0.4 ? '（中等相关）' : '（弱相关）'}`, 15, 63);
      } else {
        ctx.font = 'bold 13px sans-serif'; ctx.fillStyle = '#374151';
        ctx.fillText('散点图与相关性', 15, 25);
        ctx.font = '12px sans-serif'; ctx.fillStyle = '#6b7280';
        const r = correlation;
        ctx.fillText(`r = ${r.toFixed(2)}`, 15, 45);
        ctx.fillText(r > 0.5 ? '正相关：x 增大时 y 也增大' : r < -0.5 ? '负相关' : '弱相关', 15, 63);
      }
      ctx.font = '11px sans-serif'; ctx.fillStyle = '#6b7280';
      ctx.fillText('x', padding.left + plotW - 5, padding.top + plotH + 18);
      ctx.fillText('y', padding.left - 15, padding.top + 10);

    } else if (mode === 'contingency') {
      // 2×2 contingency table visualization
      const a = 40, b = 10, c = 15, d = 35;
      const total = a + b + c + d;
      const chi2 = total * (a * d - b * c) ** 2 / ((a + b) * (c + d) * (a + c) * (b + d));

      // Draw table
      const tx = 150, ty = 80, cw = 100, ch = 60;
      ctx.strokeStyle = '#374151'; ctx.lineWidth = 2;
      ctx.strokeRect(tx, ty, cw * 2, ch * 2);
      ctx.beginPath();
      ctx.moveTo(tx, ty + ch); ctx.lineTo(tx + cw * 2, ty + ch);
      ctx.moveTo(tx + cw, ty); ctx.lineTo(tx + cw, ty + ch * 2);
      ctx.stroke();

      ctx.font = 'bold 16px sans-serif';
      ctx.fillStyle = '#3b82f6'; ctx.fillText(String(a), tx + 35, ty + 38);
      ctx.fillStyle = '#10b981'; ctx.fillText(String(b), tx + cw + 35, ty + 38);
      ctx.fillStyle = '#f59e0b'; ctx.fillText(String(c), tx + 35, ty + ch + 38);
      ctx.fillStyle = '#ef4444'; ctx.fillText(String(d), tx + cw + 35, ty + ch + 38);

      // Headers
      ctx.font = 'bold 12px sans-serif'; ctx.fillStyle = '#6b7280';
      ctx.fillText('Y=0', tx + 35, ty - 8);
      ctx.fillText('Y=1', tx + cw + 35, ty - 8);
      ctx.fillText('X=0', tx - 35, ty + 38);
      ctx.fillText('X=1', tx - 35, ty + ch + 38);

      // Bar chart on right
      const bx = 420, bw = 80;
      const drawBar = (val: number, color: string, label: string, yy: number) => {
        const bh = val * 3;
        ctx.fillStyle = color;
        ctx.fillRect(bx, yy - bh, bw, bh);
        ctx.strokeStyle = color; ctx.lineWidth = 1;
        ctx.strokeRect(bx, yy - bh, bw, bh);
        ctx.font = '11px sans-serif'; ctx.fillStyle = '#374151';
        ctx.fillText(`${label}: ${val}`, bx, yy + 14);
      };
      drawBar(a, '#3b82f6', 'X=0,Y=0', ty + 50);
      drawBar(b, '#10b981', 'X=0,Y=1', ty + 110);
      drawBar(c, '#f59e0b', 'X=1,Y=0', ty + 170);
      drawBar(d, '#ef4444', 'X=1,Y=1', ty + 230);

      ctx.font = 'bold 14px sans-serif'; ctx.fillStyle = '#374151';
      ctx.fillText('2×2 列联表与独立性检验', 15, 25);
      ctx.font = '13px sans-serif'; ctx.fillStyle = '#8b5cf6';
      ctx.fillText(`χ² = ${chi2.toFixed(2)}`, 15, 48);
      ctx.font = '12px sans-serif';
      ctx.fillStyle = chi2 > 6.635 ? '#ef4444' : chi2 > 3.841 ? '#f59e0b' : '#10b981';
      ctx.fillText(
        chi2 > 6.635 ? 'χ² > 6.635：99%把握认为不独立' :
        chi2 > 3.841 ? 'χ² > 3.841：95%把握认为不独立' :
        '无足够证据认为不独立',
        15, 65
      );
    }
  }, [mode, correlation]);

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm">
      <div className="flex justify-center">
        <canvas ref={canvasRef} style={{ borderRadius: '8px', border: '1px solid #e5e7eb' }} />
      </div>
      {(mode === 'scatter' || mode === 'regression') && (
        <div className="mt-4 max-w-md mx-auto space-y-1">
          <label className="text-xs font-medium text-gray-700">相关强度 r = {correlation.toFixed(2)}</label>
          <Slider value={[correlation * 100]} min={-95} max={95} step={5} onValueChange={(v) => setCorrelation(v[0] / 100)} />
        </div>
      )}
    </div>
  );
};

// ─── 坐标几何（节点 40, 41, 18）───
export const CoordinateGraph: React.FC<{ mode: 'line' | 'circle' | 'angle' }> = ({ mode }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [param1, setParam1] = useState(1);
  const [param2, setParam2] = useState(2);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const dpr = window.devicePixelRatio || 1;
    canvas.width = W * dpr; canvas.height = H * dpr;
    canvas.style.width = `${W}px`; canvas.style.height = `${H}px`;
    ctx.scale(dpr, dpr);
    ctx.fillStyle = '#fff'; ctx.fillRect(0, 0, W, H);
    const s = 35;
    const cx = W / 2, cy = H / 2;

    // Grid + axes
    ctx.strokeStyle = '#e5e7eb'; ctx.lineWidth = 0.5;
    for (let x = cx % (s * 0.5); x < W; x += s * 0.5) { ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, H); ctx.stroke(); }
    for (let y = cy % (s * 0.5); y < H; y += s * 0.5) { ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(W, y); ctx.stroke(); }
    ctx.strokeStyle = '#374151'; ctx.lineWidth = 1.5;
    ctx.beginPath(); ctx.moveTo(0, cy); ctx.lineTo(W, cy); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(cx, 0); ctx.lineTo(cx, H); ctx.stroke();
    ctx.fillStyle = '#6b7280'; ctx.font = '11px sans-serif';
    ctx.fillText('x', W - 12, cy - 8); ctx.fillText('y', cx + 8, 12);
    // Tick marks
    for (let i = -5; i <= 5; i++) {
      if (i === 0) continue;
      ctx.fillText(String(i), cx + i * s - 4, cy + 14);
      ctx.fillText(String(i), cx + 6, cy - i * s + 4);
    }

    if (mode === 'line') {
      // Two lines: y = param1*x and y = param2*x - 3
      const k1 = param1, k2 = param2;
      ctx.strokeStyle = '#3b82f6'; ctx.lineWidth = 2.5;
      ctx.beginPath(); ctx.moveTo(0, cy + 3 * s); ctx.lineTo(W, cy - (W / 2 / s - 3) * k1 * s + 3 * s); ctx.stroke();
      // Simpler: just draw y = k1*x
      ctx.beginPath();
      for (let px = 0; px < W; px++) {
        const x = (px - cx) / s;
        const y = k1 * x;
        const py = cy - y * s;
        if (px === 0) ctx.moveTo(px, py); else ctx.lineTo(px, py);
      }
      ctx.stroke();

      ctx.strokeStyle = '#10b981'; ctx.lineWidth = 2;
      ctx.beginPath();
      for (let px = 0; px < W; px++) {
        const x = (px - cx) / s;
        const y = k2 * x - 1;
        const py = cy - y * s;
        if (px === 0) ctx.moveTo(px, py); else ctx.lineTo(px, py);
      }
      ctx.stroke();

      ctx.font = 'bold 13px sans-serif';
      ctx.fillStyle = '#3b82f6'; ctx.fillText(`l₁: y = ${k1.toFixed(1)}x`, 15, 25);
      ctx.fillStyle = '#10b981'; ctx.fillText(`l₂: y = ${k2.toFixed(1)}x - 1`, 15, 45);
      const intersect = k1 === k2 ? null : { x: 1 / (k1 - k2), y: k1 / (k1 - k2) };
      if (intersect && Math.abs(intersect.x) < 6) {
        ctx.fillStyle = '#ef4444';
        ctx.beginPath(); ctx.arc(cx + intersect.x * s, cy - intersect.y * s, 5, 0, Math.PI * 2); ctx.fill();
        ctx.fillStyle = '#374151'; ctx.font = '12px sans-serif';
        ctx.fillText(`交点 (${intersect.x.toFixed(1)}, ${intersect.y.toFixed(1)})`, 15, 65);
      }
    } else if (mode === 'circle') {
      const r = Math.max(0.5, param1);
      ctx.strokeStyle = '#3b82f6'; ctx.lineWidth = 2.5;
      ctx.beginPath(); ctx.arc(cx, cy, r * s, 0, Math.PI * 2); ctx.stroke();
      ctx.fillStyle = 'rgba(59,130,246,0.08)'; ctx.fill();

      // Center
      ctx.fillStyle = '#ef4444';
      ctx.beginPath(); ctx.arc(cx, cy, 4, 0, Math.PI * 2); ctx.fill();
      // Radius line
      ctx.strokeStyle = '#f59e0b'; ctx.lineWidth = 2;
      ctx.beginPath(); ctx.moveTo(cx, cy); ctx.lineTo(cx + r * s, cy); ctx.stroke();
      ctx.font = '12px sans-serif'; ctx.fillStyle = '#f59e0b';
      ctx.fillText(`r = ${r.toFixed(1)}`, cx + r * s / 2 - 10, cy - 6);

      ctx.font = 'bold 13px sans-serif'; ctx.fillStyle = '#3b82f6';
      ctx.fillText(`x² + y² = ${(r * r).toFixed(1)}`, 15, 25);
      ctx.fillStyle = '#6b7280'; ctx.font = '12px sans-serif';
      ctx.fillText(`面积 S = πr² = ${(Math.PI * r * r).toFixed(2)}`, 15, 45);
      ctx.fillText(`周长 C = 2πr = ${(2 * Math.PI * r).toFixed(2)}`, 15, 65);

    } else if (mode === 'angle') {
      const angle = param1 * Math.PI / 3;
      const r = 100;

      // Unit circle
      ctx.strokeStyle = '#d1d5db'; ctx.lineWidth = 1;
      ctx.beginPath(); ctx.arc(cx, cy, r, 0, Math.PI * 2); ctx.stroke();

      // Angle arc
      ctx.strokeStyle = '#3b82f6'; ctx.lineWidth = 2.5;
      ctx.beginPath(); ctx.arc(cx, cy, r, 0, -angle); ctx.stroke();

      // Terminal ray
      ctx.beginPath(); ctx.moveTo(cx, cy); ctx.lineTo(cx + r * 1.2 * Math.cos(angle), cy - r * 1.2 * Math.sin(angle)); ctx.stroke();

      // Angle marker
      ctx.strokeStyle = '#f59e0b'; ctx.lineWidth = 2;
      ctx.beginPath(); ctx.arc(cx, cy, 30, 0, -angle); ctx.stroke();

      // Point on circle
      const px = cx + r * Math.cos(angle), py = cy - r * Math.sin(angle);
      ctx.fillStyle = '#ef4444';
      ctx.beginPath(); ctx.arc(px, py, 5, 0, Math.PI * 2); ctx.fill();

      // sin/cos projections
      ctx.strokeStyle = '#ef4444'; ctx.lineWidth = 1.5; ctx.setLineDash([4, 4]);
      ctx.beginPath(); ctx.moveTo(px, py); ctx.lineTo(px, cy); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(px, py); ctx.lineTo(cx, py); ctx.stroke();
      ctx.setLineDash([]);

      ctx.font = 'bold 13px sans-serif';
      ctx.fillStyle = '#374151';
      const deg = (angle * 180 / Math.PI).toFixed(0);
      const rad = angle.toFixed(2);
      ctx.fillText(`α = ${deg}° = ${rad} rad`, 15, 25);
      ctx.fillStyle = '#3b82f6'; ctx.fillText(`cos α = ${Math.cos(angle).toFixed(3)}`, 15, 45);
      ctx.fillStyle = '#ef4444'; ctx.fillText(`sin α = ${Math.sin(angle).toFixed(3)}`, 15, 65);
      // Arc length
      ctx.fillStyle = '#10b981'; ctx.fillText(`弧长 l = r·|α| = ${r.toFixed(0)}×${rad} = ${(r * angle).toFixed(1)}`, 15, 85);
      ctx.fillStyle = '#8b5cf6'; ctx.fillText(`扇形面积 S = ½r²·|α| = ${(0.5 * r * r * angle).toFixed(0)}`, 15, 105);
    }
  }, [mode, param1, param2]);

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm">
      <div className="flex justify-center">
        <canvas ref={canvasRef} style={{ borderRadius: '8px', border: '1px solid #e5e7eb' }} />
      </div>
      <div className="mt-4 max-w-md mx-auto space-y-1">
        <label className="text-xs font-medium text-gray-700">
          {mode === 'line' ? `直线 l₁ 斜率 = ${param1.toFixed(1)}` : mode === 'circle' ? `半径 r = ${param1.toFixed(1)}` : `角度 = ${param1.toFixed(1)} × 60°`}
        </label>
        <Slider value={[param1]} min={mode === 'circle' ? 1 : mode === 'angle' ? 0 : -3} max={mode === 'angle' ? 6 : 3} step={0.5} onValueChange={(v) => setParam1(v[0])} />
        {mode === 'line' && (
          <>
            <label className="text-xs font-medium text-gray-700 mt-2 block">直线 l₂ 斜率 = {param2.toFixed(1)}</label>
            <Slider value={[param2]} min={-3} max={3} step={0.5} onValueChange={(v) => setParam2(v[0])} />
          </>
        )}
      </div>
    </div>
  );
};

// ─── 帕斯卡三角 / 排列组合（节点 49, 50）───
export const PascalTriangle: React.FC<{ mode: 'pascal' | 'combination' }> = ({ mode }) => {
  const [rows, setRows] = useState(7);
  const [highlightRow, setHighlightRow] = useState(-1);

  // Build Pascal's triangle
  const triangle: number[][] = [];
  for (let i = 0; i < rows; i++) {
    const row: number[] = [];
    for (let j = 0; j <= i; j++) {
      row.push(j === 0 || j === i ? 1 : triangle[i - 1][j - 1] + triangle[i - 1][j]);
    }
    triangle.push(row);
  }

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm">
      <h3 className="font-semibold text-gray-800 mb-3">
        {mode === 'pascal' ? '杨辉三角（二项式系数）' : '组合数 C(n, k)'}
      </h3>
      <div className="flex justify-center py-2 overflow-x-auto">
        <div style={{ minWidth: '600px' }}>
          {triangle.map((row, i) => (
            <div
              key={i}
              className="flex justify-center gap-1 mb-1"
              onMouseEnter={() => setHighlightRow(i)}
              onMouseLeave={() => setHighlightRow(-1)}
            >
              {row.map((val, j) => {
                const isHighlighted = highlightRow === i;
                const isEdge = j === 0 || j === i;
                return (
                  <div
                    key={j}
                    className={`w-12 h-12 flex items-center justify-center rounded-lg text-xs font-bold transition-all cursor-pointer ${
                      isHighlighted ? 'scale-110 shadow-md' : ''
                    } ${
                      isEdge
                        ? 'bg-blue-100 text-blue-700'
                        : val % 2 === 0
                        ? 'bg-green-50 text-green-700'
                        : 'bg-amber-50 text-amber-700'
                    }`}
                    style={{
                      backgroundColor: isHighlighted ? '#3b82f6' : undefined,
                      color: isHighlighted ? '#fff' : undefined,
                    }}
                    title={`C(${i},${j}) = ${val}`}
                  >
                    {val}
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      </div>
      <div className="mt-3 max-w-md mx-auto space-y-1">
        <label className="text-xs font-medium text-gray-700">行数 n = {rows}</label>
        <Slider value={[rows]} min={3} max={10} step={1} onValueChange={(v) => setRows(v[0])} />
      </div>
      {mode === 'pascal' && highlightRow >= 0 && (
        <div className="mt-3 text-center text-sm text-gray-600">
          第 {highlightRow} 行系数和 = 2<sup>{highlightRow}</sup> = {Math.pow(2, highlightRow)}
          {highlightRow > 0 && (
            <span className="ml-4 text-gray-400">
              奇数项和 = 偶数项和 = 2<sup>{highlightRow - 1}</sup> = {Math.pow(2, highlightRow - 1)}
            </span>
          )}
        </div>
      )}
    </div>
  );
};

// ─── 逻辑条件可视化（节点 04, 05, 06）───
export const LogicVisual: React.FC<{ mode: 'condition' | 'quantifier' | 'inequality' }> = ({ mode }) => {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm">
      {mode === 'condition' && (
        <div className="space-y-4">
          <h3 className="font-semibold text-gray-800">充分条件与必要条件</h3>
          <div className="flex justify-center">
            <svg width={500} height={280}>
              {/* Outer set B */}
              <ellipse cx={250} cy={140} rx={200} ry={110} fill="rgba(16,185,129,0.1)" stroke="#10b981" strokeWidth="2.5" />
              {/* Inner set A */}
              <ellipse cx={200} cy={140} rx={100} ry={70} fill="rgba(59,130,246,0.2)" stroke="#3b82f6" strokeWidth="2.5" />
              <text x={200} y={145} textAnchor="middle" fontSize="18" fontWeight="bold" fill="#3b82f6">A</text>
              <text x={320} y={145} textAnchor="middle" fontSize="18" fontWeight="bold" fill="#10b981">B</text>
              <text x={250} y={270} textAnchor="middle" fontSize="13" fill="#374151">A ⊆ B  ⟺  p ⇒ q</text>
              <text x={250} y={25} textAnchor="middle" fontSize="12" fill="#6b7280">p 是 q 的充分条件，q 是 p 的必要条件</text>
            </svg>
          </div>
          <div className="grid grid-cols-2 gap-3 text-sm">
            <div className="p-3 rounded-lg bg-blue-50 border border-blue-100">
              <p className="font-medium text-blue-700">p ⇒ q 但 q ⇏ p</p>
              <p className="text-gray-600 text-xs mt-1">p 是 q 的充分不必要条件</p>
              <p className="text-gray-500 text-xs">例：x=2 ⇒ x²=4，但 x²=4 ⇏ x=2</p>
            </div>
            <div className="p-3 rounded-lg bg-green-50 border border-green-100">
              <p className="font-medium text-green-700">p ⇔ q</p>
              <p className="text-gray-600 text-xs mt-1">p 是 q 的充要条件</p>
              <p className="text-gray-500 text-xs">例：x²=4 ⇔ x=±2</p>
            </div>
          </div>
        </div>
      )}
      {mode === 'quantifier' && (
        <div className="space-y-4">
          <h3 className="font-semibold text-gray-800">全称量词与存在量词</h3>
          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 rounded-lg bg-blue-50 border border-blue-200">
              <div className="text-2xl font-bold text-blue-600 mb-1">∀</div>
              <p className="font-medium text-blue-700">全称量词</p>
              <p className="text-sm text-gray-600 mt-1">"对所有"、"任意"</p>
              <p className="text-xs text-gray-500 mt-2">∀x ∈ R, x² ≥ 0</p>
              <p className="text-xs text-gray-400">否定：∃x₀ ∈ R, x₀² &lt; 0</p>
            </div>
            <div className="p-4 rounded-lg bg-green-50 border border-green-200">
              <div className="text-2xl font-bold text-green-600 mb-1">∃</div>
              <p className="font-medium text-green-700">存在量词</p>
              <p className="text-sm text-gray-600 mt-1">"存在"、"有些"</p>
              <p className="text-xs text-gray-500 mt-2">∃x ∈ R, x² = 2</p>
              <p className="text-xs text-gray-400">否定：∀x ∈ R, x² ≠ 2</p>
            </div>
          </div>
          <div className="p-3 rounded-lg bg-amber-50 border border-amber-100 text-sm text-gray-700">
            <strong>否定规律：</strong>全称命题的否定是特称命题，特称命题的否定是全称命题。<br/>
            改变量词（∀ ↔ ∃），同时否定结论。
          </div>
        </div>
      )}
      {mode === 'inequality' && (
        <div className="space-y-3">
          <h3 className="font-semibold text-gray-800">不等式性质关系图</h3>
          <div className="space-y-2">
            {[
              { name: '对称性', formula: 'a > b ⇔ b < a', color: 'blue' },
              { name: '传递性', formula: 'a > b, b > c ⇒ a > c', color: 'green' },
              { name: '可加性', formula: 'a > b ⇒ a+c > b+c', color: 'amber' },
              { name: '可乘性', formula: 'a > b, c > 0 ⇒ ac > bc; a > b, c < 0 ⇒ ac < bc', color: 'red' },
              { name: '同向可加', formula: 'a > b, c > d ⇒ a+c > b+d', color: 'purple' },
              { name: '可乘方性', formula: 'a > b > 0 ⇒ aⁿ > bⁿ (n ∈ N*, n ≥ 2)', color: 'indigo' },
            ].map((prop, i) => (
              <div key={i} className="flex items-center gap-3 p-2.5 rounded-lg bg-white border border-gray-200 hover:shadow-sm transition-shadow">
                <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold text-white bg-${prop.color}-500`} style={{ backgroundColor: `hsl(${i * 55}, 65%, 50%)` }}>
                  {i + 1}
                </div>
                <div className="flex-1">
                  <span className="text-sm font-medium text-gray-700">{prop.name}</span>
                  <span className="text-sm text-gray-500 ml-3 font-mono">{prop.formula}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
