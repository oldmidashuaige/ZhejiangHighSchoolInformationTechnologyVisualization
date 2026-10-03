import { useMemo, useState } from 'react'
import AlgorithmPage, { type CompletionInfo } from './AlgorithmPage'
import RadixView from '../components/visualizers/RadixView'
import { radixSteps, radixCode, BASE_LABELS } from '../algorithms/others/radix'
import { getAlgorithm } from '../algorithms/registry'
import type { RadixStep } from '../algorithms/types'
import styles from './BubbleSortPage.module.css'

const COMPLETION: CompletionInfo = {
  complexity: '按权展开 / 短除法时间复杂度 O(位数)；转换总位数 O(log₂N)',
  keyPoints: [
    '任意进制互转都以十进制为桥梁：源进制→十进制（按权展开），十进制→目标进制（短除法）',
    '按权展开：第 i 位（从右往左从 0 起）权值 = 基数^i，各位求和',
    '短除法：不断除以目标进制取余数，余数从下往上读',
    '十六进制用 A~F 表示 10~15',
  ],
  pitfalls: [
    '按权展开时位权序号从最右边第 0 位开始，别数错',
    '短除法余数要从下往上读，别读反',
    '转十进制时不要漏掉最低位（基数^0 = 1）的权值',
    '数码必须小于源进制（二进制只能用 0/1）',
  ],
}

const BASES = [2, 8, 10, 16]

export default function RadixPage() {
  const meta = getAlgorithm('radix')!
  const [input, setInput] = useState('27')
  const [src, setSrc] = useState(10)
  const [tgt, setTgt] = useState(2)
  const steps = useMemo(() => radixSteps(input, src, tgt), [input, src, tgt])

  return (
    <AlgorithmPage
      meta={meta}
      code={radixCode}
      steps={steps}
      completion={COMPLETION}
      extraControls={
        <div className={styles.controls}>
          <label className={styles.label}>数值</label>
          <input className={styles.input} value={input} onChange={(e) => setInput(e.target.value)} placeholder="如 1011 / 27 / 1A" />
          <span className={styles.label}>从</span>
          {BASES.map((b) => (
            <button key={b} className={`${styles.btn} ${src === b ? styles.btnActive : ''}`} onClick={() => setSrc(b)}>
              {BASE_LABELS[b]}
            </button>
          ))}
          <span className={styles.label}>转到</span>
          {BASES.map((b) => (
            <button key={b} className={`${styles.btn} ${tgt === b ? styles.btnActive : ''}`} onClick={() => setTgt(b)}>
              {BASE_LABELS[b]}
            </button>
          ))}
        </div>
      }
      renderVisualizer={(step) => <RadixView step={step as RadixStep | null} />}
    />
  )
}
