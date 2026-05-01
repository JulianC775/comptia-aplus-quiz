import { useLocation, useNavigate } from 'react-router-dom'
import type { QuizConfig } from '../types'
import { usePBQ } from '../hooks/usePBQ'
import PBQCard from '../components/PBQCard'
import ProgressBar from '../components/ProgressBar'

export default function PBQ() {
  const location = useLocation()
  const navigate = useNavigate()
  const config = (location.state as { config: QuizConfig } | null)?.config

  if (!config) {
    navigate('/')
    return null
  }

  return <PBQInner config={config} />
}

function PBQInner({ config }: { config: QuizConfig }) {
  const navigate = useNavigate()
  const pbq = usePBQ(config)

  if (pbq.questions.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="text-center max-w-md">
          <p className="text-gray-300 text-lg mb-2">
            No performance-based questions available for this section yet.
          </p>
          <p className="text-gray-500 text-sm mb-6">
            Core 2 PBQs are coming soon.
          </p>
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

  if (pbq.finished) {
    const score = pbq.results.filter(r => r.correct).length
    const pct = pbq.results.length > 0 ? Math.round((score / pbq.results.length) * 100) : 0
    return (
      <div className="min-h-screen flex flex-col items-center px-4 py-10">
        <div className="w-full max-w-lg text-center space-y-6">
          <h1 className="text-3xl font-bold text-white">PBQ Results</h1>
          <div className="text-5xl font-bold text-blue-400">{pct}%</div>
          <div className="text-gray-300">
            {score} of {pbq.results.length} correct
          </div>
          <button
            onClick={() => navigate('/')}
            className="w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-500 font-bold text-lg transition-colors"
          >
            Back to Home
          </button>
        </div>
      </div>
    )
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
            <ProgressBar current={pbq.index + 1} total={pbq.total} />
          </div>
        </div>

        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-4 sm:p-6">
          {pbq.current && (
            <PBQCard
              key={pbq.current.id}
              question={pbq.current}
              submitted={pbq.submitted}
              onSubmit={pbq.submit}
            />
          )}
        </div>

        {pbq.submitted && (
          <button
            onClick={pbq.next}
            className="w-full py-4 rounded-xl bg-blue-600 hover:bg-blue-500 font-bold text-lg transition-colors"
          >
            {pbq.isLast ? 'See Results' : 'Next Question'}
          </button>
        )}
      </div>
    </div>
  )
}
