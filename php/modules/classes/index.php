<?php
require_once '../../config/database.php';
require_once 'Class.php';

$database = new Database();
$db = $database->getConnection();
$class = new ClassModel($db);

$search = $_GET['search'] ?? null;
$classes = $class->getAll($search);
$stats = $class->getStats();

$title = 'Gestion des Classes - GAI';
$pageTitle = 'Gestion des Classes';
$breadcrumb = '<a href="/" class="hover:text-gai-blue">Accueil</a> / <span class="text-gray-800">Classes</span>';
include '../../shared/layouts/header.php';
?>

<!-- Message de suppression -->
<?php if (isset($_GET['deleted'])): ?>
    <div class="bg-green-50 border-l-4 border-green-400 p-4 mb-6">
        <div class="flex items-center">
            <i data-lucide="check-circle" class="w-5 h-5 text-green-400 mr-3"></i>
            <p class="text-green-800 font-medium">Classe supprimée avec succès!</p>
        </div>
    </div>
<?php endif; ?>

<div class="flex justify-between items-center mb-8">
    <div>
        <p class="text-gray-600">Gérez les classes du complexe scolaire et leurs enseignants</p>
    </div>
    <a href="create.php" class="bg-gai-blue text-white px-4 py-2 rounded-md hover:bg-blue-600 transition-colors flex items-center">
        <i data-lucide="plus" class="w-4 h-4 mr-2"></i>
        Nouvelle Classe
    </a>
</div>

<!-- Statistiques -->
<div class="grid md:grid-cols-3 gap-4 mb-8">
    <div class="bg-white rounded-lg shadow-md p-6">
        <div class="flex items-center">
            <div class="text-gai-blue mr-3">
                <i data-lucide="school" class="w-8 h-8"></i>
            </div>
            <div>
                <h3 class="text-lg font-semibold text-gray-800">Classes</h3>
                <p class="text-2xl font-bold text-gai-blue"><?= $stats['total_classes'] ?></p>
            </div>
        </div>
    </div>
    
    <div class="bg-white rounded-lg shadow-md p-6">
        <div class="flex items-center">
            <div class="text-gai-green mr-3">
                <i data-lucide="user-check" class="w-8 h-8"></i>
            </div>
            <div>
                <h3 class="text-lg font-semibold text-gray-800">Avec Enseignant</h3>
                <p class="text-2xl font-bold text-gai-green"><?= $stats['classes_avec_enseignant'] ?></p>
            </div>
        </div>
    </div>
    
    <div class="bg-white rounded-lg shadow-md p-6">
        <div class="flex items-center">
            <div class="text-gai-orange mr-3">
                <i data-lucide="users" class="w-8 h-8"></i>
            </div>
            <div>
                <h3 class="text-lg font-semibold text-gray-800">Total Élèves</h3>
                <p class="text-2xl font-bold text-gai-orange"><?= $stats['total_eleves'] ?></p>
            </div>
        </div>
    </div>
</div>

<!-- Recherche -->
<div class="bg-white rounded-lg shadow-md p-6 mb-6">
    <form method="GET" class="flex gap-4">
        <div class="flex-1">
            <input type="text" name="search" value="<?= htmlspecialchars($search ?? '') ?>" 
                   placeholder="Rechercher par nom de classe ou niveau..."
                   class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gai-blue">
        </div>
        <button type="submit" class="bg-gai-green text-white px-4 py-2 rounded-md hover:bg-green-600 transition-colors flex items-center">
            <i data-lucide="search" class="w-4 h-4 mr-2"></i>
            Rechercher
        </button>
        <a href="index.php" class="bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600 transition-colors flex items-center">
            <i data-lucide="x" class="w-4 h-4 mr-2"></i>
            Réinitialiser
        </a>
    </form>
</div>

<!-- Liste des classes -->
<div class="bg-white rounded-lg shadow-md overflow-hidden">
    <div class="px-6 py-4 border-b border-gray-200">
        <h2 class="text-xl font-semibold text-gray-800">
            Liste des classes
            <?php if($search): ?>- Recherche: "<?= htmlspecialchars($search) ?>"<?php endif; ?>
        </h2>
    </div>
    
    <?php if(empty($classes)): ?>
        <div class="px-6 py-8 text-center">
            <i data-lucide="school" class="w-12 h-12 text-gray-400 mx-auto mb-4"></i>
            <p class="text-gray-500">Aucune classe trouvée.</p>
            <a href="create.php" class="text-gai-blue hover:underline">Créer la première classe</a>
        </div>
    <?php else: ?>
        <div class="overflow-x-auto">
            <table class="min-w-full divide-y divide-gray-200">
                <thead class="bg-gray-50">
                    <tr>
                        <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Classe</th>
                        <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Niveau</th>
                        <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Enseignant</th>
                        <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Élèves</th>
                        <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                    </tr>
                </thead>
                <tbody class="bg-white divide-y divide-gray-200">
                    <?php foreach($classes as $c): ?>
                    <tr class="hover:bg-gray-50">
                        <td class="px-6 py-4 whitespace-nowrap">
                            <div class="font-medium text-gray-900"><?= htmlspecialchars($c['nom_classe']) ?></div>
                            <?php if(isset($c['description']) && $c['description']): ?>
                                <div class="text-sm text-gray-500"><?= htmlspecialchars($c['description']) ?></div>
                            <?php endif; ?>
                        </td>
                        <td class="px-6 py-4 whitespace-nowrap">
                            <span class="px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
                                <?= htmlspecialchars($c['niveau']) ?>
                            </span>
                        </td>
                        <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            <?php if($c['enseignant_nom']): ?>
                                <div class="flex items-center">
                                    <i data-lucide="user-check" class="w-4 h-4 text-green-500 mr-2"></i>
                                    <?= htmlspecialchars($c['enseignant_nom'] . ' ' . $c['enseignant_prenom']) ?>
                                </div>
                            <?php else: ?>
                                <span class="text-gray-400 italic">Non assigné</span>
                            <?php endif; ?>
                        </td>
                        <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            <div class="flex items-center">
                                <i data-lucide="users" class="w-4 h-4 text-gai-blue mr-2"></i>
                                <?= $c['nb_eleves'] ?> élève<?= $c['nb_eleves'] > 1 ? 's' : '' ?>
                            </div>
                        </td>
                        <td class="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                            <a href="view.php?id=<?= $c['id'] ?>" class="text-gai-blue hover:text-blue-600 inline-flex items-center">
                                <i data-lucide="eye" class="w-4 h-4 mr-1"></i>
                                Voir
                            </a>
                            <a href="edit.php?id=<?= $c['id'] ?>" class="text-gai-green hover:text-green-600 inline-flex items-center">
                                <i data-lucide="edit" class="w-4 h-4 mr-1"></i>
                                Modifier
                            </a>
                            <button onclick="openDeleteModal(<?= $c['id'] ?>, '<?= htmlspecialchars($c['nom_classe'], ENT_QUOTES) ?>', 'Classe <?= htmlspecialchars($c['niveau'], ENT_QUOTES) ?>')" 
                                    class="text-red-600 hover:text-red-800 inline-flex items-center">
                                <i data-lucide="trash-2" class="w-4 h-4 mr-1"></i>
                                Supprimer
                            </button>
                        </td>
                    </tr>
                    <?php endforeach; ?>
                </tbody>
            </table>
        </div>
    <?php endif; ?>
</div>

<!-- Modal de confirmation de suppression -->
<?php include '../../shared/components/delete-modal.php'; ?>

<script>
// Adapter le modal pour les classes
function confirmDelete() {
    if (deleteUserId) {
        const form = document.createElement('form');
        form.method = 'POST';
        form.action = 'delete.php?id=' + deleteUserId;
        
        const input = document.createElement('input');
        input.type = 'hidden';
        input.name = 'confirm_delete';
        input.value = '1';
        
        form.appendChild(input);
        document.body.appendChild(form);
        form.submit();
    }
}
</script>

<?php include '../../shared/layouts/footer.php'; ?>