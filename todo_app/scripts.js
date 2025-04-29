document.getElementById('task-form').addEventListener('submit', function (e) {
    e.preventDefault();

    const taskName = document.getElementById('task-name').value;
    const startDate = document.getElementById('start-date').value;
    const endDate = document.getElementById('end-date').value;
    const taskId = document.getElementById('task-id').value; // For editing

    const formData = new FormData();
    formData.append('action', taskId ? 'edit' : 'create'); // Determine if it's edit or create
    formData.append('task_name', taskName);
    formData.append('start_date', startDate);
    formData.append('end_date', endDate);
    
    if (taskId) formData.append('task_id', taskId); // For editing, append task_id

    fetch('task_handler.php', {
        method: 'POST',
        body: formData
    }).then(response => response.text())
      .then(response => {
          alert(response);
          loadTasks();
          clearForm(); // Clear the form after submission
      });
});

function loadTasks() {
    fetch('task_handler.php?action=load')
        .then(response => response.json())
        .then(tasks => {
            const pendingTaskList = document.getElementById('pending-task-list');
            const completedTaskList = document.getElementById('completed-task-list');
            pendingTaskList.innerHTML = ''; // Clear the pending task list
            completedTaskList.innerHTML = ''; // Clear the completed task list

            // Display Pending Tasks
            tasks.pending.forEach(task => {
                const li = document.createElement('li');
                li.classList.toggle('completed', task.is_completed);
                li.innerHTML = `
                    <span>${task.task_name} (${task.start_date} - ${task.end_date})</span>
                    <div>
                        <button onclick="markComplete(${task.id})">Mark as Done</button>
                        <button onclick="editTask(${task.id}, '${task.task_name}', '${task.start_date}', '${task.end_date}')">Edit</button>
                        <button class="delete-btn" onclick="deleteTask(${task.id})">Delete</button>
                    </div>
                `;
                pendingTaskList.appendChild(li);
            });

            // Display Completed Tasks
            tasks.completed.forEach(task => {
                const li = document.createElement('li');
                li.classList.toggle('completed', task.is_completed);
                li.innerHTML = `
                    <span>${task.task_name} (${task.start_date} - ${task.end_date})</span>
                    <div>
                        <button class="delete-btn" onclick="deleteTask(${task.id})">Delete</button>
                    </div>
                `;
                completedTaskList.appendChild(li);
            });
        })
        .catch(error => console.error('Error fetching tasks:', error));
}

function markComplete(taskId) {
    const formData = new FormData();
    formData.append('action', 'complete');
    formData.append('task_id', taskId);

    fetch('task_handler.php', {
        method: 'POST',
        body: formData
    }).then(response => response.text())
      .then(response => {
          alert(response);
          loadTasks();
      });
}

function deleteTask(taskId) {
    const formData = new FormData();
    formData.append('action', 'delete');
    formData.append('task_id', taskId);

    fetch('task_handler.php', {
        method: 'POST',
        body: formData
    }).then(response => response.text())
      .then(response => {
          alert(response);
          loadTasks();
      });
}

function editTask(taskId, taskName, startDate, endDate) {
    // Pre-fill the form with the task details
    document.getElementById('task-name').value = taskName;
    document.getElementById('start-date').value = startDate;
    document.getElementById('end-date').value = endDate;
    document.getElementById('task-id').value = taskId; // Set task ID for editing
}

function clearForm() {
    document.getElementById('task-name').value = '';
    document.getElementById('start-date').value = '';
    document.getElementById('end-date').value = '';
    document.getElementById('task-id').value = ''; // Clear task ID
}

// Load tasks when the page loads
loadTasks();