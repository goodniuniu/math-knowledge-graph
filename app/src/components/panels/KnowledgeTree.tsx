import React, { useState } from 'react';
import { books, type KnowledgeNode } from '@/data/knowledgeData';
import { ChevronRight, ChevronDown, BookOpen, FunctionSquare, Circle, Triangle, TrendingUp, BarChart3, Box, Grid3X3 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface KnowledgeTreeProps {
  selectedNode: KnowledgeNode | null;
  onSelectNode: (node: KnowledgeNode) => void;
}

const categoryIcons: Record<string, React.ReactNode> = {
  '集合': <Grid3X3 className="w-4 h-4" />,
  '逻辑': <BookOpen className="w-4 h-4" />,
  '不等式': <TrendingUp className="w-4 h-4" />,
  '函数': <FunctionSquare className="w-4 h-4" />,
  '三角函数': <Triangle className="w-4 h-4" />,
  '向量': <Box className="w-4 h-4" />,
  '复数': <Circle className="w-4 h-4" />,
  '立体几何': <Box className="w-4 h-4" />,
  '解析几何': <Circle className="w-4 h-4" />,
  '圆锥曲线': <Circle className="w-4 h-4" />,
  '数列': <TrendingUp className="w-4 h-4" />,
  '导数': <TrendingUp className="w-4 h-4" />,
  '概率': <BarChart3 className="w-4 h-4" />,
  '统计': <BarChart3 className="w-4 h-4" />,
  '计数': <Grid3X3 className="w-4 h-4" />,
};

const KnowledgeTree: React.FC<KnowledgeTreeProps> = ({ selectedNode, onSelectNode }) => {
  const [expandedBooks, setExpandedBooks] = useState<Set<string>>(new Set(['bx1']));
  const [expandedChapters, setExpandedChapters] = useState<Set<string>>(new Set(['c1']));

  const toggleBook = (bookId: string) => {
    setExpandedBooks(prev => {
      const next = new Set(prev);
      if (next.has(bookId)) next.delete(bookId);
      else next.add(bookId);
      return next;
    });
  };

  const toggleChapter = (chapterId: string) => {
    setExpandedChapters(prev => {
      const next = new Set(prev);
      if (next.has(chapterId)) next.delete(chapterId);
      else next.add(chapterId);
      return next;
    });
  };

  return (
    <div className="h-full overflow-y-auto">
      <div className="p-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
        <h2 className="font-bold text-sm">高中数学知识图谱</h2>
        <p className="text-xs text-blue-100 mt-0.5">57个知识点 · 5册教材</p>
      </div>

      <div className="p-2 space-y-1">
        {books.map(book => {
          const isExpanded = expandedBooks.has(book.id);
          return (
            <div key={book.id}>
              <button
                onClick={() => toggleBook(book.id)}
                className={cn(
                  "w-full flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm font-medium transition-all",
                  isExpanded ? "bg-gray-100" : "hover:bg-gray-50"
                )}
              >
                {isExpanded ? (
                  <ChevronDown className="w-4 h-4 text-gray-400" />
                ) : (
                  <ChevronRight className="w-4 h-4 text-gray-400" />
                )}
                <div
                  className="w-3 h-3 rounded-full flex-shrink-0"
                  style={{ backgroundColor: book.color }}
                />
                <span className="text-gray-800">{book.name}</span>
                <span className="ml-auto text-xs text-gray-400">
                  {book.chapters.reduce((acc, c) => acc + c.nodes.length, 0)}
                </span>
              </button>

              {isExpanded && (
                <div className="ml-4 mt-1 space-y-1">
                  {book.chapters.map(chapter => {
                    const isChExpanded = expandedChapters.has(chapter.id);
                    return (
                      <div key={chapter.id}>
                        <button
                          onClick={() => toggleChapter(chapter.id)}
                          className={cn(
                            "w-full flex items-center gap-2 px-3 py-2 rounded-md text-xs transition-all",
                            isChExpanded ? "bg-blue-50 text-blue-700" : "hover:bg-gray-50 text-gray-600"
                          )}
                        >
                          {isChExpanded ? (
                            <ChevronDown className="w-3 h-3" />
                          ) : (
                            <ChevronRight className="w-3 h-3" />
                          )}
                          <span className="font-medium text-left">{chapter.name}</span>
                        </button>

                        {isChExpanded && (
                          <div className="ml-5 mt-0.5 space-y-0.5">
                            {chapter.nodes.map(node => {
                              const isSelected = selectedNode?.id === node.id;
                              const hasGraph = node.graphType && node.graphType !== 'none';
                              return (
                                <button
                                  key={node.id}
                                  onClick={() => onSelectNode(node)}
                                  className={cn(
                                    "w-full flex items-center gap-2 px-3 py-1.5 rounded-md text-xs transition-all",
                                    isSelected
                                      ? "bg-blue-100 text-blue-800 font-medium"
                                      : "hover:bg-gray-50 text-gray-600"
                                  )}
                                >
                                  <span className={cn(
                                    "text-gray-400",
                                    isSelected && "text-blue-600"
                                  )}>
                                    {categoryIcons[node.category] || <Circle className="w-3 h-3" />}
                                  </span>
                                  <span className="text-left flex-1">{node.title}</span>
                                  {hasGraph && (
                                    <span className={cn(
                                      "flex-shrink-0 w-1.5 h-1.5 rounded-full",
                                      isSelected ? "bg-blue-500" : "bg-green-400"
                                    )} />
                                  )}
                                </button>
                              );
                            })}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default KnowledgeTree;
