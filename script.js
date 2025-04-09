/*******************************************************
 * Demo-CSV-Daten (Beispiel, inline).
 * In der Praxis würdest du sie per "fetch('events.csv')" laden.
 *******************************************************/
const csvData = `Datum,Uhrzeit,Event,Dozent,Raum
2023-06-15,09:00,Mathematik Grundlagen,Herr Müller,Raum A3
2023-06-15,14:00,Englisch Konversation,Frau Schmidt,Raum B1
2023-06-16,10:30,Physik Experimente,Herr Wagner,Raum C2
2023-06-17,11:00,Geschichte Vortrag,Frau Meyer,Raum A1
2023-06-17,15:30,Chemie Labor,Herr Fischer,Raum D4
2023-06-18,08:45,Deutsch Grammatik,Frau Weber,Raum B2
2023-06-19,13:15,Informatik Programmierung,Herr Becker,Raum E1
2023-06-20,09:30,Biologie Seminar,Frau Hoffmann,Raum A2
2023-06-21,10:00,Geographie Präsentation,Herr Schulz,Raum C3
2023-06-22,14:45,Kunst Workshop,Frau Neumann,Raum F1
2023-06-23,11:30,Musik Theorie,Herr Zimmermann,Raum B3
2023-06-24,16:00,Sport Theorie,Frau Braun,Raum G2`;

/*******************************************************
 * CSV mittels Papa Parse parsen.
 *******************************************************/
const parsedData = Papa.parse(csvData, {
  header: true,
  skipEmptyLines: true
}).data;

/*******************************************************
 * Hilfsfunktionen fürs Formatieren von Datum & Zeit
 *******************************************************/
function formatDay(dateString) {
  const date = new Date(dateString);
  return date.getDate(); // Nur den Kalendertag
}

function formatWeekday(dateString) {
  const weekdays = ['Sonntag', 'Montag', 'Dienstag', 'Mittwoch', 'Donnerstag', 'Freitag', 'Samstag'];
  const date = new Date(dateString);
  return weekdays[date.getDay()];
}

function formatFullDate(dateString) {
  const date = new Date(dateString);
  return date.toDateString(); // "Thu Jun 15 2023" etc.
}

/*******************************************************
 * Events sortieren nach Datum/Zeit (aufsteigend)
 *******************************************************/
parsedData.sort((a, b) => {
  const dateA = new Date(`${a.Datum} ${a.Uhrzeit}`);
  const dateB = new Date(`${b.Datum} ${b.Uhrzeit}`);
  return dateA - dateB;
});

/*******************************************************
 * Events in den Container einfügen. Wir zeigen 
 * nur die nächsten 10 Events (Beispiel).
 *******************************************************/
const eventsContainer = document.getElementById('events-container');
const today = new Date();
today.setHours(0, 0, 0, 0); // "Entzeitigen"

const eventsToShow = parsedData.slice(0, 10);

let currentDay = null;

eventsToShow.forEach((event) => {
  const eventDate = new Date(`${event.Datum} ${event.Uhrzeit}`);
  const isToday = new Date(event.Datum).toDateString() === today.toDateString();
  const eventDay = formatFullDate(event.Datum);

  // Neuer Tag -> Tag-Überschrift einfügen
  if (eventDay !== currentDay) {
    currentDay = eventDay;
    const dayHeader = document.createElement('div');
    dayHeader.className = 'event-day day-header';

    let dayText = `${formatDay(event.Datum)}. ${formatWeekday(event.Datum)}`;
    if (isToday) {
      dayText += `<span class="today-marker">Heute</span>`;
    }
    dayHeader.innerHTML = dayText;
    eventsContainer.appendChild(dayHeader);
  }

  // Event-Element
  const eventElement = document.createElement('div');
  eventElement.className = 'event-item';

  // Heutiges Event hervorheben
  if (isToday) {
    eventElement.style.backgroundColor = '#f0f8ff';
    eventElement.style.padding = '8px';
    eventElement.style.borderRadius = '4px';
  }

  eventElement.innerHTML = `
    <div>
      <span class="event-time">${event.Uhrzeit}</span>
      <span class="event-name">${event.Event}</span>
      <span class="event-lecturer">${event.Dozent}</span>
      <span class="event-room">${event.Raum}</span>
    </div>
  `;
  
  eventsContainer.appendChild(eventElement);
});

/*******************************************************
 * Slideshow-Funktionalität
 *******************************************************/
let currentSlide = 0;
const slides = document.querySelectorAll('.slide');

function showSlide(index) {
  slides.forEach(slide => slide.classList.remove('active'));
  slides[index].classList.add('active');
}

function nextSlide() {
  currentSlide = (currentSlide + 1) % slides.length;
  showSlide(currentSlide);
}

// Start slideshow
showSlide(currentSlide);
setInterval(nextSlide, 10000);

/*******************************************************
 * Automatische Größen-Anpassung (Optional) 
 * für 10 Events; kann entfernt werden.
 *******************************************************/
function adjustSizes() {
  const container = document.querySelector('.events-wrapper');
  const containerHeight = container.clientHeight;
  const desiredEventHeight = containerHeight / 10;

  const baseFontSize = Math.min(16, desiredEventHeight * 0.4);

  // Schriftgrößen bei Zeit, Name, Lecturer, Raum
  document.querySelectorAll('.event-time, .event-name, .event-lecturer, .event-room')
    .forEach(el => {
      el.style.fontSize = `${baseFontSize}px`;
    });

  // Schriftgröße beim Tag
  document.querySelectorAll('.event-day')
    .forEach(el => {
      el.style.fontSize = `${baseFontSize * 1.75}px`;
    });
}

// Initial anpassen + bei Fensteränderung
adjustSizes();
window.addEventListener('resize', adjustSizes);

/*******************************************************
 * Beispiel: CSV aus externer Datei laden (auskommentiert)
 *
 * fetch('events.csv')
 *   .then(response => response.text())
 *   .then(csvText => {
 *     const parsed = Papa.parse(csvText, { header: true }).data;
 *     // ... weiterverarbeiten wie oben ...
 *   });
 *******************************************************/

