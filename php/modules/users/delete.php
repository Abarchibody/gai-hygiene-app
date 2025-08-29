<?php
require_once '../../config/database.php';
require_once 'User.php';

$database = new Database();
$db = $database->getConnection();
$user = new User($db);

$id = $_GET['id'] ?? null;

if (!$id) {
    header('Location: index.php');
    exit;
}

$userData = $user->getById($id);
if (!$userData) {
    header('Location: index.php');
    exit;
}

if ($_POST && isset($_POST['confirm_delete'])) {
    if ($user->delete($id)) {
        header('Location: index.php?deleted=1');
        exit;
    } else {
        header('Location: index.php?error=delete_failed');
        exit;
    }
}

// Si on arrive ici sans POST, rediriger vers la liste
header('Location: index.php');
exit;
?>