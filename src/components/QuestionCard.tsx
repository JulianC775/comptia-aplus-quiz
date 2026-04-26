import type { Question } from '../types'
import ExplanationBox from './ExplanationBox'

interface Props {
  question: Question
  selected: number | null
  onSelect: (index: number) => void
}

const labels = ['A', 'B', 'C', 'D']

export default function QuestionCard({ question, selected, onSelect }: Props) {
  const answered = selected !== null

  return (
    <div>
      <p className="text-xs font-medium text-blue-400 uppercase tracking-wide mb-3">
        {question.domain}
      </p>
      <p className="text-lg font-medium text-gray-100 leading-relaxed mb-6">
        {question.question}
      </p>

      <div className="flex flex-col gap-3">
        {question.options.map((opt, i) => {
          const isCorrect = i === question.answer
          const isSelected = i === selected

          let style = 'border-gray-700 bg-gray-900 hover:border-blue-500 hover:bg-gray-800'
          if (answered) {
            if (isCorrect) style = 'border-green-500 bg-green-950 text-green-100'
            else if (isSelected) style = 'border-red-500 bg-red-950 text-red-100'
            else style = 'border-gray-800 bg-gray-900 text-gray-500'
          }

          return (
            <button
              key={i}
              onClick={() => onSelect(i)}
              disabled={answered}
              className={`flex items-start gap-3 w-full text-left px-4 py-3 rounded-lg border transition-colors min-h-[44px] ${style}`}
            >
              <span className="font-bold text-sm w-5 shrink-0 mt-0.5">{labels[i]}.</span>
              <span className="text-sm leading-relaxed">{opt}</span>
            </button>
          )
        })}
      </div>

      {answered && (
        <ExplanationBox
          explanation={question.explanation ?? ''}
          correct={selected === question.answer}
        />
      )}
    </div>
  )
}
