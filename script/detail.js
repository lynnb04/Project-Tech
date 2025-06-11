document.addEventListener('DOMContentLoaded', () => {
    const favBtn = document.querySelector('.favo-btn');
    const icon   = favBtn.querySelector('img');

    favBtn.addEventListener('click', () => {
      // toggle class voor styling of herkenning
      const active = favBtn.classList.toggle('active');

      // wissel het icoon
      icon.src = active
        ? '/static/heart_active.svg'
        : '/static/heart_open.svg';
    });
  });