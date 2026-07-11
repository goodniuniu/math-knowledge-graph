import React, { useState, useMemo } from 'react';
import { VW, VH, P, sx, sy, curve, paramCurve, PlotFrame, PSlider, Scenario, Insight } from './EnhancedVisualsShared';

// ============================================================
// 1. FunctionMachine (node 09 - 函数概念)
//    "函数机器"：输入 → 机器处理 → 输出，直观展示映射关系
// ============================================================
export const FunctionMachine: React.FC = () => {
  const [fnType, setFnType] = useState<'linear' | 'square' | 'reciprocal' | 'abs'>('linear');
  const [input, setInput] = useState(2);
  const [history, setHistory] = useState<{ x: number; y: number }[]>([]);

  const fn = useMemo(() => {
    switch (fnType) {
      case 'linear': return (x: number) => 2 * x + 1;
      case 'square': return (x: number) => x * x;
      case 'reciprocal': return (x: number) => x !== 0 ? 1 / x : NaN;
      case 'abs': return (x: number) => Math.abs(x);
    }
  }, [fnType]);

  const output = fn(input);
  const fnLabel = useMemo(() => {
    switch (fnType) {
      case 'linear': return 'f(x) = 2x + 1';
      case 'square': return 'f(x) = x²';
      case 'reciprocal': return 'f(x) = 1/x';
      case 'abs': return 'f(x) = |x|';
    }
  }, [fnType]);

  const addRecord = () => {
    if (isFinite(output)) setHistory(h => [...h.slice(-8), { x: input, y: output }]);
  };

  // Graph
  const xMin = -4, xMax = 4, yMin = -5, yMax = 10;
  const path = curve(fn, xMin, xMax, yMin, yMax);

  return (
    <div className="space-y-3">
      {/* Machine visualization */}
      <div className="flex items-center justify-center gap-2 py-2">
        {/* Input */}
        <div className="flex flex-col items-center">
          <span className="text-xs text-gray-500 dark:text-gray-400 mb-1">输入 x</span>
          <div className="w-14 h-14 rounded-xl bg-blue-100 dark:bg-blue-900/40 border-2 border-blue-400 dark:border-blue-600 flex items-center justify-center">
            <span className="text-xl font-bold text-blue-700 dark:text-blue-300">{input.toFixed(1)}</span>
          </div>
        </div>
        {/* Arrow */}
        <svg width="30" height="20"><path d="M0,10 L25,10 L20,5 M25,10 L20,15" stroke="#a78bfa" strokeWidth="2" fill="none" /></svg>
        {/* Machine */}
        <div className="flex flex-col items-center">
          <span className="text-xs text-gray-500 dark:text-gray-400 mb-1">函数机器</span>
          <div className="px-4 py-3 rounded-xl bg-purple-100 dark:bg-purple-900/40 border-2 border-purple-400 dark:border-purple-600">
            <span className="text-sm font-bold text-purple-700 dark:text-purple-300 font-mono">{fnLabel}</span>
          </div>
        </div>
        {/* Arrow */}
        <svg width="30" height="20"><path d="M0,10 L25,10 L20,5 M25,10 L20,15" stroke="#a78bfa" strokeWidth="2" fill="none" /></svg>
        {/* Output */}
        <div className="flex flex-col items-center">
          <span className="text-xs text-gray-500 dark:text-gray-400 mb-1">输出 y</span>
          <div className="w-14 h-14 rounded-xl bg-green-100 dark:bg-green-900/40 border-2 border-green-400 dark:border-green-600 flex items-center justify-center">
            <span className="text-xl font-bold text-green-700 dark:text-green-300">{isFinite(output) ? output.toFixed(2) : '∞'}</span>
          </div>
        </div>
        {/* Record button */}
        <button onClick={addRecord} className="ml-2 px-3 py-1.5 text-xs rounded-lg bg-purple-500 text-white hover:bg-purple-600 transition-colors">记录</button>
      </div>

      {/* Controls */}
      <div className="flex gap-2 flex-wrap">
        {([['linear', '一次函数'], ['square', '二次函数'], ['reciprocal', '反比例'], ['abs', '绝对值']] as const).map(([k, label]) => (
          <button key={k} onClick={() => setFnType(k)} className={`px-3 py-1 text-xs rounded-lg transition-colors ${fnType === k ? 'bg-purple-500 text-white' : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700'}`}>{label}</button>
        ))}
      </div>
      <PSlider label="输入值 x" value={input} min={-4} max={4} step={0.1} onChange={setInput} fmt={v => v.toFixed(1)} />

      {/* Graph */}
      <svg viewBox={`0 0 ${VW} ${VH}`} className="w-full bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800">
        <PlotFrame xMin={xMin} xMax={xMax} yMin={yMin} yMax={yMax} step={1} />
        <path d={path} className="stroke-purple-500" strokeWidth={2} fill="none" />
        {/* Current point */}
        {isFinite(output) && (
          <>
            <line x1={sx(input, xMin, xMax)} y1={sy(0, yMin, yMax)} x2={sx(input, xMin, xMax)} y2={sy(output, yMin, yMax)} className="stroke-blue-400" strokeWidth={1} strokeDasharray="3 2" />
            <line x1={sx(0, xMin, xMax)} y1={sy(output, yMin, yMax)} x2={sx(input, xMin, xMax)} y2={sy(output, yMin, yMax)} className="stroke-green-400" strokeWidth={1} strokeDasharray="3 2" />
            <circle cx={sx(input, xMin, xMax)} cy={sy(output, yMin, yMax)} r={5} className="fill-red-500" />
          </>
        )}
        {/* History points */}
        {history.map((h, i) => isFinite(h.y) && (
          <circle key={i} cx={sx(h.x, xMin, xMax)} cy={sy(h.y, yMin, yMax)} r={3} className="fill-purple-300 dark:fill-purple-600" opacity={0.3 + 0.7 * (i / history.length)} />
        ))}
      </svg>

      {/* History table */}
      {history.length > 0 && (
        <div className="flex gap-1 flex-wrap">
          {history.map((h, i) => (
            <span key={i} className="text-xs px-2 py-0.5 rounded bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400">({h.x.toFixed(1)} → {h.y.toFixed(2)})</span>
          ))}
        </div>
      )}
      <Scenario>函数就像一台机器：一个输入对应唯一一个输出。试试不同类型的函数，观察输入和输出的关系！</Scenario>
    </div>
  );
};

// ============================================================
// 2. FunctionProperties (node 10 - 函数性质)
//    "性质探测器"：调整函数参数，实时检测单调性、奇偶性、周期性
// ============================================================
export const FunctionProperties: React.FC = () => {
  const [fnType, setFnType] = useState<'quad' | 'cubic' | 'sin' | 'exp'>('quad');
  const [a, setA] = useState(1);
  const [b, setB] = useState(0);
  const [c, setC] = useState(0);

  const fn = useMemo(() => {
    switch (fnType) {
      case 'quad': return (x: number) => a * x * x + b * x + c;
      case 'cubic': return (x: number) => a * x * x * x + b * x + c;
      case 'sin': return (x: number) => a * Math.sin(x + b) + c;
      case 'exp': return (x: number) => a * Math.exp(x * 0.5 + b * 0.3) + c;
    }
  }, [fnType, a, b, c]);

  // Detect properties
  const xMin = -4, xMax = 4, yMin = -8, yMax = 8;
  const eps = 0.01;
  const testPts = [-3, -2, -1, 0, 1, 2, 3];

  // Monotonicity
  const monoData = testPts.map(x => ({ x, y: fn(x) }));
  let increasing = true, decreasing = true;
  for (let i = 1; i < monoData.length; i++) {
    if (monoData[i].y > monoData[i - 1].y + eps) decreasing = false;
    if (monoData[i].y < monoData[i - 1].y - eps) increasing = false;
  }
  const isMonotonic = increasing || decreasing;

  // Parity (check f(-x) vs f(x) and -f(x))
  const f0 = fn(1), fNeg0 = fn(-1);
  const isEven = Math.abs(f0 - fNeg0) < eps;
  const isOdd = Math.abs(f0 + fNeg0) < eps;

  // Periodicity (simple check)
  const isPeriodic = fnType === 'sin';

  const fnLabel = useMemo(() => {
    switch (fnType) {
      case 'quad': return `f(x) = ${a.toFixed(1)}x² + ${b.toFixed(1)}x + ${c.toFixed(1)}`;
      case 'cubic': return `f(x) = ${a.toFixed(1)}x³ + ${b.toFixed(1)}x + ${c.toFixed(1)}`;
      case 'sin': return `f(x) = ${a.toFixed(1)}sin(x + ${b.toFixed(1)}) + ${c.toFixed(1)}`;
      case 'exp': return `f(x) = ${a.toFixed(1)}e^(0.5x + ${b.toFixed(1)}) + ${c.toFixed(1)}`;
    }
  }, [fnType, a, b, c]);

  const path = curve(fn, xMin, xMax, yMin, yMax);
  // Symmetry line for even/odd
  const mirrorPath = curve(x => fn(-x), xMin, xMax, yMin, yMax);

  return (
    <div className="space-y-3">
      <div className="flex gap-2 flex-wrap">
        {([['quad', '二次函数'], ['cubic', '三次函数'], ['sin', '正弦函数'], ['exp', '指数函数']] as const).map(([k, label]) => (
          <button key={k} onClick={() => { setFnType(k); setA(1); setB(0); setC(0); }} className={`px-3 py-1 text-xs rounded-lg transition-colors ${fnType === k ? 'bg-indigo-500 text-white' : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700'}`}>{label}</button>
        ))}
      </div>

      <div className="grid grid-cols-3 gap-2">
        <PSlider label="参数 a" value={a} min={-3} max={3} step={0.1} onChange={setA} />
        <PSlider label="参数 b" value={b} min={-3} max={3} step={0.1} onChange={setB} />
        <PSlider label="参数 c" value={c} min={-3} max={3} step={0.1} onChange={setC} />
      </div>

      <div className="text-center text-sm font-mono text-indigo-600 dark:text-indigo-400">{fnLabel}</div>

      <svg viewBox={`0 0 ${VW} ${VH}`} className="w-full bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800">
        <PlotFrame xMin={xMin} xMax={xMax} yMin={yMin} yMax={yMax} step={1} />
        {/* y-axis mirror for parity check */}
        {(isEven || isOdd) && <line x1={sx(0, xMin, xMax)} y1={sy(yMin, yMin, yMax)} x2={sx(0, xMin, xMax)} y2={sy(yMax, yMin, yMax)} className="stroke-pink-400" strokeWidth={1.5} strokeDasharray="4 2" />}
        {/* Mirror path */}
        {(isEven || isOdd) && <path d={mirrorPath} className="stroke-pink-300 dark:stroke-pink-700" strokeWidth={1.5} fill="none" strokeDasharray="3 3" />}
        {/* Main curve */}
        <path d={path} className="stroke-indigo-500" strokeWidth={2.5} fill="none" />
        {/* Test points */}
        {monoData.map((p, i) => isFinite(p.y) && (
          <circle key={i} cx={sx(p.x, xMin, xMax)} cy={sy(p.y, yMin, yMax)} r={3} className="fill-orange-400" />
        ))}
      </svg>

      {/* Property badges */}
      <div className="flex gap-2 flex-wrap">
        <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${isMonotonic ? (increasing ? 'bg-green-100 dark:bg-green-900/40 text-green-700 dark:text-green-300' : 'bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300') : 'bg-gray-100 dark:bg-gray-800 text-gray-500'}`}>
          {isMonotonic ? (increasing ? '↗ 单调递增' : '↘ 单调递减') : '↕ 非单调'}
        </span>
        <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${isEven ? 'bg-pink-100 dark:bg-pink-900/40 text-pink-700 dark:text-pink-300' : 'bg-gray-100 dark:bg-gray-800 text-gray-500'}`}>
          {isEven ? '☺ 偶函数' : '— 非偶'}
        </span>
        <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${isOdd ? 'bg-purple-100 dark:bg-purple-900/40 text-purple-700 dark:text-purple-300' : 'bg-gray-100 dark:bg-gray-800 text-gray-500'}`}>
          {isOdd ? '⚑ 奇函数' : '— 非奇'}
        </span>
        <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${isPeriodic ? 'bg-amber-100 dark:bg-amber-900/40 text-amber-700 dark:text-amber-300' : 'bg-gray-100 dark:bg-gray-800 text-gray-500'}`}>
          {isPeriodic ? '⟳ 周期函数' : '— 非周期'}
        </span>
      </div>

      {(isEven || isOdd) && <Insight>{isEven ? '偶函数关于 y 轴对称——看！虚线镜像与实线完全重合。' : '奇函数关于原点对称——旋转 180° 后曲线不变。'}</Insight>}
      <Scenario>调整参数 a、b、c，观察函数性质如何变化。橙色点是探测点，粉色虚线是对称性检测线。</Scenario>
    </div>
  );
};

// ============================================================
// 3. ZeroHunter (node 17 - 零点与二分法)
//    "零点猎人"：可视化二分法逐步逼近函数零点的过程
// ============================================================
export const ZeroHunter: React.FC = () => {
  const [fnType, setFnType] = useState<'cubic' | 'cos' | 'exp'>('cubic');
  const [left, setLeft] = useState(-2);
  const [right, setRight] = useState(3);
  const [steps, setSteps] = useState<{ l: number; r: number; mid: number; fMid: number }[]>([]);

  const fn = useMemo(() => {
    switch (fnType) {
      case 'cubic': return (x: number) => x * x * x - 2 * x - 1;
      case 'cos': return (x: number) => Math.cos(x) - 0.5;
      case 'exp': return (x: number) => Math.exp(x) - 3;
    }
  }, [fnType]);

  const xMin = -4, xMax = 5, yMin = -5, yMax = 5;
  const path = curve(fn, xMin, xMax, yMin, yMax);

  const fLeft = fn(left), fRight = fn(right);
  const canBisect = fLeft * fRight < 0;

  const bisect = () => {
    if (!canBisect) return;
    const mid = (left + right) / 2;
    const fMid = fn(mid);
    setSteps(s => [...s, { l: left, r: right, mid, fMid }]);
    if (fLeft * fMid < 0) setRight(mid);
    else setLeft(mid);
  };

  const reset = () => {
    setLeft(-2); setRight(3); setSteps([]);
  };

  const resetForFn = () => {
    setSteps([]);
    if (fnType === 'cubic') { setLeft(-2); setRight(3); }
    else if (fnType === 'cos') { setLeft(0); setRight(2); }
    else { setLeft(0); setRight(2); }
  };

  return (
    <div className="space-y-3">
      <div className="flex gap-2 flex-wrap items-center">
        {([['cubic', 'x³-2x-1'], ['cos', 'cos(x)-0.5'], ['exp', 'eˣ-3']] as const).map(([k, label]) => (
          <button key={k} onClick={() => { setFnType(k); setTimeout(resetForFn, 0); }} className={`px-3 py-1 text-xs rounded-lg transition-colors ${fnType === k ? 'bg-red-500 text-white' : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700'}`}>{label}</button>
        ))}
        <button onClick={bisect} disabled={!canBisect} className="px-3 py-1 text-xs rounded-lg bg-red-500 text-white hover:bg-red-600 disabled:opacity-40 disabled:cursor-not-allowed transition-colors">二分一步</button>
        <button onClick={reset} className="px-3 py-1 text-xs rounded-lg bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors">重置</button>
      </div>

      <div className="flex gap-2 items-center text-xs">
        <span className="text-gray-500 dark:text-gray-400">区间 [{left.toFixed(4)}, {right.toFixed(4)}]</span>
        <span className="text-gray-300 dark:text-gray-600">|</span>
        <span className="text-gray-500 dark:text-gray-400">宽度 = {((right - left) / 2).toFixed(4)}</span>
      </div>

      <svg viewBox={`0 0 ${VW} ${VH}`} className="w-full bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800">
        <PlotFrame xMin={xMin} xMax={xMax} yMin={yMin} yMax={yMax} step={1} />
        {/* Function curve */}
        <path d={path} className="stroke-indigo-500" strokeWidth={2} fill="none" />
        {/* Current interval */}
        <rect x={sx(left, xMin, xMax)} y={P} width={Math.max(2, sx(right, xMin, xMax) - sx(left, xMin, xMax))} height={VH - 2 * P} className="fill-red-200/30 dark:fill-red-900/20" />
        <line x1={sx(left, xMin, xMax)} y1={sy(yMin, yMin, yMax)} x2={sx(left, xMin, xMax)} y2={sy(yMax, yMin, yMax)} className="stroke-red-400" strokeWidth={1.5} strokeDasharray="3 2" />
        <line x1={sx(right, xMin, xMax)} y1={sy(yMin, yMin, yMax)} x2={sx(right, xMin, xMax)} y2={sy(yMax, yMin, yMax)} className="stroke-red-400" strokeWidth={1.5} strokeDasharray="3 2" />
        {/* f(left) and f(right) points */}
        {isFinite(fLeft) && <circle cx={sx(left, xMin, xMax)} cy={sy(fLeft, yMin, yMax)} r={4} className="fill-blue-500" />}
        {isFinite(fRight) && <circle cx={sx(right, xMin, xMax)} cy={sy(fRight, yMin, yMax)} r={4} className="fill-green-500" />}
        {/* Midpoint */}
        {steps.length > 0 && (() => {
          const last = steps[steps.length - 1];
          return isFinite(last.fMid) ? <circle cx={sx(last.mid, xMin, xMax)} cy={sy(last.fMid, yMin, yMax)} r={5} className="fill-red-500" /> : null;
        })()}
        {/* Zero point estimate */}
        {steps.length > 0 && <line x1={sx((left + right) / 2, xMin, xMax)} y1={sy(yMin, yMin, yMax)} x2={sx((left + right) / 2, xMin, xMax)} y2={sy(yMax, yMin, yMax)} className="stroke-red-500" strokeWidth={1} />}
      </svg>

      {/* Step history */}
      {steps.length > 0 && (
        <div className="space-y-1">
          <div className="text-xs font-medium text-gray-600 dark:text-gray-400">二分历史 ({steps.length} 步)</div>
          {steps.map((s, i) => (
            <div key={i} className="text-xs text-gray-500 dark:text-gray-400 flex gap-3">
              <span className="text-red-500 font-mono">#{i + 1}</span>
              <span>区间 [{s.l.toFixed(3)}, {s.r.toFixed(3)}]</span>
              <span>中点 = {s.mid.toFixed(4)}</span>
              <span className={s.fMid > 0 ? 'text-green-600 dark:text-green-400' : 'text-blue-600 dark:text-blue-400'}>f(中点) = {s.fMid.toFixed(4)}</span>
            </div>
          ))}
        </div>
      )}

      {!canBisect && <div className="text-xs text-red-500 dark:text-red-400">⚠ 当前区间两端函数值同号，不满足零点存在性定理（f(a)·f(b) &lt; 0）</div>}
      <Insight>零点存在性定理：如果 f(a)·f(b) &lt; 0 且函数连续，那么 (a,b) 之间一定有零点。每二分一次，区间宽度减半！</Insight>
    </div>
  );
};

// ============================================================
// 4. DerivativeCalculator (node 47 - 导数概念)
//    "导数计算器"：割线逼近切线，展示导数的极限定义
// ============================================================
export const DerivativeCalculator: React.FC = () => {
  const [fnType, setFnType] = useState<'quad' | 'cubic' | 'sin'>('quad');
  const [x0, setX0] = useState(1);
  const [h, setH] = useState(2);

  const fn = useMemo(() => {
    switch (fnType) {
      case 'quad': return (x: number) => x * x;
      case 'cubic': return (x: number) => 0.5 * x * x * x - x;
      case 'sin': return (x: number) => Math.sin(x);
    }
  }, [fnType]);

  // Analytical derivative
  const dfn = useMemo(() => {
    switch (fnType) {
      case 'quad': return (x: number) => 2 * x;
      case 'cubic': return (x: number) => 1.5 * x * x - 1;
      case 'sin': return (x: number) => Math.cos(x);
    }
  }, [fnType]);

  const xMin = -3, xMax = 4, yMin = -4, yMax = 6;
  const path = curve(fn, xMin, xMax, yMin, yMax);

  const y0 = fn(x0);
  const x1 = x0 + h;
  const y1 = fn(x1);
  const secantSlope = (y1 - y0) / (x1 - x0);
  const trueDerivative = dfn(x0);

  // Secant line: y = y0 + slope * (x - x0)
  const secantPath = curve(x => y0 + secantSlope * (x - x0), xMin, xMax, yMin, yMax);
  // Tangent line
  const tangentPath = curve(x => y0 + trueDerivative * (x - x0), xMin, xMax, yMin, yMax);

  const error = Math.abs(secantSlope - trueDerivative);

  const fnLabel = useMemo(() => {
    switch (fnType) {
      case 'quad': return 'f(x) = x²';
      case 'cubic': return 'f(x) = ½x³ - x';
      case 'sin': return 'f(x) = sin(x)';
    }
  }, [fnType]);

  return (
    <div className="space-y-3">
      <div className="flex gap-2 flex-wrap">
        {([['quad', 'x²'], ['cubic', '½x³-x'], ['sin', 'sin(x)']] as const).map(([k, label]) => (
          <button key={k} onClick={() => setFnType(k)} className={`px-3 py-1 text-xs rounded-lg transition-colors ${fnType === k ? 'bg-teal-500 text-white' : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700'}`}>{label}</button>
        ))}
      </div>

      <div className="text-center text-sm font-mono text-teal-600 dark:text-teal-400">{fnLabel}</div>

      <PSlider label="切点 x₀" value={x0} min={-2.5} max={3} step={0.1} onChange={setX0} fmt={v => v.toFixed(1)} />
      <PSlider label="增量 h（Δx）" value={h} min={0.01} max={3} step={0.01} onChange={setH} fmt={v => v.toFixed(2)} />

      <svg viewBox={`0 0 ${VW} ${VH}`} className="w-full bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800">
        <PlotFrame xMin={xMin} xMax={xMax} yMin={yMin} yMax={yMax} step={1} />
        {/* Function curve */}
        <path d={path} className="stroke-indigo-500" strokeWidth={2} fill="none" />
        {/* Tangent line (true derivative) */}
        <path d={tangentPath} className="stroke-green-500" strokeWidth={2} fill="none" strokeDasharray="5 3" />
        {/* Secant line */}
        <path d={secantPath} className="stroke-red-500" strokeWidth={2} fill="none" />
        {/* Points */}
        <circle cx={sx(x0, xMin, xMax)} cy={sy(y0, yMin, yMax)} r={5} className="fill-blue-500" />
        {isFinite(y1) && Math.abs(x1) < 10 && (
          <>
            <circle cx={sx(x1, xMin, xMax)} cy={sy(y1, yMin, yMax)} r={5} className="fill-orange-500" />
            <line x1={sx(x0, xMin, xMax)} y1={sy(y0, yMin, yMax)} x2={sx(x1, xMin, xMax)} y2={sy(y0, yMin, yMax)} className="stroke-gray-400" strokeWidth={0.5} strokeDasharray="2 2" />
            <line x1={sx(x1, xMin, xMax)} y1={sy(y0, yMin, yMax)} x2={sx(x1, xMin, xMax)} y2={sy(y1, yMin, yMax)} className="stroke-gray-400" strokeWidth={0.5} strokeDasharray="2 2" />
          </>
        )}
      </svg>

      {/* Comparison */}
      <div className="grid grid-cols-3 gap-2 text-center">
        <div className="p-2 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800">
          <div className="text-xs text-gray-500 dark:text-gray-400">割线斜率</div>
          <div className="text-sm font-bold text-red-600 dark:text-red-400">{secantSlope.toFixed(4)}</div>
          <div className="text-xs text-gray-400">= Δy/Δx</div>
        </div>
        <div className="p-2 rounded-lg bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800">
          <div className="text-xs text-gray-500 dark:text-gray-400">导数 f'(x₀)</div>
          <div className="text-sm font-bold text-green-600 dark:text-green-400">{trueDerivative.toFixed(4)}</div>
          <div className="text-xs text-gray-400">精确值</div>
        </div>
        <div className="p-2 rounded-lg bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800">
          <div className="text-xs text-gray-500 dark:text-gray-400">误差</div>
          <div className="text-sm font-bold text-amber-600 dark:text-amber-400">{error.toFixed(4)}</div>
          <div className="text-xs text-gray-400">|割线-切线|</div>
        </div>
      </div>

      <Insight>当 h → 0 时，割线（红线）越来越接近切线（绿虚线），割线斜率 → 导数。这就是导数的极限定义：f'(x₀) = lim<sub>h→0</sub> [f(x₀+h) - f(x₀)] / h</Insight>
      <button onClick={() => setH(Math.max(0.01, h - 0.1))} className="px-3 py-1.5 text-xs rounded-lg bg-teal-500 text-white hover:bg-teal-600 transition-colors w-full">h 减小 → 看割线逼近切线</button>
    </div>
  );
};
