import React, { useState, useEffect, useCallback } from 'react';
import Header from './components/Header';
import Hero from './components/Hero';
import CreationSection from './components/CreationSection';
import Timeline from './components/Timeline';
import ComicsSection from './components/ComicsSection';
import PhotoGallery from './components/PhotoGallery';
import Footer from './components/Footer';
import LoginModal from './components/LoginModal';
import StoryEditorModal from './components/StoryEditorModal';
import { api } from './services/api';

export default function App() {
  const [currentUser, setCurrentUser] = useState(null);
  const [curiosities, setCuriosities] = useState([]);
  const [mediaStatus, setMediaStatus] = useState(null);
  const [loadingCuriosities, setLoadingCuriosities] = useState(true);

  // Modals
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isStoryModalOpen, setIsStoryModalOpen] = useState(false);
  const [storyToEdit, setStoryToEdit] = useState(null);

  // Notification Toast
  const [toast, setToast] = useState(null);

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3500);
  };

  // Load active user session
  const checkAuth = useCallback(async () => {
    try {
      const res = await api.getMe();
      if (res && res.authenticated) {
        setCurrentUser(res.user);
      } else {
        setCurrentUser(null);
      }
    } catch (err) {
      console.warn('Auth check failed:', err);
    }
  }, []);

  // Load curiosities from Django REST API
  const loadCuriosities = useCallback(async () => {
    setLoadingCuriosities(true);
    try {
      const data = await api.getCuriosities();
      setCuriosities(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Failed to load curiosities:', err);
      showToast('Erro ao carregar curiosidades do servidor Django.', 'error');
    } finally {
      setLoadingCuriosities(false);
    }
  }, []);

  // Load media status (/media directory files)
  const loadMediaStatus = useCallback(async () => {
    try {
      const status = await api.getMediaStatus();
      setMediaStatus(status);
    } catch (err) {
      console.warn('Media status check:', err);
    }
  }, []);

  useEffect(() => {
    checkAuth();
    loadCuriosities();
    loadMediaStatus();
  }, [checkAuth, loadCuriosities, loadMediaStatus]);

  // Auth Handlers
  const handleLoginSuccess = (user) => {
    setCurrentUser(user);
    showToast(`Autenticado como ${user.username}! Agora você pode editar histórias.`);
    loadCuriosities();
  };

  const handleLogout = async () => {
    try {
      await api.logout();
      setCurrentUser(null);
      showToast('Você saiu da sua conta.');
    } catch (err) {
      showToast('Erro ao deslogar: ' + err.message, 'error');
    }
  };

  // CRUD Handlers
  const handleOpenNewStory = () => {
    if (!currentUser) {
      setIsLoginOpen(true);
      return;
    }
    setStoryToEdit(null);
    setIsStoryModalOpen(true);
  };

  const handleEditStory = (story) => {
    if (!currentUser) {
      setIsLoginOpen(true);
      return;
    }
    setStoryToEdit(story);
    setIsStoryModalOpen(true);
  };

  const handleDeleteStory = async (id) => {
    if (!window.confirm('Tem certeza de que deseja excluir esta história?')) return;
    try {
      await api.deleteCuriosity(id);
      showToast('História removida com sucesso!');
      loadCuriosities();
    } catch (err) {
      showToast('Erro ao excluir: ' + err.message, 'error');
    }
  };

  const handleStorySaved = () => {
    showToast(storyToEdit ? 'História atualizada com sucesso!' : 'Nova história cadastrada no Django!');
    loadCuriosities();
  };

  const handleSeedDatabase = () => {
    showToast('Banco de dados repopulado com as histórias padrão!');
    loadCuriosities();
    loadMediaStatus();
  };

  return (
    <div className="app-layout" style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      
      {/* Toast Notification */}
      {toast && (
        <div style={{
          position: 'fixed',
          bottom: '24px',
          right: '24px',
          zIndex: 9999,
          padding: '0.85rem 1.4rem',
          borderRadius: '12px',
          background: toast.type === 'error' ? 'rgba(239, 68, 68, 0.95)' : 'rgba(16, 185, 129, 0.95)',
          color: '#ffffff',
          fontWeight: 600,
          fontSize: '0.9rem',
          boxShadow: '0 10px 30px rgba(0, 0, 0, 0.5)',
          backdropFilter: 'blur(8px)',
          border: '1px solid rgba(255, 255, 255, 0.2)',
          animation: 'slideUp 0.3s ease'
        }}>
          {toast.message}
        </div>
      )}

      {/* Main Header */}
      <Header
        currentUser={currentUser}
        onOpenLogin={() => setIsLoginOpen(true)}
        onLogout={handleLogout}
        onOpenNewStory={handleOpenNewStory}
      />

      {/* Main Content */}
      <main style={{ flexGrow: 1 }}>
        <Hero
          onExploreClick={() => {}}
          onOpenLogin={() => setIsLoginOpen(true)}
          currentUser={currentUser}
        />

        <CreationSection />

        <Timeline />

        <ComicsSection
          curiosities={curiosities}
          loading={loadingCuriosities}
          currentUser={currentUser}
          onEditStory={handleEditStory}
          onDeleteStory={handleDeleteStory}
          onNewStory={handleOpenNewStory}
        />

        <PhotoGallery mediaStatus={mediaStatus} />
      </main>

      {/* Enterprise Footer */}
      <Footer onSeedDatabase={handleSeedDatabase} />

      {/* Modals */}
      <LoginModal
        isOpen={isLoginOpen}
        onClose={() => setIsLoginOpen(false)}
        onLoginSuccess={handleLoginSuccess}
      />

      <StoryEditorModal
        isOpen={isStoryModalOpen}
        onClose={() => setIsStoryModalOpen(false)}
        storyToEdit={storyToEdit}
        onStorySaved={handleStorySaved}
      />

    </div>
  );
}
