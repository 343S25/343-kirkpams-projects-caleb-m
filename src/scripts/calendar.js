const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
let currentDate = new Date();

const eventInput = document.getElementById("event-input");
const eventList = document.getElementById("event-list");
let eventDOM = JSON.parse(localStorage.getItem("events")) || [];

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

    for (let i = 0; i < startingDay; i++) {
        daysHTML += `<div class='calendar-day'></div>`;
    }

    for (let i = 1; i <= daysInMonth; i++) {
        daysHTML += `<div class='calendar-day' data-day='${i}'>${i}</div>`;
    }

    document.getElementById('calendar-days').innerHTML = daysHTML;
}

currentSelectedDay = null;

function attachDayClickListeners() {
    const days = document.querySelectorAll('.calendar-day');
    days.forEach(day => {
        const dayNumber = day.dataset.day;
        day.addEventListener('click', () => {
            console.log(`You clicked on day ${dayNumber}`);
            openForm();
            currentSelectedDay = dayNumber;
        });
    });
}

document.getElementById('prev-month').addEventListener('click', () => {
    currentDate.setMonth(currentDate.getMonth() - 1);
    renderCalendar(currentDate);
    attachDayClickListeners();
    renderEvents();
});

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
    console.log("hi");
    document.getElementById("form").style.display = "none";
}

let eventsList = JSON.parse(localStorage.getItem("events")) || [];

function saveEvents() {
    localStorage.setItem("events", JSON.stringify(eventDOM));
}

function renderEvents() {
    document.querySelectorAll('.calendar-day').forEach(dayDiv => {
        dayDiv.querySelectorAll('.event').forEach(e => e.remove());
    });

    const currentMonth = currentDate.getMonth();
    const currentYear = currentDate.getFullYear();

    eventDOM
        .filter(event => event.month === currentMonth && event.year === currentYear)
        .forEach(event => {
            const parentDiv = document.querySelector(`.calendar-day[data-day='${event.day}']`);
            if (!parentDiv) return;

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

            div.querySelector('.delete-btn').addEventListener('click', function (e) {
                e.stopPropagation();
                deleteEvent(event.id);
            });

            div.querySelector('.edit-btn').addEventListener('click', function (e) {
                e.stopPropagation();
                editNote(event.id);
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