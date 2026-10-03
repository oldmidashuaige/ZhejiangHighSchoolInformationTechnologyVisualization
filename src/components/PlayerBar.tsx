import type { PlayerApi, Speed } from '../hooks/usePlayer'
import styles from './PlayerBar.module.css'

const SPEEDS: Speed[] = [0.25, 0.5, 1, 2, 4]

function StepBackIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M11 17l-5-5 5-5" />
      <path d="M18 17l-5-5 5-5" />
    </svg>
  )
}

function NextIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M9 18l6-6-6-6" />
    </svg>
  )
}

function StepForwardIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M13 17l5-5-5-5" />
      <path d="M6 17l5-5-5-5" />
    </svg>
  )
}

function PlayIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M8 5v14l11-7z" />
    </svg>
  )
}

function PauseIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <rect x="6" y="5" width="4" height="14" rx="1" />
      <rect x="14" y="5" width="4" height="14" rx="1" />
    </svg>
  )
}

function ResetIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M3 12a9 9 0 1 0 3-6.7L3 8" />
      <path d="M3 3v5h5" />
    </svg>
  )
}

interface PlayerBarProps {
  player: PlayerApi
}

export default function PlayerBar({ player }: PlayerBarProps) {
  const { index, playing, speed, total, setSpeed, next, prev, reset, toggle, seek } = player
  const progress = total === 0 ? 0 : ((index + 1) / total) * 100
  const atEnd = index >= total - 1

  return (
    <div className={styles.bar}>
      <div className={styles.buttons}>
        <button className={styles.btn} onClick={reset} title="重置到初始状态" aria-label="重置">
          <ResetIcon />
        </button>
        <button className={styles.btn} onClick={prev} disabled={index <= -1} title="上一步" aria-label="上一步">
          <StepBackIcon />
        </button>
        <button className={`${styles.btn} ${styles.play}`} onClick={toggle} title={playing ? '暂停' : '播放'} aria-label={playing ? '暂停' : '播放'}>
          {playing ? <PauseIcon /> : <PlayIcon />}
        </button>
        <button className={styles.btn} onClick={next} disabled={atEnd} title="下一步" aria-label="下一步">
          <NextIcon />
        </button>
        <button className={styles.btn} onClick={() => seek(total - 1)} disabled={atEnd} title="跳到最后" aria-label="跳到最后">
          <StepForwardIcon />
        </button>
      </div>

      <div className={styles.progressArea}>
        <div className={styles.sliderWrap}>
          <input
            className={styles.slider}
            type="range"
            min={0}
            max={Math.max(total - 1, 0)}
            value={Math.max(index, 0)}
            onChange={(e) => seek(Number(e.target.value))}
            aria-label="进度"
          />
          <div className={styles.trackFill} style={{ width: `${progress}%` }} />
        </div>
        <div className={styles.counter}>
          <span className={styles.counterNow}>{index + 1}</span>
          <span className={styles.counterTotal}>/ {total}</span>
        </div>
      </div>

      <div className={styles.speedGroup} role="group" aria-label="播放速度">
        {SPEEDS.map((s) => (
          <button
            key={s}
            className={`${styles.speedBtn} ${speed === s ? styles.speedActive : ''}`}
            onClick={() => setSpeed(s)}
          >
            {s}×
          </button>
        ))}
      </div>
    </div>
  )
}
