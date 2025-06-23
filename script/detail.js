document.addEventListener('DOMContentLoaded', () => {
  const likeButton = document.querySelector('.favoBtn');
  if (!likeButton) return;

  const likeImg = likeButton.querySelector('img');
  const eventId = likeButton.dataset.eventId;
  let isLiked = likeButton.dataset.liked === 'true';

  if (isLiked) {
    likeButton.classList.add('active');
    likeImg.src = '/static/heart_active.svg';
  } else {
    likeButton.classList.remove('active');
    likeImg.src = '/static/heart_open.svg';
  }

  likeButton.addEventListener('click', async () => {
    try {
      const method = isLiked ? 'DELETE' : 'POST';
      const response = await fetch('/favorites', {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ eventId })
      });

      const data = await response.json();
      if (!data.success) throw new Error(data.error || 'Server error');

      isLiked = !isLiked;
      likeButton.classList.toggle('active', isLiked);
      likeImg.src = isLiked ? '/static/heart_active.svg' : '/static/heart_open.svg';

      if (isLiked) {
        likeButton.classList.add('pulse');
        likeButton.addEventListener('animationend', () => {
          likeButton.classList.remove('pulse');
        }, { once: true });
      }

    } catch (err) {
      console.error('Error while liking/unliking:', err);
    }
  });
});

console.log("JS loaded");

document.addEventListener('DOMContentLoaded', () => {
  const goingButton = document.getElementById('goingButton');
  const matchLink = document.querySelector('.eventCheck a');

  if (goingButton && matchLink) {
    goingButton.addEventListener('click', async () => {
      const eventId = goingButton.dataset.eventId;
      console.log("Going button clicked with eventId:", eventId);

      try {
        const response = await fetch('/api/going', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ eventId })
        });

        if (response.ok) {
          matchLink.classList.remove('disabled');
          goingButton.classList.add('active');
          goingButton.textContent = "Je gaat naar dit concert! ✔";
          console.log('Match button activated');
        } else {
          alert('Je moet ingelogd zijn om dit te doen!');
        }
      } catch (error) {
        console.error('Er ging iets mis:', error);
      }
    });
  }
});
