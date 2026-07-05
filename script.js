function updateClock() {
  const now = new Date();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  const year = now.getFullYear();

  let hours = now.getHours();
  const minutes = String(now.getMinutes()).padStart(2, '0');
  const period = hours >= 12 ? 'pm' : 'am';
  hours = hours % 12 || 12;
  const time = `${String(hours).padStart(2, '0')}:${minutes}${period}`;

  document.querySelectorAll('[data-clock-month]').forEach((el) => { el.textContent = month; });
  document.querySelectorAll('[data-clock-day]').forEach((el) => { el.textContent = day; });
  document.querySelectorAll('[data-clock-year]').forEach((el) => { el.textContent = year; });
  document.querySelectorAll('[data-clock-time]').forEach((el) => { el.textContent = time; });
}

updateClock();
setInterval(updateClock, 1000);
