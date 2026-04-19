# Hindsight Expert - AI Support Agent with Persistent Memory

HindsightHub is a hackathon project that combines:
- Hindsight Cloud for persistent memory of support interactions
- Groq LLM for fast response generation
- Express backend for orchestration and analytics APIs
- React + Tailwind frontend for chat and dashboard visualization

The system continuously improves by storing interactions, retrieving similar historical cases, and applying successful response patterns.

## Project Structure

```
HackManthan2.0/
	backend/
		config/
			hindsight.js
		models/
			interaction.model.js
		routes/
			support.routes.js
			analytics.routes.js
		services/
			hindsight.service.js
			groq.service.js
			agent.service.js
		package.json
		server.js
	frontend/
		src/
			components/
				ChatInterface.jsx
				MemoryContext.jsx
				Analytics.jsx
			pages/
				Home.jsx
			App.jsx
			main.jsx
			index.css
		package.json
		tailwind.config.js
		postcss.config.js
		vite.config.js
	.env
	.gitignore
	README.md
```

## Core Features

- Persistent support memory via Hindsight context support-agent-v1
- Similar-case retrieval before LLM generation
- Structured learning loop in agent service:
	- receive customer message
	- retrieve similar interactions
	- build contextual system prompt
	- generate response with Groq
	- store interaction back to memory
- Analytics endpoints for interaction quality and learning trend
- Frontend chat UI with:
	- real-time thinking state
	- confidence display
	- retrieved memory context panel
	- analytics dashboard charts

## Tech Stack

- Node.js 18+
- Express.js
- React 18+
- Tailwind CSS
- Groq SDK
- Zod validation
- Recharts (analytics chart)

## Environment Variables

Use the root .env file and set real keys:

```
HINDSIGHT_API_KEY=
HINDSIGHT_INSTANCE_ID=
GROQ_API_KEY=
GROQ_MODEL=mixtral-8x7b-32768
AGENT_PROVIDER=groq
OPENCLAW_BASE_URL=http://localhost:3001
OPENCLAW_CHAT_ENDPOINT=/v1/chat/completions
OPENCLAW_API_KEY=
OPENCLAW_MODEL=openclaw
PORT=3000
NODE_ENV=development
VITE_API_URL=http://localhost:3000
CORS_ORIGIN=*
```

Notes:
- If Hindsight keys are missing, backend runs in fallback no-op memory mode.
- If GROQ_API_KEY is missing, agent returns safe fallback responses.
- Set AGENT_PROVIDER=openclaw to route generation through OpenClaw.

## Local Setup

Required runtime:
- Node.js 18+ (recommended: Node.js 18 or 20 LTS)

Port overview (no conflicts):
- Backend API: http://localhost:3000
- Frontend Vite app: http://localhost:5173
- Optional OpenClaw gateway (if enabled): http://localhost:3001

### 1) First-time install (from repository root)

#### Generic shell (macOS/Linux/Git Bash)

```bash
cd /path/to/HackManthan2.0
npm install
npm run install:all
```

#### Windows PowerShell

```powershell
cd F:\HackManthan2.0
npm install
npm run install:all
```

### 2) Run frontend + backend together (from repository root)

#### Generic shell

```bash
cd /path/to/HackManthan2.0
npm run dev
```

#### Windows PowerShell

```powershell
cd F:\HackManthan2.0
npm run dev
```

### 3) Run services separately

#### Backend only

Generic shell:
```bash
cd /path/to/HackManthan2.0/backend
npm install
npm run dev
```

Windows PowerShell:
```powershell
cd F:\HackManthan2.0\backend
npm install
npm run dev
```

#### Frontend only

Generic shell:
```bash
cd /path/to/HackManthan2.0/frontend
npm install
npm run dev
```

Windows PowerShell:
```powershell
cd F:\HackManthan2.0\frontend
npm install
npm run dev
```

Health check:
- GET /health (backend)

### 4) Troubleshooting ENOENT (`Could not read package.json`)

If you run `npm run dev` from the repo root and see ENOENT, verify:
1. You are in the project root that contains `package.json`.
2. Root dependencies were installed with `npm install`.
3. Service dependencies were installed with `npm run install:all`.

Then retry:
```bash
npm run dev
```

## API Reference

### Support API

#### POST /api/support

Request body:

```json
{
	"customer_id": "cust_123",
	"message": "How do I reset my password?",
	"conversation_context": [
		{ "role": "user", "content": "I cannot login" }
	]
}
```

Response shape:

```json
{
	"success": true,
	"data": {
		"agent_response": "...",
		"confidence_score": 0.86,
		"similar_past_cases": 3,
		"avg_effectiveness": 0.79,
		"interaction_id": "int_xxx",
		"hindsight_memory_used": {
			"retrieved_cases": [],
			"patterns_applied": ["password_reset"]
		}
	}
}
```

### Analytics API

#### GET /api/analytics/dashboard
Returns:
- total_interactions
- avg_effectiveness
- learning_trend
- top_issues
- effectiveness_by_category

#### GET /api/analytics/interactions
Optional query params:
- customer_id
- issue_type
- query
- limit

#### GET /api/analytics/metrics
Returns detailed metrics including:
- most_effective_solutions
- week_over_week_improvement
- resolution_time_metrics
- customer_satisfaction_trending

## Memory and Learning Flow

1. User asks support question
2. Backend retrieves similar historical interactions from Hindsight
3. Agent builds enhanced prompt with past successful patterns
4. Groq generates contextual response
5. Interaction is validated and stored to memory
6. Analytics aggregates trends and effectiveness over time

## Frontend Experience

- Chat Interface
	- customer id input
	- message timeline with timestamps
	- thinking indicator
	- confidence and similar-case summary
- Memory Context Panel
	- expandable case details
	- applied patterns
	- past case effectiveness
- Analytics Dashboard
	- interaction volume
	- effectiveness trend
	- top issue categories chart
	- best-performing solution previews

## Error Handling and Resilience

- Zod request validation for support payloads
- Message sanitization before processing
- Retry strategy in Hindsight and Groq services
- Rate-limit fallback handling for Groq
- Global Express error middleware with development diagnostics
- Safe fallback responses when external services are unavailable

## Testing Hooks Included

Services export reusable functions for unit testing:
- hindsight.service:
	- storeInteraction
	- retrieve
	- updateEffectiveness
	- listInteractions
- groq.service:
	- generateResponse
- agent.service:
	- handleCustomerInquiry
	- buildSystemPrompt
	- calculateConfidence
	- averageEffectiveness

## Suggested Demo Script (Hackathon)

1. Submit a few support questions through chat
2. Show response metadata and similar case count
3. Repeat a related question to demonstrate memory reuse
4. Open analytics panel and show:
	 - total interactions growth
	 - effectiveness trend
	 - top issue categories

## Roadmap Ideas

- Add authenticated customer sessions
- Add response streaming to frontend
- Add explicit feedback endpoint for real effectiveness updates
- Persist dashboard snapshots for longitudinal demos
- Add automated tests with mocked Hindsight and Groq clients
