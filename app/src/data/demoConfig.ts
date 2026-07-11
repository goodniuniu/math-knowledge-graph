// 知识点可视化演示类型配置
// 将知识点 ID 映射到对应的可视化组件类型

export type DemoType =
  | 'vector-ops'        // 向量运算
  | 'vector-coords'     // 向量坐标表示
  | 'vector-triangle'   // 向量与三角形
  | 'venn-sets'         // 集合运算韦恩图
  | 'venn-relations'    // 集合间关系
  | 'dist-normal'       // 正态分布
  | 'dist-binomial'     // 二项分布
  | 'inequality-mean'   // 基本不等式
  | 'number-line'       // 数轴表示
  | 'derivative-tangent'// 导数切线
  | 'trig-identity'     // 三角恒等变换
  | 'simple-harmonic'   // 简谐运动场景
  | 'complex-basic'     // 复数平面
  | 'complex-trig'      // 复数三角形式
  | 'geometry-position' // 立体几何位置关系
  | 'geometry-parallel' // 线面平行
  | 'geometry-perp'     // 线面垂直
  | 'stats-histogram'   // 频率分布直方图
  | 'stats-scatter'     // 散点图与相关
  | 'stats-regression'  // 回归分析
  | 'stats-contingency' // 列联表与卡方
  | 'coord-line'        // 直线交点
  | 'coord-circle'      // 圆的方程
  | 'coord-angle'       // 角度与弧度
  | 'pascal'            // 杨辉三角
  | 'combination'       // 排列组合
  | 'logic-condition'   // 充分必要条件
  | 'logic-quantifier'  // 全称存在量词
  | 'logic-inequality'  // 不等式性质
  | 'function-application' // 函数应用（一）
  // 增强可视化（19个新类型）
  | 'enhanced-function-machine'   // 函数概念（09）
  | 'enhanced-properties'         // 函数性质（10）
  | 'enhanced-zero-hunter'        // 零点与二分法（17）
  | 'enhanced-derivative'         // 导数概念（47）
  | 'enhanced-quadratic'          // 二次函数三合一（08）
  | 'enhanced-power'              // 幂函数家族（11）
  | 'enhanced-exponential'        // 指数增长（13）
  | 'enhanced-decay'              // 指数衰减（14）
  | 'enhanced-log-scale'          // 对数运算（15）
  | 'enhanced-inverse'            // 反函数（16）
  | 'enhanced-unit-circle'        // 单位圆（19）
  | 'enhanced-symmetry'           // 三角函数性质（20）
  | 'enhanced-five-point'         // 五点作图（21）
  | 'enhanced-wave'              // 波形合成（23）
  | 'enhanced-ellipse'            // 椭圆（42）
  | 'enhanced-hyperbola'          // 双曲线（43）
  | 'enhanced-parabola'           // 抛物线（44）
  | 'enhanced-arithmetic'         // 等差数列（45）
  | 'enhanced-geometric';         // 等比数列（46）

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
  '08': 'enhanced-quadratic', // 二次函数三合一

  // 导数（1个知识点）
  '48': 'derivative-tangent',

  // 三角恒等变换（1个知识点）
  '22': 'trig-identity',

  // 三角函数应用（1个知识点）
  '24': 'simple-harmonic',

  // 数列对比（已在 FunctionCanvas 中有，但可增强）
  // '45': 'sequence-visual',
  // '46': 'sequence-visual',

  // 复数（2个知识点）
  '29': 'complex-basic',
  '30': 'complex-trig',

  // 立体几何（3个知识点）
  '31': 'geometry-position',
  '32': 'geometry-parallel',
  '33': 'geometry-perp',

  // 统计（4个知识点）
  '34': 'stats-histogram',
  '55': 'stats-scatter',
  '56': 'stats-regression',
  '57': 'stats-contingency',

  // 坐标几何与角度（3个知识点）
  '40': 'coord-line',
  '41': 'coord-circle',
  '18': 'coord-angle',

  // 排列组合与二项式（2个知识点）
  '49': 'pascal',
  '50': 'combination',

  // 逻辑与不等式（3个知识点）
  '04': 'logic-condition',
  '05': 'logic-quantifier',
  '06': 'logic-inequality',

  // 函数应用（1个知识点）
  '12': 'function-application',

  // 增强可视化（19个知识点）
  '09': 'enhanced-function-machine',   // 函数概念
  '10': 'enhanced-properties',         // 函数性质
  '17': 'enhanced-zero-hunter',        // 零点与二分法
  '47': 'enhanced-derivative',         // 导数运算
  '11': 'enhanced-power',              // 幂函数
  '13': 'enhanced-exponential',        // 指数
  '14': 'enhanced-decay',              // 指数函数
  '15': 'enhanced-log-scale',          // 对数
  '16': 'enhanced-inverse',            // 对数函数（反函数）
  '19': 'enhanced-unit-circle',        // 三角函数概念
  '20': 'enhanced-symmetry',           // 诱导公式
  '21': 'enhanced-five-point',         // 三角函数图象
  '23': 'enhanced-wave',              // y=Asin(ωx+φ)
  '42': 'enhanced-ellipse',            // 椭圆
  '43': 'enhanced-hyperbola',          // 双曲线
  '44': 'enhanced-parabola',           // 抛物线
  '45': 'enhanced-arithmetic',         // 等差数列
  '46': 'enhanced-geometric',          // 等比数列
};

export function getNodeDemo(nodeId: string): DemoType | undefined {
  return nodeDemos[nodeId];
}
