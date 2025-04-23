document.addEventListener('DOMContentLoaded', () => {
  Papa.parse('spring2025.csv', {
    download: true,
    header: true,
    complete: ({ data }) => {
      const container = document.getElementById('events-container');
      data.sort((a, b) => new Date(a.Datum) - new Date(b.Datum));
      let currentDate = null;
      const today = new Date().toDateString();

      data.forEach(e => {
        if (e.Datum !== currentDate) {
          currentDate = e.Datum;
          const header = document.createElement('div');
          header.className = 'day-header';
          header.textContent = new Date(currentDate)
            .toLocaleDateString('de-CH', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
          if (new Date(currentDate).toDateString() === today) {
            const marker = document.createElement('span');
            marker.className = 'today-marker';
            marker.textContent = 'Heute';
            header.appendChild(marker);
          }
          container.appendChild(header);
        }
        const item = document.createElement('div');
        item.className = 'event-item';
        const time = document.createElement('span');
        time.className = 'event-time';
        time.textContent = e.Zeit || e.Uhrzeit || '';
        const name = document.createElement('span');
        name.className = 'event-name';
        name.textContent = e.Veranstaltung || e.Name || '';
        const lecturer = document.createElement('span');
        lecturer.className = 'event-lecturer';
        lecturer.textContent = e.Dozent || '';
        const room = document.createElement('span');
        room.className = 'event-room';
        room.textContent = e.Raum || '';
        item.append(time, name, lecturer, room);
        container.appendChild(item);
      });
    }
  });
});
