# CLAUDE.md — CompTIA A+ Quiz App

## Project Overview
A responsive React quiz app for practicing the CompTIA A+ exam (220-1101 Core 1 and 220-1102 Core 2). Content is sourced from 4 PDFs and stored as structured JSON. Works on mobile, tablet, and desktop.

## Tech Stack
- **Framework**: Vite + React + TypeScript
- **Styling**: Tailwind CSS (mobile-first, responsive)
- **Routing**: React Router v6
- **State**: React hooks (no external state lib unless complexity warrants it)
- **Data**: Static JSON files in `src/data/questions/`

## Project Structure
```
src/
  components/     # Reusable UI components
  pages/          # Route-level page components
  data/
    questions/    # JSON question banks by domain/exam
  hooks/          # Custom React hooks
  types/          # TypeScript interfaces and types
  utils/          # Pure helper functions (scoring, shuffling, filtering)
```

## Coding Rules

### General
- TypeScript everywhere — no `any`, use proper interfaces
- Functional components only, no class components
- Keep components small and single-purpose
- No inline styles — use Tailwind classes only
- Mobile-first: design for small screens, scale up

### Data
- Questions live in `src/data/questions/` as JSON files
- Never hardcode question content in components
- Each question must conform to the `Question` TypeScript interface
- Questions are organized by exam (core1, core2) and optionally by domain

### State & Logic
- Quiz session state (current question, score, answers) managed in a custom hook `useQuiz`
- No prop drilling more than 2 levels deep — lift state or use context
- Shuffle questions and answers client-side using a seeded or Math.random approach

### Styling & Responsiveness
- Tailwind breakpoints: `sm` (640px), `md` (768px), `lg` (1024px)
- Touch targets minimum 44px for mobile usability
- Test layout at 375px (phone), 768px (tablet), 1280px (desktop)

### What to Avoid
- Don't add a backend or database — this is a static app
- Don't add authentication — no login required
- Don't add external API calls — all content is local
- Don't over-engineer: no Redux, no Zustand unless clearly needed
- Don't add animations unless they aid comprehension
- No comments explaining what code does — only add comments for non-obvious WHY

## Question JSON Schema
```ts
interface Question {
  id: string;           // e.g. "core1-001"
  exam: "core1" | "core2";
  domain: string;       // e.g. "Networking", "Security"
  question: string;
  options: string[];    // 4 options, order can be shuffled
  answer: number;       // index into options[] of correct answer
  explanation?: string; // optional rationale shown after answering
}
```

## PDF Source Material
The 4 PDFs are the authoritative source for question content. When adding questions:
1. Parse or transcribe question text faithfully
2. Preserve domain/objective labels from the PDFs
3. Assign exam (core1 or core2) based on which PDF it came from
4. Keep `answer` as the 0-based index into the original `options` array

## Commands
```bash
npm run dev       # Start dev server
npm run build     # Production build
npm run preview   # Preview production build
npm run typecheck # Run tsc --noEmit
```
