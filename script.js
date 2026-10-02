// Machine Gun Rabbit — mobile nav toggle, close-on-tap, current year, past-show hiding.

(function () {
  "use strict";

  var toggle = document.querySelector(".nav-toggle");
  var nav = document.getElementById("nav");

  if (toggle && nav) {
    toggle.addEventListener("click", function () {
      var isOpen = nav.classList.toggle("open");
      toggle.setAttribute("aria-expanded", String(isOpen));
    });

    nav.addEventListener("click", function (event) {
      if (event.target.closest("a")) {
        nav.classList.remove("open");
        toggle.setAttribute("aria-expanded", "false");
      }
    });
  }

  // Hide shows whose last night has ended (each row's data-ends is an ISO
  // timestamp) and move the pink "next" highlight to the first show left.
  function updateShowList(now) {
    var rows = document.querySelectorAll(".gig-row[data-ends]");
    var nextRow = null;

    Array.prototype.forEach.call(rows, function (row) {
      var endsAt = Date.parse(row.getAttribute("data-ends"));
      var hasEnded = !isNaN(endsAt) && endsAt <= now;
      row.hidden = hasEnded;
      row.classList.remove("gig-next");
      if (!hasEnded && nextRow === null) {
        nextRow = row;
      }
    });

    if (nextRow) {
      nextRow.classList.add("gig-next");
    }

    var emptyNote = document.querySelector(".gig-empty");
    if (emptyNote) {
      emptyNote.hidden = rows.length > 0 && nextRow !== null;
    }
  }

  updateShowList(Date.now());

  var yearEl = document.getElementById("year");
  if (yearEl) {
    yearEl.textContent = String(new Date().getFullYear());
  }
})();
