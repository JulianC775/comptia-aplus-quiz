import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import ModeSelector from '../components/ModeSelector'
import type { QuizConfig } from '../types'

export default function Home() {
  const navigate = useNavigate()
  const [config, setConfig] = useState<QuizConfig>({
    mode: 'quick',
    exam: 'core1',
  })

  function start() {
    navigate('/quiz', { state: { config } })
  }

  return (
    <div className="min-h-screen flex flex-col items-center px-4 py-10">
      <div className="w-full max-w-lg">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-white">CompTIA A+ Quiz</h1>
          <p className="text-gray-400 mt-1">220-1201 Core 1 · 220-1202 Core 2</p>
        </div>
        <ModeSelector config={config} onChange={setConfig} onStart={start} />
      </div>
    </div>
  )
}
