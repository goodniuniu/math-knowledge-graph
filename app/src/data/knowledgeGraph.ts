// 知识点之间的关联关系
// 用于知识图谱网络可视化
// 每条关系表示两个知识点之间的先修/延伸关系

export interface KnowledgeEdge {
  source: string;
  target: string;
  type: 'prerequisite' | 'related' | 'application';
  label?: string;
}

// 知识图谱边数据
export const knowledgeEdges: KnowledgeEdge[] = [
  // 集合 → 逻辑
  { source: '01', target: '02', type: 'prerequisite', label: '概念→关系' },
  { source: '02', target: '03', type: 'prerequisite', label: '关系→运算' },
  { source: '01', target: '04', type: 'related', label: '集合与逻辑' },
  { source: '04', target: '05', type: 'prerequisite' },
  { source: '03', target: '06', type: 'related', label: '运算→不等式' },

  // 不等式链
  { source: '06', target: '07', type: 'prerequisite' },
  { source: '07', target: '08', type: 'prerequisite', label: '基本不等式→二次' },

  // 函数链
  { source: '03', target: '09', type: 'prerequisite', label: '集合→函数概念' },
  { source: '09', target: '10', type: 'prerequisite', label: '概念→性质' },
  { source: '10', target: '11', type: 'prerequisite', label: '性质→幂函数' },
  { source: '11', target: '12', type: 'application' },
  { source: '09', target: '12', type: 'application' },

  // 指数对数链
  { source: '10', target: '13', type: 'prerequisite', label: '性质→指数' },
  { source: '13', target: '14', type: 'prerequisite', label: '指数→指数函数' },
  { source: '14', target: '15', type: 'related', label: '指数→对数' },
  { source: '15', target: '16', type: 'prerequisite', label: '对数→对数函数' },
  { source: '14', target: '16', type: 'related', label: '互为反函数' },
  { source: '16', target: '17', type: 'application' },
  { source: '12', target: '17', type: 'application' },

  // 三角函数链
  { source: '08', target: '18', type: 'related', label: '弧度制' },
  { source: '18', target: '19', type: 'prerequisite', label: '任意角→概念' },
  { source: '19', target: '20', type: 'prerequisite', label: '概念→诱导公式' },
  { source: '20', target: '21', type: 'prerequisite', label: '诱导→图象性质' },
  { source: '21', target: '22', type: 'prerequisite', label: '图象→恒等变换' },
  { source: '21', target: '23', type: 'prerequisite', label: '图象→y=Asin(ωx+φ)' },
  { source: '22', target: '23', type: 'related' },
  { source: '23', target: '24', type: 'application', label: '应用' },

  // 向量链
  { source: '19', target: '25', type: 'related', label: '三角→向量' },
  { source: '25', target: '26', type: 'prerequisite', label: '概念→运算' },
  { source: '26', target: '27', type: 'prerequisite', label: '运算→坐标' },
  { source: '27', target: '28', type: 'application', label: '坐标→应用' },
  { source: '28', target: '24', type: 'related', label: '向量与三角' },

  // 复数链
  { source: '27', target: '29', type: 'related', label: '坐标→复数' },
  { source: '29', target: '30', type: 'prerequisite', label: '四则→三角形式' },
  { source: '19', target: '30', type: 'related', label: '三角函数→复数' },

  // 立体几何链
  { source: '25', target: '31', type: 'related', label: '向量→空间' },
  { source: '31', target: '32', type: 'prerequisite', label: '位置→平行' },
  { source: '31', target: '33', type: 'prerequisite', label: '位置→垂直' },
  { source: '32', target: '33', type: 'related' },

  // 统计概率链
  { source: '03', target: '34', type: 'related', label: '集合→统计' },
  { source: '34', target: '35', type: 'prerequisite', label: '估计→概率' },
  { source: '35', target: '51', type: 'prerequisite', label: '概率→条件概率' },
  { source: '51', target: '52', type: 'prerequisite', label: '条件→随机变量' },
  { source: '52', target: '53', type: 'prerequisite', label: '随机变量→分布' },
  { source: '53', target: '54', type: 'prerequisite', label: '二项→正态' },
  { source: '34', target: '55', type: 'prerequisite', label: '统计→相关性' },
  { source: '55', target: '56', type: 'prerequisite', label: '相关→回归' },
  { source: '56', target: '57', type: 'prerequisite', label: '回归→独立性检验' },

  // 空间向量链（选择性必修）
  { source: '27', target: '36', type: 'prerequisite', label: '平面向量→空间向量' },
  { source: '36', target: '37', type: 'prerequisite' },
  { source: '37', target: '38', type: 'prerequisite' },
  { source: '38', target: '39', type: 'application' },
  { source: '33', target: '39', type: 'related', label: '垂直→向量应用' },

  // 解析几何链
  { source: '08', target: '40', type: 'prerequisite', label: '二次→直线' },
  { source: '40', target: '41', type: 'prerequisite', label: '直线→圆' },
  { source: '41', target: '42', type: 'prerequisite', label: '圆→椭圆' },
  { source: '42', target: '43', type: 'related', label: '椭圆→双曲线' },
  { source: '42', target: '44', type: 'related', label: '椭圆→抛物线' },

  // 数列链
  { source: '09', target: '45', type: 'related', label: '函数→数列' },
  { source: '45', target: '46', type: 'related', label: '等差→等比' },

  // 导数链
  { source: '13', target: '47', type: 'prerequisite', label: '指数→导数运算' },
  { source: '15', target: '47', type: 'prerequisite', label: '对数→导数运算' },
  { source: '47', target: '48', type: 'prerequisite', label: '运算→应用' },
  { source: '10', target: '48', type: 'related', label: '性质→导数应用' },
  { source: '45', target: '48', type: 'related', label: '数列→导数' },

  // 计数原理链
  { source: '49', target: '50', type: 'prerequisite', label: '排列组合→二项式' },
  { source: '50', target: '53', type: 'related', label: '二项式→二项分布' },
  { source: '49', target: '52', type: 'related', label: '组合→随机变量' },

  // 跨模块关联
  { source: '07', target: '45', type: 'related', label: '不等式→数列' },
  { source: '08', target: '44', type: 'related', label: '二次→抛物线' },
  { source: '22', target: '47', type: 'related', label: '三角→导数' },
  { source: '21', target: '48', type: 'related', label: '三角→导数应用' },
];

// 按类别获取节点颜色
export const categoryColors: Record<string, string> = {
  '集合': '#3b82f6',
  '逻辑': '#6366f1',
  '不等式': '#8b5cf6',
  '函数': '#ec4899',
  '三角函数': '#ef4444',
  '向量': '#10b981',
  '复数': '#14b8a6',
  '立体几何': '#f59e0b',
  '统计': '#06b6d4',
  '概率': '#0ea5e9',
  '解析几何': '#f97316',
  '圆锥曲线': '#eab308',
  '数列': '#a855f7',
  '导数': '#d946ef',
  '计数': '#64748b',
};
