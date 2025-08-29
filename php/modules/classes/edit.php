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

$errors = [];
$success = false;

if ($_POST) {
    $nom_classe = trim($_POST['nom'] ?? '');
    $niveau = trim($_POST['niveau'] ?? '');
    $enseignant_id = $_POST['enseignant_id'] ?? '';
    
    if (empty($nom_classe)) $errors[] = "Le nom de la classe est requis";
    if (empty($niveau)) $errors[] = "Le niveau est requis";
    
    if (empty($errors)) {
        $data = [
            'nom_classe' => $nom_classe,
            'niveau' => $niveau,
            'enseignant_id' => $enseignant_id
        ];
        
        if ($class->update($id, $data)) {
            header('Location: view.php?id=' . $id . '&updated=1');
            exit;
        } else {
            $errors[] = "Erreur lors de la modification";
        }
    }
}

$enseignants = $class->getEnseignants();

$title = 'Modifier Classe - GAI';
$pageTitle = 'Modifier la Classe';
$breadcrumb = '<a href="/" class="hover:text-gai-blue">Accueil</a> / <a href="index.php" class="hover:text-gai-blue">Classes</a> / <span class="text-gray-800">Modifier</span>';
include '../../shared/layouts/header.php';
?>

<div class="flex items-center justify-between mb-8">
    <div class="flex items-center">
        <a href="index.php" class="text-gai-blue hover:text-blue-600 mr-4 flex items-center">
            <i data-lucide="arrow-left" class="w-4 h-4 mr-2"></i>
            Retour à la liste
        </a>
    </div>
</div>

<?php if ($success): ?>
    <div class="bg-green-50 border-l-4 border-green-400 p-4 mb-6">
        <div class="flex items-center">
            <i data-lucide="check-circle" class="w-5 h-5 text-green-400 mr-3"></i>
            <p class="text-green-800 font-medium">Classe modifiée avec succès!</p>
        </div>
    </div>
<?php endif; ?>

<?php if (!empty($errors)): ?>
    <div class="bg-red-50 border-l-4 border-red-400 p-4 mb-6">
        <div class="flex">
            <i data-lucide="alert-circle" class="w-5 h-5 text-red-400 mr-3 mt-0.5"></i>
            <div>
                <h3 class="text-red-800 font-medium">Erreurs de validation</h3>
                <ul class="text-red-600 text-sm mt-2 space-y-1">
                    <?php foreach($errors as $error): ?>
                        <li><?= htmlspecialchars($error) ?></li>
                    <?php endforeach; ?>
                </ul>
            </div>
        </div>
    </div>
<?php endif; ?>

<div class="bg-white rounded-lg shadow-sm border border-gray-200">
    <div class="px-6 py-4 border-b border-gray-200">
        <h2 class="text-lg font-semibold text-gray-800 flex items-center">
            <i data-lucide="edit" class="w-5 h-5 mr-2 text-gai-blue"></i>
            Modifier la classe: <?= htmlspecialchars($classe['nom_classe']) ?>
        </h2>
    </div>

    <form method="POST" class="p-6">
        <div class="grid md:grid-cols-2 gap-6 mb-6">
            <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">
                    <i data-lucide="tag" class="w-4 h-4 inline mr-1"></i>
                    Nom de la classe *
                </label>
                <input type="text" name="nom" value="<?= htmlspecialchars($_POST['nom'] ?? $classe['nom_classe']) ?>" required
                       class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gai-blue focus:border-transparent">
            </div>
            <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">
                    <i data-lucide="layers" class="w-4 h-4 inline mr-1"></i>
                    Niveau *
                </label>
                <select name="niveau" required
                        class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gai-blue focus:border-transparent">
                    <option value="">Sélectionner un niveau</option>
                    <?php 
                    $niveaux = ['Maternelle', 'CP1', 'CP2', 'CE1', 'CE2', 'CM1', 'CM2', '6ème', '5ème', '4ème', '3ème'];
                    $selected_niveau = $_POST['niveau'] ?? $classe['niveau'];
                    foreach($niveaux as $niveau): ?>
                        <option value="<?= $niveau ?>" <?= $selected_niveau == $niveau ? 'selected' : '' ?>>
                            <?= $niveau ?>
                        </option>
                    <?php endforeach; ?>
                </select>
            </div>
        </div>

        <div class="mb-6">
            <label class="block text-sm font-medium text-gray-700 mb-2">
                <i data-lucide="user-check" class="w-4 h-4 inline mr-1"></i>
                Enseignant responsable
            </label>
            <select name="enseignant_id"
                    class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gai-blue focus:border-transparent">
                <option value="">Aucun enseignant assigné</option>
                <?php 
                $selected_enseignant = $_POST['enseignant_id'] ?? $classe['enseignant_id'];
                foreach($enseignants as $enseignant): ?>
                    <option value="<?= $enseignant['id'] ?>" <?= $selected_enseignant == $enseignant['id'] ? 'selected' : '' ?>>
                        <?= htmlspecialchars($enseignant['nom'] . ' ' . $enseignant['prenom']) ?>
                    </option>
                <?php endforeach; ?>
            </select>
        </div>

        <div class="flex items-center justify-between pt-6 border-t border-gray-200">
            <div class="text-sm text-gray-500">
                <i data-lucide="info" class="w-4 h-4 inline mr-1"></i>
                Les champs marqués * sont obligatoires
            </div>
            <div class="flex space-x-3">
                <a href="index.php" class="bg-gray-100 text-gray-700 px-6 py-2 rounded-md hover:bg-gray-200 transition-colors flex items-center">
                    <i data-lucide="x" class="w-4 h-4 mr-2"></i>
                    Annuler
                </a>
                <button type="submit" class="bg-gai-blue text-white px-6 py-2 rounded-md hover:bg-blue-600 transition-colors flex items-center">
                    <i data-lucide="save" class="w-4 h-4 mr-2"></i>
                    Enregistrer
                </button>
            </div>
        </div>
    </form>
</div>

<?php include '../../shared/layouts/footer.php'; ?>