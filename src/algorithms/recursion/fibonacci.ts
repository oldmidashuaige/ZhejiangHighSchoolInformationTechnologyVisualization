// 斐波那契数列：递归调用树 + 重复子问题
import type { RecursionStep, TreeNode } from '../types'

export function fibonacciSteps(n: number): RecursionStep[] {
  const nn = Math.min(Math.max(Math.floor(n), 1), 8)
  const nodes: TreeNode[] = []
  const done: string[] = []
  const steps: RecursionStep[] = []
  let stack: { label: string; phase: 'down' | 'up' }[] = []

  // 统计每个 fib(k) 被调用的次数（用于"重复子问题"讲解）
  const callCount = new Map<number, number>()
  const countCall = (k: number) => callCount.set(k, (callCount.get(k) ?? 0) + 1)

  const fibs: number[] = [0, 1]
  for (let k = 2; k <= nn; k++) fibs[k] = fibs[k - 1] + fibs[k - 2]

  const record = (desc: string, active: string[], line: number) => {
    steps.push({ desc, line, nodes: nodes.map((x) => ({ ...x })), activeIds: active, doneIds: [...done], stack: [...stack] })
  }

  let seq = 0
  const mk = (k: number, parentId: string | null): string => {
    const id = `fib${seq++}`
    countCall(k)
    nodes.push({ id, label: `fib(${k})`, parentId, sub: k <= 1 ? '' : '?' })
    return id
  }

  const expand = (k: number, id: string): void => {
    if (k <= 1) {
      done.push(id)
      record(`fib(${k}) = ${k}，基准情形，直接返回`, [id], 1)
      return
    }
    // 展开左子
    stack.push({ label: `fib(${k})`, phase: 'down' })
    record(`fib(${k}) = fib(${k - 1}) + fib(${k - 2})，先递归调用 fib(${k - 1})（递推）`, [id], 3)
    expand(k - 1, mk(k - 1, id))
    stack.pop()
    // 展开右子
    stack.push({ label: `fib(${k})`, phase: 'down' })
    record(`fib(${k - 1}) 已算完，接着递归调用 fib(${k - 2})`, [id], 4)
    expand(k - 2, mk(k - 2, id))
    stack.pop()
    // 回归
    const node = nodes.find((x) => x.id === id)!
    node.sub = `= ${fibs[k]}`
    done.push(id)
    record(`fib(${k}) = fib(${k - 1}) + fib(${k - 2}) = ${fibs[k - 1]} + ${fibs[k - 2]} = ${fibs[k]}，返回（回归）`, [id], 5)
  }

  const rootId = mk(nn, null)
  record(
    `fib(x) 表示斐波那契数列的第 x 项：fib(0)=0、fib(1)=1、fib(n)=fib(n-1)+fib(n-2)（n≥2）。现在开始计算 fib(${nn})`,
    [rootId],
    1,
  )
  expand(nn, rootId)

  // 在最后补充调用次数小结
  const repeats = [...callCount.entries()].filter(([k, c]) => c > 1 && k >= 2)
  const totalCalls = [...callCount.values()].reduce((a, b) => a + b, 0)
  steps.push({
    desc: `递归共调用 ${totalCalls} 次${repeats.length ? `，其中 ${repeats.map(([k, c]) => `fib(${k}) 被重复算 ${c} 次`).join('、')}` : ''}，存在大量重复子问题，可用迭代或记忆化优化`,
    line: 5,
    nodes: nodes.map((x) => ({ ...x })),
    activeIds: [],
    doneIds: [...done],
    stack: [],
    done: true,
  })

  return steps
}

export const fibonacciCode = `# 递归计算斐波那契数列第 n 项
def fib(n):
    if n <= 1:              # 1 基准情形
        return n            # 2 fib(0)=0, fib(1)=1
    return fib(n - 1) + fib(n - 2)  # 3 递归式

print(fib(6))               # 调用：计算第 6 项`
