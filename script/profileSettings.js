            function enableEditing() {
                // Schakel alle invoervelden en select-elementen in
                const fields = document.querySelectorAll('input, select, textarea, button');
                fields.forEach(field => field.disabled = false);

                // Verberg de bewerk-knop
                document.querySelector('button[onclick="enableEditing()"]').style.display = "none";

                // Toon de opslaan-knop
                document.getElementById('saveButton').style.display = "inline-block";

                // Verberg de uitlog-knop
                document.getElementById('logoutButton').style.display = "none";

                // Classlist bug fix
                document.body.classlist.add("editing-enabled");

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
            let sliderTrack = document.querySelector(".slider-track");
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

            // tonen van invulveld bij taal-anders
            const andersRadio = document.getElementById("else");
            const andersInput = document.getElementById("taal-anders-input");

            const radioButtons = document.querySelectorAll('input[name="taal"]');

            radioButtons.forEach(rb => {
                rb.addEventListener("change", () => {
                if (andersRadio.checked) {
                    andersInput.style.display = "inline-block";
                } else {
                    andersInput.style.display = "none";
                    andersInput.value = ""; // reset
                }
                });
            });