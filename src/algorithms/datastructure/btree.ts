// 二叉树遍历：前序 / 中序 / 后序 / 层序
import type { BTreeStep, TreeNode } from '../types'

export type TraversalType = 'pre' | 'in' | 'post' | 'level'

export function btreeSteps(type: TraversalType): BTreeStep[] {
  // 完全二叉树（层次序）：5, 3, 8, 2, 4, 7, 9
  const values = [5, 3, 8, 2, 4, 7, 9]
  const nodes: TreeNode[] = values.map((v, i) => ({
    id: `n${i}`,
    label: `${v}`,
    parentId: i > 0 ? `n${Math.floor((i - 1) / 2)}` : null,
    sub: '',
  }))

  // 递归序
  const pre: number[] = []
  const inorder: number[] = []
  const post: number[] = []
  const walk = (i: number) => {
    if (i >= values.length) return
    pre.push(i)
    walk(2 * i + 1)
    inorder.push(i)
    walk(2 * i + 2)
    post.push(i)
  }
  walk(0)
  // 层序
  const level: number[] = []
  for (let i = 0; i < values.length; i++) level.push(i)

  const orderMap: Record<TraversalType, number[]> = { pre, in: inorder, post, level }
  const order = orderMap[type]

  const steps: BTreeStep[] = []
  const visited: string[] = []

  const typeName: Record<TraversalType, string> = {
    pre: '前序（根左右）',
    in: '中序（左根右）',
    post: '后序（左右根）',
    level: '层序（从上到下、从左到右）',
  }

  steps.push({ desc: `${typeName[type]}：二叉树的遍历顺序为...`, nodes: nodes.map((n) => ({ ...n })), visited: [], current: null, type, line: 1 })

  for (let k = 0; k < order.length; k++) {
    const id = `n${order[k]}`
    visited.push(id)
    const v = values[order[k]]
    let desc = ''
    if (type === 'pre') desc = `前序：先访问根节点 ${v}（根 → 左 → 右）`
    else if (type === 'in') desc = `中序：访问根节点 ${v}（左 → 根 → 右）`
    else if (type === 'post') desc = `后序：访问根节点 ${v}（左 → 右 → 根）`
    else desc = `层序：按层从上到下、从左到右访问 ${v}`
    steps.push({
      desc: `${desc}，访问顺序 ${k + 1}`,
      nodes: nodes.map((n) => ({ ...n })),
      visited: [...visited],
      current: id,
      type,
      line: 3,
    })
  }

  steps.push({
    desc: `${typeName[type]}遍历完成，访问顺序：${order.map((i) => values[i]).join(' → ')}`,
    nodes: nodes.map((n) => ({ ...n })),
    visited,
    current: null,
    type,
    done: true,
    line: 4,
  })

  return steps
}

export function traversalSummary(): string {
  return '前序 5→3→2→4→8→7→9；中序 2→3→4→5→7→8→9；后序 2→4→3→7→9→8→5；层序 5→3→8→2→4→7→9'
}

export const btreeCode = `# 用数组存完全二叉树（下标从 0 开始）
# 左孩子 = 2i+1，右孩子 = 2i+2，父节点 = (i-1)//2
tree = [5, 3, 8, 2, 4, 7, 9]

def preorder(i):            # 前序：根 左 右
    if i >= len(tree): return
    print(tree[i])          # 1 访问根
    preorder(2 * i + 1)     # 2 左子树
    preorder(2 * i + 2)     # 3 右子树

def inorder(i):             # 中序：左 根 右
    if i >= len(tree): return
    inorder(2 * i + 1)      # 1 左子树
    print(tree[i])          # 2 访问根
    inorder(2 * i + 2)      # 3 右子树

def postorder(i):           # 后序：左 右 根
    if i >= len(tree): return
    postorder(2 * i + 1)
    postorder(2 * i + 2)
    print(tree[i])

# 层序：直接用下标顺序输出即可
# for i in range(len(tree)): print(tree[i])`
