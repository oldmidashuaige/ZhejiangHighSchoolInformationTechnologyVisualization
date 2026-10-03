import SortPage from './SortPage'
import { insertionSortSteps, insertionSortCode } from '../algorithms/sort/insertion'
import { getAlgorithm } from '../algorithms/registry'
import type { CompletionInfo } from './AlgorithmPage'

const COMPLETION: CompletionInfo = {
  complexity: '时间复杂度 O(n²)（最坏/平均），最好 O(n)（已有序时）；空间 O(1)',
  keyPoints: [
    '把当前元素 key 插入到左侧已排序区的正确位置',
    '比 key 大的元素依次右移，腾出位置后再插入',
    '稳定排序；对近乎有序的数据效率高（适合作为高级排序的底子）',
  ],
  pitfalls: [
    '外层从 i=1 开始，arr[0] 视为初始已排序区',
    'while 条件 j>=0 不能丢，否则越界',
    '先右移再插入：插入位置是 j+1，不是 j',
  ],
}

export default function InsertionSortPage() {
  return (
    <SortPage
      meta={getAlgorithm('insertion')!}
      code={insertionSortCode}
      completion={COMPLETION}
      generate={insertionSortSteps}
    />
  )
}
