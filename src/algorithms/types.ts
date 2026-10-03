// 算法步骤序列的通用类型定义
// 核心思想：每个算法先"真实执行"并记录每一步的状态快照，播放器按索引回放。

/** 通用步骤基类：所有算法步骤都包含这几个字段 */
export interface AlgoStep {
  /** 当前执行到的代码行号（与代码面板联动） */
  line?: number
  /** 这一步的中文讲解文字 */
  desc: string
  /** 是否为最终完成步骤 */
  done?: boolean
}

/** 排序算法步骤：用于柱状图可视化 */
export interface SortStep extends AlgoStep {
  /** 当前数组快照（null 表示空槽位，插入排序提取/移位时使用） */
  arr: readonly (number | null)[]
  /**
   * 每个位置的"柱子 id"（稳定身份标识，随值一起移动）。
   * 用于动画：交换/移位时按 id 匹配同一根柱子，让它从旧槽位滑到新槽位。
   * null 表示该位置当前无柱子（空槽）。
   */
  keys: readonly (number | null)[]
  /** 正在比较的下标对 */
  compare?: readonly [number, number] | null
  /** 正在交换的下标对 */
  swap?: readonly [number, number] | null
  /** 已就位（锁定）的下标集合 */
  sorted: readonly number[]
  /** 当前处理的下标（例如插入排序的当前元素） */
  active?: number | null
  /** 记录的最小值下标（选择排序） */
  minIndex?: number | null
  /** 当前扫描区间 [from, to] */
  range?: readonly [number, number] | null
  /** 插入排序中被提取出来"浮起"的元素值 */
  key?: number | null
  /** 累计比较次数 */
  comparisons: number
  /** 累计交换次数 */
  swaps: number
}

/** 查找算法步骤：用于横向数组卡片可视化 */
export interface SearchStep extends AlgoStep {
  arr: readonly number[]
  target: number
  /** 当前访问下标（顺序查找） */
  current?: number | null
  /** 二分查找三指针 */
  left?: number | null
  right?: number | null
  mid?: number | null
  /** 当前搜索区间 */
  range?: readonly [number, number] | null
  /** 是否命中 */
  found?: boolean
  /** 累计比较次数 */
  comparisons: number
}

/** 通用树节点（递归树 / 二叉树通用） */
export interface TreeNode {
  id: string
  parentId?: string | null
  /** 主文本，如 "f(4)" */
  label: string
  /** 副文本，如返回值 */
  sub?: string
}

/** 递归算法步骤（阶乘 / 斐波那契）：递归树 + 调用栈 */
export interface RecursionStep extends AlgoStep {
  nodes: TreeNode[]
  /** 当前正在处理的节点 id */
  activeIds: readonly string[]
  /** 已完成（已返回）的节点 id */
  doneIds: readonly string[]
  /** 调用栈帧（自底向上），phase: down=递推入栈 up=回归出栈 */
  stack: readonly { label: string; phase: 'down' | 'up' }[]
}

/** 汉诺塔步骤 */
export interface HanoiStep extends AlgoStep {
  /** 三根柱子，每根柱子上的盘（小盘在顶，数组内由大到小或由小到大均可，由渲染端约定） */
  poles: readonly (readonly number[])[]
  /** 正在移动的盘及其目标 */
  moving?: { disk: number; from: number; to: number } | null
  /** 累计移动步数 */
  count: number
}

/** 最大公约数（辗转相除）步骤 */
export interface GcdStep extends AlgoStep {
  a: number
  b: number
  r: number
  /** 历史三元组（a, b, a mod b），最后一行是当前 */
  rows: readonly { a: number; b: number; r: number }[]
  /** 当前行的下标 */
  currentRow: number
}

/** 链表步骤 */
export interface ListStep extends AlgoStep {
  /** 节点：id 唯一，val 为值，next 为后继 id 或 null */
  nodes: readonly { id: number; val: number; next: number | null }[]
  head: number | null
  /** 当前指针 p 指向的节点 id */
  pointer?: number | null
  /** 高亮类型与目标节点 */
  highlight?: { type: 'insert' | 'delete' | 'visit'; target: number } | null
  /** 展示用：被删除节点的值 */
  removedVal?: number | null
}

/** 队列步骤 */
export interface QueueStep extends AlgoStep {
  /** 存储区（null 表示空位） */
  arr: readonly (number | null)[]
  front: number
  rear: number
  /** 实际元素个数 */
  size: number
  op?: 'init' | 'enqueue' | 'dequeue' | 'full' | 'empty'
  value?: number | null
  /** 是否演示循环队列 */
  circular: boolean
}

/** 栈步骤 */
export interface StackStep extends AlgoStep {
  arr: readonly (number | string)[]
  top: number
  op?: 'init' | 'push' | 'pop' | 'peek'
  value?: number | string | null
}

/** 二叉树遍历步骤 */
export interface BTreeStep extends AlgoStep {
  /** 树节点（id 用唯一字符串） */
  nodes: TreeNode[]
  /** 已访问（按访问顺序记录）的节点 id */
  visited: readonly string[]
  /** 当前访问的节点 id */
  current?: string | null
  /** 遍历方式 */
  type: 'pre' | 'in' | 'post' | 'level'
}

/** 哈希表步骤 */
export interface HashStep extends AlgoStep {
  /** 每个桶的拉链内容 */
  buckets: readonly (readonly number[])[]
  /** 当前插入/查找的键 */
  key?: number | null
  /** 计算出的桶下标 */
  index?: number | null
  /** 线性探测走过的下标序列 */
  probe?: readonly number[] | null
  op?: 'insert' | 'search' | 'init'
  found?: boolean
}

/** 进制转换步骤 */
export interface RadixStep extends AlgoStep {
  /** 输入数字字符串（含数码 A~F） */
  input: string
  sourceBase: number
  targetBase: number
  /** 中间十进制值 */
  decimal: number
  /** 按权展开的每一项：数码、位权指数、基数的位权、该项值 */
  expandRows: readonly { digit: number; pos: number; power: number; term: number }[]
  /** 当前高亮的展开行 */
  expandCurrent: number
  /** 短除法过程（自顶向下每行：商、余数） */
  divRows: readonly { q: number; r: number }[]
  /** 当前高亮的除法行 */
  divCurrent: number
  /** 输出结果字符串 */
  result: string
  /** 当前阶段 */
  phase: 'expand' | 'divide' | 'done'
  /** 输入是否合法（数码是否在源进制范围内） */
  valid: boolean
}

/** 凯撒密码步骤 */
export interface CaesarStep extends AlgoStep {
  plain: string
  shift: number
  /** 当前处理到的字符下标 */
  index: number
  /** 当前已生成的密文 */
  cipher: string
}

/** 贪心（找零）步骤 */
export interface GreedyStep extends AlgoStep {
  coins: readonly number[]
  /** 剩余要找的金额 */
  remaining: number
  /** 每种面额已用数量 */
  used: readonly { coin: number; count: number }[]
  /** 当前正在尝试的面额 */
  trying?: number | null
  /** 最优解（反例对比用） */
  optimal?: readonly { coin: number; count: number }[] | null
  /** 是否为反例演示 */
  counterExample: boolean
}

/** SQL 查询步骤 */
export interface SqlStep extends AlgoStep {
  columns: readonly string[]
  rows: readonly (readonly (string | number)[])[]
  /** SELECT 选中的列下标 */
  selectedCols?: readonly number[] | null
  /** WHERE 命中的行下标 */
  filtered?: readonly number[] | null
  /** 当前逐行判断的行下标 */
  checking?: number | null
  /** 排序后的行序 */
  order?: readonly number[] | null
  /** 结果表 */
  result?: readonly (readonly (string | number)[])[] | null
}
