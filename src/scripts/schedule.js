const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
let currentDate = new Date();

//renders calendar
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
        daysHTML += "<div class='calendar-day'></div>";
    }

    for (let i = 1; i <= daysInMonth; i++) {
        daysHTML += `<div class='calendar-day'>${i}</div>`;
    }

    document.getElementById('calendar-days').innerHTML = daysHTML;
}

document.getElementById('prev-month').addEventListener('click', () => {
    currentDate.setMonth(currentDate.getMonth() - 1);
    renderCalendar(currentDate);
});

document.getElementById('next-month').addEventListener('click', () => {
    currentDate.setMonth(currentDate.getMonth() + 1);
    renderCalendar(currentDate);
});
renderCalendar(currentDate);

document.getElementById("calendar-days").addEventListener('click', () => {
    window.location.href = "calendar.html";
});