// 进制转换：支持 2/8/10/16 进制任意互转
// 源进制≠10 → 先"按权展开"转成十进制；目标进制≠10 → 再"短除法"转目标进制
import type { RadixStep } from '../types'

const DIGITS = '0123456789ABCDEF'

function digitVal(ch: string): number {
  const d = DIGITS.indexOf(ch.toUpperCase())
  return d < 0 ? -1 : d
}

const VALID_BASES = [2, 8, 10, 16]

export function validBase(b: number): number {
  return VALID_BASES.includes(b) ? b : 10
}

export function radixSteps(inputStr: string, sourceBase: number, targetBase: number): RadixStep[] {
  const sb = validBase(sourceBase)
  const tb = validBase(targetBase)
  const s = inputStr.trim().toUpperCase()
  const steps: RadixStep[] = []

  const record = (patch: Partial<RadixStep> & { desc: string; done?: boolean }): void => {
    steps.push({
      input: s,
      sourceBase: sb,
      targetBase: tb,
      decimal,
      expandRows: expandRows.map((r) => ({ ...r })),
      expandCurrent,
      divRows: divRows.map((r) => ({ ...r })),
      divCurrent,
      result,
      phase,
      valid,
      ...patch,
    })
  }

  // 校验：输入非空、每个数码都在源进制范围内
  const valid = s.length > 0 && [...s].every((ch) => digitVal(ch) >= 0 && digitVal(ch) < sb)
  let decimal = 0
  let expandRows: { digit: number; pos: number; power: number; term: number }[] = []
  let expandCurrent = -1
  let divRows: { q: number; r: number }[] = []
  let divCurrent = -1
  let result = ''
  let phase: RadixStep['phase'] = 'done'

  if (!valid) {
    steps.push({
      input: s,
      sourceBase: sb,
      targetBase: tb,
      decimal: 0,
      expandRows: [],
      expandCurrent: -1,
      divRows: [],
      divCurrent: -1,
      result: '',
      phase: 'done',
      valid: false,
      desc: `输入 "${inputStr}" 不是合法的 ${sb} 进制数（只允许 0~${DIGITS.slice(0, sb)}），请修改输入`,
      done: true,
    })
    return steps
  }

  if (sb === tb) {
    steps.push({
      input: s,
      sourceBase: sb,
      targetBase: tb,
      decimal: 0,
      expandRows: [],
      expandCurrent: -1,
      divRows: [],
      divCurrent: -1,
      result: s,
      phase: 'done',
      valid: true,
      desc: `源进制和目标进制相同（都是 ${sb} 进制），结果就是原数 (${s})${sb}`,
      done: true,
    })
    return steps
  }

  // 第一阶段：按权展开（仅当源进制 ≠ 10）
  if (sb !== 10) {
    expandRows = s.split('').map((ch, i) => {
      const pos = s.length - 1 - i
      const digit = digitVal(ch)
      const power = Math.pow(sb, pos)
      return { digit, pos, power, term: digit * power }
    })
    decimal = expandRows.reduce((a, r) => a + r.term, 0)
    phase = 'expand'
    record({
      desc: `先把 ${s}(${sb}) 转成十进制：按权展开，最右边为第 0 位，第 i 位权值是 ${sb}^i`,
      phase: 'expand',
    })
    for (let i = 0; i < expandRows.length; i++) {
      expandCurrent = i
      const r = expandRows[i]
      record({
        desc: `第 ${r.pos} 位：数码 ${DIGITS[r.digit]} × ${sb}^${r.pos} = ${r.term}`,
        phase: 'expand',
      })
    }
    expandCurrent = expandRows.length - 1
    record({
      desc: `按权展开求和：${expandRows.map((r) => `${DIGITS[r.digit]}×${sb}^${r.pos}`).join(' + ')} = ${decimal}（十进制）`,
      phase: 'expand',
    })
  } else {
    decimal = parseInt(s, 10)
    record({ desc: `源进制是十进制，无需转换，直接得到十进制数 ${decimal}`, phase: 'expand' })
  }

  // 第二阶段：短除法（仅当目标进制 ≠ 10）
  if (tb !== 10) {
    let cur = decimal
    divRows = []
    do {
      divRows.push({ q: Math.floor(cur / tb), r: cur % tb })
      cur = Math.floor(cur / tb)
    } while (cur > 0)
    result = divRows.map((r) => DIGITS[r.r]).reverse().join('')
    phase = 'divide'
    record({
      desc: `再把十进制数 ${decimal} 转成 ${tb} 进制：短除法，不断除以 ${tb} 取余数`,
      phase: 'divide',
    })
    for (let i = 0; i < divRows.length; i++) {
      divCurrent = i
      const row = divRows[i]
      const dividend = i === 0 ? decimal : divRows[i - 1].q
      record({
        desc: `${dividend} ÷ ${tb} = ${row.q} 余 ${row.r}${row.q === 0 ? '（商为 0，停止）' : ''}`,
        phase: 'divide',
      })
    }
    divCurrent = divRows.length - 1
    record({
      desc: `把余数从下往上排列：${divRows.map((r) => DIGITS[r.r]).reverse().join('')} → 结果 (${result})${tb}`,
      phase: 'divide',
    })
  } else {
    result = String(decimal)
    phase = 'done'
    record({ desc: `目标进制是十进制，直接得到结果 ${decimal}`, phase: 'done' })
  }

  // 汇总：若经过两次转换，说明中间走了十进制
  phase = 'done'
  const viaDecimal = sb !== 10 && tb !== 10
  record({
    desc: `转换完成：(${s})${sb} ${viaDecimal ? `→ (${decimal})₁₀ → ` : '→ '}(${result})${tb}`,
    phase: 'done',
    done: true,
  })

  return steps
}

export const radixCode = `# 任意进制互相转换：都以十进制为桥梁
def to_decimal(s, base):          # 其他进制 → 十进制（按权展开）
    digits = "0123456789ABCDEF"
    n = 0
    for ch in s:                  # 1 从高位开始
        d = digits.index(ch)
        n = n * base + d          # 2 累乘 + 累加（霍纳法）
    return n

def from_decimal(n, base):        # 十进制 → 其他进制（短除法）
    digits = "0123456789ABCDEF"
    res = ""
    while n > 0:
        res = digits[n % base] + res   # 3 余数放最前
        n //= base                     # 4 更新商
    return res or "0"

# 例：二进制 1011 → 十六进制
# d = to_decimal("1011", 2)     # 11
# h = from_decimal(d, 16)       # "B"`

export const BASE_LABELS: Record<number, string> = { 2: '二进制', 8: '八进制', 10: '十进制', 16: '十六进制' }
