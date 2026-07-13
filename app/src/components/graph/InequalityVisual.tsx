import { useRef, useEffect, useState } from 'react';
import { Slider } from '@/components/ui/slider';

// 均本不等式可视化: 展示 a+b ≥ 2√(ab) 的几何意义
export const MeanInequality: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [a, setA] = useState(3);
  const [b, setB] = useState(2);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const w = 700, h = 420;
    const dpr = window.devicePixelRatio || 1;
    canvas.width = w * dpr; canvas.height = h * dpr;
    canvas.style.width = `${w}px`; canvas.style.height = `${h}px`;
    ctx.scale(dpr, dpr);

    ctx.fillStyle = '#fff'; ctx.fillRect(0, 0, w, h);

    const s = 30; // pixels per unit
    const cx = w / 2, cy = h / 2 + 30;

    // Grid
    ctx.strokeStyle = '#e5e7eb'; ctx.lineWidth = 0.5;
    for (let x = 0; x < w; x += s * 0.5) { ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, h); ctx.stroke(); }
    for (let y = 0; y < h; y += s * 0.5) { ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(w, y); ctx.stroke(); }

    // Draw square of side a (blue)
    const sqX = cx - (a + b) * s / 2 - 10;
    const sqY = cy;
    ctx.fillStyle = 'rgba(59,130,246,0.2)';
    ctx.fillRect(sqX, sqY - a * s, a * s, a * s);
    ctx.strokeStyle = '#3b82f6'; ctx.lineWidth = 2;
    ctx.strokeRect(sqX, sqY - a * s, a * s, a * s);

    // Draw square of side b (green)
    ctx.fillStyle = 'rgba(16,185,129,0.2)';
    const sq2X = sqX + a * s + 20;
    ctx.fillRect(sq2X, sqY - b * s, b * s, b * s);
    ctx.strokeStyle = '#10b981'; ctx.lineWidth = 2;
    ctx.strokeRect(sq2X, sqY - b * s, b * s, b * s);

    // Draw square of side √(ab) (amber) - geometric mean
    const gm = Math.sqrt(a * b);
    const sq3X = sq2X + b * s + 20;
    ctx.fillStyle = 'rgba(245,158,11,0.3)';
    ctx.fillRect(sq3X, sqY - gm * s, gm * s, gm * s);
    ctx.strokeStyle = '#f59e0b'; ctx.lineWidth = 2;
    ctx.strokeRect(sq3X, sqY - gm * s, gm * s, gm * s);

    // Labels
    ctx.font = 'bold 14px sans-serif';
    ctx.fillStyle = '#3b82f6';
    ctx.fillText(`面积 = a² = ${(a * a).toFixed(1)}`, sqX + 5, sqY + 20);
    ctx.fillText(`边长 a = ${a.toFixed(1)}`, sqX + 5, sqY - a * s - 8);

    ctx.fillStyle = '#10b981';
    ctx.fillText(`面积 = b² = ${(b * b).toFixed(1)}`, sq2X + 5, sqY + 20);
    ctx.fillText(`边长 b = ${b.toFixed(1)}`, sq2X + 5, sqY - b * s - 8);

    ctx.fillStyle = '#f59e0b';
    ctx.fillText(`面积 = ab = ${(a * b).toFixed(1)}`, sq3X + 5, sqY + 20);
    ctx.fillText(`边长 √(ab) = ${gm.toFixed(2)}`, sq3X + 5, sqY - gm * s - 8);

    // Formula comparison
    const am = (a + b) / 2;
    ctx.font = 'bold 16px sans-serif';
    ctx.fillStyle = '#374151';
    ctx.fillText(`算术平均: (a+b)/2 = ${am.toFixed(2)}`, 15, 30);
    ctx.fillStyle = '#f59e0b';
    ctx.fillText(`几何平均: √(ab) = ${gm.toFixed(2)}`, 15, 52);
    ctx.fillStyle = am >= gm ? '#10b981' : '#ef4444';
    ctx.fillText(`(a+b)/2 ≥ √(ab)  →  ${am.toFixed(2)} ≥ ${gm.toFixed(2)} ✓`, 15, 74);
  }, [a, b]);

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm">
      <h3 className="font-semibold text-gray-800 mb-2">均值不等式几何演示</h3>
      <div className="flex justify-center">
        <canvas ref={canvasRef} style={{ borderRadius: '8px', border: '1px solid #e5e7eb' }} />
      </div>
      <div className="mt-4 max-w-md mx-auto grid grid-cols-2 gap-4">
        <div className="space-y-1">
          <label className="text-xs font-medium text-blue-700">a = {a.toFixed(1)}</label>
          <Slider value={[a]} min={0.5} max={5} step={0.1} onValueChange={(v) => setA(v[0])} />
        </div>
        <div className="space-y-1">
          <label className="text-xs font-medium text-green-700">b = {b.toFixed(1)}</label>
          <Slider value={[b]} min={0.5} max={5} step={0.1} onValueChange={(v) => setB(v[0])} />
        </div>
      </div>
    </div>
  );
};

// 导数切线演示
export const DerivativeTangent: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [x0, setX0] = useState(1);
  const [funcType, setFuncType] = useState<'cubic' | 'sin' | 'exp'>('cubic');

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const w = 700, h = 420;
    const dpr = window.devicePixelRatio || 1;
    canvas.width = w * dpr; canvas.height = h * dpr;
    canvas.style.width = `${w}px`; canvas.style.height = `${h}px`;
    ctx.scale(dpr, dpr);

    ctx.fillStyle = '#fff'; ctx.fillRect(0, 0, w, h);

    const s = 40;
    const cx = w / 2, cy = h / 2;

    // Grid
    ctx.strokeStyle = '#e5e7eb'; ctx.lineWidth = 0.5;
    for (let x = cx % (s * 0.5); x < w; x += s * 0.5) { ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, h); ctx.stroke(); }
    for (let y = cy % (s * 0.5); y < h; y += s * 0.5) { ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(w, y); ctx.stroke(); }

    // Axes
    ctx.strokeStyle = '#374151'; ctx.lineWidth = 1.5;
    ctx.beginPath(); ctx.moveTo(0, cy); ctx.lineTo(w, cy); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(cx, 0); ctx.lineTo(cx, h); ctx.stroke();
    ctx.fillStyle = '#6b7280'; ctx.font = '12px sans-serif';
    ctx.fillText('O', cx + 4, cy + 14);

    // Functions and their derivatives
    const f = (x: number) => {
      if (funcType === 'cubic') return x ** 3 - 3 * x;
      if (funcType === 'sin') return 2 * Math.sin(x);
      return Math.exp(x * 0.5) - 3;
    };
    const fp = (x: number) => {
      if (funcType === 'cubic') return 3 * x ** 2 - 3;
      if (funcType === 'sin') return 2 * Math.cos(x);
      return 0.5 * Math.exp(x * 0.5);
    };

    const funcLabel = funcType === 'cubic' ? 'f(x)=x³-3x' : funcType === 'sin' ? 'f(x)=2sin(x)' : 'f(x)=e^(0.5x)-3';

    // Draw function curve
    ctx.strokeStyle = '#3b82f6'; ctx.lineWidth = 2.5;
    ctx.beginPath();
    let first = true;
    for (let px = 0; px < w; px++) {
      const x = (px - cx) / s;
      const y = f(x);
      if (!isFinite(y) || Math.abs(y) > 6) { first = true; continue; }
      const py = cy - y * s;
      if (first) { ctx.moveTo(px, py); first = false; } else { ctx.lineTo(px, py); }
    }
    ctx.stroke();

    // Tangent line at x0
    const y0 = f(x0);
    const slope = fp(x0);
    const px0 = cx + x0 * s;
    const py0 = cy - y0 * s;

    // Draw tangent
    ctx.strokeStyle = '#ef4444'; ctx.lineWidth = 2;
    ctx.setLineDash([]);
    ctx.beginPath();
    const dx = 3;
    ctx.moveTo(px0 - dx * s, py0 + slope * dx * s);
    ctx.lineTo(px0 + dx * s, py0 - slope * dx * s);
    ctx.stroke();

    // Draw point
    ctx.fillStyle = '#ef4444';
    ctx.beginPath(); ctx.arc(px0, py0, 6, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = '#fff';
    ctx.beginPath(); ctx.arc(px0, py0, 3, 0, Math.PI * 2); ctx.fill();

    // Labels
    ctx.font = 'bold 13px sans-serif';
    ctx.fillStyle = '#3b82f6';
    ctx.fillText(funcLabel, 15, 25);
    ctx.fillStyle = '#ef4444';
    ctx.fillText(`切线斜率 f'(${x0.toFixed(1)}) = ${slope.toFixed(2)}`, 15, 47);
    ctx.fillStyle = '#6b7280';
    ctx.font = '12px sans-serif';
    ctx.fillText(`切点: (${x0.toFixed(1)}, ${y0.toFixed(2)})`, 15, 69);

    // If slope > 0, label increasing; if < 0, decreasing
    ctx.fillStyle = slope > 0 ? '#10b981' : slope < 0 ? '#ef4444' : '#6b7280';
    ctx.font = 'bold 12px sans-serif';
    const monotonicity = slope > 0 ? '单调递增 ↗' : slope < 0 ? '单调递减 ↘' : '极值点 ●';
    ctx.fillText(monotonicity, w - 130, 25);
  }, [x0, funcType]);

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm">
      <h3 className="font-semibold text-gray-800 mb-2">导数与切线演示</h3>
      <div className="flex justify-center">
        <canvas ref={canvasRef} style={{ borderRadius: '8px', border: '1px solid #e5e7eb' }} />
      </div>
      <div className="mt-4 max-w-md mx-auto space-y-3">
        <div className="flex gap-2 justify-center">
          {(['cubic', 'sin', 'exp'] as const).map(t => (
            <button
              key={t}
              onClick={() => setFuncType(t)}
              className={`px-3 py-1 rounded-lg text-xs font-medium ${funcType === t ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-600'}`}
            >
              {t === 'cubic' ? 'f(x)=x³-3x' : t === 'sin' ? 'f(x)=2sin(x)' : 'f(x)=e^(0.5x)'}
            </button>
          ))}
        </div>
        <div className="space-y-1">
          <label className="text-xs font-medium text-gray-700">切点 x₀ = {x0.toFixed(1)}</label>
          <Slider value={[x0]} min={-4} max={4} step={0.1} onValueChange={(v) => setX0(v[0])} />
        </div>
      </div>
    </div>
  );
};

// 默认导出：根据 variant 渲染对应组件，用于懒加载
const InequalityVisual: React.FC<{ variant: 'mean' | 'derivative' }> = ({ variant }) => {
  if (variant === 'mean') return <MeanInequality />;
  return <DerivativeTangent />;
};

export default InequalityVisual;
