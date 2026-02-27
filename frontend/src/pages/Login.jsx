import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const { login } = useAuth();
    const { success, error } = useToast();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await login(email, password);
            success('Welcome back! 🎉');
            navigate('/dashboard');
        } catch (err) {
            const msg = err.response?.data?.message || 'Login failed. Please try again.';
            error(msg);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-page">
            <div className="auth-container">
                <div className="auth-left">
                    <div className="auth-branding">
                        <span className="auth-logo">⚡</span>
                        <h1>TaskFlow</h1>
                        <p>Manage your tasks with ease. Stay organized, stay productive.</p>
                    </div>
                    <div className="auth-features">
                        <div className="auth-feature">
                            <span>🔒</span>
                            <div>
                                <h3>Secure Authentication</h3>
                                <p>JWT-based auth with bcrypt password hashing</p>
                            </div>
                        </div>
                        <div className="auth-feature">
                            <span>👥</span>
                            <div>
                                <h3>Role-Based Access</h3>
                                <p>Separate views for users and administrators</p>
                            </div>
                        </div>
                        <div className="auth-feature">
                            <span>📊</span>
                            <div>
                                <h3>Task Analytics</h3>
                                <p>Track progress with real-time statistics</p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="auth-right">
                    <form onSubmit={handleSubmit} className="auth-form" id="login-form">
                        <h2>Welcome back</h2>
                        <p className="auth-subtitle">Sign in to your account to continue</p>

                        <div className="form-group">
                            <label htmlFor="login-email">Email Address</label>
                            <input
                                type="email"
                                id="login-email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="you@example.com"
                                required
                                autoFocus
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="login-password">Password</label>
                            <div className="input-with-icon">
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    id="login-password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="••••••••"
                                    required
                                    minLength={6}
                                />
                                <button
                                    type="button"
                                    className="input-icon-btn"
                                    onClick={() => setShowPassword(!showPassword)}
                                    tabIndex={-1}
                                >
                                    {showPassword ? '🙈' : '👁'}
                                </button>
                            </div>
                        </div>

                        <button type="submit" className="btn btn-primary btn-block" disabled={loading} id="login-submit-btn">
                            {loading ? (
                                <>
                                    <span className="btn-spinner"></span>
                                    Signing in...
                                </>
                            ) : (
                                'Sign In'
                            )}
                        </button>

                        <p className="auth-switch">
                            Don't have an account?{' '}
                            <Link to="/register" id="go-to-register">Create one</Link>
                        </p>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default Login;
