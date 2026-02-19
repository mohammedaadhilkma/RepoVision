function CircularScore({ score, label, color, size = 80 }) {
    const radius = (size - 10) / 2
    const circumference = 2 * Math.PI * radius
    const strokeDashoffset = circumference - (score / 100) * circumference

    return (
        <div className="flex flex-col items-center gap-2">
            <div className="relative" style={{ width: size, height: size }}>
                <svg width={size} height={size} className="-rotate-90">
                    {/* Background circle */}
                    <circle
                        cx={size / 2}
                        cy={size / 2}
                        r={radius}
                        fill="none"
                        stroke="#21262d"
                        strokeWidth="6"
                    />
                    {/* Progress circle */}
                    <circle
                        cx={size / 2}
                        cy={size / 2}
                        r={radius}
                        fill="none"
                        stroke={color}
                        strokeWidth="6"
                        strokeLinecap="round"
                        strokeDasharray={circumference}
                        strokeDashoffset={strokeDashoffset}
                        style={{ transition: 'stroke-dashoffset 1s ease-out' }}
                    />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-lg font-bold text-white">{score}</span>
                </div>
            </div>
            <span className="text-xs text-gray-400 text-center">{label}</span>
        </div>
    )
}

export default function ScoreSection({ data }) {
    const complexityColor =
        data.complexity_score >= 80 ? '#f78166' :
            data.complexity_score >= 60 ? '#e3b341' :
                data.complexity_score >= 40 ? '#58a6ff' : '#3fb950'

    const qualityColor =
        data.code_quality_score >= 80 ? '#3fb950' :
            data.code_quality_score >= 60 ? '#58a6ff' :
                data.code_quality_score >= 40 ? '#e3b341' : '#f78166'

    return (
        <div className="glass-card neon-border p-6 rounded-xl animate-slide-up">
            <h3 className="section-title">
                <span className="text-2xl">📈</span>
                Repository Scores
            </h3>

            <div className="flex flex-wrap gap-8 justify-around">
                <div className="text-center">
                    <CircularScore
                        score={data.complexity_score}
                        label={`Complexity · ${data.complexity_label}`}
                        color={complexityColor}
                    />
                </div>

                <div className="text-center">
                    <CircularScore
                        score={data.code_quality_score}
                        label="Code Quality"
                        color={qualityColor}
                    />
                </div>

                {/* Stats */}
                <div className="flex flex-col justify-center gap-3 min-w-[180px]">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-cyber-accent/10 border border-cyber-accent/20 flex items-center justify-center text-sm">
                            📄
                        </div>
                        <div>
                            <p className="text-xs text-gray-500">Source Files</p>
                            <p className="text-sm font-semibold text-white font-mono">{data.file_count?.toLocaleString()}</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-cyber-purple/10 border border-cyber-purple/20 flex items-center justify-center text-sm">
                            📝
                        </div>
                        <div>
                            <p className="text-xs text-gray-500">Lines of Code</p>
                            <p className="text-sm font-semibold text-white font-mono">{data.total_lines?.toLocaleString()}</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-cyber-green/10 border border-cyber-green/20 flex items-center justify-center text-sm">
                            💻
                        </div>
                        <div>
                            <p className="text-xs text-gray-500">Primary Language</p>
                            <p className="text-sm font-semibold text-white">{data.primary_language}</p>
                        </div>
                    </div>
                </div>

                {/* Complexity label badge */}
                <div className="flex flex-col items-center justify-center">
                    <div
                        className="px-6 py-3 rounded-xl text-center"
                        style={{
                            backgroundColor: `${complexityColor}15`,
                            border: `1px solid ${complexityColor}30`,
                        }}
                    >
                        <p className="text-xs text-gray-500 mb-1">Complexity Level</p>
                        <p className="text-xl font-bold" style={{ color: complexityColor }}>
                            {data.complexity_label}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    )
}
