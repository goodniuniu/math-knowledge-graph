// 知识点可视化演示类型配置
// 将知识点 ID 映射到对应的可视化组件类型

export type DemoType =
  | 'vector-ops'        // 向量运算（加法、减法、数量积）
  | 'vector-coords'     // 向量坐标表示
  | 'vector-triangle'   // 向量与三角形（正弦/余弦定理）
  | 'venn-sets'         // 集合运算韦恩图
  | 'venn-relations'    // 集合间关系
  | 'dist-normal'       // 正态分布曲线
  | 'dist-binomial'     // 二项分布
  | 'inequality-mean'   // 基本不等式可视化
  | 'number-line'       // 数轴表示
  | 'conic-overview'    // 圆锥曲线对比
  | 'derivative-tangent'// 导数切线演示
  | 'trig-identity'     // 三角恒等变换
  | 'sequence-visual';  // 数列增长对比

// 知识点到可视化类型的映射
export const nodeDemos: Record<string, DemoType> = {
  // 向量相关（8个知识点）
  '25': 'vector-ops',
  '26': 'vector-ops',
  '27': 'vector-coords',
  '28': 'vector-triangle',
  '36': 'vector-ops',
  '37': 'vector-coords',
  '38': 'vector-coords',
  '39': 'vector-triangle',

  // 集合相关（3个知识点）
  '01': 'venn-sets',
  '02': 'venn-relations',
  '03': 'venn-sets',

  // 概率分布相关（5个知识点）
  '35': 'venn-sets',       // 事件关系用韦恩图
  '51': 'venn-sets',       // 条件概率用韦恩图
  '52': 'dist-binomial',   // 离散型随机变量
  '53': 'dist-binomial',   // 二项分布
  '54': 'dist-normal',     // 正态分布

  // 不等式（2个知识点）
  '07': 'inequality-mean', // 基本不等式
  '08': 'number-line',     // 二次不等式数轴

  // 导数（1个知识点）
  '48': 'derivative-tangent',

  // 三角恒等变换（1个知识点）
  '22': 'trig-identity',

  // 数列对比（已在 FunctionCanvas 中有，但可增强）
  // '45': 'sequence-visual',
  // '46': 'sequence-visual',
};

export function getNodeDemo(nodeId: string): DemoType | undefined {
  return nodeDemos[nodeId];
}
