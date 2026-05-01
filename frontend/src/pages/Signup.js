import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { signup } from '../api';
import { useAuth } from '../AuthContext';

export default function Signup() {
  const [form, setForm] = useState({ name: '', email: '', password: '', role: 'member' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { loginUser } = useAuth();
  const navigate = useNavigate();

  const handle = async (e) => {
    e.preventDefault();
    setLoading(true); setError('');
    try {
      const { data } = await signup(form);
      loginUser(data.token, data.user);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Signup failed');
    } finally { setLoading(false); }
  };

  return (
    <div className="auth-screen">
      <div className="auth-card">
        <div className="auth-logo">&#9654; TeamFlow</div>
        <div className="auth-sub">Create your account</div>
        <form onSubmit={handle}>
          <div className="field"><label>Full Name</label><input type="text" value={form.name} onChange={e=>setForm({...form,name:e.target.value})} placeholder="Jane Doe" required /></div>
          <div className="field"><label>Email</label><input type="email" value={form.email} onChange={e=>setForm({...form,email:e.target.value})} placeholder="you@example.com" required /></div>
          <div className="field"><label>Password</label><input type="password" value={form.password} onChange={e=>setForm({...form,password:e.target.value})} placeholder="••••••••" required /></div>
          <div className="field"><label>Role</label>
            <select value={form.role} onChange={e=>setForm({...form,role:e.target.value})}>
              <option value="member">Member</option>
              <option value="admin">Admin</option>
            </select>
          </div>
          {error && <div className="error-msg">{error}</div>}
          <button className="btn btn-primary btn-block" type="submit" disabled={loading}>{loading ? 'Creating...' : 'Create Account'}</button>
        </form>
        <div className="auth-link">Already have an account? <Link to="/login">Login</Link></div>
      </div>
    </div>
  );
}
