import { readFileSync, writeFileSync } from 'fs'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const root = join(__dirname, '..')

const SECTIONS = {
  core1: [
    { detailStart: 2131, detailEnd: 5537 },
    { detailStart: 7378, detailEnd: 10460 },
    { detailStart: 12129, detailEnd: 15075 },
  ],
  core2: [
    { detailStart: 2069, detailEnd: 5261 },
    { detailStart: 6904, detailEnd: 9982 },
    { detailStart: 11628, detailEnd: 14542 },
  ],
}

const CORE1_DOMAINS = {
  1: 'Mobile Devices',
  2: 'Networking',
  3: 'Hardware',
  4: 'Virtualization and Cloud Computing',
  5: 'Hardware and Network Troubleshooting',
}

const CORE2_DOMAINS = {
  1: 'Operating Systems',
  2: 'Security',
  3: 'Software Troubleshooting',
  4: 'Operational Procedures',
}

const LETTER_INDEX = { A:0, B:1, C:2, D:3, E:4, F:5, G:6 }

function domainFromObjective(objectiveLine, examKey) {
  const m = objectiveLine.match(/Objective\s+(\d+)\./)
  if (!m) return examKey === 'core1' ? 'Hardware and Network Troubleshooting' : 'Operating Systems'
  const num = parseInt(m[1])
  return examKey === 'core1'
    ? (CORE1_DOMAINS[num] ?? 'Hardware and Network Troubleshooting')
    : (CORE2_DOMAINS[num] ?? 'Operating Systems')
}

function parseDetailedSection(lines, examKey) {
  const questions = []
  const qStartRegex = /^([ABC])(\d+)\.\s+(.+)/
  const blocks = []
  let current = null

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i]
    const m = line.match(qStartRegex)
    if (m) {
      if (current) blocks.push(current)
      current = { prefix: m[1], num: parseInt(m[2]), lines: [line] }
    } else if (current) {
      current.lines.push(line)
    }
  }
  if (current) blocks.push(current)

  for (const block of blocks) {
    const q = parseBlock(block, examKey)
    if (q) questions.push(q)
  }

  return questions
}

function parseBlock(block, examKey) {
  const { lines } = block

  const answerIdx = lines.findIndex(l => /^The Answer:\s/.test(l))
  const incorrectIdx = lines.findIndex(l => /^The incorrect answers?:/.test(l))
  const moreInfoIdx = lines.findIndex(l => /^More information:/.test(l))
  const objectiveIdx = lines.findIndex(l => /220-120[12],\s*Objective/.test(l))

  if (answerIdx === -1) return null

  const optionStart = lines.findIndex(l => /^❍\s+[A-Z]\./.test(l))
  if (optionStart === -1) return null

  // Question text
  const questionLines = lines.slice(0, optionStart)
    .map(l => l.replace(/^[ABC]\d+\.\s*/, '').trim())
    .filter(Boolean)
  const question = questionLines.join(' ').trim()

  // All options (A through however many)
  const options = parseOptions(lines, optionStart, answerIdx)
  if (options.length < 2) return null

  // Parse answer — single or multi
  const answerLine = lines[answerIdx]

  // Multi-answer: "The Answer: A. foo and E. bar"
  const multiMatch = answerLine.match(/^The Answer:\s+([A-Z])\..+?\band\s+([A-Z])\./)
  if (multiMatch) {
    const idx1 = LETTER_INDEX[multiMatch[1]]
    const idx2 = LETTER_INDEX[multiMatch[2]]
    if (idx1 === undefined || idx2 === undefined) return null
    if (idx1 >= options.length || idx2 >= options.length) return null
    const answer = [idx1, idx2].sort((a, b) => a - b)

    const explEnd = incorrectIdx !== -1 ? incorrectIdx : (moreInfoIdx !== -1 ? moreInfoIdx : lines.length)
    const explanation = lines.slice(answerIdx + 1, explEnd)
      .map(l => l.trim()).filter(l => l && !/^❍/.test(l)).join(' ').trim()

    const domain = objectiveIdx !== -1
      ? domainFromObjective(lines[objectiveIdx], examKey)
      : (examKey === 'core1' ? 'Hardware and Network Troubleshooting' : 'Operating Systems')

    return { question, options, answer, explanation, domain }
  }

  // Single answer
  const singleMatch = answerLine.match(/^The Answer:\s+([A-Z])\./)
  if (!singleMatch) return null
  const answerIndex = LETTER_INDEX[singleMatch[1]]
  if (answerIndex === undefined || answerIndex >= options.length) return null

  const explEnd = incorrectIdx !== -1 ? incorrectIdx : (moreInfoIdx !== -1 ? moreInfoIdx : lines.length)
  const explanation = lines.slice(answerIdx + 1, explEnd)
    .map(l => l.trim()).filter(l => l && !/^❍/.test(l)).join(' ').trim()

  const domain = objectiveIdx !== -1
    ? domainFromObjective(lines[objectiveIdx], examKey)
    : (examKey === 'core1' ? 'Hardware and Network Troubleshooting' : 'Operating Systems')

  return { question, options, answer: answerIndex, explanation, domain }
}

function parseOptions(lines, startIdx, endIdx) {
  const options = []
  let current = null

  for (let i = startIdx; i < endIdx; i++) {
    const line = lines[i].trim()
    const m = line.match(/^❍\s+([A-Z])\.\s+(.+)/)
    if (m) {
      if (current !== null) options.push(current.trim())
      current = m[2]
    } else if (current !== null && line && !/^The Answer/.test(line)) {
      current += ' ' + line
    }
  }
  if (current !== null) options.push(current.trim())
  return options
}

function parseExam(filePath, examKey) {
  const raw = readFileSync(filePath, 'utf8')
  const lines = raw.split('\n').map(l => l.replace(/\f/g, '').trimEnd())

  const allQuestions = []
  let idCounter = 1

  for (const section of SECTIONS[examKey]) {
    const sectionLines = lines.slice(section.detailStart - 1, section.detailEnd - 1)
    const parsed = parseDetailedSection(sectionLines, examKey)

    for (const q of parsed) {
      allQuestions.push({
        id: `${examKey}-${String(idCounter++).padStart(3, '0')}`,
        exam: examKey,
        domain: q.domain,
        question: q.question,
        options: q.options,
        answer: q.answer,
        explanation: q.explanation,
      })
    }
  }

  return allQuestions
}

console.log('Parsing Core 1...')
const core1 = parseExam(join(root, 'pdfs/core1-practice-exams.txt'), 'core1')
console.log(`  Extracted ${core1.length} questions`)

console.log('Parsing Core 2...')
const core2 = parseExam(join(root, 'pdfs/core2-practice-exams.txt'), 'core2')
console.log(`  Extracted ${core2.length} questions`)

const multi1 = core1.filter(q => Array.isArray(q.answer))
const multi2 = core2.filter(q => Array.isArray(q.answer))
console.log(`\nMulti-select: Core 1=${multi1.length}, Core 2=${multi2.length}`)
if (multi1[0]) console.log('Sample multi-select:', JSON.stringify(multi1[0], null, 2))

writeFileSync(join(root, 'src/data/questions/core1.json'), JSON.stringify(core1, null, 2))
writeFileSync(join(root, 'src/data/questions/core2.json'), JSON.stringify(core2, null, 2))
console.log('\nDone!')
