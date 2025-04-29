<?php
$servername = "localhost";
$username = "root";
$password = "";
$dbname = "todo_db";

$conn = new mysqli($servername, $username, $password, $dbname);

if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

// Create Task
if ($_SERVER["REQUEST_METHOD"] == "POST" && isset($_POST['action'])) {
    if ($_POST['action'] == 'create') {
        $task_name = $_POST['task_name'];
        $start_date = $_POST['start_date'];
        $end_date = $_POST['end_date'];
        $stmt = $conn->prepare("INSERT INTO tasks (task_name, start_date, end_date) VALUES (?, ?, ?)");
        $stmt->bind_param("sss", $task_name, $start_date, $end_date);
        $stmt->execute();
        echo "Task Created!";
    }

    // Mark Task as Completed
    if ($_POST['action'] == 'complete') {
        $task_id = $_POST['task_id'];
        $stmt = $conn->prepare("UPDATE tasks SET is_completed = 1 WHERE id = ?");
        $stmt->bind_param("i", $task_id);
        $stmt->execute();
        echo "Task Completed!";
    }

    // Edit Task
    if ($_POST['action'] == 'edit') {
        $task_id = $_POST['task_id'];
        $task_name = $_POST['task_name'];
        $start_date = $_POST['start_date'];
        $end_date = $_POST['end_date'];
        $stmt = $conn->prepare("UPDATE tasks SET task_name = ?, start_date = ?, end_date = ? WHERE id = ?");
        $stmt->bind_param("sssi", $task_name, $start_date, $end_date, $task_id);
        $stmt->execute();
        echo "Task Updated!";
    }

    // Delete Task
    if ($_POST['action'] == 'delete') {
        $task_id = $_POST['task_id'];
        $stmt = $conn->prepare("DELETE FROM tasks WHERE id = ?");
        $stmt->bind_param("i", $task_id);
        $stmt->execute();
        echo "Task Deleted!";
    }
}

// Load Pending Tasks and Completed Tasks
if ($_SERVER["REQUEST_METHOD"] == "GET" && isset($_GET['action']) && $_GET['action'] == 'load') {
    $pending_tasks = $conn->query("SELECT id, task_name, start_date, end_date, is_completed FROM tasks WHERE is_completed = 0");
    $completed_tasks = $conn->query("SELECT id, task_name, start_date, end_date, is_completed FROM tasks WHERE is_completed = 1");

    $tasks = [
        'pending' => [],
        'completed' => []
    ];

    while ($row = $pending_tasks->fetch_assoc()) {
        $tasks['pending'][] = $row;
    }

    while ($row = $completed_tasks->fetch_assoc()) {
        $tasks['completed'][] = $row;
    }

    echo json_encode($tasks);
}

$conn->close();
?>
