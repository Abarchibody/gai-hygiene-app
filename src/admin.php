<?php
require_once 'config/database.php';

$database = new Database();
$db = $database->getConnection();

$table = $_GET['table'] ?? 'utilisateurs';
$tables = ['utilisateurs', 'classes', 'eleves', 'fiches_rappel', 'programmations', 'notifications', 'journal_evenements'];
?>
<!DOCTYPE html>
<html>
<head>
    <title>Admin DB - GAI</title>
    <style>
        body { font-family: Arial, sans-serif; margin: 20px; }
        table { border-collapse: collapse; width: 100%; }
        th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
        th { background-color: #f2f2f2; }
        .nav { margin-bottom: 20px; }
        .nav a { margin-right: 10px; padding: 5px 10px; background: #007cba; color: white; text-decoration: none; }
    </style>
</head>
<body>
    <h1>Administration Base de Données GAI</h1>
    
    <div class="nav">
        <?php foreach($tables as $t): ?>
            <a href="?table=<?= $t ?>"><?= ucfirst($t) ?></a>
        <?php endforeach; ?>
    </div>

    <h2>Table: <?= $table ?></h2>
    
    <?php
    $query = "SELECT * FROM " . $table;
    $stmt = $db->prepare($query);
    $stmt->execute();
    $results = $stmt->fetchAll(PDO::FETCH_ASSOC);
    
    if ($results):
    ?>
    <table>
        <tr>
            <?php foreach(array_keys($results[0]) as $column): ?>
                <th><?= $column ?></th>
            <?php endforeach; ?>
        </tr>
        <?php foreach($results as $row): ?>
        <tr>
            <?php foreach($row as $value): ?>
                <td><?= htmlspecialchars($value) ?></td>
            <?php endforeach; ?>
        </tr>
        <?php endforeach; ?>
    </table>
    <?php else: ?>
        <p>Aucune donnée dans cette table.</p>
    <?php endif; ?>
</body>
</html>