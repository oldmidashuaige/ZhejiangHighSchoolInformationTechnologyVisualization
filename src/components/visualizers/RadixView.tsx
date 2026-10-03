import type { RadixStep } from '../../algorithms/types'
import { BASE_LABELS } from '../../algorithms/others/radix'
import styles from './RadixView.module.css'

interface RadixViewProps {
  step: RadixStep | null
}

const DIGITS = '0123456789ABCDEF'

export default function RadixView({ step }: RadixViewProps) {
  if (!step) return <div className={styles.wrap} />
  const { input, sourceBase: sb, targetBase: tb, decimal, expandRows, expandCurrent, divRows, divCurrent, result, phase, valid } = step

  return (
    <div className={styles.wrap}>
      <div className={styles.head}>
        <span className={styles.headLabel}>
          ({input})
          <sub>{sb}</sub> <span className={styles.arrow}>→</span> ({result || '?'})
          <sub>{tb}</sub>
        </span>
        <span className={styles.result}>
          转换结果：<strong>({result}){tb}</strong>
        </span>
      </div>

      {!valid && <div className={styles.error}>输入不是合法的 {sb} 进制数，请修改输入</div>}

      {valid && expandRows.length > 0 && (
        <section>
          <div className={styles.sectionTitle}>
            ① {BASE_LABELS[sb]} → 十进制（按权展开）
            {phase !== 'expand' && <span className={styles.done}> ✓ {decimal}</span>}
          </div>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>位权序号</th>
                <th>数码</th>
                <th>× 基数^位权</th>
                <th>该项值</th>
              </tr>
            </thead>
            <tbody>
              {expandRows.map((r, i) => (
                <tr key={i} className={i === expandCurrent && phase === 'expand' ? styles.rowCurrent : ''}>
                  <td className={styles.mono}>{r.pos}</td>
                  <td className={styles.mono}>{DIGITS[r.digit]}</td>
                  <td className={styles.mono}>
                    {sb}^{r.pos} = {r.power}
                  </td>
                  <td className={`${styles.mono} ${styles.r}`}>{r.term}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className={styles.note}>按权展开求和：{expandRows.map((r) => `${DIGITS[r.digit]}×${sb}^${r.pos}`).join(' + ')} = {decimal}</div>
        </section>
      )}

      {valid && divRows.length > 0 && (
        <section>
          <div className={styles.sectionTitle}>
            ② 十进制 {decimal} → {BASE_LABELS[tb]}（短除法）
            {phase !== 'divide' && <span className={styles.done}> ✓ {result}</span>}
          </div>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>被除数</th>
                <th>÷ {tb}</th>
                <th>商</th>
                <th>余数</th>
              </tr>
            </thead>
            <tbody>
              {divRows.map((row, i) => {
                const dividend = i === 0 ? decimal : divRows[i - 1].q
                return (
                  <tr key={i} className={i === divCurrent && phase === 'divide' ? styles.rowCurrent : ''}>
                    <td className={styles.mono}>{dividend}</td>
                    <td className={styles.mono}>÷ {tb}</td>
                    <td className={styles.mono}>{row.q}</td>
                    <td className={`${styles.mono} ${styles.r}`}>
                      {DIGITS[row.r]}（{row.r}）
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
          <div className={styles.note}>余数从下往上收集：{divRows.map((r) => DIGITS[r.r]).reverse().join('')} → 结果 {result}</div>
        </section>
      )}

      {valid && sb === 10 && tb === 10 && (
        <div className={styles.note}>源进制与目标进制都是十进制，结果即原数 {input}</div>
      )}
    </div>
  )
}
