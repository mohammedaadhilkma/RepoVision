import { useState, useRef } from 'react'
import axios from 'axios'
import InputSection from './components/InputSection'
import LoadingAnimation from './components/LoadingAnimation'
import SummaryCard from './components/SummaryCard'
import TechStackCards from './components/TechStackCards'
import FolderTree from './components/FolderTree'
import MermaidDiagram from './components/MermaidDiagram'
import ImprovementsSection from './components/ImprovementsSection'
import DownloadPDF from './components/DownloadPDF'
import ScoreSection from './components/ScoreSection'

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:8000'

function App() {
    const [repoUrl, setRepoUrl] = useState('')
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(null)
    const [data, setData] = useState(null)
    const resultsRef = useRef(null)

    const handleAnalyze = async () => {
        if (!repoUrl.trim()) return

        setLoading(true)
        setError(null)
        setData(null)

        try {
            const response = await axios.post(`${API_BASE}/analyze`, {
                repo_url: repoUrl.trim(),
            }, {
                timeout: 300000, // 5 minutes for large repos + LLM
            })
            setData(response.data)
            // Scroll to results
            setTimeout(() => {
                resultsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
            }, 100)
        } catch (err) {
            const msg = err.response?.data?.detail || err.message || 'Analysis failed. Please try again.'
            setError(msg)
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="min-h-screen bg-cyber-bg relative overflow-x-hidden">
            {/* Scan line effect */}
            <div className="scan-line" />

            {/* Background glow orbs */}
            <div className="fixed inset-0 pointer-events-none overflow-hidden">
                <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl" />
                <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl" />
                <div className="absolute top-3/4 left-1/2 w-64 h-64 bg-cyan-500/3 rounded-full blur-3xl" />
            </div>

            <div className="relative z-10 max-w-7xl mx-auto px-4 py-8">
                {/* Header */}
                <header className="text-center mb-12 animate-fade-in">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-cyber-card border border-cyber-border text-xs text-cyber-accent font-mono mb-6">
                        <span className="w-2 h-2 bg-cyber-green rounded-full animate-pulse" />
                        Powered by Ollama · 100% Free & Local
                    </div>

                    <h1 className="text-5xl md:text-7xl font-black mb-4 leading-tight">
                        <span className="gradient-text">RepoVision</span>
                    </h1>
                    <p className="text-xl md:text-2xl text-gray-400 font-light mb-2">
                        GitHub Repository Explainer AI
                    </p>
                    <p className="text-sm text-gray-500 max-w-2xl mx-auto">
                        Analyze any public GitHub repository with local AI. Get instant documentation,
                        architecture diagrams, tech stack analysis, and improvement suggestions.
                    </p>
                </header>

                {/* Input Section */}
                <InputSection
                    repoUrl={repoUrl}
                    setRepoUrl={setRepoUrl}
                    onAnalyze={handleAnalyze}
                    loading={loading}
                />

                {/* Error */}
                {error && (
                    <div className="mt-6 glass-card border border-red-500/30 p-4 rounded-xl animate-fade-in">
                        <div className="flex items-start gap-3">
                            <span className="text-red-400 text-xl">⚠️</span>
                            <div>
                                <p className="text-red-400 font-medium">Analysis Failed</p>
                                <p className="text-gray-400 text-sm mt-1">{error}</p>
                            </div>
                        </div>
                    </div>
                )}

                {/* Loading */}
                {loading && <LoadingAnimation repoUrl={repoUrl} />}

                {/* Results */}
                {data && !loading && (
                    <div ref={resultsRef} className="mt-8 space-y-6 animate-fade-in">
                        {/* Repo header */}
                        <div className="glass-card neon-border p-6 rounded-xl">
                            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                                <div>
                                    <div className="flex items-center gap-3 mb-2">
                                        <span className="text-3xl">📦</span>
                                        <h2 className="text-2xl font-bold text-white">{data.repo_name}</h2>
                                        <span className="tech-badge">{data.architecture_type}</span>
                                    </div>
                                    <a
                                        href={data.repo_url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-cyber-accent text-sm hover:underline font-mono"
                                    >
                                        {data.repo_url}
                                    </a>
                                </div>
                                <DownloadPDF data={data} />
                            </div>
                        </div>

                        {/* Score Section */}
                        <ScoreSection data={data} />

                        {/* Summary */}
                        <SummaryCard data={data} />

                        {/* Tech Stack */}
                        <TechStackCards data={data} />

                        {/* Diagrams */}
                        <MermaidDiagram diagrams={data.mermaid_diagrams} />

                        {/* Folder Tree */}
                        <FolderTree folderTree={data.folder_tree} />

                        {/* Improvements & Security */}
                        <ImprovementsSection data={data} />

                        {/* Footer spacer */}
                        <div className="h-8" />
                    </div>
                )}

                {/* Footer */}
                <footer className="text-center mt-16 pb-8 text-gray-600 text-sm">
                    <p>RepoVision · Designed and developed by KM.Aadhil</p>
                </footer>
            </div>
        </div>
    )
}

export default App
