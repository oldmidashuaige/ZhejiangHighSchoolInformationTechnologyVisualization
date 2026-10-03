import styles from './StackView.module.css'

interface Frame {
  /** 帧内容，如 "n = 4" 或 "返回地址" */
  label: string
  phase: 'down' | 'up'
}

interface StackViewProps {
  /** 自底向上的调用栈 */
  frames: readonly Frame[]
  /** 栈容量下限 */
  capacity?: number
}

export default function StackView({ frames, capacity = 6 }: StackViewProps) {
  const cap = Math.max(frames.length, capacity)
  const slots: (Frame | null)[] = []
  for (let i = 0; i < cap; i++) slots.push(frames[i] ?? null)

  return (
    <div className={styles.wrap}>
      <div className={styles.title}>调用栈（递归栈）</div>
      <div className={styles.arrow}>栈顶 ↑</div>
      <div className={styles.stack}>
        {slots.map((f, i) => (
          <div key={i} className={`${styles.cell} ${f ? styles.cellFilled : ''} ${f?.phase === 'up' ? styles.cellUp : ''}`}>
            {f ? f.label : ''}
          </div>
        ))}
      </div>
      <div className={styles.bottom}>栈底</div>
    </div>
  )
}
