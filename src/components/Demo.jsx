import { useState } from 'react';
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
                        <button className="view-btn">DOWNLOAD ▼</button>
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