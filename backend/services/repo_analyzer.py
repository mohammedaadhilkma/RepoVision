import os
import shutil
import tempfile
from pathlib import Path

import git

from models.schemas import RepoContext
from utils.file_utils import (
    detect_languages,
    detect_frameworks,
    build_folder_tree,
    read_file_safe,
)


def extract_repo_name(repo_url: str) -> str:
    """Extract repo name from GitHub URL."""
    url = repo_url.rstrip("/")
    parts = url.split("/")
    name = parts[-1]
    if name.endswith(".git"):
        name = name[:-4]
    return name


def clone_repository(repo_url: str, clone_dir: str) -> str:
    """Clone a GitHub repository to a temp directory. Returns the clone path."""
    repo_name = extract_repo_name(repo_url)
    clone_path = os.path.join(clone_dir, repo_name)

    # Remove existing clone if present
    if os.path.exists(clone_path):
        shutil.rmtree(clone_path, ignore_errors=True)

    # Clone with depth=1 for speed
    git.Repo.clone_from(
        repo_url,
        clone_path,
        depth=1,
        no_single_branch=False,
    )

    return clone_path


def read_key_files(repo_path: str) -> dict:
    """Read important configuration/dependency files from the repo."""
    key_files = {
        "readme": ["README.md", "README.rst", "README.txt", "readme.md"],
        "requirements": ["requirements.txt", "requirements-dev.txt", "Pipfile"],
        "package_json": ["package.json"],
        "setup_py": ["setup.py", "setup.cfg", "pyproject.toml"],
        "pom_xml": ["pom.xml"],
        "cargo_toml": ["Cargo.toml"],
        "go_mod": ["go.mod"],
    }

    result = {}
    for key, filenames in key_files.items():
        content = ""
        for filename in filenames:
            filepath = os.path.join(repo_path, filename)
            if os.path.exists(filepath):
                content = read_file_safe(filepath, max_chars=6000)
                break
        result[key] = content

    return result


def analyze_repository(repo_url: str, temp_dir: str) -> RepoContext:
    """
    Main function: clone repo, analyze it, return RepoContext.
    """
    clone_path = clone_repository(repo_url, temp_dir)

    # Detect languages
    languages, primary_language, file_count, total_lines = detect_languages(clone_path)

    # Detect frameworks and databases
    frameworks, databases, dependencies = detect_frameworks(clone_path, languages)

    # Build folder tree
    repo_name = extract_repo_name(repo_url)
    folder_tree = f"📁 {repo_name}/\n" + build_folder_tree(clone_path, max_depth=4)

    # Read key files
    key_files = read_key_files(clone_path)

    return RepoContext(
        repo_name=repo_name,
        repo_url=repo_url,
        readme=key_files.get("readme", ""),
        requirements=key_files.get("requirements", ""),
        package_json=key_files.get("package_json", ""),
        setup_py=key_files.get("setup_py", ""),
        pom_xml=key_files.get("pom_xml", ""),
        cargo_toml=key_files.get("cargo_toml", ""),
        go_mod=key_files.get("go_mod", ""),
        folder_tree=folder_tree,
        languages=languages,
        frameworks=frameworks,
        databases=databases,
        file_count=file_count,
        total_lines=total_lines,
        dependencies=dependencies,
        primary_language=primary_language,
    )
