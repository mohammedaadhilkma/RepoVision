import { useState } from 'react'
import jsPDF from 'jspdf'
import html2canvas from 'html2canvas'

export default function DownloadPDF({ data }) {
    const [downloading, setDownloading] = useState(false)

    const handleDownload = async () => {
        setDownloading(true)
        try {
            // Capture the results section
            const element = document.getElementById('results-content') || document.body
            const canvas = await html2canvas(element, {
                backgroundColor: '#050816',
                scale: 1.5,
                useCORS: true,
                logging: false,
                windowWidth: 1280,
            })

            const imgData = canvas.toDataURL('image/png')
            const pdf = new jsPDF({
                orientation: 'portrait',
                unit: 'mm',
                format: 'a4',
            })

            const pageWidth = pdf.internal.pageSize.getWidth()
            const pageHeight = pdf.internal.pageSize.getHeight()
            const imgWidth = pageWidth
            const imgHeight = (canvas.height * pageWidth) / canvas.width

            let heightLeft = imgHeight
            let position = 0

            // Add first page
            pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight)
            heightLeft -= pageHeight

            // Add additional pages if needed
            while (heightLeft >= 0) {
                position = heightLeft - imgHeight
                pdf.addPage()
                pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight)
                heightLeft -= pageHeight
            }

            pdf.save(`${data.repo_name || 'repovision'}-analysis.pdf`)
        } catch (err) {
            console.error('PDF generation failed:', err)
            // Fallback: generate text-based PDF
            generateTextPDF(data)
        } finally {
            setDownloading(false)
        }
    }

    const generateTextPDF = (data) => {
        const pdf = new jsPDF()
        let y = 20

        const addLine = (text, size = 12, color = [200, 200, 200]) => {
            pdf.setFontSize(size)
            pdf.setTextColor(...color)
            const lines = pdf.splitTextToSize(text, 180)
            lines.forEach(line => {
                if (y > 270) { pdf.addPage(); y = 20 }
                pdf.text(line, 15, y)
                y += size * 0.5
            })
            y += 3
        }

        // Title
        pdf.setFillColor(5, 8, 22)
        pdf.rect(0, 0, 210, 297, 'F')

        addLine('RepoVision Analysis Report', 22, [88, 166, 255])
        addLine(data.repo_name, 16, [255, 255, 255])
        addLine(data.repo_url, 10, [100, 100, 150])
        y += 5

        addLine('SUMMARY', 14, [88, 166, 255])
        addLine(data.summary, 11, [200, 200, 200])
        y += 5

        addLine('ARCHITECTURE', 14, [88, 166, 255])
        addLine(`Type: ${data.architecture_type}`, 11, [200, 200, 200])
        addLine(data.architecture_explanation, 11, [200, 200, 200])
        y += 5

        addLine('TECH STACK', 14, [88, 166, 255])
        addLine(`Languages: ${data.languages?.join(', ')}`, 11, [200, 200, 200])
        addLine(`Frameworks: ${data.frameworks?.join(', ') || 'None'}`, 11, [200, 200, 200])
        addLine(`Databases: ${data.databases?.join(', ') || 'None'}`, 11, [200, 200, 200])
        y += 5

        addLine('SCORES', 14, [88, 166, 255])
        addLine(`Complexity: ${data.complexity_score}/100 (${data.complexity_label})`, 11, [200, 200, 200])
        addLine(`Code Quality: ${data.code_quality_score}/100`, 11, [200, 200, 200])
        addLine(`Files: ${data.file_count} | Lines: ${data.total_lines?.toLocaleString()}`, 11, [200, 200, 200])
        y += 5

        addLine('FEATURES', 14, [88, 166, 255])
        data.features?.forEach(f => addLine(`• ${f}`, 11, [200, 200, 200]))
        y += 5

        addLine('IMPROVEMENT SUGGESTIONS', 14, [88, 166, 255])
        data.improvements_suggestion?.forEach((s, i) => addLine(`${i + 1}. ${s}`, 11, [200, 200, 200]))
        y += 5

        addLine('SECURITY RISKS', 14, [88, 166, 255])
        data.security_risks?.forEach(r => addLine(`• ${r}`, 11, [200, 200, 200]))

        pdf.save(`${data.repo_name || 'repovision'}-analysis.pdf`)
    }

    return (
        <button
            onClick={handleDownload}
            disabled={downloading}
            className="flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 disabled:opacity-50"
            style={{
                background: 'rgba(63, 185, 80, 0.1)',
                border: '1px solid rgba(63, 185, 80, 0.3)',
                color: '#3fb950',
            }}
        >
            {downloading ? (
                <>
                    <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                    Generating PDF...
                </>
            ) : (
                <>
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                            d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    Download PDF
                </>
            )}
        </button>
    )
}
