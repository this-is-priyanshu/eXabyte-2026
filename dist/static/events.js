document.addEventListener('DOMContentLoaded', () => {
  const toggleInputs = document.querySelectorAll('input[name="event-toggle"]');
  const onlineGrid = document.getElementById('online-events-grid');
  const offlineGrid = document.getElementById('offline-events-grid');

  toggleInputs.forEach(input => {
    input.addEventListener('change', (e) => {
      const value = e.target.value;
      
      if (value === 'online') {
        offlineGrid.classList.remove('active');
        offlineGrid.classList.add('fade-out-left');
        
        setTimeout(() => {
          offlineGrid.classList.remove('fade-out-left');
          offlineGrid.classList.add('hidden');
          onlineGrid.classList.remove('hidden');
          requestAnimationFrame(() => {
            requestAnimationFrame(() => {
              onlineGrid.classList.add('active');
            });
          });
        }, 470);
      } else if (value === 'offline') {
        onlineGrid.classList.remove('active');
        onlineGrid.classList.add('fade-out-left');

        setTimeout(() => {
          onlineGrid.classList.remove('fade-out-left');
          onlineGrid.classList.add('hidden');
          offlineGrid.classList.remove('hidden');
          requestAnimationFrame(() => {
            requestAnimationFrame(() => {
              offlineGrid.classList.add('active');
            });
          });
        }, 470);
      }
    });
  });

  const registerButtons = document.querySelectorAll('.register-btn');
  const popupCloseButtons = document.querySelectorAll('.popup-close');

  registerButtons.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const eventId = btn.getAttribute('data-event-id');
      const popupId = `popup-${eventId}`;
      const popup = document.getElementById(popupId);
      
      if (popup) {
        openEventPopup(popup);
      }
    });
  });

  popupCloseButtons.forEach(closeBtn => {
    closeBtn.addEventListener('click', () => {
      const popup = closeBtn.closest('.event-popup');
      if (popup) {
        closeEventPopup(popup);
      }
    });
  });

  document.querySelectorAll('.event-popup').forEach(popup => {
    popup.addEventListener('click', (e) => {
      if (e.target === popup) {
        closeEventPopup(popup);
      }
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && popup.classList.contains('open')) {
        closeEventPopup(popup);
      }
    });
  });

  function openEventPopup(popup) {
    popup.classList.add('open');
    popup.setAttribute('aria-hidden', 'false');
    document.body.classList.add('menu-open');

    if (typeof gsap !== 'undefined') {
      const panel = popup.querySelector('.menu-panel');
      gsap.fromTo(panel,
        { scale: 0.88, opacity: 0 },
        { scale: 1, opacity: 1, duration: 0.24, ease: 'power2.out' }
      );
    }
  }

  function closeEventPopup(popup) {
    if (typeof gsap !== 'undefined') {
      const panel = popup.querySelector('.menu-panel');
      gsap.to(panel, {
        scale: 0.88,
        opacity: 0,
        duration: 0.2,
        ease: 'power2.in',
        onComplete: () => {
          popup.classList.remove('open');
          popup.setAttribute('aria-hidden', 'true');
          document.body.classList.remove('menu-open');
        }
      });
    } else {
      popup.classList.remove('open');
      popup.setAttribute('aria-hidden', 'true');
      document.body.classList.remove('menu-open');
    }
  }
});
