import { Link } from 'react-router-dom'
import { ALGORITHMS, MODULES, type ModuleKey } from '../algorithms/registry'
import styles from './HomePage.module.css'

const MODULE_ORDER: ModuleKey[] = ['sort', 'search', 'recursion', 'datastructure', 'others']

export default function HomePage() {
  const availableCount = ALGORITHMS.filter((a) => a.available).length

  return (
    <div className={styles.wrap}>
      <section className={styles.hero}>
        <h1 className={styles.heroTitle}>把每个算法，一步一步看清楚</h1>
        <p className={styles.heroSub}>
          面向浙江高中信息技术（学考 / 选考）的算法可视化教学平台。动画演示、代码联动、分步讲解。
        </p>
        <p className={styles.heroMeta}>
          已上线 <span className={styles.count}>{availableCount}</span> 个算法，共规划{' '}
          <span className={styles.count}>{ALGORITHMS.length}</span> 个
        </p>
      </section>

      {MODULE_ORDER.map((mod) => {
        const items = ALGORITHMS.filter((a) => a.module === mod)
        if (items.length === 0) return null
        return (
          <section key={mod} className={styles.section}>
            <h2 className={styles.sectionTitle}>{MODULES[mod]}</h2>
            <div className={styles.grid}>
              {items.map((a) => (
                <Link
                  key={a.id}
                  to={a.available ? `/algo/${a.id}` : '#'}
                  className={`${styles.card} ${a.available ? '' : styles.cardDisabled}`}
                  onClick={(e) => {
                    if (!a.available) e.preventDefault()
                  }}
                >
                  <div className={styles.cardTop}>
                    <span className={styles.cardTitle}>{a.title}</span>
                    <span className={`${styles.level} ${styles[a.level]}`}>{a.level}</span>
                  </div>
                  <p className={styles.cardDesc}>{a.desc}</p>
                  <div className={styles.cardFoot}>
                    {a.available ? (
                      <span className={styles.statusReady}>可开始学习</span>
                    ) : (
                      <span className={styles.statusSoon}>规划中</span>
                    )}
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )
      })}
    </div>
  )
}
