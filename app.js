const siteHeader = document.getElementById("siteHeader");
const pageHeader = document.getElementById("pageHeader");
const routeForm = document.getElementById("routeForm");
const routeCardList = document.getElementById("routeCardList");
const selectedRouteInput = document.getElementById("selectedRouteInput");
const travelDate = document.getElementById("travelDate");

function applyScrollHeader(headerEl) {
  if (!headerEl) return;

  window.addEventListener("scroll", () => {
    if (window.scrollY > 30) {
      headerEl.classList.add("scrolled");
    } else {
      headerEl.classList.remove("scrolled");
    }
  });
}

applyScrollHeader(siteHeader);
applyScrollHeader(pageHeader);

if (travelDate) {
  const today = new Date();
  const yyyy = today.getFullYear();
  const mm = String(today.getMonth() + 1).padStart(2, "0");
  const dd = String(today.getDate()).padStart(2, "0");
  const minDate = `${yyyy}-${mm}-${dd}`;

  travelDate.min = minDate;
  travelDate.value = minDate;
}

// Route card selection on landing page
if (routeCardList) {
  const routeCards = routeCardList.querySelectorAll(".route-select-card");

  routeCards.forEach((card) => {
    card.addEventListener("click", () => {
      routeCards.forEach((item) => item.classList.remove("active"));
      card.classList.add("active");

      if (selectedRouteInput) {
        selectedRouteInput.value = card.dataset.route;
      }
    });
  });
}

// Landing page form submit
if (routeForm) {
  routeForm.addEventListener("submit", (e) => {
    e.preventDefault();

    const selectedRoute = selectedRouteInput ? selectedRouteInput.value.trim() : "";

    if (!selectedRoute) {
      alert("Please select one route.");
      return;
    }

    localStorage.setItem("selectedRoute", selectedRoute);
    window.location.href = "schedule.html";
  });
}

// Show selected route across pages
const selectedRouteText = document.getElementById("selectedRouteText");
const summaryRouteText = document.getElementById("summaryRouteText");
const seatRouteText = document.getElementById("seatRouteText");
const summaryRouteMain = document.getElementById("summaryRouteMain");
const successRouteText = document.getElementById("successRouteText");

const savedRoute = localStorage.getItem("selectedRoute");

if (savedRoute) {
  if (selectedRouteText) selectedRouteText.textContent = savedRoute;
  if (summaryRouteText) summaryRouteText.textContent = savedRoute;
  if (seatRouteText) seatRouteText.textContent = savedRoute;
  if (summaryRouteMain) summaryRouteMain.textContent = savedRoute;
  if (successRouteText) successRouteText.textContent = savedRoute;
}

// Seat selection
const seatGrid = document.getElementById("seatGrid");
const selectedSeatText = document.getElementById("selectedSeatText");
const summarySeatText = document.getElementById("summarySeatText");
const successSeatText = document.getElementById("successSeatText");

function updateSelectedSeatUI(seats) {
  const seatText = seats.length ? seats.join(", ") : "None";

  if (selectedSeatText) selectedSeatText.textContent = seatText;
  if (summarySeatText) summarySeatText.textContent = seatText;
  if (successSeatText) successSeatText.textContent = seatText;
}

if (seatGrid) {
  const seatButtons = seatGrid.querySelectorAll(".seat:not(.booked)");
  let selectedSeats = JSON.parse(localStorage.getItem("selectedSeats") || "[]");

  seatButtons.forEach((seat) => {
    const seatNumber = seat.textContent.trim();

    if (selectedSeats.includes(seatNumber)) {
      seat.classList.add("selected");
    }

    seat.addEventListener("click", () => {
      const isSelected = seat.classList.contains("selected");

      if (isSelected) {
        seat.classList.remove("selected");
        selectedSeats = selectedSeats.filter((item) => item !== seatNumber);
      } else {
        seat.classList.add("selected");
        selectedSeats.push(seatNumber);
      }

      localStorage.setItem("selectedSeats", JSON.stringify(selectedSeats));
      localStorage.setItem("selectedSeat", selectedSeats.join(", "));
      updateSelectedSeatUI(selectedSeats);
    });
  });

  updateSelectedSeatUI(selectedSeats);
}

// Load selected seat on summary/success pages
const savedSeat = localStorage.getItem("selectedSeat");

if (savedSeat) {
  if (summarySeatText) summarySeatText.textContent = savedSeat;
  if (successSeatText) successSeatText.textContent = savedSeat;
} else {
  if (summarySeatText) summarySeatText.textContent = "None";
  if (successSeatText) successSeatText.textContent = "None";
}

// Download ticket as PDF/print
const downloadTicketBtn = document.getElementById("downloadTicketBtn");

if (downloadTicketBtn) {
  downloadTicketBtn.addEventListener("click", () => {
    const ticketWindow = window.open("", "_blank");
    const finalRoute = localStorage.getItem("selectedRoute") || "Batticaloa ⇄ Colombo";
    const finalSeat = localStorage.getItem("selectedSeat") || "None";

    ticketWindow.document.write(`
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <title>BT Express Ticket</title>
        <style>
          body {
            font-family: Arial, sans-serif;
            padding: 28px;
            color: #222;
          }
          .ticket {
            max-width: 760px;
            margin: auto;
            border: 2px solid #ff7a14;
            border-radius: 18px;
            overflow: hidden;
          }
          .head {
            background: linear-gradient(135deg, #ff7a14, #ff9b3d);
            color: white;
            padding: 24px;
            text-align: center;
          }
          .head h2 {
            margin: 0 0 6px;
          }
          .body {
            padding: 24px;
          }
          .row {
            display: flex;
            justify-content: space-between;
            gap: 12px;
            padding: 12px 0;
            border-bottom: 1px dashed #ccc;
          }
          .label {
            font-weight: bold;
          }
          .footer {
            padding: 18px 24px;
            background: #fff7ef;
            text-align: center;
            color: #555;
          }
        </style>
      </head>
      <body>
        <div class="ticket">
          <div class="head">
            <h2>BT EXPRESS</h2>
            <p>Customer Travel Ticket</p>
          </div>
          <div class="body">
            <div class="row"><span class="label">Reference Number</span><span>BTX-2026-10254</span></div>
            <div class="row"><span class="label">Passenger Name</span><span>Nimal Perera</span></div>
            <div class="row"><span class="label">NIC Number</span><span>200012345678</span></div>
            <div class="row"><span class="label">Route</span><span>${finalRoute}</span></div>
            <div class="row"><span class="label">Seat</span><span>${finalSeat}</span></div>
            <div class="row"><span class="label">Travel Date</span><span>2026-03-31</span></div>
            <div class="row"><span class="label">Payment</span><span>Pay Now</span></div>
          </div>
          <div class="footer">
            Please keep this ticket during travel. Thank you for choosing BT Express.
          </div>
        </div>
        <script>
          window.onload = function () {
            window.print();
          };
        <\/script>
      </body>
      </html>
    `);

    ticketWindow.document.close();
  });
}