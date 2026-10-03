import styles from './ExplainPanel.module.css'

interface CompletionInfo {
  complexity: string
  keyPoints: string[]
  pitfalls: string[]
}

interface ExplainPanelProps {
  /** 当前步骤讲解文字 */
  desc: string
  /** 是否完成 */
  done: boolean
  completion?: CompletionInfo
}

export default function ExplainPanel({ desc, done, completion }: ExplainPanelProps) {
  return (
    <div className={styles.wrap}>
      <div className={styles.current}>
        <div className={styles.currentLabel}>{done ? '完成' : '当前步骤'}</div>
        <p className={styles.currentText}>{desc}</p>
      </div>

      {done && completion && (
        <div className={styles.completion}>
          <div className={styles.block}>
            <div className={styles.blockTitle}>复杂度</div>
            <div className={styles.complexity}>{completion.complexity}</div>
          </div>
          {completion.keyPoints.length > 0 && (
            <div className={styles.block}>
              <div className={styles.blockTitle}>考点</div>
              <ul className={styles.list}>
                {completion.keyPoints.map((k, i) => (
                  <li key={i}>{k}</li>
                ))}
              </ul>
            </div>
          )}
          {completion.pitfalls.length > 0 && (
            <div className={styles.block}>
              <div className={styles.blockTitle}>易错点</div>
              <ul className={styles.list}>
                {completion.pitfalls.map((p, i) => (
                  <li key={i}>{p}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
