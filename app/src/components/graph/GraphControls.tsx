import React from 'react';
import { Slider } from '@/components/ui/slider';
import { graphConfigs, type GraphParam } from '@/data/knowledgeData';
import { RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface GraphControlsProps {
  graphType: string;
  params: Record<string, number>;
  onParamChange: (key: string, value: number) => void;
  onReset: () => void;
}

const GraphControls: React.FC<GraphControlsProps> = ({
  graphType,
  params,
  onParamChange,
  onReset,
}) => {
  const config = graphConfigs[graphType];
  if (!config) return null;

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4 space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="font-semibold text-gray-800">{config.title}</h3>
          <p className="text-xs text-gray-500 mt-1">{config.description}</p>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={onReset}
          className="h-8 px-2"
        >
          <RotateCcw className="w-4 h-4 mr-1" />
          重置
        </Button>
      </div>

      <div className="space-y-4">
        {config.params.map((param: GraphParam) => (
          <div key={param.key} className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium text-gray-700">
                {param.name}
              </label>
              <span className="text-sm font-mono bg-blue-50 text-blue-700 px-2 py-0.5 rounded">
                {(params[param.key] ?? param.default).toFixed(1)}
              </span>
            </div>
            <Slider
              value={[params[param.key] ?? param.default]}
              min={param.min}
              max={param.max}
              step={param.step}
              onValueChange={(vals) => onParamChange(param.key, vals[0])}
              className="w-full"
            />
            <div className="flex justify-between text-xs text-gray-400">
              <span>{param.min}</span>
              <span>{param.max}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Formula display */}
      <div className="mt-4 p-3 bg-gray-50 rounded-lg">
        <h4 className="text-xs font-semibold text-gray-500 uppercase mb-2">当前公式</h4>
        <FormulaDisplay graphType={graphType} params={params} />
      </div>
    </div>
  );
};

const FormulaDisplay: React.FC<{ graphType: string; params: Record<string, number> }> = ({ graphType, params }) => {
  const formatNum = (n: number) => {
    const fixed = n.toFixed(1);
    return fixed.endsWith('.0') ? fixed.slice(0, -2) : fixed;
  };

  const formulas: Record<string, string> = {
    'trig': `y = ${formatNum(params.A || 1)} sin(${formatNum(params.omega || 1)}x ${(params.phi || 0) >= 0 ? '+' : ''}${formatNum(params.phi || 0)})`,
    'exponential': `y = ${formatNum(params.a || 2)}^x`,
    'logarithm': `y = log_${formatNum(params.a || 2)}(x)`,
    'power': `y = x^${formatNum(params.n || 1)}`,
    'quadratic': `y = ${formatNum(params.a || 1)}x² ${(params.b || 0) >= 0 ? '+' : ''}${formatNum(params.b || 0)}x ${(params.c || 0) >= 0 ? '+' : ''}${formatNum(params.c || 0)}`,
    'conic-ellipse': `x²/${formatNum((params.a || 3) ** 2)} + y²/${formatNum((params.b || 2) ** 2)} = 1`,
    'conic-hyperbola': `x²/${formatNum((params.a || 2) ** 2)} - y²/${formatNum((params.b || 1.5) ** 2)} = 1`,
    'conic-parabola': `y² = ${formatNum(2 * (params.p || 2))}x`,
    'sequence-arithmetic': `aₙ = ${formatNum(params.a1 || 1)} + (n-1)×${formatNum(params.d || 1)}`,
    'sequence-geometric': `aₙ = ${formatNum(params.a1 || 1)} × ${formatNum(params.q || 2)}^(n-1)`,
  };

  return (
    <div className="font-mono text-sm text-blue-800 bg-white p-2 rounded border border-blue-100 text-center">
      {formulas[graphType] || '请选择一个图形类型'}
    </div>
  );
};

export default GraphControls;
