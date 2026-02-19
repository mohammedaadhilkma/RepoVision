import { useEffect, useRef, useState } from 'react'
import mermaid from 'mermaid'

mermaid.initialize({
    startOnLoad: false,
    theme: 'dark',
    themeVariables: {
        primaryColor: '#1f6feb',
        primaryTextColor: '#e6edf3',
        primaryBorderColor: '#388bfd',
        lineColor: '#58a6ff',
        secondaryColor: '#161b22',
        tertiaryColor: '#0d1117',
        background: '#0d1117',
        mainBkg: '#161b22',
        nodeBorder: '#388bfd',
        clusterBkg: '#0d1117',
        titleColor: '#e6edf3',
        edgeLabelBackground: '#161b22',
        fontFamily: 'JetBrains Mono, monospace',
    },
    securityLevel: 'loose',
    flowchart: { curve: 'basis', useMaxWidth: true },
    sequence: { useMaxWidth: true },
})

const TABS = [
    { key: 'architecture', label: '🏗️ Architecture', icon: '🏗️' },
    { key: 'component', label: '🧩 Component', icon: '🧩' },
    { key: 'flow', label: '🔄 Flow', icon: '🔄' },
]

function DiagramRenderer({ code, id }) {
    const containerRef = useRef(null)
    const [error, setError] = useState(null)
    const [rendered, setRendered] = useState(false)

    useEffect(() => {
        if (!code || !containerRef.current) return

        setError(null)
        setRendered(false)

        const render = async () => {
            try {
                const { svg } = await mermaid.render(`mermaid-${id}-${Date.now()}`, code)
                if (containerRef.current) {
                    containerRef.current.innerHTML = svg
                    setRendered(true)
                }
            } catch (err) {
                console.error('Mermaid render error:', err)
                setError('Could not render diagram. Showing raw code instead.')
                if (containerRef.current) {
                    containerRef.current.innerHTML = ''
                }
            }
        }

        render()
    }, [code, id])

    if (error) {
        return (
            <div>
                <p className="text-yellow-500 text-xs mb-2">⚠️ {error}</p>
                <pre className="text-xs text-gray-400 font-mono bg-cyber-surface p-4 rounded-lg overflow-x-auto whitespace-pre-wrap">
                    {code}
                </pre>
            </div>
        )
    }

    return (
        <div className="mermaid-container">
            <div
                ref={containerRef}
                className={`flex justify-center transition-opacity duration-300 ${rendered ? 'opacity-100' : 'opacity-0'}`}
            />
            {!rendered && !error && (
                <div className="flex items-center justify-center py-12 text-gray-500 text-sm">
                    <svg className="animate-spin w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                    Rendering diagram...
                </div>
            )}
        </div>
    )
}

export default function MermaidDiagram({ diagrams }) {
    const [activeTab, setActiveTab] = useState('architecture')

    const diagramMap = {
        architecture: diagrams?.architecture,
        component: diagrams?.component,
        flow: diagrams?.flow,
    }

    return (
        <div className="glass-card neon-border p-6 rounded-xl animate-slide-up">
            <h3 className="section-title">
                <span className="text-2xl">📊</span>
                Architecture Diagrams
            </h3>

            {/* Tabs */}
            <div className="flex gap-2 mb-6 border-b border-cyber-border pb-4">
                {TABS.map((tab) => (
                    <button
                        key={tab.key}
                        onClick={() => setActiveTab(tab.key)}
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${activeTab === tab.key
                                ? 'bg-cyber-accent/20 text-cyber-accent border border-cyber-accent/30'
                                : 'text-gray-500 hover:text-gray-300 hover:bg-cyber-surface'
                            }`}
                    >
                        {tab.label}
                    </button>
                ))}
            </div>

            {/* Diagram */}
            <div className="bg-cyber-surface rounded-xl p-4 min-h-[200px]">
                {diagramMap[activeTab] ? (
                    <DiagramRenderer
                        key={activeTab}
                        code={diagramMap[activeTab]}
                        id={activeTab}
                    />
                ) : (
                    <div className="flex items-center justify-center py-12 text-gray-600 text-sm">
                        No diagram available for this view
                    </div>
                )}
            </div>

            {/* Raw code toggle */}
            <details className="mt-4">
                <summary className="text-xs text-gray-600 cursor-pointer hover:text-gray-400 transition-colors">
                    View Mermaid source code
                </summary>
                <pre className="mt-2 text-xs text-gray-500 font-mono bg-cyber-surface p-3 rounded-lg overflow-x-auto whitespace-pre-wrap">
                    {diagramMap[activeTab] || 'No code available'}
                </pre>
            </details>
        </div>
    )
}
