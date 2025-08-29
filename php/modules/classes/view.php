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

$classe = $class->getById($id);
if (!$classe) {
    header('Location: index.php');
    exit;
}

$eleves = $class->getEleves($id);

$title = 'Classe ' . $classe['nom_classe'] . ' - GAI';
$pageTitle = 'Détails de la Classe';
$breadcrumb = '<a href="/" class="hover:text-gai-blue">Accueil</a> / <a href="index.php" class="hover:text-gai-blue">Classes</a> / <span class="text-gray-800">' . htmlspecialchars($classe['nom_classe']) . '</span>';
include '../../shared/layouts/header.php';
?>

<?php if (isset($_GET['updated'])): ?>
    <div class="bg-green-50 border-l-4 border-green-400 p-4 mb-6">
        <div class="flex items-center">
            <i data-lucide="check-circle" class="w-5 h-5 text-green-400 mr-3"></i>
            <p class="text-green-800 font-medium">Classe modifiée avec succès!</p>
        </div>
    </div>
<?php endif; ?>

<?php if (isset($_GET['student_added'])): ?>
    <div class="bg-green-50 border-l-4 border-green-400 p-4 mb-6">
        <div class="flex items-center">
            <i data-lucide="user-plus" class="w-5 h-5 text-green-400 mr-3"></i>
            <p class="text-green-800 font-medium">Élève ajouté à la classe avec succès!</p>
        </div>
    </div>
<?php endif; ?>

<?php if (isset($_GET['student_removed'])): ?>
    <div class="bg-green-50 border-l-4 border-green-400 p-4 mb-6">
        <div class="flex items-center">
            <i data-lucide="user-minus" class="w-5 h-5 text-green-400 mr-3"></i>
            <p class="text-green-800 font-medium">Élève retiré de la classe avec succès!</p>
        </div>
    </div>
<?php endif; ?>

<div class="flex items-center justify-between mb-8">
    <div class="flex items-center">
        <a href="index.php" class="text-gai-blue hover:text-blue-600 mr-4 flex items-center">
            <i data-lucide="arrow-left" class="w-4 h-4 mr-2"></i>
            Retour à la liste
        </a>
    </div>
    <div class="flex space-x-3">
        <a href="edit.php?id=<?= $classe['id'] ?>" class="bg-gai-green text-white px-4 py-2 rounded-md hover:bg-green-600 transition-colors flex items-center">
            <i data-lucide="edit" class="w-4 h-4 mr-2"></i>
            Modifier
        </a>
    </div>
</div>

<!-- Informations de la classe -->
<div class="bg-white rounded-lg shadow-sm border border-gray-200 mb-6">
    <div class="px-6 py-4 border-b border-gray-200">
        <h2 class="text-xl font-semibold text-gray-800 flex items-center">
            <i data-lucide="school" class="w-6 h-6 mr-2 text-gai-blue"></i>
            <?= htmlspecialchars($classe['nom_classe']) ?>
        </h2>
    </div>
    
    <div class="p-6">
        <div class="grid md:grid-cols-3 gap-6">
            <div>
                <label class="block text-sm font-medium text-gray-500 mb-1">Niveau</label>
                <div class="flex items-center">
                    <i data-lucide="layers" class="w-4 h-4 text-gai-blue mr-2"></i>
                    <span class="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                        <?= htmlspecialchars($classe['niveau']) ?>
                    </span>
                </div>
            </div>
            
            <div>
                <label class="block text-sm font-medium text-gray-500 mb-1">Enseignant responsable</label>
                <div class="flex items-center">
                    <?php if($classe['enseignant_nom']): ?>
                        <i data-lucide="user-check" class="w-4 h-4 text-green-500 mr-2"></i>
                        <span class="text-gray-900"><?= htmlspecialchars($classe['enseignant_nom'] . ' ' . $classe['enseignant_prenom']) ?></span>
                    <?php else: ?>
                        <i data-lucide="user-x" class="w-4 h-4 text-gray-400 mr-2"></i>
                        <span class="text-gray-400 italic">Non assigné</span>
                    <?php endif; ?>
                </div>
            </div>
            
            <div>
                <label class="block text-sm font-medium text-gray-500 mb-1">Nombre d'élèves</label>
                <div class="flex items-center">
                    <i data-lucide="users" class="w-4 h-4 text-gai-orange mr-2"></i>
                    <span class="text-2xl font-bold text-gai-orange"><?= count($eleves) ?></span>
                    <span class="text-gray-600 ml-1">élève<?= count($eleves) > 1 ? 's' : '' ?></span>
                </div>
            </div>
        </div>
    </div>
</div>

<!-- Liste des élèves -->
<div class="bg-white rounded-lg shadow-sm border border-gray-200">
    <div class="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
        <h3 class="text-lg font-semibold text-gray-800 flex items-center">
            <i data-lucide="users" class="w-5 h-5 mr-2 text-gai-blue"></i>
            Élèves de la classe
        </h3>
        <a href="assign-student.php?classe_id=<?= $classe['id'] ?>" class="bg-gai-blue text-white px-4 py-2 rounded-md hover:bg-blue-600 transition-colors flex items-center text-sm">
            <i data-lucide="user-plus" class="w-4 h-4 mr-2"></i>
            Ajouter un élève
        </a>
    </div>
    
    <?php if(empty($eleves)): ?>
        <div class="px-6 py-8 text-center">
            <i data-lucide="users" class="w-12 h-12 text-gray-400 mx-auto mb-4"></i>
            <p class="text-gray-500 mb-2">Aucun élève dans cette classe</p>
            <a href="assign-student.php?classe_id=<?= $classe['id'] ?>" class="text-gai-blue hover:underline text-sm">Ajouter le premier élève</a>
        </div>
    <?php else: ?>
        <div class="overflow-x-auto">
            <table class="min-w-full divide-y divide-gray-200">
                <thead class="bg-gray-50">
                    <tr>
                        <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Élève</th>
                        <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Contact</th>
                        <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Inscription</th>
                        <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                    </tr>
                </thead>
                <tbody class="bg-white divide-y divide-gray-200">
                    <?php foreach($eleves as $eleve): ?>
                    <tr class="hover:bg-gray-50">
                        <td class="px-6 py-4 whitespace-nowrap">
                            <div class="flex items-center">
                                <div class="w-8 h-8 bg-gai-blue rounded-full flex items-center justify-center text-white text-sm font-medium mr-3">
                                    <?= strtoupper(substr($eleve['prenom'], 0, 1)) ?>
                                </div>
                                <div>
                                    <div class="font-medium text-gray-900"><?= htmlspecialchars($eleve['nom'] . ' ' . $eleve['prenom']) ?></div>
                                </div>
                            </div>
                        </td>
                        <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            <?php if($eleve['email']): ?>
                                <div class="flex items-center mb-1">
                                    <i data-lucide="mail" class="w-3 h-3 text-gray-400 mr-1"></i>
                                    <?= htmlspecialchars($eleve['email']) ?>
                                </div>
                            <?php endif; ?>
                            <?php if($eleve['telephone']): ?>
                                <div class="flex items-center">
                                    <i data-lucide="phone" class="w-3 h-3 text-gray-400 mr-1"></i>
                                    <?= htmlspecialchars($eleve['telephone']) ?>
                                </div>
                            <?php endif; ?>
                        </td>
                        <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            N/A
                        </td>
                        <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                            <a href="../users/view.php?id=<?= $eleve['id'] ?>" class="text-gai-blue hover:text-blue-600 inline-flex items-center mr-3">
                                <i data-lucide="eye" class="w-4 h-4 mr-1"></i>
                                Voir
                            </a>
                            <button onclick="confirmRemoveStudent(<?= $eleve['id'] ?>, '<?= htmlspecialchars($eleve['nom'] . ' ' . $eleve['prenom'], ENT_QUOTES) ?>')" class="text-red-600 hover:text-red-800 inline-flex items-center">
                                <i data-lucide="user-minus" class="w-4 h-4 mr-1"></i>
                                Retirer
                            </button>
                        </td>
                    </tr>
                    <?php endforeach; ?>
                </tbody>
            </table>
        </div>
    <?php endif; ?>
</div>

<script>
function confirmRemoveStudent(eleveId, eleveNom) {
    if (confirm('Êtes-vous sûr de vouloir retirer ' + eleveNom + ' de cette classe ?')) {
        const form = document.createElement('form');
        form.method = 'POST';
        form.action = 'remove-student.php?classe_id=<?= $classe['id'] ?>&eleve_id=' + eleveId;
        
        const input = document.createElement('input');
        input.type = 'hidden';
        input.name = 'confirm_remove';
        input.value = '1';
        
        form.appendChild(input);
        document.body.appendChild(form);
        form.submit();
    }
}
</script>

<?php include '../../shared/layouts/footer.php'; ?>