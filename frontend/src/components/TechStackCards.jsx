const LANG_COLORS = {
    Python: '#3776ab',
    JavaScript: '#f7df1e',
    TypeScript: '#3178c6',
    Java: '#ed8b00',
    Go: '#00add8',
    Rust: '#dea584',
    'C++': '#f34b7d',
    C: '#555555',
    'C#': '#239120',
    Ruby: '#cc342d',
    PHP: '#777bb4',
    Swift: '#fa7343',
    Kotlin: '#7f52ff',
    Scala: '#dc322f',
    HTML: '#e34c26',
    CSS: '#563d7c',
    Shell: '#89e051',
    Dart: '#00b4ab',
    R: '#276dc3',
}

const FW_ICONS = {
    React: '⚛️', 'Vue.js': '💚', Angular: '🔴', 'Next.js': '▲', 'Nuxt.js': '💚',
    Svelte: '🔥', 'Express.js': '🟢', FastAPI: '⚡', Django: '🎸', Flask: '🌶️',
    'Spring Boot': '🍃', TailwindCSS: '🎨', Vite: '⚡', Webpack: '📦',
    Redux: '🔮', GraphQL: '🔷', Prisma: '🔺', Docker: '🐳', Electron: '⚡',
    PyTorch: '🔥', TensorFlow: '🧠', 'scikit-learn': '📊', Pandas: '🐼',
    NumPy: '🔢', LangChain: '🦜', Celery: '🌿', SQLAlchemy: '🗄️',
}

const DB_ICONS = {
    PostgreSQL: '🐘', MySQL: '🐬', MongoDB: '🍃', Redis: '🔴',
    SQLite: '💾', Elasticsearch: '🔍', Cassandra: '👁️',
}

function LanguageBar({ languages }) {
    const total = languages.length
    const colors = languages.map((lang) => LANG_COLORS[lang] || '#58a6ff')

    return (
        <div className="mb-4">
            <div className="flex rounded-full overflow-hidden h-2 mb-2">
                {languages.slice(0, 8).map((lang, i) => (
                    <div
                        key={lang}
                        className="h-full transition-all duration-500"
                        style={{
                            width: `${100 / Math.min(total, 8)}%`,
                            backgroundColor: colors[i],
                        }}
                        title={lang}
                    />
                ))}
            </div>
            <div className="flex flex-wrap gap-2">
                {languages.slice(0, 8).map((lang, i) => (
                    <div key={lang} className="flex items-center gap-1.5 text-xs text-gray-400">
                        <span className="w-2 h-2 rounded-full" style={{ backgroundColor: colors[i] }} />
                        {lang}
                    </div>
                ))}
            </div>
        </div>
    )
}

export default function TechStackCards({ data }) {
    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 animate-slide-up">
            {/* Languages */}
            <div className="glass-card neon-border p-5 rounded-xl">
                <h3 className="section-title text-base">
                    <span>💻</span> Languages
                </h3>
                {data.languages?.length > 0 && <LanguageBar languages={data.languages} />}
                <div className="flex flex-wrap gap-2 mt-2">
                    {data.languages?.map((lang) => (
                        <span
                            key={lang}
                            className="px-2.5 py-1 rounded-full text-xs font-medium"
                            style={{
                                backgroundColor: `${LANG_COLORS[lang] || '#58a6ff'}20`,
                                border: `1px solid ${LANG_COLORS[lang] || '#58a6ff'}40`,
                                color: LANG_COLORS[lang] || '#58a6ff',
                            }}
                        >
                            {lang}
                        </span>
                    ))}
                </div>
            </div>

            {/* Frameworks */}
            <div className="glass-card neon-border p-5 rounded-xl">
                <h3 className="section-title text-base">
                    <span>🧩</span> Frameworks
                </h3>
                {data.frameworks?.length > 0 ? (
                    <div className="flex flex-wrap gap-2">
                        {data.frameworks.map((fw) => (
                            <span key={fw} className="tech-badge">
                                {FW_ICONS[fw] || '📦'} {fw}
                            </span>
                        ))}
                    </div>
                ) : (
                    <p className="text-gray-600 text-sm">No frameworks detected</p>
                )}

                {/* Dependencies count */}
                {data.dependencies && Object.keys(data.dependencies).length > 0 && (
                    <div className="mt-4 pt-4 border-t border-cyber-border">
                        <p className="text-xs text-gray-500 mb-2">Dependencies</p>
                        {Object.entries(data.dependencies).map(([lang, deps]) => (
                            <div key={lang} className="flex items-center justify-between text-xs mb-1">
                                <span className="text-gray-400 capitalize">{lang}</span>
                                <span className="text-cyber-accent font-mono">{deps.length} packages</span>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Databases & Stats */}
            <div className="glass-card neon-border p-5 rounded-xl">
                <h3 className="section-title text-base">
                    <span>🗄️</span> Databases
                </h3>
                {data.databases?.length > 0 ? (
                    <div className="flex flex-wrap gap-2 mb-4">
                        {data.databases.map((db) => (
                            <span
                                key={db}
                                className="px-2.5 py-1 rounded-full text-xs font-medium"
                                style={{
                                    backgroundColor: 'rgba(63, 185, 80, 0.1)',
                                    border: '1px solid rgba(63, 185, 80, 0.2)',
                                    color: '#3fb950',
                                }}
                            >
                                {DB_ICONS[db] || '🗄️'} {db}
                            </span>
                        ))}
                    </div>
                ) : (
                    <p className="text-gray-600 text-sm mb-4">No databases detected</p>
                )}

                {/* Stats */}
                <div className="pt-4 border-t border-cyber-border space-y-2">
                    <div className="flex justify-between text-xs">
                        <span className="text-gray-500">Files</span>
                        <span className="text-gray-300 font-mono">{data.file_count?.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-xs">
                        <span className="text-gray-500">Lines of Code</span>
                        <span className="text-gray-300 font-mono">{data.total_lines?.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-xs">
                        <span className="text-gray-500">Primary Language</span>
                        <span className="text-gray-300 font-mono">{data.primary_language}</span>
                    </div>
                </div>
            </div>
        </div>
    )
}
