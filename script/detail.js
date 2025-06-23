document.addEventListener('DOMContentLoaded', () => {
  const likeButton = document.querySelector('.favo-btn');
  if (!likeButton) return;

  const img       = likeButton.querySelector('img');
  const eventId   = likeButton.dataset.eventId;
  let liked       = likeButton.dataset.liked === 'true';

  // **Initialisatie bij laden**:
  if (liked) {
    likeButton.classList.add('active');
    img.src = '/static/heart_active.svg';
  } else {
    likeButton.classList.remove('active');
    img.src = '/static/heart_open.svg';
  }

  likeButton.addEventListener('click', async () => {
    try {
      // Verstuur naar server
      const method = liked ? 'DELETE' : 'POST';
      const res    = await fetch('/favorites', {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ eventId })
      });
      const data = await res.json();
      if (!data.success) throw new Error(data.error || 'Server error');

      // Toggle local state
      liked = !liked;
      likeButton.classList.toggle('active', liked);
      img.src = liked
        ? '/static/heart_active.svg'
        : '/static/heart_open.svg';

      // Alleen pulsen bij activeren
      if (liked) {
        likeButton.classList.add('pulse');
        likeButton.addEventListener('animationend', () => {
          likeButton.classList.remove('pulse');
        }, { once: true });
      }

    } catch (err) {
      console.error('Fout bij like/unlike:', err);
    }
  });
});

console.log("JS geladen");

document.addEventListener('DOMContentLoaded', () => {
  const goingButton = document.getElementById('going-button');
  const matchButton = document.querySelector('.eventCheck a');

  if (goingButton && matchButton) {
    goingButton.addEventListener('click', async () => {
      const eventId = goingButton.dataset.eventId;
      console.log("Going-button geklikt met eventId:", eventId);

      try {
        const response = await fetch('/api/going', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ eventId }),
        });

        if (response.ok) {
          matchButton.classList.remove('disabled');
          goingButton.classList.add('active');
          goingButton.textContent = "Je gaat naar dit Event! ✔";
          console.log('Match knop geactiveerd');
        } else {
          alert('Je moet ingelogd zijn om dit te doen!');
        }
      } catch (error) {
        console.error('Er ging iets mis:', error);
      }
    });
  }
});