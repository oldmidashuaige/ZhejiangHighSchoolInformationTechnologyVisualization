import type { ListStep } from '../../algorithms/types'
import styles from './ListView.module.css'

interface ListViewProps {
  step: ListStep | null
}

export default function ListView({ step }: ListViewProps) {
  const nodes = step?.nodes ?? []
  const head = step?.head ?? null
  const pointer = step?.pointer ?? null
  const highlight = step?.highlight ?? null
  const removedVal = step?.removedVal ?? null

  return (
    <div className={styles.wrap}>
      <div className={styles.headRow}>
        <span className={styles.headLabel}>head</span>
        {head !== null && <span className={styles.arrow}>→</span>}
      </div>
      <div className={styles.list}>
        {nodes.map((n) => {
          const isPointer = pointer === n.id
          const isHighlight =
            highlight !== null &&
            (highlight.target === n.id ||
              (highlight.type === 'insert' && highlight.target === n.id) ||
              (highlight.type === 'delete' && highlight.target === n.id))
          const isRemoved = removedVal !== null && n.val === removedVal
          return (
            <div key={n.id} className={styles.nodeGroup}>
              <div
                className={`${styles.node} ${isPointer ? styles.nodePointer : ''} ${
                  isHighlight ? styles.nodeHighlight : ''
                } ${isRemoved ? styles.nodeRemoved : ''}`}
              >
                <span className={styles.nodeVal}>{n.val}</span>
                <span className={styles.nextMark}>●→</span>
              </div>
              {n.next !== null ? (
                <span className={styles.arrow}>→</span>
              ) : (
                <span className={styles.nullMark}>NULL</span>
              )}
              {isPointer && (
                <div className={styles.pLabelWrap}>
                  <span className={styles.pLabel}>p</span>
                </div>
              )}
            </div>
          )
        })}
      </div>
      {removedVal !== null && (
        <div className={styles.removedNote}>已删除节点：{removedVal}（前驱 next 直接指向其后继）</div>
      )}
    </div>
  )
}
