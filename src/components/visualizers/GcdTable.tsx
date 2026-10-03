import type { GcdStep } from '../../algorithms/types'
import styles from './GcdTable.module.css'

interface GcdTableProps {
  step: GcdStep | null
}

export default function GcdTable({ step }: GcdTableProps) {
  const rows = step?.rows ?? []
  const currentRow = step?.currentRow ?? -1

  return (
    <div className={styles.wrap}>
      {step && (
        <div className={styles.current}>
          <span className={styles.currentLabel}>当前：gcd({step.a}, {step.b})</span>
          {step.r >= 0 && <span className={styles.currentR}>余数 r = {step.r}</span>}
        </div>
      )}
      <table className={styles.table}>
        <thead>
          <tr>
            <th>a</th>
            <th>b</th>
            <th>a ÷ b 的商</th>
            <th>a mod b（余数 r）</th>
          </tr>
        </thead>
        <tbody>
          {rows.length === 0 && (
            <tr>
              <td colSpan={4} className={styles.empty}>
                输入两个整数，开始演示辗转相除法
              </td>
            </tr>
          )}
          {rows.map((row, i) => (
            <tr key={i} className={i === currentRow ? styles.rowCurrent : ''}>
              <td className={styles.mono}>{row.a}</td>
              <td className={styles.mono}>{row.b}</td>
              <td className={styles.mono}>{Math.floor(row.a / row.b)}</td>
              <td className={`${styles.mono} ${styles.r}`}>{row.r}</td>
            </tr>
          ))}
        </tbody>
      </table>
      {rows.length > 0 && (
        <div className={styles.legend}>
          规则：gcd(a, b) = gcd(b, a mod b)，当余数为 0 时，除数 b 即最大公约数
        </div>
      )}
    </div>
  )
}
