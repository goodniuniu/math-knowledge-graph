import { useState } from 'react';
import { Button } from '@/components/ui/button';

type Operation = 'overview' | 'union' | 'intersection' | 'complement-a' | 'complement-b' | 'difference-a' | 'subset';

const operations: { key: Operation; label: string; formula: string }[] = [
  { key: 'overview', label: '全集', formula: 'U' },
  { key: 'union', label: '并集', formula: 'A ∪ B' },
  { key: 'intersection', label: '交集', formula: 'A ∩ B' },
  { key: 'complement-a', label: 'A 的补集', formula: '∁UA' },
  { key: 'difference-a', label: 'A 差 B', formula: 'A \\ B' },
  { key: 'subset', label: '子集关系', formula: 'A ⊆ B' },
];

const colors: Record<Operation, { a: string; b: string; fillA: string; fillB: string; fillInter: string; label: string }> = {
  overview:     { a: '#3b82f6', b: '#10b981', fillA: 'rgba(59,130,246,0.25)', fillB: 'rgba(16,185,129,0.25)', fillInter: 'rgba(139,92,246,0.3)', label: '集合 A 和集合 B' },
  union:        { a: '#f59e0b', b: '#f59e0b', fillA: 'rgba(245,158,11,0.35)', fillB: 'rgba(245,158,11,0.35)', fillInter: 'rgba(245,158,11,0.5)', label: 'A ∪ B（橙色区域）' },
  intersection: { a: '#e5e7eb', b: '#e5e7eb', fillA: 'rgba(0,0,0,0.03)', fillB: 'rgba(0,0,0,0.03)', fillInter: 'rgba(245,158,11,0.6)', label: 'A ∩ B（橙色区域）' },
  'complement-a': { a: '#e5e7eb', b: '#e5e7eb', fillA: 'rgba(0,0,0,0.03)', fillB: 'rgba(239,68,68,0.4)', fillInter: 'rgba(239,68,68,0.2)', label: '∁UA（红色区域）' },
  'complement-b': { a: '#e5e7eb', b: '#e5e7eb', fillA: 'rgba(239,68,68,0.4)', fillB: 'rgba(0,0,0,0.03)', fillInter: 'rgba(239,68,68,0.2)', label: '∁UB（红色区域）' },
  'difference-a': { a: '#e5e7eb', b: '#e5e7eb', fillA: 'rgba(59,130,246,0.4)', fillB: 'rgba(0,0,0,0.03)', fillInter: 'rgba(0,0,0,0.03)', label: 'A \\ B（蓝色区域）' },
  subset:        { a: '#8b5cf6', b: '#8b5cf6', fillA: 'rgba(139,92,246,0.4)', fillB: 'rgba(139,92,246,0.15)', fillInter: 'rgba(139,92,246,0.4)', label: 'A ⊆ B（A 是 B 的子集）' },
};

const VennDiagram: React.FC<{ variant?: 'sets' | 'relations' }> = ({ variant = 'sets' }) => {
  const [op, setOp] = useState<Operation>(variant === 'relations' ? 'subset' : 'overview');
  const c = colors[op];

  const cx1 = 280, cy1 = 210, r = 120;
  const cx2 = 400, cy2 = 210;

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm">
      <div className="flex justify-center">
        <svg width={700} height={420} style={{ borderRadius: '8px', border: '1px solid #e5e7eb', background: '#fff' }}>
          {/* Rectangle for universal set */}
          <rect x="20" y="30" width="660" height="370" fill="#f9fafb" stroke="#d1d5db" strokeWidth="2" rx="8" />
          <text x="35" y="55" fontSize="14" fill="#6b7280" fontWeight="bold">U（全集）</text>

          {/* Circle A */}
          <circle cx={cx1} cy={cy1} r={r} fill={c.fillA} stroke={c.a} strokeWidth="2.5" />
          {/* Circle B */}
          {op === 'subset' ? (
            <circle cx={cx2 - 30} cy={cy2} r={r + 40} fill={c.fillB} stroke={c.b} strokeWidth="2.5" fillOpacity="0.15" />
          ) : (
            <circle cx={cx2} cy={cy2} r={r} fill={c.fillB} stroke={c.b} strokeWidth="2.5" />
          )}

          {/* Intersection highlight */}
          {op === 'intersection' && (
            <clipPath id="clip-a">
              <circle cx={cx1} cy={cy1} r={r} />
            </clipPath>
          )}
          {op === 'intersection' && (
            <circle cx={cx2} cy={cy2} r={r} fill={c.fillInter} clipPath="url(#clip-a)" />
          )}

          {/* Labels */}
          <text x={op === 'subset' ? cx1 - 40 : cx1 - 50} y={cy1 + 5} fontSize="20" fontWeight="bold" fill={c.a === '#e5e7eb' ? '#9ca3af' : c.a}>A</text>
          <text x={op === 'subset' ? cx2 + 50 : cx2 + 40} y={cy2 + 5} fontSize="20" fontWeight="bold" fill={c.b === '#e5e7eb' ? '#9ca3af' : c.b}>B</text>

          {/* Description */}
          <text x="350" y="390" textAnchor="middle" fontSize="14" fill="#374151" fontWeight="600">{c.label}</text>

          {/* Elements */}
          {op === 'overview' && (
            <>
              <text x={cx1 - 70} y={cy1 + 30} fontSize="13" fill="#3b82f6">1, 2, 3</text>
              <text x={cx2 - 20} y={cy2 + 30} fontSize="13" fill="#10b981">3, 4, 5</text>
              <text x={(cx1 + cx2) / 2 - 5} y={cy1 - 5} fontSize="13" fill="#8b5cf6" fontWeight="bold">3</text>
            </>
          )}
        </svg>
      </div>

      <div className="mt-4 flex flex-wrap gap-2 justify-center">
        {operations.map((o) => (
          <Button
            key={o.key}
            size="sm"
            variant={op === o.key ? 'default' : 'outline'}
            onClick={() => setOp(o.key)}
            className="text-xs"
          >
            {o.label}
            <span className="ml-1 opacity-60 font-mono">{o.formula}</span>
          </Button>
        ))}
      </div>
    </div>
  );
};

export default VennDiagram;
