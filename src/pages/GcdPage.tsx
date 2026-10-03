import { useMemo, useState } from 'react'
import AlgorithmPage, { type CompletionInfo } from './AlgorithmPage'
import GcdTable from '../components/visualizers/GcdTable'
import { gcdSteps, gcdCode, defaultGcdPair } from '../algorithms/recursion/gcd'
import { getAlgorithm } from '../algorithms/registry'
import type { GcdStep } from '../algorithms/types'
import styles from './BubbleSortPage.module.css'

const COMPLETION: CompletionInfo = {
  complexity: '时间复杂度 O(log(min(a, b)))；空间 O(1)（迭代版）',
  keyPoints: [
    '核心性质：gcd(a, b) = gcd(b, a mod b)，两数最大公约数在取余过程中保持不变',
    '当余数为 0 时，此时的除数就是最大公约数',
    '可用递归或迭代两种方式实现，本质相同',
  ],
  pitfalls: [
    '需要处理 0：gcd(a, 0) = a',
    '取余时注意 a 与 b 的先后顺序（大的做被除数）',
    '理解"除数变被除数、余数变除数"的迭代关系',
  ],
}

export default function GcdPage() {
  const meta = getAlgorithm('gcd')!
  const [pair, setPair] = useState<[number, number]>(defaultGcdPair())
  const [aInput, setAInput] = useState(String(pair[0]))
  const [bInput, setBInput] = useState(String(pair[1]))
  const steps = useMemo(() => gcdSteps(pair[0], pair[1]), [pair])

  const apply = () => {
    const a = Math.abs(Math.floor(Number(aInput) || 0))
    const b = Math.abs(Math.floor(Number(bInput) || 0))
    setPair([a, b])
  }

  return (
    <AlgorithmPage
      meta={meta}
      code={gcdCode}
      steps={steps}
      completion={COMPLETION}
      extraControls={
        <div className={styles.controls}>
          <label className={styles.label}>求 gcd(</label>
          <input
            className={`${styles.input} ${styles.narrow}`}
            value={aInput}
            onChange={(e) => setAInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') apply()
            }}
          />
          <label className={styles.label}>,</label>
          <input
            className={`${styles.input} ${styles.narrow}`}
            value={bInput}
            onChange={(e) => setBInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') apply()
            }}
          />
          <label className={styles.label}>)</label>
          <button className={styles.btn} onClick={apply}>
            计算
          </button>
        </div>
      }
      renderVisualizer={(step) => <GcdTable step={step as GcdStep | null} />}
    />
  )
}
