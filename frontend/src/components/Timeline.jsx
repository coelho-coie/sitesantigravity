import React, { useState } from 'react';
import { Clock, Calendar, Bookmark, Cpu } from 'lucide-react';

const TIMELINE_EVENTS = [
  {
    year: '1963',
    date: 'Março de 1963',
    title: 'A Estreia em Tales of Suspense #39 & Vingadores #1',
    description: 'Tony Stark é ferido no peito, cria a armadura Mark I com Ho Yinsen para escapar do cativeiro e, no mesmo ano, co-funda os Vingadores.',
    badge: 'Origem & Fundação',
    comic: 'Tales of Suspense #39 / Avengers #1'
  },
  {
    year: '1968',
    date: 'Maio de 1968',
    title: 'The Invincible Iron Man #1 (Revista Solo)',
    description: 'Após anos compartilhando páginas com o Capitão América, Tony Stark ganha seu próprio título solo consagrado escrito por Archie Goodwin.',
    badge: 'Consagração',
    comic: 'The Invincible Iron Man #1'
  },
  {
    year: '1979',
    date: '1979',
    title: 'A Obra-Prima: Demônio na Garrafa',
    description: 'David Michelinie e Bob Layton humanizam Tony Stark ao enfrentar sua maior vulnerabilidade interna e o alcoolismo em uma das HQs mais premiadas da história.',
    badge: 'Saga Histórica',
    comic: 'Iron Man #120 - #128'
  },
  {
    year: '1987',
    date: '1987 - 1988',
    title: 'A Guerra das Armaduras (Armor Wars)',
    description: 'Tony Stark descobre que segredos de sua tecnologia foram pirateados e vendidos a supervilões e ao governo, iniciando uma caçada implacável pelo globo.',
    badge: 'Tecnologia Stark',
    comic: 'Iron Man #225 - #231'
  },
  {
    year: '2005',
    date: '2005 - 2006',
    title: 'Extremis & A Guerra Civil',
    description: 'Warren Ellis e Adi Granov reescrevem o mito com bio-nanotecnologia conectada ao sistema nervoso de Tony, tornando-o o epicentro da Guerra Civil.',
    badge: 'Bio-Nanotech',
    comic: 'Iron Man Vol. 4 #1-6 / Civil War'
  },
  {
    year: '2008',
    date: '2008 - 2026',
    title: 'O Fenômeno do MCU & Era Contemporânea',
    description: 'A atuação histórica de Robert Downey Jr. catapulta o Homem de Ferro ao posto de herói número 1 do cinema, inspirando novas armaduras como Model-Prime e nanobots.',
    badge: 'Era Moderna',
    comic: 'Invincible Iron Man / MCU'
  }
];

export default function Timeline() {
  const [selectedYear, setSelectedYear] = useState(TIMELINE_EVENTS[0].year);

  return (
    <section id="timeline" style={{ padding: '4.5rem 0', background: 'rgba(15, 23, 35, 0.4)' }}>
      <div className="container">
        
        {/* Header */}
        <div style={{ textAlign: 'center', maxWidth: '700px', margin: '0 auto 3rem auto' }}>
          <span className="badge">
            <Clock size={13} />
            CRONOLOGIA & DATAS HISTÓRICAS
          </span>
          <h2 style={{ fontSize: 'clamp(1.8rem, 4vw, 2.6rem)', marginTop: '0.75rem', marginBottom: '1rem' }}>
            Linha do Tempo: <span className="text-gradient-green">Marcos de Tony Stark</span>
          </h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '1rem' }}>
            Mais de seis décadas de engenharia revolucionária, sagas inesquecíveis e liderança nos Vingadores.
          </p>
        </div>

        {/* Timeline Horizontal Year Selector */}
        <div style={{
          display: 'flex',
          gap: '0.75rem',
          overflowX: 'auto',
          paddingBottom: '1.25rem',
          marginBottom: '2rem',
          scrollbarWidth: 'thin'
        }}>
          {TIMELINE_EVENTS.map((event) => {
            const isSelected = selectedYear === event.year;
            return (
              <button
                key={event.year}
                onClick={() => setSelectedYear(event.year)}
                style={{
                  padding: '0.65rem 1.25rem',
                  borderRadius: '9999px',
                  border: isSelected ? '1px solid var(--green-bright)' : '1px solid var(--glass-border)',
                  background: isSelected ? 'rgba(16, 185, 129, 0.2)' : 'rgba(16, 26, 38, 0.6)',
                  color: isSelected ? '#34d399' : 'var(--text-muted)',
                  fontWeight: isSelected ? 700 : 500,
                  fontSize: '0.95rem',
                  cursor: 'pointer',
                  whiteSpace: 'nowrap',
                  transition: 'all 0.2s ease',
                  boxShadow: isSelected ? '0 0 15px rgba(16, 185, 129, 0.3)' : 'none'
                }}
              >
                {event.year}
              </button>
            );
          })}
        </div>

        {/* Selected Event Spotlight */}
        {(() => {
          const activeEvent = TIMELINE_EVENTS.find((e) => e.year === selectedYear) || TIMELINE_EVENTS[0];
          return (
            <div className="glass-card" style={{
              padding: '2rem',
              border: '1px solid var(--green-border)',
              background: 'linear-gradient(135deg, rgba(16, 26, 38, 0.95), rgba(6, 78, 59, 0.2))'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem', marginBottom: '1rem' }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.4rem' }}>
                    <span className="badge">{activeEvent.badge}</span>
                    <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                      <Calendar size={13} style={{ display: 'inline', marginRight: '4px' }} />
                      {activeEvent.date}
                    </span>
                  </div>
                  <h3 style={{ fontSize: '1.5rem', color: '#ffffff' }}>
                    {activeEvent.title}
                  </h3>
                </div>

                <div style={{
                  padding: '0.4rem 0.85rem',
                  borderRadius: '8px',
                  background: 'rgba(0, 0, 0, 0.4)',
                  border: '1px solid var(--glass-border)',
                  fontSize: '0.82rem',
                  color: 'var(--green-bright)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.35rem'
                }}>
                  <Bookmark size={14} />
                  <span>HQ: {activeEvent.comic}</span>
                </div>
              </div>

              <p style={{ color: 'var(--text-main)', fontSize: '1rem', lineHeight: '1.7', opacity: 0.95 }}>
                {activeEvent.description}
              </p>
            </div>
          );
        })()}

      </div>
    </section>
  );
}
