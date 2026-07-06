import { useRef, useEffect, useState } from 'react';
import { Slider } from '@/components/ui/slider';
import { Button } from '@/components/ui/button';

interface VectorCanvasProps {
  mode: 'ops' | 'coords' | 'triangle';
}

interface Vec2 { x: number; y: number; }

const VectorCanvas: React.FC<VectorCanvasProps> = ({ mode }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const width = 700;
  const height = 420;
  const scale = 40;

  const [ax, setAx] = useState(3);
  const [ay, setAy] = useState(2);
  const [bx, setBx] = useState(-1);
  const [by, setBy] = useState(3);
  const [showSum, setShowSum] = useState(true);
  const [showDot, setShowDot] = useState(false);
  const [showAngle, setShowAngle] = useState(true);

  const a: Vec2 = { x: ax, y: ay };
  const b: Vec2 = { x: bx, y: by };
  const sum: Vec2 = { x: ax + bx, y: ay + by };

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

    const cx = width / 2;
    const cy = height / 2;

    // Background
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, width, height);

    // Grid
    ctx.strokeStyle = '#e5e7eb';
    ctx.lineWidth = 0.5;
    for (let x = cx % (scale * 0.5); x < width; x += scale * 0.5) {
      ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, height); ctx.stroke();
    }
    for (let y = cy % (scale * 0.5); y < height; y += scale * 0.5) {
      ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(width, y); ctx.stroke();
    }

    // Axes
    ctx.strokeStyle = '#374151';
    ctx.lineWidth = 1.5;
    ctx.beginPath(); ctx.moveTo(0, cy); ctx.lineTo(width, cy); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(cx, 0); ctx.lineTo(cx, height); ctx.stroke();

    // Arrow heads
    ctx.fillStyle = '#374151';
    ctx.beginPath(); ctx.moveTo(width - 8, cy - 4); ctx.lineTo(width, cy); ctx.lineTo(width - 8, cy + 4); ctx.fill();
    ctx.beginPath(); ctx.moveTo(cx - 4, 8); ctx.lineTo(cx, 0); ctx.lineTo(cx + 4, 8); ctx.fill();

    ctx.font = '12px sans-serif';
    ctx.fillStyle = '#6b7280';
    ctx.fillText('O', cx + 4, cy + 14);
    ctx.fillText('x', width - 12, cy - 8);
    ctx.fillText('y', cx + 8, 12);

    // Draw arrow helper
    const drawArrow = (from: Vec2, to: Vec2, color: string, label?: string) => {
      const fx = cx + from.x * scale;
      const fy = cy - from.y * scale;
      const tx = cx + to.x * scale;
      const ty = cy - to.y * scale;

      ctx.strokeStyle = color;
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      ctx.moveTo(fx, fy);
      ctx.lineTo(tx, ty);
      ctx.stroke();

      // Arrowhead
      const angle = Math.atan2(ty - fy, tx - fx);
      const headLen = 12;
      ctx.fillStyle = color;
      ctx.beginPath();
      ctx.moveTo(tx, ty);
      ctx.lineTo(tx - headLen * Math.cos(angle - 0.4), ty - headLen * Math.sin(angle - 0.4));
      ctx.lineTo(tx - headLen * Math.cos(angle + 0.4), ty - headLen * Math.sin(angle + 0.4));
      ctx.fill();

      if (label) {
        ctx.font = 'bold 13px sans-serif';
        ctx.fillStyle = color;
        ctx.fillText(label, tx + 8, ty - 4);
      }
    };

    if (mode === 'ops' || mode === 'coords') {
      // Draw vector a
      drawArrow({ x: 0, y: 0 }, a, '#3b82f6', 'a');

      // Draw vector b
      drawArrow({ x: 0, y: 0 }, b, '#10b981', 'b');

      if (showSum) {
        // Parallelogram dashed lines
        ctx.strokeStyle = '#d1d5db';
        ctx.lineWidth = 1;
        ctx.setLineDash([5, 5]);
        ctx.beginPath();
        ctx.moveTo(cx + a.x * scale, cy - a.y * scale);
        ctx.lineTo(cx + sum.x * scale, cy - sum.y * scale);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(cx + b.x * scale, cy - b.y * scale);
        ctx.lineTo(cx + sum.x * scale, cy - sum.y * scale);
        ctx.stroke();
        ctx.setLineDash([]);

        // Draw a+b
        drawArrow({ x: 0, y: 0 }, sum, '#f59e0b', 'a+b');
      }

      if (showDot) {
        // Projection of b onto a
        const aMag = Math.sqrt(ax * ax + ay * ay);
        const dot = ax * bx + ay * by;
        const projLen = dot / aMag;
        const ux = ax / aMag;
        const uy = ay / aMag;
        const projEnd = { x: ux * projLen, y: uy * projLen };

        ctx.strokeStyle = '#8b5cf6';
        ctx.lineWidth = 3;
        ctx.setLineDash([2, 2]);
        ctx.beginPath();
        ctx.moveTo(cx, cy);
        ctx.lineTo(cx + projEnd.x * scale, cy - projEnd.y * scale);
        ctx.stroke();
        ctx.setLineDash([]);
      }

      if (showAngle) {
        // Draw angle arc between a and b
        const aAngle = Math.atan2(ay, ax);
        const bAngle = Math.atan2(by, bx);
        const startAngle = -aAngle;
        const endAngle = -bAngle;

        ctx.strokeStyle = '#f59e0b';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(cx, cy, 30, Math.min(startAngle, endAngle), Math.max(startAngle, endAngle));
        ctx.stroke();

        const midAngle = (startAngle + endAngle) / 2;
        const dot = ax * bx + ay * by;
        const aMag = Math.sqrt(ax * ax + ay * ay);
        const bMag = Math.sqrt(bx * bx + by * by);
        const cosTheta = aMag > 0 && bMag > 0 ? dot / (aMag * bMag) : 0;
        const theta = (Math.acos(Math.max(-1, Math.min(1, cosTheta))) * 180 / Math.PI).toFixed(1);

        ctx.font = '12px sans-serif';
        ctx.fillStyle = '#f59e0b';
        ctx.fillText(`θ=${theta}°`, cx + 40 * Math.cos(midAngle), cy + 40 * Math.sin(midAngle));
      }

      // Info panel
      const aMag = Math.sqrt(ax * ax + ay * ay);
      const bMag = Math.sqrt(bx * bx + by * by);
      const dot = ax * bx + ay * by;

      ctx.font = 'bold 13px sans-serif';
      let yOff = 25;
      ctx.fillStyle = '#3b82f6';
      ctx.fillText(`a = (${ax}, ${ay}),  |a| = ${aMag.toFixed(2)}`, 15, yOff); yOff += 20;
      ctx.fillStyle = '#10b981';
      ctx.fillText(`b = (${bx}, ${by}),  |b| = ${bMag.toFixed(2)}`, 15, yOff); yOff += 20;
      ctx.fillStyle = '#f59e0b';
      ctx.fillText(`a+b = (${sum.x}, ${sum.y})`, 15, yOff); yOff += 20;
      ctx.fillStyle = '#8b5cf6';
      ctx.fillText(`a·b = ${dot.toFixed(2)}`, 15, yOff);
    }

    if (mode === 'triangle') {
      // Triangle ABC with vectors
      const A = { x: -2, y: -1 };
      const B = { x: ax, y: ay };
      const C = { x: bx, y: by };

      // Draw triangle
      ctx.strokeStyle = '#3b82f6';
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      ctx.moveTo(cx + A.x * scale, cy - A.y * scale);
      ctx.lineTo(cx + B.x * scale, cy - B.y * scale);
      ctx.lineTo(cx + C.x * scale, cy - C.y * scale);
      ctx.closePath();
      ctx.stroke();
      ctx.fillStyle = 'rgba(59,130,246,0.06)';
      ctx.fill();

      // Labels
      ctx.font = 'bold 14px sans-serif';
      ctx.fillStyle = '#1e40af';
      ctx.fillText('A', cx + A.x * scale - 14, cy - A.y * scale + 4);
      ctx.fillText('B', cx + B.x * scale + 6, cy - B.y * scale + 4);
      ctx.fillText('C', cx + C.x * scale + 6, cy - C.y * scale + 4);

      // Side labels
      const ab = Math.sqrt((B.x - A.x) ** 2 + (B.y - A.y) ** 2);
      const bc = Math.sqrt((C.x - B.x) ** 2 + (C.y - B.y) ** 2);
      const ac = Math.sqrt((C.x - A.x) ** 2 + (C.y - A.y) ** 2);

      ctx.font = '12px sans-serif';
      ctx.fillStyle = '#6b7280';
      ctx.fillText(`c=${ab.toFixed(1)}`, (cx + (A.x + B.x) * scale / 2) - 10, cy - (A.y + B.y) * scale / 2 - 6);
      ctx.fillText(`a=${bc.toFixed(1)}`, (cx + (B.x + C.x) * scale / 2) + 8, cy - (B.y + C.y) * scale / 2);
      ctx.fillText(`b=${ac.toFixed(1)}`, (cx + (A.x + C.x) * scale / 2) - 20, cy - (A.y + C.y) * scale / 2 + 14);

      // Cosine theorem
      const cosA = (ab * ab + ac * ac - bc * bc) / (2 * ab * ac);
      const angleA = (Math.acos(Math.max(-1, Math.min(1, cosA))) * 180 / Math.PI).toFixed(1);

      ctx.font = 'bold 13px sans-serif';
      ctx.fillStyle = '#374151';
      ctx.fillText(`余弦定理: a² = b² + c² - 2bc·cosA`, 15, 25);
      ctx.fillText(`∠A = ${angleA}°`, 15, 45);

      // Area
      const area = 0.5 * Math.abs((B.x - A.x) * (C.y - A.y) - (C.x - A.x) * (B.y - A.y));
      ctx.fillText(`面积 S = ${area.toFixed(2)}`, 15, 65);
    }
  }, [ax, ay, bx, by, mode, showSum, showDot, showAngle]);

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm">
      <div className="flex justify-center">
        <canvas ref={canvasRef} style={{ borderRadius: '8px', border: '1px solid #e5e7eb' }} />
      </div>
      <div className="mt-4 max-w-xl mx-auto space-y-3">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1">
            <label className="text-xs font-medium text-blue-700">向量 a 的 x 分量: {ax.toFixed(1)}</label>
            <Slider value={[ax]} min={-5} max={5} step={0.5} onValueChange={(v) => setAx(v[0])} />
          </div>
          <div className="space-y-1">
            <label className="text-xs font-medium text-blue-700">向量 a 的 y 分量: {ay.toFixed(1)}</label>
            <Slider value={[ay]} min={-5} max={5} step={0.5} onValueChange={(v) => setAy(v[0])} />
          </div>
          <div className="space-y-1">
            <label className="text-xs font-medium text-green-700">向量 b 的 x 分量: {bx.toFixed(1)}</label>
            <Slider value={[bx]} min={-5} max={5} step={0.5} onValueChange={(v) => setBx(v[0])} />
          </div>
          <div className="space-y-1">
            <label className="text-xs font-medium text-green-700">向量 b 的 y 分量: {by.toFixed(1)}</label>
            <Slider value={[by]} min={-5} max={5} step={0.5} onValueChange={(v) => setBy(v[0])} />
          </div>
        </div>
        {mode !== 'triangle' && (
          <div className="flex gap-2 justify-center">
            <Button size="sm" variant={showSum ? 'default' : 'outline'} onClick={() => setShowSum(!showSum)}>a+b 平行四边形</Button>
            <Button size="sm" variant={showAngle ? 'default' : 'outline'} onClick={() => setShowAngle(!showAngle)}>夹角</Button>
            <Button size="sm" variant={showDot ? 'default' : 'outline'} onClick={() => setShowDot(!showDot)}>投影</Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default VectorCanvas;
