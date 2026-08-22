import React, { useState, useEffect } from 'react';
import { X, Save, Edit3, PlusCircle, AlertCircle, CheckCircle } from 'lucide-react';
import { api } from '../services/api';

const CATEGORY_OPTIONS = [
  { value: 'CRIACAO', label: 'Criação & Origem (1963)' },
  { value: 'ARMADURAS', label: 'Armaduras & Tecnologia Arc' },
  { value: 'DATAS', label: 'Datas Históricas & Linha do Tempo' },
  { value: 'GIBIS', label: 'Gibis Clássicos & Históricos' },
  { value: 'CROSSOVER', label: 'Vingadores & Homem-Aranha' },
  { value: 'CURIOSIDADES', label: 'Curiosidades & Fatos' },
];

export default function StoryEditorModal({ isOpen, onClose, storyToEdit, onStorySaved }) {
  const isEditing = Boolean(storyToEdit && storyToEdit.id);

  const [formData, setFormData] = useState({
    title: '',
    subtitle: '',
    category: 'CRIACAO',
    date_or_era: '',
    comic_issue: '',
    image_filename: 'ironman_1.jpg',
    content: '',
    accent_color: '#10b981',
  });

  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    if (storyToEdit) {
      setFormData({
        title: storyToEdit.title || '',
        subtitle: storyToEdit.subtitle || '',
        category: storyToEdit.category || 'CRIACAO',
        date_or_era: storyToEdit.date_or_era || '',
        comic_issue: storyToEdit.comic_issue || '',
        image_filename: storyToEdit.image_filename || 'ironman_1.jpg',
        content: storyToEdit.content || '',
        accent_color: storyToEdit.accent_color || '#10b981',
      });
    } else {
      setFormData({
        title: '',
        subtitle: '',
        category: 'CRIACAO',
        date_or_era: '',
        comic_issue: '',
        image_filename: 'ironman_1.jpg',
        content: '',
        accent_color: '#10b981',
      });
    }
    setErrorMessage('');
    setSuccessMessage('');
  }, [storyToEdit, isOpen]);

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');
    setLoading(true);

    try {
      if (isEditing) {
        await api.updateCuriosity(storyToEdit.id, formData);
        setSuccessMessage('História atualizada com sucesso no banco de dados!');
      } else {
        await api.createCuriosity(formData);
        setSuccessMessage('Nova história criada e salva com sucesso!');
      }

      setTimeout(() => {
        onStorySaved();
        onClose();
      }, 700);
    } catch (err) {
      setErrorMessage(err.message || 'Erro ao salvar a história.');
    } finally {
      setLoading(false);
    }
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
      padding: '1.25rem',
      overflowY: 'auto'
    }} onClick={onClose}>
      <div
        className="glass-card"
        style={{
          maxWidth: '620px',
          width: '100%',
          padding: '2rem',
          border: '1px solid var(--green-border)',
          background: 'linear-gradient(135deg, rgba(16, 26, 38, 0.98), rgba(6, 78, 59, 0.35))',
          position: 'relative',
          maxHeight: '90vh',
          overflowY: 'auto'
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
            cursor: 'pointer'
          }}
        >
          <X size={20} />
        </button>

        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem' }}>
          <div style={{
            width: '42px',
            height: '42px',
            borderRadius: '10px',
            background: 'rgba(16, 185, 129, 0.2)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            border: '1px solid var(--green-border)'
          }}>
            {isEditing ? <Edit3 size={20} color="#34d399" /> : <PlusCircle size={20} color="#34d399" />}
          </div>
          <div>
            <h3 style={{ fontSize: '1.35rem', color: '#ffffff' }}>
              {isEditing ? 'Editar História do Homem de Ferro' : 'Nova História / Armadura'}
            </h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.82rem' }}>
              Persistência direta no banco de dados Django (SQLite / PostgreSQL).
            </p>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          
          {/* Title */}
          <div>
            <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, marginBottom: '0.3rem' }}>
              Título Principal *
            </label>
            <input
              type="text"
              name="title"
              required
              value={formData.title}
              onChange={handleChange}
              placeholder="Ex: A Armadura Silver Centurion e o Confronto com Monge de Ferro"
              style={{
                width: '100%',
                padding: '0.7rem 0.9rem',
                borderRadius: '8px',
                border: '1px solid var(--glass-border)',
                background: 'rgba(15, 23, 35, 0.8)',
                color: '#ffffff',
                fontSize: '0.9rem'
              }}
            />
          </div>

          {/* Subtitle */}
          <div>
            <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, marginBottom: '0.3rem' }}>
              Subtítulo / Destaque
            </label>
            <input
              type="text"
              name="subtitle"
              value={formData.subtitle}
              onChange={handleChange}
              placeholder="Ex: A redenção de Tony Stark nos anos 80"
              style={{
                width: '100%',
                padding: '0.7rem 0.9rem',
                borderRadius: '8px',
                border: '1px solid var(--glass-border)',
                background: 'rgba(15, 23, 35, 0.8)',
                color: '#ffffff',
                fontSize: '0.9rem'
              }}
            />
          </div>

          {/* Category & Date in 2 columns */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, marginBottom: '0.3rem' }}>
                Categoria
              </label>
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                style={{
                  width: '100%',
                  padding: '0.7rem 0.9rem',
                  borderRadius: '8px',
                  border: '1px solid var(--glass-border)',
                  background: '#0f1723',
                  color: '#ffffff',
                  fontSize: '0.85rem'
                }}
              >
                {CATEGORY_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, marginBottom: '0.3rem' }}>
                Data / Época *
              </label>
              <input
                type="text"
                name="date_or_era"
                required
                value={formData.date_or_era}
                onChange={handleChange}
                placeholder="Ex: Março de 1963 / Extremis"
                style={{
                  width: '100%',
                  padding: '0.7rem 0.9rem',
                  borderRadius: '8px',
                  border: '1px solid var(--glass-border)',
                  background: 'rgba(15, 23, 35, 0.8)',
                  color: '#ffffff',
                  fontSize: '0.85rem'
                }}
              />
            </div>
          </div>

          {/* Comic & Image File in 2 columns */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, marginBottom: '0.3rem' }}>
                Gibi / HQ de Referência
              </label>
              <input
                type="text"
                name="comic_issue"
                value={formData.comic_issue}
                onChange={handleChange}
                placeholder="Ex: Tales of Suspense #39 / Iron Man #200"
                style={{
                  width: '100%',
                  padding: '0.7rem 0.9rem',
                  borderRadius: '8px',
                  border: '1px solid var(--glass-border)',
                  background: 'rgba(15, 23, 35, 0.8)',
                  color: '#ffffff',
                  fontSize: '0.85rem'
                }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, marginBottom: '0.3rem' }}>
                Arquivo em /media/
              </label>
              <select
                name="image_filename"
                value={formData.image_filename}
                onChange={handleChange}
                style={{
                  width: '100%',
                  padding: '0.7rem 0.9rem',
                  borderRadius: '8px',
                  border: '1px solid var(--glass-border)',
                  background: '#0f1723',
                  color: '#ffffff',
                  fontSize: '0.85rem'
                }}
              >
                <option value="ironman_1.jpg">Slot 1 (ironman_1.jpg)</option>
                <option value="ironman_2.jpg">Slot 2 (ironman_2.jpg)</option>
                <option value="ironman_3.jpg">Slot 3 (ironman_3.jpg)</option>
                <option value="ironman_4.jpg">Slot 4 (ironman_4.jpg)</option>
                <option value="ironman_5.jpg">Slot 5 (ironman_5.jpg)</option>
                <option value="ironman_6.jpg">Slot 6 (ironman_6.jpg)</option>
              </select>
            </div>
          </div>

          {/* Content */}
          <div>
            <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, marginBottom: '0.3rem' }}>
              Conteúdo da História / Armadura *
            </label>
            <textarea
              name="content"
              required
              rows={4}
              value={formData.content}
              onChange={handleChange}
              placeholder="Descreva a história, armadura, contexto histórico, criadores e tecnologia envolvida..."
              style={{
                width: '100%',
                padding: '0.75rem 0.9rem',
                borderRadius: '8px',
                border: '1px solid var(--glass-border)',
                background: 'rgba(15, 23, 35, 0.8)',
                color: '#ffffff',
                fontSize: '0.9rem',
                lineHeight: '1.5'
              }}
            />
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

          {/* Buttons */}
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '0.5rem' }}>
            <button
              type="button"
              onClick={onClose}
              className="btn btn-secondary"
            >
              Cancelar
            </button>

            <button
              type="submit"
              disabled={loading}
              className="btn btn-primary"
              style={{ gap: '0.4rem' }}
            >
              <Save size={16} />
              <span>{loading ? 'Salvando...' : isEditing ? 'Atualizar História' : 'Salvar História'}</span>
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}
