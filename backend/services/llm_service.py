import json
import re
from typing import Optional

import ollama

from models.schemas import RepoContext


SYSTEM_PROMPT = """You are an expert software architect and code analyst. 
Analyze the provided GitHub repository information and return a structured JSON response.
Be concise, accurate, and insightful. Always return valid JSON."""


def build_analysis_prompt(ctx: RepoContext) -> str:
    """Build a structured prompt from the repo context."""
    prompt = f"""Analyze this GitHub repository and return a JSON object with the exact structure shown below.

Repository: {ctx.repo_name}
URL: {ctx.repo_url}
Primary Language: {ctx.primary_language}
Languages Detected: {', '.join(ctx.languages[:8])}
Frameworks Detected: {', '.join(ctx.frameworks[:8]) if ctx.frameworks else 'None detected'}
Databases Detected: {', '.join(ctx.databases[:5]) if ctx.databases else 'None detected'}
File Count: {ctx.file_count}
Total Lines of Code: {ctx.total_lines}

README (first 3000 chars):
{ctx.readme[:3000] if ctx.readme else 'No README found'}

Requirements/Dependencies:
{ctx.requirements[:1500] if ctx.requirements else ''}
{ctx.package_json[:1500] if ctx.package_json else ''}

Folder Structure:
{ctx.folder_tree[:2000]}

Return ONLY this JSON (no markdown, no explanation):
{{
  "summary": "2-3 sentence description of what this project does and its main purpose",
  "features": ["feature 1", "feature 2", "feature 3", "feature 4", "feature 5"],
  "architecture_type": "one of: Monolithic, Microservices, MVC, REST API, CLI Tool, Library/Package, Full-Stack, Data Pipeline, ML/AI Application, Mobile App, Desktop App",
  "architecture_explanation": "2-3 sentences explaining the architecture pattern and how components interact",
  "improvements_suggestion": [
    "Specific improvement suggestion 1",
    "Specific improvement suggestion 2", 
    "Specific improvement suggestion 3",
    "Specific improvement suggestion 4"
  ],
  "security_risks": [
    "Security concern 1 (or 'No major security risks detected' if none)",
    "Security concern 2"
  ],
  "mermaid_architecture": "graph TD\\n    A[Client] --> B[Backend]\\n    B --> C[Database]",
  "mermaid_component": "graph LR\\n    A[Component1] --> B[Component2]",
  "mermaid_flow": "sequenceDiagram\\n    User->>App: Action\\n    App->>DB: Query\\n    DB-->>App: Result\\n    App-->>User: Response"
}}"""
    return prompt


def parse_llm_response(raw: str) -> dict:
    """Extract and parse JSON from LLM response."""
    # Try direct parse first
    try:
        return json.loads(raw.strip())
    except json.JSONDecodeError:
        pass

    # Try extracting JSON block
    json_match = re.search(r'\{[\s\S]*\}', raw)
    if json_match:
        try:
            return json.loads(json_match.group())
        except json.JSONDecodeError:
            pass

    # Return empty dict if parsing fails
    return {}


def generate_fallback_analysis(ctx: RepoContext) -> dict:
    """Rule-based fallback when Ollama is unavailable."""
    # Determine architecture type
    arch_type = "Monolithic"
    if ctx.frameworks:
        fw_lower = [f.lower() for f in ctx.frameworks]
        if any(f in fw_lower for f in ["react", "vue.js", "angular", "next.js"]):
            if any(f in fw_lower for f in ["fastapi", "express.js", "django", "flask"]):
                arch_type = "Full-Stack"
            else:
                arch_type = "Frontend SPA"
        elif any(f in fw_lower for f in ["fastapi", "express.js", "flask", "spring boot"]):
            arch_type = "REST API"
        elif any(f in fw_lower for f in ["tensorflow", "pytorch", "scikit-learn"]):
            arch_type = "ML/AI Application"

    readme_summary = ctx.readme[:300] if ctx.readme else ""
    summary = (
        f"{ctx.repo_name} is a {ctx.primary_language} project"
        + (f" using {', '.join(ctx.frameworks[:3])}" if ctx.frameworks else "")
        + ". "
        + (readme_summary[:200] if readme_summary else "See the repository for more details.")
    )

    # Build basic Mermaid diagrams
    nodes = []
    if "React" in ctx.frameworks or "Vue.js" in ctx.frameworks:
        nodes.append("Frontend[🖥️ Frontend]")
    if any(f in ctx.frameworks for f in ["FastAPI", "Flask", "Django", "Express.js", "Spring Boot"]):
        nodes.append("Backend[⚙️ Backend API]")
    if ctx.databases:
        nodes.append(f"DB[🗄️ {ctx.databases[0]}]")

    if len(nodes) >= 2:
        arch_diagram = "graph TD\n"
        for i in range(len(nodes) - 1):
            arch_diagram += f"    {nodes[i].split('[')[0]} --> {nodes[i+1].split('[')[0]}\n"
        for node in nodes:
            arch_diagram += f"    {node}\n"
    else:
        arch_diagram = f"graph TD\n    A[{ctx.repo_name}] --> B[Core Logic]\n    B --> C[Output]"

    return {
        "summary": summary,
        "features": [
            f"Built with {ctx.primary_language}",
            f"Uses {', '.join(ctx.frameworks[:2]) if ctx.frameworks else 'standard libraries'}",
            f"{ctx.file_count} source files with {ctx.total_lines:,} lines of code",
            "Open source project",
            "See README for full feature list",
        ],
        "architecture_type": arch_type,
        "architecture_explanation": (
            f"This project follows a {arch_type} architecture pattern. "
            f"It is primarily written in {ctx.primary_language}"
            + (f" with {', '.join(ctx.frameworks[:2])} as the main framework(s)" if ctx.frameworks else "")
            + "."
        ),
        "improvements_suggestion": [
            "Add comprehensive unit and integration tests",
            "Implement CI/CD pipeline for automated testing and deployment",
            "Add detailed API documentation (e.g., Swagger/OpenAPI)",
            "Consider adding Docker support for containerized deployment",
        ],
        "security_risks": [
            "Review dependency versions for known CVEs",
            "Ensure sensitive data is not hardcoded in source files",
        ],
        "mermaid_architecture": arch_diagram,
        "mermaid_component": (
            f"graph LR\n"
            f"    A[{ctx.repo_name}] --> B[Core Modules]\n"
            f"    B --> C[Utilities]\n"
            f"    B --> D[Services]\n"
            f"    D --> E[External APIs]"
        ),
        "mermaid_flow": (
            "sequenceDiagram\n"
            "    participant User\n"
            "    participant App\n"
            "    participant Service\n"
            "    User->>App: Request\n"
            "    App->>Service: Process\n"
            "    Service-->>App: Result\n"
            "    App-->>User: Response"
        ),
    }


def analyze_with_llm(ctx: RepoContext, model: str = "mistral", base_url: str = "http://localhost:11434") -> dict:
    """
    Send repo context to Ollama LLM and get structured analysis.
    Falls back to rule-based analysis if Ollama is unavailable.
    """
    try:
        client = ollama.Client(host=base_url)
        prompt = build_analysis_prompt(ctx)

        response = client.chat(
            model=model,
            messages=[
                {"role": "system", "content": SYSTEM_PROMPT},
                {"role": "user", "content": prompt},
            ],
            options={
                "temperature": 0.3,
                "num_predict": 2048,
            },
        )

        raw_content = response["message"]["content"]
        parsed = parse_llm_response(raw_content)

        if parsed and "summary" in parsed:
            return parsed
        else:
            # LLM responded but JSON was malformed, use fallback
            return generate_fallback_analysis(ctx)

    except Exception as e:
        print(f"[LLM] Ollama unavailable ({e}), using rule-based fallback")
        return generate_fallback_analysis(ctx)
