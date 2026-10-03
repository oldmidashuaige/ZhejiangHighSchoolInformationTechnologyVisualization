import { useMemo, useState } from 'react'
import AlgorithmPage, { type CompletionInfo } from './AlgorithmPage'
import TreeView from '../components/visualizers/TreeView'
import { btreeSteps, traversalSummary, btreeCode, type TraversalType } from '../algorithms/datastructure/btree'
import { getAlgorithm } from '../algorithms/registry'
import type { BTreeStep } from '../algorithms/types'
import styles from './BubbleSortPage.module.css'

const COMPLETION: CompletionInfo = {
  complexity: '四种遍历时间复杂度均为 O(n)（每个节点访问一次）；空间 O(树高)（递归栈）',
  keyPoints: [
    '前序（根左右）/ 中序（左根右）/ 后序（左右根）都基于递归：左子树、右子树、根 的三种排列',
    '中序遍历二叉搜索树（左小右大）得到有序序列',
    '层序用队列实现，其余三种用递归（栈）实现',
    '数组存完全二叉树：左孩子 2i+1、右孩子 2i+2、父节点 (i-1)/2',
  ],
  pitfalls: [
    '中序遍历先左后根再右，顺序写错是丢分点',
    '前序+中序（或后序+中序）可以唯一确定一棵二叉树，但前序+后序不行',
    '递归终止条件：节点为空时返回',
  ],
}

const TYPES: { key: TraversalType; label: string }[] = [
  { key: 'pre', label: '前序' },
  { key: 'in', label: '中序' },
  { key: 'post', label: '后序' },
  { key: 'level', label: '层序' },
]

export default function BTreePage() {
  const meta = getAlgorithm('btree')!
  const [type, setType] = useState<TraversalType>('pre')
  const steps = useMemo(() => btreeSteps(type), [type])

  return (
    <AlgorithmPage
      meta={meta}
      code={btreeCode}
      steps={steps}
      completion={COMPLETION}
      extraControls={
        <div className={styles.controls}>
          <span className={styles.label}>遍历方式</span>
          {TYPES.map((t) => (
            <button key={t.key} className={`${styles.btn} ${type === t.key ? styles.btnActive : ''}`} onClick={() => setType(t.key)}>
              {t.label}
            </button>
          ))}
        </div>
      }
      renderVisualizer={(step) => {
        const s = step as BTreeStep | null
        const visited = s?.visited ?? []
        const current = s?.current ?? null
        const orderLabel = new Map<string, number>()
        visited.forEach((id, idx) => orderLabel.set(id, idx + 1))
        return (
          <TreeView
            nodes={s?.nodes ?? []}
            activeIds={current ? [current] : []}
            doneIds={visited}
            orderLabel={orderLabel}
            height={340}
          />
        )
      }}
    />
  )
}

// 导出汇总供讲解用（避免未使用告警）
export { traversalSummary }
