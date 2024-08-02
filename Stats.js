document.addEventListener('DOMContentLoaded', () => {
    const apiUrl = 'https://aulamindhub.github.io/amazing-api/events.json';

    fetch(apiUrl)
        .then(response => response.json())
        .then(data => {
            const events = data.events;
            const currentDate = new Date(data.currentDate);

            // Calcular estadísticas generales
            const eventsWithAssistance = events.filter(event => event.assistance);
            const eventsWithEstimates = events.filter(event => event.estimate);

            const highestAssistanceEvent = eventsWithAssistance.reduce((prev, curr) => (curr.assistance / curr.capacity > prev.assistance / prev.capacity) ? curr : prev);
            const lowestAssistanceEvent = eventsWithAssistance.reduce((prev, curr) => (curr.assistance / curr.capacity < prev.assistance / prev.capacity) ? curr : prev);
            const largestCapacityEvent = events.reduce((prev, curr) => (curr.capacity > prev.capacity) ? curr : prev);

            document.getElementById('highest-assistance').textContent = highestAssistanceEvent.name;
            document.getElementById('lowest-assistance').textContent = lowestAssistanceEvent.name;
            document.getElementById('largest-capacity').textContent = largestCapacityEvent.name;

            // Función para calcular estadísticas por categoría
            function calculateCategoryStats(events) {
                const stats = {};
                events.forEach(event => {
                    if (!stats[event.category]) {
                        stats[event.category] = { revenue: 0, attendance: 0, capacity: 0, count: 0 };
                    }
                    const category = stats[event.category];
                    const assistance = event.assistance || event.estimate;
                    category.revenue += event.price * assistance;
                    category.attendance += assistance;
                    category.capacity += event.capacity;
                    category.count++;
                });
                return stats;
            }

            // Calcular estadísticas para eventos futuros
            const upcomingEvents = events.filter(event => new Date(event.date) > currentDate);
            const upcomingStats = calculateCategoryStats(upcomingEvents);

            const upcomingCategories = Object.keys(upcomingStats);
            upcomingCategories.forEach((category, index) => {

                    const stats = upcomingStats[category];
                    const percentage = ((stats.attendance / stats.capacity) * 100).toFixed(2);
                    const row = document.createElement('tr');
                    row.innerHTML = `
                        <td>${category}</td>
                        <td>$${stats.revenue.toFixed(2)}</td>
                        <td>${percentage}%</td>
                    `;
                    document.getElementById('upcoming-events').appendChild(row);
            
            });

            // Calcular estadísticas para eventos pasados
            const pastEvents = events.filter(event => new Date(event.date) <= currentDate);
            const pastStats = calculateCategoryStats(pastEvents);

            const pastCategories = Object.keys(pastStats);
            pastCategories.forEach((category) => {
                const stats = pastStats[category];
                const percentage = ((stats.attendance / stats.capacity) * 100).toFixed(2);
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${category}</td>
                    <td>$${stats.revenue.toFixed(2)}</td>
                    <td>${percentage}%</td>
                `;
                document.getElementById('past-events').appendChild(row);
            });

        })
        .catch(error => console.error('Error fetching the data:', error));
});
