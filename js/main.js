import dedent from "./dedent.js";
let bsMovieInfoCarousel;

/* Registers swipe actions to navigate movies modal */
document.addEventListener("touchstart", event => {

  bsMovieInfoCarousel.touchStartY = event.changedTouches[0].screenY,
    bsMovieInfoCarousel.touchStartX = event.changedTouches[0].screenX;
});
document.addEventListener("touchend", event => {

  let touchEndY = event.changedTouches[0].screenY,
    touchEndX = event.changedTouches[0].screenX,
    touchStartY = bsMovieInfoCarousel.touchStartY,
    touchStartX = bsMovieInfoCarousel.touchStartX,
    touchDiffY = Math.abs(touchStartY - touchEndY),
    touchDiffX = Math.abs(touchStartX - touchEndX);

  if (touchDiffY > touchDiffX && touchDiffY > 5)
    (touchStartY < touchEndY) ? nav_Modal("ArrowUp") : nav_Modal("ArrowDown");
  else if (touchDiffY < touchDiffX && touchDiffX > 5)
    (touchStartX < touchEndX) ? nav_Modal("ArrowLeft") : nav_Modal("ArrowRight");
});

/* Registers key bindings to navigate movies modal */
document.addEventListener("keydown", function (event) {

  if (["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"].includes(event.key))
    nav_Modal(event.key);
});

function nav_Modal(event) {

  let movieModal = document.getElementById("movieInfo");
  if (!bsMovieInfoCarousel._isSliding && (window.getComputedStyle(movieModal).display != "none")) {
    let carIndex = Array.prototype.indexOf.call(bsMovieInfoCarousel._items, bsMovieInfoCarousel._activeElement);
    switch (event) {
      case "ArrowUp":
        carIndex += carIndex < 5 ? 20 : -5;
        break;
      case "ArrowDown":
        carIndex += carIndex > 19 ? -20 : 5;
        break;
      case "ArrowLeft":
        carIndex -= 1;
        break;
      case "ArrowRight":
        carIndex += 1;
        break;
    }
    bsMovieInfoCarousel.to(carIndex);
    carIndex = null;
  }
}

/* Registers a trigger for webpage elements complete loading */
document.addEventListener("DOMContentLoaded", function () {

  let urlParams = new URLSearchParams(window.location.search).get("year"), /* Gets page year from address bar */
    viewMax = screen.width > screen.height ? screen.width : screen.height, /* Get largest screen dimension */
    yearBtns = document.getElementsByClassName("nav-year"),
    year = urlParams ? urlParams : "2023";

  document.querySelector(".carousel-control-up").addEventListener("click", function () { nav_Modal("ArrowUp") });
  document.querySelector(".carousel-control-down").addEventListener("click", function () { nav_Modal("ArrowDown") });

  for (let i = 0; i < yearBtns.length; i++)
    yearBtns[i].addEventListener("click", function () { load_Mingo(yearBtns[i].id); });

  load_Mingo(year);

  urlParams = null, viewMax = null, year = null;
});


/* Registers a trigger for webpage elements & resources complete loading */
window.addEventListener("load", function () {
  setTimeout(function () {
    const resetDateInMiliseconds = new Date(new Date().getFullYear() + 1, 4, 1).getTime();
    // Initialize the countdown clock
    const countdownEl = document.getElementById('countdown');
    const daysElement = document.getElementById("days");
    const hoursElement = document.getElementById("hours");
    const minutesElement = document.getElementById("minutes");
    const secondsElement = document.getElementById("seconds");

    const loader = document.querySelector(".loader");

    let countdownActive;
    const second = 1000;
    const minute = second * 60;
    const hour = minute * 60;
    const day = hour * 24;

    function initializeCountdownClock() {
      countdownActive = setInterval(() => {
        const today = new Date().getTime(); // Get the current time
        const distance = resetDateInMiliseconds - today; // Get the distance between today and the reset date
        const days = Math.floor(distance / day);
        const hours = Math.floor((distance % day) / hour);
        const minutes = Math.floor((distance % hour) / minute);
        const seconds = Math.floor((distance % minute) / second);

        if (distance < 0) {
          clearInterval(countdownActive);
          countdownEl.style.display = "none"; // Hide the countdown clock
        } else {
          countdownActive === true;
          daysElement.textContent = `${days}`;
          hoursElement.textContent = `${hours}`;
          minutesElement.textContent = `${minutes}`;
          secondsElement.textContent = `${seconds}`;
        }
      }, second);
    }

    initializeCountdownClock();
    loader.style.opacity = '0';
    setTimeout(function () { loader.style.display = "none"; }, 500);
  }, 4000);
}, false);

function load_Mingo(year) {

  fetch(`./jsons/${year}.json`)
    .then(response => response.json())
    .then(movies => {
      console.log('movies: ', movies);
      // tag movies with order and year properties
      const taggedMovies = movies.map((movie, index) => ({
        ...movie,
        order: index,
        listYear: year
      }));
      console.log('tagged movies: ', taggedMovies);
      // map order property from tagged movies
      const taggedOrder = taggedMovies.map(movie => movie.order);
      console.log('tagged order: ', taggedOrder);
      // on click randomize tagged order
      const randomizeOrder = () => {
        const randomizedOrder = taggedOrder;
        for (let i = randomizedOrder.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1));
          [randomizedOrder[i], randomizedOrder[j]] = [randomizedOrder[j], randomizedOrder[i]];
        }
        console.log(randomizedOrder);
      };
      const randomizeButton = document.getElementById("randomizeListBtn");
      randomizeButton.addEventListener("click", randomizeOrder);

      const color = ['M', 'I', 'N', 'G', 'O'];
      let tBody1 = document.getElementById("mingo-body"),
        tBody2 = tBody1.cloneNode(true),
        tCells = tBody2.getElementsByTagName("td"),
        carousel1 = document.getElementById("carouselMovieInfo"),
        carousel2 = carousel1.cloneNode(true),
        carInner = carousel2.querySelector("#carouselMovieInfo .carousel-inner"),
        carIndic = carousel2.querySelector("#carouselMovieInfo .carousel-indicators");

      carInner.innerHTML = '';
      carIndic.innerHTML = '';

      for (let i = 0, j = 0, k = 1; i < tCells.length; i++, j++) {
        const movie = taggedMovies.find(movie => movie.order === i);
        if (j > 4) {
          j = 0;
          k++;
        }
        tCells[i].childNodes[0].childNodes[0].style.backgroundImage = `url("${movie.poster}")`;
        tCells[i].childNodes[0].childNodes[1].innerHTML = movie.name;

        carInner.innerHTML += dedent`
          <article class="carousel-item ${i === 0 ? "active" : ''}">
            <table width="100%" height="100%">
              <tbody>
                <tr><td rowspan="0"><img class="poster ${color[j]}" src="${movie.poster}" loading="lazy"></td></tr>
                <tr><td colspan="2"><h2>${movie.name}</h2></td></tr>
                <tr>
                  <td class="w-50 text-nowrap"><span class="float-end">Year:</span></td>
                  <td class="w-50">${movie.year}</td>
                </tr>
                <tr>
                  <td class="w-50 text-nowrap"><span class="float-end">${movie.ratingNameOne}:</span></td>
                  <td class="w-50"><span class="rating stars-${movie.ratingOne}"></span></td>
                </tr>
                <tr>
                  <td class="w-50 text-nowrap"><span class="float-end">${movie.ratingNameTwo}:</span></td>
                  <td class="w-50"><span class="rating stars-${movie.ratingTwo}"></span></td>
                </tr>
                <tr><td colspan="2"><p>${movie.description}</p></td></tr>
              </tbody>
            </table>
          </article>
        `;

        carIndic.innerHTML += dedent`
          <button class="nav-item ${i === 0 ? ' active' : ''}"
            type="button" data-bs-target="#carouselMovieInfo"
            data-bs-slide-to="${i}" aria-label="Slide ${i}">
            ${color[j]}-${k}
          </button>
        `;
      }

      tBody1.replaceWith(tBody2);
      carousel1.replaceWith(carousel2);
      bsMovieInfoCarousel = new bootstrap.Carousel(carousel2);

      {
        /* Get bootstrap year carousel */
        let yearNode = document.getElementById(year),
          yearIndx = Array.prototype.indexOf.call(yearNode.parentNode.parentNode.children, yearNode.parentNode),
          yearCaro = document.getElementById("historyCarouselControls"),
          yearBtns = document.getElementsByClassName("nav-year");

        for (let i = 0; i < yearBtns.length; i++)
          yearBtns[i].classList.remove("active")

        /* Highlights the page nav button */
        yearNode.classList.add("active");
        new bootstrap.Carousel(yearCaro).to(yearIndx);

        yearNode = null, yearIndx = null, yearCaro = null, yearBtns = null;
      }

      tBody1 = null, tBody2 = null, tCells = null, carousel1 = null, carousel2 = null, carInner = null, carIndic = null, movies = null;
    })
    .catch(error => {
      console.log(error);
    });
}