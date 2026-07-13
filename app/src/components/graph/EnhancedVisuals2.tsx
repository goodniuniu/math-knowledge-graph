import React, { useState, useMemo } from 'react';
import { VW, VH, sx, sy, curve, PlotFrame, PSlider, Scenario, Insight } from './EnhancedVisualsShared';

// ============================================================
// 5. QuadraticTrinity (node 08 - 二次函数)
//    "二次函数三合一"：一般式、顶点式、交点式同步展示
// ============================================================
export const QuadraticTrinity: React.FC = () => {
  const [a, setA] = useState(1);
  const [b, setB] = useState(0);
  const [c, setC] = useState(-2);

  const fn = (x: number) => a * x * x + b * x + c;
  const xMin = -5, xMax = 5, yMin = -6, yMax = 8;
  const path = curve(fn, xMin, xMax, yMin, yMax);

  // Vertex
  const vx = -b / (2 * a);
  const vy = c - (b * b) / (4 * a);
  // Roots
  const disc = b * b - 4 * a * c;
  const roots = disc >= 0 ? [(-b + Math.sqrt(disc)) / (2 * a), (-b - Math.sqrt(disc)) / (2 * a)] : [];

  return (
    <div className="space-y-3">
      <div className="grid grid-cols-3 gap-2">
        <PSlider label="a" value={a} min={-3} max={3} step={0.1} onChange={setA} />
        <PSlider label="b" value={b} min={-5} max={5} step={0.1} onChange={setB} />
        <PSlider label="c" value={c} min={-5} max={5} step={0.1} onChange={setC} />
      </div>

      <svg viewBox={`0 0 ${VW} ${VH}`} className="w-full bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800">
        <PlotFrame xMin={xMin} xMax={xMax} yMin={yMin} yMax={yMax} step={1} />
        <path d={path} className="stroke-blue-500" strokeWidth={2} fill="none" />
        {/* Vertex */}
        {isFinite(vy) && vy >= yMin && vy <= yMax && (
          <>
            <circle cx={sx(vx, xMin, xMax)} cy={sy(vy, yMin, yMax)} r={5} className="fill-purple-500" />
            <line x1={sx(vx, xMin, xMax)} y1={sy(yMin, yMin, yMax)} x2={sx(vx, xMin, xMax)} y2={sy(vy, yMin, yMax)} className="stroke-purple-300" strokeWidth={1} strokeDasharray="3 2" />
          </>
        )}
        {/* Roots */}
        {roots.map((r, i) => r >= xMin && r <= xMax && (
          <circle key={i} cx={sx(r, xMin, xMax)} cy={sy(0, yMin, yMax)} r={5} className="fill-red-500" />
        ))}
        {/* y-intercept */}
        <circle cx={sx(0, xMin, xMax)} cy={sy(c, yMin, yMax)} r={4} className="fill-green-500" />
      </svg>

      {/* Three forms */}
      <div className="grid grid-cols-1 gap-2">
        <div className="p-2.5 rounded-lg bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800">
          <span className="text-xs text-blue-600 dark:text-blue-400 font-medium">一般式</span>
          <span className="text-sm font-mono text-gray-800 dark:text-gray-200 ml-2">f(x) = {a.toFixed(1)}x² + {b.toFixed(1)}x + {c.toFixed(1)}</span>
        </div>
        <div className="p-2.5 rounded-lg bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800">
          <span className="text-xs text-purple-600 dark:text-purple-400 font-medium">顶点式</span>
          <span className="text-sm font-mono text-gray-800 dark:text-gray-200 ml-2">f(x) = {a.toFixed(1)}(x {vx >= 0 ? '-' : '+'} {Math.abs(vx).toFixed(2)})² {vy >= 0 ? '+' : '-'} {Math.abs(vy).toFixed(2)}</span>
        </div>
        <div className="p-2.5 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800">
          <span className="text-xs text-red-600 dark:text-red-400 font-medium">交点式</span>
          <span className="text-sm font-mono text-gray-800 dark:text-gray-200 ml-2">
            {disc >= 0 ? `f(x) = ${a.toFixed(1)}(x - ${roots[0].toFixed(2)})(x - ${roots[1].toFixed(2)})` : '无实数根（Δ < 0）'}
          </span>
        </div>
      </div>

      {/* Key info */}
      <div className="flex gap-2 flex-wrap text-xs">
        <span className="px-2 py-0.5 rounded bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400">顶点 ({vx.toFixed(2)}, {vy.toFixed(2)})</span>
        <span className="px-2 py-0.5 rounded bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400">对称轴 x = {vx.toFixed(2)}</span>
        <span className={`px-2 py-0.5 rounded ${disc > 0 ? 'bg-green-100 dark:bg-green-900/40 text-green-700 dark:text-green-300' : disc === 0 ? 'bg-amber-100 dark:bg-amber-900/40 text-amber-700 dark:text-amber-300' : 'bg-red-100 dark:bg-red-900/40 text-red-700 dark:text-red-300'}`}>
          Δ = {disc.toFixed(2)} {disc > 0 ? '(两个根)' : disc === 0 ? '(一个根)' : '(无实根)'}
        </span>
        <span className="px-2 py-0.5 rounded bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400">{a > 0 ? '开口向上 ↑' : '开口向下 ↓'}</span>
      </div>
      <Scenario>调整 a、b、c，观察三种表达形式如何同步变化。紫点=顶点，红点=零点，绿点=y轴截距。</Scenario>

      {/* a/b/c 参数含义图解 */}
      <div className="mt-1">
        <div className="text-xs font-semibold text-gray-700 dark:text-gray-300 mb-2">🔑 参数 a、b、c 各自的含义</div>
        <div className="grid grid-cols-3 gap-2">
          <div className="p-2 rounded-lg bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800">
            <div className="text-xs font-bold text-purple-600 dark:text-purple-400">a = {a.toFixed(1)}</div>
            <div className="text-[10px] text-gray-500 dark:text-gray-400 mt-0.5">
              <b>开口方向与大小</b><br />
              a &gt; 0 → 开口向上 ☺<br />
              a &lt; 0 → 开口向下 ☹<br />
              |a| 越大 → 开口越窄
            </div>
          </div>
          <div className="p-2 rounded-lg bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800">
            <div className="text-xs font-bold text-blue-600 dark:text-blue-400">b = {b.toFixed(1)}</div>
            <div className="text-[10px] text-gray-500 dark:text-gray-400 mt-0.5">
              <b>影响对称轴位置</b><br />
              对称轴 x = -b/(2a)<br />
              = <b>{vx.toFixed(2)}</b><br />
              b 决定顶点左右移动
            </div>
          </div>
          <div className="p-2 rounded-lg bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800">
            <div className="text-xs font-bold text-green-600 dark:text-green-400">c = {c.toFixed(1)}</div>
            <div className="text-[10px] text-gray-500 dark:text-gray-400 mt-0.5">
              <b>y 轴截距</b><br />
              f(0) = c = <b>{c.toFixed(1)}</b><br />
              抛物线与 y 轴<br />交点的纵坐标
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// ============================================================
// 6. PowerFunctionFamily (node 11 - 幂函数)
//    "幂函数家族"：展示不同指数的幂函数图像集合
// ============================================================
export const PowerFunctionFamily: React.FC = () => {
  const [n, setN] = useState(2);
  const powers = [-2, -1, -0.5, 0.5, 1, 2, 3, 4];
  const xMin = -4, xMax = 4, yMin = -4, yMax = 8;

  const fn = (x: number, p: number) => {
    if (p === 0) return 1;
    if (p < 0 && Math.abs(x) < 0.01) return NaN;
    if (p % 1 !== 0 && x < 0) return NaN;
    return Math.pow(x, p);
  };

  const colors = ['#ef4444', '#f97316', '#eab308', '#84cc16', '#06b6d4', '#3b82f6', '#8b5cf6', '#ec4899'];
  const currentPath = curve(x => fn(x, n), xMin, xMax, yMin, yMax);

  return (
    <div className="space-y-3">
      <div className="flex gap-1.5 flex-wrap">
        {powers.map((p, i) => (
          <button key={p} onClick={() => setN(p)} className={`px-2.5 py-1 text-xs rounded-lg transition-colors ${n === p ? 'text-white' : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700'}`} style={n === p ? { backgroundColor: colors[i] } : {}}>
            x<sup>{p === 0.5 ? '½' : p === -0.5 ? '-½' : p}</sup>
          </button>
        ))}
      </div>

      <svg viewBox={`0 0 ${VW} ${VH}`} className="w-full bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800">
        <PlotFrame xMin={xMin} xMax={xMax} yMin={yMin} yMax={yMax} step={1} />
        {/* All faint curves */}
        {powers.map((p, i) => p !== n && (
          <path key={p} d={curve(x => fn(x, p), xMin, xMax, yMin, yMax, 200)} stroke={colors[i]} strokeWidth={1} fill="none" opacity={0.15} />
        ))}
        {/* Current highlighted curve */}
        <path d={currentPath} stroke={colors[powers.indexOf(n)]} strokeWidth={2.5} fill="none" />
        {/* y=x line for reference */}
        <path d={curve(x => x, xMin, xMax, yMin, yMax)} className="stroke-gray-300 dark:stroke-gray-600" strokeWidth={1} strokeDasharray="4 4" fill="none" />
      </svg>

      <div className="p-2.5 rounded-lg bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700">
        <div className="text-sm font-mono text-gray-800 dark:text-gray-200">f(x) = x<sup>{n === 0.5 ? '½' : n === -0.5 ? '-½' : n}</sup></div>
        <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
          {n > 0 && n % 2 === 0 && '偶数次幂：关于 y 轴对称，第一象限单调递增，经过 (0,0) 和 (1,1)'}
          {n > 0 && n % 2 !== 0 && Math.abs(n % 1) < 0.01 && '奇数次幂：关于原点对称，单调递增，经过 (0,0) 和 (1,1)'}
          {n > 0 && n % 1 !== 0 && '分数次幂：仅在第一象限有定义，单调递增，经过 (1,1)'}
          {n < 0 && '负数次幂：双曲线形状，经过 (1,1)，x=0 处无定义，在第一象限单调递减'}
        </div>
      </div>
      <Insight>所有幂函数都经过点 (1, 1)——这是幂函数的"指纹"。正整数幂过原点，负数幂不过原点。</Insight>

      {/* 指数含义图解 */}
      <div className="mt-1">
        <div className="text-xs font-semibold text-gray-700 dark:text-gray-300 mb-2">🔢 当前指数 n = {n} 的含义</div>
        <div className="p-2.5 rounded-lg bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 text-[10px] text-gray-600 dark:text-gray-400 space-y-1">
          {n > 0 && n % 2 === 0 && (
            <>
              <div><b className="text-blue-500">n 为正偶数</b>（如 x², x⁴）：图像关于 y 轴对称（偶函数）</div>
              <div>• x ∈ ℝ，y ≥ 0 → 经过 (0,0) 和 (1,1)</div>
              <div>• 第一象限单调递增，第二象限单调递减</div>
              <div className="text-amber-500">现实：面积 ∝ 边长²，体积 ∝ 棱长³</div>
            </>
          )}
          {n > 0 && n % 2 !== 0 && Math.abs(n % 1) < 0.01 && (
            <>
              <div><b className="text-purple-500">n 为正奇数</b>（如 x¹, x³）：图像关于原点对称（奇函数）</div>
              <div>• 整个 ℝ 上单调递增 → 经过 (0,0) 和 (1,1)</div>
              <div>• 左下到右上，没有"回头"</div>
              <div className="text-amber-500">现实：匀速运动距离 = 速度 × 时间</div>
            </>
          )}
          {n > 0 && n % 1 !== 0 && (
            <>
              <div><b className="text-teal-500">n 为分数</b>（如 x^½ = √x）：仅在 x ≥ 0 有定义</div>
              <div>• 第一象限单调递增，凹函数（增速变缓）</div>
              <div className="text-amber-500">现实：正方形边长 = √面积</div>
            </>
          )}
          {n < 0 && (
            <>
              <div><b className="text-red-500">n 为负数</b>（如 x⁻¹ = 1/x）：双曲线形状</div>
              <div>• 不过原点，x = 0 处无定义（垂直渐近线）</div>
              <div>• 第一象限单调递减</div>
              <div className="text-amber-500">现实：速度 = 路程/时间，单价 = 总价/数量</div>
            </>
          )}
        </div>
      </div>

      <Scenario>点击不同指数，看幂函数家族的全貌。淡色线是其他成员，亮色线是当前选中的。</Scenario>
    </div>
  );
};

// ============================================================
// 7. BacteriaGrowth (node 13 - 指数函数)
//    "细菌分裂实验室"：模拟细菌指数增长过程
// ============================================================
export const BacteriaGrowth: React.FC = () => {
  const [base, setBase] = useState(2);
  const [time, setTime] = useState(5);
  const [showLinear, setShowLinear] = useState(false);

  const fn = (x: number) => Math.pow(base, x);
  const xMin = 0, xMax = 8, yMin = 0, yMax = 256;
  const expPath = curve(fn, xMin, xMax, yMin, yMax);
  const linPath = curve(x => 1 + 30 * x, xMin, xMax, yMin, yMax);

  // Bacteria visualization
  const count = Math.min(Math.floor(fn(time)), 256);
  const bacteria = Array.from({ length: Math.min(count, 60) });

  return (
    <div className="space-y-3">
      <div className="grid grid-cols-2 gap-2">
        <PSlider label="底数 a" value={base} min={1.5} max={3} step={0.1} onChange={setBase} />
        <PSlider label="时间 t" value={time} min={0} max={7} step={0.1} onChange={setTime} fmt={v => v.toFixed(1)} />
      </div>

      {/* Bacteria petri dish */}
      <div className="p-3 rounded-xl bg-gradient-to-br from-green-50 to-emerald-100 dark:from-green-900/20 dark:to-emerald-900/30 border border-green-200 dark:border-green-800">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-medium text-green-700 dark:text-green-300">🦠 培养皿</span>
          <span className="text-sm font-bold text-green-700 dark:text-green-300">{fn(time).toFixed(0)} 个细菌</span>
        </div>
        <div className="flex flex-wrap gap-1 min-h-[40px]">
          {bacteria.map((_, i) => (
            <span key={i} className="text-sm" style={{ opacity: 0.4 + 0.6 * (i / bacteria.length) }}>🦠</span>
          ))}
          {count > 60 && <span className="text-xs text-gray-500 self-end ml-1">...还有 {count - 60} 个</span>}
        </div>
      </div>

      <svg viewBox={`0 0 ${VW} ${VH}`} className="w-full bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800">
        <PlotFrame xMin={xMin} xMax={xMax} yMin={yMin} yMax={yMax} step={1} />
        {/* Linear comparison */}
        {showLinear && <path d={linPath} className="stroke-gray-400" strokeWidth={1.5} strokeDasharray="4 3" fill="none" />}
        {/* Exponential curve */}
        <path d={expPath} className="stroke-green-500" strokeWidth={2.5} fill="none" />
        {/* Current time point */}
        <circle cx={sx(time, xMin, xMax)} cy={sy(fn(time), yMin, yMax)} r={5} className="fill-red-500" />
        <line x1={sx(time, xMin, xMax)} y1={sy(0, yMin, yMax)} x2={sx(time, xMin, xMax)} y2={sy(fn(time), yMin, yMax)} className="stroke-red-300" strokeWidth={1} strokeDasharray="3 2" />
      </svg>

      <div className="flex gap-2">
        <button onClick={() => setShowLinear(!showLinear)} className={`px-3 py-1 text-xs rounded-lg transition-colors ${showLinear ? 'bg-gray-500 text-white' : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400'}`}>对比线性增长</button>
      </div>

      <div className="p-2.5 rounded-lg bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800">
        <div className="text-sm font-mono text-green-700 dark:text-green-300">N(t) = {base.toFixed(1)}ᵗ</div>
        <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
          经过 {time.toFixed(1)} 个时间段，细菌从 1 个增长到 {fn(time).toFixed(0)} 个
        </div>
        {showLinear && <div className="text-xs text-gray-400 mt-1">线性增长同期只有 {(1 + 30 * time).toFixed(0)} 个——差距越来越大！</div>}
      </div>

      <Insight>指数增长的特点：起初看起来很慢，但一旦加速就势不可挡。这就是"指数爆炸"——复利、病毒传播都是这个规律。</Insight>

      {/* 增长倍率含义图解 */}
      <div className="mt-1">
        <div className="text-xs font-semibold text-gray-700 dark:text-gray-300 mb-2">📊 倍率拆解：每个时间段发生了什么？</div>
        <div className="space-y-1.5">
          <div className="flex items-center gap-2 p-2 rounded-lg bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800">
            <span className="text-base">🦠</span>
            <div className="flex-1 text-[10px] text-gray-600 dark:text-gray-400">
              <b className="text-green-600 dark:text-green-400">底数 a = {base.toFixed(1)}</b>：每个时间段细菌数量乘以 {base.toFixed(1)}
              → 即增长 <b>{((base - 1) * 100).toFixed(0)}%</b>
            </div>
          </div>
          <div className="flex items-center gap-2 p-2 rounded-lg bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800">
            <span className="text-base">⏱️</span>
            <div className="flex-1 text-[10px] text-gray-600 dark:text-gray-400">
              <b className="text-amber-600 dark:text-amber-400">时间 t = {time.toFixed(1)}</b>：经过 {time.toFixed(1)} 个时间段
              → 翻了 <b>{(time * Math.log2(base)).toFixed(1)}</b> 次倍
            </div>
          </div>
          <div className="flex items-center gap-2 p-2 rounded-lg bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800">
            <span className="text-base">📈</span>
            <div className="flex-1 text-[10px] text-gray-600 dark:text-gray-400">
              <b className="text-blue-600 dark:text-blue-400">倍增时间</b> = 1/log₂(a) = <b>{(1 / Math.log2(base)).toFixed(2)}</b> 个时间段
              → 每过这么久，数量就翻一倍
            </div>
          </div>
          {showLinear && (
            <div className="flex items-center gap-2 p-2 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800">
              <span className="text-base">⚖️</span>
              <div className="flex-1 text-[10px] text-gray-600 dark:text-gray-400">
                <b className="text-red-600 dark:text-red-400">vs 线性增长</b>：同时段线性增长只有 <b>{(1 + 30 * time).toFixed(0)}</b> 个，
                而指数增长已达 <b>{fn(time).toFixed(0)}</b> 个——差了 <b>{(fn(time) / Math.max(1, 1 + 30 * time)).toFixed(1)}×</b>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// ============================================================
// 8. RadioactiveDecay (node 14 - 对数函数)
//    "放射性衰变"：展示指数衰减与对数的关系
// ============================================================
export const RadioactiveDecay: React.FC = () => {
  const [halfLife, setHalfLife] = useState(3);
  const [time, setTime] = useState(5);

  const fn = (x: number) => Math.pow(0.5, x / halfLife) * 100;
  const xMin = 0, xMax = 15, yMin = 0, yMax = 110;
  const decayPath = curve(fn, xMin, xMax, yMin, yMax);

  const remaining = fn(time);
  const halfLives = time / halfLife;

  return (
    <div className="space-y-3">
      <div className="grid grid-cols-2 gap-2">
        <PSlider label="半衰期 T" value={halfLife} min={1} max={8} step={0.5} onChange={setHalfLife} />
        <PSlider label="时间 t" value={time} min={0} max={14} step={0.1} onChange={setTime} fmt={v => v.toFixed(1)} />
      </div>

      {/* Substance visualization */}
      <div className="p-3 rounded-xl bg-gradient-to-br from-amber-50 to-orange-100 dark:from-amber-900/20 dark:to-orange-900/30 border border-amber-200 dark:border-amber-800">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-medium text-amber-700 dark:text-amber-300">☢ 放射性物质</span>
          <span className="text-sm font-bold text-amber-700 dark:text-amber-300">剩余 {remaining.toFixed(1)}%</span>
        </div>
        <div className="relative h-6 rounded-full bg-gray-200 dark:bg-gray-700 overflow-hidden">
          <div className="absolute left-0 top-0 h-full bg-gradient-to-r from-amber-400 to-orange-500 rounded-full transition-all" style={{ width: `${remaining}%` }} />
        </div>
      </div>

      <svg viewBox={`0 0 ${VW} ${VH}`} className="w-full bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800">
        <PlotFrame xMin={xMin} xMax={xMax} yMin={yMin} yMax={yMax} step={2} />
        {/* Decay curve */}
        <path d={decayPath} className="stroke-orange-500" strokeWidth={2.5} fill="none" />
        {/* Half-life markers */}
        {[1, 2, 3, 4].map(h => (
          <g key={h}>
            <line x1={sx(h * halfLife, xMin, xMax)} y1={sy(0, yMin, yMax)} x2={sx(h * halfLife, xMin, xMax)} y2={sy(fn(h * halfLife), yMin, yMax)} className="stroke-gray-300 dark:stroke-gray-600" strokeWidth={0.5} strokeDasharray="2 2" />
            <circle cx={sx(h * halfLife, xMin, xMax)} cy={sy(fn(h * halfLife), yMin, yMax)} r={3} className="fill-amber-400" />
            <text x={sx(h * halfLife, xMin, xMax) + 4} y={sy(fn(h * halfLife), yMin, yMax) - 4} className="fill-gray-400 dark:fill-gray-500" fontSize={8}>{(100 / Math.pow(2, h)).toFixed(0)}%</text>
          </g>
        ))}
        {/* Current time */}
        <circle cx={sx(time, xMin, xMax)} cy={sy(remaining, yMin, yMax)} r={5} className="fill-red-500" />
        <line x1={sx(time, xMin, xMax)} y1={sy(0, yMin, yMax)} x2={sx(time, xMin, xMax)} y2={sy(remaining, yMin, yMax)} className="stroke-red-300" strokeWidth={1} strokeDasharray="3 2" />
      </svg>

      <div className="p-2.5 rounded-lg bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800">
        <div className="text-sm font-mono text-orange-700 dark:text-orange-300">N(t) = 100 × (½)^(t/{halfLife.toFixed(1)})</div>
        <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
          已经过 {halfLives.toFixed(2)} 个半衰期 → 剩余 {remaining.toFixed(1)}%
        </div>
      </div>

      <Insight>每过一个半衰期，物质就剩一半。这就是对数函数的现实意义：t = T × log₂(100/剩余量)。碳-14 测年法就是用这个原理！</Insight>

      {/* 半衰期含义图解 */}
      <div className="mt-1">
        <div className="text-xs font-semibold text-gray-700 dark:text-gray-300 mb-2">☢ 半衰期与时间的关系</div>
        <div className="space-y-1.5">
          <div className="flex items-center gap-2 p-2 rounded-lg bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800">
            <span className="text-base">⏳</span>
            <div className="flex-1 text-[10px] text-gray-600 dark:text-gray-400">
              <b className="text-amber-600 dark:text-amber-400">半衰期 T = {halfLife.toFixed(1)}</b>：物质衰减一半所需的时间。
              这是<b>物质的固有属性</b>——不管初始量多少，半衰期不变
            </div>
          </div>
          <div className="flex items-center gap-2 p-2 rounded-lg bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800">
            <span className="text-base">📐</span>
            <div className="flex-1 text-[10px] text-gray-600 dark:text-gray-400">
              <b className="text-blue-600 dark:text-blue-400">已过 {halfLives.toFixed(2)} 个半衰期</b>：
              剩余比例 = (½)^{halfLives.toFixed(2)} = <b>{remaining.toFixed(1)}%</b>
            </div>
          </div>
          <div className="flex items-center gap-2 p-2 rounded-lg bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800">
            <span className="text-base">🔄</span>
            <div className="flex-1 text-[10px] text-gray-600 dark:text-gray-400">
              <b className="text-purple-600 dark:text-purple-400">逆向使用</b>：测出剩余比例 → 反推年代。
              t = T × log₂(100/剩余量) = {halfLife.toFixed(1)} × log₂(100/{remaining.toFixed(1)}) = <b>{(halfLife * Math.log2(100 / remaining)).toFixed(2)}</b>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// ============================================================
// 9. LogScaleExperience (node 15 - 对数运算)
//    "对数尺体验"：线性 vs 对数刻度的直观对比
// ============================================================
export const LogScaleExperience: React.FC = () => {
  const [scale, setScale] = useState<'linear' | 'log'>('linear');
  const [base, setBase] = useState(10);

  const values = [1, 2, 5, 10, 20, 50, 100, 200, 500, 1000];

  // Position on a linear scale (0-1000 mapped to 0-1)
  const linearPos = (v: number) => v / 1000;
  // Position on a log scale
  const logPos = (v: number) => v > 0 ? Math.log(v) / Math.log(1000) : 0;

  const pos = scale === 'linear' ? linearPos : logPos;
  const barWidth = 360;

  return (
    <div className="space-y-3">
      <div className="flex gap-2">
        <button onClick={() => setScale('linear')} className={`px-3 py-1 text-xs rounded-lg transition-colors ${scale === 'linear' ? 'bg-blue-500 text-white' : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400'}`}>线性刻度</button>
        <button onClick={() => setScale('log')} className={`px-3 py-1 text-xs rounded-lg transition-colors ${scale === 'log' ? 'bg-orange-500 text-white' : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400'}`}>对数刻度</button>
      </div>

      <PSlider label="对数底数" value={base} min={2} max={10} step={1} onChange={setBase} />

      {/* Scale bar */}
      <div className="p-4 rounded-xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800">
        <svg viewBox={`0 0 ${barWidth + 40} 120`} className="w-full">
          {/* Bar */}
          <rect x="20" y="20" width={barWidth} height="20" rx="4" className="fill-gray-100 dark:fill-gray-800 stroke-gray-300 dark:stroke-gray-700" />
          {/* Tick marks */}
          {values.map((v, i) => {
            const x = 20 + pos(v) * barWidth;
            return (
              <g key={v}>
                <line x1={x} y1={18} x2={x} y2={42} className="stroke-gray-500 dark:stroke-gray-400" strokeWidth={1} />
                <text x={x} y={55} textAnchor="middle" className="fill-gray-600 dark:text-gray-400" fontSize={9}>{v}</text>
                {/* Spacing indicator */}
                {i > 0 && (
                  <line x1={20 + pos(values[i - 1]) * barWidth} y1={70} x2={x} y2={70} className="stroke-purple-400" strokeWidth={1.5} markerEnd="url(#arrowRight)" />
                )}
                {i > 0 && (
                  <text x={(20 + pos(values[i - 1]) * barWidth + x) / 2} y={85} textAnchor="middle" className="fill-purple-500 dark:fill-purple-400" fontSize={8}>
                    {(pos(v) - pos(values[i - 1])).toFixed(3)}
                  </text>
                )}
              </g>
            );
          })}
          <text x={20} y={110} className="fill-gray-400 dark:fill-gray-500" fontSize={9}>{scale === 'linear' ? '等距间隔——大数字挤在一起' : '等比间隔——每个倍数等距'}</text>
        </svg>
      </div>

      {/* Log computation */}
      <div className="grid grid-cols-3 gap-2">
        {[10, 100, 1000].map(v => (
          <div key={v} className="p-2 rounded-lg bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800 text-center">
            <div className="text-xs text-gray-500 dark:text-gray-400">log<sub>{base}</sub>({v})</div>
            <div className="text-sm font-bold text-orange-600 dark:text-orange-400">{(Math.log(v) / Math.log(base)).toFixed(2)}</div>
          </div>
        ))}
      </div>

      <Insight>{scale === 'linear' ? '线性刻度下，1→2 和 500→1000 的距离一样——但后者增长了 500，前者只增长 1！' : '对数刻度下，1→10、10→100、100→1000 的距离相等——因为它们是等比关系（×10）。'}</Insight>

      {/* 对数运算含义图解 */}
      <div className="mt-1">
        <div className="text-xs font-semibold text-gray-700 dark:text-gray-300 mb-2">🧮 logₐ(b) 的含义："几个 a 相乘等于 b？"</div>
        <div className="grid grid-cols-3 gap-2">
          {[10, 100, 1000].map(v => (
            <div key={v} className="p-2 rounded-lg bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800 text-center">
              <div className="text-[10px] text-gray-500 dark:text-gray-400">log<sub>{base}</sub>({v})</div>
              <div className="text-lg font-bold text-orange-600 dark:text-orange-400">{(Math.log(v) / Math.log(base)).toFixed(2)}</div>
              <div className="text-[10px] text-gray-400 mt-0.5">
                = {base}<sup>{(Math.log(v) / Math.log(base)).toFixed(2)}</sup> = {v}
              </div>
            </div>
          ))}
        </div>
        <div className="p-2.5 rounded-lg bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 mt-2 text-[10px] text-gray-600 dark:text-gray-400">
          <b className="text-blue-500">💡 关键直觉</b>：对数把<b>乘法变成加法</b>。
          log(a×b) = log(a) + log(b) —— 所以等比数列在对数刻度上变成等差数列（等距排列）。
          <br />📐 <b>现实应用</b>：地震震级（每+1级能量×~32）、声音分贝（每+10dB响度×10）、pH值（每-1酸度×10）
        </div>
      </div>

      <Scenario>对数把"乘法"变成"加法"：log(ab) = log(a) + log(b)。这就是对数运算的精髓——也是地震里氏震级、声音分贝的原理。</Scenario>
    </div>
  );
};

// ============================================================
// 10. InverseFunctionMirror (node 16 - 反函数)
//     "反函数镜像"：函数与反函数关于 y=x 对称
// ============================================================
export const InverseFunctionMirror: React.FC = () => {
  const [fnType, setFnType] = useState<'square' | 'exp' | 'linear'>('exp');
  const [a, setA] = useState(1.5);

  const fns = useMemo(() => {
    switch (fnType) {
      case 'square':
        return {
          f: (x: number) => a * x * x,
          inv: (y: number) => y >= 0 ? Math.sqrt(y / a) : NaN,
          domain: [0, 4] as [number, number],
          range: [0, 8] as [number, number],
          label: `f(x) = ${a.toFixed(1)}x²`,
          invLabel: `f⁻¹(x) = √(x/${a.toFixed(1)})`,
        };
      case 'exp':
        return {
          f: (x: number) => Math.pow(a, x),
          inv: (y: number) => y > 0 ? Math.log(y) / Math.log(a) : NaN,
          domain: [-2, 3] as [number, number],
          range: [0, 8] as [number, number],
          label: `f(x) = ${a.toFixed(1)}ˣ`,
          invLabel: `f⁻¹(x) = log${a.toFixed(1)}(x)`,
        };
      case 'linear':
        return {
          f: (x: number) => a * x + 1,
          inv: (y: number) => (y - 1) / a,
          domain: [-3, 4] as [number, number],
          range: [-4, 7] as [number, number],
          label: `f(x) = ${a.toFixed(1)}x + 1`,
          invLabel: `f⁻¹(x) = (x - 1)/${a.toFixed(1)}`,
        };
    }
  }, [fnType, a]);

  const xMin = -4, xMax = 6, yMin = -4, yMax = 8;
  const fPath = curve(fns.f, fns.domain[0], fns.domain[1], yMin, yMax, 200);
  const invPath = curve(fns.inv, fns.range[0], fns.range[1], yMin, yMax, 200);
  const yxPath = curve(x => x, xMin, xMax, yMin, yMax);

  const [testX, setTestX] = useState(2);
  const testY = fns.f(testX);
  const testInvX = fns.inv(testY);

  return (
    <div className="space-y-3">
      <div className="flex gap-2 flex-wrap">
        {([['exp', '指数↔对数'], ['square', '平方↔开方'], ['linear', '线性']] as const).map(([k, label]) => (
          <button key={k} onClick={() => setFnType(k)} className={`px-3 py-1 text-xs rounded-lg transition-colors ${fnType === k ? 'bg-cyan-500 text-white' : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700'}`}>{label}</button>
        ))}
      </div>
      <PSlider label="参数 a" value={a} min={0.5} max={3} step={0.1} onChange={setA} />
      <PSlider label="测试点 x" value={testX} min={fns.domain[0]} max={fns.domain[1]} step={0.1} onChange={setTestX} fmt={v => v.toFixed(1)} />

      <svg viewBox={`0 0 ${VW} ${VH}`} className="w-full bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800">
        <PlotFrame xMin={xMin} xMax={xMax} yMin={yMin} yMax={yMax} step={1} />
        {/* y = x line */}
        <path d={yxPath} className="stroke-gray-400 dark:stroke-gray-500" strokeWidth={1.5} strokeDasharray="5 3" fill="none" />
        {/* Function */}
        <path d={fPath} className="stroke-blue-500" strokeWidth={2.5} fill="none" />
        {/* Inverse */}
        <path d={invPath} className="stroke-orange-500" strokeWidth={2.5} fill="none" />
        {/* Test point */}
        {isFinite(testY) && (
          <>
            <circle cx={sx(testX, xMin, xMax)} cy={sy(testY, yMin, yMax)} r={5} className="fill-blue-500" />
            <line x1={sx(testX, xMin, xMax)} y1={sy(testY, yMin, yMax)} x2={sx(testY, xMin, xMax)} y2={sy(testY, yMin, yMax)} className="stroke-blue-300" strokeWidth={1} strokeDasharray="3 2" />
            <line x1={sx(testY, xMin, xMax)} y1={sy(testY, yMin, yMax)} x2={sx(testY, xMin, xMax)} y2={sy(testX, yMin, yMax)} className="stroke-blue-300" strokeWidth={1} strokeDasharray="3 2" />
            <circle cx={sx(testY, xMin, xMax)} cy={sy(testX, yMin, yMax)} r={5} className="fill-orange-500" />
            {/* Mirror line between points */}
            <line x1={sx(testX, xMin, xMax)} y1={sy(testY, yMin, yMax)} x2={sx(testY, xMin, xMax)} y2={sy(testX, yMin, yMax)} className="stroke-purple-400" strokeWidth={1.5} strokeDasharray="2 2" />
          </>
        )}
      </svg>

      <div className="flex gap-2 text-xs">
        <span className="px-2 py-0.5 rounded bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300">🔵 {fns.label}</span>
        <span className="px-2 py-0.5 rounded bg-orange-100 dark:bg-orange-900/40 text-orange-700 dark:text-orange-300">🟠 {fns.invLabel}</span>
      </div>
      <div className="text-xs text-gray-500 dark:text-gray-400 text-center">
        f({testX.toFixed(1)}) = {testY.toFixed(2)} → f⁻¹({testY.toFixed(2)}) = {isFinite(testInvX) ? testInvX.toFixed(2) : '?'}
      </div>
      <Insight>反函数就是把原函数的 x 和 y 互换——所以图像关于 y=x 对称。蓝点 (x, f(x)) 和橙点 (f(x), x) 互为镜像！</Insight>

      {/* 反函数含义图解 */}
      <div className="mt-1">
        <div className="text-xs font-semibold text-gray-700 dark:text-gray-300 mb-2">🔄 "去"与"回"的含义</div>
        <div className="grid grid-cols-2 gap-2">
          <div className="p-2.5 rounded-lg bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800">
            <div className="text-xs font-bold text-blue-600 dark:text-blue-400">🔵 原函数 f</div>
            <div className="text-[10px] text-gray-500 dark:text-gray-400 mt-0.5">"去"：x → y</div>
            <div className="text-[10px] font-mono text-gray-600 dark:text-gray-400 mt-1">
              输入 x = {testX.toFixed(1)}<br />→ 输出 y = {testY.toFixed(2)}
            </div>
          </div>
          <div className="p-2.5 rounded-lg bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800">
            <div className="text-xs font-bold text-orange-600 dark:text-orange-400">🟠 反函数 f⁻¹</div>
            <div className="text-[10px] text-gray-500 dark:text-gray-400 mt-0.5">"回"：y → x（原路返回）</div>
            <div className="text-[10px] font-mono text-gray-600 dark:text-gray-400 mt-1">
              输入 y = {testY.toFixed(2)}<br />→ 输出 x = {isFinite(testInvX) ? testInvX.toFixed(2) : '?'}
            </div>
          </div>
        </div>
        <div className="p-2.5 rounded-lg bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-blue-800 mt-2 text-[10px] text-gray-600 dark:text-gray-400">
          <b className="text-purple-500">✓ 验证</b>：f⁻¹(f(x)) = x → 先"去"再"回"回到起点。
          <br />⚠ <b>注意</b>：反函数要存在，原函数必须是<b>一一对应</b>的（不能有"多对一"）。
          所以 y = x² 只在 x ≥ 0 上才有反函数 y = √x。
        </div>
      </div>
    </div>
  );
};

type EnhancedVisuals2Mode = 'quadratic' | 'power' | 'exponential' | 'decay' | 'log-scale' | 'inverse';

const EnhancedVisuals2: React.FC<{ mode: EnhancedVisuals2Mode }> = ({ mode }) => {
  switch (mode) {
    case 'quadratic': return <QuadraticTrinity />;
    case 'power': return <PowerFunctionFamily />;
    case 'exponential': return <BacteriaGrowth />;
    case 'decay': return <RadioactiveDecay />;
    case 'log-scale': return <LogScaleExperience />;
    case 'inverse': return <InverseFunctionMirror />;
    default: return null;
  }
};

export default EnhancedVisuals2;
