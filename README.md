# RepoVision – GitHub Repository Explainer AI

<div align="center">

![RepoVision Banner](https://img.shields.io/badge/RepoVision-AI%20Powered-blue?style=for-the-badge&logo=github)
![License](https://img.shields.io/badge/license-MIT-green?style=for-the-badge)
![Python](https://img.shields.io/badge/Python-3.10+-blue?style=for-the-badge&logo=python)
![React](https://img.shields.io/badge/React-18-61DAFB?style=for-the-badge&logo=react)
![Ollama](https://img.shields.io/badge/Ollama-Local%20LLM-orange?style=for-the-badge)

**Analyze any public GitHub repository with local AI. Get instant documentation, architecture diagrams, tech stack analysis, and improvement suggestions — 100% free.**

</div>

---

## 🎯 Features

- 🔍 **Deep Repo Analysis** – Languages, frameworks, databases, dependencies
- 🤖 **AI-Powered Insights** – Powered by Ollama (Mistral/Llama3) running locally
- 📊 **Architecture Diagrams** – 3 Mermaid.js diagrams (Architecture, Component, Flow)
- 📁 **Folder Tree View** – Visual file structure explorer
- 📈 **Complexity Scoring** – Automated complexity & code quality scores
- 🛡️ **Security Analysis** – Basic security risk detection
- 💡 **AI Suggestions** – Improvement recommendations
- 📄 **PDF Export** – Download full analysis as PDF
- ⚡ **Fallback Mode** – Works even without Ollama (rule-based analysis)

---

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────┐
│                   RepoVision                        │
├─────────────────────────────────────────────────────┤
│                                                     │
│   React Frontend (Vite + TailwindCSS)               │
│         │                                           │
│         ▼                                           │
│   FastAPI Backend (Python)                          │
│         │                                           │
│         ├──► GitHub Repo Clone (GitPython)          │
│         │         │                                 │
│         │         ▼                                 │
│         │    Repo Analyzer                          │
│         │    (Languages, Frameworks, Tree)          │
│         │                                           │
│         └──► Ollama Local LLM (Mistral/Llama3)      │
│                   │                                 │
│                   ▼                                 │
│         JSON Response + Mermaid Diagrams            │
│                                                     │
└─────────────────────────────────────────────────────┘
```

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18, Vite, TailwindCSS, Mermaid.js, Axios |
| Backend | Python, FastAPI, Uvicorn |
| AI | Ollama (Mistral / Llama3) |
| Repo Analysis | GitPython |
| PDF Export | jsPDF + html2canvas |
| Deployment | Vercel (frontend) + Render (backend) |

---

## 🚀 Quick Start

### Prerequisites

- Python 3.10+
- Node.js 18+
- Git
- [Ollama](https://ollama.ai) (for AI features)

### 1. Clone the Repository

```bash
git clone https://github.com/yourusername/repovision.git
cd repovision
```

### 2. Set Up Ollama (Free Local AI)

```bash
# Install Ollama from https://ollama.ai
# Then pull a model:
ollama pull mistral
# OR
ollama pull llama3

# Start Ollama server
ollama serve
```

### 3. Start the Backend

```bash
cd backend

# Create virtual environment
python -m venv venv
venv\Scripts\activate        # Windows
# source venv/bin/activate   # Linux/Mac

# Install dependencies
pip install -r requirements.txt

# Copy environment config
copy .env.example .env       # Windows
# cp .env.example .env       # Linux/Mac

# Start the server
uvicorn main:app --reload --port 8000
```

Backend will be available at: `http://localhost:8000`
API docs at: `http://localhost:8000/docs`

### 4. Start the Frontend

```bash
cd frontend

# Install dependencies
npm install

# Start dev server
npm run dev
```

Frontend will be available at: `http://localhost:5173`

---

## ⚙️ Environment Variables

### Backend (`backend/.env`)

| Variable | Default | Description |
|----------|---------|-------------|
| `OLLAMA_BASE_URL` | `http://localhost:11434` | Ollama server URL |
| `OLLAMA_MODEL` | `mistral` | LLM model to use |
| `TEMP_CLONE_DIR` | `./temp_repos` | Temp directory for cloning |
| `MAX_REPO_SIZE_MB` | `200` | Max repo size to analyze |

### Frontend (`frontend/.env`)

| Variable | Default | Description |
|----------|---------|-------------|
| `VITE_API_URL` | `http://localhost:8000` | Backend API URL |

---

## 🌍 Deployment (Free Tier)

### Frontend → Vercel

```bash
cd frontend
npm run build
# Deploy dist/ folder to Vercel
# Set VITE_API_URL to your backend URL
```

### Backend → Render

1. Create a new Web Service on [render.com](https://render.com)
2. Connect your GitHub repo
3. Set build command: `pip install -r requirements.txt`
4. Set start command: `uvicorn main:app --host 0.0.0.0 --port $PORT`
5. Add environment variables from `.env.example`

> **Note**: Ollama cannot run on Render free tier. For cloud deployment, use a VPS with Ollama installed, or the app will automatically use rule-based fallback analysis.

---

## 📁 Project Structure

```
repovision/
├── backend/
│   ├── main.py                    # FastAPI app entry point
│   ├── models/
│   │   └── schemas.py             # Pydantic request/response models
│   ├── services/
│   │   ├── repo_analyzer.py       # GitHub repo cloning & analysis
│   │   └── llm_service.py         # Ollama LLM integration
│   ├── utils/
│   │   └── file_utils.py          # Language detection, tree builder
│   ├── requirements.txt
│   └── .env.example
│
├── frontend/
│   ├── src/
│   │   ├── App.jsx                # Main app component
│   │   ├── main.jsx               # React entry point
│   │   ├── index.css              # Global styles + TailwindCSS
│   │   └── components/
│   │       ├── InputSection.jsx   # URL input + analyze button
│   │       ├── LoadingAnimation.jsx # Step-by-step loading UI
│   │       ├── SummaryCard.jsx    # Project summary display
│   │       ├── TechStackCards.jsx # Languages/frameworks/databases
│   │       ├── MermaidDiagram.jsx # Architecture diagram renderer
│   │       ├── FolderTree.jsx     # File structure viewer
│   │       ├── ScoreSection.jsx   # Complexity & quality scores
│   │       ├── ImprovementsSection.jsx # AI suggestions & security
│   │       └── DownloadPDF.jsx    # PDF export
│   ├── index.html
│   ├── package.json
│   ├── vite.config.js
│   ├── tailwind.config.js
│   └── postcss.config.js
│
└── README.md
```

---

## 🔮 Future Improvements

- [ ] Support private repositories (GitHub token auth)
- [ ] Real-time streaming analysis with WebSockets
- [ ] Compare two repositories side-by-side
- [ ] Export as Markdown documentation
- [ ] GitHub Actions integration
- [ ] Support for GitLab and Bitbucket
- [ ] Caching analyzed repos to avoid re-cloning
- [ ] User accounts and analysis history

---

## 📄 License

MIT License – free to use, modify, and distribute.

---

<div align="center">
Built with ❤️ using FastAPI, React, and Ollama
</div>
#   R e p o V i s i o n  
 #   R e p o V i s i o n  
 