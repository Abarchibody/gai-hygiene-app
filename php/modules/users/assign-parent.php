<?php
require_once '../../config/database.php';
require_once '../classes/Class.php';

$database = new Database();
$db = $database->getConnection();
$class = new ClassModel($db);

$eleveId = $_GET['eleve_id'] ?? null;
if (!$eleveId) {
    header('Location: index.php');
    exit;
}

// Vérifier que l'utilisateur est bien un élève
$stmt = $db->prepare("SELECT * FROM utilisateurs WHERE id = ? AND type_utilisateur = 'Élève'");
$stmt->execute([$eleveId]);
$eleve = $stmt->fetch(PDO::FETCH_ASSOC);

if (!$eleve) {
    header('Location: index.php');
    exit;
}

$success = false;
$error = '';

if ($_POST && isset($_POST['parent_id'])) {
    $parentId = $_POST['parent_id'];
    if ($class->assignerParent($eleveId, $parentId)) {
        header('Location: view.php?id=' . $eleveId . '&parent_assigned=1');
        exit;
    } else {
        $error = "Erreur lors de l'assignation du parent";
    }
}

$parentsDisponibles = $class->getParentsDisponibles();

$title = 'Assigner un parent - GAI';
$pageTitle = 'Assigner un parent';
$breadcrumb = '<a href="/" class="hover:text-gai-blue">Accueil</a> / <a href="index.php" class="hover:text-gai-blue">Utilisateurs</a> / <a href="view.php?id=' . $eleveId . '" class="hover:text-gai-blue">' . htmlspecialchars($eleve['nom']) . '</a> / <span class="text-gray-800">Assigner parent</span>';
include '../../shared/layouts/header.php';
?>

<div class="flex items-center justify-between mb-8">
    <div class="flex items-center">
        <a href="view.php?id=<?= $eleveId ?>" class="text-gai-blue hover:text-blue-600 mr-4 flex items-center">
            <i data-lucide="arrow-left" class="w-4 h-4 mr-2"></i>
            Retour au profil
        </a>
    </div>
</div>

<?php if ($error): ?>
    <div class="bg-red-50 border-l-4 border-red-400 p-4 mb-6">
        <div class="flex items-center">
            <i data-lucide="alert-circle" class="w-5 h-5 text-red-400 mr-3"></i>
            <p class="text-red-800 font-medium"><?= htmlspecialchars($error) ?></p>
        </div>
    </div>
<?php endif; ?>

<div class="bg-white rounded-lg shadow-sm border border-gray-200">
    <div class="px-6 py-4 border-b border-gray-200">
        <h2 class="text-lg font-semibold text-gray-800 flex items-center">
            <i data-lucide="heart" class="w-5 h-5 mr-2 text-gai-green"></i>
            Assigner un parent à <?= htmlspecialchars($eleve['nom'] . ' ' . $eleve['prenom']) ?>
        </h2>
        <p class="text-sm text-gray-600 mt-1">Sélectionnez un parent pour cet élève</p>
    </div>

    <?php if (empty($parentsDisponibles)): ?>
        <div class="p-6 text-center">
            <i data-lucide="heart" class="w-12 h-12 text-gray-400 mx-auto mb-4"></i>
            <p class="text-gray-500 mb-2">Aucun parent disponible</p>
            <p class="text-sm text-gray-400">Vous devez d'abord créer des utilisateurs de type "Parent".</p>
            <a href="create.php" class="text-gai-blue hover:underline text-sm mt-2 inline-block">
                Créer un nouveau parent
            </a>
        </div>
    <?php else: ?>
        <form method="POST" class="p-6">
            <div class="mb-6">
                <label class="block text-sm font-medium text-gray-700 mb-3">
                    <i data-lucide="heart" class="w-4 h-4 inline mr-1"></i>
                    Sélectionner un parent *
                </label>
                <div class="space-y-2 max-h-64 overflow-y-auto border border-gray-200 rounded-md p-3">
                    <?php foreach($parentsDisponibles as $parent): ?>
                        <label class="flex items-center p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer">
                            <input type="radio" name="parent_id" value="<?= $parent['id'] ?>" required class="mr-3">
                            <div class="w-8 h-8 bg-gai-green rounded-full flex items-center justify-center text-white text-sm font-medium mr-3">
                                <?= strtoupper(substr($parent['prenom'], 0, 1)) ?>
                            </div>
                            <div>
                                <div class="font-medium text-gray-900"><?= htmlspecialchars($parent['nom'] . ' ' . $parent['prenom']) ?></div>
                                <?php if($parent['email']): ?>
                                    <div class="text-sm text-gray-500"><?= htmlspecialchars($parent['email']) ?></div>
                                <?php endif; ?>
                            </div>
                        </label>
                    <?php endforeach; ?>
                </div>
            </div>

            <div class="flex items-center justify-between pt-6 border-t border-gray-200">
                <div class="text-sm text-gray-500">
                    <i data-lucide="info" class="w-4 h-4 inline mr-1"></i>
                    <?= count($parentsDisponibles) ?> parent<?= count($parentsDisponibles) > 1 ? 's' : '' ?> disponible<?= count($parentsDisponibles) > 1 ? 's' : '' ?>
                </div>
                <div class="flex space-x-3">
                    <a href="view.php?id=<?= $eleveId ?>" class="bg-gray-100 text-gray-700 px-6 py-2 rounded-md hover:bg-gray-200 transition-colors flex items-center">
                        <i data-lucide="x" class="w-4 h-4 mr-2"></i>
                        Annuler
                    </a>
                    <button type="submit" class="bg-gai-green text-white px-6 py-2 rounded-md hover:bg-green-600 transition-colors flex items-center">
                        <i data-lucide="heart" class="w-4 h-4 mr-2"></i>
                        Assigner ce parent
                    </button>
                </div>
            </div>
        </form>
    <?php endif; ?>
</div>

<?php include '../../shared/layouts/footer.php'; ?>