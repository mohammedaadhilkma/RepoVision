export default function SummaryCard({ data }) {
    return (
        <div className="glass-card neon-border p-6 rounded-xl animate-slide-up">
            <h3 className="section-title">
                <span className="text-2xl">📋</span>
                Project Summary
            </h3>
            <p className="text-gray-300 leading-relaxed text-base mb-6">{data.summary}</p>

            {/* Architecture explanation */}
            {data.architecture_explanation && (
                <div className="bg-cyber-surface border border-cyber-border rounded-lg p-4 mb-6">
                    <div className="flex items-center gap-2 mb-2">
                        <span className="text-cyber-purple text-sm font-semibold">🏗️ Architecture</span>
                        <span className="tech-badge" style={{ background: 'rgba(188, 140, 255, 0.1)', borderColor: 'rgba(188, 140, 255, 0.2)', color: '#bc8cff' }}>
                            {data.architecture_type}
                        </span>
                    </div>
                    <p className="text-gray-400 text-sm leading-relaxed">{data.architecture_explanation}</p>
                </div>
            )}

            {/* Features */}
            {data.features && data.features.length > 0 && (
                <div>
                    <h4 className="text-sm font-semibold text-gray-400 mb-3 uppercase tracking-wider">Key Features</h4>
                    <ul className="grid grid-cols-1 md:grid-cols-2 gap-2">
                        {data.features.map((feature, i) => (
                            <li key={i} className="flex items-start gap-2 text-sm text-gray-300">
                                <span className="text-cyber-green mt-0.5 flex-shrink-0">▸</span>
                                {feature}
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    )
}
