# AI Career Identity Finder

A full-stack AI-powered career recommendation app built for VIT ET Hackathon. The application analyzes a user's interests, strengths, work style, and risk tolerance using Google Gemini to extract a psychological identity profile, then matches them against a dynamically-growing career database.

## How It Works

1. User fills a questionnaire (interests, strengths, work style, risk tolerance, subjects)
2. Frontend posts the responses to `POST /api/analyze`
3. Backend extracts an identity profile via Gemini (with multi-model failover)
4. Backend dynamically expands the career database using Gemini-generated profiles
5. Careers are scored and filtered by relevance; top 3 are returned
6. Frontend displays career cards with match %, fit reasoning, and required skills

## Project Structure

```
GenAI/
├── LICENSE
├── README.md
├── requirements.txt          # Python dependencies
├── .gitignore
│
├── backend/                  # FastAPI server
│   ├── main.py               # App entry point, CORS setup
│   ├── routes/
│   │   └── career_routes.py  # API route definitions
│   └── services/
│       ├── analyze_service.py    # Core analysis pipeline (calls model/)
│       ├── analytics_service.py  # Event tracking stub
│       ├── feedback_service.py   # Feedback collection stub
│       └── result_service.py     # Result save/retrieve stub
│
├── model/                    # AI/ML pipeline (importable by backend)
│   ├── __init__.py
│   ├── settings.py           # Env config loader
│   ├── llm_client.py         # Gemini client with multi-model failover
│   ├── extract.py            # LLM-based identity extraction
│   ├── career_data.py        # SQLite CRUD layer
│   ├── career_matcher.py     # Weighted scoring engine
│   ├── main.py               # Orchestration: expand DB, normalize, filter
│   └── .env.example          # Environment variable template
│
└── frontend/                 # React + Vite SPA
    ├── index.html
    ├── package.json
    ├── vite.config.js        # Dev proxy /api → backend
    ├── .env.example
    ├── .gitignore
    └── src/
        ├── App.jsx           # Router: /, /questionnaire, /loading, /results
        ├── main.jsx
        ├── index.css
        ├── App.css
        ├── config.js         # API config and endpoint builders
        ├── components/
        │   ├── Landing.jsx
        │   ├── Questionnaire.jsx
        │   ├── Loading.jsx   # Calls /api/analyze, enforces min 2s
        │   ├── Results.jsx   # Career cards with match %, fit, skills
        │   ├── FeedbackModal.jsx
        │   ├── HealthCheck.jsx
        │   └── *.css
        ├── constants/
        │   └── appConstants.js   # All UI text and option lists
        ├── hooks/
        │   └── useApi.js         # Custom hooks for API calls
        └── services/
            └── api.js            # Axios layer with retry and URL failover
```

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 18, React Router v6, Axios, Vite 5 |
| Backend | Python, FastAPI, Uvicorn |
| AI / LLM | Google Gemini API (`gemini-2.5-flash`, `gemini-2.5-flash-lite`) |
| Database | SQLite (Python built-in `sqlite3`) |
| Styling | Pure CSS with CSS variables, dark theme |

## Getting Started

### Prerequisites

- Python 3.9+
- Node.js 18+
- A Google Gemini API key

### 1. Clone the repo

```bash
git clone https://github.com/your-org/GenAI.git
cd GenAI
```

### 2. Configure the model environment

```bash
cp model/.env.example model/.env
```

Edit `model/.env` and set your Gemini API key:

```env
GEMINI_API_KEY=your_gemini_api_key_here
GEMINI_MODEL=models/gemini-2.5-flash
GEMINI_MODELS=models/gemini-2.5-flash,models/gemini-2.5-flash-lite
ENABLE_DYNAMIC_CAREER_EXPANSION=true
MIN_RELEVANCE_SCORE=55
CAREER_DB_PATH=career_db.db
```

### 3. Start the backend

```bash
# Create and activate a virtual environment (recommended)
python -m venv .venv
source .venv/bin/activate        # Windows: .venv\Scripts\activate

pip install -r requirements.txt

cd backend
uvicorn main:app --reload
```

Backend runs at `http://127.0.0.1:8000`

### 4. Start the frontend

```bash
cd frontend
npm install
npm run dev
```

Frontend runs at `http://localhost:3000`

The Vite dev server automatically proxies `/api/*` to the backend, so no additional configuration is needed for local development.

## API Endpoints

| Method | Path | Description |
|---|---|---|
| `GET` | `/api/health` | Health check |
| `POST` | `/api/analyze` | Run the full analysis pipeline |
| `POST` | `/api/results/save` | Save a result set |
| `GET` | `/api/results/{result_id}` | Retrieve a saved result |
| `POST` | `/api/feedback` | Submit user feedback |
| `POST` | `/api/analytics/track` | Track an analytics event |

### `POST /api/analyze` — Request body

```json
{
  "interests": ["Technology", "Science"],
  "strengths": ["Analytical Thinking", "Problem Solving"],
  "workStyle": "Collaborative",
  "riskTolerance": "Moderate",
  "subjectsLiked": ["Mathematics", "Computer Science"]
}
```

### `POST /api/analyze` — Response body

```json
{
  "identity": {
    "interest_domains": ["technology", "science"],
    "cognitive_style": "analytical",
    "motivation_drivers": ["problem_solving"],
    "work_preferences": ["collaborative"],
    "learning_style": "structured",
    "confidence_score": 0.85
  },
  "careers": [
    {
      "title": "Backend Engineer",
      "match_percentage": 87,
      "why_it_fits": "...",
      "required_skills": ["Python", "System Design", "APIs"]
    }
  ]
}
```

## Frontend Pages

| Route | Component | Description |
|---|---|---|
| `/` | `Landing` | Welcome screen |
| `/questionnaire` | `Questionnaire` | Multi-section interest form |
| `/loading` | `Loading` | Calls API, shows animated loader |
| `/results` | `Results` | Career match cards |

## Environment Variables

### `model/.env`

| Variable | Default | Description |
|---|---|---|
| `GEMINI_API_KEY` | *(required)* | Google Gemini API key |
| `GEMINI_MODEL` | `models/gemini-2.5-flash` | Primary model |
| `GEMINI_MODELS` | `models/gemini-2.5-flash,...` | Comma-separated failover list |
| `ENABLE_DYNAMIC_CAREER_EXPANSION` | `true` | Generate new career profiles via LLM |
| `MIN_RELEVANCE_SCORE` | `55` | Minimum match score (0–100) to include in results |
| `CAREER_DB_PATH` | `career_db.db` | Path to SQLite database (relative to `model/`) |

### `frontend/.env` (optional)

| Variable | Description |
|---|---|
| `VITE_API_BASE_URL` | Override backend URL (default: uses Vite proxy) |
| `VITE_DEV_PROXY_TARGET` | Proxy target in dev (default: `http://127.0.0.1:8000`) |
| `VITE_API_TIMEOUT` | Request timeout in ms (default: `30000`) |

Copy `frontend/.env.example` to `frontend/.env` to customize.

## Career Scoring

The career scoring engine (`model/career_matcher.py`) uses a weighted formula:

| Dimension | Weight |
|---|---|
| Interest match | 35% |
| Cognitive style match | 30% |
| Motivation match | 20% |
| Work style match | 15% |

Careers below `MIN_RELEVANCE_SCORE` are filtered out. The top 3 from the remaining list are returned to the frontend.

## License

MIT — see [LICENSE](LICENSE)
