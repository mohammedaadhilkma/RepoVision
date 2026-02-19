export default function ImprovementsSection({ data }) {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 animate-slide-up">
            {/* Improvements */}
            <div className="glass-card neon-border p-6 rounded-xl">
                <h3 className="section-title">
                    <span className="text-2xl">💡</span>
                    AI Improvement Suggestions
                </h3>
                {data.improvements_suggestion?.length > 0 ? (
                    <ul className="space-y-3">
                        {data.improvements_suggestion.map((item, i) => (
                            <li key={i} className="flex items-start gap-3">
                                <span
                                    className="flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold mt-0.5"
                                    style={{
                                        background: 'rgba(88, 166, 255, 0.15)',
                                        border: '1px solid rgba(88, 166, 255, 0.3)',
                                        color: '#58a6ff',
                                    }}
                                >
                                    {i + 1}
                                </span>
                                <p className="text-gray-300 text-sm leading-relaxed">{item}</p>
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p className="text-gray-600 text-sm">No suggestions available.</p>
                )}
            </div>

            {/* Security Risks */}
            <div className="glass-card neon-border p-6 rounded-xl">
                <h3 className="section-title">
                    <span className="text-2xl">🛡️</span>
                    Security Analysis
                </h3>
                {data.security_risks?.length > 0 ? (
                    <ul className="space-y-3">
                        {data.security_risks.map((risk, i) => {
                            const isLow = risk.toLowerCase().includes('no major') || risk.toLowerCase().includes('no significant')
                            return (
                                <li key={i} className="flex items-start gap-3">
                                    <span className={`flex-shrink-0 mt-0.5 ${isLow ? 'text-green-400' : 'text-yellow-400'}`}>
                                        {isLow ? '✅' : '⚠️'}
                                    </span>
                                    <p className={`text-sm leading-relaxed ${isLow ? 'text-gray-400' : 'text-gray-300'}`}>
                                        {risk}
                                    </p>
                                </li>
                            )
                        })}
                    </ul>
                ) : (
                    <div className="flex items-center gap-2 text-green-400 text-sm">
                        <span>✅</span>
                        <span>No major security risks detected</span>
                    </div>
                )}

                {/* Security tip */}
                <div className="mt-4 pt-4 border-t border-cyber-border">
                    <p className="text-xs text-gray-600">
                        💡 This is a basic static analysis. For production use, run dedicated security scanners like Snyk, Bandit, or npm audit.
                    </p>
                </div>
            </div>
        </div>
    )
}
