import React, { useRef, useEffect, useCallback } from 'react';

interface FunctionCanvasProps {
  graphType: string;
  params: Record<string, number>;
  width?: number;
  height?: number;
}

const FunctionCanvas: React.FC<FunctionCanvasProps> = ({
  graphType,
  params,
  width = 600,
  height = 400,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const drawGrid = useCallback((ctx: CanvasRenderingContext2D, w: number, h: number, scale: number) => {
    const centerX = w / 2;
    const centerY = h / 2;

    ctx.strokeStyle = '#e5e7eb';
    ctx.lineWidth = 0.5;

    // Vertical grid lines
    for (let x = centerX % (scale * 0.5); x < w; x += scale * 0.5) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, h);
      ctx.stroke();
    }

    // Horizontal grid lines
    for (let y = centerY % (scale * 0.5); y < h; y += scale * 0.5) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(w, y);
      ctx.stroke();
    }

    // Axes
    ctx.strokeStyle = '#374151';
    ctx.lineWidth = 1.5;

    // X axis
    ctx.beginPath();
    ctx.moveTo(0, centerY);
    ctx.lineTo(w, centerY);
    ctx.stroke();

    // Y axis
    ctx.beginPath();
    ctx.moveTo(centerX, 0);
    ctx.lineTo(centerX, h);
    ctx.stroke();

    // Arrow heads
    ctx.fillStyle = '#374151';
    // X arrow
    ctx.beginPath();
    ctx.moveTo(w - 8, centerY - 4);
    ctx.lineTo(w, centerY);
    ctx.lineTo(w - 8, centerY + 4);
    ctx.fill();
    // Y arrow
    ctx.beginPath();
    ctx.moveTo(centerX - 4, 8);
    ctx.lineTo(centerX, 0);
    ctx.lineTo(centerX + 4, 8);
    ctx.fill();

    // Labels
    ctx.font = '12px sans-serif';
    ctx.fillStyle = '#6b7280';
    ctx.fillText('O', centerX + 4, centerY + 14);
    ctx.fillText('x', w - 12, centerY - 8);
    ctx.fillText('y', centerX + 8, 12);

    // Tick marks
    ctx.font = '10px sans-serif';
    for (let i = -5; i <= 5; i++) {
      if (i === 0) continue;
      const x = centerX + i * scale;
      const y = centerY - i * scale;
      if (x >= 0 && x <= w) {
        ctx.beginPath();
        ctx.moveTo(x, centerY - 3);
        ctx.lineTo(x, centerY + 3);
        ctx.stroke();
        ctx.fillText(i.toString(), x - 4, centerY + 16);
      }
      if (y >= 0 && y <= h) {
        ctx.beginPath();
        ctx.moveTo(centerX - 3, y);
        ctx.lineTo(centerX + 3, y);
        ctx.stroke();
        ctx.fillText(i.toString(), centerX + 6, y + 4);
      }
    }
  }, []);

  const drawTrig = useCallback((ctx: CanvasRenderingContext2D, w: number, h: number, scale: number) => {
    const A = params.A || 1;
    const omega = params.omega || 1;
    const phi = params.phi || 0;
    const centerX = w / 2;
    const centerY = h / 2;

    // Draw sine wave
    ctx.strokeStyle = '#3b82f6';
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    for (let px = 0; px < w; px++) {
      const x = (px - centerX) / scale;
      const y = A * Math.sin(omega * x + phi);
      const py = centerY - y * scale;
      if (px === 0) ctx.moveTo(px, py);
      else ctx.lineTo(px, py);
    }
    ctx.stroke();

    // Draw cosine wave (dashed)
    ctx.strokeStyle = '#ef4444';
    ctx.lineWidth = 1.5;
    ctx.setLineDash([5, 5]);
    ctx.beginPath();
    for (let px = 0; px < w; px++) {
      const x = (px - centerX) / scale;
      const y = A * Math.cos(omega * x + phi);
      const py = centerY - y * scale;
      if (px === 0) ctx.moveTo(px, py);
      else ctx.lineTo(px, py);
    }
    ctx.stroke();
    ctx.setLineDash([]);

    // Legend
    ctx.font = 'bold 12px sans-serif';
    ctx.fillStyle = '#3b82f6';
    ctx.fillText(`y = ${A}sin(${omega}x + ${phi.toFixed(1)})`, 15, 20);
    ctx.fillStyle = '#ef4444';
    ctx.fillText(`y = ${A}cos(${omega}x + ${phi.toFixed(1)})`, 15, 38);

    // Amplitude lines
    ctx.strokeStyle = '#93c5fd';
    ctx.lineWidth = 1;
    ctx.setLineDash([3, 3]);
    ctx.beginPath();
    ctx.moveTo(0, centerY - A * scale);
    ctx.lineTo(w, centerY - A * scale);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(0, centerY + A * scale);
    ctx.lineTo(w, centerY + A * scale);
    ctx.stroke();
    ctx.setLineDash([]);

    // Period annotation
    const period = (2 * Math.PI) / Math.abs(omega);
    ctx.fillStyle = '#6b7280';
    ctx.font = '11px sans-serif';
    ctx.fillText(`周期 T = ${period.toFixed(2)}`, w - 120, 20);
  }, [params]);

  const drawExponential = useCallback((ctx: CanvasRenderingContext2D, w: number, h: number, scale: number) => {
    const a = Math.max(params.a || 2, 0.01);
    const centerX = w / 2;
    const centerY = h / 2;

    // Draw y = a^x
    ctx.strokeStyle = '#3b82f6';
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    for (let px = 0; px < w; px++) {
      const x = (px - centerX) / scale;
      if (a <= 0 && x !== Math.floor(x)) continue;
      const y = Math.pow(a, x);
      if (!isFinite(y) || Math.abs(y) > 10) continue;
      const py = centerY - y * scale;
      if (px === 0) ctx.moveTo(px, py);
      else ctx.lineTo(px, py);
    }
    ctx.stroke();

    // Draw reference y=1 line
    ctx.strokeStyle = '#d1d5db';
    ctx.lineWidth = 1;
    ctx.setLineDash([4, 4]);
    ctx.beginPath();
    ctx.moveTo(0, centerY - scale);
    ctx.lineTo(w, centerY - scale);
    ctx.stroke();
    ctx.setLineDash([]);

    // Draw point (0,1)
    ctx.fillStyle = '#3b82f6';
    ctx.beginPath();
    ctx.arc(centerX, centerY - scale, 4, 0, 2 * Math.PI);
    ctx.fill();

    // Legend
    ctx.font = 'bold 12px sans-serif';
    ctx.fillStyle = '#3b82f6';
    ctx.fillText(`y = ${a.toFixed(1)}^x`, 15, 20);

    if (a > 1) {
      ctx.fillStyle = '#6b7280';
      ctx.font = '11px sans-serif';
      ctx.fillText('单调递增', 15, 38);
    } else if (a > 0 && a < 1) {
      ctx.fillStyle = '#6b7280';
      ctx.font = '11px sans-serif';
      ctx.fillText('单调递减', 15, 38);
    }
  }, [params]);

  const drawLogarithm = useCallback((ctx: CanvasRenderingContext2D, w: number, h: number, scale: number) => {
    const a = Math.max(params.a || 2, 0.01);
    const centerX = w / 2;
    const centerY = h / 2;

    // Draw y = log_a(x)
    ctx.strokeStyle = '#10b981';
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    let started = false;
    for (let px = 0; px < w; px++) {
      const x = (px - centerX) / scale;
      if (x <= 0) continue;
      const y = Math.log(x) / Math.log(a);
      if (!isFinite(y) || Math.abs(y) > 10) {
        started = false;
        continue;
      }
      const py = centerY - y * scale;
      if (!started) {
        ctx.moveTo(px, py);
        started = true;
      } else {
        ctx.lineTo(px, py);
      }
    }
    ctx.stroke();

    // Draw reference lines
    ctx.strokeStyle = '#d1d5db';
    ctx.lineWidth = 1;
    ctx.setLineDash([4, 4]);
    // y=0
    ctx.beginPath();
    ctx.moveTo(centerX + scale, centerY);
    ctx.lineTo(w, centerY);
    ctx.stroke();
    // x=0 (asymptote)
    ctx.strokeStyle = '#fca5a5';
    ctx.beginPath();
    ctx.moveTo(centerX, 0);
    ctx.lineTo(centerX, h);
    ctx.stroke();
    ctx.setLineDash([]);

    // Draw point (1,0)
    ctx.fillStyle = '#10b981';
    ctx.beginPath();
    ctx.arc(centerX + scale, centerY, 4, 0, 2 * Math.PI);
    ctx.fill();

    // Draw point (a,1)
    ctx.fillStyle = '#10b981';
    ctx.beginPath();
    ctx.arc(centerX + a * scale, centerY - scale, 4, 0, 2 * Math.PI);
    ctx.fill();

    // Legend
    ctx.font = 'bold 12px sans-serif';
    ctx.fillStyle = '#10b981';
    ctx.fillText(`y = log_${a.toFixed(1)}(x)`, 15, 20);
  }, [params]);

  const drawPower = useCallback((ctx: CanvasRenderingContext2D, w: number, h: number, scale: number) => {
    const n = params.n || 1;
    const centerX = w / 2;
    const centerY = h / 2;

    // Draw y = x^n
    ctx.strokeStyle = '#8b5cf6';
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    for (let px = 0; px < w; px++) {
      const x = (px - centerX) / scale;
      if (n < 0 && x === 0) continue;
      if (x < 0 && n % 1 !== 0) continue;
      const y = Math.pow(x, n);
      if (!isFinite(y) || Math.abs(y) > 10) continue;
      const py = centerY - y * scale;
      if (px === 0) ctx.moveTo(px, py);
      else ctx.lineTo(px, py);
    }
    ctx.stroke();

    // Draw reference y=x line
    ctx.strokeStyle = '#d1d5db';
    ctx.lineWidth = 1;
    ctx.setLineDash([4, 4]);
    ctx.beginPath();
    ctx.moveTo(0, centerY + scale);
    ctx.lineTo(w, centerY - scale);
    ctx.stroke();
    ctx.setLineDash([]);

    // Draw point (1,1)
    ctx.fillStyle = '#8b5cf6';
    ctx.beginPath();
    ctx.arc(centerX + scale, centerY - scale, 4, 0, 2 * Math.PI);
    ctx.fill();

    // Legend
    ctx.font = 'bold 12px sans-serif';
    ctx.fillStyle = '#8b5cf6';
    ctx.fillText(`y = x^${n.toFixed(1)}`, 15, 20);
  }, [params]);

  const drawQuadratic = useCallback((ctx: CanvasRenderingContext2D, w: number, h: number, scale: number) => {
    const a = params.a || 1;
    const b = params.b || 0;
    const c = params.c || 0;
    const centerX = w / 2;
    const centerY = h / 2;

    // Draw y = ax^2 + bx + c
    ctx.strokeStyle = '#f59e0b';
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    for (let px = 0; px < w; px++) {
      const x = (px - centerX) / scale;
      const y = a * x * x + b * x + c;
      if (!isFinite(y) || Math.abs(y) > 15) continue;
      const py = centerY - y * scale;
      if (px === 0) ctx.moveTo(px, py);
      else ctx.lineTo(px, py);
    }
    ctx.stroke();

    // Draw vertex
    if (a !== 0) {
      const vx = -b / (2 * a);
      const vy = a * vx * vx + b * vx + c;
      const vpx = centerX + vx * scale;
      const vpy = centerY - vy * scale;
      if (vpx >= 0 && vpx <= w && vpy >= 0 && vpy <= h) {
        ctx.fillStyle = '#f59e0b';
        ctx.beginPath();
        ctx.arc(vpx, vpy, 5, 0, 2 * Math.PI);
        ctx.fill();

        // Vertex annotation
        ctx.font = '11px sans-serif';
        ctx.fillStyle = '#6b7280';
        ctx.fillText(`顶点(${vx.toFixed(1)}, ${vy.toFixed(1)})`, vpx + 10, vpy - 10);
      }

      // Axis of symmetry
      ctx.strokeStyle = '#fcd34d';
      ctx.lineWidth = 1;
      ctx.setLineDash([4, 4]);
      ctx.beginPath();
      ctx.moveTo(vpx, 0);
      ctx.lineTo(vpx, h);
      ctx.stroke();
      ctx.setLineDash([]);
    }

    // Legend
    ctx.font = 'bold 12px sans-serif';
    ctx.fillStyle = '#f59e0b';
    const bSign = b >= 0 ? '+' : '';
    const cSign = c >= 0 ? '+' : '';
    ctx.fillText(`y = ${a}x² ${bSign}${b}x ${cSign}${c}`, 15, 20);
  }, [params]);

  const drawEllipse = useCallback((ctx: CanvasRenderingContext2D, w: number, h: number, scale: number) => {
    const a = params.a || 3;
    const b = params.b || 2;
    const centerX = w / 2;
    const centerY = h / 2;

    // Draw ellipse
    ctx.strokeStyle = '#3b82f6';
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    ctx.ellipse(centerX, centerY, a * scale, b * scale, 0, 0, 2 * Math.PI);
    ctx.stroke();

    // Fill lightly
    ctx.fillStyle = 'rgba(59, 130, 246, 0.08)';
    ctx.fill();

    // Draw foci
    const c = Math.sqrt(Math.abs(a * a - b * b));
    if (a > b) {
      ctx.fillStyle = '#ef4444';
      ctx.beginPath();
      ctx.arc(centerX - c * scale, centerY, 4, 0, 2 * Math.PI);
      ctx.fill();
      ctx.beginPath();
      ctx.arc(centerX + c * scale, centerY, 4, 0, 2 * Math.PI);
      ctx.fill();
    } else {
      ctx.fillStyle = '#ef4444';
      ctx.beginPath();
      ctx.arc(centerX, centerY - c * scale, 4, 0, 2 * Math.PI);
      ctx.fill();
      ctx.beginPath();
      ctx.arc(centerX, centerY + c * scale, 4, 0, 2 * Math.PI);
      ctx.fill();
    }

    // Draw axes
    ctx.strokeStyle = '#93c5fd';
    ctx.lineWidth = 1;
    ctx.setLineDash([4, 4]);
    // Major axis
    if (a >= b) {
      ctx.beginPath();
      ctx.moveTo(centerX - a * scale, centerY);
      ctx.lineTo(centerX + a * scale, centerY);
      ctx.stroke();
    } else {
      ctx.beginPath();
      ctx.moveTo(centerX, centerY - b * scale);
      ctx.lineTo(centerX, centerY + b * scale);
      ctx.stroke();
    }
    ctx.setLineDash([]);

    // Legend
    ctx.font = 'bold 12px sans-serif';
    ctx.fillStyle = '#3b82f6';
    ctx.fillText(`x²/${(a*a).toFixed(1)} + y²/${(b*b).toFixed(1)} = 1`, 15, 20);
    ctx.fillStyle = '#6b7280';
    ctx.font = '11px sans-serif';
    const e = c / Math.max(a, b);
    ctx.fillText(`e = ${e.toFixed(2)}`, 15, 38);
    ctx.fillText(`c = ${c.toFixed(2)}`, 15, 54);
  }, [params]);

  const drawHyperbola = useCallback((ctx: CanvasRenderingContext2D, w: number, h: number, scale: number) => {
    const a = params.a || 2;
    const b = params.b || 1.5;
    const centerX = w / 2;
    const centerY = h / 2;

    // Draw right branch
    ctx.strokeStyle = '#10b981';
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    for (let px = centerX + a * scale; px < w; px += 0.5) {
      const x = (px - centerX) / scale;
      const y = b * Math.sqrt(x * x / (a * a) - 1);
      const py1 = centerY - y * scale;
      if (px === centerX + a * scale) {
        ctx.moveTo(px, py1);
      } else {
        ctx.lineTo(px, py1);
      }
    }
    ctx.stroke();

    // Draw right branch lower
    ctx.beginPath();
    for (let px = centerX + a * scale; px < w; px += 0.5) {
      const x = (px - centerX) / scale;
      const y = b * Math.sqrt(x * x / (a * a) - 1);
      const py2 = centerY + y * scale;
      if (px === centerX + a * scale) {
        ctx.moveTo(px, py2);
      } else {
        ctx.lineTo(px, py2);
      }
    }
    ctx.stroke();

    // Draw left branch upper
    ctx.beginPath();
    for (let px = 0; px < centerX - a * scale; px += 0.5) {
      const x = (px - centerX) / scale;
      const y = b * Math.sqrt(x * x / (a * a) - 1);
      const py1 = centerY - y * scale;
      if (px === 0) {
        ctx.moveTo(px, py1);
      } else {
        ctx.lineTo(px, py1);
      }
    }
    ctx.stroke();

    // Draw left branch lower
    ctx.beginPath();
    for (let px = 0; px < centerX - a * scale; px += 0.5) {
      const x = (px - centerX) / scale;
      const y = b * Math.sqrt(x * x / (a * a) - 1);
      const py2 = centerY + y * scale;
      if (px === 0) {
        ctx.moveTo(px, py2);
      } else {
        ctx.lineTo(px, py2);
      }
    }
    ctx.stroke();

    // Draw asymptotes
    ctx.strokeStyle = '#fca5a5';
    ctx.lineWidth = 1;
    ctx.setLineDash([6, 4]);
    ctx.beginPath();
    ctx.moveTo(0, centerY + (b / a) * centerX);
    ctx.lineTo(w, centerY - (b / a) * (w - centerX));
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(0, centerY - (b / a) * centerX);
    ctx.lineTo(w, centerY + (b / a) * (w - centerX));
    ctx.stroke();
    ctx.setLineDash([]);

    // Draw vertices
    ctx.fillStyle = '#10b981';
    ctx.beginPath();
    ctx.arc(centerX + a * scale, centerY, 4, 0, 2 * Math.PI);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(centerX - a * scale, centerY, 4, 0, 2 * Math.PI);
    ctx.fill();

    // Legend
    ctx.font = 'bold 12px sans-serif';
    ctx.fillStyle = '#10b981';
    ctx.fillText(`x²/${(a*a).toFixed(1)} - y²/${(b*b).toFixed(1)} = 1`, 15, 20);
    const c = Math.sqrt(a * a + b * b);
    const e = c / a;
    ctx.fillStyle = '#6b7280';
    ctx.font = '11px sans-serif';
    ctx.fillText(`e = ${e.toFixed(2)}`, 15, 38);
  }, [params]);

  const drawParabola = useCallback((ctx: CanvasRenderingContext2D, w: number, h: number, scale: number) => {
    const p = params.p || 2;
    const centerX = w / 2;
    const centerY = h / 2;

    // Draw y^2 = 2px (opens right) — single pass covers both branches
    ctx.strokeStyle = '#8b5cf6';
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    let started = false;
    for (let py = 0; py < h; py++) {
      const y = (centerY - py) / scale;
      if (p === 0) continue;
      const x = y * y / (2 * p);
      const px = centerX + x * scale;
      if (px >= w) {
        started = false;
        continue;
      }
      if (!started) {
        ctx.moveTo(px, py);
        started = true;
      } else {
        ctx.lineTo(px, py);
      }
    }
    ctx.stroke();

    // Draw focus
    ctx.fillStyle = '#ef4444';
    ctx.beginPath();
    ctx.arc(centerX + p * scale / 2, centerY, 4, 0, 2 * Math.PI);
    ctx.fill();

    // Draw directrix
    ctx.strokeStyle = '#fca5a5';
    ctx.lineWidth = 1;
    ctx.setLineDash([6, 4]);
    ctx.beginPath();
    ctx.moveTo(centerX - p * scale / 2, 0);
    ctx.lineTo(centerX - p * scale / 2, h);
    ctx.stroke();
    ctx.setLineDash([]);

    // Legend
    ctx.font = 'bold 12px sans-serif';
    ctx.fillStyle = '#8b5cf6';
    ctx.fillText(`y² = ${(2*p).toFixed(1)}x`, 15, 20);
    ctx.fillStyle = '#6b7280';
    ctx.font = '11px sans-serif';
    ctx.fillText(`焦点: (${(p/2).toFixed(1)}, 0)`, 15, 38);
    ctx.fillText(`准线: x = ${(-p/2).toFixed(1)}`, 15, 54);
  }, [params]);

  const drawSequence = useCallback((ctx: CanvasRenderingContext2D, w: number, h: number, scale: number, type: string) => {
    const centerX = w / 2;
    const centerY = h / 2;

    const a1 = params.a1 || 1;
    const d = params.d || 1;
    const q = params.q || 2;

    const barWidth = scale * 0.4;
    const spacing = scale * 0.8;

    ctx.font = '10px sans-serif';

    for (let n = 1; n <= 15; n++) {
      let value: number;
      if (type === 'arithmetic') {
        value = a1 + (n - 1) * d;
      } else {
        value = a1 * Math.pow(q, n - 1);
      }

      if (!isFinite(value) || Math.abs(value) > 15) continue;

      const barHeight = value * scale;
      const x = centerX + (n - 8) * spacing;
      const y = centerY - barHeight;

      // Draw bar
      if (value >= 0) {
        ctx.fillStyle = type === 'arithmetic' ? 'rgba(59, 130, 246, 0.7)' : 'rgba(139, 92, 246, 0.7)';
        ctx.fillRect(x - barWidth / 2, y, barWidth, barHeight);
      } else {
        ctx.fillStyle = type === 'arithmetic' ? 'rgba(239, 68, 68, 0.7)' : 'rgba(249, 115, 22, 0.7)';
        ctx.fillRect(x - barWidth / 2, centerY, barWidth, Math.abs(barHeight));
      }

      // Draw n label
      ctx.fillStyle = '#6b7280';
      ctx.fillText(`n=${n}`, x - 10, centerY + 15);

      // Draw value label
      ctx.fillStyle = '#374151';
      if (value >= 0) {
        ctx.fillText(value.toFixed(1), x - 10, y - 4);
      } else {
        ctx.fillText(value.toFixed(1), x - 10, centerY + Math.abs(barHeight) + 12);
      }
    }

    // Legend
    ctx.font = 'bold 12px sans-serif';
    if (type === 'arithmetic') {
      ctx.fillStyle = '#3b82f6';
      ctx.fillText(`等差数列: a₁=${a1}, d=${d}`, 15, 20);
      ctx.fillStyle = '#6b7280';
      ctx.font = '11px sans-serif';
      ctx.fillText(`aₙ = ${a1} + (n-1)×${d}`, 15, 38);
    } else {
      ctx.fillStyle = '#8b5cf6';
      ctx.fillText(`等比数列: a₁=${a1}, q=${q}`, 15, 20);
      ctx.fillStyle = '#6b7280';
      ctx.font = '11px sans-serif';
      ctx.fillText(`aₙ = ${a1} × ${q}^(n-1)`, 15, 38);
    }
  }, [params]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size with device pixel ratio for sharp rendering
    const dpr = window.devicePixelRatio || 1;
    canvas.width = width * dpr;
    canvas.height = height * dpr;
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;
    ctx.scale(dpr, dpr);

    // Clear
    ctx.clearRect(0, 0, width, height);
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, width, height);

    const scale = 50; // pixels per unit

    // Draw grid
    drawGrid(ctx, width, height, scale);

    // Draw function based on type
    switch (graphType) {
      case 'trig':
        drawTrig(ctx, width, height, scale);
        break;
      case 'exponential':
        drawExponential(ctx, width, height, scale);
        break;
      case 'logarithm':
        drawLogarithm(ctx, width, height, scale);
        break;
      case 'power':
        drawPower(ctx, width, height, scale);
        break;
      case 'quadratic':
        drawQuadratic(ctx, width, height, scale);
        break;
      case 'conic-ellipse':
        drawEllipse(ctx, width, height, scale);
        break;
      case 'conic-hyperbola':
        drawHyperbola(ctx, width, height, scale);
        break;
      case 'conic-parabola':
        drawParabola(ctx, width, height, scale);
        break;
      case 'sequence-arithmetic':
        drawSequence(ctx, width, height, scale, 'arithmetic');
        break;
      case 'sequence-geometric':
        drawSequence(ctx, width, height, scale, 'geometric');
        break;
      default:
        // Draw a welcome message
        ctx.font = 'bold 16px sans-serif';
        ctx.fillStyle = '#6b7280';
        ctx.textAlign = 'center';
        ctx.fillText('选择一个知识点查看动态图形', width / 2, height / 2);
        ctx.textAlign = 'start';
        break;
    }
  }, [graphType, params, width, height, drawGrid, drawTrig, drawExponential, drawLogarithm, drawPower, drawQuadratic, drawEllipse, drawHyperbola, drawParabola, drawSequence]);

  return (
    <canvas
      ref={canvasRef}
      style={{
        width: `${width}px`,
        height: `${height}px`,
        borderRadius: '8px',
        border: '1px solid #e5e7eb',
      }}
    />
  );
};

export default FunctionCanvas;
