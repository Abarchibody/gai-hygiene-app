<?php
require_once 'config/database.php';

$database = new Database();
$db = $database->getConnection();

if ($db) {
    echo "<h1>Application GAI - Rappels d'Hygiène</h1>";
    echo "<p>Connexion à la base de données réussie!</p>";
    
    // Test de la base de données
    $query = "SELECT COUNT(*) as count FROM utilisateurs";
    $stmt = $db->prepare($query);
    $stmt->execute();
    $result = $stmt->fetch(PDO::FETCH_ASSOC);
    
    echo "<p>Nombre d'utilisateurs: " . $result['count'] . "</p>";
} else {
    echo "<h1>Erreur de connexion à la base de données</h1>";
}
?>