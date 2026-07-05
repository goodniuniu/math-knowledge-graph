// 高中数学知识图谱数据 - 基于2023版《高中知识清单》新教材版

export interface KnowledgeNode {
  id: string;
  title: string;
  subtitle?: string;
  category: string;
  book: string;
  formulas?: Formula[];
  keyPoints?: string[];
  graphType?: 'trig' | 'exponential' | 'logarithm' | 'power' | 'quadratic' | 'conic-ellipse' | 'conic-hyperbola' | 'conic-parabola' | 'sequence-arithmetic' | 'sequence-geometric' | 'vector' | 'probability' | 'none';
  related?: string[];
}

export interface Formula {
  name: string;
  latex: string;
  description?: string;
}

export interface Book {
  id: string;
  name: string;
  color: string;
  chapters: Chapter[];
}

export interface Chapter {
  id: string;
  name: string;
  nodes: KnowledgeNode[];
}

export const books: Book[] = [
  {
    id: 'bx1',
    name: '必修第一册',
    color: '#3b82f6',
    chapters: [
      {
        id: 'c1',
        name: '第一章 集合与常用逻辑用语',
        nodes: [
          { id: '01', title: '集合的概念', category: '集合', book: 'bx1', graphType: 'none' },
          { id: '02', title: '集合间的基本关系', category: '集合', book: 'bx1', graphType: 'none' },
          { id: '03', title: '集合的基本运算', category: '集合', book: 'bx1', graphType: 'none' },
          { id: '04', title: '充分条件与必要条件', category: '逻辑', book: 'bx1', graphType: 'none' },
          { id: '05', title: '全称量词与存在量词', category: '逻辑', book: 'bx1', graphType: 'none' },
        ]
      },
      {
        id: 'c2',
        name: '第二章 一元二次函数、方程和不等式',
        nodes: [
          { id: '06', title: '等式性质与不等式性质', category: '不等式', book: 'bx1', graphType: 'none' },
          { id: '07', title: '基本不等式', category: '不等式', book: 'bx1', graphType: 'none' },
          { id: '08', title: '二次函数与一元二次方程、不等式', category: '函数', book: 'bx1', graphType: 'quadratic' },
        ]
      },
      {
        id: 'c3',
        name: '第三章 函数的概念与性质',
        nodes: [
          { id: '09', title: '函数的概念及其表示', category: '函数', book: 'bx1', graphType: 'none' },
          { id: '10', title: '函数的基本性质', category: '函数', book: 'bx1', graphType: 'none' },
          { id: '11', title: '幂函数', category: '函数', book: 'bx1', graphType: 'power' },
          { id: '12', title: '函数的应用（一）', category: '函数', book: 'bx1', graphType: 'none' },
        ]
      },
      {
        id: 'c4',
        name: '第四章 指数函数与对数函数',
        nodes: [
          { id: '13', title: '指数', category: '函数', book: 'bx1', graphType: 'exponential' },
          { id: '14', title: '指数函数', category: '函数', book: 'bx1', graphType: 'exponential' },
          { id: '15', title: '对数', category: '函数', book: 'bx1', graphType: 'logarithm' },
          { id: '16', title: '对数函数', category: '函数', book: 'bx1', graphType: 'logarithm' },
          { id: '17', title: '函数的应用（二）', category: '函数', book: 'bx1', graphType: 'none' },
        ]
      },
      {
        id: 'c5',
        name: '第五章 三角函数',
        nodes: [
          { id: '18', title: '任意角和弧度制', category: '三角函数', book: 'bx1', graphType: 'none' },
          { id: '19', title: '三角函数的概念', category: '三角函数', book: 'bx1', graphType: 'trig' },
          { id: '20', title: '诱导公式', category: '三角函数', book: 'bx1', graphType: 'trig' },
          { id: '21', title: '三角函数的图象与性质', category: '三角函数', book: 'bx1', graphType: 'trig' },
          { id: '22', title: '三角恒等变换', category: '三角函数', book: 'bx1', graphType: 'trig' },
          { id: '23', title: '函数 y=Asin(ωx+φ)', category: '三角函数', book: 'bx1', graphType: 'trig' },
          { id: '24', title: '三角函数的应用', category: '三角函数', book: 'bx1', graphType: 'trig' },
        ]
      },
    ]
  },
  {
    id: 'bx2',
    name: '必修第二册',
    color: '#10b981',
    chapters: [
      {
        id: 'c6',
        name: '第六章 平面向量及其应用',
        nodes: [
          { id: '25', title: '平面向量的概念', category: '向量', book: 'bx2', graphType: 'vector' },
          { id: '26', title: '平面向量的运算', category: '向量', book: 'bx2', graphType: 'vector' },
          { id: '27', title: '平面向量基本定理及坐标表示', category: '向量', book: 'bx2', graphType: 'vector' },
          { id: '28', title: '平面向量的应用', category: '向量', book: 'bx2', graphType: 'vector' },
        ]
      },
      {
        id: 'c7',
        name: '第七章 复数',
        nodes: [
          { id: '29', title: '复数的四则运算', category: '复数', book: 'bx2', graphType: 'none' },
          { id: '30', title: '复数的三角表示', category: '复数', book: 'bx2', graphType: 'none' },
        ]
      },
      {
        id: 'c8',
        name: '第八章 立体几何初步',
        nodes: [
          { id: '31', title: '空间点、直线、平面之间的位置关系', category: '立体几何', book: 'bx2', graphType: 'none' },
          { id: '32', title: '空间直线、平面的平行', category: '立体几何', book: 'bx2', graphType: 'none' },
          { id: '33', title: '空间直线、平面的垂直', category: '立体几何', book: 'bx2', graphType: 'none' },
        ]
      },
      {
        id: 'c9',
        name: '第九章 统计',
        nodes: [
          { id: '34', title: '用样本估计总体', category: '统计', book: 'bx2', graphType: 'none' },
          { id: '35', title: '随机事件与概率', category: '概率', book: 'bx2', graphType: 'probability' },
        ]
      },
    ]
  },
  {
    id: 'xx1',
    name: '选择性必修第一册',
    color: '#f59e0b',
    chapters: [
      {
        id: 'c10',
        name: '第一章 空间向量与立体几何',
        nodes: [
          { id: '36', title: '空间向量及其运算', category: '向量', book: 'xx1', graphType: 'vector' },
          { id: '37', title: '空间向量基本定理', category: '向量', book: 'xx1', graphType: 'vector' },
          { id: '38', title: '空间向量及其运算的坐标表示', category: '向量', book: 'xx1', graphType: 'vector' },
          { id: '39', title: '空间向量的应用', category: '向量', book: 'xx1', graphType: 'vector' },
        ]
      },
      {
        id: 'c11',
        name: '第二章 直线和圆的方程',
        nodes: [
          { id: '40', title: '直线的交点坐标与距离公式', category: '解析几何', book: 'xx1', graphType: 'none' },
          { id: '41', title: '圆的方程', category: '解析几何', book: 'xx1', graphType: 'none' },
        ]
      },
      {
        id: 'c12',
        name: '第三章 圆锥曲线的方程',
        nodes: [
          { id: '42', title: '椭圆', category: '圆锥曲线', book: 'xx1', graphType: 'conic-ellipse' },
          { id: '43', title: '双曲线', category: '圆锥曲线', book: 'xx1', graphType: 'conic-hyperbola' },
          { id: '44', title: '抛物线', category: '圆锥曲线', book: 'xx1', graphType: 'conic-parabola' },
        ]
      },
    ]
  },
  {
    id: 'xx2',
    name: '选择性必修第二册',
    color: '#8b5cf6',
    chapters: [
      {
        id: 'c13',
        name: '第四章 数列',
        nodes: [
          { id: '45', title: '等差数列', category: '数列', book: 'xx2', graphType: 'sequence-arithmetic' },
          { id: '46', title: '等比数列', category: '数列', book: 'xx2', graphType: 'sequence-geometric' },
        ]
      },
      {
        id: 'c14',
        name: '第五章 一元函数的导数及其应用',
        nodes: [
          { id: '47', title: '导数的运算', category: '导数', book: 'xx2', graphType: 'none' },
          { id: '48', title: '导数在研究函数中的应用', category: '导数', book: 'xx2', graphType: 'none' },
        ]
      },
    ]
  },
  {
    id: 'xx3',
    name: '选择性必修第三册',
    color: '#ef4444',
    chapters: [
      {
        id: 'c15',
        name: '第六章 计数原理',
        nodes: [
          { id: '49', title: '排列与组合', category: '计数', book: 'xx3', graphType: 'none' },
          { id: '50', title: '二项式定理', category: '计数', book: 'xx3', graphType: 'none' },
        ]
      },
      {
        id: 'c16',
        name: '第七章 随机变量及其分布',
        nodes: [
          { id: '51', title: '条件概率与全概率公式', category: '概率', book: 'xx3', graphType: 'probability' },
          { id: '52', title: '离散型随机变量', category: '概率', book: 'xx3', graphType: 'probability' },
          { id: '53', title: '二项分布与超几何分布', category: '概率', book: 'xx3', graphType: 'probability' },
          { id: '54', title: '正态分布', category: '概率', book: 'xx3', graphType: 'probability' },
        ]
      },
      {
        id: 'c17',
        name: '第八章 成对数据的统计分析',
        nodes: [
          { id: '55', title: '成对数据的统计相关性', category: '统计', book: 'xx3', graphType: 'none' },
          { id: '56', title: '一元线性回归模型及其应用', category: '统计', book: 'xx3', graphType: 'none' },
          { id: '57', title: '列联表与独立性检验', category: '统计', book: 'xx3', graphType: 'none' },
        ]
      },
    ]
  },
];

// 辅助函数：获取所有节点
export function getAllNodes(): KnowledgeNode[] {
  const nodes: KnowledgeNode[] = [];
  books.forEach(book => {
    book.chapters.forEach(chapter => {
      chapter.nodes.forEach(node => {
        nodes.push({ ...node, book: book.name });
      });
    });
  });
  return nodes;
}

// 辅助函数：按类别获取节点
export function getNodesByCategory(category: string): KnowledgeNode[] {
  return getAllNodes().filter(n => n.category === category);
}

// 辅助函数：获取所有类别
export function getAllCategories(): string[] {
  const categories = new Set<string>();
  getAllNodes().forEach(n => categories.add(n.category));
  return Array.from(categories);
}

// 重要公式数据
export const importantFormulas: Record<string, Formula[]> = {
  '三角函数': [
    { name: '同角三角函数关系', latex: '\\sin^2\\alpha + \\cos^2\\alpha = 1', description: '平方和恒等式' },
    { name: '商数关系', latex: '\\tan\\alpha = \\frac{\\sin\\alpha}{\\cos\\alpha}', description: '正切定义' },
    { name: '诱导公式一', latex: '\\sin(\\alpha + 2k\\pi) = \\sin\\alpha, \\cos(\\alpha + 2k\\pi) = \\cos\\alpha', description: '周期为2π' },
    { name: '诱导公式二', latex: '\\sin(\\pi + \\alpha) = -\\sin\\alpha, \\cos(\\pi + \\alpha) = -\\cos\\alpha', description: 'π+α变换' },
    { name: '诱导公式三', latex: '\\sin(-\\alpha) = -\\sin\\alpha, \\cos(-\\alpha) = \\cos\\alpha', description: '负角变换' },
    { name: '诱导公式四', latex: '\\sin(\\pi - \\alpha) = \\sin\\alpha, \\cos(\\pi - \\alpha) = -\\cos\\alpha', description: 'π-α变换' },
    { name: '诱导公式五', latex: '\\sin(\\frac{\\pi}{2} - \\alpha) = \\cos\\alpha, \\cos(\\frac{\\pi}{2} - \\alpha) = \\sin\\alpha', description: '互余角' },
    { name: '诱导公式六', latex: '\\sin(\\frac{\\pi}{2} + \\alpha) = \\cos\\alpha, \\cos(\\frac{\\pi}{2} + \\alpha) = -\\sin\\alpha', description: 'π/2+α变换' },
    { name: '和角公式-正弦', latex: '\\sin(\\alpha + \\beta) = \\sin\\alpha\\cos\\beta + \\cos\\alpha\\sin\\beta', description: '正弦和角' },
    { name: '和角公式-余弦', latex: '\\cos(\\alpha + \\beta) = \\cos\\alpha\\cos\\beta - \\sin\\alpha\\sin\\beta', description: '余弦和角' },
    { name: '差角公式-正弦', latex: '\\sin(\\alpha - \\beta) = \\sin\\alpha\\cos\\beta - \\cos\\alpha\\sin\\beta', description: '正弦差角' },
    { name: '差角公式-余弦', latex: '\\cos(\\alpha - \\beta) = \\cos\\alpha\\cos\\beta + \\sin\\alpha\\sin\\beta', description: '余弦差角' },
    { name: '二倍角公式', latex: '\\sin 2\\alpha = 2\\sin\\alpha\\cos\\alpha', description: '正弦二倍角' },
    { name: '二倍角公式(余弦)', latex: '\\cos 2\\alpha = \\cos^2\\alpha - \\sin^2\\alpha = 2\\cos^2\\alpha - 1', description: '余弦二倍角' },
    { name: '辅助角公式', latex: 'a\\sin x + b\\cos x = \\sqrt{a^2+b^2}\\sin(x+\\varphi)', description: '其中tan φ = b/a' },
  ],
  '函数': [
    { name: '指数运算', latex: 'a^r \\cdot a^s = a^{r+s} (a>0, r,s\\in R)', description: '指数乘法' },
    { name: '指数幂运算', latex: '(a^r)^s = a^{rs} (a>0, r,s\\in R)', description: '指数幂' },
    { name: '对数运算', latex: '\\log_a(MN) = \\log_a M + \\log_a N', description: '对数乘法' },
    { name: '对数除法', latex: '\\log_a\\frac{M}{N} = \\log_a M - \\log_a N', description: '对数除法' },
    { name: '换底公式', latex: '\\log_a b = \\frac{\\log_c b}{\\log_c a} (a>0, a\\neq 1; c>0, c\\neq 1; b>0)', description: '换底' },
    { name: '对数恒等式', latex: 'a^{\\log_a N} = N (a>0, a\\neq 1, N>0)', description: '恒等式' },
  ],
  '数列': [
    { name: '等差数列通项', latex: 'a_n = a_1 + (n-1)d', description: 'a₁为首项，d为公差' },
    { name: '等差数列求和', latex: 'S_n = \\frac{n(a_1+a_n)}{2} = na_1 + \\frac{n(n-1)}{2}d', description: '前n项和' },
    { name: '等比数列通项', latex: 'a_n = a_1 q^{n-1}', description: 'a₁为首项，q为公比' },
    { name: '等比数列求和', latex: 'S_n = \\frac{a_1(1-q^n)}{1-q} (q\\neq 1)', description: '前n项和' },
  ],
  '圆锥曲线': [
    { name: '椭圆标准方程', latex: '\\frac{x^2}{a^2} + \\frac{y^2}{b^2} = 1 (a>b>0)', description: '焦点在x轴' },
    { name: '椭圆性质', latex: 'c^2 = a^2 - b^2, e = \\frac{c}{a} \\in (0,1)', description: '离心率' },
    { name: '双曲线标准方程', latex: '\\frac{x^2}{a^2} - \\frac{y^2}{b^2} = 1 (a>0,b>0)', description: '焦点在x轴' },
    { name: '双曲线性质', latex: 'c^2 = a^2 + b^2, e = \\frac{c}{a} > 1', description: '离心率' },
    { name: '抛物线标准方程', latex: 'y^2 = 2px (p>0)', description: '开口向右' },
    { name: '抛物线定义', latex: '|MF| = d (M到焦点距离 = M到准线距离)', description: '定义' },
  ],
  '向量': [
    { name: '向量数量积', latex: '\\vec{a} \\cdot \\vec{b} = |\\vec{a}||\\vec{b}|\\cos\\theta', description: '数量积定义' },
    { name: '向量坐标运算', latex: '\\vec{a} \\cdot \\vec{b} = x_1x_2 + y_1y_2', description: '坐标形式' },
    { name: '向量模', latex: '|\\vec{a}| = \\sqrt{x^2 + y^2}', description: '模长' },
    { name: '两点距离', latex: '|\\vec{AB}| = \\sqrt{(x_2-x_1)^2 + (y_2-y_1)^2}', description: '距离公式' },
    { name: '余弦定理', latex: 'c^2 = a^2 + b^2 - 2ab\\cos C', description: '三角形' },
    { name: '正弦定理', latex: '\\frac{a}{\\sin A} = \\frac{b}{\\sin B} = \\frac{c}{\\sin C} = 2R', description: '三角形' },
  ],
};

// 图形化知识点的详细参数配置
export interface GraphConfig {
  type: string;
  title: string;
  params: GraphParam[];
  description: string;
}

export interface GraphParam {
  name: string;
  key: string;
  min: number;
  max: number;
  step: number;
  default: number;
  label: string;
}

export const graphConfigs: Record<string, GraphConfig> = {
  'trig': {
    type: 'trig',
    title: '三角函数图像',
    description: '调节振幅A、角频率ω、初相位φ，观察正弦函数图像变化',
    params: [
      { name: '振幅 A', key: 'A', min: 0.1, max: 5, step: 0.1, default: 1, label: 'A' },
      { name: '角频率 ω', key: 'omega', min: 0.1, max: 5, step: 0.1, default: 1, label: 'ω' },
      { name: '初相位 φ', key: 'phi', min: -3.14, max: 3.14, step: 0.1, default: 0, label: 'φ' },
    ]
  },
  'exponential': {
    type: 'exponential',
    title: '指数函数图像',
    description: '调节底数a，观察指数函数 y = a^x 的图像变化',
    params: [
      { name: '底数 a', key: 'a', min: 0.1, max: 5, step: 0.1, default: 2, label: 'a' },
    ]
  },
  'logarithm': {
    type: 'logarithm',
    title: '对数函数图像',
    description: '调节底数a，观察对数函数 y = logₐ(x) 的图像变化',
    params: [
      { name: '底数 a', key: 'a', min: 0.1, max: 10, step: 0.1, default: 2, label: 'a' },
    ]
  },
  'power': {
    type: 'power',
    title: '幂函数图像',
    description: '调节指数n，观察幂函数 y = x^n 的图像变化',
    params: [
      { name: '指数 n', key: 'n', min: -3, max: 3, step: 0.1, default: 1, label: 'n' },
    ]
  },
  'quadratic': {
    type: 'quadratic',
    title: '二次函数图像',
    description: '调节a、b、c，观察二次函数 y = ax² + bx + c 的图像变化',
    params: [
      { name: 'a', key: 'a', min: -5, max: 5, step: 0.1, default: 1, label: 'a' },
      { name: 'b', key: 'b', min: -5, max: 5, step: 0.1, default: 0, label: 'b' },
      { name: 'c', key: 'c', min: -5, max: 5, step: 0.1, default: 0, label: 'c' },
    ]
  },
  'conic-ellipse': {
    type: 'conic-ellipse',
    title: '椭圆',
    description: '调节长半轴a和短半轴b，观察椭圆形状变化',
    params: [
      { name: '长半轴 a', key: 'a', min: 1, max: 5, step: 0.1, default: 3, label: 'a' },
      { name: '短半轴 b', key: 'b', min: 0.5, max: 5, step: 0.1, default: 2, label: 'b' },
    ]
  },
  'conic-hyperbola': {
    type: 'conic-hyperbola',
    title: '双曲线',
    description: '调节实半轴a和虚半轴b，观察双曲线形状变化',
    params: [
      { name: '实半轴 a', key: 'a', min: 0.5, max: 5, step: 0.1, default: 2, label: 'a' },
      { name: '虚半轴 b', key: 'b', min: 0.5, max: 5, step: 0.1, default: 1.5, label: 'b' },
    ]
  },
  'conic-parabola': {
    type: 'conic-parabola',
    title: '抛物线',
    description: '调节参数p，观察抛物线 y² = 2px 的形状变化',
    params: [
      { name: '参数 p', key: 'p', min: 0.5, max: 5, step: 0.1, default: 2, label: 'p' },
    ]
  },
  'sequence-arithmetic': {
    type: 'sequence-arithmetic',
    title: '等差数列',
    description: '调节首项a₁和公差d，观察等差数列变化',
    params: [
      { name: '首项 a₁', key: 'a1', min: -10, max: 10, step: 1, default: 1, label: 'a₁' },
      { name: '公差 d', key: 'd', min: -5, max: 5, step: 0.5, default: 1, label: 'd' },
    ]
  },
  'sequence-geometric': {
    type: 'sequence-geometric',
    title: '等比数列',
    description: '调节首项a₁和公比q，观察等比数列变化',
    params: [
      { name: '首项 a₁', key: 'a1', min: -10, max: 10, step: 1, default: 1, label: 'a₁' },
      { name: '公比 q', key: 'q', min: -3, max: 3, step: 0.1, default: 2, label: 'q' },
    ]
  },
};
