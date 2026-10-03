import { useMemo, useState } from 'react'
import AlgorithmPage, { type CompletionInfo } from './AlgorithmPage'
import SearchChart from '../components/visualizers/SearchChart'
import { DEFAULT_SEARCH_DATA } from '../algorithms/search/linear'
import type { AlgoMeta } from '../algorithms/registry'
import type { SearchStep } from '../algorithms/types'
import styles from './BubbleSortPage.module.css'

interface SearchPageProps {
  meta: AlgoMeta
  code: string
  completion: CompletionInfo
  generate: (data: number[], target: number) => SearchStep[]
}

export default function SearchPage({ meta, code, completion, generate }: SearchPageProps) {
  const [data, setData] = useState<number[]>(DEFAULT_SEARCH_DATA)
  const [target, setTarget] = useState(17)
  const [input, setInput] = useState('')
  const [targetInput, setTargetInput] = useState('17')

  const steps = useMemo<SearchStep[]>(() => generate(data, target), [generate, data, target])

  const handleApply = () => {
    const nums = input
      .split(/[,，\s]+/)
      .map((s) => s.trim())
      .filter((s) => s !== '')
      .map((s) => Number(s))
      .filter((n) => Number.isInteger(n))
    const t = Number(targetInput)
    if (nums.length >= 2) setData(nums)
    if (Number.isInteger(t)) setTarget(t)
  }

  return (
    <AlgorithmPage
      meta={meta}
      code={code}
      steps={steps}
      completion={completion}
      extraControls={
        <div className={styles.controls}>
          <label className={styles.label}>数组</label>
          <input
            className={styles.input}
            value={input}
            placeholder="升序整数，如 2, 5, 8, 12, 17, 21"
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleApply()
            }}
          />
          <label className={styles.label}>目标值</label>
          <input
            className={`${styles.input} ${styles.narrow}`}
            value={targetInput}
            onChange={(e) => setTargetInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleApply()
            }}
          />
          <button className={styles.btn} onClick={handleApply}>
            应用
          </button>
        </div>
      }
      renderVisualizer={(step) => <SearchChart data={data} step={step as SearchStep | null} />}
    />
  )
}
