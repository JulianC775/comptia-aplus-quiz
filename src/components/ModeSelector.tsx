import type { QuizConfig, QuizMode } from '../types'
import { getMissedIds } from '../utils/scoring'
import { getDomains } from '../hooks/useQuiz'

interface Props {
  config: QuizConfig
  onChange: (config: QuizConfig) => void
  onStart: () => void
}

const EXAMS = [
  { value: 'core1', label: 'Core 1 (220-1201)' },
  { value: 'core2', label: 'Core 2 (220-1202)' },
  { value: 'both', label: 'Both Exams' },
] as const

const MODES: { value: QuizMode; label: string; desc: string; disabled?: boolean }[] = [
  { value: 'quick', label: 'Quick Quiz', desc: '10 random questions' },
  { value: 'full', label: 'Full Exam Sim', desc: '90 questions, timed' },
  { value: 'domain', label: 'Domain Focus', desc: 'Pick a specific domain' },
  { value: 'missed', label: 'Missed Questions', desc: 'Re-quiz questions you got wrong' },
  { value: 'recent-core1', label: 'Recent Core 1 Questions', desc: 'Newest 220-1201 topics only' },
  { value: 'recent-core2', label: 'Recent Core 2 Questions', desc: 'Newest 220-1202 topics only' },
  { value: 'pbq-core1', label: 'Performance-Based (Core 1)', desc: 'Sequence and categorize tasks' },
  { value: 'pbq-core2', label: 'Performance-Based (Core 2)', desc: 'Coming soon', disabled: true },
]

export default function ModeSelector({ config, onChange, onStart }: Props) {
  const domains = getDomains(config.exam)
  const missedCount = getMissedIds().size

  const canStart =
    config.mode !== 'domain' || !!config.domain

  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm font-semibold text-gray-400 uppercase tracking-wide mb-2">Exam</p>
        <div className="flex flex-col sm:flex-row gap-2">
          {EXAMS.map(e => (
            <button
              key={e.value}
              onClick={() => onChange({ ...config, exam: e.value, domain: undefined })}
              className={`flex-1 py-2 px-4 rounded-lg text-sm font-medium border transition-colors ${
                config.exam === e.value
                  ? 'bg-blue-600 border-blue-500 text-white'
                  : 'bg-gray-900 border-gray-700 text-gray-300 hover:border-blue-500'
              }`}
            >
              {e.label}
            </button>
          ))}
        </div>
      </div>

      <div>
        <p className="text-sm font-semibold text-gray-400 uppercase tracking-wide mb-2">Mode</p>
        <div className="flex flex-col gap-2">
          {MODES.map(m => (
            <button
              key={m.value}
              onClick={() => onChange({ ...config, mode: m.value, domain: undefined })}
              disabled={m.disabled || (m.value === 'missed' && missedCount === 0)}
              className={`flex items-center justify-between w-full py-3 px-4 rounded-lg border text-left transition-colors disabled:opacity-40 disabled:cursor-not-allowed ${
                config.mode === m.value
                  ? 'bg-blue-600 border-blue-500 text-white'
                  : 'bg-gray-900 border-gray-700 text-gray-300 hover:border-blue-500'
              }`}
            >
              <span className="font-medium">{m.label}</span>
              <span className={`text-xs ${config.mode === m.value ? 'text-blue-200' : 'text-gray-500'}`}>
                {m.value === 'missed' && missedCount > 0 ? `${missedCount} saved` : m.desc}
              </span>
            </button>
          ))}
        </div>
      </div>

      {config.mode === 'domain' && (
        <div>
          <p className="text-sm font-semibold text-gray-400 uppercase tracking-wide mb-2">Domain</p>
          <div className="flex flex-col gap-2">
            {domains.map(d => (
              <button
                key={d}
                onClick={() => onChange({ ...config, domain: d })}
                className={`w-full py-2 px-4 rounded-lg text-sm text-left border transition-colors ${
                  config.domain === d
                    ? 'bg-blue-600 border-blue-500 text-white'
                    : 'bg-gray-900 border-gray-700 text-gray-300 hover:border-blue-500'
                }`}
              >
                {d}
              </button>
            ))}
          </div>
        </div>
      )}

      <button
        onClick={onStart}
        disabled={!canStart}
        className="w-full py-4 rounded-xl bg-blue-600 hover:bg-blue-500 disabled:opacity-40 disabled:cursor-not-allowed font-bold text-lg transition-colors"
      >
        Start Quiz
      </button>
    </div>
  )
}
