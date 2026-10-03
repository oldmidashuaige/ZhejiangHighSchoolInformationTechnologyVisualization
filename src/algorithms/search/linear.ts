// 顺序查找：从前往后逐个比较
import type { SearchStep } from '../types'

export function linearSearchSteps(input: number[], target: number): SearchStep[] {
  const arr = [...input]
  const n = arr.length
  const steps: SearchStep[] = []
  let comparisons = 0

  const record = (patch: {
    line?: number
    desc: string
    current?: number
    found?: boolean
    done?: boolean
  }): void => {
    steps.push({
      arr: [...arr],
      target,
      current: null,
      left: null,
      right: null,
      mid: null,
      range: null,
      found: false,
      comparisons,
      ...patch,
    })
  }

  record({ desc: `目标 target = ${target}，数组长度 n = ${n}，从下标 0 开始逐个查找`, line: 1 })

  for (let i = 0; i < n; i++) {
    comparisons++
    record({
      desc: `检查 arr[${i}] = ${arr[i]} 是否等于 ${target}`,
      line: 4,
      current: i,
    })
    if (arr[i] === target) {
      record({
        desc: `arr[${i}] = ${arr[i]} == ${target}，命中！查找成功，返回下标 ${i}`,
        line: 5,
        current: i,
        found: true,
        done: true,
      })
      return steps
    }
    record({
      desc: `arr[${i}] = ${arr[i]} != ${target}，继续向后查找`,
      line: 6,
      current: i,
    })
  }

  record({
    desc: `遍历完整个数组都没有找到 ${target}，查找失败，返回 -1（共比较 ${comparisons} 次）`,
    line: 8,
    found: false,
    done: true,
  })
  return steps
}

export const linearSearchCode = `# 顺序查找
def linear_search(a, target):
    n = len(a)
    for i in range(n):      # 1 从头到尾逐个检查
        if a[i] == target:  # 2 找到目标
            return i        # 3 返回下标
    return -1               # 4 未找到，返回 -1`

export const DEFAULT_SEARCH_DATA = [2, 5, 8, 12, 17, 21, 30, 36]
