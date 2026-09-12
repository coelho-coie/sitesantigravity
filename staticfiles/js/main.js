/**
 * LUMINA — THE LIVING CANVAS: CORE CLIENT LOGIC
 * Dynamic Like toggles, Live Image Previews, and Micro-interactions.
 */

document.addEventListener('DOMContentLoaded', () => {
  // Inicialização de Curtidas Assíncronas (AJAX Like Toggle)
  setupAsyncLikes();

  // Preview dinâmico de upload de imagem
  setupImagePreview();

  // Fechamento suave de mensagens flash
  setupFlashMessages();
});

/**
 * Curtidas sem recarregamento de página
 */
function setupAsyncLikes() {
  const likeButtons = document.querySelectorAll('.btn-like');

  likeButtons.forEach(btn => {
    btn.addEventListener('click', async (e) => {
      e.preventDefault();
      const postId = btn.getAttribute('data-post-id');
      const url = `/post/${postId}/like/?ajax=1`;

      try {
        const response = await fetch(url, {
          method: 'GET',
          headers: {
            'X-Requested-With': 'XMLHttpRequest'
          }
        });

        if (response.redirected && response.url.includes('/auth/login')) {
          window.location.href = response.url;
          return;
        }

        if (response.ok) {
          const data = await response.json();
          const countSpan = btn.querySelector('.like-count');
          const heartIcon = btn.querySelector('.heart-icon');

          if (countSpan) {
            countSpan.textContent = data.total_likes;
          }

          if (data.liked) {
            btn.classList.add('liked');
            if (heartIcon) {
              heartIcon.textContent = '❤️';
              heartIcon.classList.add('heart-pop');
              setTimeout(() => heartIcon.classList.remove('heart-pop'), 400);
            }
          } else {
            btn.classList.remove('liked');
            if (heartIcon) {
              heartIcon.textContent = '🤍';
            }
          }
        }
      } catch (err) {
        console.error('Erro ao alternar curtida:', err);
      }
    });
  });
}

/**
 * Preview imediato de imagem selecionada no formulário de publicação
 */
function setupImagePreview() {
  const fileInput = document.getElementById('id_image');
  const urlInput = document.getElementById('id_image_url');
  const previewBox = document.getElementById('preview-container');
  const previewImg = document.getElementById('image-preview');

  if (!previewBox || !previewImg) return;

  if (fileInput) {
    fileInput.addEventListener('change', (e) => {
      const file = e.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (event) => {
          previewImg.src = event.target.result;
          previewBox.style.display = 'block';
        };
        reader.readAsDataURL(file);
      }
    });
  }

  if (urlInput) {
    urlInput.addEventListener('input', (e) => {
      const val = e.target.value.trim();
      if (val.startsWith('http://') || val.startsWith('https://')) {
        previewImg.src = val;
        previewBox.style.display = 'block';
      }
    });
  }
}

/**
 * Auto-dispensa de mensagens flash
 */
function setupFlashMessages() {
  const alerts = document.querySelectorAll('.flash-message');
  alerts.forEach(alert => {
    setTimeout(() => {
      alert.style.opacity = '0';
      alert.style.transform = 'translateY(-10px)';
      alert.style.transition = 'all 0.4s ease';
      setTimeout(() => alert.remove(), 400);
    }, 4500);
  });
}
