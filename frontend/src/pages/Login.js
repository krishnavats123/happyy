import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { login } from '../api';
import { useAuth } from '../AuthContext';

export default function Login() {
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { loginUser } = useAuth();
  const navigate = useNavigate();

  const handle = async (e) => {
    e.preventDefault();
    setLoading(true); setError('');
    try {
      const { data } = await login(form);
      loginUser(data.token, data.user);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
    } finally { setLoading(false); }
  };

  return (
    <div className="auth-screen">
      <div className="auth-card">
        <div className="auth-logo">&#9654; TeamFlow</div>
        <div className="auth-sub">Sign in to your workspace</div>
        <form onSubmit={handle}>
          <div className="field"><label>Email</label><input type="email" value={form.email} onChange={e=>setForm({...form,email:e.target.value})} placeholder="you@example.com" required /></div>
          <div className="field"><label>Password</label><input type="password" value={form.password} onChange={e=>setForm({...form,password:e.target.value})} placeholder="••••••••" required /></div>
          {error && <div className="error-msg">{error}</div>}
          <button className="btn btn-primary btn-block" type="submit" disabled={loading}>{loading ? 'Signing in...' : 'Login'}</button>
        </form>
        <div className="auth-link">Don't have an account? <Link to="/signup">Sign up</Link></div>
      </div>
    </div>
  );
}
