import { useEffect } from 'react'
import { HashRouter, Routes, Route, useParams } from 'react-router-dom'
import AppLayout from './components/Layout/AppLayout'
import HomePage from './pages/HomePage'
import BubbleSortPage from './pages/BubbleSortPage'
import SelectionSortPage from './pages/SelectionSortPage'
import InsertionSortPage from './pages/InsertionSortPage'
import LinearSearchPage from './pages/LinearSearchPage'
import BinarySearchPage from './pages/BinarySearchPage'
import FactorialPage from './pages/FactorialPage'
import FibonacciPage from './pages/FibonacciPage'
import HanoiPage from './pages/HanoiPage'
import GcdPage from './pages/GcdPage'
import LinkedListPage from './pages/LinkedListPage'
import QueuePage from './pages/QueuePage'
import StackPage from './pages/StackPage'
import BTreePage from './pages/BTreePage'
import HashPage from './pages/HashPage'
import RadixPage from './pages/RadixPage'
import CaesarPage from './pages/CaesarPage'
import GreedyPage from './pages/GreedyPage'
import SqlPage from './pages/SqlPage'
import { getAlgorithm } from './algorithms/registry'
import { useUI } from './store/ui'

const PAGE_MAP: Record<string, () => JSX.Element> = {
  bubble: BubbleSortPage,
  selection: SelectionSortPage,
  insertion: InsertionSortPage,
  linear: LinearSearchPage,
  binary: BinarySearchPage,
  factorial: FactorialPage,
  fibonacci: FibonacciPage,
  hanoi: HanoiPage,
  gcd: GcdPage,
  linkedlist: LinkedListPage,
  queue: QueuePage,
  stack: StackPage,
  btree: BTreePage,
  hashtable: HashPage,
  radix: RadixPage,
  caesar: CaesarPage,
  greedy: GreedyPage,
  sql: SqlPage,
}

function AlgoRoute() {
  const { id = '' } = useParams()
  const meta = getAlgorithm(id)
  const Page = PAGE_MAP[id]
  if (!meta || !Page) {
    return (
      <div style={{ padding: 40, color: 'var(--text-muted)' }}>
        未找到该算法「{meta?.title ?? id}」，请从首页选择其他算法。
      </div>
    )
  }
  return <Page />
}

export default function App() {
  const { theme, largeFont } = useUI()

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme)
  }, [theme])

  useEffect(() => {
    document.documentElement.setAttribute('data-large-font', String(largeFont))
  }, [largeFont])

  return (
    <HashRouter>
      <Routes>
        <Route
          element={
            <AppLayout
              theme={theme}
              largeFont={largeFont}
              onToggleTheme={() => useUI.getState().toggleTheme()}
              onToggleFont={() => useUI.getState().toggleLargeFont()}
            />
          }
        >
          <Route index element={<HomePage />} />
          <Route path="algo/:id" element={<AlgoRoute />} />
        </Route>
      </Routes>
    </HashRouter>
  )
}
