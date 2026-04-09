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

// --- NEW METRICS DATA ---
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

export default function Demo() {
    // States
    const [view, setView] = useState('overlay');
    const [selectedModel, setSelectedModel] = useState('best');
    const [isDownloadOpen, setIsDownloadOpen] = useState(false);
    const [isModelDropdownOpen, setIsModelDropdownOpen] = useState(false);
    
    // Refs
    const downloadRef = useRef(null);
    const modelDropdownRef = useRef(null);

    // Click-outside listener
    useEffect(() => {
        function handleClickOutside(event) {
            if (downloadRef.current && !downloadRef.current.contains(event.target)) {
                setIsDownloadOpen(false);
            }
            if (modelDropdownRef.current && !modelDropdownRef.current.contains(event.target)) {
                setIsModelDropdownOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleDownload = (type) => {
        console.log(`Trigger download for: ${type}`);
        setIsDownloadOpen(false); 
    };

    const currentModelLabel = MODELS.find(m => m.id === selectedModel)?.label || 'Select Model';

    return (
        <section id="demo" className="demo-section">
            <h2 className="section-title">Try it Yourself</h2>

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
                        
                        {/* Download Dropdown (Original Styling Kept) */}
                        <div style={{ position: 'relative' }} ref={downloadRef}>
                            <button 
                                className="view-btn" 
                                onClick={() => setIsDownloadOpen(!isDownloadOpen)}
                                onMouseOver={(e) => e.target.style.boxShadow = '0 0 12px rgba(255, 255, 255, 0.4)'}
                                onMouseOut={(e) => e.target.style.boxShadow = 'none'}
                                style={{
                                    transition: 'all 0.3s ease',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '0.5rem'
                                }}
                            >
                                DOWNLOAD 
                                <span style={{ fontSize: '0.7rem', transition: 'transform 0.3s', transform: isDownloadOpen ? 'rotate(180deg)' : 'rotate(0deg)' }}>▼</span>
                            </button>
                            
                            {isDownloadOpen && (
                                <div style={{
                                    position: 'absolute',
                                    top: '100%',
                                    right: 0,
                                    marginTop: '0.5rem',
                                    backgroundColor: '#1e293b', 
                                    border: '1px solid var(--border-subtle)',
                                    borderRadius: '6px',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    minWidth: '150px', 
                                    zIndex: 50,
                                    boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.5)',
                                    overflow: 'hidden'
                                }}>
                                    {[
                                        { id: 'mask png', label: 'Mask PNG' },
                                        { id: 'overlay png', label: 'Overlay PNG' },
                                        { id: 'csv summary', label: 'CSV Summary' }
                                    ].map((option, index, arr) => (
                                        <button 
                                            key={option.id}
                                            onClick={() => handleDownload(option.id)}
                                            style={{
                                                padding: '0.75rem 1rem',
                                                background: 'transparent',
                                                border: 'none',
                                                borderBottom: index === arr.length - 1 ? 'none' : '1px solid var(--border-subtle)',
                                                color: 'white',
                                                textAlign: 'left',
                                                cursor: 'pointer',
                                                fontSize: '0.85rem',
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
                    
                    {/* Model Selector Dropdown (Original Styling Kept) */}
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
                                    width: '100%',
                                    padding: '0.8rem',
                                    background: 'rgba(168, 85, 247, 0.1)',
                                    border: '1px solid var(--accent-neon)',
                                    borderRadius: '6px',
                                    color: 'white',
                                    fontSize: '0.9rem',
                                    fontWeight: '600',
                                    cursor: 'pointer',
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    alignItems: 'center',
                                    transition: 'all 0.3s ease'
                                }}
                            >
                                <span>{currentModelLabel}</span>
                                <span style={{ fontSize: '0.7rem', transition: 'transform 0.3s', transform: isModelDropdownOpen ? 'rotate(180deg)' : 'rotate(0deg)' }}>▼</span>
                            </button>

                            {isModelDropdownOpen && (
                                <div style={{
                                    position: 'absolute',
                                    top: '100%',
                                    left: 0,
                                    width: '100%',
                                    marginTop: '0.5rem',
                                    backgroundColor: '#1e293b',
                                    border: '1px solid var(--border-subtle)',
                                    borderRadius: '6px',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    zIndex: 50,
                                    boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.5)',
                                    overflow: 'hidden'
                                }}>
                                    {MODELS.map((model, index) => {
                                        const isActive = selectedModel === model.id;
                                        const isLast = index === MODELS.length - 1;
                                        
                                        return (
                                            <button
                                                key={model.id}
                                                onClick={() => {
                                                    setSelectedModel(model.id);
                                                    setIsModelDropdownOpen(false);
                                                }}
                                                onMouseOver={(e) => e.target.style.backgroundColor = 'rgba(168, 85, 247, 0.2)'}
                                                onMouseOut={(e) => e.target.style.backgroundColor = isActive ? 'rgba(168, 85, 247, 0.1)' : 'transparent'}
                                                style={{
                                                    padding: '0.8rem',
                                                    background: isActive ? 'rgba(168, 85, 247, 0.1)' : 'transparent',
                                                    border: 'none',
                                                    borderBottom: isLast ? 'none' : '1px solid var(--border-subtle)',
                                                    color: isActive ? 'white' : 'var(--text-muted)',
                                                    textAlign: 'left',
                                                    cursor: 'pointer',
                                                    fontSize: '0.9rem',
                                                    fontWeight: isActive ? '600' : 'normal',
                                                    transition: 'background-color 0.2s ease'
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

                    {/* Class Distribution */}
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

            {/* ================= NEW: PERFORMANCE METRICS SECTION ================= */}
            <div className="glass-panel metrics-panel" style={{ marginTop: '2rem' }}>
                <div className="panel-header" style={{ marginBottom: '1.5rem' }}>Evaluation Metrics</div>
                
                <div className="metrics-grid">
                    
                    {/* Top KPI Cards */}
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

                    {/* Per-Class IoU Breakdown */}
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
        </section>
    );
}