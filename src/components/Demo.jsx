import { useState, useRef, useEffect } from 'react';
import './Demo.css';

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

export default function Demo() {
    const [view, setView] = useState('overlay');
    const [selectedModel, setSelectedModel] = useState('best');
    
    // Dropdown states
    const [isDownloadOpen, setIsDownloadOpen] = useState(false);
    const [isModelDropdownOpen, setIsModelDropdownOpen] = useState(false);
    
    // Refs for click-outside detection
    const downloadRef = useRef(null);
    const modelDropdownRef = useRef(null);

    // Unified click-outside handler for both dropdowns
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

    // Helper to get current model label
    const currentModelLabel = MODELS.find(m => m.id === selectedModel)?.label || 'Select Model';

    return (
        <section id="demo" className="demo-section">
            <h2 className="section-title">Try it Yourself</h2>

            <div className="demo-grid">
                {/* Main Render Panel */}
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
                        
                        {/* Download Dropdown */}
                        <div style={{ position: 'relative' }} ref={downloadRef}>
                            <button 
                                className="view-btn" 
                                onClick={() => setIsDownloadOpen(!isDownloadOpen)}
                            >
                                DOWNLOAD ▼
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
                                    boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.5)'
                                }}>
                                    <button 
                                        onClick={() => handleDownload('mask png')}
                                        style={{
                                            padding: '0.75rem 1rem',
                                            background: 'transparent',
                                            border: 'none',
                                            borderBottom: '1px solid var(--border-subtle)',
                                            color: 'white',
                                            textAlign: 'left',
                                            cursor: 'pointer',
                                            fontSize: '0.85rem'
                                        }}
                                        onMouseOver={(e) => e.target.style.backgroundColor = 'rgba(255,255,255,0.05)'}
                                        onMouseOut={(e) => e.target.style.backgroundColor = 'transparent'}
                                    >
                                        Mask PNG
                                    </button>
                                    <button 
                                        onClick={() => handleDownload('overlay png')}
                                        style={{
                                            padding: '0.75rem 1rem',
                                            background: 'transparent',
                                            border: 'none',
                                            borderBottom: '1px solid var(--border-subtle)',
                                            color: 'white',
                                            textAlign: 'left',
                                            cursor: 'pointer',
                                            fontSize: '0.85rem'
                                        }}
                                        onMouseOver={(e) => e.target.style.backgroundColor = 'rgba(255,255,255,0.05)'}
                                        onMouseOut={(e) => e.target.style.backgroundColor = 'transparent'}
                                    >
                                        Overlay PNG
                                    </button>
                                    <button 
                                        onClick={() => handleDownload('csv summary')}
                                        style={{
                                            padding: '0.75rem 1rem',
                                            background: 'transparent',
                                            border: 'none',
                                            color: 'white',
                                            textAlign: 'left',
                                            cursor: 'pointer',
                                            fontSize: '0.85rem'
                                        }}
                                        onMouseOver={(e) => e.target.style.backgroundColor = 'rgba(255,255,255,0.05)'}
                                        onMouseOut={(e) => e.target.style.backgroundColor = 'transparent'}
                                    >
                                        CSV Summary
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                    <div className="render-area tech-font">
                        <span style={{ opacity: 0.5, letterSpacing: '2px' }}>[ {view.toUpperCase()} RENDER ]</span>
                    </div>
                </div>

                {/* Sidebar Panel */}
                <div className="glass-panel sidebar-panel">
                    
                    {/* Model Dropdown Section */}
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

                    <div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'end', marginBottom: '1.5rem', paddingTop: '1.5rem' }}>
                            <div className="panel-header" style={{ margin: 0 }}>Classes</div>
                            <div style={{ textAlign: 'right' }}>
                                <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>CONFIDENCE</div>
                                <div style={{ color: '#10b981', fontWeight: '700', fontSize: '1.2rem' }}>50%</div>
                            </div>
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
        </section>
    );
}