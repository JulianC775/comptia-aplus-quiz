import { useLocation, useNavigate } from 'react-router-dom'
import type { QuizConfig, QuizResult } from '../types'
import ResultsSummary from '../components/ResultsSummary'

export default function Results() {
  const location = useLocation()
  const navigate = useNavigate()
  const state = location.state as { results: QuizResult[]; elapsed: number; config: QuizConfig } | null

  if (!state) {
    navigate('/')
    return null
  }

  return (
    <div className="min-h-screen flex flex-col items-center px-4 py-10">
      <div className="w-full max-w-2xl">
        <h2 className="text-2xl font-bold text-center mb-6">Quiz Complete</h2>
        <ResultsSummary
          results={state.results}
          elapsedSeconds={state.elapsed}
          onRestart={() => navigate('/quiz', { state: { config: state.config } })}
          onHome={() => navigate('/')}
        />
      </div>
    </div>
  )
}
