import { useLocation, useNavigate } from 'react-router-dom'
import type { QuizConfig } from '../types'
import { useQuiz } from '../hooks/useQuiz'
import { saveMissedIds } from '../utils/scoring'
import ProgressBar from '../components/ProgressBar'
import QuestionCard from '../components/QuestionCard'

export default function Quiz() {
  const location = useLocation()
  const navigate = useNavigate()
  const config = (location.state as { config: QuizConfig } | null)?.config

  if (!config) {
    navigate('/')
    return null
  }

  return <QuizInner config={config} />
}

function QuizInner({ config }: { config: QuizConfig }) {
  const navigate = useNavigate()
  const quiz = useQuiz(config)

  if (quiz.questions.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="text-center">
          <p className="text-gray-300 text-lg mb-4">No questions found for this selection.</p>
          <button
            onClick={() => navigate('/')}
            className="px-6 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 font-medium transition-colors"
          >
            Go Back
          </button>
        </div>
      </div>
    )
  }

  function finish() {
    const missedIds = quiz.results
      .filter(r => !r.correct)
      .map(r => r.question.id)
    saveMissedIds(missedIds)
    navigate('/results', { state: { results: quiz.results, elapsed: quiz.elapsedSeconds, config } })
  }

  return (
    <div className="min-h-screen flex flex-col items-center px-4 py-6">
      <div className="w-full max-w-2xl space-y-6">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate('/')}
            className="text-gray-400 hover:text-gray-200 text-sm transition-colors"
          >
            ← Exit
          </button>
          <div className="flex-1">
            <ProgressBar current={quiz.index + 1} total={quiz.total} />
          </div>
        </div>

        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
          {quiz.current && (
            <QuestionCard
              question={quiz.current}
              selected={quiz.selected}
              onSelect={quiz.choose}
            />
          )}
        </div>

        {quiz.isAnswered && (
          <button
            onClick={quiz.isLast ? finish : quiz.next}
            className="w-full py-4 rounded-xl bg-blue-600 hover:bg-blue-500 font-bold text-lg transition-colors"
          >
            {quiz.isLast ? 'See Results' : 'Next Question'}
          </button>
        )}
      </div>
    </div>
  )
}
