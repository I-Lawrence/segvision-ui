import { useState, useRef, useEffect } from 'react';
import './Demo.css';

const CLASSES = [
    { name: 'Ground', val: '37.6%', color: '#f59e0b' },
    { name: 'Vegetation', val: '37.2%', color: '#10b981' },
    { name: 'Sky', val: '20%', color: '#0ea5e9' },
    { name: 'Structure', val: '5%', color: '#a855f7' },
    { name: 'Others', val: '0.5%', color: '#64748b' }
];

export default function Demo() {
    const [view, setView] = useState('overlay');
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const dropdownRef = useRef(null);

    // Close dropdown when clicking outside of it
    useEffect(() => {
        function handleClickOutside(event) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsDropdownOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleDownload = (type) => {
        console.log(`Trigger download for: ${type}`);
        // Add your actual download logic here
        setIsDropdownOpen(false);
    };

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

                        {/* Updated Download Dropdown */}
                        <div style={{ position: 'relative' }} ref={dropdownRef}>
                            <button
                                className="view-btn"
                                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                            >
                                DOWNLOAD ▼
                            </button>

                            {isDropdownOpen && (
                                <div style={{
                                    position: 'absolute',
                                    top: '100%',
                                    right: 0,
                                    marginTop: '0.5rem',
                                    backgroundColor: '#1e293b', // fallback dark background
                                    border: '1px solid var(--border-subtle)',
                                    borderRadius: '6px',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    minWidth: '150px', // slightly wider for the new text
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
                                            borderBottom: '1px solid var(--border-subtle)', // Added border here
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
                    <div style={{ paddingBottom: '1.5rem', borderBottom: '1px solid var(--border-subtle)' }}>
                        <div className="panel-header">Select Model</div>
                        <div style={{ padding: '0.8rem', background: 'rgba(168, 85, 247, 0.1)', border: '1px solid var(--accent-neon)', borderRadius: '6px', color: 'white', fontSize: '0.9rem', fontWeight: '600', marginBottom: '0.5rem' }}>
                            Best Model (Latest Model)
                        </div>
                        <div style={{ padding: '0.8rem', border: '1px solid var(--border-subtle)', borderRadius: '6px', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                            Baseline Model
                        </div>
                    </div>

                    <div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'end', marginBottom: '1.5rem' }}>
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