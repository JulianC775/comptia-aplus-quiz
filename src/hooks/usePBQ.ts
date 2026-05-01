import { useState, useCallback } from 'react'
import type { PerformanceQuestion, PBQResult, QuizConfig } from '../types'
import { shuffle } from '../utils/shuffle'
import core1PBQ from '../data/questions/core1-pbq.json'
import core2PBQ from '../data/questions/core2-pbq.json'

function getDeck(config: QuizConfig): PerformanceQuestion[] {
  const source = config.mode === 'pbq-core1' ? core1PBQ : core2PBQ
  return shuffle(source as PerformanceQuestion[])
}

export function usePBQ(config: QuizConfig) {
  const [questions] = useState<PerformanceQuestion[]>(() => getDeck(config))
  const [index, setIndex] = useState(0)
  const [results, setResults] = useState<PBQResult[]>([])
  const [submitted, setSubmitted] = useState(false)

  const current = questions[index]
  const isLast = index === questions.length - 1
  const finished = index >= questions.length

  const submit = useCallback((correct: boolean) => {
    if (!current || submitted) return
    setSubmitted(true)
    setResults(prev => [...prev, { question: current, correct }])
  }, [current, submitted])

  const next = useCallback(() => {
    setSubmitted(false)
    setIndex(i => i + 1)
  }, [])

  return {
    questions,
    current,
    index,
    total: questions.length,
    submitted,
    isLast,
    finished,
    results,
    submit,
    next,
  }
}
