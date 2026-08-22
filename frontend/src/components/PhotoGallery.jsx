import React, { useState } from 'react';
import { Image as ImageIcon, CheckCircle2, AlertCircle, Maximize2, X, FolderOpen, Sparkles, Cpu } from 'lucide-react';

const PHOTO_SLOTS = [
  {
    slot: 1,
    filename: 'ironman_1.jpg',
    title: 'A Estreia Histórica da Mark I (1963)',
    subtitle: 'Tales of Suspense #39 - Stan Lee & Jack Kirby / Don Heck',
    category: 'Origem',
    description: 'Capa da primeira aparição nos quadrinhos onde Tony Stark constrói a armadura cinzenta para sobreviver.',
    fallbackColor: 'linear-gradient(135deg, #064e3b, #022c22)'
  },
  {
    slot: 2,
    filename: 'ironman_2.jpg',
    title: 'A Evolução: Do Ouro ao Escarlate',
    subtitle: 'O Design Clássico de Steve Ditko (#48)',
    category: 'Design & Arte',
    description: 'A transição da armadura dourada pesada para o icônico traje aerodinâmico vermelho e ouro.',
    fallbackColor: 'linear-gradient(135deg, #1e293b, #064e3b)'
  },
  {
    slot: 3,
    filename: 'ironman_3.jpg',
    title: 'Tony Stark & Homem-Aranha',
    subtitle: 'Aranha de Ferro & Parceria Tecnológica',
    category: 'Homem-Aranha',
    description: 'O traje Aranha de Ferro (Iron Spider) criado por Tony Stark para Peter Parker nos quadrinhos.',
    fallbackColor: 'linear-gradient(135deg, #7f1d1d, #064e3b)'
  },
  {
    slot: 4,
    filename: 'ironman_4.jpg',
    title: 'A Armadura Pesada: Hulkbuster',
    subtitle: 'Engenharia de Contenção Máxima (Mark XLIV)',
    category: 'Blindagem Especial',
    description: 'O massivo exoesqueleto modular desenvolvido por Stark para contenção de impactos cósmicos e titãs.',
    fallbackColor: 'linear-gradient(135deg, #78350f, #064e3b)'
  },
  {
    slot: 5,
    filename: 'ironman_5.jpg',
    title: 'Demônio na Garrafa & Guerra das Armaduras',
    subtitle: 'As Sagas Consagradas dos Anos 70 e 80',
    category: 'Sagas Clássicas',
    description: 'As obras-primas que consagraram a humanidade de Stark e sua cruzada tecnológica pelo mundo.',
    fallbackColor: 'linear-gradient(135deg, #065f46, #047857)'
  },
  {
    slot: 6,
    filename: 'ironman_6.jpg',
    title: 'Nanotecnologia & O Reator Arc',
    subtitle: 'Bleeding Edge & Model-Prime',
    category: 'Futurismo Stark',
    description: 'A fusão definitiva da biologia com nanobots alimentados pelo coração de energia do Reator Arc.',
    fallbackColor: 'linear-gradient(135deg, #1e1b4b, #064e3b)'
  }
];

export default function PhotoGallery({ mediaStatus }) {
  const [selectedPhoto, setSelectedPhoto] = useState(null);

  // Merge live media status if available
  const slotsWithStatus = PHOTO_SLOTS.map((slotData) => {
    const liveSlot = mediaStatus?.slots?.find((s) => s.slot === slotData.slot);
    return {
      ...slotData,
      exists: liveSlot ? liveSlot.exists : false,
      url: liveSlot && liveSlot.url ? liveSlot.url : `/media/${slotData.filename}`
    };
  });

  return (
    <section id="galeria" style={{ padding: '4.5rem 0', background: 'rgba(8, 12, 17, 0.6)' }}>
      <div className="container">
        
        {/* Section Header */}
        <div style={{ textAlign: 'center', maxWidth: '750px', margin: '0 auto 2.5rem auto' }}>
          <span className="badge" style={{ marginBottom: '0.6rem' }}>
            <ImageIcon size={13} />
            GALERIA DE FOTOS DA HISTÓRIA
          </span>
          <h2 style={{ fontSize: 'clamp(1.8rem, 4vw, 2.6rem)', marginBottom: '0.75rem' }}>
            6 Momentos & Armaduras <span className="text-gradient-green">em Fotos (/media)</span>
          </h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', lineHeight: '1.6' }}>
            Estrutura pronta para exibir as 6 fotos históricas do Homem de Ferro. Baixe suas imagens da internet e coloque-as na pasta <code>/media/</code> do projeto com os nomes correspondentes.
          </p>
        </div>

        {/* Directory Guide Card */}
        <div className="glass-card" style={{
          padding: '1.25rem 1.75rem',
          marginBottom: '2.5rem',
          border: '1px solid var(--green-border)',
          background: 'rgba(16, 185, 129, 0.05)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '1rem'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
            <div style={{
              width: '40px',
              height: '40px',
              borderRadius: '10px',
              background: 'rgba(16, 185, 129, 0.15)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              border: '1px solid var(--green-border)'
            }}>
              <FolderOpen size={20} color="#34d399" />
            </div>
            <div>
              <div style={{ fontSize: '0.92rem', fontWeight: 700, color: '#ffffff' }}>
                Diretório de Mídias do Backend:
              </div>
              <div style={{ fontSize: '0.82rem', color: 'var(--green-bright)', fontFamily: 'monospace' }}>
                projeto05/media/ (ironman_1.jpg até ironman_6.jpg)
              </div>
            </div>
          </div>

          <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Sparkles size={14} color="#fcd34d" />
            <span>O site detecta e atualiza os arquivos automaticamente!</span>
          </div>
        </div>

        {/* 6 Photo Slots Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: '1.5rem'
        }}>
          {slotsWithStatus.map((item) => (
            <div
              key={item.slot}
              className="glass-card"
              style={{
                overflow: 'hidden',
                display: 'flex',
                flexDirection: 'column',
                cursor: 'pointer'
              }}
              onClick={() => setSelectedPhoto(item)}
            >
              {/* Media Preview Box */}
              <div style={{
                position: 'relative',
                height: '220px',
                width: '100%',
                background: item.fallbackColor,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                overflow: 'hidden'
              }}>
                {item.exists ? (
                  <img
                    src={item.url}
                    alt={item.title}
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                      transition: 'transform 0.4s ease'
                    }}
                    onError={(e) => {
                      e.target.style.display = 'none';
                    }}
                  />
                ) : (
                  /* Stylized Technical Fallback Container */
                  <div style={{
                    padding: '1.5rem',
                    textAlign: 'center',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: '0.6rem'
                  }}>
                    <div style={{
                      width: '54px',
                      height: '54px',
                      borderRadius: '50%',
                      background: 'rgba(16, 185, 129, 0.2)',
                      border: '1px solid rgba(52, 211, 153, 0.4)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      boxShadow: '0 0 15px rgba(16, 185, 129, 0.3)'
                    }}>
                      <Cpu size={26} color="#34d399" />
                    </div>
                    <div style={{ fontSize: '0.9rem', fontWeight: 700, color: '#ffffff' }}>
                      Slot #{item.slot}: {item.filename}
                    </div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', maxWidth: '240px' }}>
                      Insira sua foto baixada da internet em <code style={{ color: 'var(--green-bright)' }}>/media/{item.filename}</code>
                    </div>
                  </div>
                )}

                {/* Status Indicator Badge */}
                <div style={{
                  position: 'absolute',
                  top: '12px',
                  right: '12px',
                  padding: '0.25rem 0.65rem',
                  borderRadius: '9999px',
                  fontSize: '0.72rem',
                  fontWeight: 600,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                  backdropFilter: 'blur(10px)',
                  background: item.exists ? 'rgba(16, 185, 129, 0.85)' : 'rgba(15, 23, 35, 0.85)',
                  color: item.exists ? '#ffffff' : '#fcd34d',
                  border: '1px solid var(--glass-border)'
                }}>
                  {item.exists ? (
                    <>
                      <CheckCircle2 size={12} />
                      <span>Foto no Servidor</span>
                    </>
                  ) : (
                    <>
                      <AlertCircle size={12} />
                      <span>Aguardando {item.filename}</span>
                    </>
                  )}
                </div>

                {/* Zoom Icon Button */}
                <div style={{
                  position: 'absolute',
                  bottom: '12px',
                  right: '12px',
                  width: '32px',
                  height: '32px',
                  borderRadius: '8px',
                  background: 'rgba(0, 0, 0, 0.65)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#ffffff',
                  backdropFilter: 'blur(6px)'
                }}>
                  <Maximize2 size={15} />
                </div>
              </div>

              {/* Card Meta Content */}
              <div style={{ padding: '1.25rem' }}>
                <div style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--green-bright)', fontWeight: 700, letterSpacing: '0.04em', marginBottom: '0.3rem' }}>
                  {item.category} • Slot {item.slot} de 6
                </div>
                <h3 style={{ fontSize: '1.15rem', color: '#ffffff', marginBottom: '0.35rem' }}>
                  {item.title}
                </h3>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', lineHeight: '1.5' }}>
                  {item.description}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Lightbox Modal */}
        {selectedPhoto && (
          <div style={{
            position: 'fixed',
            inset: 0,
            zIndex: 1000,
            background: 'rgba(0, 0, 0, 0.85)',
            backdropFilter: 'blur(12px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '1.5rem'
          }} onClick={() => setSelectedPhoto(null)}>
            <div
              className="glass-card"
              style={{
                maxWidth: '650px',
                width: '100%',
                overflow: 'hidden',
                position: 'relative'
              }}
              onClick={(e) => e.stopPropagation()}
            >
              <div style={{
                position: 'relative',
                height: '320px',
                background: selectedPhoto.fallbackColor,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                {selectedPhoto.exists ? (
                  <img
                    src={selectedPhoto.url}
                    alt={selectedPhoto.title}
                    style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                  />
                ) : (
                  <div style={{ textAlign: 'center', padding: '2rem' }}>
                    <Cpu size={48} color="#34d399" style={{ marginBottom: '1rem' }} />
                    <div style={{ fontSize: '1.1rem', fontWeight: 700, color: '#ffffff' }}>
                      {selectedPhoto.filename}
                    </div>
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginTop: '0.5rem' }}>
                      Salve o arquivo com este nome na pasta <code>/media</code> do projeto para exibi-lo aqui.
                    </p>
                  </div>
                )}

                <button
                  onClick={() => setSelectedPhoto(null)}
                  style={{
                    position: 'absolute',
                    top: '12px',
                    right: '12px',
                    background: 'rgba(0, 0, 0, 0.7)',
                    border: '1px solid var(--glass-border)',
                    color: '#ffffff',
                    width: '36px',
                    height: '36px',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer'
                  }}
                >
                  <X size={18} />
                </button>
              </div>

              <div style={{ padding: '1.5rem' }}>
                <div className="badge" style={{ marginBottom: '0.5rem' }}>
                  {selectedPhoto.category}
                </div>
                <h3 style={{ fontSize: '1.4rem', color: '#ffffff', marginBottom: '0.4rem' }}>
                  {selectedPhoto.title}
                </h3>
                <h4 style={{ fontSize: '0.95rem', color: 'var(--green-bright)', marginBottom: '0.85rem', fontWeight: 500 }}>
                  {selectedPhoto.subtitle}
                </h4>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.92rem', lineHeight: '1.6' }}>
                  {selectedPhoto.description}
                </p>
              </div>
            </div>
          </div>
        )}

      </div>
    </section>
  );
}
