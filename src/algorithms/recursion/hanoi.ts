// 汉诺塔：三柱圆盘移动 + 递归调用树
import type { HanoiStep, TreeNode } from '../types'

export function hanoiSteps(m: number): HanoiStep[] {
  const nn = Math.min(Math.max(Math.floor(m), 1), 7)
  const steps: HanoiStep[] = []
  // 柱子 0=A, 1=B, 2=C；盘 1 最小，nn 最大
  const poles: number[][] = [
    Array.from({ length: nn }, (_, i) => nn - i),
    [],
    [],
  ]
  let count = 0

  const record = (patch: {
    desc: string
    moving?: { disk: number; from: number; to: number } | null
    done?: boolean
  }) => {
    steps.push({
      poles: poles.map((p) => [...p]),
      moving: patch.moving ?? null,
      count,
      desc: patch.desc,
      done: patch.done,
    })
  }

  const NAME = ['A', 'B', 'C']

  record({ desc: `目标：把 ${nn} 个圆盘从 A 柱移到 C 柱，每次只能移动一个盘，大盘不能压在小盘上`, moving: null })

  const hanoi = (n: number, from: number, aux: number, to: number): void => {
    if (n === 1) {
      const disk = poles[from].pop()!
      poles[to].push(disk)
      count++
      record({
        desc: `移动盘 ${disk}：从 ${NAME[from]} 柱 到 ${NAME[to]} 柱（第 ${count} 步）`,
        moving: { disk, from, to },
      })
      return
    }
    // 先把上面 n-1 个盘从 from 借助 to 移到 aux
    hanoi(n - 1, from, to, aux)
    // 把最大的盘从 from 移到 to
    const disk = poles[from].pop()!
    poles[to].push(disk)
    count++
    record({
      desc: `移动盘 ${disk}：从 ${NAME[from]} 柱 到 ${NAME[to]} 柱（第 ${count} 步）`,
      moving: { disk, from, to },
    })
    // 再把 n-1 个盘从 aux 借助 from 移到 to
    hanoi(n - 1, aux, from, to)
  }

  hanoi(nn, 0, 1, 2)

  record({
    desc: `完成！共移动 ${count} 步（2^${nn} - 1 = ${count}）`,
    moving: null,
    done: true,
  })

  return steps
}

/** 汉诺塔的递归调用树（用于旁边的小树展示） */
export function hanoiTree(m: number): { nodes: TreeNode[] } {
  const nn = Math.min(Math.max(Math.floor(m), 1), 7)
  const nodes: TreeNode[] = []
  let seq = 0
  const NAME = ['A', 'B', 'C']

  const mk = (n: number, from: number, to: number, parent: string | null): void => {
    const id = `h${seq++}`
    const aux = 3 - from - to
    nodes.push({ id, label: `h(${n})`, sub: `${NAME[from]}→${NAME[to]}`, parentId: parent })
    if (n > 1) {
      mk(n - 1, from, aux, id)
      mk(n - 1, aux, to, id)
    }
  }
  mk(nn, 0, 2, null)
  return { nodes }
}

export const hanoiCode = `# 汉诺塔：把 n 个盘从 from 移到 to，借助 aux
def hanoi(n, from_, aux, to):
    if n == 1:              # 1 只剩一个盘
        print(f"移 {from_}->{to}")  # 2 直接移动
        return
    hanoi(n - 1, from_, to, aux)   # 3 先把 n-1 个移到辅助柱
    print(f"移 {from_}->{to}")     # 4 移动最大盘
    hanoi(n - 1, aux, from_, to)   # 5 再把 n-1 个移到目标柱

# 调用：把 3 个盘从 A 移到 C，借助 B
# hanoi(3, "A", "B", "C")
# 总步数 = 2^n - 1`
