<?php
require_once 'config/database.php';

$database = new Database();
$db = $database->getConnection();

$table = $_GET['table'] ?? 'utilisateurs';
$tables = ['utilisateurs', 'classes', 'eleves', 'fiches_rappel', 'programmations', 'notifications', 'journal_evenements'];

$title = 'Administration Base de Données - GAI';
$pageTitle = 'Administration Base de Données';
$breadcrumb = '<a href="/" class="hover:text-gai-blue">Accueil</a> / <span class="text-gray-800">Base de données</span>';
include 'shared/layouts/header.php';
?>

<div class="mb-8">
    <p class="text-gray-600">Consultation et gestion directe des tables de la base de données</p>
</div>
<!-- Statistiques rapides -->
<div class="grid md:grid-cols-4 gap-4 mb-6">
    <?php 
    $totalTables = count($tables);
    $totalRecords = 0;
    foreach($tables as $t) {
        $stmt = $db->prepare("SELECT COUNT(*) as count FROM $t");
        $stmt->execute();
        $count = $stmt->fetch(PDO::FETCH_ASSOC)['count'];
        $totalRecords += $count;
    }
    ?>
    <div class="bg-white rounded-lg shadow-md p-4">
        <div class="text-2xl font-bold text-gai-blue"><?= $totalTables ?></div>
        <div class="text-sm text-gray-600">Tables</div>
    </div>
    <div class="bg-white rounded-lg shadow-md p-4">
        <div class="text-2xl font-bold text-gai-green"><?= $totalRecords ?></div>
        <div class="text-sm text-gray-600">Enregistrements</div>
    </div>
    <div class="bg-white rounded-lg shadow-md p-4">
        <div class="text-2xl font-bold text-gai-orange"><?= $table ?></div>
        <div class="text-sm text-gray-600">Table active</div>
    </div>
    <div class="bg-white rounded-lg shadow-md p-4">
        <?php
        $stmt = $db->prepare("SELECT COUNT(*) as count FROM $table");
        $stmt->execute();
        $currentCount = $stmt->fetch(PDO::FETCH_ASSOC)['count'];
        ?>
        <div class="text-2xl font-bold text-gray-700"><?= $currentCount ?></div>
        <div class="text-sm text-gray-600">Lignes</div>
    </div>
</div>

<div class="bg-white rounded-lg shadow-md p-6 mb-6">
    <h2 class="text-lg font-semibold mb-4">Tables disponibles</h2>
    <div class="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-2">
        <?php foreach($tables as $t): ?>
            <a href="?table=<?= $t ?>" 
               class="px-3 py-2 rounded-md text-sm font-medium transition-colors text-center
                      <?= $table === $t ? 'bg-gai-blue text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200' ?>">
                <?= ucfirst(str_replace('_', ' ', $t)) ?>
            </a>
        <?php endforeach; ?>
    </div>
</div>

<div class="bg-white rounded-lg shadow-md overflow-hidden">
    <div class="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
        <h2 class="text-xl font-semibold text-gray-800">Table: <?= $table ?></h2>
        <div class="text-sm text-gray-500">
            <?= $currentCount ?> enregistrement<?= $currentCount > 1 ? 's' : '' ?>
        </div>
    </div>

    <div class="overflow-x-auto">
        <?php
        $query = "SELECT * FROM " . $table . " LIMIT 100";
        $stmt = $db->prepare($query);
        $stmt->execute();
        $results = $stmt->fetchAll(PDO::FETCH_ASSOC);
        
        if ($results):
        ?>
        <table class="min-w-full divide-y divide-gray-200">
            <thead class="bg-gray-50">
                <tr>
                    <?php foreach(array_keys($results[0]) as $column): ?>
                        <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            <?= $column ?>
                        </th>
                    <?php endforeach; ?>
                </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
                <?php foreach($results as $row): ?>
                <tr class="hover:bg-gray-50">
                    <?php foreach($row as $value): ?>
                        <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            <?= htmlspecialchars($value ?? '') ?>
                        </td>
                    <?php endforeach; ?>
                </tr>
                <?php endforeach; ?>
            </tbody>
        </table>
        <?php if($currentCount > 100): ?>
            <div class="px-6 py-4 bg-yellow-50 border-t border-yellow-200">
                <p class="text-yellow-800 text-sm">
                    ⚠️ Affichage limité aux 100 premiers enregistrements (<?= $currentCount ?> au total)
                </p>
            </div>
        <?php endif; ?>
        <?php else: ?>
            <div class="px-6 py-8 text-center">
                <p class="text-gray-500">Aucune donnée dans cette table.</p>
            </div>
        <?php endif; ?>
    </div>
</div>

<?php include 'shared/layouts/footer.php'; ?>