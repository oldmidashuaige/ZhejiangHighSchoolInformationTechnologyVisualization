import type { RecursionStep } from '../../algorithms/types'
import TreeView from './TreeView'
import StackView from './StackView'
import styles from './RecursionVisual.module.css'

interface RecursionVisualProps {
  step: RecursionStep | null
  /** 初始值（用于空步骤时展示根节点） */
  tree?: { nodes: { id: string; parentId?: string | null; label: string; sub?: string }[] } | null
}

export default function RecursionVisual({ step, tree }: RecursionVisualProps) {
  const nodes = step?.nodes ?? tree?.nodes ?? []
  const activeIds = step?.activeIds ?? []
  const doneIds = step?.doneIds ?? []
  const stack = step?.stack ?? []

  return (
    <div className={styles.row}>
      <div className={styles.tree}>
        <TreeView nodes={nodes} activeIds={activeIds} doneIds={doneIds} />
      </div>
      <div className={styles.stack}>
        <StackView frames={stack} />
      </div>
    </div>
  )
}
