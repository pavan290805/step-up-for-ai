import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import authCss from '../legacy/auth.css?raw';
import { useLegacyStyle } from '../hooks/useLegacyStyle.js';

const AUTH_KEY = 'stepup_auth';
const USERS_KEY = 'stepup_users';

function isValidEmail(value) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

export default function AuthPage() {
  const navigate = useNavigate();
  const [view, setView] = useState(window.location.hash === '#signup' ? 'signup' : 'login');
  const [toast, setToast] = useState(null);

  useLegacyStyle('stepup-auth-style', authCss);

  useEffect(() => {
    document.title = 'StepUp for AI - Welcome';
    try {
      const auth = JSON.parse(localStorage.getItem(AUTH_KEY));
      if (auth?.loggedIn) {
        navigate('/admin#/admin/dashboard', { replace: true });
      }
    } catch {
      localStorage.removeItem(AUTH_KEY);
    }
  }, [navigate]);

  useEffect(() => {
    const onHashChange = () => setView(window.location.hash === '#signup' ? 'signup' : 'login');
    window.addEventListener('hashchange', onHashChange);
    return () => window.removeEventListener('hashchange', onHashChange);
  }, []);

  function showToast(message, type = 'success') {
    setToast({ message, type });
    window.setTimeout(() => setToast(null), 3000);
  }

  return (
    <>
      <div className={`toast ${toast ? `${toast.type} show` : ''}`}>{toast?.message}</div>
      <div id="auth-experience">
        {view === 'signup' ? (
          <SignupPage showToast={showToast} />
        ) : (
          <LoginPage showToast={showToast} navigate={navigate} />
        )}
      </div>
    </>
  );
}

function LoginPage({ showToast, navigate }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  function handleSubmit(event) {
    event.preventDefault();
    const nextErrors = {};

    if (!email.trim() || !isValidEmail(email.trim())) nextErrors.email = true;
    if (!password) nextErrors.password = true;

    setErrors(nextErrors);
    if (Object.keys(nextErrors).length) return;

    setSubmitting(true);
    window.setTimeout(() => {
      localStorage.setItem(
        AUTH_KEY,
        JSON.stringify({ email: email.trim(), role: 'admin', loggedIn: true, timestamp: Date.now() })
      );
      showToast('Login successful! Redirecting...', 'success');
      window.setTimeout(() => navigate('/admin#/admin/dashboard'), 800);
    }, 1200);
  }

  return (
    <div className="auth-page">
      <BrandPanel
        tagline="AI-powered startup incubator connecting students, recruiters, and investors for the next generation of innovation."
        features={[
          ['red', 'fa-rocket', 'Launch & manage startup pitch events'],
          ['green', 'fa-graduation-cap', 'Track student registrations & progress'],
          ['blue', 'fa-briefcase', 'Connect recruiters with top talent'],
          ['orange', 'fa-hand-holding-dollar', 'Manage investor interest & funding']
        ]}
      />

      <div className="auth-form-panel">
        <div className="auth-card">
          <div className="auth-card-header">
            <h1>Welcome Back</h1>
            <p>Sign in to your admin dashboard</p>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label" htmlFor="login-email">Email Address</label>
              <div className="form-input-wrapper">
                <i className="fa-solid fa-envelope field-icon" />
                <input
                  type="email"
                  className="form-input"
                  id="login-email"
                  placeholder="admin@stepupforai.com"
                  required
                  autoComplete="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                />
              </div>
              <FormError visible={errors.email}>Please enter a valid email address</FormError>
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="login-password">Password</label>
              <div className="form-input-wrapper">
                <i className="fa-solid fa-lock field-icon" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  className="form-input"
                  id="login-password"
                  placeholder="Enter your password"
                  required
                  autoComplete="current-password"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                />
                <button type="button" className="password-toggle" onClick={() => setShowPassword((value) => !value)}>
                  <i className={`fa-solid ${showPassword ? 'fa-eye-slash' : 'fa-eye'}`} />
                </button>
              </div>
              <FormError visible={errors.password}>Password is required</FormError>
            </div>

            <div className="form-checkbox-row">
              <label className="form-checkbox-label">
                <input type="checkbox" /> Remember me
              </label>
              <a href="#" className="form-link" onClick={(event) => {
                event.preventDefault();
                showToast('Reset link sent to your email!', 'success');
              }}>Forgot password?</a>
            </div>

            <button type="submit" className="btn-primary" disabled={submitting}>
              <i className={`fa-solid ${submitting ? 'fa-spinner fa-spin' : 'fa-arrow-right-to-bracket'}`} />
              &nbsp; {submitting ? 'Signing in...' : 'Sign In'}
            </button>
          </form>

          <div className="auth-divider"><span>or continue with</span></div>
          <SocialButton icon="fa-google" label="Continue with Google" onClick={() => showToast('Google SSO coming soon', 'success')} />
          <SocialButton icon="fa-github" label="Continue with GitHub" onClick={() => showToast('GitHub SSO coming soon', 'success')} />

          <div className="auth-footer">
            Don't have an account? <a href="#signup">Create Account</a>
          </div>
        </div>
      </div>
    </div>
  );
}

function SignupPage({ showToast }) {
  const [selectedRole, setSelectedRole] = useState('student');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState({});
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    confirm: '',
    terms: false
  });

  const score = getPasswordScore(form.password);
  const strengthClass = ['', 'weak', 'medium', 'medium', 'strong'][score];
  const strengthText = ['', 'Weak', 'Fair', 'Good', 'Strong'][score] || '';

  function updateField(field, value) {
    setForm((current) => ({ ...current, [field]: value }));
  }

  function handleSubmit(event) {
    event.preventDefault();
    const nextErrors = {};

    if (!form.name.trim()) nextErrors.name = true;
    if (!form.email.trim() || !isValidEmail(form.email.trim())) nextErrors.email = true;
    if (!form.password || form.password.length < 8) nextErrors.password = true;
    if (form.password !== form.confirm) nextErrors.confirm = true;
    if (!form.terms) {
      nextErrors.terms = true;
      showToast('Please accept the Terms of Service', 'error');
    }

    setErrors(nextErrors);
    if (Object.keys(nextErrors).length) return;

    setSubmitting(true);
    window.setTimeout(() => {
      const users = JSON.parse(localStorage.getItem(USERS_KEY) || '[]');
      users.push({
        id: Date.now(),
        name: form.name.trim(),
        email: form.email.trim(),
        role: selectedRole,
        status: selectedRole === 'student' ? 'active' : 'pending',
        createdAt: new Date().toISOString()
      });
      localStorage.setItem(USERS_KEY, JSON.stringify(users));
      showToast('Account created successfully!', 'success');
      window.setTimeout(() => {
        window.location.hash = '#login';
      }, 1000);
    }, 1500);
  }

  return (
    <div className="auth-page">
      <BrandPanel
        tagline="Join thousands of innovators building the future with AI-powered incubation, mentorship, and funding opportunities."
        features={[
          ['red', 'fa-graduation-cap', 'Students - Access webinars, hackathons & internships'],
          ['blue', 'fa-briefcase', 'Recruiters - Post jobs & find top AI talent'],
          ['orange', 'fa-hand-holding-dollar', 'Investors - Discover & fund promising startups']
        ]}
      />

      <div className="auth-form-panel">
        <div className="auth-card">
          <div className="auth-card-header">
            <h1>Create Account</h1>
            <p>Join the StepUp for AI ecosystem</p>
          </div>

          <form onSubmit={handleSubmit}>
            <label className="form-label">I am a</label>
            <div className="role-selector">
              {[
                ['student', 'fa-graduation-cap', 'Student'],
                ['recruiter', 'fa-briefcase', 'Recruiter'],
                ['investor', 'fa-hand-holding-dollar', 'Investor']
              ].map(([role, icon, label]) => (
                <button
                  key={role}
                  type="button"
                  className={`role-option ${selectedRole === role ? 'selected' : ''}`}
                  onClick={() => setSelectedRole(role)}
                >
                  <i className={`fa-solid ${icon}`} />
                  <span>{label}</span>
                </button>
              ))}
            </div>

            <InputField
              id="signup-name"
              label="Full Name"
              icon="fa-user"
              placeholder="John Doe"
              value={form.name}
              onChange={(value) => updateField('name', value)}
              error={errors.name}
              errorText="Name is required"
            />

            <InputField
              id="signup-email"
              label="Email Address"
              icon="fa-envelope"
              type="email"
              placeholder="you@example.com"
              value={form.email}
              onChange={(value) => updateField('email', value)}
              error={errors.email}
              errorText="Please enter a valid email"
            />

            <PasswordField
              id="signup-password"
              label="Password"
              placeholder="Minimum 8 characters"
              value={form.password}
              visible={showPassword}
              setVisible={setShowPassword}
              onChange={(value) => updateField('password', value)}
              error={errors.password}
              errorText="Password must be at least 8 characters"
            >
              <div className="password-strength">
                {[0, 1, 2, 3].map((index) => (
                  <div key={index} className={`strength-bar ${index < score ? strengthClass : ''}`} />
                ))}
              </div>
              <div className="strength-text">{strengthText}</div>
            </PasswordField>

            <PasswordField
              id="signup-confirm"
              label="Confirm Password"
              placeholder="Re-enter password"
              value={form.confirm}
              visible={showConfirm}
              setVisible={setShowConfirm}
              onChange={(value) => updateField('confirm', value)}
              error={errors.confirm}
              errorText="Passwords do not match"
              icon="fa-shield-halved"
            />

            <div className="form-checkbox-row" style={{ justifyContent: 'flex-start' }}>
              <label className="form-checkbox-label">
                <input
                  type="checkbox"
                  checked={form.terms}
                  onChange={(event) => updateField('terms', event.target.checked)}
                  required
                />
                {' '}I agree to the <a href="#" className="form-link">Terms</a> and <a href="#" className="form-link">Privacy Policy</a>
              </label>
            </div>

            <button type="submit" className="btn-primary" disabled={submitting}>
              <i className={`fa-solid ${submitting ? 'fa-spinner fa-spin' : 'fa-user-plus'}`} />
              &nbsp; {submitting ? 'Creating account...' : 'Create Account'}
            </button>
          </form>

          <div className="auth-divider"><span>or sign up with</span></div>
          <SocialButton icon="fa-google" label="Sign up with Google" onClick={() => showToast('Google SSO coming soon', 'success')} />

          <div className="auth-footer">
            Already have an account? <a href="#login">Sign In</a>
          </div>
        </div>
      </div>
    </div>
  );
}

function BrandPanel({ tagline, features }) {
  return (
    <div className="auth-brand-panel">
      <div className="brand-logo">
        <span className="logo-top">step up</span>
        <span className="logo-bottom">for <span className="logo-accent">AI</span></span>
      </div>
      <p className="brand-tagline">{tagline}</p>
      <div className="brand-features">
        {features.map(([color, icon, text]) => (
          <div className="brand-feature" key={text}>
            <div className={`brand-feature-icon ${color}`}>
              <i className={`fa-solid ${icon}`} />
            </div>
            <span className="brand-feature-text">{text}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function FormError({ visible, children }) {
  return (
    <div className={`form-error ${visible ? 'visible' : ''}`}>
      <i className="fa-solid fa-circle-exclamation" />
      <span>{children}</span>
    </div>
  );
}

function SocialButton({ icon, label, onClick }) {
  return (
    <button className="btn-social" type="button" onClick={onClick}>
      <i className={`fa-brands ${icon}`} /> {label}
    </button>
  );
}

function InputField({ id, label, icon, type = 'text', placeholder, value, onChange, error, errorText }) {
  return (
    <div className="form-group">
      <label className="form-label" htmlFor={id}>{label}</label>
      <div className="form-input-wrapper">
        <i className={`fa-solid ${icon} field-icon`} />
        <input
          type={type}
          className="form-input"
          id={id}
          placeholder={placeholder}
          required
          value={value}
          onChange={(event) => onChange(event.target.value)}
        />
      </div>
      <FormError visible={error}>{errorText}</FormError>
    </div>
  );
}

function PasswordField({
  id,
  label,
  placeholder,
  value,
  visible,
  setVisible,
  onChange,
  error,
  errorText,
  icon = 'fa-lock',
  children
}) {
  return (
    <div className="form-group">
      <label className="form-label" htmlFor={id}>{label}</label>
      <div className="form-input-wrapper">
        <i className={`fa-solid ${icon} field-icon`} />
        <input
          type={visible ? 'text' : 'password'}
          className="form-input"
          id={id}
          placeholder={placeholder}
          required
          value={value}
          onChange={(event) => onChange(event.target.value)}
        />
        <button type="button" className="password-toggle" onClick={() => setVisible((current) => !current)}>
          <i className={`fa-solid ${visible ? 'fa-eye-slash' : 'fa-eye'}`} />
        </button>
      </div>
      {children}
      <FormError visible={error}>{errorText}</FormError>
    </div>
  );
}

function getPasswordScore(value) {
  if (!value) return 0;
  let score = 0;
  if (value.length >= 8) score += 1;
  if (/[A-Z]/.test(value)) score += 1;
  if (/[0-9]/.test(value)) score += 1;
  if (/[^A-Za-z0-9]/.test(value)) score += 1;
  return score;
}
