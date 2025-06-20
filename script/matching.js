  document.querySelectorAll('.matchButtons form').forEach(form => {
    form.addEventListener('submit', function (e) {
      e.preventDefault();

      const listItem = this.closest('li');
      const isSkip = this.action.includes('/skip/');
      const animationClass = isSkip ? 'swipe-left' : 'swipe-right';

      listItem.classList.add(animationClass);

      setTimeout(() => {
        this.submit();
      }, 500); // tijd gelijk aan de animatieduur
    });
  });

  document.addEventListener('DOMContentLoaded', () => {
    const popup    = document.querySelector('.matchPopUp');
    const closeBtn = document.getElementById('closePopup');
    if (!popup || !closeBtn) return;

    closeBtn.addEventListener('click', () => {
      popup.style.display = 'none';
      window.location.href = '/matching';
    });
  });