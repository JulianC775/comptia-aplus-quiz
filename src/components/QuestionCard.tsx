import type { Question } from '../types'
import ExplanationBox from './ExplanationBox'
import { isCorrect } from '../hooks/useQuiz'

interface Props {
  question: Question
  selected: number[]
  confirmed: boolean
  onToggle: (index: number) => void
  onConfirm: () => void
  canConfirm: boolean
  requiredCount: number
}

const labels = ['A', 'B', 'C', 'D', 'E', 'F', 'G']

export default function QuestionCard({
  question, selected, confirmed, onToggle, onConfirm, canConfirm, requiredCount,
}: Props) {
  const multi = Array.isArray(question.answer)
  const correct = confirmed ? isCorrect(question, selected) : false
  const correctAnswers = Array.isArray(question.answer) ? question.answer : [question.answer]

  return (
    <div>
      <div className="flex items-center gap-2 mb-3">
        <p className="text-xs font-medium text-blue-400 uppercase tracking-wide">
          {question.domain}
        </p>
        {multi && (
          <span className="text-xs bg-yellow-900 text-yellow-300 px-2 py-0.5 rounded-full font-medium">
            Select {requiredCount}
          </span>
        )}
      </div>

      <p className="text-lg font-medium text-gray-100 leading-relaxed mb-6">
        {question.question}
      </p>

      <div className="flex flex-col gap-3">
        {question.options.map((opt, i) => {
          const isSelected = selected.includes(i)
          const isCorrectOption = correctAnswers.includes(i)

          let style = 'border-gray-700 bg-gray-900 hover:border-blue-500 hover:bg-gray-800'
          if (confirmed) {
            if (isCorrectOption) style = 'border-green-500 bg-green-950 text-green-100'
            else if (isSelected) style = 'border-red-500 bg-red-950 text-red-100'
            else style = 'border-gray-800 bg-gray-900 text-gray-500'
          } else if (isSelected) {
            style = 'border-blue-500 bg-blue-950 text-blue-100'
          }

          return (
            <button
              key={i}
              onClick={() => onToggle(i)}
              disabled={confirmed}
              className={`flex items-start gap-3 w-full text-left px-4 py-3 rounded-lg border transition-colors min-h-[44px] ${style}`}
            >
              <span className="font-bold text-sm w-5 shrink-0 mt-0.5">{labels[i]}.</span>
              <span className="text-sm leading-relaxed flex-1">{opt}</span>
              {multi && !confirmed && (
                <span className={`w-4 h-4 rounded border shrink-0 mt-0.5 flex items-center justify-center text-xs ${
                  isSelected ? 'bg-blue-500 border-blue-500 text-white' : 'border-gray-500'
                }`}>
                  {isSelected && '✓'}
                </span>
              )}
            </button>
          )
        })}
      </div>

      {multi && !confirmed && (
        <button
          onClick={onConfirm}
          disabled={!canConfirm}
          className="mt-4 w-full py-3 rounded-lg bg-blue-600 hover:bg-blue-500 disabled:opacity-40 disabled:cursor-not-allowed font-semibold transition-colors"
        >
          Check Answer {selected.length > 0 && `(${selected.length}/${requiredCount})`}
        </button>
      )}

      {confirmed && (
        <ExplanationBox
          explanation={question.explanation ?? ''}
          correct={correct}
        />
      )}
    </div>
  )
}
