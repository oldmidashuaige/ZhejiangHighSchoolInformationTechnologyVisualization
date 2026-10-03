import SortPage from './SortPage'
import { bubbleSortSteps, bubbleSortCode } from '../algorithms/sort/bubble'
import { getAlgorithm } from '../algorithms/registry'
import type { CompletionInfo } from './AlgorithmPage'

const COMPLETION: CompletionInfo = {
  complexity: '时间复杂度 O(n²)（最坏/平均），最好 O(n)；空间复杂度 O(1)',
  keyPoints: [
    '外层循环 n-1 趟，内层每趟比较次数递减（n-1-i）',
    '每趟把当前最大值"冒泡"到末尾，末尾元素依次锁定',
    '比较次数固定为 n(n-1)/2，与数据是否有序无关',
  ],
  pitfalls: [
    '内层循环范围必须是 range(n-1-i)，否则会越界或重复比较',
    '交换条件 arr[j] > arr[j+1] 决定升序还是降序',
    '优化版：若某一趟没有任何交换，说明已经有序，可提前结束（flag 标记）',
  ],
}

export default function BubbleSortPage() {
  return (
    <SortPage meta={getAlgorithm('bubble')!} code={bubbleSortCode} completion={COMPLETION} generate={bubbleSortSteps} />
  )
}
