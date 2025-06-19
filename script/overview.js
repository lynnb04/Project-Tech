const concertCard = document.querySelectorAll('article li');

concertCard.forEach((li, index) => {
  const zIndex = concertCard.length - index; 
  li.style.zIndex = zIndex;
});

document.addEventListener("DOMContentLoaded", function () {
  const filterBtn = document.querySelector(".filter");
  const modal     = document.getElementById("filterModal");
  const closeBtn = modal.querySelector(".close-btn");
  const countEl   = document.querySelector(".filter-count");

  if (!filterBtn || !modal) return;

  function openModal() {
    modal.style.display = "flex";
    document.body.classList.add("no-scroll");
    updateFilterCount();
  }
  function closeModal() {
    modal.style.display = "none";
    document.body.classList.remove("no-scroll");
  }

  filterBtn.addEventListener("click", openModal);
  closeBtn.addEventListener("click", closeModal);

  window.addEventListener("click", (e) => {
    if (e.target === modal) {
      closeModal();
    }
  });

    // === List.js initialisatie ===
  // 1) Options: we sorteren op data-attribuut "date" en op .name
  var listOptions = {
    valueNames: [
      'name',
      { attr: 'data-date', name: 'date' }
    ],
    listClass: 'list'
  };
  // 2) Instantie aanmaken
  var concertList = new List('concert-list', listOptions);

  // 3) Hook de sort-select
  var sortSelect = document.getElementById('sort-select');
  sortSelect.addEventListener('change', function() {
    var [field, order] = this.value.split('-');
    concertList.sort(field, { order: order });
  });

  const searchInput = document.getElementById('search-input');
  if (searchInput) {
  searchInput.addEventListener('input', function() {
    // Zoek in alle velden (of specificeer ['name','locatie'] indien gewenst):
    concertList.search(this.value);
  });
  }

  document.querySelector('form[role="search"]').addEventListener('submit', e => {
    e.preventDefault();
  });  

  // Bestaande logica voor tags, dates & genres:
  document.querySelectorAll(".filter-tag").forEach(tag => {
    if (tag.dataset.selected === "true") tag.classList.add("selected");
    tag.addEventListener("click", () => {
      tag.classList.toggle("selected");
      updateFilterCount();
    });
  });
  document.querySelectorAll(".date-filter").forEach(i => 
    i.addEventListener("change", updateFilterCount)
  );
  document.querySelectorAll('input[name="genres"]').forEach(cb =>
    cb.addEventListener("change", updateFilterCount)
  );

  function updateFilterCount() {
    const selTags   = document.querySelectorAll(".filter-tag.selected").length;
    const selDates  = Array.from(document.querySelectorAll(".date-filter"))
                         .filter(i=>i.value!=="").length;
    const selGenres = document.querySelectorAll('input[name="genres"]:checked').length;
    const total     = selTags + selDates + selGenres;

    if (total === 0) {
      countEl.classList.add("hidden");
      document.querySelector(".filter-submit").disabled = true;
    } else {
      countEl.textContent = total;
      countEl.classList.remove("hidden");
      document.querySelector(".filter-submit").disabled = false;
    }
  }

  document.querySelector(".filter-menu").addEventListener("submit", (e) => {
    closeModal();
  });
});
