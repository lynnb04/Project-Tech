// document.addEventListener('DOMContentLoaded', () => {
//     const favBtn = document.querySelector('.favo-btn');
//     const icon   = favBtn.querySelector('img');

//     favBtn.addEventListener('click', () => {
//       // toggle class voor styling of herkenning
//       const active = favBtn.classList.toggle('active');

//       // wissel het icoon
//       icon.src = active
//         ? '/static/heart_active.svg'
//         : '/static/heart_open.svg';
//     });
//   });

// document.addEventListener('DOMContentLoaded', () => {
//   const favBtn = document.querySelector('.favo-btn');
//   const icon = favBtn.querySelector('img');

//   favBtn.addEventListener('click', async () => {
//     const active = favBtn.classList.toggle('active');
//     const eventId = favBtn.dataset.eventId;

//     icon.src = active
//       ? '/static/heart_active.svg'
//       : '/static/heart_open.svg';

//     try {
//       await fetch('/favorites', {
//         method: active ? 'POST' : 'DELETE',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({ eventId }),
//       });
//     } catch (error) {
//       console.error('Fout bij updaten favoriet:', error);
//     }
//   });
// });

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

// check deze code:
document.addEventListener('DOMContentLoaded', () => {
  const goingButton = document.getElementById('going-button');
  const matchButton = document.querySelector('.eventCheck a'); // jouw match knop selector

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
          // Maak match knop klikbaar en haal disabled class weg
          matchButton.classList.remove('disabled');
          goingButton.classList.add('active');
          goingButton.textContent = "Je gaat naar dit Event!";
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