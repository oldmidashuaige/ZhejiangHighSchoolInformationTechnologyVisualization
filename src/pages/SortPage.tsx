import { useMemo, useState } from 'react'
import AlgorithmPage, { type CompletionInfo } from './AlgorithmPage'
import BarChart from '../components/visualizers/BarChart'
import { randomArray } from '../algorithms/sort/bubble'
import type { AlgoMeta } from '../algorithms/registry'
import type { SortStep } from '../algorithms/types'
import styles from './BubbleSortPage.module.css'

interface SortPageProps {
  meta: AlgoMeta
  code: string
  completion: CompletionInfo
  generate: (data: number[]) => SortStep[]
}

export default function SortPage({ meta, code, completion, generate }: SortPageProps) {
  const [data, setData] = useState<number[]>(() => randomArray(8, 20))
  const [input, setInput] = useState('')

  const steps = useMemo<SortStep[]>(() => generate(data), [generate, data])

  const handleRandom = () => setData(randomArray(8, 20))

  const handleApply = () => {
    const nums = input
      .split(/[,，\s]+/)
      .map((s) => s.trim())
      .filter((s) => s !== '')
      .map((s) => Number(s))
      .filter((n) => Number.isInteger(n))
    if (nums.length >= 2) setData(nums)
  }

  return (
    <AlgorithmPage
      meta={meta}
      code={code}
      steps={steps}
      completion={completion}
      extraControls={
        <div className={styles.controls}>
          <label className={styles.label}>演示数据</label>
          <input
            className={styles.input}
            value={input}
            placeholder="例如 9, 3, 7, 1, 5（至少 2 个整数）"
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleApply()
            }}
          />
          <button className={styles.btn} onClick={handleApply}>
            应用
          </button>
          <button className={styles.btn} onClick={handleRandom}>
            随机生成
          </button>
        </div>
      }
      renderVisualizer={(step) => <BarChart data={data} step={step as SortStep | null} />}
    />
  )
}
