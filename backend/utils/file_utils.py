import os
from pathlib import Path
from typing import List, Dict, Tuple

# Language detection by extension
EXTENSION_MAP: Dict[str, str] = {
    ".py": "Python",
    ".js": "JavaScript",
    ".jsx": "JavaScript",
    ".ts": "TypeScript",
    ".tsx": "TypeScript",
    ".java": "Java",
    ".kt": "Kotlin",
    ".go": "Go",
    ".rs": "Rust",
    ".cpp": "C++",
    ".c": "C",
    ".cs": "C#",
    ".rb": "Ruby",
    ".php": "PHP",
    ".swift": "Swift",
    ".scala": "Scala",
    ".r": "R",
    ".dart": "Dart",
    ".lua": "Lua",
    ".sh": "Shell",
    ".bash": "Shell",
    ".html": "HTML",
    ".css": "CSS",
    ".scss": "SCSS",
    ".sass": "SASS",
    ".sql": "SQL",
    ".json": "JSON",
    ".yaml": "YAML",
    ".yml": "YAML",
    ".toml": "TOML",
    ".xml": "XML",
    ".md": "Markdown",
}

# Directories to skip
SKIP_DIRS = {
    ".git", "node_modules", "__pycache__", ".venv", "venv", "env",
    ".env", "dist", "build", "target", ".idea", ".vscode", "coverage",
    ".pytest_cache", ".mypy_cache", "eggs", ".eggs", "*.egg-info",
    ".tox", "htmlcov", ".cache", "vendor",
}

# Files to skip
SKIP_FILES = {
    ".gitignore", ".gitattributes", ".DS_Store", "Thumbs.db",
    "package-lock.json", "yarn.lock", "poetry.lock", "Pipfile.lock",
}


def read_file_safe(path: str, max_chars: int = 8000) -> str:
    """Safely read a file with encoding fallback."""
    for encoding in ["utf-8", "latin-1", "cp1252"]:
        try:
            with open(path, "r", encoding=encoding) as f:
                content = f.read(max_chars)
                return content
        except (UnicodeDecodeError, PermissionError):
            continue
    return ""


def detect_languages(repo_path: str) -> Tuple[List[str], str, int, int]:
    """
    Detect programming languages used in the repo.
    Returns: (languages_list, primary_language, file_count, total_lines)
    """
    lang_counts: Dict[str, int] = {}
    file_count = 0
    total_lines = 0

    for root, dirs, files in os.walk(repo_path):
        # Skip unwanted directories
        dirs[:] = [d for d in dirs if d not in SKIP_DIRS and not d.startswith(".")]

        for filename in files:
            if filename in SKIP_FILES:
                continue

            ext = Path(filename).suffix.lower()
            lang = EXTENSION_MAP.get(ext)

            if lang and lang not in ("JSON", "YAML", "TOML", "XML", "Markdown"):
                lang_counts[lang] = lang_counts.get(lang, 0) + 1
                file_count += 1

                # Count lines
                filepath = os.path.join(root, filename)
                try:
                    content = read_file_safe(filepath, max_chars=100000)
                    total_lines += content.count("\n")
                except Exception:
                    pass

    if not lang_counts:
        return ["Unknown"], "Unknown", file_count, total_lines

    sorted_langs = sorted(lang_counts.items(), key=lambda x: x[1], reverse=True)
    languages = [lang for lang, _ in sorted_langs]
    primary_language = languages[0] if languages else "Unknown"

    return languages, primary_language, file_count, total_lines


def detect_frameworks(repo_path: str, languages: List[str]) -> Tuple[List[str], List[str], Dict[str, List[str]]]:
    """
    Detect frameworks and databases from dependency files.
    Returns: (frameworks, databases, dependencies_dict)
    """
    frameworks = []
    databases = []
    dependencies: Dict[str, List[str]] = {}

    # Python frameworks
    req_path = os.path.join(repo_path, "requirements.txt")
    if os.path.exists(req_path):
        content = read_file_safe(req_path).lower()
        py_deps = [line.strip().split("==")[0].split(">=")[0].split("<=")[0]
                   for line in content.splitlines() if line.strip() and not line.startswith("#")]
        dependencies["python"] = py_deps[:30]

        fw_map = {
            "django": "Django", "flask": "Flask", "fastapi": "FastAPI",
            "tornado": "Tornado", "aiohttp": "aiohttp", "starlette": "Starlette",
            "celery": "Celery", "sqlalchemy": "SQLAlchemy", "alembic": "Alembic",
            "pytest": "pytest", "numpy": "NumPy", "pandas": "Pandas",
            "tensorflow": "TensorFlow", "torch": "PyTorch", "sklearn": "scikit-learn",
            "transformers": "HuggingFace Transformers", "langchain": "LangChain",
            "pydantic": "Pydantic", "uvicorn": "Uvicorn",
        }
        db_map = {
            "psycopg2": "PostgreSQL", "pymysql": "MySQL", "pymongo": "MongoDB",
            "redis": "Redis", "elasticsearch": "Elasticsearch",
            "cassandra": "Cassandra", "sqlite": "SQLite",
        }
        for key, name in fw_map.items():
            if key in content:
                frameworks.append(name)
        for key, name in db_map.items():
            if key in content:
                databases.append(name)

    # JavaScript/Node frameworks
    pkg_path = os.path.join(repo_path, "package.json")
    if os.path.exists(pkg_path):
        import json
        try:
            pkg = json.loads(read_file_safe(pkg_path))
            all_deps = {}
            all_deps.update(pkg.get("dependencies", {}))
            all_deps.update(pkg.get("devDependencies", {}))
            js_deps = list(all_deps.keys())[:30]
            dependencies["javascript"] = js_deps

            fw_map = {
                "react": "React", "vue": "Vue.js", "angular": "@angular/core",
                "next": "Next.js", "nuxt": "Nuxt.js", "svelte": "Svelte",
                "express": "Express.js", "fastify": "Fastify", "koa": "Koa",
                "nest": "NestJS", "gatsby": "Gatsby", "remix": "Remix",
                "vite": "Vite", "webpack": "Webpack", "electron": "Electron",
                "tailwindcss": "TailwindCSS", "axios": "Axios",
                "redux": "Redux", "zustand": "Zustand", "graphql": "GraphQL",
            }
            db_map = {
                "mongoose": "MongoDB", "pg": "PostgreSQL", "mysql2": "MySQL",
                "redis": "Redis", "sequelize": "Sequelize", "prisma": "Prisma",
                "typeorm": "TypeORM",
            }
            for key, name in fw_map.items():
                if any(key in dep.lower() for dep in js_deps):
                    frameworks.append(name)
            for key, name in db_map.items():
                if any(key in dep.lower() for dep in js_deps):
                    databases.append(name)
        except Exception:
            pass

    # Java/Maven
    pom_path = os.path.join(repo_path, "pom.xml")
    if os.path.exists(pom_path):
        content = read_file_safe(pom_path).lower()
        if "spring-boot" in content or "springframework" in content:
            frameworks.append("Spring Boot")
        if "hibernate" in content:
            frameworks.append("Hibernate")
        if "junit" in content:
            frameworks.append("JUnit")

    # Go
    go_mod_path = os.path.join(repo_path, "go.mod")
    if os.path.exists(go_mod_path):
        content = read_file_safe(go_mod_path).lower()
        if "gin-gonic" in content:
            frameworks.append("Gin")
        if "echo" in content:
            frameworks.append("Echo")
        if "fiber" in content:
            frameworks.append("Fiber")

    # Rust
    cargo_path = os.path.join(repo_path, "Cargo.toml")
    if os.path.exists(cargo_path):
        content = read_file_safe(cargo_path).lower()
        if "actix" in content:
            frameworks.append("Actix-web")
        if "axum" in content:
            frameworks.append("Axum")
        if "rocket" in content:
            frameworks.append("Rocket")

    # Deduplicate
    frameworks = list(dict.fromkeys(frameworks))
    databases = list(dict.fromkeys(databases))

    return frameworks, databases, dependencies


def build_folder_tree(repo_path: str, max_depth: int = 4, prefix: str = "") -> str:
    """Build an ASCII folder tree."""
    lines = []
    try:
        entries = sorted(os.scandir(repo_path), key=lambda e: (not e.is_dir(), e.name))
    except PermissionError:
        return ""

    entries = [e for e in entries if e.name not in SKIP_DIRS and not e.name.startswith(".")]

    for i, entry in enumerate(entries):
        is_last = i == len(entries) - 1
        connector = "└── " if is_last else "├── "
        icon = "📁 " if entry.is_dir() else "📄 "
        lines.append(f"{prefix}{connector}{icon}{entry.name}")

        if entry.is_dir() and max_depth > 1:
            extension = "    " if is_last else "│   "
            subtree = build_folder_tree(
                entry.path, max_depth=max_depth - 1, prefix=prefix + extension
            )
            if subtree:
                lines.append(subtree)

    return "\n".join(lines)


def calculate_complexity_score(file_count: int, total_lines: int, languages: List[str]) -> Tuple[int, str]:
    """
    Calculate a complexity score (1-100) and label.
    """
    score = 0

    # File count contribution (0-30)
    if file_count < 10:
        score += 5
    elif file_count < 50:
        score += 15
    elif file_count < 200:
        score += 22
    else:
        score += 30

    # Lines of code contribution (0-40)
    if total_lines < 500:
        score += 5
    elif total_lines < 2000:
        score += 15
    elif total_lines < 10000:
        score += 28
    elif total_lines < 50000:
        score += 35
    else:
        score += 40

    # Language diversity (0-20)
    lang_score = min(len(languages) * 4, 20)
    score += lang_score

    # Cap at 100
    score = min(score, 100)

    if score < 20:
        label = "Beginner"
    elif score < 40:
        label = "Simple"
    elif score < 60:
        label = "Moderate"
    elif score < 80:
        label = "Complex"
    else:
        label = "Enterprise"

    return score, label


def calculate_code_quality(repo_path: str, languages: List[str]) -> int:
    """Estimate code quality score (0-100) based on heuristics."""
    score = 50  # baseline

    # Has README?
    if os.path.exists(os.path.join(repo_path, "README.md")):
        score += 10

    # Has tests?
    for root, dirs, files in os.walk(repo_path):
        dirs[:] = [d for d in dirs if d not in SKIP_DIRS]
        for f in files:
            if "test" in f.lower() or "spec" in f.lower():
                score += 15
                break
        else:
            continue
        break

    # Has CI config?
    ci_files = [".github", ".travis.yml", "Jenkinsfile", ".circleci", ".gitlab-ci.yml"]
    for ci in ci_files:
        if os.path.exists(os.path.join(repo_path, ci)):
            score += 10
            break

    # Has linting config?
    lint_files = [".eslintrc", ".pylintrc", ".flake8", "pyproject.toml", ".prettierrc"]
    for lf in lint_files:
        if os.path.exists(os.path.join(repo_path, lf)):
            score += 5
            break

    # Has Docker?
    if os.path.exists(os.path.join(repo_path, "Dockerfile")):
        score += 5

    # Has docs folder?
    if os.path.exists(os.path.join(repo_path, "docs")):
        score += 5

    return min(score, 100)
