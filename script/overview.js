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
  
    // Initialize selected state for filter tags
    document.querySelectorAll(".filter-tag").forEach(tag => {
      if (tag.dataset.selected === 'true') {
        tag.classList.add('selected');
      }
      
      tag.addEventListener("click", () => {
        tag.classList.toggle("selected");
        updateFilterCount();
      });
    });
  
    document.querySelectorAll(".date-filter").forEach(input => {
      input.addEventListener("change", updateFilterCount);
    });

    // Add event listeners for genre checkboxes
    document.querySelectorAll('input[name="genres"]').forEach(checkbox => {
      checkbox.addEventListener('change', updateFilterCount);
    });
  
    function updateFilterCount() {
      const selectedTags = document.querySelectorAll(".filter-tag.selected").length;
      const selectedDates = Array.from(document.querySelectorAll(".date-filter")).filter(i => i.value !== "").length;
      const selectedGenres = Array.from(document.querySelectorAll('input[name="genres"]:checked')).length;
      const total = selectedTags + selectedDates + selectedGenres;
    
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

    // Handle form submission
    document.querySelector(".filter-menu").addEventListener("submit", (e) => {
      const selectedTags = document.querySelectorAll(".filter-tag.selected");
      const selectedCities = Array.from(selectedTags).map(tag => tag.dataset.value);
      
      // Add selected cities to form data
      if (selectedCities.length > 0) {
        const citiesInput = document.createElement('input');
        citiesInput.type = 'hidden';
        citiesInput.name = 'cities';
        citiesInput.value = selectedCities.join(',');
        e.target.appendChild(citiesInput);
      }
    });
  });