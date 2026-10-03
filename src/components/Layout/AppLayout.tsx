import { Outlet, useLocation } from 'react-router-dom'
import { getAlgorithm } from '../../algorithms/registry'
import Sidebar from './Sidebar'
import styles from './AppLayout.module.css'

interface AppLayoutProps {
  theme: 'light' | 'dark'
  largeFont: boolean
  onToggleTheme: () => void
  onToggleFont: () => void
}

export default function AppLayout({ theme, largeFont, onToggleTheme, onToggleFont }: AppLayoutProps) {
  const location = useLocation()
  const algo = location.pathname.startsWith('/algo/') ? getAlgorithm(location.pathname.split('/')[2]) : undefined

  return (
    <div className={styles.layout}>
      <Sidebar
        theme={theme}
        largeFont={largeFont}
        onToggleTheme={onToggleTheme}
        onToggleFont={onToggleFont}
      />
      <main className={styles.main}>
        {algo && (
          <header className={styles.topbar}>
            <span className={styles.crumb}>{algo.title}</span>
          </header>
        )}
        <div className={styles.content}>
          <Outlet />
        </div>
      </main>
    </div>
  )
}
