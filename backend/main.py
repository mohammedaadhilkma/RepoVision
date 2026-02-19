import os
import shutil
import tempfile
import sys
from pathlib import Path

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from dotenv import load_dotenv

load_dotenv()

# Add backend directory to path
sys.path.insert(0, str(Path(__file__).parent))

from models.schemas import AnalyzeRequest, AnalyzeResponse, DiagramSet
from services.repo_analyzer import analyze_repository
from services.llm_service import analyze_with_llm
from utils.file_utils import calculate_complexity_score, calculate_code_quality

app = FastAPI(
    title="RepoVision API",
    description="GitHub Repository Explainer AI powered by Ollama",
    version="1.0.0",
)

# CORS configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Config from environment
OLLAMA_BASE_URL = os.getenv("OLLAMA_BASE_URL", "http://localhost:11434")
OLLAMA_MODEL = os.getenv("OLLAMA_MODEL", "mistral")
TEMP_CLONE_DIR = os.getenv("TEMP_CLONE_DIR", "./temp_repos")
MAX_REPO_SIZE_MB = int(os.getenv("MAX_REPO_SIZE_MB", "200"))

# Ensure temp directory exists
os.makedirs(TEMP_CLONE_DIR, exist_ok=True)


@app.get("/health")
async def health_check():
    """Health check endpoint."""
    return {"status": "ok", "model": OLLAMA_MODEL, "ollama_url": OLLAMA_BASE_URL}


@app.post("/analyze", response_model=AnalyzeResponse)
async def analyze_repo(request: AnalyzeRequest):
    """
    Analyze a GitHub repository and return structured AI-generated insights.
    """
    repo_url = request.repo_url.strip()

    # Basic URL validation
    if not repo_url.startswith("https://github.com/") and not repo_url.startswith("http://github.com/"):
        raise HTTPException(
            status_code=400,
            detail="Invalid GitHub URL. Must start with https://github.com/",
        )

    clone_path = None
    try:
        # Step 1: Clone and analyze repository
        print(f"[INFO] Cloning repository: {repo_url}")
        repo_context = analyze_repository(repo_url, TEMP_CLONE_DIR)
        clone_path = os.path.join(TEMP_CLONE_DIR, repo_context.repo_name)

        print(f"[INFO] Repository cloned. Files: {repo_context.file_count}, Lines: {repo_context.total_lines}")

        # Step 2: Analyze with LLM
        print(f"[INFO] Sending to Ollama ({OLLAMA_MODEL})...")
        llm_result = analyze_with_llm(repo_context, model=OLLAMA_MODEL, base_url=OLLAMA_BASE_URL)

        # Step 3: Calculate scores
        complexity_score, complexity_label = calculate_complexity_score(
            repo_context.file_count,
            repo_context.total_lines,
            repo_context.languages,
        )
        code_quality_score = calculate_code_quality(clone_path, repo_context.languages)

        # Step 4: Build response
        response = AnalyzeResponse(
            repo_name=repo_context.repo_name,
            repo_url=repo_url,
            summary=llm_result.get("summary", "No summary available."),
            features=llm_result.get("features", []),
            languages=repo_context.languages,
            frameworks=repo_context.frameworks,
            databases=repo_context.databases,
            architecture_type=llm_result.get("architecture_type", "Unknown"),
            architecture_explanation=llm_result.get("architecture_explanation", ""),
            mermaid_diagrams=DiagramSet(
                architecture=llm_result.get("mermaid_architecture", "graph TD\n    A[App] --> B[Core]"),
                component=llm_result.get("mermaid_component", "graph LR\n    A[Module] --> B[Service]"),
                flow=llm_result.get("mermaid_flow", "sequenceDiagram\n    User->>App: Request\n    App-->>User: Response"),
            ),
            folder_tree=repo_context.folder_tree,
            dependencies=repo_context.dependencies,
            improvements_suggestion=llm_result.get("improvements_suggestion", []),
            security_risks=llm_result.get("security_risks", []),
            complexity_score=complexity_score,
            complexity_label=complexity_label,
            code_quality_score=code_quality_score,
            file_count=repo_context.file_count,
            total_lines=repo_context.total_lines,
            primary_language=repo_context.primary_language,
        )

        print(f"[INFO] Analysis complete for {repo_context.repo_name}")
        return response

    except Exception as e:
        error_msg = str(e)
        print(f"[ERROR] {error_msg}")

        if "Authentication" in error_msg or "not found" in error_msg.lower():
            raise HTTPException(status_code=404, detail="Repository not found or is private.")
        elif "already exists" in error_msg:
            raise HTTPException(status_code=409, detail="Repository clone conflict. Please try again.")
        else:
            raise HTTPException(status_code=500, detail=f"Analysis failed: {error_msg}")

    finally:
        # Cleanup cloned repo
        if clone_path and os.path.exists(clone_path):
            try:
                shutil.rmtree(clone_path, ignore_errors=True)
                print(f"[INFO] Cleaned up: {clone_path}")
            except Exception:
                pass


if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
