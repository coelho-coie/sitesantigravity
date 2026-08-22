import React, { useState } from 'react';
import { Shield, Cpu, User, LogIn, LogOut, PlusCircle, Menu, X, BookOpen, Clock, Image, Info, Zap } from 'lucide-react';

export default function Header({ currentUser, onOpenLogin, onLogout, onOpenNewStory }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { label: 'Início', href: '#inicio', icon: Zap },
    { label: 'Criação & Origem', href: '#criacao', icon: BookOpen },
    { label: 'Linha do Tempo', href: '#timeline', icon: Clock },
    { label: 'Gibis & Sagas', href: '#gibis', icon: BookOpen },
    { label: 'Galeria (6 Fotos)', href: '#galeria', icon: Image },
    { label: 'Empresa', href: '#empresa', icon: Info },
  ];

  return (
    <header style={{
      position: 'sticky',
      top: 0,
      zIndex: 100,
      background: 'rgba(8, 12, 17, 0.92)',
      backdropFilter: 'blur(16px)',
      borderBottom: '1px solid var(--glass-border)',
      transition: 'all 0.3s ease'
    }}>
      <div className="container" style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        height: '72px'
      }}>
        {/* Brand Logo */}
        <a href="#inicio" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div style={{
            width: '42px',
            height: '42px',
            borderRadius: '10px',
            background: 'linear-gradient(135deg, #10b981, #064e3b)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 0 18px rgba(16, 185, 129, 0.5)',
            border: '1px solid rgba(52, 211, 153, 0.4)'
          }}>
            <Cpu size={22} color="#ffffff" />
          </div>
          <div>
            <div style={{
              fontFamily: 'var(--font-heading)',
              fontWeight: 800,
              fontSize: '1.25rem',
              letterSpacing: '-0.02em',
              display: 'flex',
              alignItems: 'center',
              gap: '0.35rem'
            }}>
              <span className="text-gradient">IRON MAN</span>
              <span style={{ color: 'var(--green-bright)', fontSize: '0.82rem', fontWeight: 600, opacity: 0.9 }}>• STARK HUB</span>
            </div>
            <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)', letterSpacing: '0.04em' }}>
              PROJETO DJANGO & REACT
            </div>
          </div>
        </a>

        {/* Desktop Navigation */}
        <nav style={{
          display: 'none',
          alignItems: 'center',
          gap: '1.5rem',
        }} className="desktop-nav">
          {navLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              style={{
                fontSize: '0.88rem',
                fontWeight: 500,
                color: 'var(--text-muted)',
                transition: 'color 0.2s ease',
                display: 'flex',
                alignItems: 'center',
                gap: '0.35rem'
              }}
              onMouseEnter={(e) => e.currentTarget.style.color = '#34d399'}
              onMouseLeave={(e) => e.currentTarget.style.color = 'var(--text-muted)'}
            >
              {link.label}
            </a>
          ))}
        </nav>

        {/* Auth / Action Area */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          {currentUser ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
              <button
                onClick={onOpenNewStory}
                className="btn btn-primary btn-sm"
                title="Adicionar Nova História"
                style={{ gap: '0.35rem' }}
              >
                <PlusCircle size={15} />
                <span className="btn-text-hide-mobile">Nova História</span>
              </button>

              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.45rem',
                padding: '0.35rem 0.75rem',
                borderRadius: '9999px',
                background: 'rgba(16, 185, 129, 0.1)',
                border: '1px solid var(--green-border)',
                fontSize: '0.82rem'
              }}>
                <User size={14} color="#34d399" />
                <span style={{ fontWeight: 600, color: 'var(--green-bright)' }}>{currentUser.username}</span>
              </div>

              <button
                onClick={onLogout}
                className="btn btn-secondary btn-sm"
                title="Sair da Conta"
                style={{ padding: '0.45rem 0.65rem' }}
              >
                <LogOut size={15} />
              </button>
            </div>
          ) : (
            <button
              onClick={onOpenLogin}
              className="btn btn-outline-green btn-sm"
              style={{ gap: '0.4rem' }}
            >
              <LogIn size={15} />
              <span>Login / Editar</span>
            </button>
          )}

          {/* Mobile Menu Toggle Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="mobile-menu-btn"
            style={{
              background: 'transparent',
              border: '1px solid var(--glass-border)',
              borderRadius: '8px',
              padding: '0.45rem',
              color: 'var(--text-main)',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
            aria-label="Abrir Menu"
          >
            {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div style={{
          background: 'rgba(15, 23, 35, 0.98)',
          borderBottom: '1px solid var(--green-border)',
          padding: '1.25rem',
          display: 'flex',
          flexDirection: 'column',
          gap: '1rem'
        }}>
          {navLinks.map((link) => {
            const Icon = link.icon;
            return (
              <a
                key={link.label}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.75rem',
                  padding: '0.6rem 0.8rem',
                  borderRadius: '8px',
                  color: 'var(--text-main)',
                  fontWeight: 500,
                  background: 'rgba(255, 255, 255, 0.03)'
                }}
              >
                <Icon size={18} color="#34d399" />
                <span>{link.label}</span>
              </a>
            );
          })}
        </div>
      )}

      <style>{`
        @media (min-width: 900px) {
          .desktop-nav {
            display: flex !important;
          }
          .mobile-menu-btn {
            display: none !important;
          }
        }
        @media (max-width: 600px) {
          .btn-text-hide-mobile {
            display: none;
          }
        }
      `}</style>
    </header>
  );
}
