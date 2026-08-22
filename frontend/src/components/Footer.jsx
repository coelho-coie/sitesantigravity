import React, { useState } from 'react';
import { Mail, Phone, MapPin, ExternalLink, RefreshCw, Cpu } from 'lucide-react';
import { api } from '../services/api';

export default function Footer({ onSeedDatabase }) {
  const [resetting, setResetting] = useState(false);
  const [resetMsg, setResetMsg] = useState('');

  const handleReset = async () => {
    if (!window.confirm('Deseja restaurar os dados originais do banco de dados (user1, user2, user3 e histórias do Homem de Ferro)?')) {
      return;
    }
    setResetting(true);
    try {
      await api.seedDatabase();
      setResetMsg('Banco do Homem de Ferro restaurado com sucesso!');
      if (onSeedDatabase) onSeedDatabase();
      setTimeout(() => setResetMsg(''), 3000);
    } catch (err) {
      alert('Erro ao restaurar banco: ' + err.message);
    } finally {
      setResetting(false);
    }
  };

  return (
    <footer id="empresa" style={{
      background: '#05080c',
      borderTop: '1px solid var(--glass-border)',
      padding: '4rem 0 2rem 0',
      position: 'relative'
    }}>
      <div className="container">
        
        {/* Main Footer Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
          gap: '2.5rem',
          marginBottom: '3rem'
        }}>
          
          {/* Column 1: Company Profile */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '1rem' }}>
              <div style={{
                width: '36px',
                height: '36px',
                borderRadius: '8px',
                background: 'linear-gradient(135deg, #10b981, #064e3b)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 0 12px rgba(16, 185, 129, 0.4)'
              }}>
                <Cpu size={20} color="#ffffff" />
              </div>
              <span style={{ fontSize: '1.2rem', fontWeight: 800, fontFamily: 'var(--font-heading)' }}>
                STARK HUB <span style={{ color: 'var(--green-bright)', fontSize: '0.8rem' }}>TECH</span>
              </span>
            </div>

            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', lineHeight: '1.6', marginBottom: '1.25rem' }}>
              Portal de acervo histórico, engenharia e cultura dedicado ao universo do Homem de Ferro (Tony Stark), Vingadores e heróis Marvel.
            </p>

            <div style={{ fontSize: '0.78rem', color: 'var(--text-dim)', lineHeight: '1.5' }}>
              <strong>Razão Social:</strong> Stark Industries & Marvel Tech Labs Brasil Ltda.<br />
              <strong>CNPJ:</strong> 33.491.812/0001-44<br />
              <strong>Inscrição Estadual:</strong> 114.982.551.201
            </div>
          </div>

          {/* Column 2: Navigation & Quick Links */}
          <div>
            <h4 style={{ fontSize: '0.95rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--green-bright)', marginBottom: '1rem' }}>
              Navegação do Portal
            </h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.6rem', fontSize: '0.88rem', color: 'var(--text-muted)' }}>
              <li><a href="#inicio" style={{ transition: 'color 0.2s ease' }}>• Início & Destaques</a></li>
              <li><a href="#criacao" style={{ transition: 'color 0.2s ease' }}>• Origens (Stan Lee & Don Heck)</a></li>
              <li><a href="#timeline" style={{ transition: 'color 0.2s ease' }}>• Cronologia & Linha do Tempo</a></li>
              <li><a href="#gibis" style={{ transition: 'color 0.2s ease' }}>• Gibis & Armaduras Clássicas</a></li>
              <li><a href="#galeria" style={{ transition: 'color 0.2s ease' }}>• Galeria de 6 Fotos (/media)</a></li>
              <li>
                <a href="/admin/" target="_blank" rel="noopener noreferrer" style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', color: '#6ee7b7' }}>
                  • Painel Django Admin <ExternalLink size={12} />
                </a>
              </li>
            </ul>
          </div>

          {/* Column 3: Corporate Contact */}
          <div>
            <h4 style={{ fontSize: '0.95rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--green-bright)', marginBottom: '1rem' }}>
              Atendimento & Contato
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Mail size={15} color="var(--green-bright)" />
                <span>contato@starkhub.com.br</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Phone size={15} color="var(--green-bright)" />
                <span>+55 (11) 4004-1963</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem' }}>
                <MapPin size={15} color="var(--green-bright)" style={{ marginTop: '2px', flexShrink: 0 }} />
                <span>Stark Tower Brasil - Av. Paulista, 1000 - São Paulo, SP</span>
              </div>
            </div>
          </div>

          {/* Column 4: System Tools & Seed */}
          <div>
            <h4 style={{ fontSize: '0.95rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--green-bright)', marginBottom: '1rem' }}>
              Ferramentas de Teste
            </h4>
            <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginBottom: '1rem', lineHeight: '1.5' }}>
              Ambiente com deploy nativo no <strong>Vercel</strong> e backend <strong>Django 5</strong> com REST Framework.
            </p>

            <button
              onClick={handleReset}
              disabled={resetting}
              className="btn btn-secondary btn-sm"
              style={{ width: '100%', gap: '0.4rem', fontSize: '0.8rem' }}
            >
              <RefreshCw size={13} className={resetting ? 'spin' : ''} />
              <span>{resetting ? 'Restaurando...' : 'Repopular Banco (Seed)'}</span>
            </button>

            {resetMsg && (
              <div style={{ fontSize: '0.75rem', color: 'var(--green-bright)', marginTop: '0.5rem', textAlign: 'center' }}>
                {resetMsg}
              </div>
            )}
          </div>

        </div>

        {/* Legal Disclaimer & Copyright */}
        <div style={{
          borderTop: '1px solid rgba(255, 255, 255, 0.06)',
          paddingTop: '1.75rem',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '1rem',
          fontSize: '0.78rem',
          color: 'var(--text-dim)'
        }}>
          <div>
            © {new Date().getFullYear()} Stark Industries & Marvel Hub. Todos os direitos reservados.
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            Construído com Python, Django & React • Pronto para Vercel
          </div>
        </div>

      </div>
    </footer>
  );
}
