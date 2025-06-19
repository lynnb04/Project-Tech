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

  if (likeButton) {
    likeButton.addEventListener('click', async () => {
      const eventId = likeButton.dataset.eventId;

      try {
        const response = await fetch('/favorites', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ eventId })
        });

        const data = await response.json();

        if (data.success) {
          likeButton.classList.toggle('active');
          const img = likeButton.querySelector('img');
          img.src = likeButton.classList.contains('active')
            ? '/static/heart_active.svg'
            : '/static/heart_open.svg';
        } else {
          console.error('Fout bij liken:', data.error);
        }
      } catch (err) {
        console.error('Fout bij verzoek:', err);
      }
    });
  }
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