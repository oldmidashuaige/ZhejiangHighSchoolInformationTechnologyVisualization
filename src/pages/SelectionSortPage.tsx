import SortPage from './SortPage'
import { selectionSortSteps, selectionSortCode } from '../algorithms/sort/selection'
import { getAlgorithm } from '../algorithms/registry'
import type { CompletionInfo } from './AlgorithmPage'

const COMPLETION: CompletionInfo = {
  complexity: '时间复杂度 O(n²)（无论数据如何，比较次数固定为 n(n-1)/2）；交换次数最多 n-1；空间 O(1)',
  keyPoints: [
    '每趟在未排序区选出最小值，与已排序区末尾交换，锁定一个位置',
    '关键变量 k 记录当前最小值的下标，内层循环结束后才交换',
    '不稳定排序：相同元素可能改变相对顺序',
  ],
  pitfalls: [
    '内层从 i+1 开始扫描，外层到 n-2（range(n-1)）',
    '先比较再更新 k，注意 k 与 j 是两个不同下标',
    '如果 arr[i] 本身就是最小，k 不变，可跳过交换',
  ],
}

export default function SelectionSortPage() {
  return (
    <SortPage
      meta={getAlgorithm('selection')!}
      code={selectionSortCode}
      completion={COMPLETION}
      generate={selectionSortSteps}
    />
  )
}
