import React, { useState } from 'react';
import { importantFormulas, type Formula } from '@/data/knowledgeData';
import { BookOpen, ChevronDown, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import Math from '@/components/Math';

const FormulaPanel: React.FC = () => {
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set(['三角函数']));

  const toggleCategory = (cat: string) => {
    setExpandedCategories(prev => {
      const next = new Set(prev);
      if (next.has(cat)) next.delete(cat);
      else next.add(cat);
      return next;
    });
  };

  // Color mapping for categories
  const categoryColors: Record<string, string> = {
    '三角函数': 'bg-blue-50 border-blue-200 text-blue-800',
    '函数': 'bg-emerald-50 border-emerald-200 text-emerald-800',
    '数列': 'bg-violet-50 border-violet-200 text-violet-800',
    '圆锥曲线': 'bg-amber-50 border-amber-200 text-amber-800',
    '向量': 'bg-rose-50 border-rose-200 text-rose-800',
  };

  return (
    <div className="h-full overflow-y-auto bg-white dark:bg-gray-900 transition-colors">
      <div className="p-4 border-b border-gray-100 dark:border-gray-800">
        <div className="flex items-center gap-2">
          <BookOpen className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
          <h2 className="font-bold text-gray-800 dark:text-gray-100">重要公式速查</h2>
        </div>
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">点击展开查看各章节核心公式</p>
      </div>

      <div className="p-3 space-y-2">
        {Object.entries(importantFormulas).map(([category, formulas]) => {
          const isExpanded = expandedCategories.has(category);
          return (
            <div
              key={category}
              className={cn(
                "rounded-lg border overflow-hidden transition-all",
                categoryColors[category] || 'bg-gray-50 border-gray-200 text-gray-800'
              )}
            >
              <button
                onClick={() => toggleCategory(category)}
                className="w-full flex items-center gap-2 px-3 py-2.5 text-sm font-semibold"
              >
                {isExpanded ? (
                  <ChevronDown className="w-4 h-4 flex-shrink-0" />
                ) : (
                  <ChevronRight className="w-4 h-4 flex-shrink-0" />
                )}
                {category}
                <span className="ml-auto text-xs opacity-60">{formulas.length}个</span>
              </button>

              {isExpanded && (
                <div className="bg-white/70 border-t border-inherit">
                  {formulas.map((formula, idx) => (
                    <FormulaCard key={idx} formula={formula} />
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

const FormulaCard: React.FC<{ formula: Formula }> = ({ formula }) => {
  const [showDesc, setShowDesc] = useState(false);

  return (
    <div
      className="px-4 py-3 border-b border-gray-100 last:border-0 hover:bg-gray-50/50 transition-colors cursor-pointer"
      onClick={() => setShowDesc(!showDesc)}
    >
      <div className="flex items-start gap-2">
        <span className="text-xs font-medium text-gray-500 dark:text-gray-400 mt-0.5 w-16 flex-shrink-0">{formula.name}</span>
        <div className="flex-1">
          <div className="text-sm text-gray-800 dark:text-gray-200 leading-relaxed py-1">
            <Math displayMode>{formula.latex}</Math>
          </div>
          {showDesc && formula.description && (
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1.5 italic">
              {formula.description}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default FormulaPanel;
