import { useEffect, useState } from 'react'

const STEPS = [
    { icon: '🔗', text: 'Connecting to GitHub...', delay: 0 },
    { icon: '📥', text: 'Cloning repository...', delay: 1500 },
    { icon: '🔍', text: 'Analyzing file structure...', delay: 3000 },
    { icon: '🧠', text: 'Detecting languages & frameworks...', delay: 5000 },
    { icon: '🤖', text: 'Sending to Ollama AI...', delay: 7000 },
    { icon: '⚡', text: 'Generating insights & diagrams...', delay: 12000 },
    { icon: '✨', text: 'Finalizing analysis...', delay: 20000 },
]

export default function LoadingAnimation({ repoUrl }) {
    const [currentStep, setCurrentStep] = useState(0)
    const [dots, setDots] = useState('')

    useEffect(() => {
        const timers = STEPS.map((step, i) =>
            setTimeout(() => setCurrentStep(i), step.delay)
        )
        return () => timers.forEach(clearTimeout)
    }, [])

    useEffect(() => {
        const interval = setInterval(() => {
            setDots(d => d.length >= 3 ? '' : d + '.')
        }, 400)
        return () => clearInterval(interval)
    }, [])

    const repoName = repoUrl?.split('/').slice(-2).join('/') || 'repository'

    return (
        <div className="mt-8 max-w-2xl mx-auto animate-fade-in">
            <div className="glass-card neon-border p-8 rounded-2xl text-center">
                {/* Animated logo */}
                <div className="relative w-24 h-24 mx-auto mb-6">
                    <div className="absolute inset-0 rounded-full border-2 border-cyber-accent/30 animate-ping" />
                    <div className="absolute inset-2 rounded-full border-2 border-cyber-purple/40 animate-ping" style={{ animationDelay: '0.3s' }} />
                    <div className="absolute inset-4 rounded-full border-2 border-cyber-accent/50 animate-spin" style={{ animationDuration: '3s' }} />
                    <div className="absolute inset-0 flex items-center justify-center text-4xl">
                        🔭
                    </div>
                </div>

                <h3 className="text-xl font-bold text-white mb-1">Analyzing Repository</h3>
                <p className="text-cyber-accent font-mono text-sm mb-6">{repoName}</p>

                {/* Progress bar */}
                <div className="w-full bg-cyber-surface rounded-full h-1.5 mb-6 overflow-hidden">
                    <div
                        className="progress-bar h-full rounded-full transition-all duration-1000"
                        style={{ width: `${Math.min(((currentStep + 1) / STEPS.length) * 100, 95)}%` }}
                    />
                </div>

                {/* Steps */}
                <div className="space-y-2 text-left">
                    {STEPS.map((step, i) => (
                        <div
                            key={i}
                            className={`flex items-center gap-3 px-4 py-2 rounded-lg transition-all duration-500 ${i === currentStep
                                    ? 'bg-cyber-accent/10 border border-cyber-accent/20'
                                    : i < currentStep
                                        ? 'opacity-40'
                                        : 'opacity-20'
                                }`}
                        >
                            <span className="text-lg">{step.icon}</span>
                            <span className={`text-sm font-mono ${i === currentStep ? 'text-cyber-accent' : 'text-gray-400'}`}>
                                {step.text}{i === currentStep ? dots : i < currentStep ? ' ✓' : ''}
                            </span>
                        </div>
                    ))}
                </div>

                <p className="text-gray-600 text-xs mt-6 font-mono">
                    Large repos or slow LLMs may take 1-3 minutes
                </p>
            </div>
        </div>
    )
}
