import { useRef, useEffect, useState, useCallback } from 'react';
import { Slider } from '@/components/ui/slider';
import { ChevronLeft, ChevronRight, Play, Pause, RotateCcw } from 'lucide-react';

type DerivationMode = 'cos-diff' | 'double-angle' | 'half-angle';

const W = 720;
const H = 460;

const TrigDerivationVisual: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [mode, setMode] = useState<DerivationMode>('cos-diff');

  // 角度参数
  const [alpha, setAlpha] = useState(1.0);  // ~57.3°
  const [beta, setBeta] = useState(0.5);    // ~28.6°

  // 步骤控制
  const [step, setStep] = useState(0);
  const [playing, setPlaying] = useState(false);

  // 动画进度 (0→1)
  const [animProgress, setAnimProgress] = useState(1);

  const maxSteps = mode === 'cos-diff' ? 5 : mode === 'double-angle' ? 4 : 4;

  // 自动播放
  useEffect(() => {
    if (!playing) return;
    const interval = setInterval(() => {
      setStep(s => {
        if (s >= maxSteps - 1) {
          setPlaying(false);
          return s;
        }
        return s + 1;
      });
    }, 2500);
    return () => clearInterval(interval);
  }, [playing, maxSteps]);

  // 切换模式时重置
  const switchMode = (m: DerivationMode) => {
    setMode(m);
    setStep(0);
    setPlaying(false);
  };

  // 动画过渡效果
  useEffect(() => {
    setAnimProgress(0);
    const start = Date.now();
    const duration = 600;
    const tick = () => {
      const elapsed = Date.now() - start;
      const p = Math.min(1, elapsed / duration);
      setAnimProgress(p);
      if (p < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }, [step]);

  const reset = useCallback(() => {
    setStep(0);
    setPlaying(false);
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    canvas.width = W * dpr;
    canvas.height = H * dpr;
    canvas.style.width = `${W}px`;
    canvas.style.height = `${H}px`;
    ctx.scale(dpr, dpr);

    ctx.fillStyle = '#fafafa';
    ctx.fillRect(0, 0, W, H);

    if (mode === 'cos-diff') {
      drawCosDiffDerivation(ctx, alpha, beta, step, animProgress);
    } else if (mode === 'double-angle') {
      drawDoubleAngleDerivation(ctx, alpha, step, animProgress);
    } else {
      drawHalfAngleDerivation(ctx, alpha, step, animProgress);
    }
  }, [mode, alpha, beta, step, animProgress]);

  return (
    <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-4 shadow-sm transition-colors">
      {/* 模式选择 */}
      <div className="flex gap-2 mb-3 justify-center flex-wrap">
        <button
          onClick={() => switchMode('cos-diff')}
          className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${mode === 'cos-diff' ? 'bg-blue-600 text-white' : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300'}`}
        >
          两角差余弦推导
        </button>
        <button
          onClick={() => switchMode('double-angle')}
          className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${mode === 'double-angle' ? 'bg-blue-600 text-white' : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300'}`}
        >
          二倍角公式推导
        </button>
        <button
          onClick={() => switchMode('half-angle')}
          className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${mode === 'half-angle' ? 'bg-blue-600 text-white' : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300'}`}
        >
          半角公式推导
        </button>
      </div>

      {/* 画布 */}
      <div className="flex justify-center">
        <canvas ref={canvasRef} style={{ borderRadius: '8px', border: '1px solid #e5e7eb' }} />
      </div>

      {/* 步骤控制条 */}
      <div className="mt-3 flex items-center justify-center gap-3">
        <button
          onClick={() => setStep(s => Math.max(0, s - 1))}
          disabled={step === 0}
          className="p-1.5 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 disabled:opacity-30 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>
        <button
          onClick={() => {
            if (step >= maxSteps - 1) { reset(); setPlaying(true); }
            else setPlaying(p => !p);
          }}
          className="p-1.5 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-colors"
        >
          {playing ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
        </button>
        <button
          onClick={() => setStep(s => Math.min(maxSteps - 1, s + 1))}
          disabled={step >= maxSteps - 1}
          className="p-1.5 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 disabled:opacity-30 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
        >
          <ChevronRight className="w-4 h-4" />
        </button>
        <button
          onClick={reset}
          className="p-1.5 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
        >
          <RotateCcw className="w-4 h-4" />
        </button>
        <span className="text-sm text-gray-500 dark:text-gray-400 ml-2">
          第 {step + 1} / {maxSteps} 步
        </span>
      </div>

      {/* 步骤指示器点 */}
      <div className="mt-2 flex justify-center gap-1.5">
        {Array.from({ length: maxSteps }).map((_, i) => (
          <div
            key={i}
            className={`h-2 rounded-full transition-all ${i === step ? 'w-6 bg-blue-600' : i < step ? 'w-2 bg-blue-300' : 'w-2 bg-gray-300 dark:bg-gray-700'}`}
          />
        ))}
      </div>

      {/* 参数控制 */}
      <div className="mt-4 max-w-md mx-auto space-y-3">
        {mode === 'cos-diff' && (
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-medium text-blue-700 dark:text-blue-400">
                α = {alpha.toFixed(2)} rad ({(alpha * 180 / Math.PI).toFixed(0)}°)
              </label>
              <Slider value={[alpha]} min={0.1} max={Math.PI * 0.9} step={0.05} onValueChange={(v) => setAlpha(v[0])} />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-medium text-green-700 dark:text-green-400">
                β = {beta.toFixed(2)} rad ({(beta * 180 / Math.PI).toFixed(0)}°)
              </label>
              <Slider value={[beta]} min={0.1} max={Math.PI * 0.9} step={0.05} onValueChange={(v) => setBeta(v[0])} />
            </div>
          </div>
        )}
        {mode === 'double-angle' && (
          <div className="space-y-1">
            <label className="text-xs font-medium text-purple-700 dark:text-purple-400">
              α = {alpha.toFixed(2)} rad ({(alpha * 180 / Math.PI).toFixed(0)}°)
            </label>
            <Slider value={[alpha]} min={0.1} max={Math.PI} step={0.05} onValueChange={(v) => setAlpha(v[0])} />
          </div>
        )}
        {mode === 'half-angle' && (
          <div className="space-y-1">
            <label className="text-xs font-medium text-teal-700 dark:text-teal-400">
              θ = {alpha.toFixed(2)} rad ({(alpha * 180 / Math.PI).toFixed(0)}°)
            </label>
            <Slider value={[alpha]} min={0.2} max={Math.PI * 1.5} step={0.05} onValueChange={(v) => setAlpha(v[0])} />
          </div>
        )}
      </div>
    </div>
  );
};

// ═══════════════════════════════════════════════════
// 两角差余弦公式几何推导
// 核心思想：单位圆上两点距离，用两种方法算，结果相等
// ═══════════════════════════════════════════════════
function drawCosDiffDerivation(
  ctx: CanvasRenderingContext2D,
  alpha: number,
  beta: number,
  step: number,
  progress: number
) {
  const cx = 300, cy = 230;
  const r = 150;

  // ---- 背景：坐标轴和单位圆 ----
  ctx.strokeStyle = '#e5e7eb';
  ctx.lineWidth = 0.5;
  for (let x = 0; x < W; x += 25) { ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, H); ctx.stroke(); }
  for (let y = 0; y < H; y += 25) { ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(W, y); ctx.stroke(); }

  ctx.strokeStyle = '#9ca3af';
  ctx.lineWidth = 1;
  ctx.beginPath(); ctx.moveTo(0, cy); ctx.lineTo(W, cy); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(cx, 0); ctx.lineTo(cx, H); ctx.stroke();

  // 单位圆
  ctx.strokeStyle = '#d1d5db';
  ctx.lineWidth = 1.5;
  ctx.beginPath(); ctx.arc(cx, cy, r, 0, Math.PI * 2); ctx.stroke();

  // 原点标签
  ctx.font = '12px sans-serif';
  ctx.fillStyle = '#6b7280';
  ctx.fillText('O', cx - 14, cy + 14);

  // ---- 计算关键点 ----
  // P1 = (cosα, sinα)
  const p1x = cx + r * Math.cos(alpha);
  const p1y = cy - r * Math.sin(alpha);
  // P2 = (cosβ, sinβ)
  const p2x = cx + r * Math.cos(beta);
  const p2y = cy - r * Math.sin(beta);

  // 旋转后的点：将角(α-β)旋转到标准位置
  // P1' = (cos(α-β), sin(α-β)), P2' = (1, 0)
  const diff = alpha - beta;
  const p1rx = cx + r * Math.cos(diff);
  const p1ry = cy - r * Math.sin(diff);
  const p2rx = cx + r;  // (1, 0)
  const p2ry = cy;

  // 插值：旋转动画
  const t = step >= 3 ? progress : 0;
  const easeT = t * t * (3 - 2 * t); // smoothstep

  // ---- Step 0: 标记两点 P1, P2 ----
  if (step >= 0) {
    // 角α弧线
    ctx.strokeStyle = '#3b82f6';
    ctx.lineWidth = 2;
    ctx.beginPath(); ctx.arc(cx, cy, 35, 0, -alpha); ctx.stroke();
    ctx.font = 'bold 13px sans-serif';
    ctx.fillStyle = '#3b82f6';
    ctx.fillText('α', cx + 42, cy - 15);

    // 角β弧线
    ctx.strokeStyle = '#10b981';
    ctx.lineWidth = 2;
    ctx.beginPath(); ctx.arc(cx, cy, 55, 0, -beta); ctx.stroke();
    ctx.fillStyle = '#10b981';
    ctx.fillText('β', cx + 60, cy - 30);

    // P1 点
    ctx.fillStyle = '#3b82f6';
    ctx.beginPath(); ctx.arc(p1x, p1y, 6, 0, Math.PI * 2); ctx.fill();
    ctx.font = 'bold 12px sans-serif';
    ctx.fillStyle = '#3b82f6';
    ctx.fillText('P₁(cosα, sinα)', p1x + 8, p1y - 8);

    // P2 点
    ctx.fillStyle = '#10b981';
    ctx.beginPath(); ctx.arc(p2x, p2y, 6, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = '#10b981';
    ctx.fillText('P₂(cosβ, sinβ)', p2x + 8, p2y + 16);
  }

  // ---- Step 1: 连接 P1P2，计算距离 ----
  if (step >= 1) {
    ctx.strokeStyle = '#f59e0b';
    ctx.lineWidth = 2.5;
    ctx.beginPath(); ctx.moveTo(p1x, p1y); ctx.lineTo(p2x, p2y); ctx.stroke();

    // 标注 |P1P2|
    const midX = (p1x + p2x) / 2;
    const midY = (p1y + p2y) / 2;
    ctx.font = 'bold 12px sans-serif';
    ctx.fillStyle = '#f59e0b';
    ctx.fillText('|P₁P₂|', midX + 8, midY - 4);
  }

  // ---- Step 2: 方法一——坐标距离公式 ----
  if (step >= 2) {
    // 右侧面板：坐标距离公式展开
    drawInfoPanel(ctx, 480, 20, 230, 200, '方法一：坐标距离公式', [
      '|P₁P₂|² = (cosα-cosβ)² + (sinα-sinβ)²',
      '  = cos²α - 2cosαcosβ + cos²β',
      '    + sin²α - 2sinαsinβ + sin²β',
      '  = (cos²α+sin²α) + (cos²β+sin²β)',
      '    - 2(cosαcosβ + sinαsinβ)',
      '  = 2 - 2(cosαcosβ + sinαsinβ)',
    ], '#3b82f6');
  }

  // ---- Step 3: 方法二——旋转到标准位置 ----
  if (step >= 3) {
    // 旋转后的点（带动画过渡）
    const cur_p1x = p1x + (p1rx - p1x) * easeT;
    const cur_p1y = p1y + (p1ry - p1y) * easeT;
    const cur_p2x = p2x + (p2rx - p2x) * easeT;
    const cur_p2y = p2y + (p2ry - p2y) * easeT;

    // 旋转后的弦
    ctx.strokeStyle = `rgba(239, 68, 68, ${0.3 + 0.7 * easeT})`;
    ctx.lineWidth = 2.5;
    ctx.beginPath(); ctx.moveTo(cur_p1x, cur_p1y); ctx.lineTo(cur_p2x, cur_p2y); ctx.stroke();

    // 旋转后的 P1'
    if (easeT > 0.3) {
      const opacity = (easeT - 0.3) / 0.7;
      ctx.fillStyle = `rgba(239, 68, 68, ${opacity})`;
      ctx.beginPath(); ctx.arc(cur_p1x, cur_p1y, 6, 0, Math.PI * 2); ctx.fill();
      ctx.font = 'bold 12px sans-serif';
      ctx.fillStyle = `rgba(239, 68, 68, ${opacity})`;
      ctx.fillText("P₁'(cos(α-β), sin(α-β))", cur_p1x + 8, cur_p1y - 8);

      // P2' = (1, 0)
      ctx.beginPath(); ctx.arc(cur_p2x, cur_p2y, 6, 0, Math.PI * 2); ctx.fill();
      ctx.fillText("P₂'(1, 0)", cur_p2x + 8, cur_p2y + 16);

      // 标注角 α-β
      ctx.strokeStyle = `rgba(239, 68, 68, ${opacity})`;
      ctx.lineWidth = 2;
      ctx.beginPath(); ctx.arc(cx, cy, 40, 0, -diff); ctx.stroke();
      ctx.fillText('α-β', cx + 48, cy - 18);
    }

    // 右侧面板：旋转法
    if (easeT > 0.5) {
      const opacity = Math.min(1, (easeT - 0.5) * 2);
      ctx.globalAlpha = opacity;
      drawInfoPanel(ctx, 480, 230, 230, 130, '方法二：旋转法', [
        '旋转不改变两点距离',
        "P₁' = (cos(α-β), sin(α-β))",
        "P₂' = (1, 0)",
        "|P₁'P₂'|² = [cos(α-β)-1]² + sin²(α-β)",
        '  = 2 - 2cos(α-β)',
      ], '#ef4444');
      ctx.globalAlpha = 1;
    }
  }

  // ---- Step 4: 两式相等，得出公式 ----
  if (step >= 4) {
    // 底部结论面板
    drawConclusionPanel(ctx, 20, 380, W - 40, 65,
      '两式相等：2 - 2(cosαcosβ + sinαsinβ) = 2 - 2cos(α-β)',
      '∴  cos(α - β) = cosαcosβ + sinαsinβ',
      '#8b5cf6'
    );

    // 高亮最终公式
    ctx.font = 'bold 18px sans-serif';
    ctx.fillStyle = '#8b5cf6';
    const txt = 'cos(α-β) = cosαcosβ + sinαsinβ';
    const tw = ctx.measureText(txt).width;
    ctx.fillText(txt, (W - tw) / 2, 425);
  }

  // 标题
  ctx.font = 'bold 15px sans-serif';
  ctx.fillStyle = '#374151';
  ctx.fillText('两角差余弦公式几何推导', 15, 22);

  // 步骤说明
  const stepTexts = [
    '① 在单位圆上取 P₁(cosα, sinα) 和 P₂(cosβ, sinβ)，它们到原点距离均为 1',
    '② 连接 P₁P₂，用两种方法计算 |P₁P₂|²',
    '③ 方法一：用坐标距离公式展开 |P₁P₂|²',
    '④ 方法二：旋转使角 α-β 到标准位置，距离不变',
    '⑤ 两式相等 → cos(α-β) = cosαcosβ + sinαsinβ',
  ];
  if (step < stepTexts.length) {
    ctx.font = '13px sans-serif';
    ctx.fillStyle = '#6b7280';
    ctx.fillText(stepTexts[step], 15, 45);
  }
}

// ═══════════════════════════════════════════════════
// 二倍角公式推导
// 从和角公式令 β=α 直接得到
// ═══════════════════════════════════════════════════
function drawDoubleAngleDerivation(
  ctx: CanvasRenderingContext2D,
  alpha: number,
  step: number,
  _progress: number
) {
  const cx = 280, cy = 230;
  const r = 140;

  // 背景网格
  ctx.strokeStyle = '#e5e7eb';
  ctx.lineWidth = 0.5;
  for (let x = 0; x < W; x += 25) { ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, H); ctx.stroke(); }
  for (let y = 0; y < H; y += 25) { ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(W, y); ctx.stroke(); }

  ctx.strokeStyle = '#9ca3af';
  ctx.lineWidth = 1;
  ctx.beginPath(); ctx.moveTo(0, cy); ctx.lineTo(560, cy); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(cx, 0); ctx.lineTo(cx, H); ctx.stroke();

  // 单位圆
  ctx.strokeStyle = '#d1d5db';
  ctx.lineWidth = 1.5;
  ctx.beginPath(); ctx.arc(cx, cy, r, 0, Math.PI * 2); ctx.stroke();

  ctx.font = '12px sans-serif';
  ctx.fillStyle = '#6b7280';
  ctx.fillText('O', cx - 14, cy + 14);

  // ---- Step 0: 标出角 α ----
  if (step >= 0) {
    // 角α弧线
    ctx.strokeStyle = '#8b5cf6';
    ctx.lineWidth = 2;
    ctx.beginPath(); ctx.arc(cx, cy, 30, 0, -alpha); ctx.stroke();
    ctx.font = 'bold 13px sans-serif';
    ctx.fillStyle = '#8b5cf6';
    ctx.fillText('α', cx + 36, cy - 14);

    // 终边
    const px = cx + r * Math.cos(alpha);
    const py = cy - r * Math.sin(alpha);
    ctx.strokeStyle = '#8b5cf6';
    ctx.lineWidth = 2;
    ctx.beginPath(); ctx.moveTo(cx, cy); ctx.lineTo(px, py); ctx.stroke();

    // 点 P
    ctx.fillStyle = '#8b5cf6';
    ctx.beginPath(); ctx.arc(px, py, 5, 0, Math.PI * 2); ctx.fill();
    ctx.font = 'bold 12px sans-serif';
    ctx.fillText('(cosα, sinα)', px + 8, py - 6);
  }

  // ---- Step 1: 标出角 2α ----
  if (step >= 1) {
    const twoAlpha = alpha * 2;
    const px2 = cx + r * Math.cos(twoAlpha);
    const py2 = cy - r * Math.sin(twoAlpha);

    // 角2α弧线
    ctx.strokeStyle = '#ef4444';
    ctx.lineWidth = 2;
    ctx.beginPath(); ctx.arc(cx, cy, 50, 0, -twoAlpha); ctx.stroke();
    ctx.font = 'bold 13px sans-serif';
    ctx.fillStyle = '#ef4444';
    ctx.fillText('2α', cx + 56, cy - 28);

    // 终边到 2α
    ctx.strokeStyle = '#ef4444';
    ctx.lineWidth = 2;
    ctx.beginPath(); ctx.moveTo(cx, cy); ctx.lineTo(px2, py2); ctx.stroke();

    // 点 Q
    ctx.fillStyle = '#ef4444';
    ctx.beginPath(); ctx.arc(px2, py2, 5, 0, Math.PI * 2); ctx.fill();
    ctx.font = 'bold 12px sans-serif';
    ctx.fillText('(cos2α, sin2α)', px2 + 8, py2 - 6);

    // 标注 2α = α + α
    ctx.font = 'italic 13px sans-serif';
    ctx.fillStyle = '#6b7280';
    ctx.fillText('2α = α + α', cx + r + 20, cy - r * 0.5);
  }

  // ---- Step 2: 代入和角公式 ----
  if (step >= 2) {
    drawInfoPanel(ctx, 440, 20, 265, 200, '代入和角公式', [
      '已知和角公式：',
      'sin(α+β) = sinαcosβ + cosαsinβ',
      '',
      '令 β = α：',
      'sin(α+α) = sinαcosα + cosαsinα',
      '',
      '∴  sin(2α) = 2sinαcosα',
      '',
      '同理 cos(α+β) 中令 β=α：',
      'cos(2α) = cos²α - sin²α',
      '       = 2cos²α - 1  (= 1-2sin²α)',
    ], '#3b82f6');
  }

  // ---- Step 3: 数值验证 ----
  if (step >= 3) {
    const twoAlpha = alpha * 2;
    const sin2a = Math.sin(twoAlpha);
    const rhs_sin = 2 * Math.sin(alpha) * Math.cos(alpha);
    const cos2a = Math.cos(twoAlpha);
    const rhs_cos = Math.cos(alpha) ** 2 - Math.sin(alpha) ** 2;

    drawInfoPanel(ctx, 440, 235, 265, 145, '数值验证', [
      `α = ${alpha.toFixed(3)} rad (${(alpha * 180 / Math.PI).toFixed(1)}°)`,
      '',
      `sin(2α)  = ${sin2a.toFixed(6)}`,
      `2sinαcosα = ${rhs_sin.toFixed(6)}  ${Math.abs(sin2a - rhs_sin) < 1e-10 ? '✓' : '✗'}`,
      '',
      `cos(2α)        = ${cos2a.toFixed(6)}`,
      `cos²α - sin²α = ${rhs_cos.toFixed(6)}  ${Math.abs(cos2a - rhs_cos) < 1e-10 ? '✓' : '✗'}`,
    ], '#10b981');

    // 底部结论
    drawConclusionPanel(ctx, 20, 400, W - 40, 45,
      '',
      '二倍角公式：sin(2α) = 2sinαcosα,  cos(2α) = cos²α - sin²α = 2cos²α - 1',
      '#8b5cf6'
    );
  }

  // 标题
  ctx.font = 'bold 15px sans-serif';
  ctx.fillStyle = '#374151';
  ctx.fillText('二倍角公式推导', 15, 22);

  const stepTexts = [
    '① 在单位圆上标出角 α 及其终边上的点 (cosα, sinα)',
    '② 标出角 2α = α + α，注意 2α 恰好是 α 的两倍',
    '③ 在和角公式中令 β = α，展开即得二倍角公式',
    '④ 数值验证：左右两边完全相等',
  ];
  if (step < stepTexts.length) {
    ctx.font = '13px sans-serif';
    ctx.fillStyle = '#6b7280';
    ctx.fillText(stepTexts[step], 15, 45);
  }
}

// ═══════════════════════════════════════════════════
// 半角公式推导
// 从余弦二倍角公式 cos(2θ) = 2cos²θ - 1 反解
// ═══════════════════════════════════════════════════
function drawHalfAngleDerivation(
  ctx: CanvasRenderingContext2D,
  theta: number,
  step: number,
  _progress: number
) {
  const cx = 280, cy = 230;
  const r = 140;

  // 背景网格
  ctx.strokeStyle = '#e5e7eb';
  ctx.lineWidth = 0.5;
  for (let x = 0; x < W; x += 25) { ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, H); ctx.stroke(); }
  for (let y = 0; y < H; y += 25) { ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(W, y); ctx.stroke(); }

  ctx.strokeStyle = '#9ca3af';
  ctx.lineWidth = 1;
  ctx.beginPath(); ctx.moveTo(0, cy); ctx.lineTo(560, cy); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(cx, 0); ctx.lineTo(cx, H); ctx.stroke();

  // 单位圆
  ctx.strokeStyle = '#d1d5db';
  ctx.lineWidth = 1.5;
  ctx.beginPath(); ctx.arc(cx, cy, r, 0, Math.PI * 2); ctx.stroke();

  ctx.font = '12px sans-serif';
  ctx.fillStyle = '#6b7280';
  ctx.fillText('O', cx - 14, cy + 14);

  const halfTheta = theta / 2;

  // ---- Step 0: 标出角 θ ----
  if (step >= 0) {
    // 角θ弧线
    ctx.strokeStyle = '#0d9488';
    ctx.lineWidth = 2;
    ctx.beginPath(); ctx.arc(cx, cy, 55, 0, -theta); ctx.stroke();
    ctx.font = 'bold 14px sans-serif';
    ctx.fillStyle = '#0d9488';
    ctx.fillText('θ', cx + 62, cy - 30);

    // 终边
    const ptx = cx + r * Math.cos(theta);
    const pty = cy - r * Math.sin(theta);
    ctx.strokeStyle = '#0d9488';
    ctx.lineWidth = 2;
    ctx.beginPath(); ctx.moveTo(cx, cy); ctx.lineTo(ptx, pty); ctx.stroke();

    // 点 Pθ
    ctx.fillStyle = '#0d9488';
    ctx.beginPath(); ctx.arc(ptx, pty, 5, 0, Math.PI * 2); ctx.fill();
    ctx.font = 'bold 12px sans-serif';
    ctx.fillText('(cosθ, sinθ)', ptx + 8, pty - 6);
  }

  // ---- Step 1: 标出角 θ/2 ----
  if (step >= 1) {
    // 角θ/2弧线
    ctx.strokeStyle = '#f59e0b';
    ctx.lineWidth = 2;
    ctx.beginPath(); ctx.arc(cx, cy, 32, 0, -halfTheta); ctx.stroke();
    ctx.font = 'bold 13px sans-serif';
    ctx.fillStyle = '#f59e0b';
    ctx.fillText('θ/2', cx + 38, cy - 16);

    // 终边
    const phx = cx + r * Math.cos(halfTheta);
    const phy = cy - r * Math.sin(halfTheta);
    ctx.strokeStyle = '#f59e0b';
    ctx.lineWidth = 2;
    ctx.beginPath(); ctx.moveTo(cx, cy); ctx.lineTo(phx, phy); ctx.stroke();

    // 点 Pθ/2
    ctx.fillStyle = '#f59e0b';
    ctx.beginPath(); ctx.arc(phx, phy, 5, 0, Math.PI * 2); ctx.fill();
    ctx.font = 'bold 12px sans-serif';
    ctx.fillText('(cos(θ/2), sin(θ/2))', phx + 8, phy - 6);

    // 标注 θ = 2 × (θ/2)
    ctx.font = 'italic 13px sans-serif';
    ctx.fillStyle = '#6b7280';
    ctx.fillText('θ = 2 × (θ/2)', cx + r + 20, cy - r * 0.4);
  }

  // ---- Step 2: 代入二倍角公式反解 ----
  if (step >= 2) {
    drawInfoPanel(ctx, 440, 20, 265, 215, '从二倍角公式反解', [
      '余弦二倍角公式：',
      'cos(2φ) = 2cos²φ - 1  ···(A)',
      'cos(2φ) = 1 - 2sin²φ  ···(B)',
      '',
      '令 φ = θ/2，则 2φ = θ：',
      'cosθ = 2cos²(θ/2) - 1',
      '→ cos²(θ/2) = (1 + cosθ) / 2',
      '→ cos(θ/2) = ±√[(1+cosθ)/2]',
      '',
      'cosθ = 1 - 2sin²(θ/2)',
      '→ sin²(θ/2) = (1 - cosθ) / 2',
      '→ sin(θ/2) = ±√[(1-cosθ)/2]',
    ], '#3b82f6');
  }

  // ---- Step 3: 数值验证 ----
  if (step >= 3) {
    const cosHalf = Math.cos(halfTheta);
    const sinHalf = Math.sin(halfTheta);
    const rhsCos = Math.sqrt((1 + Math.cos(theta)) / 2);
    const rhsSin = Math.sqrt((1 - Math.cos(theta)) / 2);

    drawInfoPanel(ctx, 440, 250, 265, 130, '数值验证', [
      `θ = ${theta.toFixed(3)} rad (${(theta * 180 / Math.PI).toFixed(1)}°)`,
      `θ/2 = ${halfTheta.toFixed(3)} rad (${(halfTheta * 180 / Math.PI).toFixed(1)}°)`,
      '',
      `cos(θ/2)           = ${cosHalf.toFixed(6)}`,
      `√[(1+cosθ)/2] = ${rhsCos.toFixed(6)}  ${Math.abs(cosHalf - rhsCos) < 1e-10 ? '✓' : '✗'}`,
      '',
      `sin(θ/2)           = ${sinHalf.toFixed(6)}`,
      `√[(1-cosθ)/2] = ${rhsSin.toFixed(6)}  ${Math.abs(sinHalf - rhsSin) < 1e-10 ? '✓' : '✗'}`,
    ], '#10b981');

    drawConclusionPanel(ctx, 20, 400, W - 40, 45,
      '',
      '半角公式：cos(θ/2) = ±√[(1+cosθ)/2],  sin(θ/2) = ±√[(1-cosθ)/2]  (符号由象限决定)',
      '#8b5cf6'
    );
  }

  // 标题
  ctx.font = 'bold 15px sans-serif';
  ctx.fillStyle = '#374151';
  ctx.fillText('半角公式推导', 15, 22);

  const stepTexts = [
    '① 在单位圆上标出角 θ',
    '② 标出角 θ/2，注意 θ = 2 × (θ/2)',
    '③ 在余弦二倍角公式中令 φ = θ/2，反解出 cos(θ/2) 和 sin(θ/2)',
    '④ 数值验证：公式计算值与实际值完全吻合',
  ];
  if (step < stepTexts.length) {
    ctx.font = '13px sans-serif';
    ctx.fillStyle = '#6b7280';
    ctx.fillText(stepTexts[step], 15, 45);
  }
}

// ═══════════════════════════════════════════════════
// 辅助绘图函数
// ═══════════════════════════════════════════════════
function drawInfoPanel(
  ctx: CanvasRenderingContext2D,
  x: number, y: number, w: number, h: number,
  title: string,
  lines: string[],
  accentColor: string
) {
  // 背景
  ctx.fillStyle = 'rgba(249, 250, 251, 0.95)';
  ctx.strokeStyle = accentColor;
  ctx.lineWidth = 1.5;
  roundRect(ctx, x, y, w, h, 8);
  ctx.fill();
  ctx.stroke();

  // 标题栏
  ctx.fillStyle = accentColor;
  ctx.fillRect(x, y, w, 28);
  ctx.font = 'bold 13px sans-serif';
  ctx.fillStyle = '#fff';
  ctx.fillText(title, x + 10, y + 19);

  // 内容
  ctx.font = '12px monospace';
  ctx.fillStyle = '#374151';
  lines.forEach((line, i) => {
    ctx.fillText(line, x + 10, y + 44 + i * 16);
  });
}

function drawConclusionPanel(
  ctx: CanvasRenderingContext2D,
  x: number, y: number, w: number, h: number,
  subtitle: string,
  conclusion: string,
  accentColor: string
) {
  ctx.fillStyle = 'rgba(245, 243, 255, 0.95)';
  ctx.strokeStyle = accentColor;
  ctx.lineWidth = 2;
  roundRect(ctx, x, y, w, h, 10);
  ctx.fill();
  ctx.stroke();

  if (subtitle) {
    ctx.font = '12px sans-serif';
    ctx.fillStyle = '#6b7280';
    ctx.fillText(subtitle, x + 15, y + 22);
  }

  ctx.font = 'bold 15px sans-serif';
  ctx.fillStyle = accentColor;
  ctx.fillText(conclusion, x + 15, y + (subtitle ? 45 : 30));
}

function roundRect(
  ctx: CanvasRenderingContext2D,
  x: number, y: number, w: number, h: number,
  radius: number
) {
  ctx.beginPath();
  ctx.moveTo(x + radius, y);
  ctx.lineTo(x + w - radius, y);
  ctx.quadraticCurveTo(x + w, y, x + w, y + radius);
  ctx.lineTo(x + w, y + h - radius);
  ctx.quadraticCurveTo(x + w, y + h, x + w - radius, y + h);
  ctx.lineTo(x + radius, y + h);
  ctx.quadraticCurveTo(x, y + h, x, y + h - radius);
  ctx.lineTo(x, y + radius);
  ctx.quadraticCurveTo(x, y, x + radius, y);
  ctx.closePath();
}

export default TrigDerivationVisual;
