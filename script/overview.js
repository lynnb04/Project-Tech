const concertCard = document.querySelectorAll('article li');

concertCard.forEach((li, index) => {
  const zIndex = concertCard.length - index; 
  li.style.zIndex = zIndex;
});


document.addEventListener("DOMContentLoaded", function () {
    const filterBtn = document.querySelector(".filter");
    const filterMenu = document.querySelector(".filter-menu");
    const filterCountDisplay = document.querySelector(".filter-count");
  
    if (!filterBtn || !filterMenu) {
      console.warn("Filter-knop of menu niet gevonden");
      return;
    }
  
    filterBtn.addEventListener("click", () => {
      filterMenu.classList.toggle("hidden");
      updateFilterCount();
    });
  
    document.querySelectorAll(".filter-tag").forEach(tag => {
      tag.addEventListener("click", () => {
        tag.classList.toggle("selected");
        updateFilterCount();
      });
    });
  
    document.querySelectorAll(".date-filter").forEach(input => {
      input.addEventListener("change", updateFilterCount);
    });
  
    function updateFilterCount() {
      const selectedTags = document.querySelectorAll(".filter-tag.selected").length;
      const selectedDates = Array.from(document.querySelectorAll(".date-filter")).filter(i => i.value !== "").length;
      const total = selectedTags + selectedDates;
      filterCountDisplay.textContent = total;
    }
  });