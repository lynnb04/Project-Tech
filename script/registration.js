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
    const min = parseInt(sliderOne.min);
    const max = parseInt(sliderOne.max);
  
    const percent1 = ((sliderOne.value - min) / (max - min)) * 100;
    const percent2 = ((sliderTwo.value - min) / (max - min)) * 100;
  
    sliderTrack.style.background = `linear-gradient(to right, #dadae5 ${percent1}%, #6B3AB4 ${percent1}%, #6B3AB4 ${percent2}%, #dadae5 ${percent2}%)`;
}
  
//https://codepen.io/alexpg96/pen/xxrBgbP