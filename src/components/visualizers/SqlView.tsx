import type { SqlStep } from '../../algorithms/types'
import styles from './SqlView.module.css'

interface SqlViewProps {
  step: SqlStep | null
}

export default function SqlView({ step }: SqlViewProps) {
  const columns = step?.columns ?? []
  const rows = step?.rows ?? []
  const selected = step?.selectedCols ?? []
  const filtered = step?.filtered ?? []
  const checking = step?.checking ?? null
  const order = step?.order ?? null
  const result = step?.result ?? null

  return (
    <div className={styles.wrap}>
      <div className={styles.sql}>
        <code>
          <span className={styles.kw}>SELECT</span> 姓名, 数学 <span className={styles.kw}>FROM</span> 成绩表{' '}
          <span className={styles.kw}>WHERE</span> 班级='高一(1)' <span className={styles.kw}>AND</span> 数学&gt;=90{' '}
          <span className={styles.kw}>ORDER BY</span> 数学 DESC
        </code>
      </div>

      <div className={styles.tableWrap}>
        <table className={styles.table}>
          <thead>
            <tr>
              {columns.map((c, i) => (
                <th key={c} className={selected.includes(i) ? styles.thSelected : ''}>
                  {c}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row, ri) => {
              const isFiltered = filtered.includes(ri)
              const isChecking = checking === ri
              return (
                <tr
                  key={ri}
                  className={`${isFiltered ? styles.trMatched : ''} ${isChecking ? styles.trChecking : ''}`}
                >
                  {row.map((cell, ci) => (
                    <td key={ci} className={selected.includes(ci) ? styles.tdSelected : ''}>
                      {cell}
                    </td>
                  ))}
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>

      {order && (
        <div className={styles.orderNote}>排序结果（数学降序）：{order.map((i) => rows[i][1]).join(' → ')}</div>
      )}

      {result && (
        <div className={styles.resultBox}>
          <div className={styles.resultTitle}>查询结果（{result.length} 行）</div>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>姓名</th>
                <th>数学</th>
              </tr>
            </thead>
            <tbody>
              {result.map((r, i) => (
                <tr key={i}>
                  <td>{r[0]}</td>
                  <td className={styles.score}>{r[1]}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
