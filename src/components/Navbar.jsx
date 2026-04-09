import { Eye } from 'lucide-react';
import './Navbar.css';

export default function Navbar() {
    const scrollToSection = (id) => {
        const element = document.getElementById(id);
        if (element) {
            const offset = 100; // Account for fixed navbar height
            const bodyRect = document.body.getBoundingClientRect().top;
            const elementRect = element.getBoundingClientRect().top;
            const elementPosition = elementRect - bodyRect;
            const offsetPosition = elementPosition - offset;

            window.scrollTo({
                top: offsetPosition,
                behavior: 'smooth'
            });
        }
    };

    return (
        <nav className="navbar">
            <div className="navbar-container">
                {/* Brand Logo Section */}
                <div className="navbar-brand" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
                    <Eye className="eye-icon" size={24} />
                    <span className="logo-text">SegVision</span>
                </div>

                {/* Navigation Links Section */}
                <div className="nav-menu">
                    <button onClick={() => scrollToSection('demo')} className="nav-link">Demo</button>
                    <button onClick={() => scrollToSection('architecture')} className="nav-link">Architecture</button>
                </div>
            </div>
        </nav>
    );
}