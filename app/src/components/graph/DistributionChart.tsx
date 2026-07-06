import { useRef, useEffect, useState } from 'react';
import { Slider } from '@/components/ui/slider';

interface DistributionChartProps {
  type: 'normal' | 'binomial';
}

const DistributionChart: React.FC<DistributionChartProps> = ({ type }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const width = 700;
  const height = 420;

  const [mu, setMu] = useState(0);     // 正态分布均值
  const [sigma, setSigma] = useState(1); // 正态分布标准差
  const [n, setN] = useState(10);       // 二项分布试验次数
  const [p, setP] = useState(0.5);      // 二项分布成功概率

  // Initialize canvas dimensions once
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const dpr = window.devicePixelRatio || 1;
    canvas.width = width * dpr;
    canvas.height = height * dpr;
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;
    const ctx = canvas.getContext('2d');
    if (ctx) ctx.scale(dpr, dpr);
  }, []);

  // Redraw on parameter change
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, width, height);

    const padding = { top: 30, right: 20, bottom: 50, left: 50 };
    const plotW = width - padding.left - padding.right;
    const plotH = height - padding.top - padding.bottom;

    // Grid
    ctx.strokeStyle = '#e5e7eb';
    ctx.lineWidth = 0.5;
    for (let i = 0; i <= 10; i++) {
      const x = padding.left + (plotW / 10) * i;
      ctx.beginPath(); ctx.moveTo(x, padding.top); ctx.lineTo(x, padding.top + plotH); ctx.stroke();
    }
    for (let i = 0; i <= 8; i++) {
      const y = padding.top + (plotH / 8) * i;
      ctx.beginPath(); ctx.moveTo(padding.left, y); ctx.lineTo(padding.left + plotW, y); ctx.stroke();
    }

    // Axes
    ctx.strokeStyle = '#374151';
    ctx.lineWidth = 1.5;
    ctx.beginPath(); ctx.moveTo(padding.left, padding.top + plotH); ctx.lineTo(padding.left + plotW, padding.top + plotH); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(padding.left, padding.top); ctx.lineTo(padding.left, padding.top + plotH); ctx.stroke();

    if (type === 'normal') {
      // Normal distribution
      const xMin = mu - 4 * sigma;
      const xMax = mu + 4 * sigma;
      const xRange = xMax - xMin;
      const maxY = 1 / (sigma * Math.sqrt(2 * Math.PI));

      const toPx = (x: number) => padding.left + ((x - xMin) / xRange) * plotW;
      const toPy = (y: number) => padding.top + plotH - (y / (maxY * 1.2)) * plotH;

      // Shade 1σ, 2σ, 3σ regions
      const regions = [
        { mult: 1, color: 'rgba(59,130,246,0.35)' },
        { mult: 2, color: 'rgba(59,130,246,0.2)' },
        { mult: 3, color: 'rgba(59,130,246,0.1)' },
      ];
      regions.forEach(({ mult, color }) => {
        ctx.fillStyle = color;
        ctx.beginPath();
        ctx.moveTo(toPx(mu - mult * sigma), toPy(0));
        for (let px = toPx(mu - mult * sigma); px <= toPx(mu + mult * sigma); px++) {
          const xVal = xMin + ((px - padding.left) / plotW) * xRange;
          const yVal = (1 / (sigma * Math.sqrt(2 * Math.PI))) * Math.exp(-((xVal - mu) ** 2) / (2 * sigma ** 2));
          ctx.lineTo(px, toPy(yVal));
        }
        ctx.lineTo(toPx(mu + mult * sigma), toPy(0));
        ctx.closePath();
        ctx.fill();
      });

      // Curve
      ctx.strokeStyle = '#3b82f6';
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      for (let px = padding.left; px <= padding.left + plotW; px++) {
        const xVal = xMin + ((px - padding.left) / plotW) * xRange;
        const yVal = (1 / (sigma * Math.sqrt(2 * Math.PI))) * Math.exp(-((xVal - mu) ** 2) / (2 * sigma ** 2));
        if (px === padding.left) ctx.moveTo(px, toPy(yVal));
        else ctx.lineTo(px, toPy(yVal));
      }
      ctx.stroke();

      // Axis labels
      ctx.font = '11px sans-serif';
      ctx.fillStyle = '#6b7280';
      const ticks = [-3, -2, -1, 0, 1, 2, 3];
      ticks.forEach(t => {
        const xVal = mu + t * sigma;
        if (xVal >= xMin && xVal <= xMax) {
          const px = toPx(xVal);
          ctx.fillText(`μ${t > 0 ? '+' : ''}${t === 0 ? '' : (t + 'σ')}`, px - 12, padding.top + plotH + 18);
        }
      });

      // Info
      ctx.font = 'bold 14px sans-serif';
      ctx.fillStyle = '#3b82f6';
      ctx.fillText(`X ~ N(${mu.toFixed(1)}, ${sigma.toFixed(1)}²)`, padding.left + 10, padding.top + 20);

      ctx.font = '12px sans-serif';
      ctx.fillStyle = '#6b7280';
      ctx.fillText(`P(μ-σ ≤ X ≤ μ+σ) ≈ 0.683`, padding.left + plotW - 200, padding.top + 38);
      ctx.fillText(`P(μ-2σ ≤ X ≤ μ+2σ) ≈ 0.954`, padding.left + plotW - 200, padding.top + 56);
      ctx.fillText(`P(μ-3σ ≤ X ≤ μ+3σ) ≈ 0.997`, padding.left + plotW - 200, padding.top + 74);

      // Mean line
      ctx.strokeStyle = '#ef4444';
      ctx.lineWidth = 1.5;
      ctx.setLineDash([5, 5]);
      ctx.beginPath();
      ctx.moveTo(toPx(mu), padding.top);
      ctx.lineTo(toPx(mu), padding.top + plotH);
      ctx.stroke();
      ctx.setLineDash([]);
      ctx.fillStyle = '#ef4444';
      ctx.font = 'bold 12px sans-serif';
      ctx.fillText('μ', toPx(mu) - 4, padding.top - 5);

    } else {
      // Binomial distribution
      const kMax = n;
      const maxProb = Math.max(...Array.from({ length: kMax + 1 }, (_, k) => {
        const c = (function () { let r = 1; for (let i = 0; i < k; i++) r = r * (n - i) / (i + 1); return r; })();
        return c * Math.pow(p, k) * Math.pow(1 - p, n - k);
      }));

      const barW = plotW / (kMax + 1) * 0.7;
      const gap = plotW / (kMax + 1) * 0.3;

      for (let k = 0; k <= kMax; k++) {
        // Compute C(n,k) * p^k * (1-p)^(n-k)
        let comb = 1;
        for (let i = 0; i < k; i++) comb = comb * (n - i) / (i + 1);
        const prob = comb * Math.pow(p, k) * Math.pow(1 - p, n - k);

        const bx = padding.left + (k + 0.5) * (barW + gap);
        const bh = (prob / (maxProb * 1.2)) * plotH;
        const by = padding.top + plotH - bh;

        // Color gradient based on probability
        const intensity = prob / maxProb;
        ctx.fillStyle = `rgba(59, 130, 246, ${0.3 + intensity * 0.5})`;
        ctx.fillRect(bx - barW / 2, by, barW, bh);

        // Value label
        if (prob > 0.02) {
          ctx.font = '10px sans-serif';
          ctx.fillStyle = '#374151';
          ctx.fillText(prob.toFixed(3), bx - 14, by - 4);
        }

        // x-axis label
        ctx.font = '10px sans-serif';
        ctx.fillStyle = '#6b7280';
        ctx.fillText(`${k}`, bx - 3, padding.top + plotH + 16);
      }

      // Info
      ctx.font = 'bold 14px sans-serif';
      ctx.fillStyle = '#3b82f6';
      ctx.fillText(`X ~ B(${n}, ${p.toFixed(1)})`, padding.left + 10, padding.top + 20);

      ctx.font = '12px sans-serif';
      ctx.fillStyle = '#6b7280';
      ctx.fillText(`E(X) = np = ${(n * p).toFixed(1)}`, padding.left + plotW - 150, padding.top + 38);
      ctx.fillText(`D(X) = np(1-p) = ${(n * p * (1 - p)).toFixed(2)}`, padding.left + plotW - 150, padding.top + 56);
    }
  }, [type, mu, sigma, n, p]);

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm">
      <div className="flex justify-center">
        <canvas ref={canvasRef} style={{ borderRadius: '8px', border: '1px solid #e5e7eb' }} />
      </div>
      <div className="mt-4 max-w-xl mx-auto space-y-3">
        {type === 'normal' ? (
          <>
            <div className="space-y-1">
              <label className="text-xs font-medium text-gray-700">均值 μ = {mu.toFixed(1)}</label>
              <Slider value={[mu]} min={-5} max={5} step={0.1} onValueChange={(v) => setMu(v[0])} />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-medium text-gray-700">标准差 σ = {sigma.toFixed(1)}</label>
              <Slider value={[sigma]} min={0.3} max={3} step={0.1} onValueChange={(v) => setSigma(v[0])} />
            </div>
          </>
        ) : (
          <>
            <div className="space-y-1">
              <label className="text-xs font-medium text-gray-700">试验次数 n = {n}</label>
              <Slider value={[n]} min={1} max={20} step={1} onValueChange={(v) => setN(v[0])} />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-medium text-gray-700">成功概率 p = {p.toFixed(2)}</label>
              <Slider value={[p * 100]} min={1} max={99} step={1} onValueChange={(v) => setP(v[0] / 100)} />
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default DistributionChart;
