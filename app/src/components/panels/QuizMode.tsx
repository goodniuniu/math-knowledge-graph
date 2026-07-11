import { useState, useCallback } from 'react';
import { importantFormulas, getAllNodes } from '@/data/knowledgeData';
import { nodeContent } from '@/data/nodeContent';
import MathTex from '@/components/Math';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Brain, CheckCircle2, XCircle, RotateCcw, ArrowRight, Trophy, BookOpen } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Question {
  id: number;
  type: 'formula-match' | 'definition-match' | 'true-false' | 'category-match';
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
  latex?: string;
  nodeTitle?: string;
}

// Shuffle array helper
function shuffle<T>(arr: T[]): T[] {
  const result = [...arr];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

// Generate questions from knowledge data
function generateQuestions(count: number = 10): Question[] {
  const questions: Question[] = [];
  let qId = 0;

  const allNodes = getAllNodes();

  // Type 1: Formula matching - show formula name, pick correct latex
  const formulaEntries: { name: string; latex: string; description?: string; category: string }[] = [];
  Object.entries(importantFormulas).forEach(([category, formulas]) => {
    formulas.forEach(f => {
      formulaEntries.push({ ...f, category });
    });
  });
  // Also add formulas from nodeContent
  Object.entries(nodeContent).forEach(([nodeId, content]) => {
    const node = allNodes.find(n => n.id === nodeId);
    if (!node) return;
    content.formulas?.forEach(f => {
      if (!formulaEntries.some(fe => fe.latex === f.latex)) {
        formulaEntries.push({ ...f, category: node.category });
      }
    });
  });

  const shuffledFormulas = shuffle(formulaEntries);
  const formulaCount = Math.min(Math.ceil(count * 0.35), shuffledFormulas.length);
  for (let i = 0; i < formulaCount; i++) {
    const correct = shuffledFormulas[i];
    const wrongOptions = shuffle(shuffledFormulas.filter((_, j) => j !== i)).slice(0, 3);
    const options = shuffle([correct, ...wrongOptions]);
    questions.push({
      id: qId++,
      type: 'formula-match',
      question: `下列哪个公式是「${correct.name}」？`,
      options: options.map(o => o.latex),
      correctIndex: options.indexOf(correct),
      explanation: correct.description || `${correct.name}，属于${correct.category}类别。`,
      latex: correct.latex,
    });
  }

  // Type 2: Definition matching - show definition, pick correct knowledge point
  const defEntries = allNodes.filter(n => nodeContent[n.id]);
  const shuffledDefs = shuffle(defEntries);
  const defCount = Math.min(Math.ceil(count * 0.3), shuffledDefs.length);
  for (let i = 0; i < defCount; i++) {
    const correct = shuffledDefs[i];
    const content = nodeContent[correct.id];
    const wrongOptions = shuffle(shuffledDefs.filter((_, j) => j !== i)).slice(0, 3);
    const options = shuffle([correct, ...wrongOptions]);
    questions.push({
      id: qId++,
      type: 'definition-match',
      question: `这个定义描述的是哪个知识点？\n\n「${content.definition.substring(0, 80)}${content.definition.length > 80 ? '...' : ''}」`,
      options: options.map(o => o.title),
      correctIndex: options.indexOf(correct),
      explanation: `这是「${correct.title}」的定义，属于${correct.category}，见${correct.book}。`,
      nodeTitle: correct.title,
    });
  }

  // Type 3: True/False - show a key point, ask if it's correct
  const keyPointEntries: { point: string; nodeId: string; nodeTitle: string; category: string }[] = [];
  Object.entries(nodeContent).forEach(([nodeId, content]) => {
    const node = allNodes.find(n => n.id === nodeId);
    if (!node) return;
    content.keyPoints.forEach(kp => {
      keyPointEntries.push({ point: kp, nodeId, nodeTitle: node.title, category: node.category });
    });
  });
  const shuffledKeyPoints = shuffle(keyPointEntries);
  const tfCount = Math.min(Math.ceil(count * 0.2), shuffledKeyPoints.length);
  for (let i = 0; i < tfCount; i++) {
    const entry = shuffledKeyPoints[i];
    // 50% chance to show a true statement, 50% to modify it
    const isTrue = Math.random() > 0.4;
    let statement = entry.point;
    if (!isTrue) {
      // Create a false version by negating or modifying
      statement = entry.point.replace(/大于/g, '小于').replace(/递增/g, '递减').replace(/正/g, '负')
        .replace(/奇函数/g, '偶函数').replace(/偶函数/g, '奇函数')
        .replace(/充分/g, '必要').replace(/必要/g, '充分')
        .replace(/平行/g, '垂直').replace(/垂直/g, '平行')
        .replace(/单调递增/g, '单调递减').replace(/单调递减/g, '单调递增');
      // If no change was made, just negate
      if (statement === entry.point) {
        statement = '不成立：' + entry.point;
      }
    }
    questions.push({
      id: qId++,
      type: 'true-false',
      question: `判断正误：${statement}`,
      options: ['正确', '错误'],
      correctIndex: isTrue ? 0 : 1,
      explanation: `该知识点来自「${entry.nodeTitle}」（${entry.category}）。原始表述：${entry.point}`,
      nodeTitle: entry.nodeTitle,
    });
  }

  // Type 4: Category matching - show a formula, pick the correct category
  const catEntries = formulaEntries.filter(f => importantFormulas[f.category]);
  const shuffledCats = shuffle(catEntries);
  const catCount = Math.min(count - formulaCount - defCount - tfCount, shuffledCats.length);
  const allCategories = Object.keys(importantFormulas);
  for (let i = 0; i < catCount; i++) {
    const correct = shuffledCats[i];
    const wrongCats = shuffle(allCategories.filter(c => c !== correct.category)).slice(0, 3);
    const options = shuffle([correct.category, ...wrongCats]);
    questions.push({
      id: qId++,
      type: 'category-match',
      question: `这个公式属于哪个类别？`,
      options,
      correctIndex: options.indexOf(correct.category),
      explanation: `公式「${correct.name}」属于${correct.category}类别。`,
      latex: correct.latex,
    });
  }

  return shuffle(questions).slice(0, count);
}

const QuizMode: React.FC = () => {
  const [phase, setPhase] = useState<'setup' | 'quiz' | 'results'>('setup');
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [score, setScore] = useState(0);
  const [answers, setAnswers] = useState<boolean[]>([]);
  const [questionCount, setQuestionCount] = useState(10);

  const startQuiz = useCallback(() => {
    setQuestions(generateQuestions(questionCount));
    setCurrentIndex(0);
    setSelectedAnswer(null);
    setShowExplanation(false);
    setScore(0);
    setAnswers([]);
    setPhase('quiz');
  }, [questionCount]);

  const handleSelectAnswer = (index: number) => {
    if (showExplanation) return;
    setSelectedAnswer(index);
    setShowExplanation(true);
    const isCorrect = index === questions[currentIndex].correctIndex;
    if (isCorrect) setScore(s => s + 1);
    setAnswers(prev => [...prev, isCorrect]);
  };

  const handleNext = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(i => i + 1);
      setSelectedAnswer(null);
      setShowExplanation(false);
    } else {
      setPhase('results');
    }
  };

  const handleRestart = () => {
    setPhase('setup');
    setCurrentIndex(0);
    setSelectedAnswer(null);
    setShowExplanation(false);
    setScore(0);
    setAnswers([]);
  };

  // Setup screen
  if (phase === 'setup') {
    return (
      <div className="max-w-2xl mx-auto">
        <Card className="p-8 bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800">
          <div className="text-center mb-6">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-green-400 to-emerald-600 flex items-center justify-center mx-auto mb-4">
              <Brain className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100">练习模式</h2>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
              基于全部57个知识点的公式、定义和要点自动生成题目
            </p>
          </div>

          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">
                题目数量
              </label>
              <div className="grid grid-cols-4 gap-2">
                {[5, 10, 15, 20].map(n => (
                  <button
                    key={n}
                    onClick={() => setQuestionCount(n)}
                    className={cn(
                      "py-2 rounded-lg text-sm font-medium transition-all border",
                      questionCount === n
                        ? "bg-green-500 text-white border-green-500"
                        : "bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 border-gray-200 dark:border-gray-700 hover:border-green-300"
                    )}
                  >
                    {n}题
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 pt-2">
              {[
                { icon: '📝', label: '公式匹配', desc: '根据名称选择正确公式' },
                { icon: '📖', label: '定义辨识', desc: '根据描述判断知识点' },
                { icon: '✓✗', label: '判断正误', desc: '判断关键结论是否正确' },
                { icon: '🏷️', label: '分类归类', desc: '判断公式所属类别' },
              ].map((type, i) => (
                <div key={i} className="p-3 rounded-lg bg-gray-50 dark:bg-gray-800 border border-gray-100 dark:border-gray-700">
                  <div className="text-lg mb-1">{type.icon}</div>
                  <div className="text-xs font-medium text-gray-700 dark:text-gray-300">{type.label}</div>
                  <div className="text-xs text-gray-400">{type.desc}</div>
                </div>
              ))}
            </div>

            <Button
              onClick={startQuiz}
              className="w-full bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-semibold py-2.5"
              size="lg"
            >
              <Brain className="w-4 h-4 mr-2" />
              开始练习
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  // Results screen
  if (phase === 'results') {
    const percentage = Math.round((score / questions.length) * 100);
    const getEmoji = () => {
      if (percentage >= 90) return '🏆';
      if (percentage >= 70) return '🎉';
      if (percentage >= 50) return '💪';
      return '📚';
    };
    const getMessage = () => {
      if (percentage >= 90) return '太棒了！你已经掌握了大部分知识！';
      if (percentage >= 70) return '做得不错！继续加油！';
      if (percentage >= 50) return '还有提升空间，多复习一下吧！';
      return '需要多加练习，回到知识点查看详情吧！';
    };

    return (
      <div className="max-w-2xl mx-auto">
        <Card className="p-8 bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800 text-center">
          <div className="text-6xl mb-4">{getEmoji()}</div>
          <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-2">
            {score} / {questions.length}
          </h2>
          <p className="text-3xl font-bold text-green-600 dark:text-green-400 mb-4">
            {percentage}%
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">{getMessage()}</p>

          {/* Answer review */}
          <div className="space-y-2 mb-6 text-left">
            <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">答题回顾</h3>
            {questions.map((q, i) => (
              <div
                key={q.id}
                className={cn(
                  "flex items-center gap-2 p-2 rounded-lg text-xs",
                  answers[i]
                    ? "bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400"
                    : "bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400"
                )}
              >
                {answers[i] ? <CheckCircle2 className="w-4 h-4 flex-shrink-0" /> : <XCircle className="w-4 h-4 flex-shrink-0" />}
                <span className="flex-1 truncate">第{i + 1}题：{q.question.substring(0, 40)}...</span>
              </div>
            ))}
          </div>

          <div className="flex gap-3">
            <Button
              onClick={startQuiz}
              variant="outline"
              className="flex-1"
            >
              <RotateCcw className="w-4 h-4 mr-2" />
              再练一次
            </Button>
            <Button
              onClick={handleRestart}
              variant="outline"
              className="flex-1"
            >
              <BookOpen className="w-4 h-4 mr-2" />
              返回设置
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  // Quiz screen
  const currentQ = questions[currentIndex];
  if (!currentQ) return null;

  return (
    <div className="max-w-2xl mx-auto">
      {/* Progress bar */}
      <div className="mb-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs text-gray-500 dark:text-gray-400">
            第 {currentIndex + 1} / {questions.length} 题
          </span>
          <span className="text-xs font-medium text-green-600 dark:text-green-400">
            得分: {score}
          </span>
        </div>
        <div className="h-2 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-green-400 to-emerald-600 transition-all duration-300"
            style={{ width: `${((currentIndex + (showExplanation ? 1 : 0)) / questions.length) * 100}%` }}
          />
        </div>
      </div>

      <Card className="p-6 bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800">
        {/* Question type badge */}
        <div className="flex items-center gap-2 mb-4">
          <span className={cn(
            "text-xs px-2 py-0.5 rounded-full font-medium",
            currentQ.type === 'formula-match' && "bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400",
            currentQ.type === 'definition-match' && "bg-purple-50 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400",
            currentQ.type === 'true-false' && "bg-amber-50 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400",
            currentQ.type === 'category-match' && "bg-teal-50 dark:bg-teal-900/30 text-teal-600 dark:text-teal-400",
          )}>
            {currentQ.type === 'formula-match' && '公式匹配'}
            {currentQ.type === 'definition-match' && '定义辨识'}
            {currentQ.type === 'true-false' && '判断正误'}
            {currentQ.type === 'category-match' && '分类归类'}
          </span>
        </div>

        {/* Question text */}
        <div className="mb-6">
          <p className="text-sm text-gray-800 dark:text-gray-100 leading-relaxed whitespace-pre-line">
            {currentQ.question}
          </p>
          {currentQ.latex && (
            <div className="mt-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <MathTex displayMode>{currentQ.latex}</MathTex>
            </div>
          )}
        </div>

        {/* Options */}
        <div className="space-y-2">
          {currentQ.options.map((option, index) => {
            const isSelected = selectedAnswer === index;
            const isCorrect = index === currentQ.correctIndex;
            const showResult = showExplanation;

            return (
              <button
                key={index}
                onClick={() => handleSelectAnswer(index)}
                disabled={showResult}
                className={cn(
                  "w-full text-left p-3 rounded-lg border-2 transition-all flex items-center gap-3",
                  !showResult && "hover:border-blue-300 dark:hover:border-blue-700 cursor-pointer",
                  showResult && isCorrect && "border-green-500 bg-green-50 dark:bg-green-900/20",
                  showResult && isSelected && !isCorrect && "border-red-500 bg-red-50 dark:bg-red-900/20",
                  showResult && !isCorrect && !isSelected && "border-gray-200 dark:border-gray-700 opacity-60",
                  !showResult && "border-gray-200 dark:border-gray-700"
                )}
              >
                <div className={cn(
                  "w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0",
                  !showResult && "bg-gray-100 dark:bg-gray-800 text-gray-500",
                  showResult && isCorrect && "bg-green-500 text-white",
                  showResult && isSelected && !isCorrect && "bg-red-500 text-white",
                  showResult && !isCorrect && !isSelected && "bg-gray-100 dark:bg-gray-800 text-gray-400",
                )}>
                  {String.fromCharCode(65 + index)}
                </div>
                <div className="flex-1 text-sm text-gray-700 dark:text-gray-300">
                  {currentQ.type === 'formula-match' ? (
                    <MathTex>{option}</MathTex>
                  ) : (
                    option
                  )}
                </div>
                {showResult && isCorrect && <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0" />}
                {showResult && isSelected && !isCorrect && <XCircle className="w-5 h-5 text-red-500 flex-shrink-0" />}
              </button>
            );
          })}
        </div>

        {/* Explanation */}
        {showExplanation && (
          <div className="mt-4 p-4 rounded-lg bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800">
            <div className="flex items-start gap-2">
              <Trophy className="w-4 h-4 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-xs font-semibold text-blue-700 dark:text-blue-300 mb-1">
                  {selectedAnswer === currentQ.correctIndex ? '回答正确！' : '回答错误'}
                </p>
                <p className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed">
                  {currentQ.explanation}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Next button */}
        {showExplanation && (
          <Button
            onClick={handleNext}
            className="w-full mt-4 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700"
          >
            {currentIndex < questions.length - 1 ? '下一题' : '查看结果'}
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        )}
      </Card>
    </div>
  );
};

export default QuizMode;
