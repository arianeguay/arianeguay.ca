# Project Goal

Build a **Freelance Admin App** for a creative full-stack developer (React + Next.js + Figma + Node) who wants to automate freelance tasks, grow her professional network, and manage clients efficiently.

# Context

User: Ariane, full-stack web developer & designer (7 years exp).
Focus: design systems, automation, AI integration, UX clarity, and personal branding.
Tone: minimalist, aesthetic, feminine-modern (matching arianeguay.ca style).

# Tech stack (suggested)

- Frontend: Next.js + TypeScript + styled-components
- Backend: Node.js (Express or Next API routes)
- Database: Supabase or SQLite (for prototype)
- Auth: Clerk or Supabase Auth
- AI Integration: OpenAI API (GPT-4/5) or Windsurf native AI tools
- Optional: Cron tasks / background jobs for automation (LinkedIn scraping, AI generation)

---

# Features

## 🧩 Dashboard

Central hub showing:

- Summary cards (Active Projects, LinkedIn Posts This Week, Pending Invoices)
- Quick Actions (Generate Post, Create Invoice, New Contract, Comment Suggestions)
- Activity timeline (AI-generated: “what to do next”)

---

## 🌐 LinkedIn Assistant

Purpose: build visibility and maintain a consistent professional presence without social fatigue.

### 1. Post Finder

- User inputs keywords (e.g. “frontend”, “UX”, “freelance”)
- Fetch or scrape public LinkedIn posts matching keywords
- Sort by engagement level (likes/comments)
- Display cleanly in a scrollable list with preview

### 2. AI Comment Generator

- For each LinkedIn post, generate 2–3 comment drafts:
  - Tone options: “Professional”, “Friendly”, “Playful”
  - Include context-awareness (mentions, hashtags, tone)
- Button “Copy to Clipboard” and “Regenerate”

### 3. Post Generator

- Inputs: topic, tone, goal (visibility, value, storytelling)
- Output: 3 post drafts (with emojis, short paragraphs)
- Option to auto-schedule or export to LinkedIn draft format

### 4. Engagement Tracker

- Dashboard view: “Posts commented”, “Interactions gained”, “Engagement score over time”
- Optional integration with Notion or CSV export

---

## 💼 Clients & Projects

Purpose: manage client relationships, documents, and AI-driven productivity.

### 1. Project Manager

- CRUD interface for Projects
  - Name, Client, Deadline, Budget
  - AI-generated “Timeline & Action Cards”:
    - ex: “Phase 1: Discovery – 2 days”, “Phase 2: Design – 4 days”
  - Option to convert to Kanban or calendar view

### 2. AI Contract / Quote Generator

- Inputs: client name, project scope, rate
- Generates:
  - Quote (PDF)
  - Contract (legal tone, in FR/EN)
  - Invoice (with auto-numbering, logo, taxes)
- Export as PDF or send via email

### 3. Client Communication Templates

- Predefined message library (inspired by Ariane’s tone)
  - New Project, Follow-up, Thank You, Feedback Request
- AI personalization per client context

### 4. Finance Overview

- Table of invoices (status, client, due date)
- Graph of monthly income (auto-calculated)
- Optional connection to QuickBooks / Stripe

---

## ⚙️ System & Settings

- Light / Dark mode toggle
- User preferences (tone of voice for AI, hourly rate, default template language)
- API keys storage (LinkedIn, OpenAI, Stripe)
- Optional Notion sync for task mirroring

---

# AI Behavior Guidelines

- Use AI for _assistive_, not intrusive actions.
- Always show drafts before sending or posting.
- Respect Ariane’s neurodivergent context: simple UI, low cognitive load, few interruptions.

---

# UI/UX Style

- Use a **clean, calming dashboard layout**
- Rounded cards, soft shadows, warm gradients (matching #8C0F48 and #F6C2D4 palette)
- Icons: lucide-react
- Fonts: Inter / Manrope
- Layout: sidebar (sections: Dashboard / LinkedIn / Clients / Settings)
- Optional: Figma token integration for theming consistency

---

# Optional Future Extensions

- Email integration (Gmail API) for client communications
- AI Notion sync: send tasks/timelines to Notion board
- “Mood check-in” widget to help manage burnout risk
- Mini “AI mentor” assistant for suggestions and rewrites

---

# Deliverables

Generate a **Next.js app structure** including:

- Pages & routes
- Components & styled theme
- Example data in mock JSON
- API route placeholders for LinkedIn / OpenAI
- Seeded demo (1 client, 2 projects, 3 LinkedIn post samples)

---

# Example Prompt Use

“Generate LinkedIn AI Comment module with tone selector and copy button.”
“Generate Invoice Generator UI + backend for PDF export.”
“Add Dashboard cards with metrics fetched from local DB.”

---

# Goal

A personal admin app that replaces LinkedIn burnout and chaotic freelancing with a calm, AI-assisted workspace where Ariane can thrive.
