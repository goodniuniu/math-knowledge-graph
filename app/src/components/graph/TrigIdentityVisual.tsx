import { useRef, useEffect, useState } from 'react';
import { Slider } from '@/components/ui/slider';

type Mode = 'sum' | 'double' | 'aux';

const TrigIdentityVisual: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [mode, setMode] = useState<Mode>('sum');

  // 和差角参数
  const [alpha, setAlpha] = useState(0.6);
  const [beta, setBeta] = useState(0.4);

  // 辅助角参数
  const [aCoef, setACoef] = useState(3);
  const [bCoef, setBCoef] = useState(4);

  const width = 700;
  const height = 420;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    canvas.width = width * dpr;
    canvas.height = height * dpr;
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;
    ctx.scale(dpr, dpr);

    ctx.fillStyle = '#fff';
    ctx.fillRect(0, 0, width, height);

    if (mode === 'sum') {
      drawSumAngle(ctx);
    } else if (mode === 'double') {
      drawDoubleAngle(ctx);
    } else {
      drawAuxiliary(ctx);
    }
  }, [mode, alpha, beta, aCoef, bCoef]);

  // 和差角公式可视化：单位圆 + 角度分解
  const drawSumAngle = (ctx: CanvasRenderingContext2D) => {
    const cx = width / 2;
    const cy = height / 2;
    const r = 130;

    // Grid
    ctx.strokeStyle = '#e5e7eb';
    ctx.lineWidth = 0.5;
    for (let x = 0; x < width; x += 25) { ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, height); ctx.stroke(); }
    for (let y = 0; y < height; y += 25) { ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(width, y); ctx.stroke(); }

    // Axes
    ctx.strokeStyle = '#374151';
    ctx.lineWidth = 1.5;
    ctx.beginPath(); ctx.moveTo(0, cy); ctx.lineTo(width, cy); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(cx, 0); ctx.lineTo(cx, height); ctx.stroke();

    // Unit circle
    ctx.strokeStyle = '#d1d5db';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.arc(cx, cy, r, 0, Math.PI * 2);
    ctx.stroke();

    // Angle α arc (blue)
    ctx.strokeStyle = '#3b82f6';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(cx, cy, 30, 0, -alpha);
    ctx.stroke();

    // Angle β arc (green) from α
    ctx.strokeStyle = '#10b981';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(cx, cy, 45, -alpha, -alpha - beta);
    ctx.stroke();

    // Point at angle α (blue)
    const ax = cx + r * Math.cos(alpha);
    const ay = cy - r * Math.sin(alpha);
    ctx.fillStyle = '#3b82f6';
    ctx.beginPath(); ctx.arc(ax, ay, 5, 0, Math.PI * 2); ctx.fill();

    // Point at angle α+β (orange)
    const sumAngle = alpha + beta;
    const sx = cx + r * Math.cos(sumAngle);
    const sy = cy - r * Math.sin(sumAngle);
    ctx.fillStyle = '#f59e0b';
    ctx.beginPath(); ctx.arc(sx, sy, 6, 0, Math.PI * 2); ctx.fill();

    // Vector to α+β point (orange)
    ctx.strokeStyle = '#f59e0b';
    ctx.lineWidth = 2.5;
    ctx.beginPath(); ctx.moveTo(cx, cy); ctx.lineTo(sx, sy); ctx.stroke();

    // sin(α+β) projection (dashed orange)
    ctx.strokeStyle = '#f59e0b';
    ctx.lineWidth = 2;
    ctx.setLineDash([5, 4]);
    ctx.beginPath(); ctx.moveTo(sx, sy); ctx.lineTo(sx, cy); ctx.stroke();
    ctx.setLineDash([]);

    // sinα·cosβ component (blue dashed)
    const sinA_cosB = Math.sin(alpha) * Math.cos(beta);
    const bx1 = sx;
    const by1 = cy - sinA_cosB * r;
    ctx.strokeStyle = '#3b82f6';
    ctx.lineWidth = 1.5;
    ctx.setLineDash([3, 3]);
    ctx.beginPath(); ctx.moveTo(cx, cy); ctx.lineTo(bx1, by1); ctx.stroke();
    ctx.setLineDash([]);

    // cosα·sinβ component (green dashed)
    ctx.strokeStyle = '#10b981';
    ctx.lineWidth = 1.5;
    ctx.setLineDash([3, 3]);
    ctx.beginPath(); ctx.moveTo(bx1, by1); ctx.lineTo(sx, sy); ctx.stroke();
    ctx.setLineDash([]);

    // Labels
    ctx.font = 'bold 13px sans-serif';
    ctx.fillStyle = '#3b82f6';
    ctx.fillText('α', cx + 38, cy - 8);
    ctx.fillStyle = '#10b981';
    ctx.fillText('β', cx + 20, cy - 40);
    ctx.fillStyle = '#f59e0b';
    ctx.fillText('(cos(α+β), sin(α+β))', sx + 10, sy - 8);

    // Numerical verification panel
    const sA = Math.sin(alpha), cA = Math.cos(alpha);
    const sB = Math.sin(beta), cB = Math.cos(beta);
    const lhs = Math.sin(alpha + beta);
    const rhs = sA * cB + cA * sB;

    ctx.font = 'bold 14px sans-serif';
    ctx.fillStyle = '#374151';
    ctx.fillText('正弦和角公式验证', 15, 25);
    ctx.font = '12px sans-serif';
    ctx.fillStyle = '#f59e0b';
    ctx.fillText(`sin(α+β) = ${lhs.toFixed(4)}`, 15, 45);
    ctx.fillStyle = '#3b82f6';
    ctx.fillText(`sinα·cosβ = ${sA.toFixed(3)}×${cB.toFixed(3)} = ${(sA*cB).toFixed(4)}`, 15, 63);
    ctx.fillStyle = '#10b981';
    ctx.fillText(`cosα·sinβ = ${cA.toFixed(3)}×${sB.toFixed(3)} = ${(cA*sB).toFixed(4)}`, 15, 81);
    ctx.fillStyle = Math.abs(lhs - rhs) < 0.001 ? '#10b981' : '#ef4444';
    ctx.font = 'bold 12px sans-serif';
    ctx.fillText(`✓ sinαcosβ + cosαsinβ = ${(sA*cB + cA*sB).toFixed(4)} = sin(α+β)`, 15, 99);

    // Cosine verification
    const lhsC = Math.cos(alpha + beta);
    const rhsC = cA * cB - sA * sB;
    ctx.font = '12px sans-serif';
    ctx.fillStyle = '#6b7280';
    ctx.fillText(`cos(α+β) = ${lhsC.toFixed(4)} = ${cA.toFixed(3)}×${cB.toFixed(3)} - ${sA.toFixed(3)}×${sB.toFixed(3)} = ${rhsC.toFixed(4)}`, 15, 117);
  };

  // 二倍角公式可视化：曲线对比
  const drawDoubleAngle = (ctx: CanvasRenderingContext2D) => {
    const padding = { top: 60, right: 20, bottom: 40, left: 50 };
    const plotW = width - padding.left - padding.right;
    const plotH = height - padding.top - padding.bottom;

    const xMin = -2 * Math.PI;
    const xMax = 2 * Math.PI;
    const xRange = xMax - xMin;

    const toPx = (x: number) => padding.left + ((x - xMin) / xRange) * plotW;
    const toPy = (y: number) => padding.top + plotH / 2 - y * (plotH / 2.6);

    // Grid
    ctx.strokeStyle = '#e5e7eb';
    ctx.lineWidth = 0.5;
    for (let i = 0; i <= 16; i++) {
      const x = padding.left + (plotW / 16) * i;
      ctx.beginPath(); ctx.moveTo(x, padding.top); ctx.lineTo(x, padding.top + plotH); ctx.stroke();
    }
    for (let i = 0; i <= 8; i++) {
      const y = padding.top + (plotH / 8) * i;
      ctx.beginPath(); ctx.moveTo(padding.left, y); ctx.lineTo(padding.left + plotW, y); ctx.stroke();
    }

    // Axes
    ctx.strokeStyle = '#374151';
    ctx.lineWidth = 1.5;
    ctx.beginPath(); ctx.moveTo(padding.left, toPy(0)); ctx.lineTo(padding.left + plotW, toPy(0)); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(padding.left, padding.top); ctx.lineTo(padding.left, padding.top + plotH); ctx.stroke();

    // Axis labels
    ctx.font = '10px sans-serif';
    ctx.fillStyle = '#6b7280';
    [-2*Math.PI, -Math.PI, 0, Math.PI, 2*Math.PI].forEach(xv => {
      ctx.fillText(xv === 0 ? '0' : xv < 0 ? `${xv/Math.PI}π` : `${xv/Math.PI}π`, toPx(xv) - 8, toPy(0) + 15);
    });
    ['1', '0', '-1'].forEach(yv => {
      ctx.fillText(yv, padding.left - 18, toPy(Number(yv)) + 4);
    });

    // Draw sin(2x) - orange
    ctx.strokeStyle = '#f59e0b';
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    let first = true;
    for (let px = padding.left; px <= padding.left + plotW; px++) {
      const x = xMin + ((px - padding.left) / plotW) * xRange;
      const y = Math.sin(2 * x);
      if (first) { ctx.moveTo(px, toPy(y)); first = false; } else { ctx.lineTo(px, toPy(y)); }
    }
    ctx.stroke();

    // Draw 2sin(x)cos(x) - blue dashed (should overlap with sin(2x))
    ctx.strokeStyle = '#3b82f6';
    ctx.lineWidth = 2;
    ctx.setLineDash([6, 4]);
    ctx.beginPath();
    first = true;
    for (let px = padding.left; px <= padding.left + plotW; px++) {
      const x = xMin + ((px - padding.left) / plotW) * xRange;
      const y = 2 * Math.sin(x) * Math.cos(x);
      if (first) { ctx.moveTo(px, toPy(y)); first = false; } else { ctx.lineTo(px, toPy(y)); }
    }
    ctx.stroke();
    ctx.setLineDash([]);

    // Draw cos²x - sin²x - green dashed
    ctx.strokeStyle = '#10b981';
    ctx.lineWidth = 1.5;
    ctx.setLineDash([3, 3]);
    ctx.beginPath();
    first = true;
    for (let px = padding.left; px <= padding.left + plotW; px++) {
      const x = xMin + ((px - padding.left) / plotW) * xRange;
      const y = Math.cos(x) ** 2 - Math.sin(x) ** 2;
      if (first) { ctx.moveTo(px, toPy(y)); first = false; } else { ctx.lineTo(px, toPy(y)); }
    }
    ctx.stroke();
    ctx.setLineDash([]);

    // Current x position marker
    const xPos = alpha * 2;
    const pxMark = toPx(xPos);
    ctx.strokeStyle = '#ef4444';
    ctx.lineWidth = 1;
    ctx.beginPath(); ctx.moveTo(pxMark, padding.top); ctx.lineTo(pxMark, padding.top + plotH); ctx.stroke();

    // Values at current x
    const xVal = xPos;
    ctx.fillStyle = '#ef4444';
    ctx.beginPath(); ctx.arc(pxMark, toPy(Math.sin(2 * xVal)), 5, 0, Math.PI * 2); ctx.fill();

    // Legend
    ctx.font = 'bold 13px sans-serif';
    ctx.fillStyle = '#f59e0b';
    ctx.fillText('sin(2x)', 15, 25);
    ctx.fillStyle = '#3b82f6';
    ctx.fillText('2sin(x)cos(x)', 100, 25);
    ctx.fillStyle = '#10b981';
    ctx.fillText('cos²(x)-sin²(x)', 235, 25);

    ctx.font = '12px sans-serif';
    ctx.fillStyle = '#6b7280';
    ctx.fillText(`x = ${xVal.toFixed(2)} (${(xVal/Math.PI).toFixed(2)}π)`, 400, 25);
    ctx.fillStyle = '#f59e0b';
    ctx.fillText(`sin(2x)=${Math.sin(2*xVal).toFixed(3)}`, 400, 43);
    ctx.fillStyle = '#3b82f6';
    ctx.fillText(`2sin(x)cos(x)=${(2*Math.sin(xVal)*Math.cos(xVal)).toFixed(3)}`, 400, 61);

    ctx.fillStyle = '#374151';
    ctx.font = 'bold 12px sans-serif';
    ctx.fillText('三条曲线完全重合，验证二倍角公式', 15, height - 10);
  };

  // 辅助角公式可视化
  const drawAuxiliary = (ctx: CanvasRenderingContext2D) => {
    const padding = { top: 60, right: 20, bottom: 40, left: 50 };
    const plotW = width - padding.left - padding.right;
    const plotH = height - padding.top - padding.bottom;

    const xMin = -2 * Math.PI;
    const xMax = 2 * Math.PI;
    const xRange = xMax - xMin;

    const amp = Math.sqrt(aCoef * aCoef + bCoef * bCoef);
    const phi = Math.atan2(bCoef, aCoef);
    const yMax = amp * 1.3;

    const toPy = (y: number) => padding.top + plotH / 2 - (y / yMax) * (plotH / 2);

    // Grid
    ctx.strokeStyle = '#e5e7eb';
    ctx.lineWidth = 0.5;
    for (let i = 0; i <= 16; i++) {
      const x = padding.left + (plotW / 16) * i;
      ctx.beginPath(); ctx.moveTo(x, padding.top); ctx.lineTo(x, padding.top + plotH); ctx.stroke();
    }
    for (let i = 0; i <= 8; i++) {
      const y = padding.top + (plotH / 8) * i;
      ctx.beginPath(); ctx.moveTo(padding.left, y); ctx.lineTo(padding.left + plotW, y); ctx.stroke();
    }

    // Axes
    ctx.strokeStyle = '#374151';
    ctx.lineWidth = 1.5;
    ctx.beginPath(); ctx.moveTo(padding.left, toPy(0)); ctx.lineTo(padding.left + plotW, toPy(0)); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(padding.left, padding.top); ctx.lineTo(padding.left, padding.top + plotH); ctx.stroke();

    // a·sin(x) - blue
    ctx.strokeStyle = '#3b82f6';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    let first = true;
    for (let px = padding.left; px <= padding.left + plotW; px++) {
      const x = xMin + ((px - padding.left) / plotW) * xRange;
      const y = aCoef * Math.sin(x);
      if (first) { ctx.moveTo(px, toPy(y)); first = false; } else { ctx.lineTo(px, toPy(y)); }
    }
    ctx.stroke();

    // b·cos(x) - green
    ctx.strokeStyle = '#10b981';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    first = true;
    for (let px = padding.left; px <= padding.left + plotW; px++) {
      const x = xMin + ((px - padding.left) / plotW) * xRange;
      const y = bCoef * Math.cos(x);
      if (first) { ctx.moveTo(px, toPy(y)); first = false; } else { ctx.lineTo(px, toPy(y)); }
    }
    ctx.stroke();

    // a·sin(x) + b·cos(x) - orange
    ctx.strokeStyle = '#f59e0b';
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    first = true;
    for (let px = padding.left; px <= padding.left + plotW; px++) {
      const x = xMin + ((px - padding.left) / plotW) * xRange;
      const y = aCoef * Math.sin(x) + bCoef * Math.cos(x);
      if (first) { ctx.moveTo(px, toPy(y)); first = false; } else { ctx.lineTo(px, toPy(y)); }
    }
    ctx.stroke();

    // Amplitude reference lines
    ctx.strokeStyle = '#f59e0b';
    ctx.lineWidth = 1;
    ctx.setLineDash([4, 4]);
    ctx.beginPath(); ctx.moveTo(padding.left, toPy(amp)); ctx.lineTo(padding.left + plotW, toPy(amp)); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(padding.left, toPy(-amp)); ctx.lineTo(padding.left + plotW, toPy(-amp)); ctx.stroke();
    ctx.setLineDash([]);

    // Legend
    ctx.font = 'bold 13px sans-serif';
    ctx.fillStyle = '#3b82f6';
    ctx.fillText(`${aCoef}sin(x)`, 15, 25);
    ctx.fillStyle = '#10b981';
    ctx.fillText(`${bCoef}cos(x)`, 85, 25);
    ctx.fillStyle = '#f59e0b';
    ctx.fillText(`${aCoef}sin(x)+${bCoef}cos(x)`, 155, 25);

    ctx.font = '12px sans-serif';
    ctx.fillStyle = '#374151';
    ctx.fillText(`= √(${aCoef}²+${bCoef}²)·sin(x+φ)`, 15, 47);
    ctx.fillText(`= ${amp.toFixed(2)}·sin(x + ${(phi * 180 / Math.PI).toFixed(1)}°)`, 15, 65);
    ctx.fillStyle = '#6b7280';
    ctx.fillText(`振幅 R = √(a²+b²) = ${amp.toFixed(2)}    tan φ = b/a = ${(bCoef/aCoef).toFixed(2)}    φ = ${(phi * 180 / Math.PI).toFixed(1)}°`, 15, 83);
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm">
      <div className="flex gap-2 mb-3 justify-center">
        <button onClick={() => setMode('sum')} className={`px-4 py-1.5 rounded-lg text-sm font-medium ${mode === 'sum' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-600'}`}>和差角公式</button>
        <button onClick={() => setMode('double')} className={`px-4 py-1.5 rounded-lg text-sm font-medium ${mode === 'double' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-600'}`}>二倍角公式</button>
        <button onClick={() => setMode('aux')} className={`px-4 py-1.5 rounded-lg text-sm font-medium ${mode === 'aux' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-600'}`}>辅助角公式</button>
      </div>
      <div className="flex justify-center">
        <canvas ref={canvasRef} style={{ borderRadius: '8px', border: '1px solid #e5e7eb' }} />
      </div>
      <div className="mt-4 max-w-md mx-auto space-y-3">
        {mode === 'sum' && (
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-medium text-blue-700">α = {alpha.toFixed(2)} ({(alpha / Math.PI).toFixed(2)}π)</label>
              <Slider value={[alpha]} min={0} max={Math.PI} step={0.05} onValueChange={(v) => setAlpha(v[0])} />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-medium text-green-700">β = {beta.toFixed(2)} ({(beta / Math.PI).toFixed(2)}π)</label>
              <Slider value={[beta]} min={0} max={Math.PI} step={0.05} onValueChange={(v) => setBeta(v[0])} />
            </div>
          </div>
        )}
        {mode === 'double' && (
          <div className="space-y-1">
            <label className="text-xs font-medium text-gray-700">标记点 x = {(alpha * 2).toFixed(2)} ({((alpha * 2) / Math.PI).toFixed(2)}π)</label>
            <Slider value={[alpha]} min={0} max={Math.PI} step={0.05} onValueChange={(v) => setAlpha(v[0])} />
          </div>
        )}
        {mode === 'aux' && (
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-medium text-blue-700">a = {aCoef.toFixed(1)}</label>
              <Slider value={[aCoef]} min={0} max={6} step={0.5} onValueChange={(v) => setACoef(v[0])} />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-medium text-green-700">b = {bCoef.toFixed(1)}</label>
              <Slider value={[bCoef]} min={0} max={6} step={0.5} onValueChange={(v) => setBCoef(v[0])} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TrigIdentityVisual;
