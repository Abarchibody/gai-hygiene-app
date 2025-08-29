<?php
require_once '../../config/database.php';
require_once 'Class.php';

$database = new Database();
$db = $database->getConnection();
$class = new ClassModel($db);

$errors = [];
$success = false;

if ($_POST) {
    $nom_classe = trim($_POST['nom'] ?? '');
    $niveau = trim($_POST['niveau'] ?? '');
    $enseignant_id = $_POST['enseignant_id'] ?? '';
    
    // Validation
    if (empty($nom_classe)) $errors[] = "Le nom de la classe est requis";
    if (empty($niveau)) $errors[] = "Le niveau est requis";
    
    if (empty($errors)) {
        $data = [
            'nom_classe' => $nom_classe,
            'niveau' => $niveau,
            'enseignant_id' => $enseignant_id
        ];
        
        if ($class->create($data)) {
            $success = true;
        } else {
            $errors[] = "Erreur lors de la création de la classe";
        }
    }
}

$enseignants = $class->getEnseignants();

$title = 'Nouvelle Classe - GAI';
$pageTitle = 'Nouvelle Classe';
$breadcrumb = '<a href="/" class="hover:text-gai-blue">Accueil</a> / <a href="index.php" class="hover:text-gai-blue">Classes</a> / <span class="text-gray-800">Nouvelle</span>';
include '../../shared/layouts/header.php';
?>

<!-- Header avec actions -->
<div class="flex items-center justify-between mb-8">
    <div class="flex items-center">
        <a href="index.php" class="text-gai-blue hover:text-blue-600 mr-4 flex items-center">
            <i data-lucide="arrow-left" class="w-4 h-4 mr-2"></i>
            Retour à la liste
        </a>
    </div>
    <div class="text-sm text-gray-500">
        <i data-lucide="info" class="w-4 h-4 inline mr-1"></i>
        Les champs marqués * sont obligatoires
    </div>
</div>

<!-- Messages de feedback -->
<?php if ($success): ?>
    <div class="bg-green-50 border-l-4 border-green-400 p-4 mb-6">
        <div class="flex items-center">
            <i data-lucide="check-circle" class="w-5 h-5 text-green-400 mr-3"></i>
            <div>
                <p class="text-green-800 font-medium">Classe créée avec succès!</p>
                <p class="text-green-600 text-sm mt-1">
                    <a href="index.php" class="underline hover:no-underline">Voir la liste des classes</a>
                </p>
            </div>
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
                        <li class="flex items-center">
                            <i data-lucide="x" class="w-3 h-3 mr-2"></i>
                            <?= htmlspecialchars($error) ?>
                        </li>
                    <?php endforeach; ?>
                </ul>
            </div>
        </div>
    </div>
<?php endif; ?>

<!-- Formulaire principal -->
<div class="bg-white rounded-lg shadow-sm border border-gray-200">
    <!-- Header du formulaire -->
    <div class="px-6 py-4 border-b border-gray-200">
        <h2 class="text-lg font-semibold text-gray-800 flex items-center">
            <i data-lucide="school" class="w-5 h-5 mr-2 text-gai-blue"></i>
            Informations de la classe
        </h2>
        <p class="text-sm text-gray-600 mt-1">Remplissez les informations ci-dessous pour créer une nouvelle classe</p>
    </div>

    <!-- Corps du formulaire -->
    <form method="POST" class="p-6">
        <!-- Informations de base -->
        <div class="grid md:grid-cols-2 gap-6 mb-6">
            <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">
                    <i data-lucide="tag" class="w-4 h-4 inline mr-1"></i>
                    Nom de la classe *
                </label>
                <input type="text" name="nom" value="<?= htmlspecialchars($_POST['nom'] ?? '') ?>" required
                       placeholder="Ex: 6ème A, CP1, etc."
                       class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gai-blue focus:border-transparent transition-colors">
            </div>
            <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">
                    <i data-lucide="layers" class="w-4 h-4 inline mr-1"></i>
                    Niveau *
                </label>
                <select name="niveau" required
                        class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gai-blue focus:border-transparent transition-colors">
                    <option value="">Sélectionner un niveau</option>
                    <option value="Maternelle" <?= ($_POST['niveau'] ?? '') == 'Maternelle' ? 'selected' : '' ?>>Maternelle</option>
                    <option value="CP1" <?= ($_POST['niveau'] ?? '') == 'CP1' ? 'selected' : '' ?>>CP1</option>
                    <option value="CP2" <?= ($_POST['niveau'] ?? '') == 'CP2' ? 'selected' : '' ?>>CP2</option>
                    <option value="CE1" <?= ($_POST['niveau'] ?? '') == 'CE1' ? 'selected' : '' ?>>CE1</option>
                    <option value="CE2" <?= ($_POST['niveau'] ?? '') == 'CE2' ? 'selected' : '' ?>>CE2</option>
                    <option value="CM1" <?= ($_POST['niveau'] ?? '') == 'CM1' ? 'selected' : '' ?>>CM1</option>
                    <option value="CM2" <?= ($_POST['niveau'] ?? '') == 'CM2' ? 'selected' : '' ?>>CM2</option>
                    <option value="6ème" <?= ($_POST['niveau'] ?? '') == '6ème' ? 'selected' : '' ?>>6ème</option>
                    <option value="5ème" <?= ($_POST['niveau'] ?? '') == '5ème' ? 'selected' : '' ?>>5ème</option>
                    <option value="4ème" <?= ($_POST['niveau'] ?? '') == '4ème' ? 'selected' : '' ?>>4ème</option>
                    <option value="3ème" <?= ($_POST['niveau'] ?? '') == '3ème' ? 'selected' : '' ?>>3ème</option>
                </select>
            </div>
        </div>

        <!-- Enseignant responsable -->
        <div class="mb-6">
            <label class="block text-sm font-medium text-gray-700 mb-2">
                <i data-lucide="user-check" class="w-4 h-4 inline mr-1"></i>
                Enseignant responsable
            </label>
            <select name="enseignant_id"
                    class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gai-blue focus:border-transparent transition-colors">
                <option value="">Aucun enseignant assigné</option>
                <?php foreach($enseignants as $enseignant): ?>
                    <option value="<?= $enseignant['id'] ?>" <?= ($_POST['enseignant_id'] ?? '') == $enseignant['id'] ? 'selected' : '' ?>>
                        <?= htmlspecialchars($enseignant['nom'] . ' ' . $enseignant['prenom']) ?>
                    </option>
                <?php endforeach; ?>
            </select>
            <p class="text-xs text-gray-500 mt-1">Optionnel - Vous pouvez assigner un enseignant plus tard</p>
        </div>

        <!-- Description -->
        <div class="mb-6">
            <label class="block text-sm font-medium text-gray-700 mb-2">
                <i data-lucide="file-text" class="w-4 h-4 inline mr-1"></i>
                Description
            </label>
            <textarea name="description" rows="3"
                      placeholder="Description optionnelle de la classe..."
                      class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gai-blue focus:border-transparent transition-colors"><?= htmlspecialchars($_POST['description'] ?? '') ?></textarea>
        </div>

        <!-- Actions -->
        <div class="flex items-center justify-between pt-6 border-t border-gray-200">
            <div class="text-sm text-gray-500">
                <i data-lucide="shield-check" class="w-4 h-4 inline mr-1"></i>
                Les élèves pourront être ajoutés après la création
            </div>
            <div class="flex space-x-3">
                <a href="index.php" class="bg-gray-100 text-gray-700 px-6 py-2 rounded-md hover:bg-gray-200 transition-colors flex items-center">
                    <i data-lucide="x" class="w-4 h-4 mr-2"></i>
                    Annuler
                </a>
                <button type="submit" class="bg-gai-blue text-white px-6 py-2 rounded-md hover:bg-blue-600 transition-colors flex items-center shadow-sm">
                    <i data-lucide="save" class="w-4 h-4 mr-2"></i>
                    Créer la classe
                </button>
            </div>
        </div>
    </form>
</div>

<?php include '../../shared/layouts/footer.php'; ?>