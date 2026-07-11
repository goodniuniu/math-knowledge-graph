import { useState, useMemo, useCallback } from 'react';
import { Slider } from '@/components/ui/slider';
import { ChevronDown, CheckCircle2, XCircle } from 'lucide-react';

/* ===================== 通用工具 ===================== */
function fmt(v: number, d = 2): string {
  const r = Math.round(v * Math.pow(10, d)) / Math.pow(10, d);
  return (Number.isInteger(r) ? r.toString() : r.toFixed(d)).toString();
}

function ticks(min: number, max: number, n: number): number[] {
  const arr: number[] = [];
  const s = (max - min) / n;
  for (let i = 0; i <= n; i++) arr.push(min + s * i);
  return arr;
}

/* ===================== 坐标系参数 ===================== */
const PLOT_W = 560;
const PLOT_H = 360;
const PL = 50, PR = 16, PT = 16, PB = 38;
const PW = PLOT_W - PL - PR;
const PH = PLOT_H - PT - PB;

interface PlotScale {
  xMin: number; xMax: number; yMin: number; yMax: number;
  X: (x: number) => number;
  Y: (y: number) => number;
}

function makeScale(xMin: number, xMax: number, yMin: number, yMax: number): PlotScale {
  return {
    xMin, xMax, yMin, yMax,
    X: (x: number) => PL + (x - xMin) / (xMax - xMin) * PW,
    Y: (y: number) => PT + PH - (y - yMin) / (yMax - yMin) * PH,
  };
}

function curvePath(f: (x: number) => number, xA: number, xB: number, s: PlotScale, samples = 200): string {
  let d = '';
  for (let i = 0; i <= samples; i++) {
    const x = xA + (xB - xA) * i / samples;
    const px = s.X(x), py = s.Y(f(x));
    d += (i === 0 ? 'M' : 'L') + px.toFixed(1) + ' ' + py.toFixed(1) + ' ';
  }
  return d;
}

/* ===================== SVG 坐标系组件 ===================== */
const PlotGrid: React.FC<{ scale: PlotScale }> = ({ scale }) => {
  const { xMin, xMax, yMin, yMax, X, Y } = scale;
  const xTicks = ticks(xMin, xMax, 6);
  const yTicks = ticks(yMin, yMax, 5);
  return (
    <g>
      {/* 网格线 */}
      {xTicks.map((t, i) => {
        const px = X(t);
        return (
          <g key={`xg${i}`}>
            <line x1={px} y1={PT} x2={px} y2={PT + PH} stroke="#eef2f7" strokeWidth={1} />
            <text x={px} y={PT + PH + 16} fontSize={11} fill="#64748b" textAnchor="middle">{fmt(t, 0)}</text>
          </g>
        );
      })}
      {yTicks.map((t, i) => {
        const py = Y(t);
        return (
          <g key={`yg${i}`}>
            <line x1={PL} y1={py} x2={PL + PW} y2={py} stroke="#eef2f7" strokeWidth={1} />
            <text x={PL - 8} y={py + 4} fontSize={11} fill="#64748b" textAnchor="end">{fmt(t, 0)}</text>
          </g>
        );
      })}
      {/* 坐标轴 */}
      <line x1={PL} y1={PT} x2={PL} y2={PT + PH} stroke="#334155" strokeWidth={1.5} />
      <line x1={PL} y1={PT + PH} x2={PL + PW} y2={PT + PH} stroke="#334155" strokeWidth={1.5} />
      <text x={PL + PW} y={PT + PH + 32} fontSize={12} fill="#475569" textAnchor="end">x</text>
      <text x={PL - 28} y={PT - 2} fontSize={12} fill="#475569">y</text>
    </g>
  );
};

/* ===================== Tab 按钮 ===================== */
type TabId = 'linear' | 'quadratic' | 'piecewise' | 'flow' | 'quiz';

const TAB_CONFIG: { id: TabId; label: string; color: string }[] = [
  { id: 'linear', label: '一次函数应用', color: 'blue' },
  { id: 'quadratic', label: '二次函数应用', color: 'orange' },
  { id: 'piecewise', label: '分段函数应用', color: 'green' },
  { id: 'flow', label: '解题流程', color: 'purple' },
  { id: 'quiz', label: '互动测验', color: 'pink' },
];

const TAB_ACTIVE_BG: Record<string, string> = {
  blue: 'bg-blue-600 text-white shadow-blue-500/30',
  orange: 'bg-orange-600 text-white shadow-orange-500/30',
  green: 'bg-green-600 text-white shadow-green-500/30',
  purple: 'bg-purple-600 text-white shadow-purple-500/30',
  pink: 'bg-pink-600 text-white shadow-pink-500/30',
};

/* ===================== 滑块行组件 ===================== */
const SliderRow: React.FC<{
  label: string;
  value: number;
  displayValue: string;
  min: number; max: number; step: number;
  color: string;
  onChange: (v: number) => void;
}> = ({ label, value, displayValue, min, max, step, color, onChange }) => {
  const colorMap: Record<string, string> = {
    blue: 'text-blue-600 dark:text-blue-400',
    orange: 'text-orange-600 dark:text-orange-400',
    green: 'text-green-600 dark:text-green-400',
  };
  return (
    <div>
      <label className={`text-xs font-semibold flex items-center gap-1 mb-1.5 ${colorMap[color] || 'text-gray-700 dark:text-gray-300'}`}>
        {label}
        <span className="font-bold">{displayValue}</span>
      </label>
      <Slider value={[value]} min={min} max={max} step={step} onValueChange={(v) => onChange(v[0])} />
    </div>
  );
};

/* ===================== 警告框 ===================== */
const WarnBox: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div className="mt-3 flex gap-2 items-start bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 border-l-4 border-l-yellow-400 rounded-r-lg px-3.5 py-2.5 text-xs text-yellow-800 dark:text-yellow-200">
    <span className="text-base leading-none">⚠️</span>
    <div>{children}</div>
  </div>
);

/* ===================== 场景描述 ===================== */
const Scenario: React.FC<{ color: string; children: React.ReactNode }> = ({ color, children }) => {
  const colorMap: Record<string, string> = {
    blue: 'border-blue-400 bg-blue-50/50 dark:bg-blue-900/15 dark:border-blue-700',
    orange: 'border-orange-400 bg-orange-50/50 dark:bg-orange-900/15 dark:border-orange-700',
    green: 'border-green-400 bg-green-50/50 dark:bg-green-900/15 dark:border-green-700',
  };
  return (
    <div className={`border-l-4 rounded-r-lg px-3.5 py-2.5 text-xs text-gray-600 dark:text-gray-300 mb-3 ${colorMap[color] || ''}`}>
      {children}
    </div>
  );
};

/* ===================== 公式展示 ===================== */
const FormulaBox: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div className="text-center py-2.5 px-3 bg-gray-50 dark:bg-gray-800 rounded-lg mb-3 text-sm text-gray-800 dark:text-gray-200 font-serif">
    {children}
  </div>
);

/* ===================== 结果标签 ===================== */
const ResultChip: React.FC<{ color: string; children: React.ReactNode }> = ({ color, children }) => {
  const colorMap: Record<string, string> = {
    blue: 'bg-blue-50 border-blue-200 text-blue-700 dark:bg-blue-900/30 dark:border-blue-800 dark:text-blue-300',
    orange: 'bg-orange-50 border-orange-200 text-orange-700 dark:bg-orange-900/30 dark:border-orange-800 dark:text-orange-300',
    green: 'bg-green-50 border-green-200 text-green-700 dark:bg-green-900/30 dark:border-green-800 dark:text-green-300',
  };
  return (
    <div className={`inline-flex items-center gap-1 px-3 py-1.5 rounded-lg border text-xs font-semibold ${colorMap[color] || ''}`}>
      {children}
    </div>
  );
};

/* ===================== ① 一次函数 Tab ===================== */
const LinearTab: React.FC = () => {
  const [k, setK] = useState(3);
  const [b, setB] = useState(20);
  const [x, setX] = useState(15);

  const y = k * x + b;
  const xMax = 100;
  const yMax = Math.max(10, Math.ceil((k * xMax + b) * 1.08 / 10) * 10);
  const scale = useMemo(() => makeScale(0, xMax, 0, yMax), [xMax, yMax]);

  const linePath = curvePath(t => k * t + b, 0, xMax, scale);
  const cxp = scale.X(x), cyp = scale.Y(y);

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <span className="w-2.5 h-2.5 rounded-full bg-blue-500" />
        <h4 className="font-bold text-sm text-gray-800 dark:text-gray-100">手机流量套餐计费（一次函数模型）</h4>
      </div>
      <Scenario color="blue">
        某运营商套餐：月租 <b>b</b> 元，超出赠送额度后每使用 1 GB 流量收费 <b>k</b> 元。
        设当月使用流量为 <b>x</b> GB，则总费用 <b>y = kx + b</b>（简化线性模型）。
      </Scenario>
      <FormulaBox>y = k · x + b</FormulaBox>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <SliderRow label="单价系数 k =" displayValue={`${fmt(k, 1)} 元/GB`} value={k} min={1} max={8} step={0.5} color="blue" onChange={setK} />
        <SliderRow label="月租 b =" displayValue={`${fmt(b, 0)} 元`} value={b} min={0} max={50} step={1} color="blue" onChange={setB} />
        <SliderRow label="使用量 x =" displayValue={`${fmt(x, 1)} GB`} value={x} min={0} max={100} step={0.5} color="blue" onChange={setX} />
      </div>

      <div className="flex justify-center overflow-x-auto">
        <svg viewBox={`0 0 ${PLOT_W} ${PLOT_H}`} width={PLOT_W} height={PLOT_H} className="max-w-full h-auto bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700">
          <PlotGrid scale={scale} />
          {/* 直线 */}
          <path d={linePath} fill="none" stroke="#2563eb" strokeWidth={2.5} />
          {/* 封顶虚线 */}
          <line x1={scale.X(xMax)} y1={PT} x2={scale.X(xMax)} y2={PT + PH} stroke="#f59e0b" strokeWidth={1.2} strokeDasharray="5 4" />
          <text x={scale.X(xMax)} y={PT - 3} fontSize={10} fill="#b45309" textAnchor="middle">封顶100GB</text>
          {/* 当前点 */}
          <line x1={cxp} y1={PT + PH} x2={cxp} y2={cyp} stroke="#dc2626" strokeWidth={1} strokeDasharray="3 3" />
          <circle cx={cxp} cy={cyp} r={5} fill="#dc2626" />
          <text x={cxp + 8} y={cyp - 6} fontSize={11} fill="#dc2626" fontWeight="bold">(x, y)=({fmt(x, 1)}, {fmt(y, 1)})</text>
        </svg>
      </div>

      <div className="flex flex-wrap gap-2">
        <ResultChip color="blue">当前费用 y = <b className="text-sm">{fmt(y, 1)}</b> 元</ResultChip>
      </div>

      <WarnBox>
        <b>定义域提醒：</b>实际中 x ≥ 0（流量非负），且套餐通常封顶 100 GB（超出断网），故合理定义域为
        <b> 0 ≤ x ≤ 100</b>。另外若按整 GB 计费，x 应取非负整数，图像为离散点而非连续直线。
      </WarnBox>
    </div>
  );
};

/* ===================== ② 二次函数 Tab ===================== */
const QuadraticTab: React.FC = () => {
  const [m, setM] = useState(10);
  const [n, setN] = useState(300);
  const [p, setP] = useState(10);
  const [x, setX] = useState(20);

  const xLo = m;
  const xHi = n / p;
  const xStar = (p * m + n) / (2 * p);
  const yMax = (n - p * m) * (n - p * m) / (4 * p);
  const f = useCallback((t: number) => (t - m) * (n - p * t), [m, n, p]);
  const yCur = f(x);
  const xClamped = Math.max(xLo, Math.min(xHi, x));

  const yTop = Math.max(yMax * 1.12, 10);
  const scale = useMemo(() => makeScale(Math.max(0, xLo - 2), xHi + 2, 0, yTop), [xLo, xHi, yTop]);
  const parabolaPath = curvePath(f, xLo, xHi, scale);
  const vx = scale.X(xStar), vy = scale.Y(yMax);
  const cxp = scale.X(xClamped), cyp = scale.Y(yCur);

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <span className="w-2.5 h-2.5 rounded-full bg-orange-500" />
        <h4 className="font-bold text-sm text-gray-800 dark:text-gray-100">商品利润最大化（二次函数模型）</h4>
      </div>
      <Scenario color="orange">
        某商品每件进价为 <b>m</b> 元。当售价定为 <b>x</b> 元时，每天销量为 <b>n − p·x</b> 件（价格越高销量越低）。
        每日利润 <b>y = (x − m)(n − p·x)</b>，是开口向下的二次函数，存在最大利润。
      </Scenario>
      <FormulaBox>y = (x − m)(n − p·x) = −p·x² + (pm + n)·x − mn</FormulaBox>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="text-xs font-semibold text-orange-600 dark:text-orange-400 mb-1.5 block">进价 m = <b>{fmt(m, 0)}</b> 元</label>
          <Slider value={[m]} min={5} max={40} step={1} onValueChange={(v) => setM(v[0])} />
        </div>
        <div>
          <label className="text-xs font-semibold text-orange-600 dark:text-orange-400 mb-1.5 block">基准销量 n = <b>{fmt(n, 0)}</b> 件</label>
          <Slider value={[n]} min={100} max={400} step={10} onValueChange={(v) => setN(v[0])} />
        </div>
        <div>
          <label className="text-xs font-semibold text-orange-600 dark:text-orange-400 mb-1.5 block">价格敏感度 p = <b>{fmt(p, 0)}</b></label>
          <Slider value={[p]} min={2} max={20} step={1} onValueChange={(v) => setP(v[0])} />
        </div>
        <div>
          <label className="text-xs font-semibold text-orange-600 dark:text-orange-400 mb-1.5 block">当前定价 x = <b>{fmt(xClamped, 1)}</b> 元</label>
          <Slider value={[xClamped]} min={xLo} max={xHi} step={0.5} onValueChange={(v) => setX(v[0])} />
        </div>
      </div>

      <div className="flex justify-center overflow-x-auto">
        <svg viewBox={`0 0 ${PLOT_W} ${PLOT_H}`} width={PLOT_W} height={PLOT_H} className="max-w-full h-auto bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700">
          <PlotGrid scale={scale} />
          {/* 定义域阴影 */}
          <rect x={scale.X(xLo)} y={PT} width={scale.X(xHi) - scale.X(xLo)} height={PH} fill="#ffedd5" opacity={0.5} />
          {/* 抛物线 */}
          <path d={parabolaPath} fill="none" stroke="#ea580c" strokeWidth={2.5} />
          {/* 顶点 */}
          <line x1={vx} y1={PT + PH} x2={vx} y2={vy} stroke="#dc2626" strokeWidth={1} strokeDasharray="3 3" />
          <circle cx={vx} cy={vy} r={6} fill="#dc2626" />
          <text x={vx} y={vy - 8} fontSize={11} fill="#dc2626" fontWeight="bold" textAnchor="middle">顶点({fmt(xStar, 1)}, {fmt(yMax, 0)})</text>
          {/* 当前点 */}
          <circle cx={cxp} cy={cyp} r={4.5} fill="#1d4ed8" />
          <text x={cxp + 8} y={cyp + 4} fontSize={10} fill="#1d4ed8">当前({fmt(xClamped, 1)}, {fmt(yCur, 0)})</text>
          {/* 定义域标注 */}
          <text x={scale.X(xLo)} y={PT + PH + 30} fontSize={10} fill="#b45309" textAnchor="middle">x=m</text>
          <text x={scale.X(xHi)} y={PT + PH + 30} fontSize={10} fill="#b45309" textAnchor="middle">x=n/p</text>
        </svg>
      </div>

      <div className="flex flex-wrap gap-2">
        <ResultChip color="orange">最优定价 x* = <b className="text-sm">{fmt(xStar, 1)}</b> 元</ResultChip>
        <ResultChip color="orange">最大利润 y_max = <b className="text-sm">{fmt(yMax, 0)}</b> 元</ResultChip>
        <ResultChip color="orange">当前利润 = <b className="text-sm">{fmt(yCur, 0)}</b> 元</ResultChip>
      </div>

      {/* ===== 利润函数各项含义图解 ===== */}
      <div className="mt-3">
        <div className="flex items-center gap-2 mb-2">
          <span className="w-2.5 h-2.5 rounded-full bg-orange-500" />
          <h4 className="font-bold text-sm text-gray-800 dark:text-gray-100">利润函数各项含义图解</h4>
        </div>

        <p className="text-xs text-gray-500 dark:text-gray-400 mb-3 leading-relaxed">
          利润函数 <span className="font-serif font-bold text-gray-700 dark:text-gray-200">y = (x − m)(n − p·x)</span>
          {' '}是两个因子的乘积——<b className="text-red-500">每件赚多少</b> × <b className="text-blue-500">每天卖几件</b>。下面对每一项给出图解。
        </p>

        {/* ① 因子拆解卡片 */}
        <div className="bg-orange-50/60 dark:bg-orange-900/15 rounded-lg p-3 mb-3 space-y-2">
          {/* 因子一：单件利润 */}
          <div className="flex items-center gap-3 p-2.5 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800">
            <span className="text-xl flex-shrink-0">🏷️</span>
            <div className="flex-1 min-w-0">
              <div className="flex items-baseline justify-between gap-2 flex-wrap">
                <span className="text-xs font-bold text-red-600 dark:text-red-400">因子一 · 单件利润</span>
                <span className="text-sm font-mono font-bold text-red-700 dark:text-red-300 whitespace-nowrap">
                  (x − m) = <b>{fmt(xClamped - m, 1)}</b> 元/件
                </span>
              </div>
              <div className="text-[10px] text-gray-500 dark:text-gray-400 mt-0.5">
                每卖一件商品赚的钱 = 售价 − 进价。售价越高，此项越大
              </div>
            </div>
          </div>

          {/* 分隔：此消彼长 */}
          <div className="flex items-center gap-2 text-[10px] text-gray-400 font-bold tracking-wider">
            <span className="flex-1 border-t border-dashed border-gray-300 dark:border-gray-600" />
            <span>× 此消彼长 →</span>
            <span className="flex-1 border-t border-dashed border-gray-300 dark:border-gray-600" />
          </div>

          {/* 因子二：日销量 */}
          <div className="flex items-center gap-3 p-2.5 rounded-lg bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800">
            <span className="text-xl flex-shrink-0">📦</span>
            <div className="flex-1 min-w-0">
              <div className="flex items-baseline justify-between gap-2 flex-wrap">
                <span className="text-xs font-bold text-blue-600 dark:text-blue-400">因子二 · 日销量</span>
                <span className="text-sm font-mono font-bold text-blue-700 dark:text-blue-300 whitespace-nowrap">
                  (n − p·x) = <b>{fmt(Math.max(0, n - p * xClamped), 0)}</b> 件
                </span>
              </div>
              <div className="text-[10px] text-gray-500 dark:text-gray-400 mt-0.5">
                每天能卖出多少件。价格越高，买的人越少，此项越小
              </div>
            </div>
          </div>

          {/* 分隔：等号 */}
          <div className="flex items-center gap-2 text-[10px] text-gray-400 font-bold tracking-wider">
            <span className="flex-1 border-t border-dashed border-gray-300 dark:border-gray-600" />
            <span>= 每日总利润</span>
            <span className="flex-1 border-t border-dashed border-gray-300 dark:border-gray-600" />
          </div>

          {/* 乘积：总利润 */}
          <div className="flex items-center gap-3 p-2.5 rounded-lg bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800">
            <span className="text-xl flex-shrink-0">💰</span>
            <div className="flex-1 min-w-0">
              <div className="flex items-baseline justify-between gap-2 flex-wrap">
                <span className="text-xs font-bold text-green-600 dark:text-green-400">每日总利润</span>
                <span className="text-sm font-mono font-bold text-green-700 dark:text-green-300 whitespace-nowrap">
                  y = <b>{fmt(f(xClamped), 0)}</b> 元
                </span>
              </div>
              <div className="text-[10px] text-gray-500 dark:text-gray-400 mt-0.5">
                = 单件利润 × 日销量。一增一减，乘积在"平衡点"最大
              </div>
            </div>
          </div>
        </div>

        {/* ② 矩形面积图解 */}
        {(() => {
          const CC = n / p - m;
          if (CC <= 0.5) return null;
          const uu = xClamped - m;
          const vv = CC - uu;

          // SVG 布局
          const RW = 340, RH = 310;
          const RL = 55, RRx = 30, RTp = 30, RBm = 60;
          const RPW = RW - RL - RRx;
          const RPH = RH - RTp - RBm;
          const RX = (u: number) => RL + (u / CC) * RPW;
          const RY = (v: number) => RTp + RPH - (v / CC) * RPH;
          const su = CC / 2;
          const areaNow = uu * vv;
          const areaMax = su * su;

          return (
            <div className="bg-orange-50/60 dark:bg-orange-900/15 rounded-lg p-3 mb-3">
              <div className="text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1.5">
                📐 矩形面积图解：为什么"平衡点"利润最大？
              </div>
              <div className="text-[10px] text-gray-500 dark:text-gray-400 mb-2 leading-relaxed">
                令 <b>u</b> = x − m（单件利润），<b>v</b> = n/p − x（需求因子），
                则 <b>u + v = {fmt(CC, 1)}</b>（定值，斜线上所有点都满足）。
                利润 y = p × u × v，即<b>与绿色矩形面积成正比</b>。
                拖动定价滑块，矩形沿斜线滑动——当<u>矩形变成正方形</u>（金色虚线框）时面积最大。
              </div>
              <div className="flex justify-center">
                <svg viewBox={`0 0 ${RW} ${RH}`} className="w-full max-w-xs bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700">
                  {/* 网格线 */}
                  {[0.25, 0.5, 0.75].map((f, i) => (
                    <g key={i}>
                      <line x1={RX(f * CC)} y1={RTp} x2={RX(f * CC)} y2={RTp + RPH} stroke="#f1f5f9" strokeWidth={1} />
                      <line x1={RL} y1={RY(f * CC)} x2={RL + RPW} y2={RY(f * CC)} stroke="#f1f5f9" strokeWidth={1} />
                    </g>
                  ))}

                  {/* 坐标轴 */}
                  <line x1={RL} y1={RTp + RPH} x2={RL + RPW} y2={RTp + RPH} stroke="#334155" strokeWidth={1.5} />
                  <line x1={RL} y1={RTp} x2={RL} y2={RTp + RPH} stroke="#334155" strokeWidth={1.5} />

                  {/* 刻度标签 */}
                  <text x={RL} y={RTp + RPH + 14} fontSize={9} fill="#94a3b8" textAnchor="middle">0</text>
                  <text x={RX(CC)} y={RTp + RPH + 14} fontSize={9} fill="#94a3b8" textAnchor="middle">{fmt(CC, 1)}</text>
                  <text x={RL - 6} y={RTp + RPH + 3} fontSize={9} fill="#94a3b8" textAnchor="end">0</text>
                  <text x={RL - 6} y={RTp + 3} fontSize={9} fill="#94a3b8" textAnchor="end">{fmt(CC, 1)}</text>

                  {/* 轴标题 */}
                  <text x={RL + RPW / 2} y={RH - 12} fontSize={9} fill="#64748b" textAnchor="middle">u = x − m（单件利润）</text>
                  <text fontSize={9} fill="#64748b" textAnchor="middle" transform={`rotate(-90 14 ${RTp + RPH / 2})`} x={14} y={RTp + RPH / 2}>v = n/p − x（需求因子）</text>

                  {/* 约束线 u + v = C */}
                  <line x1={RX(0)} y1={RY(CC)} x2={RX(CC)} y2={RY(0)} stroke="#64748b" strokeWidth={2} />
                  <text x={RX(CC) - 6} y={RY(0) - 8} fontSize={9} fill="#64748b" textAnchor="end" fontWeight="bold">u + v = {fmt(CC, 1)}</text>

                  {/* 最优正方形（金色虚线） */}
                  <rect x={RX(0)} y={RY(su)} width={RX(su) - RX(0)} height={RY(0) - RY(su)}
                    fill="#f59e0b" fillOpacity={0.06} stroke="#f59e0b" strokeWidth={1.5} strokeDasharray="5 3" rx={2} />
                  <text x={(RX(0) + RX(su)) / 2} y={(RY(su) + RY(0)) / 2} fontSize={8} fill="#b45309" textAnchor="middle" fontWeight="bold">最优</text>
                  <text x={(RX(0) + RX(su)) / 2} y={(RY(su) + RY(0)) / 2 + 12} fontSize={8} fill="#b45309" textAnchor="middle">正方形</text>

                  {/* 当前利润矩形（绿色填充） */}
                  <rect x={RX(0)} y={RY(vv)} width={RX(uu) - RX(0)} height={RY(0) - RY(vv)}
                    fill="#22c55e" fillOpacity={0.18} stroke="#16a34a" strokeWidth={2} rx={2} />

                  {/* 宽度标注（u值） */}
                  <line x1={RX(0)} y1={RY(0) + 22} x2={RX(uu)} y2={RY(0) + 22} stroke="#ef4444" strokeWidth={1} />
                  <line x1={RX(0)} y1={RY(0) + 18} x2={RX(0)} y2={RY(0) + 26} stroke="#ef4444" strokeWidth={1} />
                  <line x1={RX(uu)} y1={RY(0) + 18} x2={RX(uu)} y2={RY(0) + 26} stroke="#ef4444" strokeWidth={1} />
                  <text x={(RX(0) + RX(uu)) / 2} y={RY(0) + 37} fontSize={9} fill="#dc2626" textAnchor="middle" fontWeight="bold">
                    u = {fmt(uu, 1)}
                  </text>

                  {/* 高度标注（v值） */}
                  <text x={RX(uu) + 8} y={(RY(vv) + RY(0)) / 2 + 3} fontSize={9} fill="#2563eb" fontWeight="bold">
                    v = {fmt(vv, 1)}
                  </text>

                  {/* 面积标签（矩形内部） */}
                  <text x={(RX(0) + RX(uu)) / 2} y={(RY(vv) + RY(0)) / 2 - 2} fontSize={11} fill="#15803d" textAnchor="middle" fontWeight="bold">
                    面积 = {fmt(areaNow, 1)}
                  </text>
                  <text x={(RX(0) + RX(uu)) / 2} y={(RY(vv) + RY(0)) / 2 + 12} fontSize={8} fill="#16a34a" textAnchor="middle">
                    利润 = p × 面积 = {fmt(p * areaNow, 0)}
                  </text>

                  {/* 当前点 */}
                  <circle cx={RX(uu)} cy={RY(vv)} r={5} fill="#dc2626" stroke="#fff" strokeWidth={1.5} />

                  {/* 面积比较条 */}
                  <g transform={`translate(${RL}, ${RH - 4})`}>
                    <text x={0} y={-2} fontSize={8} fill="#64748b">当前面积 / 最大面积</text>
                    <rect x={70} y={-7} width={100} height={8} fill="#e2e8f0" rx={2} />
                    <rect x={70} y={-7} width={Math.max(2, (areaNow / Math.max(areaMax, 0.01)) * 100)} height={8} fill={areaNow >= areaMax * 0.95 ? '#22c55e' : '#f59e0b'} rx={2} />
                    <text x={178} y={0} fontSize={8} fill="#64748b" fontWeight="bold">{fmt((areaNow / Math.max(areaMax, 0.01)) * 100, 0)}%</text>
                  </g>
                </svg>
              </div>
            </div>
          );
        })()}

        {/* ③ 核心洞察 */}
        <div className="bg-gradient-to-r from-amber-50 to-yellow-50 dark:from-amber-900/20 dark:to-yellow-900/20 border border-amber-200 dark:border-amber-800 rounded-lg p-3 text-xs text-gray-700 dark:text-gray-300 leading-relaxed mb-3">
          <span className="font-bold text-amber-700 dark:text-amber-300">💡 直觉理解：</span>
          涨价让<b className="text-red-500">每件多赚</b>但<b className="text-blue-500">卖得更少</b>，
          降价则相反——两者互相拉扯，这就是利润曲线"先涨后跌"的根本原因。
          <b className="text-green-600 dark:text-green-400">最优定价在"平衡点"</b>：
          当 u = v（矩形为正方形）时面积最大，对应顶点 x* = {fmt(xStar, 1)} 元，最大利润 y_max = {fmt(yMax, 0)} 元。
        </div>
      </div>

      {/* 配方法推导 */}
      <div className="mt-2">
        <div className="flex items-center gap-2 mb-2">
          <span className="w-2.5 h-2.5 rounded-full bg-orange-500" />
          <h4 className="font-bold text-sm text-gray-800 dark:text-gray-100">配方法推导（求最值）</h4>
        </div>
        <div className="bg-orange-50/60 dark:bg-orange-900/15 rounded-lg p-3 text-xs text-gray-600 dark:text-gray-300 leading-relaxed font-serif space-y-1">
          <div>y = −p·x² + (pm + n)·x − mn</div>
          <div className="pl-4">= −p[ x² − <span className="inline-flex flex-col items-center align-middle mx-1"><span className="border-b border-current px-1">pm + n</span><span className="px-1">p</span></span>x ] − mn</div>
          <div className="pl-4">= −p[ (x − <span className="inline-flex flex-col items-center align-middle mx-1"><span className="border-b border-current px-1">pm + n</span><span className="px-1">2p</span></span>)² − (<span className="inline-flex flex-col items-center align-middle mx-1"><span className="border-b border-current px-1">pm + n</span><span className="px-1">2p</span></span>)² ] − mn</div>
          <div className="pl-4">= −p(x − x*)² + <span className="inline-flex flex-col items-center align-middle mx-1"><span className="border-b border-current px-1">(n − pm)²</span><span className="px-1">4p</span></span></div>
        </div>
        <div className="mt-2 text-xs text-gray-600 dark:text-gray-300 bg-orange-50/60 dark:bg-orange-900/15 rounded-lg p-2.5">
          ∴ 当 <b>x* = (pm + n)/(2p) = (n/p + m)/2</b> 时，利润取得最大值
          <b> y_max = (n − pm)²/(4p)</b>。图像顶点即最优点。
        </div>
      </div>

      {/* 均值不等式替代思路 */}
      <div className="mt-2">
        <div className="flex items-center gap-2 mb-2">
          <span className="w-2.5 h-2.5 rounded-full bg-orange-500" />
          <h4 className="font-bold text-sm text-gray-800 dark:text-gray-100">均值不等式的替代思路</h4>
        </div>
        <div className="text-xs text-gray-600 dark:text-gray-300 bg-orange-50/60 dark:bg-orange-900/15 rounded-lg p-2.5 leading-relaxed">
          利润 y = (x − m)(n − p·x) 可改写为 <b>y = p·(x − m)·(n/p − x)</b>。<br />
          令 u = x − m，v = n/p − x，则 <b>u + v = n/p − m</b>（为定值）。<br />
          由均值不等式，当 <b>u = v</b> 时乘积 uv 最大，即 x − m = n/p − x → <b>x = (m + n/p)/2 = x*</b>，与配方法结果一致。
        </div>
      </div>

      <WarnBox>
        <b>定义域提醒：</b>售价必须不低于进价才不亏本 → <b>x ≥ m</b>；同时销量不能为负 →
        <b> n − p·x ≥ 0 ⇒ x ≤ n/p</b>。故合理定义域为 <b>m ≤ x ≤ n/p</b>。若定价超出此区间，模型失去实际意义。
      </WarnBox>
    </div>
  );
};

/* ===================== ③ 分段函数 Tab ===================== */
const PiecewiseTab: React.FC = () => {
  const [a, setA] = useState(2);
  const [b, setB] = useState(3);
  const [c, setC] = useState(5);
  const [x, setX] = useState(15);

  const piecewiseY = useCallback((aa: number, bb: number, cc: number, xx: number) => {
    if (xx <= 12) return aa * xx;
    if (xx <= 18) return 12 * aa + bb * (xx - 12);
    return 12 * aa + 6 * bb + cc * (xx - 18);
  }, []);

  const y = piecewiseY(a, b, c, x);
  const section = x <= 12 ? '第一阶梯' : (x <= 18 ? '第二阶梯' : '第三阶梯');
  const xMax = 30;
  const yTopFull = piecewiseY(a, b, c, xMax);
  const yMax = Math.max(10, Math.ceil(yTopFull * 1.1 / 10) * 10);
  const scale = useMemo(() => makeScale(0, xMax, 0, yMax), [yMax]);
  const f = useCallback((t: number) => piecewiseY(a, b, c, t), [a, b, c, piecewiseY]);

  const seg1Path = curvePath(f, 0, 12, scale, 100);
  const seg2Path = curvePath(f, 12, 18, scale, 100);
  const seg3Path = curvePath(f, 18, xMax, scale, 100);

  const b1 = 12 * a, b2 = 12 * a + 6 * b;
  const cxp = scale.X(x), cyp = scale.Y(y);

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <span className="w-2.5 h-2.5 rounded-full bg-green-500" />
        <h4 className="font-bold text-sm text-gray-800 dark:text-gray-100">居民阶梯水费（分段函数模型）</h4>
      </div>
      <Scenario color="green">
        某地居民水费实行阶梯计价：用水量 <b>x</b>（吨）在 0–12 吨部分单价 <b>a</b> 元/吨；
        12–18 吨部分单价 <b>b</b> 元/吨；超过 18 吨部分单价 <b>c</b> 元/吨。总费用 <b>y</b> 由三段拼接而成。
      </Scenario>
      <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-3 mb-3 text-xs text-gray-700 dark:text-gray-300 font-serif leading-relaxed">
        <div>y = a·x , &nbsp; 0 ≤ x ≤ 12</div>
        <div className="pl-3">12a + b(x−12) , &nbsp; 12 &lt; x ≤ 18</div>
        <div className="pl-3">12a + 6b + c(x−18) , &nbsp; x &gt; 18</div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="text-xs font-semibold text-green-600 dark:text-green-400 mb-1.5 block">第一阶梯 a = <b>{fmt(a, 1)}</b> 元/吨</label>
          <Slider value={[a]} min={1} max={5} step={0.5} onValueChange={(v) => setA(v[0])} />
        </div>
        <div>
          <label className="text-xs font-semibold text-green-600 dark:text-green-400 mb-1.5 block">第二阶梯 b = <b>{fmt(b, 1)}</b> 元/吨</label>
          <Slider value={[b]} min={2} max={8} step={0.5} onValueChange={(v) => setB(v[0])} />
        </div>
        <div>
          <label className="text-xs font-semibold text-green-600 dark:text-green-400 mb-1.5 block">第三阶梯 c = <b>{fmt(c, 1)}</b> 元/吨</label>
          <Slider value={[c]} min={3} max={12} step={0.5} onValueChange={(v) => setC(v[0])} />
        </div>
        <div>
          <label className="text-xs font-semibold text-green-600 dark:text-green-400 mb-1.5 block">用水量 x = <b>{fmt(x, 1)}</b> 吨</label>
          <Slider value={[x]} min={0} max={30} step={0.5} onValueChange={(v) => setX(v[0])} />
        </div>
      </div>

      <div className="flex justify-center overflow-x-auto">
        <svg viewBox={`0 0 ${PLOT_W} ${PLOT_H}`} width={PLOT_W} height={PLOT_H} className="max-w-full h-auto bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700">
          <PlotGrid scale={scale} />
          {/* 三段曲线 */}
          <path d={seg1Path} fill="none" stroke="#22c55e" strokeWidth={2.5} />
          <path d={seg2Path} fill="none" stroke="#16a34a" strokeWidth={2.5} />
          <path d={seg3Path} fill="none" stroke="#15803d" strokeWidth={2.5} />
          {/* 边界点 */}
          <circle cx={scale.X(12)} cy={scale.Y(b1)} r={4.5} fill="#22c55e" stroke="#fff" strokeWidth={1.5} />
          <text x={scale.X(12) + 6} y={scale.Y(b1) - 6} fontSize={10} fill="#166534">(12, {fmt(b1, 0)})</text>
          <circle cx={scale.X(18)} cy={scale.Y(b2)} r={4.5} fill="#15803d" stroke="#fff" strokeWidth={1.5} />
          <text x={scale.X(18) + 6} y={scale.Y(b2) - 6} fontSize={10} fill="#166534">(18, {fmt(b2, 0)})</text>
          {/* 当前点 */}
          <line x1={cxp} y1={PT + PH} x2={cxp} y2={cyp} stroke="#dc2626" strokeWidth={1} strokeDasharray="3 3" />
          <circle cx={cxp} cy={cyp} r={5} fill="#dc2626" />
          <text x={cxp + 8} y={cyp - 6} fontSize={11} fill="#dc2626" fontWeight="bold">(x, y)=({fmt(x, 1)}, {fmt(y, 1)})</text>
          {/* 边界竖线 */}
          {[12, 18].map(bx => (
            <g key={bx}>
              <line x1={scale.X(bx)} y1={PT} x2={scale.X(bx)} y2={PT + PH} stroke="#94a3b8" strokeWidth={1} strokeDasharray="4 4" />
              <text x={scale.X(bx)} y={PT + PH + 30} fontSize={10} fill="#64748b" textAnchor="middle">x={bx}</text>
            </g>
          ))}
        </svg>
      </div>

      <div className="flex flex-wrap gap-2">
        <ResultChip color="green">当前水费 y = <b className="text-sm">{fmt(y, 1)}</b> 元</ResultChip>
        <ResultChip color="green">所在阶梯：<b className="text-sm">{section}</b></ResultChip>
      </div>

      <WarnBox>
        <b>边界值提醒：</b>分段函数在 <b>x = 12</b> 和 <b>x = 18</b> 处函数值连续（前段末值 = 后段初值），
        但<b>单价（斜率）发生跳跃</b>——这是"断点"的真正含义。计算时务必先用 x 判断所属区间，再代入对应解析式，
        切勿全程用单一单价。定义域：<b>x ≥ 0</b>。
      </WarnBox>
    </div>
  );
};

/* ===================== ④ 解题流程 Tab ===================== */
const FLOW_STEPS = [
  {
    title: '审题',
    body: '仔细阅读题目，弄清已知量与未知量，识别变量之间的依赖关系，判断适合用哪类函数模型（一次 / 二次 / 分段）。',
    example: '示例：题目说"每多生产 1 件，成本增加固定数额"→ 线性关系；"围成矩形，面积随边长变化"→ 二次关系；"不同区间单价不同"→ 分段关系。',
  },
  {
    title: '设未知数',
    body: '选取合适的自变量（通常用 x 表示"可变化的量"，如价格、用量、边长），因变量 y 表示要求的目标量（费用、利润、面积等）。',
    example: '示例：设售价为 x 元/件，则每日利润为 y 元。设用水量为 x 吨，则水费为 y 元。',
  },
  {
    title: '建立函数关系',
    body: '根据题意列等式，写出 y 关于 x 的解析式，并注明定义域（受实际背景限制）。',
    example: '示例：利润 y = (x − m)(n − p·x)，且 x ≥ m、x ≤ n/p；水费 y 为三段拼接，x ≥ 0。',
  },
  {
    title: '求解',
    body: '利用函数性质求解：一次函数看单调性；二次函数用配方法或顶点公式求最值；分段函数分段计算后比较。',
    example: '示例：二次函数在顶点 x* = (pm+n)/(2p) 处取最大值；分段函数需逐段代入再合并。',
  },
  {
    title: '还原实际意义',
    body: '把求出的数学结果翻译回实际语境，检验是否在定义域内、是否符合常理，并按题目要求取整或表述。这一步能发现"负值""超界""应取整数"等隐藏错误，是得分的关键。',
    example: '示例：算出最优定价 x* = 20.3 元，但实际标价只到角 → 取 20.3 元或比较 20 与 20.5 取更优者；算出利润为负 → 说明此定价亏本，应舍去。',
    isKey: true,
    keyNote: '⚠️ 常见失分：只写出"x = 20.3"就结束，却没说明"定价约 20.3 元时利润最大"；或求出两个数学解却未剔除不符合实际背景的那个。务必"还原"！',
  },
];

const FlowTab: React.FC = () => {
  const [openStep, setOpenStep] = useState<number | null>(0);
  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <span className="w-2.5 h-2.5 rounded-full bg-purple-500" />
        <h4 className="font-bold text-sm text-gray-800 dark:text-gray-100">函数应用题五步解题法</h4>
      </div>
      <p className="text-xs text-gray-500 dark:text-gray-400">
        点击每一步展开详细说明与示例。最后一步"还原实际意义"最易被忽视，却决定答案是否正确。
      </p>
      <div className="space-y-2">
        {FLOW_STEPS.map((step, idx) => {
          const isOpen = openStep === idx;
          const isKey = step.isKey;
          return (
            <div
              key={idx}
              className={`border rounded-lg overflow-hidden transition-all ${
                isOpen
                  ? isKey
                    ? 'border-pink-300 dark:border-pink-700 shadow-md shadow-pink-200/30'
                    : 'border-purple-300 dark:border-purple-700 shadow-md shadow-purple-200/30'
                  : 'border-gray-200 dark:border-gray-700'
              }`}
            >
              <button
                onClick={() => setOpenStep(isOpen ? null : idx)}
                className={`w-full flex items-center gap-3 px-4 py-3 text-left font-bold text-sm transition-colors ${
                  isKey ? 'text-pink-700 dark:text-pink-300' : 'text-gray-800 dark:text-gray-100'
                } hover:bg-gray-50 dark:hover:bg-gray-800/50`}
              >
                <span
                  className={`flex-shrink-0 w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold text-white ${
                    isKey ? 'bg-pink-600' : 'bg-purple-600'
                  }`}
                >
                  {idx + 1}
                </span>
                {step.title}
                {isKey && (
                  <span className="ml-auto text-[10px] bg-pink-100 dark:bg-pink-900/40 text-pink-700 dark:text-pink-300 px-2 py-0.5 rounded-full font-semibold">
                    ⭐ 最重要
                  </span>
                )}
                <ChevronDown className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''} ${isKey ? '' : 'text-gray-400'}`} />
              </button>
              {isOpen && (
                <div className="px-4 pb-4 pl-14 text-xs text-gray-600 dark:text-gray-300 space-y-2">
                  <p className="leading-relaxed">{step.body}</p>
                  <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-2.5 border border-dashed border-gray-200 dark:border-gray-700">
                    {step.example}
                  </div>
                  {step.keyNote && (
                    <div className="bg-pink-50 dark:bg-pink-900/15 rounded-lg p-2.5 border border-pink-200 dark:border-pink-800 text-pink-800 dark:text-pink-200">
                      {step.keyNote}
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

/* ===================== ⑤ 互动测验 Tab ===================== */
interface QuizItem {
  type: string;
  typeName: string;
  question: string;
  options: string[];
  answer: number;
  feedback: string;
}

const QUIZ_DATA: QuizItem[] = [
  {
    type: 't1', typeName: '一次函数·定义域',
    question: '某手机套餐月租 20 元，超出后每 GB 收 5 元。使用 8 GB 时费用为？',
    options: ['40 元', '60 元', '100 元', '160 元'], answer: 1,
    feedback: '费用 = 月租 + 单价×用量 = 20 + 5×8 = 60 元。易错点：忽略月租会误选 40，把 5×8 再乘什么会误选 160。',
  },
  {
    type: 't1', typeName: '一次函数·定义域',
    question: '上题模型中，用量 x（GB）的合理定义域是？',
    options: ['x ≥ 0', 'x ≥ 0 且 x ≤ 100（封顶）', 'x 为整数', 'x ≥ 20'], answer: 1,
    feedback: '流量非负且套餐封顶 100GB，故 0 ≤ x ≤ 100。易错点：忽略"封顶"这一实际限制，只写 x ≥ 0。',
  },
  {
    type: 't2', typeName: '二次函数·最值',
    question: '利润 y = (x − 10)(300 − 10x)（x 为售价），利润最大时的定价 x 为？',
    options: ['10 元', '15 元', '20 元', '30 元'], answer: 2,
    feedback: '顶点 x* = (pm+n)/(2p) = (10×10+300)/(2×10) = 20 元，此时 y=(10)(100)=1000 最大。易错点：以为越贵利润越高（选 30），或取亏本价 10。',
  },
  {
    type: 't2', typeName: '二次函数·定义域',
    question: '上述利润模型的合理定义域是？',
    options: ['x ≥ 10', '10 ≤ x ≤ 30', 'x ≤ 30', 'x ≥ 0'], answer: 1,
    feedback: '售价不低于进价 x ≥ 10，且销量非负 300−10x ≥ 0 ⇒ x ≤ 30，故 10 ≤ x ≤ 30。易错点：忽略销量非负的上限。',
  },
  {
    type: 't3', typeName: '分段函数·边界值',
    question: '阶梯水费：0–10 吨 2 元/吨，10–20 吨 3 元/吨，>20 吨 5 元/吨。用水 15 吨费用为？',
    options: ['30 元', '35 元', '45 元', '75 元'], answer: 1,
    feedback: '15 吨跨前两阶梯：2×10 + 3×5 = 35 元。易错点：全程用 2 元得 30（A），全程用 5 元得 75（D）。',
  },
  {
    type: 't3', typeName: '分段函数·断点',
    question: '上述水费函数在分界点 x = 10 处？',
    options: ['连续（无跳跃）', '有断点（函数值跳跃）', '无定义', '为常数'], answer: 0,
    feedback: '阶梯计价在边界处连续——前段末值(2×10=20) = 后段初值(20)，但单价(斜率)从 2 跳到 3。易错点：把"斜率跳跃"误认为"函数值跳跃"。',
  },
];

const QUIZ_TYPE_STYLE: Record<string, string> = {
  t1: 'bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300',
  t2: 'bg-orange-100 dark:bg-orange-900/40 text-orange-700 dark:text-orange-300',
  t3: 'bg-green-100 dark:bg-green-900/40 text-green-700 dark:text-green-300',
};

const QuizTab: React.FC = () => {
  const [answers, setAnswers] = useState<Record<number, number>>({});

  const done = Object.keys(answers).length;
  const right = Object.entries(answers).filter(([idx, val]) => QUIZ_DATA[+idx].answer === val).length;

  const handleAnswer = (qIdx: number, optIdx: number) => {
    if (answers[qIdx] !== undefined) return;
    setAnswers(prev => ({ ...prev, [qIdx]: optIdx }));
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <span className="w-2.5 h-2.5 rounded-full bg-pink-500" />
        <h4 className="font-bold text-sm text-gray-800 dark:text-gray-100">互动测验（考察定义域与边界值）</h4>
      </div>
      <div className="text-center text-sm text-gray-500 dark:text-gray-400">
        已答 <b className="text-pink-600 dark:text-pink-400 text-lg">{done}</b> / {QUIZ_DATA.length} 题　正确 <b className="text-pink-600 dark:text-pink-400 text-lg">{right}</b> 题
      </div>
      <div className="space-y-3">
        {QUIZ_DATA.map((item, idx) => {
          const userAnswer = answers[idx];
          const answered = userAnswer !== undefined;
          const isCorrect = answered && userAnswer === item.answer;
          return (
            <div key={idx} className="border border-pink-200 dark:border-pink-800 rounded-xl p-4 bg-white dark:bg-gray-900">
              <span className={`inline-block text-[11px] font-bold px-2.5 py-0.5 rounded-full mb-2 ${QUIZ_TYPE_STYLE[item.type]}`}>
                {item.typeName}
              </span>
              <div className="text-sm font-semibold text-gray-800 dark:text-gray-100 mb-3">
                {idx + 1}. {item.question}
              </div>
              <div className="space-y-2">
                {item.options.map((opt, oi) => {
                  const isAnswer = oi === item.answer;
                  const isUserPick = oi === userAnswer;
                  let cls = 'border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50 text-gray-600 dark:text-gray-300 hover:border-gray-300 dark:hover:border-gray-600';
                  if (answered) {
                    if (isAnswer) cls = 'border-green-300 dark:border-green-700 bg-green-50 dark:bg-green-900/30 text-green-700 dark:text-green-300 font-semibold';
                    else if (isUserPick) cls = 'border-red-300 dark:border-red-700 bg-red-50 dark:bg-red-900/30 text-red-700 dark:text-red-300';
                    else cls = 'border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/30 text-gray-400 dark:text-gray-600';
                  }
                  return (
                    <button
                      key={oi}
                      disabled={answered}
                      onClick={() => handleAnswer(idx, oi)}
                      className={`block w-full text-left border rounded-lg px-3.5 py-2.5 text-xs transition-all ${cls} ${!answered ? 'cursor-pointer' : 'cursor-default'}`}
                    >
                      {String.fromCharCode(65 + oi)}. {opt}
                      {answered && isAnswer && <CheckCircle2 className="inline-block w-4 h-4 ml-2" />}
                      {answered && isUserPick && !isAnswer && <XCircle className="inline-block w-4 h-4 ml-2" />}
                    </button>
                  );
                })}
              </div>
              {answered && (
                <div className={`mt-2 text-xs p-2.5 rounded-lg ${
                  isCorrect
                    ? 'bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 text-green-700 dark:text-green-300'
                    : 'bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-300'
                }`}>
                  <span className="font-bold">{isCorrect ? '✅ 回答正确！' : '❌ 回答错误。'}</span> {item.feedback}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

/* ===================== 主组件 ===================== */
const FunctionApplicationVisual: React.FC = () => {
  const [tab, setTab] = useState<TabId>('linear');

  return (
    <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-4 shadow-sm transition-colors">
      {/* Tab 导航 */}
      <div className="flex flex-wrap gap-2 justify-center mb-4">
        {TAB_CONFIG.map((t, i) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all ${
              tab === t.id
                ? `${TAB_ACTIVE_BG[t.color]} shadow-md`
                : 'bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700'
            }`}
          >
            {`①②③④⑤`[i]} {t.label}
          </button>
        ))}
      </div>

      {/* Tab 内容 */}
      <div className="overflow-x-auto">
        {tab === 'linear' && <LinearTab />}
        {tab === 'quadratic' && <QuadraticTab />}
        {tab === 'piecewise' && <PiecewiseTab />}
        {tab === 'flow' && <FlowTab />}
        {tab === 'quiz' && <QuizTab />}
      </div>
    </div>
  );
};

export default FunctionApplicationVisual;
