import { useRef, useEffect, useState } from 'react';
import { Slider } from '@/components/ui/slider';

type Scenario = 'spring' | 'pendulum' | 'wave' | 'ac';

const SimpleHarmonicMotion: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animRef = useRef<number | undefined>(undefined);
  const timeRef = useRef(0);
  const trailRef = useRef<{ x: number; y: number }[]>([]);

  const [amplitude, setAmplitude] = useState(2);
  const [omega, setOmega] = useState(2);
  const [phi, setPhi] = useState(0);
  const [scenario, setScenario] = useState<Scenario>('spring');
  const [paused, setPaused] = useState(false);

  const width = 700;
  const height = 420;

  useEffect(() => {
    if (paused) return;

    let lastTime = performance.now();

    const animate = (now: number) => {
      const dt = (now - lastTime) / 1000;
      lastTime = now;
      timeRef.current += dt;

      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      const dpr = window.devicePixelRatio || 1;
      if (canvas.width !== width * dpr) {
        canvas.width = width * dpr;
        canvas.height = height * dpr;
        canvas.style.width = `${width}px`;
        canvas.style.height = `${height}px`;
        ctx.scale(dpr, dpr);
      }

      draw(ctx, timeRef.current);
      animRef.current = requestAnimationFrame(animate);
    };

    animRef.current = requestAnimationFrame(animate);
    return () => {
      if (animRef.current) cancelAnimationFrame(animRef.current);
    };
  }, [amplitude, omega, phi, scenario, paused]);

  useEffect(() => {
    // Reset trail when params change
    trailRef.current = [];
    timeRef.current = 0;
  }, [amplitude, omega, phi, scenario]);

  const draw = (ctx: CanvasRenderingContext2D, t: number) => {
    ctx.fillStyle = '#fff';
    ctx.fillRect(0, 0, width, height);

    const A = amplitude;
    const w = omega;
    const phase = phi;
    const y = A * Math.sin(w * t + phase);

    // Left panel: physical scene (350px wide)
    const sceneW = 320;
    drawScene(ctx, sceneW, height, y, t);

    // Divider
    ctx.strokeStyle = '#e5e7eb';
    ctx.lineWidth = 1;
    ctx.beginPath(); ctx.moveTo(sceneW, 0); ctx.lineTo(sceneW, height); ctx.stroke();

    // Right panel: curve (380px wide)
    drawCurve(ctx, sceneW, width - sceneW, height, t, y);
  };

  const drawScene = (ctx: CanvasRenderingContext2D, w: number, h: number, y: number, t: number) => {
    const cx = w / 2;
    const cy = h / 2;
    const scale = 35;

    if (scenario === 'spring') {
      // Ceiling
      ctx.strokeStyle = '#6b7280';
      ctx.lineWidth = 3;
      ctx.beginPath(); ctx.moveTo(cx - 50, 30); ctx.lineTo(cx + 50, 30); ctx.stroke();
      // Hatching
      for (let i = -45; i < 50; i += 10) {
        ctx.beginPath(); ctx.moveTo(cx + i, 30); ctx.lineTo(cx + i - 5, 25); ctx.stroke();
      }

      // Spring (zigzag from ceiling to mass)
      const massY = cy + y * scale;
      const springTop = 30;
      const springLen = massY - springTop - 15;
      const coils = 8;
      const coilW = 15;

      ctx.strokeStyle = '#6b7280';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(cx, springTop);
      for (let i = 0; i <= coils * 2; i++) {
        const py = springTop + (springLen * i) / (coils * 2);
        const px = cx + (i % 2 === 0 ? -coilW : coilW);
        if (i === 0) ctx.lineTo(cx, py);
        else if (i === coils * 2) ctx.lineTo(cx, py);
        else ctx.lineTo(px, py);
      }
      ctx.stroke();

      // Mass (rectangle)
      ctx.fillStyle = '#3b82f6';
      ctx.fillRect(cx - 25, massY - 15, 50, 30);
      ctx.strokeStyle = '#1e40af';
      ctx.lineWidth = 2;
      ctx.strokeRect(cx - 25, massY - 15, 50, 30);

      // Label
      ctx.font = '11px sans-serif';
      ctx.fillStyle = '#1e40af';
      ctx.fillText('m', cx - 4, massY + 4);

      // Equilibrium line
      ctx.strokeStyle = '#f59e0b';
      ctx.lineWidth = 1;
      ctx.setLineDash([4, 4]);
      ctx.beginPath(); ctx.moveTo(20, cy); ctx.lineTo(w - 20, cy); ctx.stroke();
      ctx.setLineDash([]);
      ctx.fillStyle = '#f59e0b';
      ctx.font = '10px sans-serif';
      ctx.fillText('平衡位置', w - 65, cy - 4);

      // Displacement arrow
      if (Math.abs(y) > 0.05) {
        ctx.strokeStyle = '#ef4444';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(cx + 35, cy);
        ctx.lineTo(cx + 35, massY);
        ctx.stroke();
        // Arrowhead
        const dir = y > 0 ? -1 : 1;
        ctx.beginPath();
        ctx.moveTo(cx + 35, massY);
        ctx.lineTo(cx + 30, massY + 6 * dir);
        ctx.lineTo(cx + 40, massY + 6 * dir);
        ctx.fill();
      }

    } else if (scenario === 'pendulum') {
      // Pivot
      const pivotY = 40;
      ctx.fillStyle = '#6b7280';
      ctx.beginPath(); ctx.arc(cx, pivotY, 6, 0, Math.PI * 2); ctx.fill();

      // Pendulum angle from y value
      const angle = y * 0.4; // scale to reasonable angle
      const len = 180;
      const bobX = cx + len * Math.sin(angle);
      const bobY = pivotY + len * Math.cos(angle);

      // String
      ctx.strokeStyle = '#6b7280';
      ctx.lineWidth = 2;
      ctx.beginPath(); ctx.moveTo(cx, pivotY); ctx.lineTo(bobX, bobY); ctx.stroke();

      // Bob
      ctx.fillStyle = '#3b82f6';
      ctx.beginPath(); ctx.arc(bobX, bobY, 18, 0, Math.PI * 2); ctx.fill();
      ctx.strokeStyle = '#1e40af';
      ctx.lineWidth = 2;
      ctx.stroke();

      // Arc trace
      ctx.strokeStyle = '#fca5a5';
      ctx.lineWidth = 1;
      ctx.setLineDash([3, 3]);
      ctx.beginPath(); ctx.arc(cx, pivotY, len, Math.PI/2 - 0.8, Math.PI/2 + 0.8); ctx.stroke();
      ctx.setLineDash([]);

      // Equilibrium
      ctx.strokeStyle = '#f59e0b';
      ctx.lineWidth = 1;
      ctx.setLineDash([4, 4]);
      ctx.beginPath(); ctx.moveTo(cx, pivotY); ctx.lineTo(cx, pivotY + len + 10); ctx.stroke();
      ctx.setLineDash([]);

    } else if (scenario === 'wave') {
      // Water surface with wave
      const waterLevel = cy;
      ctx.fillStyle = '#dbeafe';
      ctx.beginPath();
      ctx.moveTo(0, waterLevel);
      for (let px = 0; px <= w; px += 2) {
        const offset = y * 15 * Math.sin((px / w) * Math.PI * 3 - t * 2);
        ctx.lineTo(px, waterLevel + offset);
      }
      ctx.lineTo(w, h);
      ctx.lineTo(0, h);
      ctx.fill();

      // Water surface line
      ctx.strokeStyle = '#3b82f6';
      ctx.lineWidth = 2;
      ctx.beginPath();
      for (let px = 0; px <= w; px += 2) {
        const offset = y * 15 * Math.sin((px / w) * Math.PI * 3 - t * 2);
        if (px === 0) ctx.moveTo(px, waterLevel + offset);
        else ctx.lineTo(px, waterLevel + offset);
      }
      ctx.stroke();

      // Floating ball
      const ballX = cx;
      const ballOffset = y * 15 * Math.sin((ballX / w) * Math.PI * 3 - t * 2);
      const ballY = waterLevel + ballOffset;
      ctx.fillStyle = '#ef4444';
      ctx.beginPath(); ctx.arc(ballX, ballY - 10, 12, 0, Math.PI * 2); ctx.fill();

    } else if (scenario === 'ac') {
      // AC circuit: battery symbol + wire + light bulb
      const cyB = cy;

      // Current value determines brightness
      const brightness = Math.abs(y) / amplitude;

      // Wire
      ctx.strokeStyle = '#6b7280';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(50, cyB - 60);
      ctx.lineTo(w - 30, cyB - 60);
      ctx.lineTo(w - 30, cyB + 60);
      ctx.lineTo(50, cyB + 60);
      ctx.lineTo(50, cyB - 60);
      ctx.stroke();

      // AC source (circle with ~)
      ctx.strokeStyle = '#3b82f6';
      ctx.lineWidth = 2.5;
      ctx.beginPath(); ctx.arc(50, cyB, 25, 0, Math.PI * 2); ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(40, cyB);
      ctx.bezierCurveTo(43, cyB - 8, 47, cyB - 8, 50, cyB);
      ctx.bezierCurveTo(53, cyB + 8, 57, cyB + 8, 60, cyB);
      ctx.stroke();

      // Light bulb
      const bulbX = w - 30;
      const bulbR = 20 + brightness * 8;

      // Glow
      if (brightness > 0.05) {
        const gradient = ctx.createRadialGradient(bulbX, cyB, bulbR, bulbX, cyB, bulbR + 30);
        gradient.addColorStop(0, `rgba(255,220,100,${brightness * 0.5})`);
        gradient.addColorStop(1, 'rgba(255,220,100,0)');
        ctx.fillStyle = gradient;
        ctx.beginPath(); ctx.arc(bulbX, cyB, bulbR + 30, 0, Math.PI * 2); ctx.fill();
      }

      ctx.fillStyle = `rgba(255,${200 + brightness * 55},${100 + brightness * 100},${0.3 + brightness * 0.7})`;
      ctx.beginPath(); ctx.arc(bulbX, cyB, bulbR, 0, Math.PI * 2); ctx.fill();
      ctx.strokeStyle = '#f59e0b';
      ctx.lineWidth = 2;
      ctx.stroke();

      // Current direction arrows
      if (Math.abs(y) > 0.1) {
        ctx.fillStyle = '#ef4444';
        ctx.font = '10px sans-serif';
        const dir = y > 0 ? '→' : '←';
        ctx.fillText(`I ${dir} ${Math.abs(y).toFixed(2)}A`, cx - 40, cyB - 65);
      }
    }

    // Title
    ctx.font = 'bold 13px sans-serif';
    ctx.fillStyle = '#374151';
    const titles: Record<Scenario, string> = {
      spring: '弹簧振子',
      pendulum: '单摆',
      wave: '水波',
      ac: '交流电',
    };
    ctx.fillText(titles[scenario], 15, 20);

    // Current displacement
    ctx.font = '12px sans-serif';
    ctx.fillStyle = '#3b82f6';
    const unit = scenario === 'ac' ? 'A' : scenario === 'wave' ? '' : 'm';
    ctx.fillText(`x = ${y.toFixed(2)} ${unit}`, 15, 38);
  };

  const drawCurve = (ctx: CanvasRenderingContext2D, x0: number, w: number, h: number, t: number, currentY: number) => {
    const padding = { top: 40, right: 15, bottom: 30, left: 35 };
    const plotW = w - padding.left - padding.right;
    const plotH = h - padding.top - padding.bottom;

    // Grid
    ctx.strokeStyle = '#e5e7eb';
    ctx.lineWidth = 0.5;
    for (let i = 0; i <= 10; i++) {
      const x = x0 + padding.left + (plotW / 10) * i;
      ctx.beginPath(); ctx.moveTo(x, padding.top); ctx.lineTo(x, padding.top + plotH); ctx.stroke();
    }
    for (let i = 0; i <= 6; i++) {
      const y = padding.top + (plotH / 6) * i;
      ctx.beginPath(); ctx.moveTo(x0 + padding.left, y); ctx.lineTo(x0 + padding.left + plotW, y); ctx.stroke();
    }

    // Axes
    const midY = padding.top + plotH / 2;
    ctx.strokeStyle = '#374151';
    ctx.lineWidth = 1.5;
    ctx.beginPath(); ctx.moveTo(x0 + padding.left, midY); ctx.lineTo(x0 + padding.left + plotW, midY); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(x0 + padding.left, padding.top); ctx.lineTo(x0 + padding.left, padding.top + plotH); ctx.stroke();

    // Axis labels
    ctx.font = '10px sans-serif';
    ctx.fillStyle = '#6b7280';
    ctx.fillText('x', x0 + padding.left + plotW - 5, midY + 14);
    ctx.fillText('y', x0 + padding.left - 15, padding.top + 5);

    // Draw curve y = A*sin(ωt+φ) over time window
    const timeWindow = 4 * Math.PI / Math.max(omega, 0.5); // show ~2 periods
    const yScale = (plotH / 2) / Math.max(amplitude, 0.5);

    ctx.strokeStyle = '#3b82f6';
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    let first = true;
    for (let px = 0; px <= plotW; px++) {
      const timeVal = t - timeWindow + (px / plotW) * timeWindow;
      const yVal = amplitude * Math.sin(omega * timeVal + phi);
      const py = midY - yVal * yScale;
      if (first) { ctx.moveTo(x0 + padding.left + px, py); first = false; }
      else ctx.lineTo(x0 + padding.left + px, py);
    }
    ctx.stroke();

    // Current point (rightmost)
    const curPx = x0 + padding.left + plotW;
    const curPy = midY - currentY * yScale;
    ctx.fillStyle = '#ef4444';
    ctx.beginPath(); ctx.arc(curPx, curPy, 5, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = '#fff';
    ctx.beginPath(); ctx.arc(curPx, curPy, 2.5, 0, Math.PI * 2); ctx.fill();

    // Amplitude reference lines
    ctx.strokeStyle = '#f59e0b';
    ctx.lineWidth = 1;
    ctx.setLineDash([3, 3]);
    ctx.beginPath(); ctx.moveTo(x0 + padding.left, midY - amplitude * yScale); ctx.lineTo(x0 + padding.left + plotW, midY - amplitude * yScale); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(x0 + padding.left, midY + amplitude * yScale); ctx.lineTo(x0 + padding.left + plotW, midY + amplitude * yScale); ctx.stroke();
    ctx.setLineDash([]);

    // Formula
    ctx.font = 'bold 12px sans-serif';
    ctx.fillStyle = '#3b82f6';
    ctx.fillText(`x = ${amplitude.toFixed(1)}sin(${omega.toFixed(1)}t ${phi >= 0 ? '+' : ''}${phi.toFixed(1)})`, x0 + 10, 20);

    ctx.font = '11px sans-serif';
    ctx.fillStyle = '#6b7280';
    ctx.fillText(`T = ${(2 * Math.PI / omega).toFixed(2)}s`, x0 + 10, 37);
    ctx.fillText(`f = ${(omega / (2 * Math.PI)).toFixed(2)}Hz`, x0 + 90, 37);
  };

  const scenarioLabels: { key: Scenario; label: string; icon: string }[] = [
    { key: 'spring', label: '弹簧振子', icon: '🌀' },
    { key: 'pendulum', label: '单摆', icon: '⏰' },
    { key: 'wave', label: '水波', icon: '🌊' },
    { key: 'ac', label: '交流电', icon: '💡' },
  ];

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm">
      <div className="flex gap-2 mb-3 justify-center">
        {scenarioLabels.map(({ key, label, icon }) => (
          <button
            key={key}
            onClick={() => { setScenario(key); trailRef.current = []; timeRef.current = 0; }}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
              scenario === key ? 'bg-blue-600 text-white shadow-md' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            {icon} {label}
          </button>
        ))}
      </div>
      <div className="flex justify-center">
        <canvas ref={canvasRef} style={{ borderRadius: '8px', border: '1px solid #e5e7eb' }} />
      </div>
      <div className="mt-4 max-w-lg mx-auto">
        <div className="grid grid-cols-3 gap-4">
          <div className="space-y-1">
            <label className="text-xs font-medium text-blue-700">振幅 A = {amplitude.toFixed(1)}</label>
            <Slider value={[amplitude]} min={0.5} max={3} step={0.1} onValueChange={(v) => setAmplitude(v[0])} />
          </div>
          <div className="space-y-1">
            <label className="text-xs font-medium text-green-700">角频率 ω = {omega.toFixed(1)}</label>
            <Slider value={[omega]} min={0.5} max={5} step={0.1} onValueChange={(v) => setOmega(v[0])} />
          </div>
          <div className="space-y-1">
            <label className="text-xs font-medium text-purple-700">初相 φ = {phi.toFixed(1)}</label>
            <Slider value={[phi]} min={-3.14} max={3.14} step={0.1} onValueChange={(v) => setPhi(v[0])} />
          </div>
        </div>
        <div className="mt-3 flex justify-center">
          <button
            onClick={() => setPaused(!paused)}
            className="px-4 py-1.5 rounded-lg text-sm font-medium bg-gray-100 text-gray-700 hover:bg-gray-200"
          >
            {paused ? '▶ 继续' : '⏸ 暂停'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default SimpleHarmonicMotion;
