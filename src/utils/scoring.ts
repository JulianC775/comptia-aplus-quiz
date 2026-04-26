import type { QuizResult } from '../types'

export function calcScore(results: QuizResult[]): number {
  return results.filter(r => r.correct).length
}

export function calcPercent(results: QuizResult[]): number {
  if (results.length === 0) return 0
  return Math.round((calcScore(results) / results.length) * 100)
}

export function formatTime(seconds: number): string {
  const m = Math.floor(seconds / 60)
  const s = seconds % 60
  return `${m}:${s.toString().padStart(2, '0')}`
}

const MISSED_KEY = 'aplus_missed_ids'

export function getMissedIds(): Set<string> {
  try {
    const raw = localStorage.getItem(MISSED_KEY)
    return new Set(raw ? (JSON.parse(raw) as string[]) : [])
  } catch {
    return new Set()
  }
}

export function saveMissedIds(ids: string[]): void {
  try {
    const existing = getMissedIds()
    ids.forEach(id => existing.add(id))
    localStorage.setItem(MISSED_KEY, JSON.stringify([...existing]))
  } catch {
    // localStorage unavailable — silently ignore
  }
}

export function clearMissedIds(): void {
  localStorage.removeItem(MISSED_KEY)
}
