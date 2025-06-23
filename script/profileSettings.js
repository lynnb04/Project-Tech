            function enableEditing() {
                // Enable all input fields and select elements
                const fields = document.querySelectorAll('input, select, textarea, button');
                fields.forEach(field => field.disabled = false);

                // Hide the edit button
                document.querySelector('button[onclick="enableEditing()"]')
                  .style.display = "none";

                // Show the save button
                document.getElementById('saveButton').style.display = "inline-block";

                // Hide the logout button
                document.getElementById('logoutButton').style.display = "none";

                // Classlist bug fix
                document.body.classList.add("editingEnabled");

                sliderOne.disabled = false;
                sliderTwo.disabled = false;
            }

            // leeftijdsslider
            window.onload = function () {
            slideOne();
            slideTwo();
            };

            let sliderOne = document.getElementById("slider-1");
            let sliderTwo = document.getElementById("slider-2");
            let displayValOne = document.getElementById("range1");
            let displayValTwo = document.getElementById("range2");
            let minGap = 0;
            let sliderTrack = document.querySelector(".sliderTrack");
            let sliderMaxValue = document.getElementById("slider-1").max;

            function slideOne() {
            if (parseInt(sliderTwo.value) - parseInt(sliderOne.value) <= minGap) {
                sliderOne.value = parseInt(sliderTwo.value) - minGap;
            }
            displayValOne.textContent = sliderOne.value;
            fillColor();
            }
            function slideTwo() {
            if (parseInt(sliderTwo.value) - parseInt(sliderOne.value) <= minGap) {
                sliderTwo.value = parseInt(sliderOne.value) + minGap;
            }
            displayValTwo.textContent = sliderTwo.value;
            fillColor();
            }
            function fillColor() {
            percent1 = (sliderOne.value / sliderMaxValue) * 100;
            percent2 = (sliderTwo.value / sliderMaxValue) * 100;
            }
            //https://codepen.io/alexpg96/pen/xxrBgbP

            // Show input field for language 'anders'
            const elseRadio = document.getElementById("else");
            const elseInput = document.getElementById("taalAndersInput");

            const radioButtons = document.querySelectorAll('input[name="taal"]');

            radioButtons.forEach(rb => {
                rb.addEventListener("change", () => {
                if (elseRadio.checked) {
                    elseInput.style.display = "inline-block";
                } else {
                    elseInput.style.display = "none";
                    elseInput.value = ""; // reset
                }
                });
            });