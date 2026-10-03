import type { CaesarStep } from '../../algorithms/types'
import styles from './CaesarView.module.css'

interface CaesarViewProps {
  step: CaesarStep | null
}

export default function CaesarView({ step }: CaesarViewProps) {
  const plain = step?.plain ?? ''
  const cipher = step?.cipher ?? ''
  const index = step?.index ?? -1
  const shift = step?.shift ?? 0

  const chars = plain.split('')

  return (
    <div className={styles.wrap}>
      <div className={styles.head}>
        <span>明文 → 密文</span>
        <span className={styles.shift}>平移量 shift = {shift}</span>
      </div>
      <div className={styles.rows}>
        <div className={styles.labelRow}>
          <span className={styles.rowLabel}>明文</span>
        </div>
        <div className={styles.chars}>
          {chars.map((ch, i) => (
            <div key={i} className={`${styles.charCell} ${i === index ? styles.charActive : ''}`}>
              {ch}
            </div>
          ))}
        </div>
        <div className={styles.labelRow}>
          <span className={styles.rowLabel}>密文</span>
        </div>
        <div className={styles.chars}>
          {chars.map((ch, i) => {
            const isLetter = /[a-zA-Z]/.test(ch)
            let c = ch
            if (isLetter && i <= index) {
              const code = ch.charCodeAt(0)
              const base = ch >= 'a' && ch <= 'z' ? 97 : 65
              c = String.fromCharCode(base + ((code - base + shift) % 26))
            }
            return (
              <div key={i} className={`${styles.charCell} ${i === index ? styles.charActive : ''}`}>
                {c}
              </div>
            )
          })}
        </div>
      </div>
      <div className={styles.foot}>
        <div>
          当前密文：<span className={styles.cipherText}>{cipher || '（尚未加密）'}</span>
        </div>
      </div>
    </div>
  )
}
