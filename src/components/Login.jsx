import React, { useState } from 'react';
import { User, Lock, Eye, EyeOff, AlertCircle, Loader } from 'lucide-react';
import { supabase } from '../supabaseClient';
import './Login.css';

const Login = ({ onLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    if (!email || !password) {
      setError('Por favor, preencha e-mail e senha.');
      return;
    }

    setLoading(true);
    
    try {
      const { data, error: authError } = await supabase.auth.signInWithPassword({
        email: email,
        password: password,
      });

      if (authError) {
        throw authError;
      }
      
      if (data.session) {
        onLogin();
      }
    } catch (err) {
      setError('Credenciais inválidas. Verifique seu e-mail e senha.');
      console.error('Login error:', err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="login-left">
          <div className="login-logo-container">
            <img src="/FAVICON.svg" alt="CEMAC Icon" className="login-logo" />
            <span className="login-logo-text">CEMAC</span>
          </div>
        </div>
        
        <div className="login-right">
          <div className="login-header">
            <h2>Acesse sua conta</h2>
          </div>
          
          <form onSubmit={handleSubmit} className="login-form">
            {error && (
              <div className="login-error">
                <AlertCircle size={16} />
                <span>{error}</span>
              </div>
            )}
            
            <div className="input-group">
              <span className="input-icon"><User size={18} /></span>
              <input 
                type="email" 
                placeholder="E-mail" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            
            <div className="input-group">
              <span className="input-icon"><Lock size={18} /></span>
              <input 
                type={showPassword ? "text" : "password"} 
                placeholder="Senha" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="current-password"
                required
              />
              <button 
                type="button" 
                className="password-toggle"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            
            <button type="submit" className="login-button" disabled={loading}>
              {loading ? <Loader className="spin-icon" size={18} /> : 'Entrar'}
            </button>
          </form>
        </div>
      </div>
      <span style={{
        position: 'fixed',
        bottom: '10px',
        right: '14px',
        fontSize: '11px',
        color: 'rgba(255,255,255,0.5)',
        fontFamily: 'monospace',
        letterSpacing: '0.5px',
        pointerEvents: 'none',
        userSelect: 'none'
      }}>
        {__APP_VERSION__}
      </span>
    </div>
  );
};

/* eslint-disable no-undef */
export default Login;
