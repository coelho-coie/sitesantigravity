import React, { useState } from 'react';
import { BookOpen, Search, Edit3, Trash2, PlusCircle, Tag, Calendar, UserCheck, Cpu } from 'lucide-react';

const CATEGORIES = [
  { id: 'ALL', label: 'Todas as Histórias' },
  { id: 'CRIACAO', label: 'Criação & Origem' },
  { id: 'ARMADURAS', label: 'Armaduras & Tecnologia Arc' },
  { id: 'DATAS', label: 'Datas Históricas' },
  { id: 'GIBIS', label: 'Gibis Clássicos' },
  { id: 'CROSSOVER', label: 'Vingadores & Homem-Aranha' },
  { id: 'CURIOSIDADES', label: 'Curiosidades & Fatos' },
];

export default function ComicsSection({
  curiosities,
  loading,
  currentUser,
  onEditStory,
  onDeleteStory,
  onNewStory,
}) {
  const [activeCategory, setActiveCategory] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredCuriosities = curiosities.filter((item) => {
    const matchesCategory = activeCategory === 'ALL' || item.category === activeCategory;
    const matchesSearch =
      !searchQuery ||
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (item.content && item.content.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (item.comic_issue && item.comic_issue.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  return (
    <section id="gibis" style={{ padding: '4.5rem 0' }}>
      <div className="container">
        
        {/* Section Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: '1.5rem', marginBottom: '2.5rem' }}>
          <div>
            <span className="badge" style={{ marginBottom: '0.6rem' }}>
              <BookOpen size={13} />
              GIBIS, SAGAS & ARMADURAS
            </span>
            <h2 style={{ fontSize: 'clamp(1.8rem, 4vw, 2.5rem)' }}>
              Acervo de Histórias do <span className="text-gradient-green">Homem de Ferro</span>
            </h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', marginTop: '0.4rem' }}>
              Histórias armazenadas no banco de dados Django (editáveis por usuários autenticados).
            </p>
          </div>

          {currentUser && (
            <button onClick={onNewStory} className="btn btn-primary" style={{ gap: '0.4rem' }}>
              <PlusCircle size={17} />
              Adicionar História
            </button>
          )}
        </div>

        {/* Search & Filter Bar */}
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '1rem',
          marginBottom: '2rem'
        }}>
          {/* Search Input */}
          <div style={{
            position: 'relative',
            width: '100%',
            maxWidth: '450px'
          }}>
            <Search size={18} color="var(--text-muted)" style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)' }} />
            <input
              type="text"
              placeholder="Buscar por armadura, saga, criador ou edição..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                width: '100%',
                padding: '0.75rem 1rem 0.75rem 2.6rem',
                borderRadius: 'var(--radius-sm)',
                border: '1px solid var(--glass-border)',
                background: 'rgba(16, 26, 38, 0.6)',
                color: 'var(--text-main)',
                fontSize: '0.9rem',
                outline: 'none',
                transition: 'border-color 0.2s ease'
              }}
              onFocus={(e) => e.target.style.borderColor = 'var(--green-bright)'}
              onBlur={(e) => e.target.style.borderColor = 'var(--glass-border)'}
            />
          </div>

          {/* Category Chips */}
          <div style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: '0.5rem'
          }}>
            {CATEGORIES.map((cat) => {
              const active = activeCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => setActiveCategory(cat.id)}
                  style={{
                    padding: '0.45rem 0.95rem',
                    borderRadius: '8px',
                    border: active ? '1px solid var(--green-bright)' : '1px solid var(--glass-border)',
                    background: active ? 'rgba(16, 185, 129, 0.2)' : 'rgba(255, 255, 255, 0.03)',
                    color: active ? '#34d399' : 'var(--text-muted)',
                    fontSize: '0.85rem',
                    fontWeight: active ? 600 : 500,
                    cursor: 'pointer',
                    transition: 'all 0.2s ease'
                  }}
                >
                  {cat.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Stories Grid */}
        {loading ? (
          <div style={{ textAlign: 'center', padding: '4rem 0', color: 'var(--text-muted)' }}>
            Carregando acervo do banco de dados Django...
          </div>
        ) : filteredCuriosities.length === 0 ? (
          <div className="glass-card" style={{ textAlign: 'center', padding: '3rem 1.5rem' }}>
            <p style={{ color: 'var(--text-muted)', fontSize: '1rem', marginBottom: '1rem' }}>
              Nenhuma história encontrada para os critérios selecionados.
            </p>
            {currentUser && (
              <button onClick={onNewStory} className="btn btn-outline-green btn-sm">
                Criar Nova História
              </button>
            )}
          </div>
        ) : (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
            gap: '1.5rem'
          }}>
            {filteredCuriosities.map((item) => (
              <article
                key={item.id}
                className="glass-card"
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  padding: '1.75rem',
                  position: 'relative',
                  borderTop: `3px solid ${item.accent_color || 'var(--green-bright)'}`
                }}
              >
                {/* Meta Top Header */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.85rem' }}>
                  <span className="badge" style={{ fontSize: '0.7rem' }}>
                    <Tag size={11} />
                    {item.category_display || item.category}
                  </span>
                  
                  <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <Calendar size={12} />
                    {item.date_or_era}
                  </span>
                </div>

                {/* Title */}
                <h3 style={{ fontSize: '1.25rem', marginBottom: '0.4rem', color: '#ffffff' }}>
                  {item.title}
                </h3>

                {/* Subtitle */}
                {item.subtitle && (
                  <h4 style={{ fontSize: '0.88rem', color: 'var(--green-bright)', fontWeight: 500, marginBottom: '0.85rem' }}>
                    {item.subtitle}
                  </h4>
                )}

                {/* Comic issue pill if present */}
                {item.comic_issue && (
                  <div style={{
                    fontSize: '0.78rem',
                    color: '#e5e7eb',
                    background: 'rgba(255, 255, 255, 0.05)',
                    padding: '0.25rem 0.6rem',
                    borderRadius: '6px',
                    width: 'fit-content',
                    marginBottom: '1rem',
                    border: '1px solid rgba(255, 255, 255, 0.08)'
                  }}>
                    📖 HQ: {item.comic_issue}
                  </div>
                )}

                {/* Content */}
                <p style={{
                  color: 'var(--text-muted)',
                  fontSize: '0.92rem',
                  lineHeight: '1.6',
                  marginBottom: '1.5rem',
                  flexGrow: 1,
                  whiteSpace: 'pre-line'
                }}>
                  {item.content}
                </p>

                {/* Footer Info & Admin Actions */}
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  paddingTop: '1rem',
                  borderTop: '1px solid var(--glass-border)',
                  fontSize: '0.78rem',
                  color: 'var(--text-dim)'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <UserCheck size={13} color="var(--green-bright)" />
                    <span>Por: <strong>{item.author_username || 'Stark Industries'}</strong></span>
                  </div>

                  {currentUser && (
                    <div style={{ display: 'flex', gap: '0.4rem' }}>
                      <button
                        onClick={() => onEditStory(item)}
                        className="btn btn-secondary btn-sm"
                        style={{ padding: '0.35rem 0.65rem' }}
                        title="Editar História"
                      >
                        <Edit3 size={14} color="#34d399" />
                        <span style={{ fontSize: '0.75rem' }}>Editar</span>
                      </button>

                      <button
                        onClick={() => onDeleteStory(item.id)}
                        className="btn btn-secondary btn-sm"
                        style={{ padding: '0.35rem 0.65rem', color: '#fca5a5' }}
                        title="Excluir História"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  )}
                </div>
              </article>
            ))}
          </div>
        )}

      </div>
    </section>
  );
}
