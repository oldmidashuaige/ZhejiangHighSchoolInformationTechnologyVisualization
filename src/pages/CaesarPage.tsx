import { useMemo, useState } from 'react'
import AlgorithmPage, { type CompletionInfo } from './AlgorithmPage'
import CaesarView from '../components/visualizers/CaesarView'
import { caesarSteps, caesarCode } from '../algorithms/others/caesar'
import { getAlgorithm } from '../algorithms/registry'
import type { CaesarStep } from '../algorithms/types'
import styles from './BubbleSortPage.module.css'

const COMPLETION: CompletionInfo = {
  complexity: '时间复杂度 O(n)（n 为字符串长度）',
  keyPoints: [
    '凯撒密码：把字母在字母表中向后（或向前）平移固定位数，取模 26 回绕',
    '加密用 +shift，解密用 -shift（等价于 +26-shift）',
    'ord() 取字符 ASCII 码，chr() 由码转字符；大小写要分开处理',
  ],
  pitfalls: [
    '平移后要取模 26，否则会超出字母范围',
    '大小写字母的 ASCII 基准不同（A=65, a=97）',
    '解密时取模要处理负数：((ord(ch)-base - shift) % 26 + 26) % 26',
    '非字母字符（空格、标点）保持不变',
  ],
}

export default function CaesarPage() {
  const meta = getAlgorithm('caesar')!
  const [text, setText] = useState('HelloWorld')
  const [shift, setShift] = useState(3)
  const steps = useMemo(() => caesarSteps(text, shift), [text, shift])

  return (
    <AlgorithmPage
      meta={meta}
      code={caesarCode}
      steps={steps}
      completion={COMPLETION}
      extraControls={
        <div className={styles.controls}>
          <label className={styles.label}>明文</label>
          <input className={styles.input} value={text} onChange={(e) => setText(e.target.value)} />
          <label className={styles.label}>平移量</label>
          <input
            className={`${styles.input} ${styles.narrow}`}
            type="number"
            min={0}
            max={25}
            value={shift}
            onChange={(e) => setShift(((Math.floor(Number(e.target.value) || 0) % 26) + 26) % 26)}
          />
        </div>
      }
      renderVisualizer={(step) => <CaesarView step={step as CaesarStep | null} />}
    />
  )
}
