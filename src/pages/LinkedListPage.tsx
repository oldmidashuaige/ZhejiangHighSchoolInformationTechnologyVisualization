import { useMemo } from 'react'
import AlgorithmPage, { type CompletionInfo } from './AlgorithmPage'
import ListView from '../components/visualizers/ListView'
import { listSteps, listCode } from '../algorithms/datastructure/linkedlist'
import { getAlgorithm } from '../algorithms/registry'
import type { ListStep } from '../algorithms/types'

const COMPLETION: CompletionInfo = {
  complexity: '插入/删除时间复杂度 O(1)（已知位置时）；随机访问 O(n)；空间 O(n)',
  keyPoints: [
    '链表节点 = 数据域 + 指针域，通过指针串联',
    '插入只需改两个指针（新节点 next、前驱 next），不需要移动元素',
    '删除只需让前驱的 next 跳过被删节点',
  ],
  pitfalls: [
    '插入/删除前必须先找到前驱节点（需遍历，O(n)）',
    '改指针顺序：先让新节点指向后继，再让前驱指向新节点，顺序反了会丢链',
    '注意头指针 head 的变化（删除头节点时 head 要后移）',
    '遍历终止条件：p 指向 NULL',
  ],
}

export default function LinkedListPage() {
  const meta = getAlgorithm('linkedlist')!
  const steps = useMemo(() => listSteps(), [])

  return (
    <AlgorithmPage
      meta={meta}
      code={listCode}
      steps={steps}
      completion={COMPLETION}
      renderVisualizer={(step) => <ListView step={step as ListStep | null} />}
    />
  )
}
