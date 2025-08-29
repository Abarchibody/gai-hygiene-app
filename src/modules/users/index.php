<?php
require_once '../../config/database.php';
require_once 'User.php';

$database = new Database();
$db = $database->getConnection();
$user = new User($db);

$type = $_GET['type'] ?? null;
$search = $_GET['search'] ?? null;

$users = $user->getAll($type, $search);
$stats = $user->getStats();

$title = 'Gestion des Utilisateurs - GAI';
$pageTitle = 'Gestion des Utilisateurs';
$breadcrumb = '<a href="/" class="hover:text-gai-blue">Accueil</a> / <span class="text-gray-800">Utilisateurs</span>';
include '../../shared/layouts/header.php';
?>

<!-- Message de suppression -->
<?php if (isset($_GET['deleted'])): ?>
    <div class="bg-green-50 border-l-4 border-green-400 p-4 mb-6">
        <div class="flex items-center">
            <i data-lucide="check-circle" class="w-5 h-5 text-green-400 mr-3"></i>
            <p class="text-green-800 font-medium">Utilisateur supprimé avec succès!</p>
        </div>
    </div>
<?php endif; ?>

<?php if (isset($_GET['error']) && $_GET['error'] === 'delete_failed'): ?>
    <div class="bg-red-50 border-l-4 border-red-400 p-4 mb-6">
        <div class="flex items-center">
            <i data-lucide="alert-circle" class="w-5 h-5 text-red-400 mr-3"></i>
            <p class="text-red-800 font-medium">Échec de la suppression de l'utilisateur</p>
        </div>
    </div>
<?php endif; ?>

<div class="flex justify-between items-center mb-8">
    <div>
        <p class="text-gray-600">Gérez les élèves, parents et enseignants du complexe scolaire</p>
    </div>
    <a href="create.php" class="bg-gai-blue text-white px-4 py-2 rounded-md hover:bg-blue-600 transition-colors flex items-center">
        <i data-lucide="user-plus" class="w-4 h-4 mr-2"></i>
        Nouvel Utilisateur
    </a>
</div>

<!-- Statistiques -->
<div class="grid md:grid-cols-3 gap-4 mb-8">
    <?php foreach($stats as $stat): ?>
    <div class="bg-white rounded-lg shadow-md p-6">
        <div class="flex items-center">
            <div class="text-gai-blue mr-3">
                <?php if($stat['type_utilisateur'] == 'Élève'): ?><i data-lucide="graduation-cap" class="w-8 h-8"></i>
                <?php elseif($stat['type_utilisateur'] == 'Parent'): ?><i data-lucide="heart" class="w-8 h-8"></i>
                <?php else: ?><i data-lucide="user-check" class="w-8 h-8"></i><?php endif; ?>
            </div>
            <div>
                <h3 class="text-lg font-semibold text-gray-800"><?= $stat['type_utilisateur'] ?>s</h3>
                <p class="text-2xl font-bold text-gai-blue"><?= $stat['count'] ?></p>
            </div>
        </div>
    </div>
    <?php endforeach; ?>
</div>

<!-- Filtres et Recherche -->
<div class="bg-white rounded-lg shadow-md p-6 mb-6">
    <form method="GET" class="flex flex-wrap gap-4">
        <div class="flex-1 min-w-64">
            <input type="text" name="search" value="<?= htmlspecialchars($search ?? '') ?>" 
                   placeholder="Rechercher par nom, prénom ou email..."
                   class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gai-blue">
        </div>
        <div>
            <select name="type" class="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gai-blue">
                <option value="">Tous les types</option>
                <option value="Élève" <?= $type == 'Élève' ? 'selected' : '' ?>>Élèves</option>
                <option value="Parent" <?= $type == 'Parent' ? 'selected' : '' ?>>Parents</option>
                <option value="Enseignant" <?= $type == 'Enseignant' ? 'selected' : '' ?>>Enseignants</option>
            </select>
        </div>
        <button type="submit" class="bg-gai-green text-white px-4 py-2 rounded-md hover:bg-green-600 transition-colors flex items-center">
            <i data-lucide="search" class="w-4 h-4 mr-2"></i>
            Filtrer
        </button>
        <a href="index.php" class="bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600 transition-colors flex items-center">
            <i data-lucide="x" class="w-4 h-4 mr-2"></i>
            Réinitialiser
        </a>
    </form>
</div>

<!-- Liste des utilisateurs -->
<div class="bg-white rounded-lg shadow-md overflow-hidden">
    <div class="px-6 py-4 border-b border-gray-200">
        <h2 class="text-xl font-semibold text-gray-800">
            Liste des utilisateurs 
            <?php if($type): ?>(<?= $type ?>s)<?php endif; ?>
            <?php if($search): ?>- Recherche: "<?= htmlspecialchars($search) ?>"<?php endif; ?>
        </h2>
    </div>
    
    <?php if(empty($users)): ?>
        <div class="px-6 py-8 text-center">
            <p class="text-gray-500">Aucun utilisateur trouvé.</p>
        </div>
    <?php else: ?>
        <div class="overflow-x-auto">
            <table class="min-w-full divide-y divide-gray-200">
                <thead class="bg-gray-50">
                    <tr>
                        <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nom</th>
                        <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                        <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Téléphone</th>
                        <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                        <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                    </tr>
                </thead>
                <tbody class="bg-white divide-y divide-gray-200">
                    <?php foreach($users as $u): ?>
                    <tr class="hover:bg-gray-50">
                        <td class="px-6 py-4 whitespace-nowrap">
                            <div class="font-medium text-gray-900"><?= htmlspecialchars($u['nom'] . ' ' . $u['prenom']) ?></div>
                        </td>
                        <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            <?= htmlspecialchars($u['email'] ?? '') ?>
                        </td>
                        <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            <?= htmlspecialchars($u['telephone'] ?? '') ?>
                        </td>
                        <td class="px-6 py-4 whitespace-nowrap">
                            <span class="px-2 py-1 text-xs font-semibold rounded-full
                                <?php if($u['type_utilisateur'] == 'Élève'): ?>bg-blue-100 text-blue-800
                                <?php elseif($u['type_utilisateur'] == 'Parent'): ?>bg-green-100 text-green-800
                                <?php else: ?>bg-purple-100 text-purple-800<?php endif; ?>">
                                <?= $u['type_utilisateur'] ?>
                            </span>
                        </td>
                        <td class="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                            <a href="edit.php?id=<?= $u['id'] ?>" class="text-gai-blue hover:text-blue-600 inline-flex items-center">
                                <i data-lucide="edit" class="w-4 h-4 mr-1"></i>
                                Modifier
                            </a>
                            <button onclick="openDeleteModal(<?= $u['id'] ?>, '<?= htmlspecialchars($u['nom'] . ' ' . $u['prenom'], ENT_QUOTES) ?>', '<?= $u['type_utilisateur'] ?>')" 
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

<?php include '../../shared/layouts/footer.php'; ?>