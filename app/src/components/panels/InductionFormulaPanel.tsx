import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { cn } from '@/lib/utils';

interface FormulaRule {
  name: string;
  angle: string;
  sin: string;
  cos: string;
  tan: string;
  mnemonic?: string;
}

const inductionRules: FormulaRule[] = [
  {
    name: '公式一',
    angle: '2kπ + α',
    sin: 'sin α',
    cos: 'cos α',
    tan: 'tan α',
    mnemonic: '周期不变',
  },
  {
    name: '公式二',
    angle: 'π + α',
    sin: '-sin α',
    cos: '-cos α',
    tan: 'tan α',
    mnemonic: 'π+α：正弦余弦都变号',
  },
  {
    name: '公式三',
    angle: '-α',
    sin: '-sin α',
    cos: 'cos α',
    tan: '-tan α',
    mnemonic: '负角：正弦正切变号，余弦不变',
  },
  {
    name: '公式四',
    angle: 'π - α',
    sin: 'sin α',
    cos: '-cos α',
    tan: '-tan α',
    mnemonic: 'π-α：正弦不变，余弦正切变号',
  },
  {
    name: '公式五',
    angle: 'π/2 - α',
    sin: 'cos α',
    cos: 'sin α',
    tan: 'cot α',
    mnemonic: '互余：正弦余弦互换',
  },
  {
    name: '公式六',
    angle: 'π/2 + α',
    sin: 'cos α',
    cos: '-sin α',
    tan: '-cot α',
    mnemonic: 'π/2+α：互换+余弦变号',
  },
];

const quadrantSigns = [
  { quadrant: '第一象限', range: '0 ~ π/2', sin: '+', cos: '+', tan: '+', color: 'bg-green-50 text-green-700 border-green-200' },
  { quadrant: '第二象限', range: 'π/2 ~ π', sin: '+', cos: '-', tan: '-', color: 'bg-yellow-50 text-yellow-700 border-yellow-200' },
  { quadrant: '第三象限', range: 'π ~ 3π/2', sin: '-', cos: '-', tan: '+', color: 'bg-orange-50 text-orange-700 border-orange-200' },
  { quadrant: '第四象限', range: '3π/2 ~ 2π', sin: '-', cos: '+', tan: '-', color: 'bg-red-50 text-red-700 border-red-200' },
];

const InductionFormulaPanel: React.FC = () => {
  const [selectedFormula, setSelectedFormula] = useState<number | null>(null);

  return (
    <div className="h-full overflow-y-auto bg-white dark:bg-gray-900 p-4 transition-colors">
      <div className="mb-4">
        <h2 className="font-bold text-gray-800 dark:text-gray-100 text-lg">诱导公式</h2>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">奇变偶不变，符号看象限</p>
      </div>

      <Tabs defaultValue="formulas" className="w-full">
        <TabsList className="w-full grid grid-cols-2">
          <TabsTrigger value="formulas">六大公式</TabsTrigger>
          <TabsTrigger value="quadrants">象限符号</TabsTrigger>
        </TabsList>

        <TabsContent value="formulas" className="mt-3">
          <div className="space-y-2">
            {inductionRules.map((rule, idx) => (
              <button
                key={idx}
                onClick={() => setSelectedFormula(selectedFormula === idx ? null : idx)}
                className={cn(
                  "w-full text-left rounded-lg border p-3 transition-all",
                  selectedFormula === idx
                    ? "border-blue-300 bg-blue-50 ring-1 ring-blue-200"
                    : "border-gray-200 hover:border-gray-300 hover:bg-gray-50"
                )}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-semibold text-blue-700">{rule.name}</span>
                    <span className="text-sm text-gray-600 font-mono">({rule.angle})</span>
                  </div>
                </div>

                <div className="mt-2 grid grid-cols-3 gap-2 text-sm">
                  <div className="bg-white rounded px-2 py-1 border border-gray-100">
                    <span className="text-xs text-gray-400">sin</span>
                    <div className="font-mono text-gray-800">{rule.sin}</div>
                  </div>
                  <div className="bg-white rounded px-2 py-1 border border-gray-100">
                    <span className="text-xs text-gray-400">cos</span>
                    <div className="font-mono text-gray-800">{rule.cos}</div>
                  </div>
                  <div className="bg-white rounded px-2 py-1 border border-gray-100">
                    <span className="text-xs text-gray-400">tan</span>
                    <div className="font-mono text-gray-800">{rule.tan}</div>
                  </div>
                </div>

                {selectedFormula === idx && rule.mnemonic && (
                  <div className="mt-2 text-xs text-blue-600 bg-blue-100/50 rounded px-2 py-1.5">
                    记忆口诀: {rule.mnemonic}
                  </div>
                )}
              </button>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="quadrants" className="mt-3">
          <div className="grid grid-cols-2 gap-3">
            {quadrantSigns.map((q, idx) => (
              <div
                key={idx}
                className={cn(
                  "rounded-lg border p-3",
                  q.color
                )}
              >
                <h4 className="font-semibold text-sm">{q.quadrant}</h4>
                <p className="text-xs opacity-70 mt-0.5">{q.range}</p>
                <div className="mt-2 grid grid-cols-3 gap-1 text-center text-sm font-mono">
                  <div>
                    <div className="text-xs opacity-60">sin</div>
                    <div className="font-bold">{q.sin}</div>
                  </div>
                  <div>
                    <div className="text-xs opacity-60">cos</div>
                    <div className="font-bold">{q.cos}</div>
                  </div>
                  <div>
                    <div className="text-xs opacity-60">tan</div>
                    <div className="font-bold">{q.tan}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-4 p-3 bg-gray-50 rounded-lg border border-gray-200">
            <h4 className="text-sm font-semibold text-gray-700 mb-2">记忆口诀</h4>
            <div className="space-y-1.5 text-sm">
              <p className="text-gray-600">
                <span className="font-medium text-gray-800">一全正:</span> 第一象限全部为正
              </p>
              <p className="text-gray-600">
                <span className="font-medium text-gray-800">二正弦:</span> 第二象限只有正弦为正
              </p>
              <p className="text-gray-600">
                <span className="font-medium text-gray-800">三正切:</span> 第三象限只有正切为正
              </p>
              <p className="text-gray-600">
                <span className="font-medium text-gray-800">四余弦:</span> 第四象限只有余弦为正
              </p>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default InductionFormulaPanel;
