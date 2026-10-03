import type { GreedyStep } from '../../algorithms/types'
import styles from './GreedyView.module.css'

interface GreedyViewProps {
  step: GreedyStep | null
}

export default function GreedyView({ step }: GreedyViewProps) {
  const coins = step?.coins ?? []
  const used = step?.used ?? []
  const remaining = step?.remaining ?? 0
  const trying = step?.trying ?? null
  const optimal = step?.optimal ?? null
  const counterExample = step?.counterExample ?? false

  return (
    <div className={styles.wrap}>
      <div className={styles.balance}>
        <span className={styles.balanceLabel}>剩余待找金额</span>
        <span className={styles.balanceValue}>{remaining}</span>
        元
      </div>

      <div className={styles.coins}>
        {coins.map((c) => {
          const u = used.find((x) => x.coin === c)
          return (
            <div key={c} className={`${styles.coin} ${trying === c ? styles.coinTrying : ''}`}>
              <div className={styles.coinFace}>{c}</div>
              <div className={styles.coinCount}>用了 {u?.count ?? 0} 枚</div>
            </div>
          )
        })}
      </div>

      <div className={styles.resultLine}>
        <span className={styles.resultLabel}>贪心结果：</span>
        <span className={styles.resultText}>
          {used.length === 0 ? '（尚未使用任何硬币）' : used.map((u) => `${u.count}×${u.coin}`).join(' + ')}
        </span>
      </div>

      {optimal && (
        <div className={`${styles.resultLine} ${styles.optimal}`}>
          <span className={styles.resultLabel}>最优解：</span>
          <span className={styles.resultText}>{optimal.map((o) => `${o.count}×${o.coin}`).join(' + ')}</span>
        </div>
      )}

      {counterExample && remaining === 0 && optimal && (
        <div className={styles.warning}>
          反例演示：贪心用了 {used.reduce((s, u) => s + u.count, 0)} 枚，最优只需 {optimal.reduce((s, o) => s + o.count, 0)} 枚 —— 局部最优 ≠ 全局最优
        </div>
      )}
    </div>
  )
}
