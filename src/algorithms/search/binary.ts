// 对分查找（二分查找）：有序数组，每次把搜索区间缩小一半
import type { SearchStep } from '../types'

export function binarySearchSteps(input: number[], target: number): SearchStep[] {
  const arr = [...input]
  const steps: SearchStep[] = []
  let comparisons = 0

  const record = (patch: {
    line?: number
    desc: string
    left?: number
    right?: number
    mid?: number
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

  let left = 0
  let right = arr.length - 1

  record({
    desc: `前提：数组已升序排列。target = ${target}，初始区间 [left, right] = [0, ${right}]`,
    line: 1,
    left,
    right,
  })

  while (left <= right) {
    const mid = Math.floor((left + right) / 2)
    comparisons++
    record({
      desc: `mid = (left + right) // 2 = (${left} + ${right}) // 2 = ${mid}，比较 arr[${mid}] = ${arr[mid]} 与 ${target}`,
      line: 5,
      left,
      right,
      mid,
    })

    if (arr[mid] === target) {
      record({
        desc: `arr[${mid}] = ${arr[mid]} == ${target}，命中！查找成功，返回下标 ${mid}（比较 ${comparisons} 次）`,
        line: 6,
        left,
        right,
        mid,
        found: true,
        done: true,
      })
      return steps
    }

    if (arr[mid] < target) {
      record({
        desc: `arr[${mid}] = ${arr[mid]} < ${target}，说明目标在右半部分，left = mid + 1 = ${mid + 1}`,
        line: 8,
        left,
        right,
        mid,
      })
      left = mid + 1
    } else {
      record({
        desc: `arr[${mid}] = ${arr[mid]} > ${target}，说明目标在左半部分，right = mid - 1 = ${mid - 1}`,
        line: 10,
        left,
        right,
        mid,
      })
      right = mid - 1
    }

    if (left > right) {
      record({
        desc: `区间收缩后 left(${left}) > right(${right})，搜索区间已空，查找失败，返回 -1（比较 ${comparisons} 次）`,
        line: 12,
        left,
        right,
        mid,
        done: true,
      })
    } else {
      record({
        desc: `区间缩小为 [${left}, ${right}]，继续二分`,
        line: 12,
        left,
        right,
        mid,
      })
    }
  }

  return steps
}

export const binarySearchCode = `# 对分查找（二分查找，要求数组有序）
def binary_search(a, target):
    left, right = 0, len(a) - 1   # 1 初始区间
    while left <= right:          # 2 区间非空时继续
        mid = (left + right) // 2 # 3 取中间下标
        if a[mid] == target:      # 4 命中
            return mid            # 5 返回下标
        elif a[mid] < target:     # 6 目标在右半
            left = mid + 1        # 7 收缩左边界
        else:                     # 8 目标在左半
            right = mid - 1       # 9 收缩右边界
    return -1                     # 10 未找到`
