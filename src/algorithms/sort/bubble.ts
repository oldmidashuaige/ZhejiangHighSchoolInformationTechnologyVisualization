// 冒泡排序：真实执行并记录每一步状态，生成步骤序列
import type { SortStep } from '../types'

/**
 * 生成冒泡排序的完整步骤序列。
 * 算法逻辑（真实排序）+ 记录器（录制快照）分离，保证动画与真实执行一致。
 */
export function bubbleSortSteps(input: number[]): SortStep[] {
  const arr = [...input]
  const n = arr.length
  const steps: SortStep[] = []
  let comparisons = 0
  let swaps = 0
  const sorted: number[] = []
  // 柱子稳定身份：初始 0..n-1，随值一起交换（用于交换动画）
  const keys = arr.map((_, i) => i)

  const record = (patch: {
    line?: number
    desc: string
    compare?: readonly [number, number]
    swap?: readonly [number, number]
    sorted?: readonly number[]
    active?: number
    range?: readonly [number, number]
    done?: boolean
  }): void => {
    steps.push({
      arr: [...arr],
      keys: [...keys],
      compare: null,
      swap: null,
      sorted: [...sorted],
      active: null,
      minIndex: null,
      range: null,
      comparisons,
      swaps,
      ...patch,
    })
  }

  // 第 1 行：初始状态
  record({ desc: `初始数组：[${arr.join(', ')}]，n = ${n}，准备开始冒泡排序`, line: 1 })

  // 第 4 行：外层循环
  for (let i = 0; i < n - 1; i++) {
    const pass = i + 1
    record({
      desc: `第 ${pass} 趟开始：前 ${n - i} 个元素中，两两比较把最大值"冒泡"到最后`,
      line: 4,
      range: [0, n - 1 - i],
    })

    // 第 5 行：内层循环
    for (let j = 0; j < n - 1 - i; j++) {
      comparisons++
      const v1 = arr[j]
      const v2 = arr[j + 1]
      const j2 = j + 1
      record({
        desc: `比较 arr[${j}] = ${v1} 与 arr[${j2}] = ${v2}`,
        line: 5,
        compare: [j, j2],
        active: j,
      })

      // 第 6 行：若前大后小则交换
      if (arr[j] > arr[j + 1]) {
        ;[arr[j], arr[j + 1]] = [arr[j + 1], arr[j]]
        ;[keys[j], keys[j + 1]] = [keys[j + 1], keys[j]]
        swaps++
        record({
          desc: `arr[${j}] > arr[${j2}]，交换两元素 → [${arr.join(', ')}]`,
          line: 6,
          swap: [j, j2],
        })
      }
    }

    const doneIdx = n - 1 - i
    const doneVal = arr[doneIdx]
    sorted.push(doneIdx)
    record({
      desc: `第 ${pass} 趟结束，arr[${doneIdx}] = ${doneVal} 已就位（锁定）`,
      line: 4,
      sorted: [...sorted],
      range: [0, n - 1 - i],
    })
  }

  sorted.push(0)
  record({
    desc: `排序完成！比较 ${comparisons} 次，交换 ${swaps} 次。数组已升序排列：[${arr.join(', ')}]`,
    line: 7,
    sorted: [...sorted],
    done: true,
  })

  return steps
}

/** 冒泡排序的讲解用 Python 代码（行号与步骤中的 line 对应） */
export const bubbleSortCode = `# 冒泡排序（升序）
def bubble_sort(a):
    n = len(a)                  # 1 获取数组长度
    for i in range(n - 1):      # 2 外层循环：共 n-1 趟
        for j in range(n - 1 - i):  # 3 内层循环：每趟少比较 1 个
            if a[j] > a[j + 1]:     # 4 前大后小则交换
                a[j], a[j + 1] = a[j + 1], a[j]
    return a                    # 5 返回排序后的数组`

/** 生成一组随机数组 */
export function randomArray(n = 8, max = 20): number[] {
  const set = new Set<number>()
  while (set.size < n) {
    set.add(1 + Math.floor(Math.random() * max))
  }
  return [...set]
}
