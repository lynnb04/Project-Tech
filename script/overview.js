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
      const isHidden = filterMenu.classList.toggle("hidden");
      updateFilterCount();
    
      if (!isHidden) {
        // Openen: scroll naar boven en blokkeer scroll
        window.scrollTo({ top: 0, behavior: "smooth" });
        document.body.classList.add("no-scroll");
      } else {
        // Sluiten: scroll weer toestaan
        document.body.classList.remove("no-scroll");
      }
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
    
      const countElement = document.querySelector(".filter-count");
      const submitButton = document.querySelector(".filter-submit");
    
      // Aantal tonen/verbergen
      if (total === 0) {
        countElement.classList.add("hidden");
        submitButton.disabled = true;
      } else {
        countElement.textContent = total;
        countElement.classList.remove("hidden");
        submitButton.disabled = false;
      }
    }

    document.querySelector(".filter-submit").addEventListener("click", () => {
      const selectedTags = document.querySelectorAll(".filter-tag.selected");
      const selectedDates = Array.from(document.querySelectorAll(".date-filter")).filter(input => input.value !== "");
    
      const filters = {
        locatie: [],
        genre: [],
        datum: {}
      };
    
      selectedTags.forEach(tag => {
        const group = tag.closest(".filter-options").dataset.filterGroup;
        filters[group].push(tag.dataset.value);
      });
    
      const from = document.getElementById("date-from").value;
      const to = document.getElementById("date-to").value;
      if (from) filters.datum.vanaf = from;
      if (to) filters.datum.tot = to;
    
      console.log("Geselecteerde filters:", filters);
    
      // Filtermenu sluiten
      document.querySelector(".filter-menu").classList.add("hidden");
      document.body.classList.remove("no-scroll");
    });
  });