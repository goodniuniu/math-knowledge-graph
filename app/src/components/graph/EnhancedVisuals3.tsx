import React, { useState, useMemo } from 'react';
import { VW, VH, P, sx, sy, curve, paramCurve, PlotFrame, PSlider, Scenario, Insight } from './EnhancedVisualsShared';

// ============================================================
// 11. UnitCircleExplorer (node 19 - 任意角三角函数)
//     "单位圆探索器"：在单位圆上拖动角度，实时显示 sin/cos/tan
// ============================================================
export const UnitCircleExplorer: React.FC = () => {
  const [angle, setAngle] = useState(45);
  const [showTan, setShowTan] = useState(false);

  const rad = (angle * Math.PI) / 180;
  const cos = Math.cos(rad);
  const sin = Math.sin(rad);
  const tan = isFinite(Math.tan(rad)) ? Math.tan(rad) : 0;

  // Unit circle parameters
  const cx = 80, cy = 140, r = 60;
  const px = cx + r * cos;
  const py = cy - r * sin;

  // Graph parameters
  const xMin = -2 * Math.PI, xMax = 2 * Math.PI, yMin = -2, yMax = 2;

  return (
    <div className="space-y-3">
      <PSlider label="角度 θ" value={angle} min={-360} max={360} step={5} onChange={setAngle} fmt={v => `${v}° (${((v * Math.PI) / 180).toFixed(2)} rad)`} />

      <div className="flex gap-3">
        {/* Unit circle */}
        <svg viewBox="0 0 160 240" className="w-2/5 bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800">
          {/* Circle */}
          <circle cx={cx} cy={cy} r={r} className="fill-none stroke-gray-300 dark:stroke-gray-600" strokeWidth={1.5} />
          {/* Axes */}
          <line x1={cx - r - 10} y1={cy} x2={cx + r + 10} y2={cy} className="stroke-gray-400 dark:stroke-gray-500" strokeWidth={1} />
          <line x1={cx} y1={cy - r - 10} x2={cx} y2={cy + r + 10} className="stroke-gray-400 dark:stroke-gray-500" strokeWidth={1} />
          {/* Angle arc */}
          <path d={`M ${cx + 20} ${cy} A 20 20 0 ${angle < 0 ? 0 : 1} 1 ${cx + 20 * cos} ${cy - 20 * sin}`} className="fill-amber-200/40 dark:fill-amber-700/30 stroke-amber-400" strokeWidth={1} fill={angle < 0 ? 'none' : 'rgba(251,191,36,0.2)'} />
          {/* Radius line */}
          <line x1={cx} y1={cy} x2={px} y2={py} className="stroke-purple-500" strokeWidth={2} />
          {/* cos projection */}
          <line x1={cx} y1={cy} x2={px} y2={cy} className="stroke-blue-500" strokeWidth={2.5} />
          {/* sin projection */}
          <line x1={px} y1={cy} x2={px} y2={py} className="stroke-red-500" strokeWidth={2.5} />
          {/* tan line */}
          {showTan && Math.abs(cos) > 0.01 && (
            <>
              <line x1={cx + r} y1={cy} x2={cx + r} y2={cy - r * tan} className="stroke-green-500" strokeWidth={2} strokeDasharray="3 2" />
              <line x1={px} y1={py} x2={cx + r} y2={cy - r * tan} className="stroke-green-400" strokeWidth={1} strokeDasharray="2 2" />
            </>
          )}
          {/* Point */}
          <circle cx={px} cy={py} r={5} className="fill-purple-500" />
          {/* Labels */}
          <text x={px + 4} y={py - 6} className="fill-purple-600 dark:fill-purple-400" fontSize={9} fontWeight="bold">P</text>
          <text x={(cx + px) / 2 - 8} y={cy + 14} className="fill-blue-600 dark:fill-blue-400" fontSize={8}>cos</text>
          <text x={px + 4} y={(cy + py) / 2} className="fill-red-600 dark:fill-red-400" fontSize={8}>sin</text>
          {/* Quadrant labels */}
          <text x={cx + r * 0.7} y={cy - r * 0.7} className="fill-gray-300 dark:fill-gray-600" fontSize={8}>Ⅰ</text>
          <text x={cx - r * 0.7 - 6} y={cy - r * 0.7} className="fill-gray-300 dark:fill-gray-600" fontSize={8}>Ⅱ</text>
          <text x={cx - r * 0.7 - 6} y={cy + r * 0.7 + 8} className="fill-gray-300 dark:fill-gray-600" fontSize={8}>Ⅲ</text>
          <text x={cx + r * 0.7} y={cy + r * 0.7 + 8} className="fill-gray-300 dark:fill-gray-600" fontSize={8}>Ⅳ</text>
        </svg>

        {/* Graphs */}
        <svg viewBox={`0 0 ${VW} ${VH}`} className="flex-1 bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800">
          <PlotFrame xMin={xMin} xMax={xMax} yMin={yMin} yMax={yMax} step={Math.PI / 2} />
          {/* sin curve */}
          <path d={curve(x => Math.sin(x), xMin, xMax, yMin, yMax)} className="stroke-red-500" strokeWidth={2} fill="none" />
          {/* cos curve */}
          <path d={curve(x => Math.cos(x), xMin, xMax, yMin, yMax)} className="stroke-blue-500" strokeWidth={2} fill="none" />
          {/* Current angle vertical line */}
          <line x1={sx(rad, xMin, xMax)} y1={sy(yMin, yMin, yMax)} x2={sx(rad, xMin, xMax)} y2={sy(yMax, yMin, yMax)} className="stroke-purple-400" strokeWidth={1} strokeDasharray="3 2" />
          {/* Points on curves */}
          <circle cx={sx(rad, xMin, xMax)} cy={sy(sin, yMin, yMax)} r={4} className="fill-red-500" />
          <circle cx={sx(rad, xMin, xMax)} cy={sy(cos, yMin, yMax)} r={4} className="fill-blue-500" />
          {/* Tick labels for π */}
          {[-2, -1, 1, 2].map(n => (
            <text key={n} x={sx(n * Math.PI, xMin, xMax)} y={sy(yMin, yMin, yMax) + 22} textAnchor="middle" className="fill-gray-500 dark:fill-gray-400" fontSize={8}>{n < 0 ? `${n}π` : `${n}π`}</text>
          ))}
        </svg>
      </div>

      <div className="grid grid-cols-3 gap-2 text-center">
        <div className="p-2 rounded-lg bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800">
          <div className="text-xs text-gray-500 dark:text-gray-400">cos(θ)</div>
          <div className="text-sm font-bold text-blue-600 dark:text-blue-400">{cos.toFixed(3)}</div>
        </div>
        <div className="p-2 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800">
          <div className="text-xs text-gray-500 dark:text-gray-400">sin(θ)</div>
          <div className="text-sm font-bold text-red-600 dark:text-red-400">{sin.toFixed(3)}</div>
        </div>
        <div className="p-2 rounded-lg bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800">
          <div className="text-xs text-gray-500 dark:text-gray-400">tan(θ)</div>
          <div className="text-sm font-bold text-green-600 dark:text-green-400">{Math.abs(cos) < 0.01 ? '∞' : tan.toFixed(3)}</div>
        </div>
      </div>

      <button onClick={() => setShowTan(!showTan)} className={`px-3 py-1 text-xs rounded-lg transition-colors ${showTan ? 'bg-green-500 text-white' : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400'}`}>{showTan ? '隐藏' : '显示'}正切线</button>
      <Insight>蓝线（cos）是 x 坐标，红线（sin）是 y 坐标。当角度转到 90° 或 270° 时，cos=0，tan 趋向无穷大！</Insight>
    </div>
  );
};

// ============================================================
// 12. SymmetryMagic (node 20 - 三角函数性质)
//     "对称魔法"：展示三角函数的奇偶性、周期性、单调性
// ============================================================
export const SymmetryMagic: React.FC = () => {
  const [fnType, setFnType] = useState<'sin' | 'cos' | 'tan'>('sin');
  const [phase, setPhase] = useState(0);
  const [showMirror, setShowMirror] = useState(true);

  const fns = useMemo(() => {
    switch (fnType) {
      case 'sin': return { f: (x: number) => Math.sin(x + phase), period: 2 * Math.PI, isOdd: true, isEven: false, label: 'sin(x)' };
      case 'cos': return { f: (x: number) => Math.cos(x + phase), period: 2 * Math.PI, isOdd: false, isEven: true, label: 'cos(x)' };
      case 'tan': return { f: (x: number) => { const v = Math.tan(x + phase); return Math.abs(v) > 10 ? NaN : v; }, period: Math.PI, isOdd: true, isEven: false, label: 'tan(x)' };
    }
  }, [fnType, phase]);

  const xMin = -2 * Math.PI, xMax = 2 * Math.PI, yMin = -2.5, yMax = 2.5;
  const mainPath = curve(fns.f, xMin, xMax, yMin, yMax, 300);
  const mirrorPath = curve(x => fns.f(-x), xMin, xMax, yMin, yMax, 300);

  return (
    <div className="space-y-3">
      <div className="flex gap-2">
        {(['sin', 'cos', 'tan'] as const).map(k => (
          <button key={k} onClick={() => setFnType(k)} className={`px-3 py-1 text-xs rounded-lg transition-colors ${fnType === k ? 'bg-pink-500 text-white' : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400'}`}>{k}</button>
        ))}
      </div>
      <PSlider label="相位 φ" value={phase} min={-Math.PI} max={Math.PI} step={0.1} onChange={setPhase} fmt={v => v.toFixed(2)} />

      <svg viewBox={`0 0 ${VW} ${VH}`} className="w-full bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800">
        <PlotFrame xMin={xMin} xMax={xMax} yMin={yMin} yMax={yMax} step={Math.PI / 2} />
        {/* Period markers */}
        {[-2, -1, 0, 1, 2].map(n => (
          <line key={n} x1={sx(n * fns.period, xMin, xMax)} y1={sy(yMin, yMin, yMax)} x2={sx(n * fns.period, xMin, xMax)} y2={sy(yMax, yMin, yMax)} className="stroke-amber-200 dark:stroke-amber-800" strokeWidth={0.5} strokeDasharray="2 4" />
        ))}
        {/* Mirror */}
        {showMirror && <path d={mirrorPath} className="stroke-gray-300 dark:stroke-gray-600" strokeWidth={1.5} strokeDasharray="4 3" fill="none" />}
        {/* Main curve */}
        <path d={mainPath} className="stroke-pink-500" strokeWidth={2.5} fill="none" />
        {/* y-axis */}
        <line x1={sx(0, xMin, xMax)} y1={sy(yMin, yMin, yMax)} x2={sx(0, xMin, xMax)} y2={sy(yMax, yMin, yMax)} className="stroke-purple-400" strokeWidth={1.5} strokeDasharray="3 2" />
      </svg>

      <div className="flex gap-2 flex-wrap">
        <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${fns.isOdd ? 'bg-purple-100 dark:bg-purple-900/40 text-purple-700 dark:text-purple-300' : 'bg-gray-100 dark:bg-gray-800 text-gray-500'}`}>
          {fns.isOdd ? '⚑ 奇函数（原点对称）' : '— 非奇'}
        </span>
        <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${fns.isEven && phase === 0 ? 'bg-pink-100 dark:bg-pink-900/40 text-pink-700 dark:text-pink-300' : 'bg-gray-100 dark:bg-gray-800 text-gray-500'}`}>
          {fns.isEven && phase === 0 ? '☺ 偶函数（y轴对称）' : '— 非偶'}
        </span>
        <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-amber-100 dark:bg-amber-900/40 text-amber-700 dark:text-amber-300">
          ⟳ 周期 = {(fns.period / Math.PI).toFixed(1)}π
        </span>
      </div>

      <button onClick={() => setShowMirror(!showMirror)} className="px-3 py-1 text-xs rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors">{showMirror ? '隐藏' : '显示'}镜像 f(-x)</button>
      <Insight>当镜像（虚线）与原曲线重合 → 偶函数；关于原点旋转 180° 重合 → 奇函数。加相位后，奇偶性可能改变！</Insight>
    </div>
  );
};

// ============================================================
// 13. FivePointDrawing (node 21 - 三角函数图像)
//     "五点作图法"：展示五点法画正弦曲线的过程
// ============================================================
export const FivePointDrawing: React.FC = () => {
  const [fnType, setFnType] = useState<'sin' | 'cos'>('sin');
  const [A, setA] = useState(1);
  const [omega, setOmega] = useState(1);
  const [showAll, setShowAll] = useState(true);

  const fn = (x: number) => A * (fnType === 'sin' ? Math.sin(omega * x) : Math.cos(omega * x));
  const xMin = 0, xMax = 2 * Math.PI, yMin = -2.5, yMax = 2.5;
  const path = curve(fn, xMin, xMax, yMin, yMax);

  // Five key points: 0, π/2, π, 3π/2, 2π
  const fiveX = [0, Math.PI / 2, Math.PI, 3 * Math.PI / 2, 2 * Math.PI];
  const fiveY = fiveX.map(x => fn(x));

  return (
    <div className="space-y-3">
      <div className="flex gap-2">
        {(['sin', 'cos'] as const).map(k => (
          <button key={k} onClick={() => setFnType(k)} className={`px-3 py-1 text-xs rounded-lg transition-colors ${fnType === k ? 'bg-indigo-500 text-white' : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400'}`}>{k}</button>
        ))}
      </div>
      <div className="grid grid-cols-2 gap-2">
        <PSlider label="振幅 A" value={A} min={0.5} max={2} step={0.1} onChange={setA} />
        <PSlider label="频率 ω" value={omega} min={0.5} max={3} step={0.1} onChange={setOmega} />
      </div>

      <svg viewBox={`0 0 ${VW} ${VH}`} className="w-full bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800">
        <PlotFrame xMin={xMin} xMax={xMax} yMin={yMin} yMax={yMax} step={Math.PI / 2} />
        {/* Grid lines at five points */}
        {fiveX.map((x, i) => (
          <line key={i} x1={sx(x, xMin, xMax)} y1={sy(yMin, yMin, yMax)} x2={sx(x, xMin, xMax)} y2={sy(yMax, yMin, yMax)} className="stroke-indigo-200 dark:stroke-indigo-800" strokeWidth={0.5} strokeDasharray="2 3" />
        ))}
        {/* Curve */}
        {showAll && <path d={path} className="stroke-indigo-500" strokeWidth={2} fill="none" />}
        {/* Five points */}
        {fiveX.map((x, i) => (
          <g key={i}>
            <circle cx={sx(x, xMin, xMax)} cy={sy(fiveY[i], yMin, yMax)} r={6} className="fill-red-500" />
            <text x={sx(x, xMin, xMax)} y={sy(fiveY[i], yMin, yMax) - 12} textAnchor="middle" className="fill-gray-600 dark:text-gray-400" fontSize={8} fontWeight="bold">{i + 1}</text>
            <text x={sx(x, xMin, xMax) + 6} y={sy(fiveY[i], yMin, yMax) + 3} className="fill-gray-500 dark:fill-gray-400" fontSize={7}>({(x / Math.PI).toFixed(0)}π, {fiveY[i].toFixed(1)})</text>
          </g>
        ))}
        {/* Connecting lines (linear approximation) */}
        {!showAll && (
          <path d={`M ${fiveX.map((x, i) => `${sx(x, xMin, xMax)},${sy(fiveY[i], yMin, yMax)}`).join(' L ')}`} className="stroke-gray-300 dark:stroke-gray-600" strokeWidth={1.5} strokeDasharray="4 3" fill="none" />
        )}
      </svg>

      {/* Five points table */}
      <div className="overflow-x-auto">
        <table className="w-full text-xs">
          <thead>
            <tr className="text-gray-500 dark:text-gray-400">
              <th className="text-left py-1">点</th>
              <th className="text-center">x</th>
              <th className="text-center">{fnType === 'sin' ? 'ωx' : 'ωx'}</th>
              <th className="text-center">y</th>
            </tr>
          </thead>
          <tbody>
            {fiveX.map((x, i) => (
              <tr key={i} className="border-t border-gray-100 dark:border-gray-800">
                <td className="py-1 text-red-500 font-bold">P{i + 1}</td>
                <td className="text-center text-gray-600 dark:text-gray-400">{(x / Math.PI).toFixed(0)}π</td>
                <td className="text-center text-gray-600 dark:text-gray-400">{(omega * x / Math.PI).toFixed(1)}π</td>
                <td className="text-center font-bold text-gray-800 dark:text-gray-200">{fiveY[i].toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <button onClick={() => setShowAll(!showAll)} className="px-3 py-1 text-xs rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors">{showAll ? '只显示五点' : '显示完整曲线'}</button>
      <Insight>五点法：取 0、π/2、π、3π/2、2π 五个关键点，描点连线就能画出三角函数的草图。这是考试画图的标准方法！</Insight>
    </div>
  );
};

// ============================================================
// 14. WaveSynthesizer (node 23 - 三角函数综合应用)
//     "波形合成器"：多个三角函数叠加，展示傅里叶思想
// ============================================================
export const WaveSynthesizer: React.FC = () => {
  const [a1, setA1] = useState(1);
  const [f1, setF1] = useState(1);
  const [a2, setA2] = useState(0.5);
  const [f2, setF2] = useState(3);
  const [a3, setA3] = useState(0);
  const [f3, setF3] = useState(5);

  const fn1 = (x: number) => a1 * Math.sin(f1 * x);
  const fn2 = (x: number) => a2 * Math.sin(f2 * x);
  const fn3 = (x: number) => a3 * Math.sin(f3 * x);
  const sum = (x: number) => fn1(x) + fn2(x) + fn3(x);

  const xMin = -2 * Math.PI, xMax = 2 * Math.PI, yMin = -3, yMax = 3;
  const p1 = curve(fn1, xMin, xMax, yMin, yMax, 200);
  const p2 = curve(fn2, xMin, xMax, yMin, yMax, 200);
  const p3 = curve(fn3, xMin, xMax, yMin, yMax, 200);
  const ps = curve(sum, xMin, xMax, yMin, yMax, 200);

  return (
    <div className="space-y-3">
      <div className="grid grid-cols-3 gap-2">
        <PSlider label="A₁" value={a1} min={0} max={1.5} step={0.1} onChange={setA1} />
        <PSlider label="A₂" value={a2} min={0} max={1.5} step={0.1} onChange={setA2} />
        <PSlider label="A₃" value={a3} min={0} max={1.5} step={0.1} onChange={setA3} />
        <PSlider label="ω₁" value={f1} min={1} max={7} step={1} onChange={setF1} />
        <PSlider label="ω₂" value={f2} min={1} max={7} step={1} onChange={setF2} />
        <PSlider label="ω₃" value={f3} min={1} max={7} step={1} onChange={setF3} />
      </div>

      <svg viewBox={`0 0 ${VW} ${VH}`} className="w-full bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800">
        <PlotFrame xMin={xMin} xMax={xMax} yMin={yMin} yMax={yMax} step={Math.PI} />
        {/* Components */}
        <path d={p1} className="stroke-blue-400" strokeWidth={1.5} fill="none" opacity={0.5} />
        <path d={p2} className="stroke-green-400" strokeWidth={1.5} fill="none" opacity={0.5} />
        {a3 > 0 && <path d={p3} className="stroke-orange-400" strokeWidth={1.5} fill="none" opacity={0.5} />}
        {/* Sum */}
        <path d={ps} className="stroke-purple-600" strokeWidth={2.5} fill="none" />
      </svg>

      <div className="flex gap-2 flex-wrap text-xs">
        <span className="px-2 py-0.5 rounded bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300">🔵 {a1.toFixed(1)}sin({f1}x)</span>
        <span className="px-2 py-0.5 rounded bg-green-100 dark:bg-green-900/40 text-green-700 dark:text-green-300">🟢 {a2.toFixed(1)}sin({f2}x)</span>
        {a3 > 0 && <span className="px-2 py-0.5 rounded bg-orange-100 dark:bg-orange-900/40 text-orange-700 dark:text-orange-300">🟠 {a3.toFixed(1)}sin({f3}x)</span>}
        <span className="px-2 py-0.5 rounded bg-purple-100 dark:bg-purple-900/40 text-purple-700 dark:text-purple-300">🟣 = 合成波</span>
      </div>

      <Insight>任意周期函数都可以拆成正弦波的叠加——这就是傅里叶分析！调高 A₃ 看高频分量如何改变波形。</Insight>
      <Scenario>试试 A₁=1, ω₁=1, A₂=0.3, ω₂=3, A₃=0.15, ω₃=5——你会看到一个近似方波！</Scenario>
    </div>
  );
};

// ============================================================
// 15. EllipseDrawing (node 42 - 椭圆)
//     "椭圆画板"：参数化椭圆绘制 + 性质展示
// ============================================================
export const EllipseDrawing: React.FC = () => {
  const [a, setA] = useState(3);
  const [b, setB] = useState(2);
  const [showFoci, setShowFoci] = useState(true);
  const [showString, setShowString] = useState(false);
  const [angle, setAngle] = useState(45);

  const c = Math.sqrt(Math.abs(a * a - b * b));
  const isWide = a >= b;
  const f1x = isWide ? -c : 0;
  const f1y = isWide ? 0 : -c;
  const f2x = isWide ? c : 0;
  const f2y = isWide ? 0 : c;

  const xMin = -5, xMax = 5, yMin = -4, yMax = 4;
  const ellipsePath = paramCurve(t => a * Math.cos(t), t => b * Math.sin(t), 0, 2 * Math.PI, xMin, xMax, yMin, yMax, 100);

  // Point on ellipse
  const rad = (angle * Math.PI) / 180;
  const px = a * Math.cos(rad);
  const py = b * Math.sin(rad);
  const d1 = Math.sqrt((px - f1x) ** 2 + (py - f1y) ** 2);
  const d2 = Math.sqrt((px - f2x) ** 2 + (py - f2y) ** 2);

  return (
    <div className="space-y-3">
      <div className="grid grid-cols-2 gap-2">
        <PSlider label="半长轴 a" value={a} min={1} max={4} step={0.1} onChange={setA} />
        <PSlider label="半短轴 b" value={b} min={1} max={4} step={0.1} onChange={setB} />
      </div>
      <PSlider label="点角度 θ" value={angle} min={0} max={360} step={5} onChange={setAngle} fmt={v => `${v}°`} />

      <svg viewBox={`0 0 ${VW} ${VH}`} className="w-full bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800">
        <PlotFrame xMin={xMin} xMax={xMax} yMin={yMin} yMax={yMax} step={1} />
        {/* Ellipse */}
        <path d={ellipsePath} className="stroke-blue-500" strokeWidth={2.5} fill="rgba(59,130,246,0.05)" />
        {/* Foci */}
        {showFoci && (
          <>
            <circle cx={sx(f1x, xMin, xMax)} cy={sy(f1y, yMin, yMax)} r={4} className="fill-red-500" />
            <circle cx={sx(f2x, xMin, xMax)} cy={sy(f2y, yMin, yMax)} r={4} className="fill-red-500" />
            <text x={sx(f1x, xMin, xMax) - 8} y={sy(f1y, yMin, yMax) - 8} className="fill-red-600 dark:fill-red-400" fontSize={8}>F₁</text>
            <text x={sx(f2x, xMin, xMax) + 4} y={sy(f2y, yMin, yMax) - 8} className="fill-red-600 dark:fill-red-400" fontSize={8}>F₂</text>
          </>
        )}
        {/* String property */}
        {showString && showFoci && (
          <>
            <line x1={sx(f1x, xMin, xMax)} y1={sy(f1y, yMin, yMax)} x2={sx(px, xMin, xMax)} y2={sy(py, yMin, yMax)} className="stroke-green-400" strokeWidth={1.5} strokeDasharray="3 2" />
            <line x1={sx(f2x, xMin, xMax)} y1={sy(f2y, yMin, yMax)} x2={sx(px, xMin, xMax)} y2={sy(py, yMin, yMax)} className="stroke-green-400" strokeWidth={1.5} strokeDasharray="3 2" />
          </>
        )}
        {/* Point on ellipse */}
        <circle cx={sx(px, xMin, xMax)} cy={sy(py, yMin, yMax)} r={5} className="fill-purple-500" />
        {/* Center */}
        <circle cx={sx(0, xMin, xMax)} cy={sy(0, yMin, yMax)} r={3} className="fill-gray-400" />
      </svg>

      <div className="flex gap-2 flex-wrap">
        <button onClick={() => setShowFoci(!showFoci)} className="px-3 py-1 text-xs rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors">{showFoci ? '隐藏' : '显示'}焦点</button>
        <button onClick={() => setShowString(!showString)} className="px-3 py-1 text-xs rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors">{showString ? '隐藏' : '显示'}绳子性质</button>
      </div>

      <div className="grid grid-cols-4 gap-2 text-center text-xs">
        <div className="p-1.5 rounded bg-blue-50 dark:bg-blue-900/20"><span className="text-gray-400">a</span><div className="font-bold text-blue-600 dark:text-blue-400">{a.toFixed(1)}</div></div>
        <div className="p-1.5 rounded bg-blue-50 dark:bg-blue-900/20"><span className="text-gray-400">b</span><div className="font-bold text-blue-600 dark:text-blue-400">{b.toFixed(1)}</div></div>
        <div className="p-1.5 rounded bg-red-50 dark:bg-red-900/20"><span className="text-gray-400">c</span><div className="font-bold text-red-600 dark:text-red-400">{c.toFixed(2)}</div></div>
        <div className="p-1.5 rounded bg-green-50 dark:bg-green-900/20"><span className="text-gray-400">离心率 e</span><div className="font-bold text-green-600 dark:text-green-400">{(c / Math.max(a, b)).toFixed(3)}</div></div>
      </div>

      {showString && (
        <div className="text-xs text-center text-gray-500 dark:text-gray-400">
          |PF₁| + |PF₂| = {d1.toFixed(2)} + {d2.toFixed(2)} = {(d1 + d2).toFixed(2)} = 2a = {(2 * a).toFixed(2)} ✓
        </div>
      )}
      <Insight>椭圆上任意一点到两焦点距离之和恒等于 2a——这就是"绳子画椭圆"的原理：一根定长的绳子钉在两个焦点上就能画出椭圆！</Insight>
    </div>
  );
};

// ============================================================
// 16. HyperbolaExplorer (node 43 - 双曲线)
//     "双曲线探索器"
// ============================================================
export const HyperbolaExplorer: React.FC = () => {
  const [a, setA] = useState(2);
  const [b, setB] = useState(1.5);
  const [showAsymptotes, setShowAsymptotes] = useState(true);
  const [angle, setAngle] = useState(30);

  const c = Math.sqrt(a * a + b * b);
  const xMin = -6, xMax = 6, yMin = -5, yMax = 5;

  const hyperbolaR = paramCurve(t => a / Math.cos(t), t => b * Math.tan(t), -1.4, 1.4, xMin, xMax, yMin, yMax, 100);
  const hyperbolaL = paramCurve(t => -a / Math.cos(t), t => b * Math.tan(t), -1.4, 1.4, xMin, xMax, yMin, yMax, 100);
  const asymp1 = curve(x => (b / a) * x, xMin, xMax, yMin, yMax);
  const asymp2 = curve(x => -(b / a) * x, xMin, xMax, yMin, yMax);

  const rad = (angle * Math.PI) / 180;
  const px = a / Math.cos(rad);
  const py = b * Math.tan(rad);
  const d1 = Math.sqrt((px - c) ** 2 + py ** 2);
  const d2 = Math.sqrt((px + c) ** 2 + py ** 2);

  return (
    <div className="space-y-3">
      <div className="grid grid-cols-2 gap-2">
        <PSlider label="参数 a" value={a} min={1} max={4} step={0.1} onChange={setA} />
        <PSlider label="参数 b" value={b} min={0.5} max={4} step={0.1} onChange={setB} />
      </div>
      <PSlider label="点角度 θ" value={angle} min={-80} max={80} step={5} onChange={setAngle} fmt={v => `${v}°`} />

      <svg viewBox={`0 0 ${VW} ${VH}`} className="w-full bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800">
        <PlotFrame xMin={xMin} xMax={xMax} yMin={yMin} yMax={yMax} step={1} />
        {/* Asymptotes */}
        {showAsymptotes && (
          <>
            <path d={asymp1} className="stroke-gray-300 dark:stroke-gray-600" strokeWidth={1} strokeDasharray="5 3" fill="none" />
            <path d={asymp2} className="stroke-gray-300 dark:stroke-gray-600" strokeWidth={1} strokeDasharray="5 3" fill="none" />
          </>
        )}
        {/* Hyperbola branches */}
        <path d={hyperbolaR} className="stroke-blue-500" strokeWidth={2.5} fill="none" />
        <path d={hyperbolaL} className="stroke-blue-500" strokeWidth={2.5} fill="none" />
        {/* Foci */}
        <circle cx={sx(c, xMin, xMax)} cy={sy(0, yMin, yMax)} r={4} className="fill-red-500" />
        <circle cx={sx(-c, xMin, xMax)} cy={sy(0, yMin, yMax)} r={4} className="fill-red-500" />
        <text x={sx(c, xMin, xMax) + 4} y={sy(0, yMin, yMax) - 8} className="fill-red-600 dark:fill-red-400" fontSize={8}>F₁</text>
        <text x={sx(-c, xMin, xMax) - 12} y={sy(0, yMin, yMax) - 8} className="fill-red-600 dark:fill-red-400" fontSize={8}>F₂</text>
        {/* Vertices */}
        <circle cx={sx(a, xMin, xMax)} cy={sy(0, yMin, yMax)} r={3} className="fill-blue-400" />
        <circle cx={sx(-a, xMin, xMax)} cy={sy(0, yMin, yMax)} r={3} className="fill-blue-400" />
        {/* Point */}
        {isFinite(px) && Math.abs(px) < xMax && (
          <>
            <circle cx={sx(px, xMin, xMax)} cy={sy(py, yMin, yMax)} r={5} className="fill-purple-500" />
            <line x1={sx(c, xMin, xMax)} y1={sy(0, yMin, yMax)} x2={sx(px, xMin, xMax)} y2={sy(py, yMin, yMax)} className="stroke-green-400" strokeWidth={1} strokeDasharray="3 2" />
            <line x1={sx(-c, xMin, xMax)} y1={sy(0, yMin, yMax)} x2={sx(px, xMin, xMax)} y2={sy(py, yMin, yMax)} className="stroke-green-400" strokeWidth={1} strokeDasharray="3 2" />
          </>
        )}
      </svg>

      <button onClick={() => setShowAsymptotes(!showAsymptotes)} className="px-3 py-1 text-xs rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors">{showAsymptotes ? '隐藏' : '显示'}渐近线</button>

      <div className="grid grid-cols-4 gap-2 text-center text-xs">
        <div className="p-1.5 rounded bg-blue-50 dark:bg-blue-900/20"><span className="text-gray-400">a</span><div className="font-bold text-blue-600 dark:text-blue-400">{a.toFixed(1)}</div></div>
        <div className="p-1.5 rounded bg-blue-50 dark:bg-blue-900/20"><span className="text-gray-400">b</span><div className="font-bold text-blue-600 dark:text-blue-400">{b.toFixed(1)}</div></div>
        <div className="p-1.5 rounded bg-red-50 dark:bg-red-900/20"><span className="text-gray-400">c</span><div className="font-bold text-red-600 dark:text-red-400">{c.toFixed(2)}</div></div>
        <div className="p-1.5 rounded bg-green-50 dark:bg-green-900/20"><span className="text-gray-400">e</span><div className="font-bold text-green-600 dark:text-green-400">{(c / a).toFixed(3)}</div></div>
      </div>

      {isFinite(d1) && isFinite(d2) && (
        <div className="text-xs text-center text-gray-500 dark:text-gray-400">|PF₁| - |PF₂| = {Math.abs(d1 - d2).toFixed(2)} = 2a = {(2 * a).toFixed(2)} ✓</div>
      )}
      <Insight>双曲线上任意一点到两焦点距离之差的绝对值恒等于 2a。渐近线是双曲线"无限接近但永远到不了"的直线！</Insight>
    </div>
  );
};

// ============================================================
// 17. ParabolaSimulator (node 44 - 抛物线)
//     "抛物线模拟器"：光学反射性质 + 焦点准线定义
// ============================================================
export const ParabolaSimulator: React.FC = () => {
  const [p, setP] = useState(1);
  const [showFocus, setShowFocus] = useState(true);
  const [showDirectrix, setShowDirectrix] = useState(true);
  const [showRays, setShowRays] = useState(true);
  const [pointX, setPointX] = useState(1.5);

  const xMin = -4, xMax = 4, yMin = -1, yMax = 6;
  // y = x²/(2p)  (opening upward, vertex at origin)
  const fn = (x: number) => (x * x) / (2 * p);
  const path = curve(fn, xMin, xMax, yMin, yMax, 200);
  const focusY = p / 2;
  const directrixY = -p / 2;

  const py = fn(pointX);
  const distToFocus = Math.sqrt(pointX * pointX + (py - focusY) ** 2);
  const distToDirectrix = py - directrixY;

  return (
    <div className="space-y-3">
      <PSlider label="焦参数 p" value={p} min={0.5} max={3} step={0.1} onChange={setP} />
      <PSlider label="点 x 坐标" value={pointX} min={-3} max={3} step={0.1} onChange={setPointX} fmt={v => v.toFixed(1)} />

      <svg viewBox={`0 0 ${VW} ${VH}`} className="w-full bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800">
        <PlotFrame xMin={xMin} xMax={xMax} yMin={yMin} yMax={yMax} step={1} />
        {/* Directrix */}
        {showDirectrix && <line x1={sx(xMin, xMin, xMax)} y1={sy(directrixY, yMin, yMax)} x2={sx(xMax, xMin, xMax)} y2={sy(directrixY, yMin, yMax)} className="stroke-gray-400" strokeWidth={1.5} strokeDasharray="5 3" />}
        {/* Parabola */}
        <path d={path} className="stroke-blue-500" strokeWidth={2.5} fill="none" />
        {/* Focus */}
        {showFocus && (
          <>
            <circle cx={sx(0, xMin, xMax)} cy={sy(focusY, yMin, yMax)} r={5} className="fill-red-500" />
            <text x={sx(0, xMin, xMax) + 6} y={sy(focusY, yMin, yMax) + 3} className="fill-red-600 dark:fill-red-400" fontSize={8}>F</text>
          </>
        )}
        {/* Incoming rays (parallel) reflecting to focus */}
        {showRays && [-2, -1, 0, 1, 2].map(rx => {
          const ry = fn(rx);
          if (ry > yMax) return null;
          return (
            <g key={rx}>
              <line x1={sx(rx, xMin, xMax)} y1={sy(yMax, yMin, yMax)} x2={sx(rx, xMin, xMax)} y2={sy(ry, yMin, yMax)} className="stroke-amber-400" strokeWidth={1} opacity={0.6} />
              <line x1={sx(rx, xMin, xMax)} y1={sy(ry, yMin, yMax)} x2={sx(0, xMin, xMax)} y2={sy(focusY, yMin, yMax)} className="stroke-green-400" strokeWidth={1} opacity={0.6} />
            </g>
          );
        })}
        {/* Point on parabola */}
        {py <= yMax && (
          <>
            <circle cx={sx(pointX, xMin, xMax)} cy={sy(py, yMin, yMax)} r={5} className="fill-purple-500" />
            {showFocus && <line x1={sx(pointX, xMin, xMax)} y1={sy(py, yMin, yMax)} x2={sx(0, xMin, xMax)} y2={sy(focusY, yMin, yMax)} className="stroke-green-500" strokeWidth={1.5} strokeDasharray="3 2" />}
            {showDirectrix && <line x1={sx(pointX, xMin, xMax)} y1={sy(py, yMin, yMax)} x2={sx(pointX, xMin, xMax)} y2={sy(directrixY, yMin, yMax)} className="stroke-gray-400" strokeWidth={1.5} strokeDasharray="3 2" />}
          </>
        )}
      </svg>

      <div className="flex gap-2 flex-wrap">
        <button onClick={() => setShowFocus(!showFocus)} className="px-3 py-1 text-xs rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors">{showFocus ? '隐藏' : '显示'}焦点</button>
        <button onClick={() => setShowDirectrix(!showDirectrix)} className="px-3 py-1 text-xs rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors">{showDirectrix ? '隐藏' : '显示'}准线</button>
        <button onClick={() => setShowRays(!showRays)} className="px-3 py-1 text-xs rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors">{showRays ? '隐藏' : '显示'}光线反射</button>
      </div>

      {py <= yMax && (
        <div className="text-xs text-center text-gray-500 dark:text-gray-400">
          |PF| = {distToFocus.toFixed(3)} = |P到准线| = {distToDirectrix.toFixed(3)} ✓
        </div>
      )}
      <Insight>抛物线上任意一点到焦点的距离 = 到准线的距离。所有平行光反射后都汇聚到焦点——这就是卫星天线和手电筒反光碗的原理！</Insight>
    </div>
  );
};

// ============================================================
// 18. ArithmeticSequence (node 45 - 等差数列)
//     "等差数列阶梯"：直观展示等差数列的阶梯结构
// ============================================================
export const ArithmeticSequence: React.FC = () => {
  const [a1, setA1] = useState(2);
  const [d, setD] = useState(1.5);
  const [n, setN] = useState(8);

  const terms = Array.from({ length: n }, (_, i) => a1 + i * d);
  const formulaSum = (n * (2 * a1 + (n - 1) * d)) / 2;
  const xMin = -0.5, xMax = n + 0.5, yMin = Math.min(0, ...terms) - 1, yMax = Math.max(0, ...terms) + 1;

  return (
    <div className="space-y-3">
      <div className="grid grid-cols-3 gap-2">
        <PSlider label="首项 a₁" value={a1} min={-5} max={5} step={0.5} onChange={setA1} />
        <PSlider label="公差 d" value={d} min={-3} max={3} step={0.5} onChange={setD} />
        <PSlider label="项数 n" value={n} min={3} max={15} step={1} onChange={setN} />
      </div>

      <svg viewBox={`0 0 ${VW} ${VH}`} className="w-full bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800">
        <PlotFrame xMin={xMin} xMax={xMax} yMin={yMin} yMax={yMax} step={1} />
        {/* Bars */}
        {terms.map((v, i) => {
          const barH = Math.abs(v / (yMax - yMin)) * (VH - 2 * P);
          const barY = v >= 0 ? sy(v, yMin, yMax) : sy(0, yMin, yMax);
          const color = d > 0 ? '#3b82f6' : d < 0 ? '#ef4444' : '#6b7280';
          return (
            <g key={i}>
              <rect x={sx(i + 1, xMin, xMax) - 10} y={barY} width={20} height={Math.abs(barH)} fill={color} fillOpacity={0.3} stroke={color} strokeWidth={1.5} rx={2} />
              <text x={sx(i + 1, xMin, xMax)} y={sy(v, yMin, yMax) - 5} textAnchor="middle" className="fill-gray-700 dark:text-gray-300" fontSize={8} fontWeight="bold">{v.toFixed(1)}</text>
            </g>
          );
        })}
        {/* Connecting line */}
        <path d={terms.map((v, i) => `${i === 0 ? 'M' : 'L'}${sx(i + 1, xMin, xMax)},${sy(v, yMin, yMax)}`).join(' ')} className="stroke-purple-400" strokeWidth={1.5} fill="none" strokeDasharray="3 2" />
        {/* Sum visualization (trapezoid) */}
      </svg>

      <div className="grid grid-cols-2 gap-2">
        <div className="p-2.5 rounded-lg bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800">
          <div className="text-xs text-gray-500 dark:text-gray-400">通项公式</div>
          <div className="text-sm font-mono text-blue-700 dark:text-blue-300">aₙ = {a1.toFixed(1)} + (n-1)×{d.toFixed(1)}</div>
          <div className="text-xs text-gray-400 mt-1">第 {n} 项 = {terms[n - 1].toFixed(2)}</div>
        </div>
        <div className="p-2.5 rounded-lg bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800">
          <div className="text-xs text-gray-500 dark:text-gray-400">求和公式</div>
          <div className="text-sm font-mono text-green-700 dark:text-green-300">Sₙ = n(a₁+aₙ)/2 = {formulaSum.toFixed(2)}</div>
          <div className="text-xs text-gray-400 mt-1">首尾相加 × n/2</div>
        </div>
      </div>

      {/* Gauss trick visualization */}
      <div className="p-2.5 rounded-lg bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800">
        <div className="text-xs font-medium text-amber-700 dark:text-amber-300 mb-1">📐 高斯求和法（首尾配对）</div>
        <div className="flex gap-2 text-xs">
          <span className="text-gray-600 dark:text-gray-400">a₁ + aₙ = {a1.toFixed(1)} + {terms[n - 1].toFixed(1)} = {(a1 + terms[n - 1]).toFixed(1)}</span>
          <span className="text-gray-400">→</span>
          <span className="text-gray-600 dark:text-gray-400">S = {n} × {(a1 + terms[n - 1]).toFixed(1)} / 2 = {formulaSum.toFixed(2)}</span>
        </div>
      </div>
      <Insight>等差数列求和的高斯公式：Sₙ = n(a₁+aₙ)/2。小高斯把 1+2+...+100 配成 50 对，每对都是 101，瞬间算出 5050！</Insight>
    </div>
  );
};

// ============================================================
// 19. GeometricSequence (node 46 - 等比数列)
//     "等比数列实验室"：展示指数增长/衰减
// ============================================================
export const GeometricSequence: React.FC = () => {
  const [a1, setA1] = useState(1);
  const [q, setQ] = useState(2);
  const [n, setN] = useState(8);

  const terms = Array.from({ length: n }, (_, i) => a1 * Math.pow(q, i));
  const sum = q === 1 ? a1 * n : (a1 * (1 - Math.pow(q, n))) / (1 - q);
  const maxVal = Math.max(...terms.map(Math.abs), 0.1);
  const minVal = Math.min(...terms.map(Math.abs), 0);
  const useLog = maxVal / Math.max(minVal, 0.001) > 100;

  const xMin = -0.5, xMax = n + 0.5;
  const yMin = useLog ? -1 : Math.min(0, ...terms) - 1;
  const yMax = useLog ? Math.log10(maxVal) + 1 : Math.max(0, ...terms) + 1;

  const getVal = (v: number) => useLog ? Math.log10(Math.abs(v) + 0.001) : v;

  return (
    <div className="space-y-3">
      <div className="grid grid-cols-3 gap-2">
        <PSlider label="首项 a₁" value={a1} min={0.5} max={5} step={0.5} onChange={setA1} />
        <PSlider label="公比 q" value={q} min={0.1} max={3} step={0.1} onChange={setQ} />
        <PSlider label="项数 n" value={n} min={3} max={12} step={1} onChange={setN} />
      </div>

      <svg viewBox={`0 0 ${VW} ${VH}`} className="w-full bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800">
        <PlotFrame xMin={xMin} xMax={xMax} yMin={yMin} yMax={yMax} step={1} />
        {/* Bars */}
        {terms.map((v, i) => {
          const val = getVal(v);
          const barH = Math.abs(val / (yMax - yMin)) * (VH - 2 * P);
          const barY = val >= 0 ? sy(val, yMin, yMax) : sy(0, yMin, yMax);
          const color = q > 1 ? '#10b981' : q < 1 ? '#f59e0b' : '#6b7280';
          return (
            <g key={i}>
              <rect x={sx(i + 1, xMin, xMax) - 10} y={barY} width={20} height={Math.abs(barH)} fill={color} fillOpacity={0.3} stroke={color} strokeWidth={1.5} rx={2} />
              <text x={sx(i + 1, xMin, xMax)} y={sy(val, yMin, yMax) - 5} textAnchor="middle" className="fill-gray-700 dark:text-gray-300" fontSize={7} fontWeight="bold">
                {Math.abs(v) > 999 ? v.toExponential(1) : v.toFixed(Math.abs(v) < 1 ? 3 : 1)}
              </text>
            </g>
          );
        })}
        {/* Connecting line */}
        <path d={terms.map((v, i) => `${i === 0 ? 'M' : 'L'}${sx(i + 1, xMin, xMax)},${sy(getVal(v), yMin, yMax)}`).join(' ')} className="stroke-purple-400" strokeWidth={1.5} fill="none" strokeDasharray="3 2" />
      </svg>

      {useLog && <div className="text-xs text-center text-gray-400">⚠ 数值跨度大，已自动切换到对数刻度</div>}

      <div className="grid grid-cols-2 gap-2">
        <div className="p-2.5 rounded-lg bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800">
          <div className="text-xs text-gray-500 dark:text-gray-400">通项公式</div>
          <div className="text-sm font-mono text-green-700 dark:text-green-300">aₙ = {a1.toFixed(1)} × {q.toFixed(1)}ⁿ⁻¹</div>
          <div className="text-xs text-gray-400 mt-1">第 {n} 项 = {terms[n - 1].toExponential(2)}</div>
        </div>
        <div className="p-2.5 rounded-lg bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800">
          <div className="text-xs text-gray-500 dark:text-gray-400">求和公式</div>
          <div className="text-sm font-mono text-orange-700 dark:text-orange-300">Sₙ = a₁(1-qⁿ)/(1-q)</div>
          <div className="text-xs text-gray-400 mt-1">S = {sum.toExponential(3)}</div>
        </div>
      </div>

      {/* Infinite sum */}
      {Math.abs(q) < 1 && (
        <div className="p-2.5 rounded-lg bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800">
          <div className="text-xs font-medium text-purple-700 dark:text-purple-300">∞ 无穷等比求和</div>
          <div className="text-sm font-mono text-purple-600 dark:text-purple-400 mt-1">S = a₁/(1-q) = {a1.toFixed(1)}/{(1 - q).toFixed(2)} = {(a1 / (1 - q)).toFixed(4)}</div>
          <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">当 |q| &lt; 1 时，无限项之和收敛到一个有限值！</div>
        </div>
      )}
      <Insight>{q > 1 ? '公比 > 1，等比数列指数增长——这就是"复利效应"的数学本质！' : q < 1 ? '公比 < 1，等比数列收敛——药物代谢、放射性衰变都是这个规律。' : '公比 = 1，退化为常数列。'}</Insight>
    </div>
  );
};
