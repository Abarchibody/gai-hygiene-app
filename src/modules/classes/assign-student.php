<?php
require_once '../../config/database.php';
require_once 'Class.php';

$database = new Database();
$db = $database->getConnection();
$class = new ClassModel($db);

$classeId = $_GET['classe_id'] ?? null;
if (!$classeId) {
    header('Location: index.php');
    exit;
}

$classe = $class->getById($classeId);
if (!$classe) {
    header('Location: index.php');
    exit;
}

$success = false;
$error = '';

if ($_POST && isset($_POST['eleve_id'])) {
    $eleveId = $_POST['eleve_id'];
    if ($class->assignerEleve($classeId, $eleveId)) {
        header('Location: view.php?id=' . $classeId . '&student_added=1');
        exit;
    } else {
        $error = "Erreur lors de l'assignation de l'élève";
    }
}

$elevesDisponibles = $class->getElevesDisponibles();

$title = 'Ajouter un élève - GAI';
$pageTitle = 'Ajouter un élève';
$breadcrumb = '<a href="/" class="hover:text-gai-blue">Accueil</a> / <a href="index.php" class="hover:text-gai-blue">Classes</a> / <a href="view.php?id=' . $classeId . '" class="hover:text-gai-blue">' . htmlspecialchars($classe['nom_classe']) . '</a> / <span class="text-gray-800">Ajouter élève</span>';
include '../../shared/layouts/header.php';
?>

<div class="flex items-center justify-between mb-8">
    <div class="flex items-center">
        <a href="view.php?id=<?= $classeId ?>" class="text-gai-blue hover:text-blue-600 mr-4 flex items-center">
            <i data-lucide="arrow-left" class="w-4 h-4 mr-2"></i>
            Retour à la classe
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
            <i data-lucide="user-plus" class="w-5 h-5 mr-2 text-gai-blue"></i>
            Ajouter un élève à la classe <?= htmlspecialchars($classe['nom_classe']) ?>
        </h2>
        <p class="text-sm text-gray-600 mt-1">Sélectionnez un élève non assigné à ajouter à cette classe</p>
    </div>

    <?php if (empty($elevesDisponibles)): ?>
        <div class="p-6 text-center">
            <i data-lucide="users" class="w-12 h-12 text-gray-400 mx-auto mb-4"></i>
            <p class="text-gray-500 mb-2">Aucun élève disponible</p>
            <p class="text-sm text-gray-400">Tous les élèves sont déjà assignés à une classe ou il n'y a pas d'élèves créés.</p>
            <a href="../users/create.php" class="text-gai-blue hover:underline text-sm mt-2 inline-block">
                Créer un nouvel élève
            </a>
        </div>
    <?php else: ?>
        <form method="POST" class="p-6">
            <div class="mb-6">
                <label class="block text-sm font-medium text-gray-700 mb-3">
                    <i data-lucide="users" class="w-4 h-4 inline mr-1"></i>
                    Sélectionner un élève *
                </label>
                <div class="space-y-2 max-h-64 overflow-y-auto border border-gray-200 rounded-md p-3">
                    <?php foreach($elevesDisponibles as $eleve): ?>
                        <label class="flex items-center p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer">
                            <input type="radio" name="eleve_id" value="<?= $eleve['id'] ?>" required class="mr-3">
                            <div class="w-8 h-8 bg-gai-blue rounded-full flex items-center justify-center text-white text-sm font-medium mr-3">
                                <?= strtoupper(substr($eleve['prenom'], 0, 1)) ?>
                            </div>
                            <div>
                                <div class="font-medium text-gray-900"><?= htmlspecialchars($eleve['nom'] . ' ' . $eleve['prenom']) ?></div>
                                <?php if($eleve['email']): ?>
                                    <div class="text-sm text-gray-500"><?= htmlspecialchars($eleve['email']) ?></div>
                                <?php endif; ?>
                            </div>
                        </label>
                    <?php endforeach; ?>
                </div>
            </div>

            <div class="flex items-center justify-between pt-6 border-t border-gray-200">
                <div class="text-sm text-gray-500">
                    <i data-lucide="info" class="w-4 h-4 inline mr-1"></i>
                    <?= count($elevesDisponibles) ?> élève<?= count($elevesDisponibles) > 1 ? 's' : '' ?> disponible<?= count($elevesDisponibles) > 1 ? 's' : '' ?>
                </div>
                <div class="flex space-x-3">
                    <a href="view.php?id=<?= $classeId ?>" class="bg-gray-100 text-gray-700 px-6 py-2 rounded-md hover:bg-gray-200 transition-colors flex items-center">
                        <i data-lucide="x" class="w-4 h-4 mr-2"></i>
                        Annuler
                    </a>
                    <button type="submit" class="bg-gai-blue text-white px-6 py-2 rounded-md hover:bg-blue-600 transition-colors flex items-center">
                        <i data-lucide="user-plus" class="w-4 h-4 mr-2"></i>
                        Ajouter à la classe
                    </button>
                </div>
            </div>
        </form>
    <?php endif; ?>
</div>

<?php include '../../shared/layouts/footer.php'; ?>