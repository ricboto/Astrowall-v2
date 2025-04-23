document.addEventListener('DOMContentLoaded', () => {
  const calendarEl = document.getElementById('calendar');
  const calendar = new FullCalendar.Calendar(calendarEl, {
    initialView: 'dayGridMonth',
    events: []
  });
  calendar.render();

  Papa.parse('spring2025.csv', {
    download: true,
    header: true,
    complete: ({ data }) => {
      const events = data.map(e => ({
        title: e.Titel,
        start: e.Start,
        end:   e.End
      }));
      calendar.addEventSource(events);
    }
  });
});
