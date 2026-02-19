import { useState } from 'react'

const EXAMPLE_REPOS = [
    'https://github.com/tiangolo/fastapi',
    'https://github.com/facebook/react',
    'https://github.com/django/django',
    'https://github.com/expressjs/express',
]

export default function InputSection({ repoUrl, setRepoUrl, onAnalyze, loading }) {
    const [focused, setFocused] = useState(false)

    const isValidGithubUrl = (url) => {
        return url.startsWith('https://github.com/') || url.startsWith('http://github.com/')
    }

    const handleKeyDown = (e) => {
        if (e.key === 'Enter' && !loading && isValidGithubUrl(repoUrl)) {
            onAnalyze()
        }
    }

    return (
        <div className="max-w-4xl mx-auto animate-slide-up">
            <div className={`glass-card p-6 rounded-2xl transition-all duration-300 ${focused ? 'neon-border' : 'border border-cyber-border'}`}>
                <div className="flex flex-col md:flex-row gap-3">
                    {/* URL Input */}
                    <div className="flex-1 relative">
                        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500">
                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                    d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                            </svg>
                        </div>
                        <input
                            type="url"
                            value={repoUrl}
                            onChange={(e) => setRepoUrl(e.target.value)}
                            onFocus={() => setFocused(true)}
                            onBlur={() => setFocused(false)}
                            onKeyDown={handleKeyDown}
                            placeholder="https://github.com/username/repository"
                            className="w-full bg-cyber-surface border border-cyber-border rounded-xl pl-12 pr-4 py-4 text-gray-100 placeholder-gray-600 font-mono text-sm focus:outline-none focus:border-cyber-accent transition-all duration-300"
                            disabled={loading}
                        />
                    </div>

                    {/* Analyze Button */}
                    <button
                        onClick={onAnalyze}
                        disabled={loading || !repoUrl.trim() || !isValidGithubUrl(repoUrl)}
                        className="cyber-button text-white whitespace-nowrap flex items-center gap-2 justify-center min-w-[160px]"
                    >
                        {loading ? (
                            <>
                                <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                                </svg>
                                Analyzing...
                            </>
                        ) : (
                            <>
                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                        d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                                </svg>
                                Analyze Repo
                            </>
                        )}
                    </button>
                </div>

                {/* Validation hint */}
                {repoUrl && !isValidGithubUrl(repoUrl) && (
                    <p className="text-red-400 text-xs mt-2 ml-1">
                        ⚠️ Please enter a valid GitHub URL (https://github.com/...)
                    </p>
                )}

                {/* Example repos */}
                <div className="mt-4 flex flex-wrap gap-2 items-center">
                    <span className="text-gray-600 text-xs">Try:</span>
                    {EXAMPLE_REPOS.map((url) => {
                        const name = url.split('/').slice(-2).join('/')
                        return (
                            <button
                                key={url}
                                onClick={() => setRepoUrl(url)}
                                disabled={loading}
                                className="text-xs text-cyber-accent hover:text-blue-300 font-mono bg-cyber-surface px-2 py-1 rounded border border-cyber-border hover:border-cyber-accent transition-all duration-200 disabled:opacity-50"
                            >
                                {name}
                            </button>
                        )
                    })}
                </div>
            </div>
        </div>
    )
}
