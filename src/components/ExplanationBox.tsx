interface Props {
  explanation: string
  correct: boolean
}

export default function ExplanationBox({ explanation, correct }: Props) {
  return (
    <div className={`mt-4 p-4 rounded-lg text-sm ${
      correct ? 'bg-green-950 border border-green-800 text-green-200' : 'bg-red-950 border border-red-800 text-red-200'
    }`}>
      <p className="font-semibold mb-1">{correct ? 'Correct!' : 'Incorrect'}</p>
      {explanation && <p className="text-gray-300 leading-relaxed">{explanation}</p>}
    </div>
  )
}
