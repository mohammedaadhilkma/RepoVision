/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                cyber: {
                    bg: '#050816',
                    surface: '#0d1117',
                    card: '#161b22',
                    border: '#21262d',
                    accent: '#58a6ff',
                    purple: '#bc8cff',
                    green: '#3fb950',
                    orange: '#f78166',
                    yellow: '#e3b341',
                    pink: '#ff7b72',
                }
            },
            fontFamily: {
                sans: ['Inter', 'system-ui', 'sans-serif'],
                mono: ['JetBrains Mono', 'Fira Code', 'monospace'],
            },
            animation: {
                'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
                'glow': 'glow 2s ease-in-out infinite alternate',
                'float': 'float 6s ease-in-out infinite',
                'scan': 'scan 2s linear infinite',
                'fade-in': 'fadeIn 0.5s ease-out forwards',
                'slide-up': 'slideUp 0.6s ease-out forwards',
                'slide-in-right': 'slideInRight 0.5s ease-out forwards',
            },
            keyframes: {
                glow: {
                    '0%': { boxShadow: '0 0 5px #58a6ff, 0 0 10px #58a6ff' },
                    '100%': { boxShadow: '0 0 20px #58a6ff, 0 0 40px #58a6ff, 0 0 60px #58a6ff' },
                },
                float: {
                    '0%, 100%': { transform: 'translateY(0px)' },
                    '50%': { transform: 'translateY(-10px)' },
                },
                scan: {
                    '0%': { transform: 'translateY(-100%)' },
                    '100%': { transform: 'translateY(100vh)' },
                },
                fadeIn: {
                    '0%': { opacity: '0' },
                    '100%': { opacity: '1' },
                },
                slideUp: {
                    '0%': { opacity: '0', transform: 'translateY(30px)' },
                    '100%': { opacity: '1', transform: 'translateY(0)' },
                },
                slideInRight: {
                    '0%': { opacity: '0', transform: 'translateX(30px)' },
                    '100%': { opacity: '1', transform: 'translateX(0)' },
                },
            },
            backgroundImage: {
                'grid-pattern': "linear-gradient(rgba(88, 166, 255, 0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(88, 166, 255, 0.03) 1px, transparent 1px)",
                'cyber-gradient': 'linear-gradient(135deg, #0d1117 0%, #050816 50%, #0d1117 100%)',
                'card-gradient': 'linear-gradient(135deg, rgba(22, 27, 34, 0.8) 0%, rgba(13, 17, 23, 0.9) 100%)',
            },
            backgroundSize: {
                'grid': '50px 50px',
            },
        },
    },
    plugins: [],
}
