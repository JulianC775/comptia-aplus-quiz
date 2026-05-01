import { useState, useMemo } from 'react'
import type { PerformanceQuestion, CategorizePBQ, SequencePBQ } from '../types'
import { shuffle } from '../utils/shuffle'

interface Props {
  question: PerformanceQuestion
  submitted: boolean
  onSubmit: (correct: boolean) => void
}

export default function PBQCard({ question, submitted, onSubmit }: Props) {
  if (question.type === 'categorize') {
    return <CategorizeView question={question} submitted={submitted} onSubmit={onSubmit} />
  }
  return <SequenceView question={question} submitted={submitted} onSubmit={onSubmit} />
}

function CategorizeView({
  question,
  submitted,
  onSubmit,
}: {
  question: CategorizePBQ
  submitted: boolean
  onSubmit: (correct: boolean) => void
}) {
  const [assignments, setAssignments] = useState<Record<string, string>>({})

  const allAssigned = question.items.every(i => assignments[i.label])

  function handleSubmit() {
    const correct = question.items.every(i => assignments[i.label] === i.correct)
    onSubmit(correct)
  }

  function correctFor(label: string) {
    return question.items.find(i => i.label === label)?.correct ?? ''
  }

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-medium text-gray-100">{question.question}</h2>

      <div className="space-y-3">
        {question.items.map(item => {
          const selected = assignments[item.label]
          const correct = correctFor(item.label)
          const itemRight = submitted && selected === correct
          return (
            <div
              key={item.label}
              className={`rounded-lg p-3 border ${
                submitted
                  ? itemRight
                    ? 'bg-green-900/20 border-green-700'
                    : 'bg-red-900/20 border-red-700'
                  : 'bg-gray-800 border-gray-700'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="font-mono text-base text-gray-100">{item.label}</span>
                {submitted && (
                  <span className={`text-sm ${itemRight ? 'text-green-400' : 'text-red-400'}`}>
                    {itemRight ? '✓ Correct' : `✗ Correct: ${correct}`}
                  </span>
                )}
              </div>
              <div className="flex flex-wrap gap-2">
                {question.categories.map(cat => {
                  const isSelected = selected === cat
                  let cls = 'px-3 py-2 rounded text-sm font-medium transition-colors min-h-11 '
                  if (submitted) {
                    if (cat === correct) {
                      cls += 'bg-green-700 text-white'
                    } else if (isSelected) {
                      cls += 'bg-red-700 text-white'
                    } else {
                      cls += 'bg-gray-700 text-gray-400'
                    }
                  } else {
                    cls += isSelected
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-700 text-gray-200 hover:bg-gray-600'
                  }
                  return (
                    <button
                      key={cat}
                      disabled={submitted}
                      onClick={() => setAssignments(prev => ({ ...prev, [item.label]: cat }))}
                      className={cls}
                    >
                      {cat}
                    </button>
                  )
                })}
              </div>
            </div>
          )
        })}
      </div>

      {!submitted && (
        <button
          onClick={handleSubmit}
          disabled={!allAssigned}
          className="w-full py-3 rounded-lg bg-blue-600 hover:bg-blue-500 disabled:opacity-40 disabled:cursor-not-allowed font-bold text-white transition-colors"
        >
          {allAssigned ? 'Submit Answer' : `Assign all ${question.items.length} items`}
        </button>
      )}

      {submitted && question.explanation && (
        <div className="bg-gray-800 border border-gray-700 rounded-lg p-3 text-sm text-gray-300">
          <strong className="text-gray-100">Explanation:</strong> {question.explanation}
        </div>
      )}
    </div>
  )
}

function SequenceView({
  question,
  submitted,
  onSubmit,
}: {
  question: SequencePBQ
  submitted: boolean
  onSubmit: (correct: boolean) => void
}) {
  const initial = useMemo(() => {
    let s = shuffle(question.steps)
    // Avoid the (rare) case where shuffle returns the answer order
    if (s.every((step, i) => step === question.steps[i]) && s.length > 1) {
      s = [s[1], s[0], ...s.slice(2)]
    }
    return s
  }, [question])

  const [order, setOrder] = useState<string[]>(initial)

  function move(i: number, dir: -1 | 1) {
    const j = i + dir
    if (j < 0 || j >= order.length) return
    const next = [...order]
    ;[next[i], next[j]] = [next[j], next[i]]
    setOrder(next)
  }

  function handleSubmit() {
    const correct = order.every((step, i) => step === question.steps[i])
    onSubmit(correct)
  }

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-medium text-gray-100">{question.question}</h2>

      <ol className="space-y-2">
        {order.map((step, i) => {
          const isCorrectPos = step === question.steps[i]
          const cls = submitted
            ? isCorrectPos
              ? 'bg-green-900/20 border-green-700'
              : 'bg-red-900/20 border-red-700'
            : 'bg-gray-800 border-gray-700'
          return (
            <li
              key={step}
              className={`flex items-center gap-2 p-3 rounded-lg border ${cls}`}
            >
              <span className="text-gray-500 w-6 text-right font-mono">{i + 1}.</span>
              <span className="flex-1 text-gray-100 text-sm sm:text-base">{step}</span>
              {!submitted && (
                <>
                  <button
                    disabled={i === 0}
                    onClick={() => move(i, -1)}
                    className="p-2 rounded text-gray-200 hover:bg-gray-700 disabled:opacity-30 disabled:cursor-not-allowed min-w-11 min-h-11 text-lg"
                    aria-label="Move up"
                  >
                    ↑
                  </button>
                  <button
                    disabled={i === order.length - 1}
                    onClick={() => move(i, 1)}
                    className="p-2 rounded text-gray-200 hover:bg-gray-700 disabled:opacity-30 disabled:cursor-not-allowed min-w-11 min-h-11 text-lg"
                    aria-label="Move down"
                  >
                    ↓
                  </button>
                </>
              )}
              {submitted && !isCorrectPos && (
                <span className="text-red-400 text-xs sm:text-sm">→ {question.steps[i]}</span>
              )}
            </li>
          )
        })}
      </ol>

      {!submitted && (
        <button
          onClick={handleSubmit}
          className="w-full py-3 rounded-lg bg-blue-600 hover:bg-blue-500 font-bold text-white transition-colors"
        >
          Submit Answer
        </button>
      )}

      {submitted && question.explanation && (
        <div className="bg-gray-800 border border-gray-700 rounded-lg p-3 text-sm text-gray-300">
          <strong className="text-gray-100">Explanation:</strong> {question.explanation}
        </div>
      )}
    </div>
  )
}
