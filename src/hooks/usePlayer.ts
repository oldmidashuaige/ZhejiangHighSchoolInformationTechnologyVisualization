import { useCallback, useEffect, useRef, useState } from 'react'
import type { AlgoStep } from '../algorithms/types'

export type Speed = 0.25 | 0.5 | 1 | 2 | 4

export interface PlayerApi {
  /** 当前步索引；-1 表示初始状态（第 0 步之前） */
  index: number
  playing: boolean
  speed: Speed
  total: number
  /** 当前步骤（index < 0 时为 null） */
  step: AlgoStep | null
  setSpeed: (s: Speed) => void
  next: () => void
  prev: () => void
  reset: () => void
  toggle: () => void
  seek: (i: number) => void
}

/**
 * 通用播放器：消费"步骤序列"，支持上一步/下一步/播放/暂停/重置/跳转/变速。
 * 播放采用 setInterval，speed 决定每步间隔。
 */
export function usePlayer(steps: AlgoStep[]): PlayerApi {
  const [index, setIndex] = useState(-1)
  const [playing, setPlaying] = useState(false)
  const [speed, setSpeed] = useState<Speed>(1)
  const timerRef = useRef<number | null>(null)
  const total = steps.length

  // 步骤序列变化（如换了一组数据）时重置播放状态
  useEffect(() => {
    setIndex(-1)
    setPlaying(false)
  }, [steps])

  useEffect(() => {
    if (!playing) return
    timerRef.current = window.setInterval(() => {
      setIndex((i) => {
        if (i >= total - 1) {
          setPlaying(false)
          return i
        }
        return i + 1
      })
    }, Math.round(1000 / speed))
    return () => {
      if (timerRef.current !== null) window.clearInterval(timerRef.current)
    }
  }, [playing, speed, total])

  const stop = useCallback(() => setPlaying(false), [])

  const next = useCallback(() => {
    stop()
    setIndex((i) => Math.min(i + 1, total - 1))
  }, [stop, total])

  const prev = useCallback(() => {
    stop()
    setIndex((i) => Math.max(i - 1, -1))
  }, [stop])

  const reset = useCallback(() => {
    stop()
    setIndex(-1)
  }, [stop])

  const toggle = useCallback(() => {
    setIndex((i) => {
      if (i >= total - 1) return -1
      return i
    })
    setPlaying((p) => !p)
  }, [total])

  const seek = useCallback((i: number) => {
    stop()
    setIndex(Math.max(-1, Math.min(i, total - 1)))
  }, [stop, total])

  return {
    index,
    playing,
    speed,
    total,
    step: index >= 0 ? steps[index] : null,
    setSpeed,
    next,
    prev,
    reset,
    toggle,
    seek,
  }
}
