// 选择排序：每趟在未排序区选出最小值，交换到已排序区末尾
import type { SortStep } from '../types'

export function selectionSortSteps(input: number[]): SortStep[] {
  const arr = [...input] as (number | null)[]
  const keys = arr.map((_, i) => i) as (number | null)[]
  const n = arr.length
  const steps: SortStep[] = []
  let comparisons = 0
  let swaps = 0
  const sorted: number[] = []

  const val = (i: number): number => arr[i] as number

  const record = (patch: {
    line?: number
    desc: string
    compare?: readonly [number, number]
    swap?: readonly [number, number]
    sorted?: readonly number[]
    active?: number
    minIndex?: number
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
      key: null,
      comparisons,
      swaps,
      ...patch,
    })
  }

  record({ desc: `初始数组：[${arr.join(', ')}]，n = ${n}，准备开始选择排序`, line: 1 })

  for (let i = 0; i < n - 1; i++) {
    const pass = i + 1
    let k = i
    record({
      desc: `第 ${pass} 趟：在区间 [${i}, ${n - 1}] 中找最小值，先假设最小下标 k = ${i}`,
      line: 4,
      minIndex: k,
      active: i,
      range: [i, n - 1],
    })

    for (let j = i + 1; j < n; j++) {
      comparisons++
      record({
        desc: `比较 arr[${j}] = ${val(j)} 与当前最小值 arr[${k}] = ${val(k)}`,
        line: 6,
        compare: [k, j],
        minIndex: k,
        active: j,
        range: [i, n - 1],
      })
      if (val(j) < val(k)) {
        k = j
        record({
          desc: `arr[${j}] = ${val(j)} 更小，更新最小下标 k = ${j}`,
          line: 7,
          minIndex: k,
          active: j,
          range: [i, n - 1],
        })
      }
    }

    if (k !== i) {
      ;[arr[i], arr[k]] = [arr[k], arr[i]]
      ;[keys[i], keys[k]] = [keys[k], keys[i]]
      swaps++
      record({
        desc: `一趟扫描结束，把最小值 arr[${k}] = ${val(i)} 交换到 arr[${i}] → [${arr.join(', ')}]`,
        line: 9,
        swap: [i, k],
        range: [i, n - 1],
      })
    } else {
      record({
        desc: `一趟扫描结束，arr[${i}] 本身就是最小值，无需交换`,
        line: 9,
        range: [i, n - 1],
      })
    }

    sorted.push(i)
    record({
      desc: `arr[${i}] = ${val(i)} 已就位（锁定）`,
      line: 9,
      sorted: [...sorted],
      range: [i, n - 1],
    })
  }

  sorted.push(n - 1)
  record({
    desc: `排序完成！比较 ${comparisons} 次，交换 ${swaps} 次。数组已升序排列：[${arr.join(', ')}]`,
    line: 11,
    sorted: [...sorted],
    done: true,
  })

  return steps
}

export const selectionSortCode = `# 选择排序（升序）
def selection_sort(a):
    n = len(a)
    for i in range(n - 1):      # 1 外层循环：确定第 i 个位置
        k = i                   # 2 假设 arr[i] 最小
        for j in range(i + 1, n):  # 3 扫描未排序区
            if a[j] < a[k]:     # 4 发现更小值
                k = j           # 5 更新最小下标
        a[i], a[k] = a[k], a[i] # 6 最小元素交换到位置 i
    return a                    # 7 返回排序后的数组`
