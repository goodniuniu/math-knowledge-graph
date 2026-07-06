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
import SimpleHarmonicMotion from '@/components/graph/SimpleHarmonicMotion';
import { ComplexPlane, Geometry3D, StatsVisual, CoordinateGraph, PascalTriangle, LogicVisual } from '@/components/graph/ExtraVisuals';
import { BookOpen, Lightbulb, Sigma, Wrench, Eye } from 'lucide-react';

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
      case 'number-line':
        return null; // 使用已有的 quadratic 图形
      default:
        return null;
    }
  };

  if (!content) {
    return (
      <div className="bg-white rounded-xl border border-gray-200 p-6 text-center">
        <BookOpen className="w-8 h-8 text-gray-300 mx-auto mb-2" />
        <p className="text-gray-400 text-sm">该知识点内容正在建设中</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* 交互可视化演示 */}
      {demoType && renderDemo() && (
        <section>
          <div className="flex items-center gap-2 mb-2 px-1">
            <Eye className="w-4 h-4 text-purple-600" />
            <h3 className="font-semibold text-gray-800 text-sm">形象化演示</h3>
            <span className="text-xs text-gray-400">拖动滑块或点击按钮进行交互</span>
          </div>
          {renderDemo()}
        </section>
      )}

      {/* 定义 / 概念 */}
      <section className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
        <h3 className="flex items-center gap-2 font-semibold text-gray-800 mb-3">
          <BookOpen className="w-4 h-4 text-blue-600" />
          概念定义
        </h3>
        <p className="text-sm text-gray-700 leading-relaxed">{content.definition}</p>
      </section>

      {/* 要点 */}
      {content.keyPoints.length > 0 && (
        <section className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
          <h3 className="flex items-center gap-2 font-semibold text-gray-800 mb-3">
            <Lightbulb className="w-4 h-4 text-amber-500" />
            重点要点
          </h3>
          <ul className="space-y-2">
            {content.keyPoints.map((point, idx) => (
              <li key={idx} className="flex items-start gap-2 text-sm text-gray-700 leading-relaxed">
                <span className="flex-shrink-0 mt-1 w-1.5 h-1.5 rounded-full bg-amber-400" />
                <span>{point}</span>
              </li>
            ))}
          </ul>
        </section>
      )}

      {/* 公式 */}
      {content.formulas && content.formulas.length > 0 && (
        <section className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
          <h3 className="flex items-center gap-2 font-semibold text-gray-800 mb-3">
            <Sigma className="w-4 h-4 text-indigo-600" />
            核心公式
          </h3>
          <div className="space-y-3">
            {content.formulas.map((formula, idx) => (
              <div key={idx} className="flex flex-col gap-1 p-3 rounded-lg bg-indigo-50/50 border border-indigo-100">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-medium text-indigo-700">{formula.name}</span>
                  {formula.description && (
                    <span className="text-xs text-gray-400">{formula.description}</span>
                  )}
                </div>
                <div className="text-gray-800 py-1 overflow-x-auto">
                  <Math>{formula.latex}</Math>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* 方法 / 技巧 — 视觉化步骤流程 */}
      {content.methods && content.methods.length > 0 && (
        <section className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
          <h3 className="flex items-center gap-2 font-semibold text-gray-800 mb-4">
            <Wrench className="w-4 h-4 text-green-600" />
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
                <div className="flex-1 mb-3 px-3 py-2.5 rounded-lg bg-gradient-to-r from-green-50/80 to-transparent border border-green-100 transition-colors group-hover:from-green-100/60">
                  <p className="text-sm text-gray-700 leading-relaxed">{method}</p>
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
