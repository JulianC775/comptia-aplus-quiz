import type { QuizResult, Question } from '../types'
import { isPBQ } from '../types'
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
          {missed.map(({ question, selectedAnswer }) => {
            const perf = isPBQ(question)
            const mc = perf ? null : question as Question
            return (
              <div key={question.id} className="bg-gray-900 border border-gray-800 rounded-lg p-4 text-sm">
                {perf && (
                  <span className="inline-block text-xs bg-purple-900 text-purple-300 px-2 py-0.5 rounded-full font-medium mb-2">
                    Performance Question
                  </span>
                )}
                <p className="text-gray-200 mb-2">{question.question}</p>
                {perf ? (
                  <p className="text-gray-500 italic">Review this in Performance-Based mode to practice interactively.</p>
                ) : (
                  <>
                    <p className="text-red-400">
                      Your answer:{' '}
                      {selectedAnswer === null ? '—'
                        : Array.isArray(selectedAnswer)
                          ? selectedAnswer.map(i => mc!.options[i]).join(', ')
                          : mc!.options[selectedAnswer as number]}
                    </p>
                    <p className="text-green-400">
                      Correct:{' '}
                      {Array.isArray(mc!.answer)
                        ? (mc!.answer as number[]).map(i => mc!.options[i]).join(', ')
                        : mc!.options[mc!.answer as number]}
                    </p>
                  </>
                )}
                {question.explanation && (
                  <p className="text-gray-400 mt-2 leading-relaxed">{question.explanation}</p>
                )}
              </div>
            )
          })}
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
