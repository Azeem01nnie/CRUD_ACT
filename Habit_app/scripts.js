document.getElementById('habit-form').addEventListener('submit', function (e) {
    e.preventDefault();

    const habitName = document.getElementById('habit-name').value;
    const frequency = document.getElementById('frequency').value;
    const startDate = document.getElementById('start-date').value;
    const habitId = document.getElementById('habit-id').value; // For editing

    const formData = new FormData();
    formData.append('action', habitId ? 'edit' : 'create'); // Determine if it's edit or create
    formData.append('habit_name', habitName);
    formData.append('frequency', frequency);
    formData.append('start_date', startDate);
    
    if (habitId) formData.append('habit_id', habitId); // For editing, append habit_id

    fetch('habit_handler.php', {
        method: 'POST',
        body: formData
    }).then(response => response.text())
      .then(response => {
          alert(response);
          loadHabits();
          clearForm(); // Clear the form after submission
      });
});

function loadHabits() {
    fetch('habit_handler.php?action=load')
        .then(response => response.json())
        .then(habits => {
            const habitList = document.getElementById('habit-list');
            habitList.innerHTML = ''; // Clear the habit list

            habits.forEach(habit => {
                const li = document.createElement('li');
                li.innerHTML = `
                    <span>${habit.habit_name} (${habit.frequency}) - Started on: ${habit.start_date}</span>
                    <p>Status: ${habit.completion_status}</p> <!-- Display the completion status -->
                    <div>
                        <button onclick="markComplete(${habit.id})">Mark as Done</button>
                        <button onclick="editHabit(${habit.id}, '${habit.habit_name}', '${habit.frequency}', '${habit.start_date}')">Edit</button>
                        <button onclick="deleteHabit(${habit.id})">Delete</button>
                    </div>
                `;
                habitList.appendChild(li);
            });
        })
        .catch(error => console.error('Error fetching habits:', error));
}

function markComplete(habitId) {
    const formData = new FormData();
    formData.append('action', 'complete');
    formData.append('habit_id', habitId);

    fetch('habit_handler.php', {
        method: 'POST',
        body: formData
    }).then(response => response.text())
      .then(response => {
          alert(response);
          loadHabits();
      });
}

function deleteHabit(habitId) {
    const formData = new FormData();
    formData.append('action', 'delete');
    formData.append('habit_id', habitId);

    fetch('habit_handler.php', {
        method: 'POST',
        body: formData
    }).then(response => response.text())
      .then(response => {
          alert(response);
          loadHabits();
      });
}

function editHabit(habitId, habitName, frequency, startDate) {
    document.getElementById('habit-name').value = habitName;
    document.getElementById('frequency').value = frequency;
    document.getElementById('start-date').value = startDate;
    document.getElementById('habit-id').value = habitId; // Set habit ID for editing
}

function clearForm() {
    document.getElementById('habit-name').value = '';
    document.getElementById('frequency').value = 'daily';
    document.getElementById('start-date').value = '';
    document.getElementById('habit-id').value = ''; // Clear habit ID
}

// Load habits when the page loads
loadHabits();
