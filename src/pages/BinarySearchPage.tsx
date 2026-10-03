import SearchPage from './SearchPage'
import { binarySearchSteps, binarySearchCode } from '../algorithms/search/binary'
import { getAlgorithm } from '../algorithms/registry'
import type { CompletionInfo } from './AlgorithmPage'

const COMPLETION: CompletionInfo = {
  complexity: '时间复杂度 O(log₂n)；空间 O(1)',
  keyPoints: [
    '前提：数组必须有序（升序）',
    '每次把搜索区间一分为二，比较中间元素后丢弃一半',
    'n 个元素最多比较 ⌈log₂(n+1)⌉ 次',
  ],
  pitfalls: [
    'while 条件是 left <= right，漏掉 = 会漏查单个元素',
    'mid = (left + right) // 2，防止 (left+right) 溢出的写法是 left + (right-left)//2',
    '更新边界是 mid ± 1（mid 已被比较过，可排除）',
    '查找失败的条件：left > right 时区间为空',
  ],
}

export default function BinarySearchPage() {
  return (
    <SearchPage
      meta={getAlgorithm('binary')!}
      code={binarySearchCode}
      completion={COMPLETION}
      generate={binarySearchSteps}
    />
  )
}
