import { useState, useCallback } from 'react'
import type { Question, QuizConfig, QuizResult } from '../types'
import { shuffle } from '../utils/shuffle'
import { getMissedIds } from '../utils/scoring'
import core1Questions from '../data/questions/core1.json'
import core2Questions from '../data/questions/core2.json'

const all = [...(core1Questions as Question[]), ...(core2Questions as Question[])]

function buildDeck(config: QuizConfig): Question[] {
  let pool = config.exam === 'both'
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
  if (config.mode === 'full') return pool.slice(0, 90)
  return pool
}

export function useQuiz(config: QuizConfig) {
  const [questions] = useState<Question[]>(() => buildDeck(config))
  const [index, setIndex] = useState(0)
  const [selected, setSelected] = useState<number | null>(null)
  const [results, setResults] = useState<QuizResult[]>([])
  const [startTime] = useState(() => Date.now())

  const current = questions[index]
  const isAnswered = selected !== null
  const isLast = index === questions.length - 1

  const choose = useCallback((optionIndex: number) => {
    if (selected !== null || !current) return
    setSelected(optionIndex)
    setResults(prev => [
      ...prev,
      {
        question: current,
        selectedAnswer: optionIndex,
        correct: optionIndex === current.answer,
      },
    ])
  }, [selected, current])

  const next = useCallback(() => {
    setSelected(null)
    setIndex(i => i + 1)
  }, [])

  const elapsedSeconds = Math.round((Date.now() - startTime) / 1000)

  return {
    questions,
    current,
    index,
    total: questions.length,
    selected,
    results,
    isAnswered,
    isLast,
    elapsedSeconds,
    choose,
    next,
  }
}

export function getDomains(exam: 'core1' | 'core2' | 'both'): string[] {
  const pool = exam === 'both' ? all : all.filter(q => q.exam === exam)
  return [...new Set(pool.map(q => q.domain))].sort()
}
