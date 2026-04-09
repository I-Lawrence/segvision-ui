import { useState, useRef, useEffect } from 'react';
import './Demo.css';

// --- DATA ---
const CLASSES = [
    { name: 'Ground', val: '37.6%', color: '#f59e0b' },
    { name: 'Vegetation', val: '37.2%', color: '#10b981' },
    { name: 'Sky', val: '20%', color: '#0ea5e9' },
    { name: 'Structure', val: '5%', color: '#a855f7' },
    { name: 'Others', val: '0.5%', color: '#64748b' }
];

const MODELS = [
    { id: 'best', label: 'Best Model (Latest Model)' },
    { id: 'latest', label: 'Latest Model' },
    { id: 'baseline', label: 'Baseline Model' }
];

// --- METRICS DATA ---
const MODEL_METRICS = {
    mIoU: '84.2%',
    dice: '89.1%',
    pixelAcc: '95.6%',
    latency: '45ms'
};

const PER_CLASS_IOU = [
    { name: 'Ground', val: '88.5%', color: '#f59e0b' },
    { name: 'Vegetation', val: '82.1%', color: '#10b981' },
    { name: 'Sky', val: '94.3%', color: '#0ea5e9' },
    { name: 'Structure', val: '76.8%', color: '#a855f7' },
    { name: 'Others', val: '55.2%', color: '#64748b' }
];

// --- MODEL COMPARISON DATA ---
const MODEL_COMPARISON_DATA = [
    { name: 'Baseline', iou: 72.4, acc: 86.8 },
    { name: 'Latest', iou: 81.5, acc: 93.2 },
    { name: 'Best Model', iou: 84.2, acc: 95.6 }
];

// ==========================================
// ANIMATED RIBBON BACKGROUND
// ==========================================
function AnimatedBackground() {
    return (
        <div className="ribbon-background-container">
            <div className="ribbon-wave ribbon-1"></div>
            <div className="ribbon-wave ribbon-2"></div>
            <div className="ribbon-wave ribbon-3"></div>
        </div>
    );
}

// ==========================================
// GLOWING RANGE SLIDER COMPONENT
// ==========================================
function GlowingRangeSlider() {
    const [value, setValue] = useState(50);
    const [isDragging, setIsDragging] = useState(false);
    const trackRef = useRef(null);

    const handleMove = (clientX) => {
        if (!trackRef.current) return;
        const rect = trackRef.current.getBoundingClientRect();
        let x = clientX - rect.left;
        x = Math.max(0, Math.min(x, rect.width));
        const percentage = Math.round((x / rect.width) * 100);
        setValue(percentage);
    };

    const onMouseMove = (e) => handleMove(e.clientX);
    const onTouchMove = (e) => handleMove(e.touches[0].clientX);
    const stopDragging = () => setIsDragging(false);

    useEffect(() => {
        if (isDragging) {
            window.addEventListener('mousemove', onMouseMove);
            window.addEventListener('mouseup', stopDragging);
            window.addEventListener('touchmove', onTouchMove);
            window.addEventListener('touchend', stopDragging);
        }
        return () => {
            window.removeEventListener('mousemove', onMouseMove);
            window.removeEventListener('mouseup', stopDragging);
            window.removeEventListener('touchmove', onTouchMove);
            window.removeEventListener('touchend', stopDragging);
        };
    }, [isDragging]);

    return (
        <div className="glass-panel" style={{ padding: '2.5rem', width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1.5rem', marginTop: '2rem' }}>
            <div className="tech-font" style={{ fontSize: '2.5rem', fontWeight: '700', color: 'white', textShadow: '0 0 20px rgba(168, 85, 247, 0.6)', fontVariantNumeric: 'tabular-nums', lineHeight: '1' }}>
                {value} <span style={{ fontSize: '0.5em', opacity: 0.5, letterSpacing: '2px' }}>%</span>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', width: '100%', maxWidth: '600px', gap: '1.5rem' }}>
                <span className="tech-font" style={{ color: 'var(--text-muted, #94a3b8)', fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '1px' }}>
                    Original
                </span>

                <div
                    ref={trackRef}
                    onMouseDown={(e) => { setIsDragging(true); handleMove(e.clientX); }}
                    onTouchStart={(e) => { setIsDragging(true); handleMove(e.touches[0].clientX); }}
                    style={{ position: 'relative', flex: 1, height: '32px', display: 'flex', alignItems: 'center', cursor: 'pointer', touchAction: 'none' }}
                >
                    <div style={{ position: 'absolute', width: '100%', height: '8px', background: 'rgba(0, 0, 0, 0.5)', borderRadius: '4px', boxShadow: 'inset 0 1px 3px rgba(0,0,0,0.8)' }}></div>
                    <div style={{ position: 'absolute', height: '8px', background: '#a855f7', borderRadius: '4px', boxShadow: '0 0 12px #a855f7, 0 0 24px rgba(168, 85, 247, 0.5)', pointerEvents: 'none', width: `${value}%` }}></div>
                    <div style={{ position: 'absolute', top: '50%', transform: 'translate(-50%, -50%)', width: '28px', height: '28px', borderRadius: '50%', background: 'white', boxShadow: '0 0 15px #a855f7, 0 0 5px rgba(255,255,255,0.8)', display: 'flex', justifyContent: 'center', alignItems: 'center', pointerEvents: 'none', left: `${value}%` }}>
                        <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#a855f7', transition: 'transform 0.2s cubic-bezier(0.175, 0.885, 0.32, 1.275)', transform: isDragging ? 'scale(1.6)' : 'scale(1)' }}></div>
                    </div>
                </div>

                <span className="tech-font" style={{ color: 'var(--text-muted, #94a3b8)', fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '1px' }}>
                    Segmented
                </span>
            </div>
        </div>
    );
}

// ==========================================
// MAIN DEMO COMPONENT
// ==========================================
export default function Demo() {
    // UI Flow State
    const [appState, setAppState] = useState('upload'); // 'upload' | 'processing' | 'results'
    const [progress, setProgress] = useState(0);

    // Dashboard State
    const [view, setView] = useState('overlay');
    const [selectedModel, setSelectedModel] = useState('best');
    const [isDownloadOpen, setIsDownloadOpen] = useState(false);
    const [isModelDropdownOpen, setIsModelDropdownOpen] = useState(false);

    const downloadRef = useRef(null);
    const modelDropdownRef = useRef(null);

    useEffect(() => {
        function handleClickOutside(event) {
            if (downloadRef.current && !downloadRef.current.contains(event.target)) setIsDownloadOpen(false);
            if (modelDropdownRef.current && !modelDropdownRef.current.contains(event.target)) setIsModelDropdownOpen(false);
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    // Simulated Upload & Processing Flow
    const handleUpload = () => {
        setAppState('processing');
        let currentProgress = 0;

        // Simulate a backend processing delay
        const interval = setInterval(() => {
            currentProgress += Math.floor(Math.random() * 15) + 5; // Random jumps between 5 and 20
            if (currentProgress >= 100) {
                currentProgress = 100;
                clearInterval(interval);
                // Slight delay at 100% before revealing results for smoother UX
                setTimeout(() => setAppState('results'), 500);
            }
            setProgress(currentProgress);
        }, 300);
    };

    const handleDownload = (type) => {
        console.log(`Trigger download for: ${type}`);
        setIsDownloadOpen(false);
    };

    const currentModelLabel = MODELS.find(m => m.id === selectedModel)?.label || 'Select Model';

    return (
        <section id="demo" className="demo-section">

            {/* The Animated Energy Ribbon Background */}
            <AnimatedBackground />

            <h2 className="section-title">Try it Yourself</h2>

            {/* ================= PHASE 1: UPLOAD VIEW ================= */}
            {appState === 'upload' && (
                <div className="upload-container glass-panel">
                    {/* Model Selection Tabs */}
                    <div className="upload-tabs">
                        {MODELS.map(m => (
                            <button
                                key={m.id}
                                className={`upload-tab ${selectedModel === m.id ? 'active' : ''}`}
                                onClick={() => setSelectedModel(m.id)}
                            >
                                {m.label.split('(')[0].trim()}
                            </button>
                        ))}
                    </div>

                    {/* Drag and Drop Zone */}
                    <div className="drag-drop-outer" onClick={handleUpload}>
                        <div className="drag-drop-inner">
                            <svg className="upload-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                                <polyline points="17 8 12 3 7 8"></polyline>
                                <line x1="12" y1="3" x2="12" y2="15"></line>
                            </svg>
                            <p className="tech-font">Drag or Upload</p>
                        </div>
                    </div>

                    {/* Upload Actions */}
                    <div className="upload-actions">
                        <button className="neon-cyan-btn" onClick={handleUpload}>Upload image</button>
                        <button className="neon-cyan-btn" onClick={handleUpload}>Upload Folder</button>
                    </div>
                </div>
            )}

            {/* ================= PHASE 2: PROCESSING VIEW ================= */}
            {appState === 'processing' && (
                <div className="processing-container glass-panel">
                    <div className="processing-content">
                        <div className="spinner"></div>
                        <h3 className="tech-font" style={{ color: 'white', letterSpacing: '2px', textTransform: 'uppercase' }}>
                            Running Inference...
                        </h3>
                        <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem' }}>Processing through {currentModelLabel}</p>

                        <div className="progress-track">
                            <div className="progress-fill" style={{ width: `${progress}%` }}></div>
                        </div>
                        <p className="tech-font" style={{ color: 'var(--accent-neon)', marginTop: '0.5rem' }}>{progress}%</p>
                    </div>
                </div>
            )}

            {/* ================= PHASE 3: RESULTS VIEW ================= */}
            {appState === 'results' && (
                <div className="demo-results-fade-in">
                    <div className="demo-grid">
                        {/* ================= MAIN RENDER PANEL ================= */}
                        <div className="glass-panel">
                            <div className="toolbar">
                                <div className="view-controls">
                                    {['original', 'predicted mask', 'overlay'].map((v) => (
                                        <button
                                            key={v}
                                            onClick={() => setView(v)}
                                            className={`view-btn ${view === v ? 'active' : ''}`}
                                        >
                                            {v}
                                        </button>
                                    ))}
                                </div>

                                <div style={{ position: 'relative' }} ref={downloadRef}>
                                    <button
                                        className="view-btn"
                                        onClick={() => setIsDownloadOpen(!isDownloadOpen)}
                                        onMouseOver={(e) => e.target.style.boxShadow = '0 0 12px rgba(255, 255, 255, 0.4)'}
                                        onMouseOut={(e) => e.target.style.boxShadow = 'none'}
                                        style={{ transition: 'all 0.3s ease', display: 'flex', alignItems: 'center', gap: '0.5rem' }}
                                    >
                                        DOWNLOAD
                                        <span style={{ fontSize: '0.7rem', transition: 'transform 0.3s', transform: isDownloadOpen ? 'rotate(180deg)' : 'rotate(0deg)' }}>▼</span>
                                    </button>

                                    {isDownloadOpen && (
                                        <div style={{
                                            position: 'absolute', top: '100%', right: 0, marginTop: '0.5rem',
                                            backgroundColor: '#1e293b', border: '1px solid var(--border-subtle)', borderRadius: '6px',
                                            display: 'flex', flexDirection: 'column', minWidth: '150px', zIndex: 50,
                                            boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.5)', overflow: 'hidden'
                                        }}>
                                            {[
                                                { id: 'mask png', label: 'Mask PNG' },
                                                { id: 'overlay png', label: 'Overlay PNG' },
                                                { id: 'csv summary', label: 'CSV Summary' }
                                            ].map((option, index, arr) => (
                                                <button
                                                    key={option.id} onClick={() => handleDownload(option.id)}
                                                    style={{
                                                        padding: '0.75rem 1rem', background: 'transparent', border: 'none',
                                                        borderBottom: index === arr.length - 1 ? 'none' : '1px solid var(--border-subtle)',
                                                        color: 'white', textAlign: 'left', cursor: 'pointer', fontSize: '0.85rem',
                                                        transition: 'background-color 0.2s ease'
                                                    }}
                                                    onMouseOver={(e) => e.target.style.backgroundColor = 'rgba(255,255,255,0.08)'}
                                                    onMouseOut={(e) => e.target.style.backgroundColor = 'transparent'}
                                                >
                                                    {option.label}
                                                </button>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>
                            <div className="render-area tech-font">
                                <span style={{ opacity: 0.5, letterSpacing: '2px' }}>[ {view.toUpperCase()} RENDER ]</span>
                            </div>
                        </div>

                        {/* ================= SIDEBAR PANEL ================= */}
                        <div className="glass-panel sidebar-panel">
                            <div style={{ paddingBottom: '1.5rem', borderBottom: '1px solid var(--border-subtle)' }}>
                                <div className="panel-header">Select Model</div>
                                <div style={{ position: 'relative' }} ref={modelDropdownRef}>
                                    <button
                                        onClick={() => setIsModelDropdownOpen(!isModelDropdownOpen)}
                                        onMouseOver={(e) => {
                                            e.target.style.boxShadow = '0 0 12px rgba(168, 85, 247, 0.6)';
                                            e.target.style.borderColor = '#d8b4fe';
                                        }}
                                        onMouseOut={(e) => {
                                            e.target.style.boxShadow = 'none';
                                            e.target.style.borderColor = 'var(--accent-neon)';
                                        }}
                                        style={{
                                            width: '100%', padding: '0.8rem', background: 'rgba(168, 85, 247, 0.1)',
                                            border: '1px solid var(--accent-neon)', borderRadius: '6px', color: 'white',
                                            fontSize: '0.9rem', fontWeight: '600', cursor: 'pointer', display: 'flex',
                                            justifyContent: 'space-between', alignItems: 'center', transition: 'all 0.3s ease'
                                        }}
                                    >
                                        <span>{currentModelLabel}</span>
                                        <span style={{ fontSize: '0.7rem', transition: 'transform 0.3s', transform: isModelDropdownOpen ? 'rotate(180deg)' : 'rotate(0deg)' }}>▼</span>
                                    </button>

                                    {isModelDropdownOpen && (
                                        <div style={{
                                            position: 'absolute', top: '100%', left: 0, width: '100%', marginTop: '0.5rem',
                                            backgroundColor: '#1e293b', border: '1px solid var(--border-subtle)', borderRadius: '6px',
                                            display: 'flex', flexDirection: 'column', zIndex: 50, boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.5)', overflow: 'hidden'
                                        }}>
                                            {MODELS.map((model, index) => {
                                                const isActive = selectedModel === model.id;
                                                const isLast = index === MODELS.length - 1;
                                                return (
                                                    <button
                                                        key={model.id}
                                                        onClick={() => { setSelectedModel(model.id); setIsModelDropdownOpen(false); }}
                                                        onMouseOver={(e) => e.target.style.backgroundColor = 'rgba(168, 85, 247, 0.2)'}
                                                        onMouseOut={(e) => e.target.style.backgroundColor = isActive ? 'rgba(168, 85, 247, 0.1)' : 'transparent'}
                                                        style={{
                                                            padding: '0.8rem', background: isActive ? 'rgba(168, 85, 247, 0.1)' : 'transparent',
                                                            border: 'none', borderBottom: isLast ? 'none' : '1px solid var(--border-subtle)',
                                                            color: isActive ? 'white' : 'var(--text-muted)', textAlign: 'left', cursor: 'pointer',
                                                            fontSize: '0.9rem', fontWeight: isActive ? '600' : 'normal', transition: 'background-color 0.2s ease'
                                                        }}
                                                    >
                                                        {model.label}
                                                    </button>
                                                );
                                            })}
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'end', marginBottom: '1.5rem', paddingTop: '1.5rem' }}>
                                    <div className="panel-header" style={{ margin: 0 }}>Class Distribution</div>
                                </div>

                                {CLASSES.map((c) => (
                                    <div key={c.name} className="class-row">
                                        <div className="class-info">
                                            <span style={{ color: 'white' }}>{c.name}</span>
                                            <span style={{ color: c.color }}>{c.val}</span>
                                        </div>
                                        <div className="bar-track">
                                            <div className="bar-fill" style={{ width: c.val, backgroundColor: c.color, color: c.color }}></div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* ================= GLOWING RANGE SLIDER ================= */}
                    <GlowingRangeSlider />

                    {/* ================= PERFORMANCE METRICS SECTION ================= */}
                    <div className="glass-panel metrics-panel" style={{ marginTop: '2rem' }}>
                        <div className="panel-header" style={{ marginBottom: '1.5rem' }}>Evaluation Metrics</div>

                        <div className="metrics-grid">
                            <div className="kpi-container">
                                <div className="kpi-card">
                                    <div className="kpi-label">Mean IoU</div>
                                    <div className="kpi-value text-gradient">{MODEL_METRICS.mIoU}</div>
                                </div>
                                <div className="kpi-card">
                                    <div className="kpi-label">Dice Score</div>
                                    <div className="kpi-value">{MODEL_METRICS.dice}</div>
                                </div>
                                <div className="kpi-card">
                                    <div className="kpi-label">Pixel Accuracy</div>
                                    <div className="kpi-value">{MODEL_METRICS.pixelAcc}</div>
                                </div>
                                <div className="kpi-card">
                                    <div className="kpi-label">Inference Latency</div>
                                    <div className="kpi-value" style={{ color: '#10b981' }}>{MODEL_METRICS.latency}</div>
                                    <div className="kpi-subtext">RTX 4090 / 1024x1024</div>
                                </div>
                            </div>

                            <div className="per-class-container">
                                <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '1rem', fontWeight: '600', letterSpacing: '1px' }}>PER-CLASS IoU</div>
                                <div className="per-class-grid">
                                    {PER_CLASS_IOU.map((c) => (
                                        <div key={c.name} className="class-row">
                                            <div className="class-info">
                                                <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>{c.name}</span>
                                                <span style={{ color: c.color, fontWeight: '600', fontSize: '0.9rem' }}>{c.val}</span>
                                            </div>
                                            <div className="bar-track" style={{ height: '6px' }}>
                                                <div className="bar-fill" style={{ width: c.val, backgroundColor: c.color }}></div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* ================= MODEL COMPARISON BAR GRAPH ================= */}
                    <div className="glass-panel" style={{ marginTop: '2rem', padding: '2rem' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                            <div className="panel-header">Model Performance Comparison</div>
                            <div style={{ display: 'flex', gap: '1.5rem', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                    <div style={{ width: '12px', height: '12px', background: 'var(--accent-neon)', borderRadius: '3px' }}></div>
                                    Mean IoU (%)
                                </div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                    <div style={{ width: '12px', height: '12px', background: '#10b981', borderRadius: '3px' }}></div>
                                    Pixel Accuracy (%)
                                </div>
                            </div>
                        </div>

                        <div style={{ position: 'relative', height: '320px', paddingLeft: '40px', paddingTop: '20px' }}>
                            {[0, 25, 50, 75, 100].map((tick) => (
                                <div key={tick} style={{ position: 'absolute', left: 0, bottom: `${tick}%`, width: '100%', borderBottom: tick === 0 ? '2px solid var(--border-subtle)' : '1px dashed rgba(255,255,255,0.05)', display: 'flex', alignItems: 'flex-end', zIndex: 1 }}>
                                    <span className="tech-font" style={{ position: 'absolute', left: '0px', bottom: '-8px', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                                        {tick}
                                    </span>
                                </div>
                            ))}

                            <div style={{ display: 'flex', height: '100%', justifyContent: 'space-around', alignItems: 'flex-end', position: 'relative', zIndex: 2, paddingLeft: '20px' }}>
                                {MODEL_COMPARISON_DATA.map((data, idx) => (
                                    <div key={idx} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', height: '100%', justifyContent: 'flex-end', gap: '1rem', width: '20%' }}>
                                        <div style={{ display: 'flex', gap: '8px', alignItems: 'flex-end', height: '100%', width: '100%', justifyContent: 'center' }}>
                                            <div style={{ height: `${data.iou}%`, width: '45px', background: 'var(--accent-neon)', borderRadius: '4px 4px 0 0', position: 'relative', transition: 'height 1s ease-out', boxShadow: '0 0 10px rgba(168, 85, 247, 0.3)' }}>
                                                <span className="tech-font" style={{ position: 'absolute', top: '-25px', left: '50%', transform: 'translateX(-50%)', fontSize: '0.75rem', color: 'white', fontWeight: 'bold' }}>
                                                    {data.iou}
                                                </span>
                                            </div>
                                            <div style={{ height: `${data.acc}%`, width: '45px', background: '#10b981', borderRadius: '4px 4px 0 0', position: 'relative', transition: 'height 1s ease-out 0.2s', boxShadow: '0 0 10px rgba(16, 185, 129, 0.2)' }}>
                                                <span className="tech-font" style={{ position: 'absolute', top: '-25px', left: '50%', transform: 'translateX(-50%)', fontSize: '0.75rem', color: 'white', fontWeight: 'bold' }}>
                                                    {data.acc}
                                                </span>
                                            </div>
                                        </div>
                                        <div style={{ color: 'white', fontSize: '0.9rem', fontWeight: '600', marginTop: '10px' }}>
                                            {data.name}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    <div style={{ textAlign: 'center', marginTop: '3rem' }}>
                        <button className="view-btn" onClick={() => setAppState('upload')} style={{ padding: '1rem 2rem', borderColor: 'var(--accent-neon)', color: 'var(--accent-neon)' }}>
                            ← Process Another Image
                        </button>
                    </div>

                </div>
            )}
        </section>
    );
}