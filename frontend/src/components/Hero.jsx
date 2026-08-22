import React from 'react';
import { Cpu, Sparkles, BookOpen, Image as ImageIcon, ShieldCheck, Zap, ShieldAlert } from 'lucide-react';

export default function Hero({ onExploreClick, onOpenLogin, currentUser }) {
  return (
    <section id="inicio" style={{
      position: 'relative',
      padding: '4rem 0 3.5rem 0',
      overflow: 'hidden'
    }}>
      {/* Arc Reactor Glow Ambient Effect */}
      <div style={{
        position: 'absolute',
        top: '-100px',
        left: '50%',
        transform: 'translateX(-50%)',
        width: '680px',
        height: '460px',
        background: 'radial-gradient(circle, rgba(16, 185, 129, 0.2) 0%, rgba(6, 78, 59, 0.1) 45%, transparent 75%)',
        filter: 'blur(70px)',
        pointerEvents: 'none',
        zIndex: 0
      }} />

      <div className="container" style={{ position: 'relative', zIndex: 1 }}>
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          textAlign: 'center',
          maxWidth: '840px',
          margin: '0 auto'
        }}>
          {/* Top Badges */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', justifyContent: 'center', marginBottom: '1.25rem' }}>
            <span className="badge pulse-glow">
              <Cpu size={13} />
              STARK INDUSTRIES
            </span>
            <span className="badge badge-crimson">
              <Zap size={13} />
              HOMEM-ARANHA & VINGADORES
            </span>
            <span className="badge badge-gold">
              <Sparkles size={13} />
              TECNOLOGIA ARC REACTOR
            </span>
          </div>

          {/* Main Title */}
          <h1 style={{
            fontSize: 'clamp(2.3rem, 6vw, 3.8rem)',
            fontWeight: 900,
            lineHeight: 1.15,
            letterSpacing: '-0.03em',
            marginBottom: '1.25rem'
          }}>
            Homem de Ferro: <br />
            <span className="text-gradient-green">Origens, Armaduras & Genialidade</span>
          </h1>

          {/* Subtitle */}
          <p style={{
            fontSize: 'clamp(1rem, 2.5vw, 1.2rem)',
            color: 'var(--text-muted)',
            lineHeight: 1.6,
            marginBottom: '2rem',
            maxWidth: '740px'
          }}>
            Da forja épica da armadura Mark I concebida por <strong>Stan Lee, Larry Lieber, Don Heck e Jack Kirby</strong> em 1963 às revoluções da nanotecnologia e a dinâmica com o <strong>Homem-Aranha</strong>. Portal completo com banco de dados Django, 6 slots de fotos e controle de acesso com <strong>user1, user2 e user3</strong>.
          </p>

          {/* CTA Buttons */}
          <div style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: '1rem',
            justifyContent: 'center',
            marginBottom: '3rem'
          }}>
            <a href="#criacao" className="btn btn-primary" style={{ padding: '0.85rem 1.75rem', fontSize: '1rem' }}>
              <BookOpen size={18} />
              Explorar Criação & Armaduras
            </a>
            <a href="#galeria" className="btn btn-secondary" style={{ padding: '0.85rem 1.5rem', fontSize: '1rem' }}>
              <ImageIcon size={18} />
              Galeria de 6 Fotos (/media)
            </a>
            {!currentUser && (
              <button onClick={onOpenLogin} className="btn btn-outline-green" style={{ padding: '0.85rem 1.5rem', fontSize: '1rem' }}>
                <ShieldCheck size={18} />
                Entrar para Editar (user1/2/3)
              </button>
            )}
          </div>

          {/* Stat Pillars */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
            gap: '1rem',
            width: '100%'
          }}>
            <div className="glass-card" style={{ padding: '1.25rem 1rem', textAlign: 'center' }}>
              <div style={{ fontSize: '1.85rem', fontWeight: 800, color: 'var(--green-bright)', fontFamily: 'var(--font-heading)' }}>
                1963
              </div>
              <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Estreia (Tales of Suspense #39)
              </div>
            </div>

            <div className="glass-card" style={{ padding: '1.25rem 1rem', textAlign: 'center' }}>
              <div style={{ fontSize: '1.85rem', fontWeight: 800, color: '#fcd34d', fontFamily: 'var(--font-heading)' }}>
                6 Fotos
              </div>
              <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Slots na Pasta /media
              </div>
            </div>

            <div className="glass-card" style={{ padding: '1.25rem 1rem', textAlign: 'center' }}>
              <div style={{ fontSize: '1.85rem', fontWeight: 800, color: '#6ee7b7', fontFamily: 'var(--font-heading)' }}>
                3 Usuários
              </div>
              <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                user1, user2, user3
              </div>
            </div>

            <div className="glass-card" style={{ padding: '1.25rem 1rem', textAlign: 'center' }}>
              <div style={{ fontSize: '1.85rem', fontWeight: 800, color: '#38bdf8', fontFamily: 'var(--font-heading)' }}>
                Mark LXXXV
              </div>
              <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Evolução de Armaduras
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
