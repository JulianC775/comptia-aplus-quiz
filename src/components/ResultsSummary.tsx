import type { QuizResult } from '../types'
import { calcScore, calcPercent, formatTime } from '../utils/scoring'

interface Props {
  results: QuizResult[]
  elapsedSeconds: number
  onRestart: () => void
  onHome: () => void
}

export default function ResultsSummary({ results, elapsedSeconds, onRestart, onHome }: Props) {
  const score = calcScore(results)
  const pct = calcPercent(results)
  const missed = results.filter(r => !r.correct)

  const grade =
    pct >= 90 ? { label: 'Excellent', color: 'text-green-400' } :
    pct >= 80 ? { label: 'Strong', color: 'text-blue-400' } :
    pct >= 70 ? { label: 'Almost there', color: 'text-yellow-400' } :
    { label: 'Keep studying', color: 'text-red-400' }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <p className={`text-5xl font-bold mb-1 ${grade.color}`}>{pct}%</p>
        <p className={`text-lg font-medium ${grade.color}`}>{grade.label}</p>
        <p className="text-gray-400 mt-1 text-sm">
          {score} / {results.length} correct · {formatTime(elapsedSeconds)}
        </p>
      </div>

      {missed.length > 0 && (
        <div className="space-y-3">
          <p className="text-sm font-semibold text-gray-400 uppercase tracking-wide">
            Missed questions
          </p>
          {missed.map(({ question, selectedAnswer }) => (
            <div key={question.id} className="bg-gray-900 border border-gray-800 rounded-lg p-4 text-sm">
              <p className="text-gray-200 mb-2">{question.question}</p>
              <p className="text-red-400">
                Your answer: {selectedAnswer !== null ? question.options[selectedAnswer] : '—'}
              </p>
              <p className="text-green-400">
                Correct: {question.options[question.answer]}
              </p>
              {question.explanation && (
                <p className="text-gray-400 mt-2 leading-relaxed">{question.explanation}</p>
              )}
            </div>
          ))}
        </div>
      )}

      <div className="flex gap-3 pt-2">
        <button
          onClick={onRestart}
          className="flex-1 py-3 rounded-lg bg-blue-600 hover:bg-blue-500 font-semibold transition-colors"
        >
          Try Again
        </button>
        <button
          onClick={onHome}
          className="flex-1 py-3 rounded-lg bg-gray-800 hover:bg-gray-700 font-semibold transition-colors"
        >
          Home
        </button>
      </div>
    </div>
  )
}
