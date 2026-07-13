import React, { useState, useMemo } from 'react';
import { books, getAllNodes, type KnowledgeNode } from '@/data/knowledgeData';
import { nodeContent } from '@/data/nodeContent';
import { ChevronRight, ChevronDown, BookOpen, FunctionSquare, Circle, Triangle, TrendingUp, BarChart3, Box, Grid3X3, Search, X, List } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Input } from '@/components/ui/input';

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
  const [searchQuery, setSearchQuery] = useState('');

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

  // Search results
  const searchResults = useMemo(() => {
    if (!searchQuery.trim()) return [];
    const query = searchQuery.toLowerCase().trim();
    const allNodes = getAllNodes();
    return allNodes.filter(node => {
      // Search in title
      if (node.title.toLowerCase().includes(query)) return true;
      // Search in category
      if (node.category.toLowerCase().includes(query)) return true;
      // Search in content (definition, key points, formulas)
      const content = nodeContent[node.id];
      if (content) {
        if (content.definition.toLowerCase().includes(query)) return true;
        if (content.keyPoints.some(kp => kp.toLowerCase().includes(query))) return true;
        if (content.formulas?.some(f => f.name.toLowerCase().includes(query) || (f.description || '').toLowerCase().includes(query))) return true;
        if (content.methods?.some(m => m.toLowerCase().includes(query))) return true;
      }
      return false;
    });
  }, [searchQuery]);

  // Highlight matching text
  const highlightMatch = (text: string, query: string) => {
    if (!query.trim()) return text;
    const idx = text.toLowerCase().indexOf(query.toLowerCase());
    if (idx === -1) return text;
    return (
      <>
        {text.substring(0, idx)}
        <mark className="bg-yellow-200 text-gray-900 rounded px-0.5">{text.substring(idx, idx + query.length)}</mark>
        {text.substring(idx + query.length)}
      </>
    );
  };

  const isSearching = searchQuery.trim().length > 0;

  return (
    <div className="h-full flex flex-col">
      <div className="p-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white flex-shrink-0">
        <h2 className="font-bold text-sm">高中数学知识图谱</h2>
        <p className="text-xs text-blue-100 mt-0.5">57个知识点 · 5册教材</p>
      </div>

      {/* Search bar */}
      <div className="p-2 border-b border-gray-100 flex-shrink-0">
        <div className="relative">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" />
          <Input
            type="text"
            placeholder="搜索知识点、公式、定义..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="h-8 pl-8 pr-7 text-xs"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        {/* Search results view */}
        {isSearching ? (
          <div className="p-2 space-y-1">
            <div className="px-3 py-1.5 text-xs text-gray-500 flex items-center gap-1">
              <List className="w-3 h-3" />
              找到 {searchResults.length} 个结果
            </div>
            {searchResults.length === 0 ? (
              <div className="p-4 text-center text-sm text-gray-400">
                未找到匹配的知识点
              </div>
            ) : (
              searchResults.map(node => {
                const isSelected = selectedNode?.id === node.id;
                const bookColor = books.find(b => b.name === node.book)?.color || '#3b82f6';
                return (
                  <button
                    key={node.id}
                    onClick={() => onSelectNode(node)}
                    className={cn(
                      "w-full text-left px-3 py-2 rounded-md transition-all",
                      isSelected ? "bg-blue-100" : "hover:bg-gray-50"
                    )}
                  >
                    <div className="flex items-center gap-2 mb-0.5">
                      <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: bookColor }} />
                      <span className={cn("text-xs font-medium", isSelected ? "text-blue-800" : "text-gray-700")}>
                        {highlightMatch(node.title, searchQuery)}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 ml-4">
                      <span className="text-[10px] text-gray-400">{node.book}</span>
                      <span className="text-[10px] px-1.5 py-0.5 rounded bg-gray-100 text-gray-500">
                        {highlightMatch(node.category, searchQuery)}
                      </span>
                    </div>
                  </button>
                );
              })
            )}
          </div>
        ) : (
          /* Tree view */
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
        )}
      </div>
    </div>
  );
};

export default KnowledgeTree;
