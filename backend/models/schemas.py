from pydantic import BaseModel
from typing import List, Optional, Dict, Any


class AnalyzeRequest(BaseModel):
    repo_url: str


class DiagramSet(BaseModel):
    architecture: str
    component: str
    flow: str


class AnalyzeResponse(BaseModel):
    repo_name: str
    repo_url: str
    summary: str
    features: List[str]
    languages: List[str]
    frameworks: List[str]
    databases: List[str]
    architecture_type: str
    architecture_explanation: str
    mermaid_diagrams: DiagramSet
    folder_tree: str
    dependencies: Dict[str, List[str]]
    improvements_suggestion: List[str]
    security_risks: List[str]
    complexity_score: int
    complexity_label: str
    code_quality_score: int
    file_count: int
    total_lines: int
    primary_language: str


class RepoContext(BaseModel):
    repo_name: str
    repo_url: str
    readme: str
    requirements: str
    package_json: str
    setup_py: str
    pom_xml: str
    cargo_toml: str
    go_mod: str
    folder_tree: str
    languages: List[str]
    frameworks: List[str]
    databases: List[str]
    file_count: int
    total_lines: int
    dependencies: Dict[str, List[str]]
    primary_language: str
