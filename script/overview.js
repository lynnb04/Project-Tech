document.addEventListener("DOMContentLoaded", function () {
  const filterBtn = document.querySelector(".filterBtn");
  const modal = document.getElementById("filterModal");
  const closeBtn = modal.querySelector(".closeBtn");
  const countEl = document.querySelector(".filterCount");

  if (!filterBtn || !modal) return;

  filterBtn.addEventListener("click", () => {
    modal.style.display = "flex";
    document.body.classList.add("noScroll");
    updateFilterCount();
  });

  closeBtn.addEventListener("click", () => {
    modal.style.display = "none";
    document.body.classList.remove("noScroll");
  });

  window.addEventListener("click", (e) => {
    if (e.target === modal) {
      modal.style.display = "none";
      document.body.classList.remove("noScroll");
    }
  });

  const concertList = new List('concert-list', {
    valueNames: ['name', { attr: 'data-date', name: 'date' }],
    listClass: 'list'
  });

  document.getElementById('sortSelect').addEventListener('change', function () {
    const [field, order] = this.value.split('-');
    concertList.sort(field, { order });
  });

  document.getElementById('search-input').addEventListener('input', function () {
    concertList.search(this.value);
  });

  document.querySelector('form[role="search"]').addEventListener('submit', e => e.preventDefault());

  document.querySelectorAll('.filterTag input[type="checkbox"]').forEach(checkbox => {
    checkbox.addEventListener('change', function() {
      if (this.checked) {
        this.closest('.filterTag').classList.add('selected');
      } else {
        this.closest('.filterTag').classList.remove('selected');
      }
      updateFilterCount();
    });
    if (checkbox.checked) {
      checkbox.closest('.filterTag').classList.add('selected');
    } else {
      checkbox.closest('.filterTag').classList.remove('selected');
    }
  });

  document.querySelectorAll(".dateFilter").forEach(input =>
    input.addEventListener("change", updateFilterCount)
  );

  function updateFilterCount() {
    const selTags = document.querySelectorAll(".filterTag.selected").length;
    const selDates = Array.from(document.querySelectorAll(".dateFilter"))
      .filter(i => i.value !== "").length;
    const total = selTags + selDates;

    if (total === 0) {
      countEl.classList.add("hidden");
    } else {
      countEl.textContent = total;
      countEl.classList.remove("hidden");
    }
  }

  document.querySelector('.filterSubmit').disabled = false;

  document.querySelector(".filterMenu").addEventListener("submit", (e) => {
    modal.style.display = "none";
    document.body.classList.remove("noScroll");
  });
});

const concertCard = document.querySelectorAll('article li'); concertCard.forEach((li, index) => { const zIndex = concertCard.length - index; li.style.zIndex = zIndex; });