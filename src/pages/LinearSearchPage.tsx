import SearchPage from './SearchPage'
import { linearSearchSteps, linearSearchCode } from '../algorithms/search/linear'
import { getAlgorithm } from '../algorithms/registry'
import type { CompletionInfo } from './AlgorithmPage'

const COMPLETION: CompletionInfo = {
  complexity: '时间复杂度 O(n)（最坏需比较 n 次）；空间 O(1)',
  keyPoints: [
    '从下标 0 开始逐个与目标比较，命中即返回下标',
    '对数据是否有序没有要求',
    '查找次数 = 目标所在位置 + 1（最坏 n 次）',
  ],
  pitfalls: [
    '遍历完都没有命中要返回 -1，不能返回下标 0',
    '用 while 实现时注意循环条件与下标自增',
    '顺序查找效率低，数据量大时应考虑有序前提下的二分查找',
  ],
}

export default function LinearSearchPage() {
  return (
    <SearchPage
      meta={getAlgorithm('linear')!}
      code={linearSearchCode}
      completion={COMPLETION}
      generate={linearSearchSteps}
    />
  )
}
