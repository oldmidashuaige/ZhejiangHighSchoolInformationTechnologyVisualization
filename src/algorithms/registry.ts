// 算法注册表：全部 18 个算法/主题的元信息
export type ModuleKey = 'sort' | 'search' | 'recursion' | 'datastructure' | 'others'

export interface AlgoMeta {
  id: string
  title: string
  module: ModuleKey
  level: '必考' | '选考' | '常考'
  desc: string
  /** 是否已实现上线 */
  available: boolean
}

export const MODULES: Record<ModuleKey, string> = {
  sort: '排序算法',
  search: '查找算法',
  recursion: '递归算法',
  datastructure: '数据结构',
  others: '其他算法',
}

export const ALGORITHMS: AlgoMeta[] = [
  // 排序
  { id: 'bubble', title: '冒泡排序', module: 'sort', level: '必考', desc: '相邻元素两两比较交换，把大值冒泡到末尾', available: true },
  { id: 'selection', title: '选择排序', module: 'sort', level: '必考', desc: '每趟选出最小元素放到已排序区末尾', available: true },
  { id: 'insertion', title: '插入排序', module: 'sort', level: '选考', desc: '把元素插入到已排序区的正确位置', available: true },
  // 查找
  { id: 'linear', title: '顺序查找', module: 'search', level: '必考', desc: '从前往后逐个比较查找目标值', available: true },
  { id: 'binary', title: '对分查找（二分查找）', module: 'search', level: '必考', desc: '有序数组中间切开，每次缩小一半搜索范围', available: true },
  // 递归
  { id: 'factorial', title: '阶乘（递归 + 调用栈）', module: 'recursion', level: '选考', desc: 'n! = n × (n-1)!，递推与回归两阶段', available: true },
  { id: 'fibonacci', title: '斐波那契数列', module: 'recursion', level: '选考', desc: '递归树展开，展示重复子问题与迭代优化', available: true },
  { id: 'hanoi', title: '汉诺塔', module: 'recursion', level: '选考', desc: '三柱圆盘移动动画，2^n - 1 步', available: true },
  { id: 'gcd', title: '最大公约数（辗转相除法）', module: 'recursion', level: '选考', desc: '欧几里得算法逐步取模演示', available: true },
  // 数据结构
  { id: 'linkedlist', title: '链表', module: 'datastructure', level: '选考', desc: '节点 + 指针，插入删除动画', available: true },
  { id: 'queue', title: '队列（循环队列）', module: 'datastructure', level: '选考', desc: 'front/rear 指针，入队出队动画', available: true },
  { id: 'stack', title: '栈', module: 'datastructure', level: '选考', desc: '压栈弹栈动画，括号匹配应用', available: true },
  { id: 'btree', title: '二叉树遍历', module: 'datastructure', level: '选考', desc: '前/中/后/层序遍历访问顺序动画', available: true },
  { id: 'hashtable', title: '哈希表 / 字典', module: 'datastructure', level: '选考', desc: '键值映射 + 冲突处理（拉链/线性探测）', available: true },
  // 其他
  { id: 'radix', title: '进制转换', module: 'others', level: '常考', desc: '短除法 + 权重展开验证', available: true },
  { id: 'caesar', title: '凯撒密码', module: 'others', level: '常考', desc: '字符平移加密解密动画', available: true },
  { id: 'greedy', title: '贪心算法（找零）', module: 'others', level: '常考', desc: '局部最优未必全局最优，含反例演示', available: true },
  { id: 'sql', title: 'SQL 数据查询', module: 'others', level: '必考', desc: 'SELECT / WHERE / ORDER BY 可视化', available: true },
]

export function getAlgorithm(id: string): AlgoMeta | undefined {
  return ALGORITHMS.find((a) => a.id === id)
}
