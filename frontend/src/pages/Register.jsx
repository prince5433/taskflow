import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

function Register() {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: '',
    });
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const { register } = useAuth();
    const { success, error } = useToast();
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (formData.password !== formData.confirmPassword) {
            error('Passwords do not match');
            return;
        }

        setLoading(true);
        try {
            await register(formData.name, formData.email, formData.password);
            success('Account created successfully! 🚀');
            navigate('/dashboard');
        } catch (err) {
            const msg = err.response?.data?.message || 'Registration failed. Please try again.';
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
                        <p>Join thousands of users managing tasks smarter.</p>
                    </div>
                    <div className="auth-features">
                        <div className="auth-feature">
                            <span>🚀</span>
                            <div>
                                <h3>Get Started Fast</h3>
                                <p>Create your account in seconds</p>
                            </div>
                        </div>
                        <div className="auth-feature">
                            <span>📱</span>
                            <div>
                                <h3>Responsive Design</h3>
                                <p>Works beautifully on any device</p>
                            </div>
                        </div>
                        <div className="auth-feature">
                            <span>⚡</span>
                            <div>
                                <h3>Lightning Fast</h3>
                                <p>Built with performance in mind</p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="auth-right">
                    <form onSubmit={handleSubmit} className="auth-form" id="register-form">
                        <h2>Create account</h2>
                        <p className="auth-subtitle">Start managing your tasks today</p>

                        <div className="form-group">
                            <label htmlFor="register-name">Full Name</label>
                            <input
                                type="text"
                                id="register-name"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                placeholder="John Doe"
                                required
                                minLength={2}
                                maxLength={50}
                                autoFocus
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="register-email">Email Address</label>
                            <input
                                type="email"
                                id="register-email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                placeholder="you@example.com"
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="register-password">Password</label>
                            <div className="input-with-icon">
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    id="register-password"
                                    name="password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    placeholder="Min. 6 characters"
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

                        <div className="form-group">
                            <label htmlFor="register-confirm-password">Confirm Password</label>
                            <input
                                type="password"
                                id="register-confirm-password"
                                name="confirmPassword"
                                value={formData.confirmPassword}
                                onChange={handleChange}
                                placeholder="••••••••"
                                required
                                minLength={6}
                            />
                        </div>

                        <button type="submit" className="btn btn-primary btn-block" disabled={loading} id="register-submit-btn">
                            {loading ? (
                                <>
                                    <span className="btn-spinner"></span>
                                    Creating account...
                                </>
                            ) : (
                                'Create Account'
                            )}
                        </button>

                        <p className="auth-switch">
                            Already have an account?{' '}
                            <Link to="/login" id="go-to-login">Sign in</Link>
                        </p>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default Register;
