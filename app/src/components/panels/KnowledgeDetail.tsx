import React from 'react';
import { nodeContent } from '@/data/nodeContent';
import { getNodeDemo } from '@/data/demoConfig';
import type { KnowledgeNode } from '@/data/knowledgeData';
import Math from '@/components/Math';
import VectorCanvas from '@/components/graph/VectorCanvas';
import VennDiagram from '@/components/graph/VennDiagram';
import DistributionChart from '@/components/graph/DistributionChart';
import { MeanInequality, DerivativeTangent } from '@/components/graph/InequalityVisual';
import TrigIdentityVisual from '@/components/graph/TrigIdentityVisual';
import TrigDerivationVisual from '@/components/graph/TrigDerivationVisual';
import SimpleHarmonicMotion from '@/components/graph/SimpleHarmonicMotion';
import { ComplexPlane, Geometry3D, StatsVisual, CoordinateGraph, PascalTriangle, LogicVisual } from '@/components/graph/ExtraVisuals';
import FunctionApplicationVisual from '@/components/graph/FunctionApplicationVisual';
import { FunctionMachine, FunctionProperties, ZeroHunter, DerivativeCalculator } from '@/components/graph/EnhancedVisuals1';
import { QuadraticTrinity, PowerFunctionFamily, BacteriaGrowth, RadioactiveDecay, LogScaleExperience, InverseFunctionMirror } from '@/components/graph/EnhancedVisuals2';
import { UnitCircleExplorer, SymmetryMagic, FivePointDrawing, WaveSynthesizer, EllipseDrawing, HyperbolaExplorer, ParabolaSimulator, ArithmeticSequence, GeometricSequence } from '@/components/graph/EnhancedVisuals3';
import { BookOpen, Lightbulb, Sigma, Wrench, Eye, GraduationCap } from 'lucide-react';

interface KnowledgeDetailProps {
  node: KnowledgeNode;
}

const KnowledgeDetail: React.FC<KnowledgeDetailProps> = ({ node }) => {
  const content = nodeContent[node.id];
  const demoType = getNodeDemo(node.id);

  // Render the appropriate visual demo component
  const renderDemo = () => {
    if (!demoType) return null;
    switch (demoType) {
      case 'vector-ops':
        return <VectorCanvas mode="ops" />;
      case 'vector-coords':
        return <VectorCanvas mode="coords" />;
      case 'vector-triangle':
        return <VectorCanvas mode="triangle" />;
      case 'venn-sets':
        return <VennDiagram variant="sets" />;
      case 'venn-relations':
        return <VennDiagram variant="relations" />;
      case 'dist-normal':
        return <DistributionChart type="normal" />;
      case 'dist-binomial':
        return <DistributionChart type="binomial" />;
      case 'inequality-mean':
        return <MeanInequality />;
      case 'derivative-tangent':
        return <DerivativeTangent />;
      case 'trig-identity':
        return <TrigIdentityVisual />;
      case 'simple-harmonic':
        return <SimpleHarmonicMotion />;
      // 复数
      case 'complex-basic':
        return <ComplexPlane mode="basic" />;
      case 'complex-trig':
        return <ComplexPlane mode="trig" />;
      // 立体几何
      case 'geometry-position':
        return <Geometry3D mode="position" />;
      case 'geometry-parallel':
        return <Geometry3D mode="parallel" />;
      case 'geometry-perp':
        return <Geometry3D mode="perpendicular" />;
      // 统计
      case 'stats-histogram':
        return <StatsVisual mode="histogram" />;
      case 'stats-scatter':
        return <StatsVisual mode="scatter" />;
      case 'stats-regression':
        return <StatsVisual mode="regression" />;
      case 'stats-contingency':
        return <StatsVisual mode="contingency" />;
      // 坐标几何
      case 'coord-line':
        return <CoordinateGraph mode="line" />;
      case 'coord-circle':
        return <CoordinateGraph mode="circle" />;
      case 'coord-angle':
        return <CoordinateGraph mode="angle" />;
      // 排列组合
      case 'pascal':
        return <PascalTriangle mode="pascal" />;
      case 'combination':
        return <PascalTriangle mode="combination" />;
      // 逻辑
      case 'logic-condition':
        return <LogicVisual mode="condition" />;
      case 'logic-quantifier':
        return <LogicVisual mode="quantifier" />;
      case 'logic-inequality':
        return <LogicVisual mode="inequality" />;
      // 函数应用
      case 'function-application':
        return <FunctionApplicationVisual />;
      // 增强可视化 — P0（无基础图形 → 全新交互）
      case 'enhanced-function-machine':
        return <FunctionMachine />;
      case 'enhanced-properties':
        return <FunctionProperties />;
      case 'enhanced-zero-hunter':
        return <ZeroHunter />;
      case 'enhanced-derivative':
        return <DerivativeCalculator />;
      // 增强可视化 — 函数系列
      case 'enhanced-quadratic':
        return <QuadraticTrinity />;
      case 'enhanced-power':
        return <PowerFunctionFamily />;
      case 'enhanced-exponential':
        return <BacteriaGrowth />;
      case 'enhanced-decay':
        return <RadioactiveDecay />;
      case 'enhanced-log-scale':
        return <LogScaleExperience />;
      case 'enhanced-inverse':
        return <InverseFunctionMirror />;
      // 增强可视化 — 三角函数
      case 'enhanced-unit-circle':
        return <UnitCircleExplorer />;
      case 'enhanced-symmetry':
        return <SymmetryMagic />;
      case 'enhanced-five-point':
        return <FivePointDrawing />;
      case 'enhanced-wave':
        return <WaveSynthesizer />;
      // 增强可视化 — 圆锥曲线
      case 'enhanced-ellipse':
        return <EllipseDrawing />;
      case 'enhanced-hyperbola':
        return <HyperbolaExplorer />;
      case 'enhanced-parabola':
        return <ParabolaSimulator />;
      // 增强可视化 — 数列
      case 'enhanced-arithmetic':
        return <ArithmeticSequence />;
      case 'enhanced-geometric':
        return <GeometricSequence />;
      case 'number-line':
        return null; // 已被 enhanced-quadratic 替代
      default:
        return null;
    }
  };

  if (!content) {
    return (
      <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-6 text-center transition-colors">
        <BookOpen className="w-8 h-8 text-gray-300 dark:text-gray-600 mx-auto mb-2" />
        <p className="text-gray-400 dark:text-gray-500 text-sm">该知识点内容正在建设中</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* 交互可视化演示 */}
      {demoType && renderDemo() && (
        <section>
          <div className="flex items-center gap-2 mb-2 px-1">
            <Eye className="w-4 h-4 text-purple-600 dark:text-purple-400" />
            <h3 className="font-semibold text-gray-800 dark:text-gray-100 text-sm">形象化演示</h3>
            <span className="text-xs text-gray-400 dark:text-gray-500">拖动滑块或点击按钮进行交互</span>
          </div>
          {renderDemo()}
        </section>
      )}

      {/* 定义 / 概念 */}
      <section className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-5 shadow-sm transition-colors">
        <h3 className="flex items-center gap-2 font-semibold text-gray-800 dark:text-gray-100 mb-3">
          <BookOpen className="w-4 h-4 text-blue-600 dark:text-blue-400" />
          概念定义
        </h3>
        <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">{content.definition}</p>
      </section>

      {/* 要点 */}
      {content.keyPoints.length > 0 && (
        <section className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-5 shadow-sm transition-colors">
          <h3 className="flex items-center gap-2 font-semibold text-gray-800 dark:text-gray-100 mb-3">
            <Lightbulb className="w-4 h-4 text-amber-500 dark:text-amber-400" />
            重点要点
          </h3>
          <ul className="space-y-2">
            {content.keyPoints.map((point, idx) => (
              <li key={idx} className="flex items-start gap-2 text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
                <span className="flex-shrink-0 mt-1 w-1.5 h-1.5 rounded-full bg-amber-400" />
                <span>{point}</span>
              </li>
            ))}
          </ul>
        </section>
      )}

      {/* 公式 */}
      {content.formulas && content.formulas.length > 0 && (
        <section className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-5 shadow-sm transition-colors">
          <h3 className="flex items-center gap-2 font-semibold text-gray-800 dark:text-gray-100 mb-3">
            <Sigma className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
            核心公式
          </h3>
          <div className="space-y-3">
            {content.formulas.map((formula, idx) => (
              <div key={idx} className="flex flex-col gap-1 p-3 rounded-lg bg-indigo-50/50 dark:bg-indigo-900/20 border border-indigo-100 dark:border-indigo-800">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-medium text-indigo-700 dark:text-indigo-400">{formula.name}</span>
                  {formula.description && (
                    <span className="text-xs text-gray-400 dark:text-gray-500">{formula.description}</span>
                  )}
                </div>
                <div className="text-gray-800 dark:text-gray-200 py-1 overflow-x-auto">
                  <Math>{formula.latex}</Math>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* 公式推导 — 逐步可视化 */}
      {content.derivations && content.derivations.length > 0 && (
        <section>
          <div className="flex items-center gap-2 mb-3 px-1">
            <GraduationCap className="w-5 h-5 text-purple-600 dark:text-purple-400" />
            <h3 className="font-semibold text-gray-800 dark:text-gray-100">公式推导过程</h3>
            <span className="text-xs text-gray-400 dark:text-gray-500">动态图示，逐步理解公式如何得来</span>
          </div>

          {/* 交互式推导可视化（仅三角恒等变换节点） */}
          {node.id === '22' && <TrigDerivationVisual />}

          {/* 文字推导步骤 */}
          <div className="mt-3 space-y-0">
            {content.derivations.map((deriv, idx) => (
              <div key={idx} className="flex gap-3 group">
                <div className="flex flex-col items-center flex-shrink-0">
                  <div
                    className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white shadow-sm transition-transform group-hover:scale-110"
                    style={{
                      backgroundColor: idx === 0 ? '#8b5cf6' : idx === content.derivations!.length - 1 ? '#ec4899' : `hsl(${260 + idx * 20}, 70%, 55%)`,
                    }}
                  >
                    {idx + 1}
                  </div>
                  {idx < content.derivations!.length - 1 && (
                    <div className="w-0.5 h-full min-h-[20px] bg-gradient-to-b from-purple-300 to-pink-300 mt-1" />
                  )}
                </div>
                <div className="flex-1 mb-3 px-4 py-3 rounded-lg bg-gradient-to-r from-purple-50/80 dark:from-purple-900/20 to-transparent border border-purple-100 dark:border-purple-800 transition-colors group-hover:from-purple-100/60">
                  <p className="text-sm font-medium text-purple-700 dark:text-purple-300 mb-1.5">{deriv.title}</p>
                  <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed mb-2">{deriv.content}</p>
                  {deriv.latex && (
                    <div className="mt-2 p-2.5 rounded-lg bg-white dark:bg-gray-800 border border-purple-100 dark:border-purple-900 overflow-x-auto">
                      <Math displayMode>{deriv.latex}</Math>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* 方法 / 技巧 — 视觉化步骤流程 */}
      {content.methods && content.methods.length > 0 && (
        <section className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-5 shadow-sm transition-colors">
          <h3 className="flex items-center gap-2 font-semibold text-gray-800 dark:text-gray-100 mb-4">
            <Wrench className="w-4 h-4 text-green-600 dark:text-green-400" />
            方法技巧
          </h3>
          <div className="space-y-0">
            {content.methods.map((method, idx) => (
              <div key={idx} className="flex gap-3 group">
                {/* Numbered circle + connector */}
                <div className="flex flex-col items-center flex-shrink-0">
                  <div
                    className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white shadow-sm transition-transform group-hover:scale-110"
                    style={{
                      backgroundColor: idx === 0 ? '#10b981' : idx === content.methods!.length - 1 ? '#6366f1' : `hsl(${150 + idx * 25}, 70%, 50%)`,
                    }}
                  >
                    {idx + 1}
                  </div>
                  {idx < content.methods!.length - 1 && (
                    <div className="w-0.5 h-full min-h-[20px] bg-gradient-to-b from-green-300 to-indigo-300 mt-1" />
                  )}
                </div>
                {/* Content card */}
                <div className="flex-1 mb-3 px-3 py-2.5 rounded-lg bg-gradient-to-r from-green-50/80 dark:from-green-900/20 to-transparent border border-green-100 dark:border-green-800 transition-colors group-hover:from-green-100/60">
                  <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">{method}</p>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
};

export default KnowledgeDetail;
