import { useMemo, useState } from 'react'
import AlgorithmPage, { type CompletionInfo } from './AlgorithmPage'
import StackView from '../components/visualizers/StackView'
import { stackSteps, bracketSteps, stackCode } from '../algorithms/datastructure/stack'
import { getAlgorithm } from '../algorithms/registry'
import type { StackStep } from '../algorithms/types'
import styles from './BubbleSortPage.module.css'

const COMPLETION: CompletionInfo = {
  complexity: 'push/pop 时间复杂度 O(1)；空间 O(n)',
  keyPoints: [
    '栈是后进先出（LIFO）的结构，只在栈顶操作',
    '经典应用：括号匹配、函数递归调用（递归栈）、表达式求值、撤销操作',
    '括号匹配：遇左括号压栈，遇右括号与栈顶配对后弹出',
  ],
  pitfalls: [
    'pop 前要先判断栈是否为空，否则下溢',
    '括号匹配中，右括号要和栈顶对应（如 } 只匹配 {）',
    '表达式求值中，运算符的优先级处理是常见考点',
  ],
}

export default function StackPage() {
  const meta = getAlgorithm('stack')!
  const [mode, setMode] = useState<'stack' | 'bracket'>('stack')
  const [bstr, setBstr] = useState('(()[()]{})')
  const steps = useMemo(() => (mode === 'stack' ? stackSteps() : bracketSteps(bstr)), [mode, bstr])

  return (
    <AlgorithmPage
      meta={meta}
      code={stackCode}
      steps={steps}
      completion={COMPLETION}
      extraControls={
        <div className={styles.controls}>
          <span className={styles.label}>演示模式</span>
          <button className={`${styles.btn} ${mode === 'stack' ? styles.btnActive : ''}`} onClick={() => setMode('stack')}>
            数值栈
          </button>
          <button className={`${styles.btn} ${mode === 'bracket' ? styles.btnActive : ''}`} onClick={() => setMode('bracket')}>
            括号匹配
          </button>
          {mode === 'bracket' && (
            <>
              <label className={styles.label}>括号串</label>
              <input
                className={styles.input}
                value={bstr}
                onChange={(e) => setBstr(e.target.value)}
                placeholder="如 (()[])"
              />
            </>
          )}
        </div>
      }
      renderVisualizer={(step) => {
        const s = step as StackStep | null
        const frames = (s?.arr ?? []).map((v) => ({ label: String(v), phase: 'down' as const }))
        return <StackView frames={frames} capacity={Math.max((s?.arr.length ?? 0) + 1, 7)} />
      }}
    />
  )
}
