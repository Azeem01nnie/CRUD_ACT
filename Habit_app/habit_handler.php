<?php
$servername = "localhost";
$username = "root";
$password = "";
$dbname = "todo_db";

$conn = new mysqli($servername, $username, $password, $dbname);

if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

// Create Habit
if ($_SERVER["REQUEST_METHOD"] == "POST" && isset($_POST['action'])) {
    if ($_POST['action'] == 'create') {
        $habit_name = $_POST['habit_name'];
        $frequency = $_POST['frequency'];
        $start_date = $_POST['start_date'];

        $stmt = $conn->prepare("INSERT INTO habits (habit_name, frequency, start_date) VALUES (?, ?, ?)");
        $stmt->bind_param("sss", $habit_name, $frequency, $start_date);
        $stmt->execute();
        echo "Habit Created!";
    }

    // Mark Habit as Done
    if ($_POST['action'] == 'complete') {
        $habit_id = $_POST['habit_id'];
        $stmt = $conn->prepare("UPDATE habits SET completion_status = 1 WHERE id = ?");
        $stmt->bind_param("i", $habit_id);
        $stmt->execute();
        echo "Habit Marked as Done!";
    }

    // Edit Habit
    if ($_POST['action'] == 'edit') {
        $habit_id = $_POST['habit_id'];
        $habit_name = $_POST['habit_name'];
        $frequency = $_POST['frequency'];
        $start_date = $_POST['start_date'];

        $stmt = $conn->prepare("UPDATE habits SET habit_name = ?, frequency = ?, start_date = ? WHERE id = ?");
        $stmt->bind_param("sssi", $habit_name, $frequency, $start_date, $habit_id);
        $stmt->execute();
        echo "Habit Updated!";
    }

    // Delete Habit
    if ($_POST['action'] == 'delete') {
        $habit_id = $_POST['habit_id'];
        $stmt = $conn->prepare("DELETE FROM habits WHERE id = ?");
        $stmt->bind_param("i", $habit_id);
        $stmt->execute();
        echo "Habit Deleted!";
    }
}

// Load Habits
if ($_SERVER["REQUEST_METHOD"] == "GET" && isset($_GET['action']) && $_GET['action'] == 'load') {
    $result = $conn->query("SELECT * FROM habits ORDER BY created_at DESC");

    $habits = [];
    while ($row = $result->fetch_assoc()) {
        // Add completion status as a readable string (Completed / Pending)
        $row['completion_status'] = $row['completion_status'] ? 'Completed' : 'Pending';
        $habits[] = $row;
    }

    echo json_encode($habits);
}

$conn->close();
?>
