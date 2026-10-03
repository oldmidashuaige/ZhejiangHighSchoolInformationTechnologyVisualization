import type { HashStep } from '../../algorithms/types'
import styles from './HashView.module.css'

interface HashViewProps {
  step: HashStep | null
}

export default function HashView({ step }: HashViewProps) {
  const buckets = step?.buckets ?? []
  const key = step?.key ?? null
  const index = step?.index ?? null
  const probe = step?.probe ?? null
  const op = step?.op ?? 'init'
  const size = buckets.length

  const isChaining = probe === null && buckets.some((b) => b.length > 1)

  return (
    <div className={styles.wrap}>
      <div className={styles.header}>
        <span>哈希函数 h(key) = key % {size}</span>
        {key !== null && <span className={styles.key}>当前键 key = {key}</span>}
      </div>

      {isChaining ? (
        <div className={styles.buckets}>
          {buckets.map((chain, i) => (
            <div key={i} className={`${styles.bucket} ${i === index ? styles.bucketActive : ''}`}>
              <div className={styles.bucketLabel}>桶 {i}</div>
              <div className={styles.chain}>
                {chain.length === 0 && <span className={styles.emptyBucket}>∅</span>}
                {chain.map((v, j) => (
                  <div key={j} className={`${styles.chainNode} ${v === key ? styles.chainKey : ''}`}>
                    {v}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className={styles.slots}>
          {buckets.flat().length === 0 && buckets.length === 0 ? null : null}
          {buckets.map((chain, i) => {
            // 线性探测模式：把单元素桶当作槽位
            const val = chain.length > 0 ? chain[0] : null
            const isProbe = probe !== null && probe.includes(i)
            const isIndex = i === index
            const isKey = val === key
            return (
              <div key={i} className={styles.slotCol}>
                <div
                  className={`${styles.slot} ${val !== null ? styles.slotFilled : ''} ${
                    isKey ? styles.slotKey : ''
                  } ${isProbe && !isKey ? styles.slotProbe : ''} ${isIndex && val === null ? styles.slotIndex : ''}`}
                >
                  {val ?? ''}
                </div>
                <div className={styles.slotIndex}>{i}</div>
              </div>
            )
          })}
        </div>
      )}

      <div className={styles.legend}>
        {op === 'init' && '开始演示'}
        {isChaining && (
          <>
            <span>拉链法：每个桶是一个链表，冲突元素挂在同一桶的链上</span>
            {key !== null && <span>h({key}) = {key} % {size} = {index}</span>}
          </>
        )}
        {!isChaining && probe !== null && probe.length > 0 && (
          <span>线性探测路径：{probe.join(' → ')}</span>
        )}
      </div>
    </div>
  )
}
