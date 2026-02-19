import { useState } from 'react'

export default function FolderTree({ folderTree }) {
    const [expanded, setExpanded] = useState(true)
    const [copied, setCopied] = useState(false)

    const handleCopy = () => {
        navigator.clipboard.writeText(folderTree || '')
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
    }

    const lines = (folderTree || '').split('\n')

    return (
        <div className="glass-card neon-border p-6 rounded-xl animate-slide-up">
            <div className="flex items-center justify-between mb-4">
                <h3 className="section-title mb-0">
                    <span className="text-2xl">📁</span>
                    Folder Structure
                    <span className="text-xs text-gray-600 font-normal ml-2">({lines.length} entries)</span>
                </h3>
                <div className="flex gap-2">
                    <button
                        onClick={handleCopy}
                        className="text-xs text-gray-500 hover:text-gray-300 px-3 py-1.5 rounded-lg bg-cyber-surface border border-cyber-border transition-all duration-200 flex items-center gap-1.5"
                    >
                        {copied ? (
                            <><span>✓</span> Copied!</>
                        ) : (
                            <><span>📋</span> Copy</>
                        )}
                    </button>
                    <button
                        onClick={() => setExpanded(!expanded)}
                        className="text-xs text-gray-500 hover:text-gray-300 px-3 py-1.5 rounded-lg bg-cyber-surface border border-cyber-border transition-all duration-200"
                    >
                        {expanded ? '▲ Collapse' : '▼ Expand'}
                    </button>
                </div>
            </div>

            {expanded && (
                <div className="bg-cyber-surface rounded-xl p-4 overflow-x-auto max-h-96 overflow-y-auto">
                    <div className="folder-tree">
                        {lines.map((line, i) => {
                            const isDir = line.includes('📁')
                            const isFile = line.includes('📄')
                            return (
                                <div
                                    key={i}
                                    className={`leading-6 ${isDir ? 'text-cyber-accent' : isFile ? 'text-gray-400' : 'text-gray-300'
                                        }`}
                                >
                                    {line}
                                </div>
                            )
                        })}
                    </div>
                </div>
            )}
        </div>
    )
}
