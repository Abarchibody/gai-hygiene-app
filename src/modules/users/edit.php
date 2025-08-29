<?php
require_once '../../config/database.php';
require_once 'User.php';

$database = new Database();
$db = $database->getConnection();
$user = new User($db);

$id = $_GET['id'] ?? null;
$errors = [];
$success = false;

if (!$id) {
    header('Location: index.php');
    exit;
}

$userData = $user->getById($id);
if (!$userData) {
    header('Location: index.php');
    exit;
}

if ($_POST) {
    $nom = trim($_POST['nom'] ?? '');
    $prenom = trim($_POST['prenom'] ?? '');
    $email = trim($_POST['email'] ?? '');
    $telephone = trim($_POST['telephone'] ?? '');
    $type_utilisateur = $_POST['type_utilisateur'] ?? '';
    
    // Validation
    if (empty($nom)) $errors[] = "Le nom est requis";
    if (empty($prenom)) $errors[] = "Le prénom est requis";
    if (empty($type_utilisateur)) $errors[] = "Le type d'utilisateur est requis";
    if ($email && !filter_var($email, FILTER_VALIDATE_EMAIL)) $errors[] = "Email invalide";
    
    if (empty($errors)) {
        $data = [
            'nom' => $nom,
            'prenom' => $prenom,
            'email' => $email,
            'telephone' => $telephone,
            'type_utilisateur' => $type_utilisateur
        ];
        
        if ($user->update($id, $data)) {
            $success = true;
            $userData = $user->getById($id); // Recharger les données
        } else {
            $errors[] = "Erreur lors de la modification de l'utilisateur";
        }
    }
}

$title = 'Modifier Utilisateur - GAI';
$pageTitle = 'Modifier Utilisateur';
$breadcrumb = '<a href="/" class="hover:text-gai-blue">Accueil</a> / <a href="index.php" class="hover:text-gai-blue">Utilisateurs</a> / <span class="text-gray-800">Modifier</span>';
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
        Utilisateur #<?= $userData['id'] ?>
    </div>
</div>

<!-- Messages de feedback -->
<?php if ($success): ?>
    <div class="bg-green-50 border-l-4 border-green-400 p-4 mb-6">
        <div class="flex items-center">
            <i data-lucide="check-circle" class="w-5 h-5 text-green-400 mr-3"></i>
            <div>
                <p class="text-green-800 font-medium">Utilisateur modifié avec succès!</p>
                <p class="text-green-600 text-sm mt-1">Les modifications ont été sauvegardées</p>
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
            <i data-lucide="edit" class="w-5 h-5 mr-2 text-gai-blue"></i>
            Modifier les informations
        </h2>
        <p class="text-sm text-gray-600 mt-1">Modifiez les informations de <?= htmlspecialchars($userData['nom'] . ' ' . $userData['prenom']) ?></p>
    </div>

    <!-- Corps du formulaire -->
    <form method="POST" class="p-6">
        <!-- Type d'utilisateur -->
        <div class="mb-6">
            <label class="block text-sm font-medium text-gray-700 mb-2">
                <i data-lucide="user-check" class="w-4 h-4 inline mr-1"></i>
                Type d'utilisateur *
            </label>
            <div class="grid grid-cols-3 gap-3">
                <label class="relative flex items-center p-3 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
                    <input type="radio" name="type_utilisateur" value="Élève" 
                           <?= ($userData['type_utilisateur'] ?? '') == 'Élève' ? 'checked' : '' ?>
                           class="sr-only peer" required>
                    <div class="flex items-center w-full relative z-10">
                        <i data-lucide="graduation-cap" class="w-5 h-5 text-blue-500 mr-3"></i>
                        <div>
                            <div class="font-medium text-gray-900">Élève</div>
                            <div class="text-xs text-gray-500">Étudiant du complexe</div>
                        </div>
                    </div>
                    <div class="absolute inset-0 border-2 border-transparent peer-checked:border-gai-blue peer-checked:bg-blue-50 rounded-lg"></div>
                </label>
                
                <label class="relative flex items-center p-3 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
                    <input type="radio" name="type_utilisateur" value="Parent" 
                           <?= ($userData['type_utilisateur'] ?? '') == 'Parent' ? 'checked' : '' ?>
                           class="sr-only peer" required>
                    <div class="flex items-center w-full relative z-10">
                        <i data-lucide="heart" class="w-5 h-5 text-green-500 mr-3"></i>
                        <div>
                            <div class="font-medium text-gray-900">Parent</div>
                            <div class="text-xs text-gray-500">Responsable d'élève</div>
                        </div>
                    </div>
                    <div class="absolute inset-0 border-2 border-transparent peer-checked:border-gai-blue peer-checked:bg-green-50 rounded-lg"></div>
                </label>
                
                <label class="relative flex items-center p-3 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
                    <input type="radio" name="type_utilisateur" value="Enseignant" 
                           <?= ($userData['type_utilisateur'] ?? '') == 'Enseignant' ? 'checked' : '' ?>
                           class="sr-only peer" required>
                    <div class="flex items-center w-full relative z-10">
                        <i data-lucide="user-check" class="w-5 h-5 text-purple-500 mr-3"></i>
                        <div>
                            <div class="font-medium text-gray-900">Enseignant</div>
                            <div class="text-xs text-gray-500">Personnel éducatif</div>
                        </div>
                    </div>
                    <div class="absolute inset-0 border-2 border-transparent peer-checked:border-gai-blue peer-checked:bg-purple-50 rounded-lg"></div>
                </label>
            </div>
        </div>

        <!-- Informations personnelles -->
        <div class="grid md:grid-cols-2 gap-6 mb-6">
            <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">
                    <i data-lucide="user" class="w-4 h-4 inline mr-1"></i>
                    Nom *
                </label>
                <input type="text" name="nom" value="<?= htmlspecialchars($userData['nom'] ?? '') ?>" required
                       placeholder="Nom de famille"
                       class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gai-blue focus:border-transparent transition-colors">
            </div>
            <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">
                    <i data-lucide="user" class="w-4 h-4 inline mr-1"></i>
                    Prénom *
                </label>
                <input type="text" name="prenom" value="<?= htmlspecialchars($userData['prenom'] ?? '') ?>" required
                       placeholder="Prénom"
                       class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gai-blue focus:border-transparent transition-colors">
            </div>
        </div>

        <!-- Informations de contact -->
        <div class="grid md:grid-cols-2 gap-6 mb-6">
            <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">
                    <i data-lucide="mail" class="w-4 h-4 inline mr-1"></i>
                    Email
                </label>
                <input type="email" name="email" value="<?= htmlspecialchars($userData['email'] ?? '') ?>"
                       placeholder="exemple@email.com"
                       class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gai-blue focus:border-transparent transition-colors">
            </div>
            <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">
                    <i data-lucide="phone" class="w-4 h-4 inline mr-1"></i>
                    Téléphone
                </label>
                <input type="tel" name="telephone" value="<?= htmlspecialchars($userData['telephone'] ?? '') ?>"
                       placeholder="+243 XXX XXX XXX"
                       class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gai-blue focus:border-transparent transition-colors">
            </div>
        </div>

        <!-- Actions -->
        <div class="flex items-center justify-between pt-6 border-t border-gray-200">
            <div class="text-sm text-gray-500">
                <i data-lucide="calendar" class="w-4 h-4 inline mr-1"></i>
                Créé le <?= date('d/m/Y à H:i', strtotime($userData['created_at'])) ?>
            </div>
            <div class="flex space-x-3">
                <a href="index.php" class="bg-gray-100 text-gray-700 px-6 py-2 rounded-md hover:bg-gray-200 transition-colors flex items-center">
                    <i data-lucide="x" class="w-4 h-4 mr-2"></i>
                    Annuler
                </a>
                <button type="submit" class="bg-gai-blue text-white px-6 py-2 rounded-md hover:bg-blue-600 transition-colors flex items-center shadow-sm">
                    <i data-lucide="save" class="w-4 h-4 mr-2"></i>
                    Sauvegarder
                </button>
            </div>
        </div>
    </form>
</div>

<?php include '../../shared/layouts/footer.php'; ?>