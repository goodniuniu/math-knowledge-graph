import { useState, useCallback } from 'react';
import { books, graphConfigs, type KnowledgeNode } from '@/data/knowledgeData';
import FunctionCanvas from '@/components/graph/FunctionCanvas';
import GraphControls from '@/components/graph/GraphControls';
import KnowledgeTree from '@/components/panels/KnowledgeTree';
import KnowledgeDetail from '@/components/panels/KnowledgeDetail';
import FormulaPanel from '@/components/panels/FormulaPanel';
import InductionFormulaPanel from '@/components/panels/InductionFormulaPanel';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import {
  BookOpen,
  BarChart3,
  Lightbulb,
  PanelLeftClose,
  PanelLeftOpen,
  Calculator,
  Sparkles,
} from 'lucide-react';
import './App.css';

// 获取节点完整信息（包含所属教材）
function getNodeWithBook(node: KnowledgeNode): KnowledgeNode {
  for (const book of books) {
    for (const chapter of book.chapters) {
      const found = chapter.nodes.find(n => n.id === node.id);
      if (found) {
        return { ...found, book: book.name };
      }
    }
  }
  return node;
}

function App() {
  const [selectedNode, setSelectedNode] = useState<KnowledgeNode | null>(null);
  const [params, setParams] = useState<Record<string, number>>({});
  const [leftPanelOpen, setLeftPanelOpen] = useState(true);
  const [rightPanelOpen] = useState(true);
  const [activeTab, setActiveTab] = useState<'formulas' | 'induction'>('formulas');

  const handleSelectNode = useCallback((node: KnowledgeNode) => {
    const fullNode = getNodeWithBook(node);
    setSelectedNode(fullNode);

    // Initialize params for the graph type
    if (fullNode.graphType && graphConfigs[fullNode.graphType]) {
      const config = graphConfigs[fullNode.graphType];
      const defaultParams: Record<string, number> = {};
      config.params.forEach(p => {
        defaultParams[p.key] = p.default;
      });
      setParams(defaultParams);
    }
  }, []);

  const handleParamChange = useCallback((key: string, value: number) => {
    setParams(prev => ({ ...prev, [key]: value }));
  }, []);

  const handleReset = useCallback(() => {
    if (selectedNode?.graphType && graphConfigs[selectedNode.graphType]) {
      const config = graphConfigs[selectedNode.graphType];
      const defaultParams: Record<string, number> = {};
      config.params.forEach(p => {
        defaultParams[p.key] = p.default;
      });
      setParams(defaultParams);
    }
  }, [selectedNode]);

  const hasGraph = !!(selectedNode?.graphType
    && selectedNode.graphType !== 'none'
    && graphConfigs[selectedNode.graphType]);
  const bookColor = selectedNode
    ? books.find(b => b.name === selectedNode.book)?.color || '#3b82f6'
    : '#3b82f6';

  return (
    <div className="h-screen w-screen flex flex-col bg-gray-50 overflow-hidden">
      {/* Top Bar */}
      <header className="h-14 bg-white border-b border-gray-200 flex items-center px-4 flex-shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center">
            <Sparkles className="w-4 h-4 text-white" />
          </div>
          <div>
            <h1 className="text-sm font-bold text-gray-800">高中数学互动知识图谱</h1>
            <p className="text-xs text-gray-500">基于《高中知识清单》新教材版</p>
          </div>
        </div>

        <div className="ml-auto flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setLeftPanelOpen(!leftPanelOpen)}
            className="h-8 w-8 p-0"
          >
            {leftPanelOpen ? <PanelLeftClose className="w-4 h-4" /> : <PanelLeftOpen className="w-4 h-4" />}
          </Button>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Panel - Knowledge Tree */}
        {leftPanelOpen && (
          <aside className="w-72 flex-shrink-0 bg-white border-r border-gray-200 overflow-hidden">
            <KnowledgeTree
              selectedNode={selectedNode}
              onSelectNode={handleSelectNode}
            />
          </aside>
        )}

        {/* Center Panel - Graph Display */}
        <main className="flex-1 flex flex-col overflow-hidden">
          {/* Node Info Bar */}
          {selectedNode && (
            <div
              className="h-12 flex-shrink-0 flex items-center px-4 border-b"
              style={{
                backgroundColor: `${bookColor}08`,
                borderColor: `${bookColor}20`,
              }}
            >
              <div
                className="w-2.5 h-2.5 rounded-full mr-2"
                style={{ backgroundColor: bookColor }}
              />
              <span className="text-xs text-gray-500 mr-2">{selectedNode.book}</span>
              <span className="text-sm font-semibold text-gray-800">{selectedNode.title}</span>
              <span className="ml-2 text-xs px-2 py-0.5 rounded-full bg-gray-100 text-gray-600">
                {selectedNode.category}
              </span>
              {hasGraph && (
                <span className="ml-2 text-xs px-2 py-0.5 rounded-full bg-green-50 text-green-600 flex items-center gap-1">
                  <Calculator className="w-3 h-3" />
                  可交互
                </span>
              )}
            </div>
          )}

          {/* Graph Area */}
          <div className="flex-1 overflow-y-auto p-4">
            {selectedNode ? (
              <div className="max-w-4xl mx-auto space-y-4">
                {/* Canvas - only for interactive graph types */}
                {hasGraph && (
                  <>
                    <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm">
                      <div className="flex items-center justify-between mb-3">
                        <h3 className="font-semibold text-gray-800 flex items-center gap-2">
                          <BarChart3 className="w-4 h-4 text-blue-600" />
                          动态图形
                        </h3>
                        <span className="text-xs text-gray-400">
                          拖动滑块调节参数，观察图形变化
                        </span>
                      </div>

                      <div className="flex justify-center">
                        <FunctionCanvas
                          graphType={selectedNode.graphType || 'none'}
                          params={params}
                          width={700}
                          height={420}
                        />
                      </div>
                    </div>

                    {/* Controls */}
                    <div className="max-w-xl mx-auto">
                      <GraphControls
                        graphType={selectedNode.graphType!}
                        params={params}
                        onParamChange={handleParamChange}
                        onReset={handleReset}
                      />
                    </div>
                  </>
                )}

                {/* Knowledge detail content — always show */}
                <KnowledgeDetail node={selectedNode} />
              </div>
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-center">
                <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-blue-100 to-indigo-100 flex items-center justify-center mb-4">
                  <BookOpen className="w-10 h-10 text-blue-600" />
                </div>
                <h2 className="text-xl font-bold text-gray-800 mb-2">
                  欢迎使用高中数学互动知识图谱
                </h2>
                <p className="text-gray-500 max-w-md mb-6">
                  从左侧选择一个知识点，即可查看动态可调节的函数图形。
                  涵盖三角函数、指数对数、圆锥曲线、数列等核心内容。
                </p>
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div className="p-4 bg-white rounded-lg border border-gray-200">
                    <div className="text-2xl font-bold text-blue-600">57</div>
                    <div className="text-xs text-gray-500">知识点</div>
                  </div>
                  <div className="p-4 bg-white rounded-lg border border-gray-200">
                    <div className="text-2xl font-bold text-green-600">10+</div>
                    <div className="text-xs text-gray-500">动态图形</div>
                  </div>
                  <div className="p-4 bg-white rounded-lg border border-gray-200">
                    <div className="text-2xl font-bold text-purple-600">5</div>
                    <div className="text-xs text-gray-500">教材分册</div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </main>

        {/* Right Panel - Formulas */}
        {rightPanelOpen && (
          <aside className="w-80 flex-shrink-0 bg-white border-l border-gray-200 overflow-hidden flex flex-col">
            <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as 'formulas' | 'induction')} className="flex flex-col h-full">
              <TabsList className="w-full grid grid-cols-2 rounded-none border-b">
                <TabsTrigger value="formulas" className="rounded-none text-xs">
                  <BookOpen className="w-3.5 h-3.5 mr-1" />
                  公式速查
                </TabsTrigger>
                <TabsTrigger value="induction" className="rounded-none text-xs">
                  <Lightbulb className="w-3.5 h-3.5 mr-1" />
                  诱导公式
                </TabsTrigger>
              </TabsList>
              <div className="flex-1 overflow-hidden">
                <TabsContent value="formulas" className="h-full m-0 p-0">
                  <FormulaPanel />
                </TabsContent>
                <TabsContent value="induction" className="h-full m-0 p-0">
                  <InductionFormulaPanel />
                </TabsContent>
              </div>
            </Tabs>
          </aside>
        )}
      </div>
    </div>
  );
}

export default App;
