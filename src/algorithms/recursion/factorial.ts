// 阶乘：递归调用 + 调用栈演示
import type { RecursionStep, TreeNode } from '../types'

export function factorialSteps(n: number): RecursionStep[] {
  const nn = Math.min(Math.max(Math.floor(n), 0), 10)
  const nodes: TreeNode[] = []
  const done: string[] = []
  const steps: RecursionStep[] = []
  let stack: { label: string; phase: 'down' | 'up' }[] = []

  const id = (k: number) => `f${k}`
  const record = (desc: string, active: string[], line: number) => {
    steps.push({ desc, line, nodes: nodes.map((x) => ({ ...x })), activeIds: active, doneIds: [...done], stack: [...stack] })
  }

  // 初始：根节点
  nodes.push({ id: id(nn), label: `fact(${nn})`, parentId: null, sub: '?' })
  stack = [{ label: `fact(${nn})`, phase: 'down' }]
  record(`计算 fact(${nn})：fact(${nn}) = ${nn} × fact(${nn - 1})，需要先调用 fact(${nn - 1})（递推）`, [id(nn)], 3)

  // 递推阶段：不断往下调用
  for (let k = nn; k >= 1; k--) {
    const child = id(k - 1)
    nodes.push({ id: child, label: `fact(${k - 1})`, parentId: id(k), sub: '?' })
    stack.push({ label: `fact(${k - 1})`, phase: 'down' })
    record(`调用 fact(${k - 1})，把新的一层压入调用栈（递推下降）`, [child], 3)
  }

  // 基准情形
  done.push(id(0))
  stack.pop()
  record(`fact(0) = 1 是基准情形（终止条件），不再递归，直接返回 1 并弹出调用栈`, [], 1)

  // 回归阶段：逐层返回结果
  const facts: number[] = [1]
  for (let k = 1; k <= nn; k++) facts[k] = k * facts[k - 1]
  for (let k = 1; k <= nn; k++) {
    const node = nodes.find((x) => x.id === id(k))!
    node.sub = `= ${facts[k]}`
    done.push(id(k))
    stack.pop()
    record(
      `fact(${k}) = ${k} × fact(${k - 1}) = ${k} × ${facts[k - 1]} = ${facts[k]}，把结果带回上一层（回归上升）`,
      [id(k)],
      3,
    )
  }

  return steps
}

export const factorialCode = `# 递归计算 n!
def fact(n):
    if n == 0:              # 1 基准情形（终止条件）
        return 1            # 2 0! = 1
    return n * fact(n - 1)  # 3 递归式：n! = n × (n-1)!

print(fact(5))              # 调用：计算 5!`
