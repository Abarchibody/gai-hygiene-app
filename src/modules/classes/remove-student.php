<?php
require_once '../../config/database.php';
require_once 'Class.php';

$database = new Database();
$db = $database->getConnection();
$class = new ClassModel($db);

$classeId = $_GET['classe_id'] ?? null;
$eleveId = $_GET['eleve_id'] ?? null;

if (!$classeId || !$eleveId) {
    header('Location: index.php');
    exit;
}

if ($_POST && isset($_POST['confirm_remove'])) {
    if ($class->retirerEleve($eleveId)) {
        header('Location: view.php?id=' . $classeId . '&student_removed=1');
        exit;
    } else {
        header('Location: view.php?id=' . $classeId . '&error=remove_failed');
        exit;
    }
}

header('Location: view.php?id=' . $classeId);
exit;
?>