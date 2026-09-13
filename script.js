// ============================================================
// SCHEDULE TIMELINE
//
// Automatically positions events based on their dates.
// ============================================================

document.addEventListener("DOMContentLoaded", function () {

  const timeline =
    document.querySelector(".date-timeline");

  const monthTicksContainer =
    document.querySelector(".month-ticks");

  const events =
    Array.from(
      document.querySelectorAll(".h-event")
    );


  if (
    !timeline ||
    !monthTicksContainer ||
    events.length === 0
  ) {
    return;
  }


  // ----------------------------------------------------------
  // Read all event dates
  // ----------------------------------------------------------

  const eventDates =
    events.map(function (event) {
      return new Date(
        event.dataset.date + "T00:00:00"
      );
    });


  // ----------------------------------------------------------
  // Find earliest and latest events
  // ----------------------------------------------------------

  const earliest =
    new Date(
      Math.min(
        ...eventDates.map(
          date => date.getTime()
        )
      )
    );


  const latest =
    new Date(
      Math.max(
        ...eventDates.map(
          date => date.getTime()
        )
      )
    );


  // ----------------------------------------------------------
  // Timeline starts at first day of earliest month
  // and ends at first day after latest month.
  // ----------------------------------------------------------

  const rangeStart =
    new Date(
      earliest.getFullYear(),
      earliest.getMonth(),
      1
    );


  const rangeEnd =
    new Date(
      latest.getFullYear(),
      latest.getMonth() + 1,
      1
    );


  const msPerDay =
    1000 *
    60 *
    60 *
    24;


  const totalDays =
    (rangeEnd - rangeStart) /
    msPerDay;


  // ----------------------------------------------------------
  // Convert a date into a percentage position.
  // ----------------------------------------------------------

  function percentForDate(date) {

    const daysFromStart =
      (date - rangeStart) /
      msPerDay;


    return (
      daysFromStart /
      totalDays
    ) * 100;
  }


  // ----------------------------------------------------------
  // Position each event.
  // ----------------------------------------------------------

  events.forEach(
    function (event, index) {

      const percentage =
        percentForDate(
          eventDates[index]
        );


      event.style.left =
        percentage + "%";
    }
  );


  // ----------------------------------------------------------
  // Generate month ticks.
  // ----------------------------------------------------------

  const monthNames = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec"
  ];


  monthTicksContainer.innerHTML = "";


  let cursor =
    new Date(rangeStart);


  while (cursor <= rangeEnd) {

    const pct = percentForDate(cursor);

const tick = document.createElement("div");
tick.className = "month-tick";

/*
  Keep the first and last month labels inside
  the visible timeline area.
*/

if (pct <= 0) {

  tick.style.left = "20px";

  tick.style.transform = "translateX(0)";

} else if (pct >= 100) {

  tick.style.left = "calc(100% - 20px)";

  tick.style.transform = "translateX(-100%)";

} else {

  tick.style.left = pct + "%";

}


    const label =
      document.createElement("span");


    label.textContent =
      monthNames[
        cursor.getMonth()
      ];


    tick.appendChild(label);

    monthTicksContainer.appendChild(
      tick
    );


    cursor =
      new Date(
        cursor.getFullYear(),
        cursor.getMonth() + 1,
        1
      );
  }

});


// ============================================================
// FADE SECTIONS INTO VIEW
// ============================================================

document.addEventListener(
  "DOMContentLoaded",
  function () {

    const sections =
      document.querySelectorAll(
        ".fade-section"
      );


    if (sections.length === 0) {
      return;
    }


    const observer =
      new IntersectionObserver(

        function (entries) {

          entries.forEach(
            function (entry) {

              if (entry.isIntersecting) {

                entry.target.classList.add(
                  "visible"
                );


                observer.unobserve(
                  entry.target
                );

              }

            }
          );

        },

        {
          threshold: 0.15
        }

      );


    sections.forEach(
      function (section) {

        observer.observe(section);

      }
    );

  }
);


// ============================================================
// SCROLL DOWN LABEL
//
// Fade the "SCROLL DOWN" label once the user starts scrolling.
// ============================================================

document.addEventListener(
  "DOMContentLoaded",
  function () {

    const scrollDown =
      document.querySelector(
        ".scroll-down"
      );


    if (!scrollDown) {
      return;
    }


    window.addEventListener(
      "scroll",
      function () {

        if (window.scrollY > 100) {

          scrollDown.classList.add(
            "scrolled"
          );

        } else {

          scrollDown.classList.remove(
            "scrolled"
          );

        }

      },

      {
        passive: true
      }
    );

  }
);


// ============================================================
// RESPONSIVE EXEC BOARD CAROUSEL
//
// Desktop: shows 3 cards
// Tablet:  shows 2 cards
// Phone:   shows 1 card
//
// Every arrow click moves ONE card.
// ============================================================

document.addEventListener("DOMContentLoaded", function () {

  const track = document.getElementById("execCards");

  const cards = Array.from(
    document.querySelectorAll("#execCards .exec-card")
  );

  const prevBtn = document.querySelector(
    ".carousel-arrow.prev"
  );

  const nextBtn = document.querySelector(
    ".carousel-arrow.next"
  );

  const dotsContainer = document.getElementById(
    "execDots"
  );


  if (
    !track ||
    cards.length === 0 ||
    !prevBtn ||
    !nextBtn ||
    !dotsContainer
  ) {
    return;
  }


  let currentIndex = 0;

  let cardsVisible = getCardsVisible();

  let maxIndex = Math.max(
    0,
    cards.length - cardsVisible
  );

  let dots = [];


  // ==========================================================
  // HOW MANY CARDS SHOULD BE VISIBLE?
  // ==========================================================

  function getCardsVisible() {

    if (window.innerWidth <= 600) {
      return 1;
    }

    if (window.innerWidth <= 900) {
      return 2;
    }

    return 3;
  }


  // ==========================================================
  // BUILD DOTS
  //
  // One dot for every possible carousel position.
  // ==========================================================

  function buildDots() {

    dotsContainer.innerHTML = "";

    dots = [];

    maxIndex = Math.max(
      0,
      cards.length - cardsVisible
    );


    for (
      let i = 0;
      i <= maxIndex;
      i++
    ) {

      const dot = document.createElement(
        "button"
      );

      dot.className = "carousel-dot";

      dot.setAttribute(
        "aria-label",
        "Go to board position " + (i + 1)
      );


      dot.addEventListener(
        "click",
        function () {

          goToIndex(i);

        }
      );


      dotsContainer.appendChild(dot);

      dots.push(dot);

    }

  }


  // ==========================================================
  // MOVE CAROUSEL
  // ==========================================================

  function moveCarousel(animate = true) {

    const styles = window.getComputedStyle(
      track
    );


    const gap =
      parseFloat(styles.gap) || 0;


    const cardWidth =
      cards[0]
        .getBoundingClientRect()
        .width;


    /*
      IMPORTANT:

      Move ONE card at a time.

      Previous version multiplied by cardsPerPage,
      which caused the carousel to jump several cards.
    */

    const distance =
      currentIndex *
      (cardWidth + gap);


    track.style.transition =
      animate
        ? "transform 0.55s cubic-bezier(0.22, 1, 0.36, 1)"
        : "none";


    track.style.transform =
      `translate3d(-${distance}px, 0, 0)`;

  }


  // ==========================================================
  // UPDATE ARROWS + DOTS
  // ==========================================================

  function updateControls() {

    dots.forEach(
      function (dot, index) {

        dot.classList.toggle(
          "active",
          index === currentIndex
        );

      }
    );


    prevBtn.disabled =
      currentIndex === 0;


    nextBtn.disabled =
      currentIndex === maxIndex;

  }


  // ==========================================================
  // GO TO A POSITION
  // ==========================================================

  function goToIndex(index) {

    currentIndex = Math.max(
      0,
      Math.min(
        index,
        maxIndex
      )
    );


    moveCarousel(true);

    updateControls();

  }


  // ==========================================================
  // PREVIOUS
  // ==========================================================

  prevBtn.addEventListener(
    "click",
    function () {

      goToIndex(
        currentIndex - 1
      );

    }
  );


  // ==========================================================
  // NEXT
  // ==========================================================

  nextBtn.addEventListener(
    "click",
    function () {

      goToIndex(
        currentIndex + 1
      );

    }
  );


  // ==========================================================
  // HANDLE WINDOW RESIZE
  // ==========================================================

  let resizeTimer;


  window.addEventListener(
    "resize",
    function () {

      clearTimeout(resizeTimer);


      resizeTimer = setTimeout(
        function () {

          const newCardsVisible =
            getCardsVisible();


          if (
            newCardsVisible !==
            cardsVisible
          ) {

            cardsVisible =
              newCardsVisible;


            maxIndex = Math.max(
              0,
              cards.length - cardsVisible
            );


            /*
              If we're too far to the right after resizing,
              move back to the last valid position.
            */

            if (
              currentIndex >
              maxIndex
            ) {

              currentIndex =
                maxIndex;

            }


            buildDots();

          }


          moveCarousel(false);

          updateControls();

        },
        100
      );

    }
  );


  // ==========================================================
  // INITIAL SETUP
  // ==========================================================

  buildDots();

  moveCarousel(false);

  updateControls();

});


// ============================================================
// ABOUT PHOTO CAROUSEL
// ============================================================

document.addEventListener(
  "DOMContentLoaded",
  function () {

    const track =
      document.getElementById(
        "aboutCarouselTrack"
      );


    const slides =
      Array.from(
        document.querySelectorAll(
          ".about-slide"
        )
      );


    const prevButton =
      document.querySelector(
        ".about-prev"
      );


    const nextButton =
      document.querySelector(
        ".about-next"
      );


    const dotsContainer =
      document.getElementById(
        "aboutCarouselDots"
      );


    if (
      !track ||
      slides.length === 0 ||
      !prevButton ||
      !nextButton ||
      !dotsContainer
    ) {
      return;
    }


    let currentSlide = 0;

    const dots = [];


    // --------------------------------------------------------
    // CREATE DOTS
    // --------------------------------------------------------

    slides.forEach(
      function (_, index) {

        const dot =
          document.createElement(
            "button"
          );


        dot.className =
          "about-carousel-dot";


        dot.setAttribute(
          "aria-label",
          "Go to photo " +
          (index + 1)
        );


        dot.addEventListener(
          "click",
          function () {

            goToSlide(index);

          }
        );


        dotsContainer.appendChild(dot);

        dots.push(dot);

      }
    );


    // --------------------------------------------------------
    // MOVE CAROUSEL
    // --------------------------------------------------------

    function moveCarousel() {

      const distance =
        currentSlide * 100;


      track.style.transform =
        `translateX(-${distance}%)`;

    }


    // --------------------------------------------------------
    // UPDATE CONTROLS
    // --------------------------------------------------------

    function updateControls() {

      dots.forEach(
        function (dot, index) {

          dot.classList.toggle(
            "active",
            index === currentSlide
          );

        }
      );


      prevButton.disabled =
        currentSlide === 0;


      nextButton.disabled =
        currentSlide ===
        slides.length - 1;

    }


    // --------------------------------------------------------
    // GO TO SLIDE
    // --------------------------------------------------------

    function goToSlide(index) {

      currentSlide =
        Math.max(
          0,
          Math.min(
            index,
            slides.length - 1
          )
        );


      moveCarousel();

      updateControls();

    }


    // --------------------------------------------------------
    // BUTTONS
    // --------------------------------------------------------

    prevButton.addEventListener(
      "click",
      function () {

        goToSlide(
          currentSlide - 1
        );

      }
    );


    nextButton.addEventListener(
      "click",
      function () {

        goToSlide(
          currentSlide + 1
        );

      }
    );


    // Initial state

    moveCarousel();

    updateControls();

  }
);

// ============================================================
// TIMELINE TOOLTIPS
//
// Adds click/tap support for Safari and mobile devices.
// Desktop hover continues to work normally.
// ============================================================

document.addEventListener("DOMContentLoaded", function () {

  const timelineEvents =
    document.querySelectorAll(".h-event");


  timelineEvents.forEach(function (event) {

    // Makes the event keyboard-focusable too
    event.setAttribute("tabindex", "0");


    event.addEventListener("click", function (e) {

      e.stopPropagation();


      const alreadyOpen =
        event.classList.contains("tooltip-open");


      // Close every other tooltip first
      timelineEvents.forEach(function (otherEvent) {

        otherEvent.classList.remove("tooltip-open");

      });


      // Toggle the one that was clicked
      if (!alreadyOpen) {

        event.classList.add("tooltip-open");

      }

    });

  });


  // Clicking anywhere else closes the tooltip

  document.addEventListener("click", function () {

    timelineEvents.forEach(function (event) {

      event.classList.remove("tooltip-open");

    });

  });

});