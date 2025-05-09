const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
let currentDate = new Date();

const eventInput = document.getElementById("event-input");
const eventList = document.getElementById("event-list");
let eventDOM = JSON.parse(localStorage.getItem("events")) || [];

// Renders calander for date given
function renderCalendar(date) {
    const month = date.getMonth();
    const year = date.getFullYear();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);

    document.getElementById('month-name').innerText = monthNames[month];
    document.getElementById('year').innerText = year;

    const daysInMonth = lastDay.getDate();
    const startingDay = firstDay.getDay();

    let daysHTML = "";

    //adds empty divs for days before 1st
    for (let i = 0; i < startingDay; i++) {
        daysHTML += `<div class='calendar-day'></div>`;
    }

    //actual days with dataset for day
    for (let i = 1; i <= daysInMonth; i++) {
        daysHTML += `<div class='calendar-day' data-day='${i}'>${i}</div>`;
    }

    //Inserts
    document.getElementById('calendar-days').innerHTML = daysHTML;
}

currentSelectedDay = null;

//adds listeners to each individual day
function attachDayClickListeners() {
    const days = document.querySelectorAll('.calendar-day');
    days.forEach(day => {
        const dayNumber = day.dataset.day;
        day.addEventListener('click', () => {
            openForm();
            currentSelectedDay = dayNumber;
        });
    });
}

//changes to prev month
document.getElementById('prev-month').addEventListener('click', () => {
    currentDate.setMonth(currentDate.getMonth() - 1);
    renderCalendar(currentDate);
    attachDayClickListeners();
    renderEvents();
});

//changes to next month
document.getElementById('next-month').addEventListener('click', () => {
    currentDate.setMonth(currentDate.getMonth() + 1);
    renderCalendar(currentDate);
    attachDayClickListeners();
    renderEvents();
});

renderCalendar(currentDate);
attachDayClickListeners();

function openForm() {
    document.getElementById("form").style.display = "block";
}

function closeForm() {
    document.getElementById("form").style.display = "none";
}

//parse through local Storage
let eventsList = JSON.parse(localStorage.getItem("events")) || [];

function saveEvents() {
    localStorage.setItem("events", JSON.stringify(eventDOM));
}

function renderEvents() {
    //remove preexisting - already loaded - events
    document.querySelectorAll('.calendar-day').forEach(dayDiv => {
        dayDiv.querySelectorAll('.event').forEach(e => e.remove());
    });

    const currentMonth = currentDate.getMonth();
    const currentYear = currentDate.getFullYear();

    //filer for events in current month and year
    eventDOM
        .filter(event => event.month === currentMonth && event.year === currentYear)
        .forEach(event => {
            const parentDiv = document.querySelector(`.calendar-day[data-day='${event.day}']`);
            if (!parentDiv) return;

            //creating event div to add.
            const div = document.createElement("div");
            div.className = "event";
            div.innerHTML = `
                <p>${event.event}</p>
                <div class="button-group">
                <button class="edit-btn">Edit</button>
                <button class="delete-btn">Delete</button>
                </div>
            `;

            parentDiv.appendChild(div);

            //delete func
            div.querySelector('.delete-btn').addEventListener('click', function (e) {
                e.stopPropagation();
                deleteEvent(event.id);
            });

            //edit func
            div.querySelector('.edit-btn').addEventListener('click', function (e) {
                e.stopPropagation();
                editEvent(event.id);
            });
        });
}

function addEvent(event, day, month) {
    const eventTemp = {
        id: `event_${month}_${day}_${currentDate.getFullYear()}`,
        event,
        timestamp: new Date().toLocaleString(),
        day,
        month,
        year: currentDate.getFullYear()
    };
    eventDOM.push(eventTemp);
    saveEvents();
    renderEvents();
}


function deleteEvent(id) {
    eventDOM = eventDOM.filter(event => event.id !== id);
    saveEvents();
    renderEvents();
}

function editEvent(id) {
    const event = eventDOM.find(n => n.id === id);
    const newEvent = prompt("Edit your Event:", event.event);
    if (newEvent !== null && newEvent.trim() !== "") {
      event.event = newEvent.trim();
      saveEvents();
      renderEvents();
    }
  }

document.querySelector('.form').addEventListener('submit', function (e) {
    e.preventDefault();
    const event = eventInput.value.trim();
    console.log(currentSelectedDay);
    if (event) {
        addEvent(event, currentSelectedDay, currentDate.getMonth());
        eventInput.value = "";
    }
    closeForm();
});

function closeFormInit() {
    document.getElementById("form").style.display = "none";
}

renderEvents();

function exportEvents() {
    const dataStr = JSON.stringify(eventDOM, null, 2);
    const blob = new Blob([dataStr], { type: "application/json" });
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = "events.json";
    a.click();
    URL.revokeObjectURL(url);
}

function importEvents(event) {
    //gets first file selected
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    //when file finishes loading, run
    reader.onload = function (e) {
        try {
            const imported = JSON.parse(e.target.result);
            //make sure array is valid
            if (Array.isArray(imported)) {
                eventDOM = imported;
                saveEvents();
                renderCalendar(currentDate);
                attachDayClickListeners();
                renderEvents();
                alert("Events imported successfully!");
            } else {
                alert("Invalid JSON format.");
            }
        } catch (err) {
            alert("Error reading file.");
        }
    };
    reader.readAsText(file);
}

function clearAllEvents() {
    if (confirm("Are you sure you want to delete all events?")) {
        localStorage.removeItem("events");
        eventDOM = [];
        renderCalendar(currentDate);
        attachDayClickListeners();
        renderEvents();
    }
}
