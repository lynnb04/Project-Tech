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

  const concertList = new List('concert-list', {
    valueNames: ['name', { attr: 'data-date', name: 'date' }],
    listClass: 'list'
  });

  document.getElementById('sort-select').addEventListener('change', function () {
    const [field, order] = this.value.split('-');
    concertList.sort(field, { order });
  });

  document.getElementById('search-input').addEventListener('input', function () {
    concertList.search(this.value);
  });

  document.querySelector('form[role="search"]').addEventListener('submit', e => e.preventDefault());

  document.querySelectorAll('.filter-tag input[type="checkbox"]').forEach(checkbox => {
    checkbox.addEventListener('change', function() {
      if (this.checked) {
        this.closest('.filter-tag').classList.add('selected');
      } else {
        this.closest('.filter-tag').classList.remove('selected');
      }
      updateFilterCount();
    });
    if (checkbox.checked) {
      checkbox.closest('.filter-tag').classList.add('selected');
    } else {
      checkbox.closest('.filter-tag').classList.remove('selected');
    }
  });

  document.querySelectorAll(".date-filter").forEach(input =>
    input.addEventListener("change", updateFilterCount)
  );

  function updateFilterCount() {
    const selTags = document.querySelectorAll(".filter-tag.selected").length;
    const selDates = Array.from(document.querySelectorAll(".date-filter"))
      .filter(i => i.value !== "").length;
    const total = selTags + selDates;

    if (total === 0) {
      countEl.classList.add("hidden");
    } else {
      countEl.textContent = total;
      countEl.classList.remove("hidden");
    }
  }

  document.querySelector('.filter-submit').disabled = false;

  document.querySelector(".filter-menu").addEventListener("submit", (e) => {
    modal.style.display = "none";
    document.body.classList.remove("no-scroll");
  });
});

const concertCard = document.querySelectorAll('article li'); concertCard.forEach((li, index) => { const zIndex = concertCard.length - index; li.style.zIndex = zIndex; });