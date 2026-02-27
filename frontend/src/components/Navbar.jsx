import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function Navbar() {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <nav className="navbar" id="main-navbar">
            <div className="navbar-container">
                <Link to="/dashboard" className="navbar-brand">
                    <span className="navbar-logo">⚡</span>
                    <span className="navbar-title">TaskFlow</span>
                </Link>

                <div className="navbar-right">
                    {user ? (
                        <>
                            <div className="navbar-user-info">
                                <div className="navbar-avatar" id="user-avatar">
                                    {user.name.charAt(0).toUpperCase()}
                                </div>
                                <div className="navbar-user-details">
                                    <span className="navbar-username">{user.name}</span>
                                    <span className={`navbar-role ${user.role === 'admin' ? 'role-admin' : 'role-user'}`}>
                                        {user.role}
                                    </span>
                                </div>
                            </div>
                            <button onClick={handleLogout} className="btn btn-ghost" id="logout-btn">
                                <span>Logout</span>
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                                    <polyline points="16 17 21 12 16 7" />
                                    <line x1="21" y1="12" x2="9" y2="12" />
                                </svg>
                            </button>
                        </>
                    ) : (
                        <div className="navbar-auth-links">
                            <Link to="/login" className="btn btn-ghost" id="nav-login-btn">Login</Link>
                            <Link to="/register" className="btn btn-primary" id="nav-register-btn">Sign Up</Link>
                        </div>
                    )}
                </div>
            </div>
        </nav>
    );
}

export default Navbar;
