import { useState, useCallback } from 'react'
import type { Question, AnyQuestion, PerformanceQuestion, QuizConfig, QuizResult } from '../types'
import { isPBQ } from '../types'
import { shuffle } from '../utils/shuffle'
import { getMissedIds } from '../utils/scoring'
import core1Questions from '../data/questions/core1.json'
import core2Questions from '../data/questions/core2.json'
import core1Recent from '../data/questions/core1-recent.json'
import core2Recent from '../data/questions/core2-recent.json'
import core1PBQ from '../data/questions/core1-pbq.json'
import core2PBQ from '../data/questions/core2-pbq.json'

const all: AnyQuestion[] = [
  ...(core1Questions as Question[]),
  ...(core2Questions as Question[]),
  ...(core1Recent as Question[]),
  ...(core2Recent as Question[]),
  ...(core1PBQ as PerformanceQuestion[]),
  ...(core2PBQ as PerformanceQuestion[]),
]

function buildDeck(config: QuizConfig): AnyQuestion[] {
  if (config.mode === 'recent-core1') return shuffle(core1Recent as Question[])
  if (config.mode === 'recent-core2') return shuffle(core2Recent as Question[])
  if (config.mode === 'pbq-core1')    return shuffle(core1PBQ as PerformanceQuestion[])
  if (config.mode === 'pbq-core2')    return shuffle(core2PBQ as PerformanceQuestion[])

  let pool: AnyQuestion[] = config.exam === 'both'
    ? all
    : all.filter(q => q.exam === config.exam)

  if (config.mode === 'domain' && config.domain) {
    pool = pool.filter(q => q.domain === config.domain)
  }

  if (config.mode === 'missed') {
    const missed = getMissedIds()
    pool = pool.filter(q => missed.has(q.id))
  }

  pool = shuffle(pool)
  if (config.mode === 'quick') return pool.slice(0, 10)
  if (config.mode === 'full')  return pool.slice(0, 90)
  return pool
}

export function isMultiSelect(q: Question): boolean {
  return Array.isArray(q.answer)
}

export function isCorrect(q: Question, selected: number[]): boolean {
  if (Array.isArray(q.answer)) {
    const sorted = [...selected].sort((a, b) => a - b)
    return sorted.length === q.answer.length && sorted.every((v, i) => v === (q.answer as number[])[i])
  }
  return selected.length === 1 && selected[0] === q.answer
}

export function useQuiz(config: QuizConfig) {
  const [questions] = useState<AnyQuestion[]>(() => buildDeck(config))
  const [index, setIndex] = useState(0)
  const [selected, setSelected] = useState<number[]>([])
  const [confirmed, setConfirmed] = useState(false)
  const [results, setResults] = useState<QuizResult[]>([])
  const [startTime] = useState(() => Date.now())

  const current = questions[index]
  const currentIsPBQ = current ? isPBQ(current) : false
  const currentMC = (current && !currentIsPBQ) ? current as Question : null
  const multi = currentMC ? isMultiSelect(currentMC) : false
  const isAnswered = confirmed
  const isLast = index === questions.length - 1
  const requiredCount = currentMC && Array.isArray(currentMC.answer) ? currentMC.answer.length : 1
  const canConfirm = multi && selected.length === requiredCount

  const toggle = useCallback((optionIndex: number) => {
    if (confirmed || !currentMC) return

    if (!multi) {
      const sel = [optionIndex]
      setSelected(sel)
      setConfirmed(true)
      setResults(prev => [...prev, {
        question: currentMC,
        selectedAnswer: optionIndex,
        correct: isCorrect(currentMC, sel),
      }])
    } else {
      setSelected(prev =>
        prev.includes(optionIndex)
          ? prev.filter(i => i !== optionIndex)
          : [...prev, optionIndex]
      )
    }
  }, [confirmed, currentMC, multi])

  const confirm = useCallback(() => {
    if (!currentMC || !multi || confirmed) return
    setConfirmed(true)
    setResults(prev => [...prev, {
      question: currentMC,
      selectedAnswer: selected,
      correct: isCorrect(currentMC, selected),
    }])
  }, [currentMC, multi, confirmed, selected])

  const confirmPBQ = useCallback((correct: boolean) => {
    if (!current || !isPBQ(current) || confirmed) return
    setConfirmed(true)
    setResults(prev => [...prev, {
      question: current,
      selectedAnswer: null,
      correct,
    }])
  }, [current, confirmed])

  const next = useCallback(() => {
    setSelected([])
    setConfirmed(false)
    setIndex(i => i + 1)
  }, [])

  const elapsedSeconds = Math.round((Date.now() - startTime) / 1000)

  return {
    questions,
    current,
    currentIsPBQ,
    index,
    total: questions.length,
    selected,
    results,
    isAnswered,
    isLast,
    multi,
    canConfirm,
    requiredCount,
    elapsedSeconds,
    toggle,
    confirm,
    confirmPBQ,
    next,
  }
}

export function getDomains(exam: 'core1' | 'core2' | 'both'): string[] {
  const pool = exam === 'both' ? all : all.filter(q => q.exam === exam)
  return [...new Set(pool.map(q => q.domain))].sort()
}
