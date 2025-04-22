// 1) Mapping Eventname → Dozent
const lecturerMap = {
  "Computational Methods for Radiative Transfer": "Lucio Mayer",
  // hier kannst du weitere Zuordnungen ergänzen...
};

// 2) Hilfsfunktion: '20250218T111500Z' → ['18.02.2025', '11:15']
function parseICalDate(dtStr) {
  const dt = ICAL.Time.fromString(dtStr);
  // in JS-Datum umwandeln
  const jsDate = dt.toJSDate();
  const pad = n => String(n).padStart(2, "0");
  const day   = pad(jsDate.getDate());
  const month = pad(jsDate.getMonth()+1);
  const year  = jsDate.getFullYear();
  const hours   = pad(jsDate.getHours());
  const minutes = pad(jsDate.getMinutes());
  return [`${day}.${month}.${year}`, `${hours}:${minutes}`];
}

// 3) .ics‑Datei laden und parsen
fetch('spring2025.ics')
  .then(r => r.text())
  .then(icsText => {
    const jcal = ICAL.parse(icsText);
    const comp = new ICAL.Component(jcal);
    const vevents = comp.getAllSubcomponents('vevent');

    // 4) Array von Events aufbauen
    const events = vevents.map(v => {
      const ev = new ICAL.Event(v);
      const [startDate, startTime] = parseICalDate(v.getFirstPropertyValue('dtstart'));
      const [endDate, endTime]     = parseICalDate(v.getFirstPropertyValue('dtend'));
      const summary  = ev.summary;
      const location = ev.location;
      const lecturer = lecturerMap[summary] || "unbekannt";
      return { startDate, startTime, endDate, endTime, summary, location, lecturer, timestamp: ev.startDate.toJSDate().getTime() };
    });

    // 5) sortieren nach Startzeit
    events.sort((a,b) => a.timestamp - b.timestamp);

    // 6) in den DOM schreiben
    const container = document.getElementById('events-container');
    let currentDayLabel = null;
    const today = new Date(); today.setHours(0,0,0,0);

    events.forEach(evt => {
      // neuer Tag?
      if (evt.startDate !== currentDayLabel) {
        currentDayLabel = evt.startDate;
        const dh = document.createElement('div');
        dh.className = 'event-day';
        dh.textContent = evt.startDate;
        // Marker für heute
        if (new Date(evt.startDate.split('.').reverse().join('-')).getTime() === today.getTime()) {
          dh.innerHTML += '<span class="today-marker">Heute</span>';
        }
        container.appendChild(dh);
      }

      // Event‑Eintrag
      const div = document.createElement('div');
      div.className = 'event-item';
      div.innerHTML = `
        <div class="event-datetime">
          <span class="event-start">${evt.startDate} / ${evt.startTime}</span>–
          <span class="event-end">${evt.endDate} / ${evt.endTime}</span>
        </div>
        <div class="event-details">
          <span class="event-name">${evt.summary}</span>
          <span class="event-room">${evt.location}</span>
        </div>
        <div class="event-lecturer">Dozent: ${evt.lecturer}</div>
      `;
      container.appendChild(div);
    });
  })
  .catch(err => console.error('Fehler beim Laden der ICS-Datei:', err));

