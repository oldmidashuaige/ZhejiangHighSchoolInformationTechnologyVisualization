// 插入排序：把当前元素插入到左侧已排序区的正确位置
import type { SortStep } from '../types'

export function insertionSortSteps(input: number[]): SortStep[] {
  const arr = [...input] as (number | null)[]
  const keys = arr.map((_, i) => i) as (number | null)[]
  const n = arr.length
  const steps: SortStep[] = []
  let comparisons = 0
  let moves = 0
  const sorted: number[] = []

  const val = (i: number): number => arr[i] as number

  const record = (patch: {
    line?: number
    desc: string
    compare?: readonly [number, number]
    swap?: readonly [number, number]
    active?: number
    range?: readonly [number, number]
    key?: number | null
    sorted?: readonly number[]
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
      key: null,
      comparisons,
      swaps: moves,
      ...patch,
    })
  }

  record({ desc: `初始数组：[${arr.join(', ')}]，n = ${n}，左侧视为已排序区（初始只有 arr[0]）`, line: 1 })

  for (let i = 1; i < n; i++) {
    const keyId = keys[i] as number
    const keyVal = val(i)
    arr[i] = null
    keys[i] = null
    record({
      desc: `取出 arr[${i}] = ${keyVal} 作为 key，腾出空位（key 暂存在"手里"）`,
      line: 4,
      key: keyVal,
      active: i,
      range: [0, i],
    })

    let j = i - 1
    // 从右往左找插入位置
    while (j >= 0) {
      comparisons++
      record({
        desc: `比较 arr[${j}] = ${val(j)} 与 key = ${keyVal}`,
        line: 6,
        compare: [j, j + 1],
        key: keyVal,
        active: j,
        range: [0, i],
      })
      if (val(j) > keyVal) {
        // 右移
        arr[j + 1] = arr[j]
        keys[j + 1] = keys[j]
        arr[j] = null
        keys[j] = null
        moves++
        record({
          desc: `arr[${j}] = ${val(j + 1)} > key，把它右移一位到 arr[${j + 1}]`,
          line: 7,
          swap: [j, j + 1],
          key: keyVal,
          active: j + 1,
          range: [0, i],
        })
        j--
      } else {
        record({
          desc: `arr[${j}] = ${val(j)} <= key，找到插入位置`,
          line: 6,
          compare: [j, j + 1],
          key: keyVal,
          active: j,
          range: [0, i],
        })
        break
      }
    }

    // 插入
    arr[j + 1] = keyVal
    keys[j + 1] = keyId
    record({
      desc: `把 key = ${keyVal} 插入到 arr[${j + 1}] → [${arr.join(', ')}]`,
      line: 9,
      key: null,
      active: j + 1,
      range: [0, i],
    })
  }

  for (let i = 0; i < n; i++) sorted.push(i)
  record({
    desc: `排序完成！比较 ${comparisons} 次，移动 ${moves} 次。数组已升序排列：[${arr.join(', ')}]`,
    line: 11,
    sorted,
    done: true,
  })

  return steps
}

export const insertionSortCode = `# 插入排序（升序）
def insertion_sort(a):
    n = len(a)
    for i in range(1, n):       # 1 从第 2 个元素开始
        key = a[i]              # 2 取出当前元素作为 key
        j = i - 1               # 3 从它左边开始找位置
        while j >= 0 and a[j] > key:  # 4 左移找插入点
            a[j + 1] = a[j]     # 5 比 key 大的右移一位
            j -= 1              # 6 继续向左
        a[j + 1] = key          # 7 插入 key 到正确位置
    return a                    # 8 返回排序后的数组`
