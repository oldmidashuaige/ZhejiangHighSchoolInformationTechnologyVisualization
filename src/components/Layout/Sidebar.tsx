import { NavLink, useLocation } from 'react-router-dom'
import { ALGORITHMS, MODULES, type ModuleKey } from '../../algorithms/registry'
import styles from './Sidebar.module.css'

const MODULE_ORDER: ModuleKey[] = ['sort', 'search', 'recursion', 'datastructure', 'others']

function SunIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" />
    </svg>
  )
}

function MoonIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z" />
    </svg>
  )
}

function FontIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
      <path d="M4 7V5h16v2M12 5v14M9 19h6" />
    </svg>
  )
}

interface SidebarProps {
  theme: 'light' | 'dark'
  largeFont: boolean
  onToggleTheme: () => void
  onToggleFont: () => void
}

export default function Sidebar({ theme, largeFont, onToggleTheme, onToggleFont }: SidebarProps) {
  const location = useLocation()

  return (
    <aside className={styles.aside}>
      <div className={styles.brand}>
        <NavLink to="/" className={styles.brandLink}>
          <span className={styles.brandMark} />
          <span className={styles.brandText}>算法可视化教学平台</span>
        </NavLink>
      </div>

      <div className={styles.tools}>
        <button className={styles.toolBtn} onClick={onToggleFont} title={largeFont ? '关闭大字号' : '开启大字号（课堂演示）'} aria-label="切换大字号">
          <FontIcon />
        </button>
        <button className={styles.toolBtn} onClick={onToggleTheme} title={theme === 'light' ? '切换到暗色' : '切换到亮色'} aria-label="切换主题">
          {theme === 'light' ? <MoonIcon /> : <SunIcon />}
        </button>
      </div>

      <nav className={styles.nav}>
        {MODULE_ORDER.map((mod) => (
          <div key={mod} className={styles.section}>
            <div className={styles.sectionTitle}>{MODULES[mod]}</div>
            {ALGORITHMS.filter((a) => a.module === mod).map((a) => (
              <NavLink
                key={a.id}
                to={a.available ? `/algo/${a.id}` : location.pathname}
                className={({ isActive }) =>
                  `${styles.item} ${a.available ? '' : styles.itemDisabled} ${
                    isActive && a.available ? styles.itemActive : ''
                  }`
                }
                onClick={(e) => {
                  if (!a.available) e.preventDefault()
                }}
                title={a.available ? a.desc : '规划中'}
              >
                <span className={styles.itemTitle}>{a.title}</span>
                <span className={`${styles.badge} ${styles[a.level]}`}>{a.level}</span>
                {!a.available && <span className={styles.planning}>规划中</span>}
              </NavLink>
            ))}
          </div>
        ))}
      </nav>
    </aside>
  )
}
