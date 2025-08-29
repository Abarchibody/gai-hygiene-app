<?php
require_once '../../config/database.php';
require_once 'Class.php';

$database = new Database();
$db = $database->getConnection();
$class = new ClassModel($db);

$id = $_GET['id'] ?? null;

if (!$id) {
    header('Location: index.php');
    exit;
}

$classData = $class->getById($id);
if (!$classData) {
    header('Location: index.php');
    exit;
}

if ($_POST && isset($_POST['confirm_delete'])) {
    if ($class->delete($id)) {
        header('Location: index.php?deleted=1');
        exit;
    } else {
        header('Location: index.php?error=delete_failed');
        exit;
    }
}

header('Location: index.php');
exit;
?>