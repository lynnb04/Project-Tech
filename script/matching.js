document.querySelectorAll('.matchButtons form').forEach(form => {
  form.addEventListener('submit', function (e) {
    e.preventDefault();

    const listItem = this.closest('li');
    const isSkip = this.action.includes('/skip/');
    const animationClass = isSkip ? 'swipeLeft' : 'swipeRight';

    listItem.classList.add(animationClass);

    setTimeout(() => {
      this.submit();
    }, 500); // match animation duration
  });
});

document.addEventListener('DOMContentLoaded', () => {
  const matchPopup = document.querySelector('.matchPopup');
  const closeBtn = document.getElementById('closePopup');
  if (!matchPopup || !closeBtn) return;

  closeBtn.addEventListener('click', () => {
    matchPopup.style.display = 'none';
    window.location.href = '/matching';
  });
});