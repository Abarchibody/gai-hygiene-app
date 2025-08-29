<?php
require_once '../../config/database.php';
require_once 'User.php';

$database = new Database();
$db = $database->getConnection();
$user = new User($db);

$id = $_GET['id'] ?? null;
if (!$id) {
    header('Location: index.php');
    exit;
}

$utilisateur = $user->getById($id);
if (!$utilisateur) {
    header('Location: index.php');
    exit;
}

// Récupérer les informations spécifiques selon le type
$infos_supplementaires = [];
if ($utilisateur['type_utilisateur'] == 'Élève') {
    $stmt = $db->prepare("
        SELECT e.*, c.nom_classe, c.niveau, u_parent.nom as parent_nom, u_parent.prenom as parent_prenom
        FROM eleves e
        LEFT JOIN classes c ON e.classe_id = c.id
        LEFT JOIN utilisateurs u_parent ON e.parent_id = u_parent.id
        WHERE e.utilisateur_id = ?
    ");
    $stmt->execute([$id]);
    $infos_supplementaires = $stmt->fetch(PDO::FETCH_ASSOC);
} elseif ($utilisateur['type_utilisateur'] == 'Parent') {
    $stmt = $db->prepare("
        SELECT u.id, u.nom, u.prenom, c.nom_classe, c.niveau
        FROM eleves e
        JOIN utilisateurs u ON e.utilisateur_id = u.id
        LEFT JOIN classes c ON e.classe_id = c.id
        WHERE e.parent_id = ?
    ");
    $stmt->execute([$id]);
    $enfants = $stmt->fetchAll(PDO::FETCH_ASSOC);
} elseif ($utilisateur['type_utilisateur'] == 'Enseignant') {
    $stmt = $db->prepare("
        SELECT c.id, c.nom_classe, c.niveau, COUNT(e.id) as nb_eleves
        FROM classes c
        LEFT JOIN eleves e ON c.id = e.classe_id
        WHERE c.enseignant_id = ?
        GROUP BY c.id
    ");
    $stmt->execute([$id]);
    $classes = $stmt->fetchAll(PDO::FETCH_ASSOC);
}

$title = $utilisateur['nom'] . ' ' . $utilisateur['prenom'] . ' - GAI';
$pageTitle = 'Profil Utilisateur';
$breadcrumb = '<a href="/" class="hover:text-gai-blue">Accueil</a> / <a href="index.php" class="hover:text-gai-blue">Utilisateurs</a> / <span class="text-gray-800">' . htmlspecialchars($utilisateur['nom']) . '</span>';
include '../../shared/layouts/header.php';
?>

<?php if (isset($_GET['updated'])): ?>
    <div class="bg-green-50 border-l-4 border-green-400 p-4 mb-6">
        <div class="flex items-center">
            <i data-lucide="check-circle" class="w-5 h-5 text-green-400 mr-3"></i>
            <p class="text-green-800 font-medium">Utilisateur modifié avec succès!</p>
        </div>
    </div>
<?php endif; ?>

<?php if (isset($_GET['parent_assigned'])): ?>
    <div class="bg-green-50 border-l-4 border-green-400 p-4 mb-6">
        <div class="flex items-center">
            <i data-lucide="heart" class="w-5 h-5 text-green-400 mr-3"></i>
            <p class="text-green-800 font-medium">Parent assigné avec succès!</p>
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
        <a href="edit.php?id=<?= $utilisateur['id'] ?>" class="bg-gai-green text-white px-4 py-2 rounded-md hover:bg-green-600 transition-colors flex items-center">
            <i data-lucide="edit" class="w-4 h-4 mr-2"></i>
            Modifier
        </a>
    </div>
</div>

<!-- Informations principales -->
<div class="bg-white rounded-lg shadow-sm border border-gray-200 mb-6">
    <div class="px-6 py-4 border-b border-gray-200">
        <div class="flex items-center">
            <div class="w-12 h-12 bg-gai-blue rounded-full flex items-center justify-center text-white text-xl font-bold mr-4">
                <?= strtoupper(substr($utilisateur['prenom'], 0, 1)) ?>
            </div>
            <div>
                <h2 class="text-xl font-semibold text-gray-800">
                    <?= htmlspecialchars($utilisateur['nom'] . ' ' . $utilisateur['prenom']) ?>
                </h2>
                <span class="px-3 py-1 text-xs font-medium rounded-full 
                    <?= $utilisateur['type_utilisateur'] == 'Élève' ? 'bg-blue-100 text-blue-800' : 
                        ($utilisateur['type_utilisateur'] == 'Parent' ? 'bg-green-100 text-green-800' : 'bg-purple-100 text-purple-800') ?>">
                    <?= $utilisateur['type_utilisateur'] ?>
                </span>
            </div>
        </div>
    </div>
    
    <div class="p-6">
        <div class="grid md:grid-cols-2 gap-6">
            <div>
                <label class="block text-sm font-medium text-gray-500 mb-1">Email</label>
                <div class="flex items-center">
                    <i data-lucide="mail" class="w-4 h-4 text-gray-400 mr-2"></i>
                    <span class="text-gray-900"><?= $utilisateur['email'] ?: 'Non renseigné' ?></span>
                </div>
            </div>
            
            <div>
                <label class="block text-sm font-medium text-gray-500 mb-1">Téléphone</label>
                <div class="flex items-center">
                    <i data-lucide="phone" class="w-4 h-4 text-gray-400 mr-2"></i>
                    <span class="text-gray-900"><?= $utilisateur['telephone'] ?: 'Non renseigné' ?></span>
                </div>
            </div>
            
            <div>
                <label class="block text-sm font-medium text-gray-500 mb-1">Date d'inscription</label>
                <div class="flex items-center">
                    <i data-lucide="calendar" class="w-4 h-4 text-gray-400 mr-2"></i>
                    <span class="text-gray-900"><?= date('d/m/Y à H:i', strtotime($utilisateur['created_at'])) ?></span>
                </div>
            </div>
        </div>
    </div>
</div>

<!-- Informations spécifiques selon le type -->
<?php if ($utilisateur['type_utilisateur'] == 'Élève'): ?>
    <div class="bg-white rounded-lg shadow-sm border border-gray-200 mb-6">
        <div class="px-6 py-4 border-b border-gray-200">
            <h3 class="text-lg font-semibold text-gray-800 flex items-center">
                <i data-lucide="graduation-cap" class="w-5 h-5 mr-2 text-gai-blue"></i>
                Informations scolaires
            </h3>
        </div>
        <div class="p-6">
            <div class="grid md:grid-cols-2 gap-6">
                <div>
                    <label class="block text-sm font-medium text-gray-500 mb-1">Classe</label>
                    <?php if($infos_supplementaires && $infos_supplementaires['nom_classe']): ?>
                        <div class="flex items-center">
                            <i data-lucide="school" class="w-4 h-4 text-gai-blue mr-2"></i>
                            <a href="../classes/view.php?id=<?= $infos_supplementaires['classe_id'] ?>" class="text-gai-blue hover:underline">
                                <?= htmlspecialchars($infos_supplementaires['nom_classe'] . ' (' . $infos_supplementaires['niveau'] . ')') ?>
                            </a>
                        </div>
                    <?php else: ?>
                        <span class="text-gray-400 italic">Non assigné à une classe</span>
                    <?php endif; ?>
                </div>
                
                <div>
                    <label class="block text-sm font-medium text-gray-500 mb-1">Parent/Tuteur</label>
                    <?php if($infos_supplementaires && $infos_supplementaires['parent_nom']): ?>
                        <div class="flex items-center">
                            <i data-lucide="users" class="w-4 h-4 text-green-500 mr-2"></i>
                            <span class="text-gray-900"><?= htmlspecialchars($infos_supplementaires['parent_nom'] . ' ' . $infos_supplementaires['parent_prenom']) ?></span>
                        </div>
                    <?php else: ?>
                        <div class="flex items-center">
                            <span class="text-gray-400 italic mr-2">Non renseigné</span>
                            <a href="assign-parent.php?eleve_id=<?= $utilisateur['id'] ?>" class="text-gai-blue hover:underline text-sm">
                                Assigner un parent
                            </a>
                        </div>
                    <?php endif; ?>
                </div>
            </div>
        </div>
    </div>

<?php elseif ($utilisateur['type_utilisateur'] == 'Parent'): ?>
    <div class="bg-white rounded-lg shadow-sm border border-gray-200 mb-6">
        <div class="px-6 py-4 border-b border-gray-200">
            <h3 class="text-lg font-semibold text-gray-800 flex items-center">
                <i data-lucide="heart" class="w-5 h-5 mr-2 text-gai-green"></i>
                Enfants
            </h3>
        </div>
        <?php if(empty($enfants)): ?>
            <div class="p-6 text-center">
                <p class="text-gray-500">Aucun enfant enregistré</p>
            </div>
        <?php else: ?>
            <div class="divide-y divide-gray-200">
                <?php foreach($enfants as $enfant): ?>
                <div class="p-6 flex items-center justify-between">
                    <div class="flex items-center">
                        <div class="w-8 h-8 bg-gai-blue rounded-full flex items-center justify-center text-white text-sm font-medium mr-3">
                            <?= strtoupper(substr($enfant['prenom'], 0, 1)) ?>
                        </div>
                        <div>
                            <div class="font-medium text-gray-900"><?= htmlspecialchars($enfant['nom'] . ' ' . $enfant['prenom']) ?></div>
                            <?php if($enfant['nom_classe']): ?>
                                <div class="text-sm text-gray-500"><?= htmlspecialchars($enfant['nom_classe'] . ' (' . $enfant['niveau'] . ')') ?></div>
                            <?php endif; ?>
                        </div>
                    </div>
                    <a href="view.php?id=<?= $enfant['id'] ?>" class="text-gai-blue hover:text-blue-600">
                        <i data-lucide="eye" class="w-4 h-4"></i>
                    </a>
                </div>
                <?php endforeach; ?>
            </div>
        <?php endif; ?>
    </div>

<?php elseif ($utilisateur['type_utilisateur'] == 'Enseignant'): ?>
    <div class="bg-white rounded-lg shadow-sm border border-gray-200 mb-6">
        <div class="px-6 py-4 border-b border-gray-200">
            <h3 class="text-lg font-semibold text-gray-800 flex items-center">
                <i data-lucide="school" class="w-5 h-5 mr-2 text-gai-blue"></i>
                Classes enseignées
            </h3>
        </div>
        <?php if(empty($classes)): ?>
            <div class="p-6 text-center">
                <p class="text-gray-500">Aucune classe assignée</p>
            </div>
        <?php else: ?>
            <div class="divide-y divide-gray-200">
                <?php foreach($classes as $classe): ?>
                <div class="p-6 flex items-center justify-between">
                    <div>
                        <div class="font-medium text-gray-900"><?= htmlspecialchars($classe['nom_classe']) ?></div>
                        <div class="text-sm text-gray-500">
                            <?= htmlspecialchars($classe['niveau']) ?> • <?= $classe['nb_eleves'] ?> élève<?= $classe['nb_eleves'] > 1 ? 's' : '' ?>
                        </div>
                    </div>
                    <a href="../classes/view.php?id=<?= $classe['id'] ?>" class="text-gai-blue hover:text-blue-600">
                        <i data-lucide="eye" class="w-4 h-4"></i>
                    </a>
                </div>
                <?php endforeach; ?>
            </div>
        <?php endif; ?>
    </div>
<?php endif; ?>

<?php include '../../shared/layouts/footer.php'; ?>