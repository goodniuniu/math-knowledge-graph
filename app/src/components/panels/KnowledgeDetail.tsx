import React from 'react';
import { nodeContent } from '@/data/nodeContent';
import type { KnowledgeNode } from '@/data/knowledgeData';
import Math from '@/components/Math';
import { BookOpen, Lightbulb, Sigma, Wrench } from 'lucide-react';

interface KnowledgeDetailProps {
  node: KnowledgeNode;
}

const KnowledgeDetail: React.FC<KnowledgeDetailProps> = ({ node }) => {
  const content = nodeContent[node.id];

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

      {/* 方法 / 技巧 */}
      {content.methods && content.methods.length > 0 && (
        <section className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
          <h3 className="flex items-center gap-2 font-semibold text-gray-800 mb-3">
            <Wrench className="w-4 h-4 text-green-600" />
            方法技巧
          </h3>
          <ul className="space-y-2">
            {content.methods.map((method, idx) => (
              <li key={idx} className="flex items-start gap-2 text-sm text-gray-700 leading-relaxed">
                <span className="flex-shrink-0 mt-0.5 text-green-500 font-bold">→</span>
                <span>{method}</span>
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  );
};

export default KnowledgeDetail;
