document.addEventListener("DOMContentLoaded", function () {
  const filterBtn = document.querySelector(".filter");
  const modal = document.getElementById("filterModal");
  const closeBtn = modal.querySelector(".close-btn");
  const countEl = document.querySelector(".filter-count");

  if (!filterBtn || !modal) return;

  filterBtn.addEventListener("click", () => {
    modal.style.display = "flex";
    document.body.classList.add("no-scroll");
    updateFilterCount();
  });

  closeBtn.addEventListener("click", () => {
    modal.style.display = "none";
    document.body.classList.remove("no-scroll");
  });

  window.addEventListener("click", (e) => {
    if (e.target === modal) {
      modal.style.display = "none";
      document.body.classList.remove("no-scroll");
    }
  });

  // Init List.js
  const concertList = new List('concert-list', {
    valueNames: ['name', { attr: 'data-date', name: 'date' }],
    listClass: 'list'
  });

  // Sorting
  document.getElementById('sort-select').addEventListener('change', function () {
    const [field, order] = this.value.split('-');
    concertList.sort(field, { order });
  });

  // Search
  document.getElementById('search-input').addEventListener('input', function () {
    concertList.search(this.value);
  });

  document.querySelector('form[role="search"]').addEventListener('submit', e => e.preventDefault());

  // Filter tags (cities + genres)
  document.querySelectorAll(".filter-tag").forEach(tag => {
    const checkbox = tag.querySelector('input[type="checkbox"]');
    tag.addEventListener("click", (e) => {
      e.preventDefault(); // voorkomt dubbele toggling
      tag.classList.toggle("selected");
      checkbox.checked = !checkbox.checked;
      updateFilterCount();
    });
  });

  // Date filters
  document.querySelectorAll(".date-filter").forEach(input =>
    input.addEventListener("change", updateFilterCount)
  );

  // Update counter
  function updateFilterCount() {
    const selTags = document.querySelectorAll(".filter-tag.selected").length;
    const selDates = Array.from(document.querySelectorAll(".date-filter"))
      .filter(i => i.value !== "").length;
    const total = selTags + selDates;

    if (total === 0) {
      countEl.classList.add("hidden");
      document.querySelector(".filter-submit").disabled = true;
    } else {
      countEl.textContent = total;
      countEl.classList.remove("hidden");
      document.querySelector(".filter-submit").disabled = false;
    }
  }

  // Submit sluit modal
  document.querySelector(".filter-menu").addEventListener("submit", (e) => {
    // e.preventDefault();
    modal.style.display = "none";
    document.body.classList.remove("no-scroll");
  });
});
