import React from 'react';
import { Sparkles, Cpu, Award, ShieldAlert, Zap, Layers } from 'lucide-react';

export default function CreationSection() {
  return (
    <section id="criacao" style={{ padding: '4rem 0', position: 'relative' }}>
      <div className="container">
        
        {/* Section Header */}
        <div style={{ textAlign: 'center', maxWidth: '750px', margin: '0 auto 3rem auto' }}>
          <span className="badge" style={{ marginBottom: '0.75rem' }}>
            <Sparkles size={13} />
            A GÊNESE DO VINGADOR BLINDADO
          </span>
          <h2 style={{ fontSize: 'clamp(1.8rem, 4vw, 2.6rem)', marginBottom: '1rem' }}>
            A Criação em 1963: <span className="text-gradient-green">Stan Lee, Larry Lieber, Don Heck & Jack Kirby</span>
          </h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '1rem', lineHeight: '1.6' }}>
            O audacioso desafio de transformar um bilionário fabricante de armas em um dos maiores defensores da humanidade na era de ouro dos quadrinhos.
          </p>
        </div>

        {/* 2-Column Feature Cards */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: '1.75rem',
          marginBottom: '2rem'
        }}>
          {/* Card 1: Stan Lee & Howard Hughes Inspiration */}
          <div className="glass-card" style={{ padding: '2rem' }}>
            <div style={{
              width: '48px',
              height: '48px',
              borderRadius: '12px',
              background: 'rgba(16, 185, 129, 0.15)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: '1.25rem',
              border: '1px solid var(--green-border)'
            }}>
              <Award size={26} color="#34d399" />
            </div>
            <h3 style={{ fontSize: '1.35rem', marginBottom: '0.75rem' }}>
              O Desafio da Guerra Fria & Howard Hughes
            </h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', lineHeight: '1.6', marginBottom: '1rem' }}>
              Em plena Guerra Fria, Stan Lee fez uma aposta consigo mesmo: criar um herói que representasse o que os jovens leitores da época mais detestavam — a indústria armamentista e o capitalismo corporativo.
            </p>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', lineHeight: '1.6', marginBottom: '1rem' }}>
              Inspirado no lendário magnata excêntrico <strong>Howard Hughes</strong>, nasceu Tony Stark: um gênio da engenharia que, após ser ferido no peito, decide redimir seus erros e proteger o mundo com suas próprias invenções.
            </p>
            <div style={{
              padding: '0.85rem 1rem',
              borderRadius: '8px',
              background: 'rgba(255, 255, 255, 0.03)',
              borderLeft: '3px solid var(--green-bright)',
              fontSize: '0.85rem',
              color: 'var(--text-green)'
            }}>
              "Eu me desafiei a criar um herói militarista e capitalista e fazer com que todos os leitores o amassem." — Stan Lee
            </div>
          </div>

          {/* Card 2: The Armor Evolution by Steve Ditko */}
          <div className="glass-card" style={{ padding: '2rem' }}>
            <div style={{
              width: '48px',
              height: '48px',
              borderRadius: '12px',
              background: 'rgba(52, 211, 153, 0.15)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: '1.25rem',
              border: '1px solid var(--green-border)'
            }}>
              <Layers size={26} color="#34d399" />
            </div>
            <h3 style={{ fontSize: '1.35rem', marginBottom: '0.75rem' }}>
              A Evolução: Mark I ao Vermelho e Ouro
            </h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', lineHeight: '1.6', marginBottom: '1rem' }}>
              A <strong>Mark I</strong> estreou cinzenta e maciça em <em>Tales of Suspense #39</em>. Na edição #40, Tony pintou-a de dourado para passar uma impressão mais nobre ao público.
            </p>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', lineHeight: '1.6' }}>
              Contudo, foi em <em>Tales of Suspense #48</em> que o lendário <strong>Steve Ditko</strong> (co-criador do Homem-Aranha) redesenhou a blindagem para o icônico traje em <strong>vermelho e ouro</strong>, substituindo placas rígidas por ligas flexíveis ultra-resistentes.
            </p>
          </div>
        </div>

        {/* Banner: Homem-Aranha & Vingadores Tech Connection */}
        <div className="glass-card" style={{
          padding: '1.75rem 2rem',
          border: '1px solid rgba(16, 185, 129, 0.3)',
          background: 'linear-gradient(135deg, rgba(16, 26, 38, 0.95), rgba(6, 78, 59, 0.25))',
          display: 'flex',
          flexDirection: 'column',
          gap: '1rem'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
            <span className="badge badge-gold">
              <Zap size={14} />
              STARK & HOMEM-ARANHA
            </span>
            <span style={{ fontWeight: 700, fontSize: '1.1rem', color: '#ffffff' }}>
              A Criação da Armadura "Aranha de Ferro" & Universo Um Novo Dia
            </span>
          </div>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.92rem', lineHeight: '1.6' }}>
            Tony Stark foi um dos primeiros a reconhecer o intelecto genial de <strong>Peter Parker</strong>, construindo para ele o lendário traje <em>Iron Spider</em> com nanotecnologia e braços de suporte articulados. A relação entre a ciência Stark e a responsabilidade de Parker é uma das pedras fundamentais da Marvel Comics.
          </p>
        </div>

      </div>
    </section>
  );
}
