# CompTIA A+ Quiz App

## What This Is
A self-contained, offline-ready React web app for studying and self-testing for the CompTIA A+ certification. No login, no server, no subscriptions — just open it and quiz yourself. Works on your phone, tablet, or PC from any modern browser.

## Exam Coverage
The app covers both A+ exams:

| Exam | Code | Domains |
|------|------|---------|
| Core 1 | 220-1101 | Mobile Devices, Networking, Hardware, Virtualization & Cloud, Hardware & Network Troubleshooting |
| Core 2 | 220-1102 | Operating Systems, Security, Software Troubleshooting, Operational Procedures |

Content is sourced from 4 PDFs and stored as structured JSON question banks.

## Features (Planned)

### Core
- [x] Multiple-choice questions with 4 options
- [x] Immediate feedback after each answer (correct/incorrect + explanation)
- [x] Score tracking per session
- [x] End-of-quiz summary (score, time taken, missed questions)

### Study Modes
- **Quick Quiz** — 10 random questions from any exam/domain
- **Full Exam Sim** — timed, 90-question mock exam (Core 1 or Core 2)
- **Domain Focus** — filter questions by a specific domain (e.g. Networking only)
- **Missed Questions** — re-quiz only questions answered incorrectly in prior sessions (stored in localStorage)

### UX
- Responsive layout — single column on mobile, wider card layout on tablet/desktop
- Progress bar showing current question / total
- Option to show/hide explanations
- Dark mode support (via Tailwind `dark:` classes)

## Project Structure

```
comptia-aplus-quiz/
├── public/
│   └── favicon.ico
├── src/
│   ├── components/
│   │   ├── QuestionCard.tsx     # Renders a single question + options
│   │   ├── ProgressBar.tsx      # Visual progress through quiz
│   │   ├── ResultsSummary.tsx   # End-of-quiz score screen
│   │   ├── ModeSelector.tsx     # Choose quiz mode/domain on home screen
│   │   └── ExplanationBox.tsx   # Shows rationale after answering
│   ├── pages/
│   │   ├── Home.tsx             # Mode selection / landing
│   │   ├── Quiz.tsx             # Active quiz session
│   │   └── Results.tsx          # Post-quiz summary
│   ├── hooks/
│   │   └── useQuiz.ts           # All quiz session logic and state
│   ├── data/
│   │   └── questions/
│   │       ├── core1.json       # Questions from Core 1 PDFs
│   │       └── core2.json       # Questions from Core 2 PDFs
│   ├── types/
│   │   └── index.ts             # Question, QuizSession, QuizMode types
│   ├── utils/
│   │   ├── shuffle.ts           # Fisher-Yates shuffle for questions/options
│   │   └── scoring.ts           # Score calculation helpers
│   ├── App.tsx
│   └── main.tsx
├── CLAUDE.md
├── PROJECT.md
├── package.json
├── tailwind.config.ts
├── tsconfig.json
└── vite.config.ts
```

## Data Flow

```
PDFs → JSON question banks → useQuiz hook → QuestionCard component
                                          ↓
                                    localStorage (missed Qs, history)
```

1. Questions are loaded from JSON at app start
2. `useQuiz` filters/shuffles based on selected mode and domain
3. `QuizPage` renders one question at a time via `QuestionCard`
4. On answer, feedback is shown immediately; state updates score
5. On finish, `ResultsPage` shows summary and persists missed questions

## Responsive Breakpoints

| Device | Width | Layout |
|--------|-------|--------|
| Phone | < 640px | Single column, full-width cards |
| Tablet | 640–1024px | Centered card, max-width 600px |
| Desktop | > 1024px | Centered card, max-width 720px, larger text |

## Getting Started

```bash
npm install
npm run dev
```

Then open `http://localhost:5173` in your browser.

## Adding Questions from PDFs
1. Open the relevant PDF
2. Transcribe or parse questions into the schema in `CLAUDE.md`
3. Append to `src/data/questions/core1.json` or `core2.json`
4. Assign the correct `domain` field based on the exam objective

Questions do not need to be in any particular order — the app shuffles them at runtime.
