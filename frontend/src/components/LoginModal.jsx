import React, { useState } from 'react';
import { X, Lock, User, Key, CheckCircle, AlertCircle, ArrowRight, Cpu } from 'lucide-react';
import { api } from '../services/api';

const QUICK_USERS = [
  { username: 'user1', role: 'Tony Stark', pass: '123' },
  { username: 'user2', role: 'Peter Parker', pass: '123' },
  { username: 'user3', role: 'Pepper Potts', pass: '123' },
];

export default function LoginModal({ isOpen, onClose, onLoginSuccess }) {
  const [username, setUsername] = useState('user1');
  const [password, setPassword] = useState('123');
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');
    setLoading(true);

    try {
      const response = await api.login(username, password);
      setSuccessMessage(response.message || 'Login autorizado com sucesso!');
      setTimeout(() => {
        onLoginSuccess(response.user);
        onClose();
      }, 700);
    } catch (err) {
      setErrorMessage(err.message || 'Falha no login. Verifique seu usuário e senha.');
    } finally {
      setLoading(false);
    }
  };

  const handleQuickFill = (u) => {
    setUsername(u.username);
    setPassword(u.pass);
    setErrorMessage('');
  };

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      zIndex: 1000,
      background: 'rgba(5, 8, 12, 0.85)',
      backdropFilter: 'blur(12px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '1.25rem'
    }} onClick={onClose}>
      <div
        className="glass-card"
        style={{
          maxWidth: '460px',
          width: '100%',
          padding: '2rem',
          border: '1px solid var(--green-border)',
          background: 'linear-gradient(135deg, rgba(16, 26, 38, 0.98), rgba(6, 78, 59, 0.35))',
          boxShadow: '0 20px 50px rgba(0, 0, 0, 0.6), 0 0 30px rgba(16, 185, 129, 0.2)',
          position: 'relative'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '16px',
            right: '16px',
            background: 'transparent',
            border: 'none',
            color: 'var(--text-muted)',
            cursor: 'pointer',
            padding: '4px'
          }}
        >
          <X size={20} />
        </button>

        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '1.75rem' }}>
          <div style={{
            width: '52px',
            height: '52px',
            borderRadius: '14px',
            background: 'linear-gradient(135deg, #10b981, #064e3b)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 1rem auto',
            boxShadow: '0 0 20px rgba(16, 185, 129, 0.4)',
            border: '1px solid rgba(52, 211, 153, 0.5)'
          }}>
            <Lock size={24} color="#ffffff" />
          </div>
          <h3 style={{ fontSize: '1.5rem', color: '#ffffff' }}>
            Autenticação Stark Industries
          </h3>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem', marginTop: '0.35rem' }}>
            Insira suas credenciais cadastradas no Django para editar o acervo de histórias.
          </p>
        </div>

        {/* Quick Test Users Selector */}
        <div style={{ marginBottom: '1.5rem' }}>
          <div style={{ fontSize: '0.78rem', color: 'var(--green-bright)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: '0.5rem' }}>
            Atalho Rápido (Contas Populadas no Banco):
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.5rem' }}>
            {QUICK_USERS.map((u) => (
              <button
                key={u.username}
                type="button"
                onClick={() => handleQuickFill(u)}
                style={{
                  padding: '0.5rem 0.4rem',
                  borderRadius: '8px',
                  border: username === u.username ? '1px solid var(--green-bright)' : '1px solid var(--glass-border)',
                  background: username === u.username ? 'rgba(16, 185, 129, 0.25)' : 'rgba(255, 255, 255, 0.03)',
                  color: username === u.username ? '#ffffff' : 'var(--text-muted)',
                  cursor: 'pointer',
                  textAlign: 'center',
                  transition: 'all 0.2s ease'
                }}
              >
                <div style={{ fontSize: '0.85rem', fontWeight: 700 }}>{u.username}</div>
                <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)' }}>{u.role}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.1rem' }}>
          
          {/* Username Input */}
          <div>
            <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-main)', marginBottom: '0.4rem' }}>
              Usuário
            </label>
            <div style={{ position: 'relative' }}>
              <User size={16} color="var(--text-muted)" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
              <input
                type="text"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Ex: user1"
                style={{
                  width: '100%',
                  padding: '0.75rem 1rem 0.75rem 2.4rem',
                  borderRadius: 'var(--radius-sm)',
                  border: '1px solid var(--glass-border)',
                  background: 'rgba(15, 23, 35, 0.8)',
                  color: '#ffffff',
                  fontSize: '0.9rem',
                  outline: 'none'
                }}
              />
            </div>
          </div>

          {/* Password Input */}
          <div>
            <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-main)', marginBottom: '0.4rem' }}>
              Senha
            </label>
            <div style={{ position: 'relative' }}>
              <Key size={16} color="var(--text-muted)" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Senha de acesso"
                style={{
                  width: '100%',
                  padding: '0.75rem 1rem 0.75rem 2.4rem',
                  borderRadius: 'var(--radius-sm)',
                  border: '1px solid var(--glass-border)',
                  background: 'rgba(15, 23, 35, 0.8)',
                  color: '#ffffff',
                  fontSize: '0.9rem',
                  outline: 'none'
                }}
              />
            </div>
          </div>

          {/* Error Message */}
          {errorMessage && (
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              padding: '0.65rem 0.85rem',
              borderRadius: '8px',
              background: 'rgba(239, 68, 68, 0.15)',
              border: '1px solid rgba(239, 68, 68, 0.4)',
              color: '#fca5a5',
              fontSize: '0.82rem'
            }}>
              <AlertCircle size={15} style={{ flexShrink: 0 }} />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Success Message */}
          {successMessage && (
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              padding: '0.65rem 0.85rem',
              borderRadius: '8px',
              background: 'rgba(16, 185, 129, 0.2)',
              border: '1px solid rgba(52, 211, 153, 0.5)',
              color: '#6ee7b7',
              fontSize: '0.82rem'
            }}>
              <CheckCircle size={15} style={{ flexShrink: 0 }} />
              <span>{successMessage}</span>
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="btn btn-primary"
            style={{ width: '100%', padding: '0.85rem', marginTop: '0.5rem' }}
          >
            {loading ? 'Validando Acesso...' : 'Entrar no Sistema'}
            {!loading && <ArrowRight size={16} />}
          </button>
        </form>

      </div>
    </div>
  );
}
