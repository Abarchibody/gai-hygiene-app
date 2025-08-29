<?php
require_once 'config/database.php';
require_once 'modules/users/User.php';
require_once 'modules/classes/Class.php';

$database = new Database();
$db = $database->getConnection();
$user = new User($db);
$class = new ClassModel($db);

$userStats = $user->getStats();
$classStats = $class->getStats();

// Statistiques globales
$stmt = $db->prepare("
    SELECT 
        (SELECT COUNT(*) FROM utilisateurs) as total_utilisateurs,
        (SELECT COUNT(*) FROM classes) as total_classes,
        (SELECT COUNT(*) FROM eleves) as total_eleves_assignes,
        (SELECT COUNT(*) FROM eleves WHERE parent_id IS NOT NULL) as eleves_avec_parent
");
$stmt->execute();
$globalStats = $stmt->fetch(PDO::FETCH_ASSOC);

$title = 'Tableau de Bord - GAI';
$pageTitle = 'Tableau de Bord';
$breadcrumb = '<span class="text-gray-800">Tableau de Bord</span>';
include 'shared/layouts/header.php';
?>

<!-- Statistiques principales -->
<div class="grid md:grid-cols-4 gap-6 mb-8">
    <div class="bg-white rounded-lg shadow-md p-6">
        <div class="flex items-center">
            <div class="text-gai-blue mr-3">
                <i data-lucide="users" class="w-8 h-8"></i>
            </div>
            <div>
                <h3 class="text-lg font-semibold text-gray-800">Utilisateurs</h3>
                <p class="text-2xl font-bold text-gai-blue"><?= $globalStats['total_utilisateurs'] ?></p>
            </div>
        </div>
    </div>
    
    <div class="bg-white rounded-lg shadow-md p-6">
        <div class="flex items-center">
            <div class="text-gai-green mr-3">
                <i data-lucide="school" class="w-8 h-8"></i>
            </div>
            <div>
                <h3 class="text-lg font-semibold text-gray-800">Classes</h3>
                <p class="text-2xl font-bold text-gai-green"><?= $globalStats['total_classes'] ?></p>
            </div>
        </div>
    </div>
    
    <div class="bg-white rounded-lg shadow-md p-6">
        <div class="flex items-center">
            <div class="text-gai-orange mr-3">
                <i data-lucide="graduation-cap" class="w-8 h-8"></i>
            </div>
            <div>
                <h3 class="text-lg font-semibold text-gray-800">Élèves Assignés</h3>
                <p class="text-2xl font-bold text-gai-orange"><?= $globalStats['total_eleves_assignes'] ?></p>
            </div>
        </div>
    </div>
    
    <div class="bg-white rounded-lg shadow-md p-6">
        <div class="flex items-center">
            <div class="text-purple-500 mr-3">
                <i data-lucide="heart" class="w-8 h-8"></i>
            </div>
            <div>
                <h3 class="text-lg font-semibold text-gray-800">Relations Parent-Élève</h3>
                <p class="text-2xl font-bold text-purple-500"><?= $globalStats['eleves_avec_parent'] ?></p>
            </div>
        </div>
    </div>
</div>

<!-- Répartition par type d'utilisateur -->
<div class="grid md:grid-cols-2 gap-6 mb-8">
    <div class="bg-white rounded-lg shadow-md p-6">
        <h3 class="text-lg font-semibold text-gray-800 mb-4 flex items-center">
            <i data-lucide="pie-chart" class="w-5 h-5 mr-2 text-gai-blue"></i>
            Répartition des Utilisateurs
        </h3>
        <div class="space-y-3">
            <?php foreach($userStats as $stat): ?>
            <div class="flex items-center justify-between">
                <div class="flex items-center">
                    <?php if($stat['type_utilisateur'] == 'Élève'): ?>
                        <i data-lucide="graduation-cap" class="w-4 h-4 text-blue-500 mr-2"></i>
                    <?php elseif($stat['type_utilisateur'] == 'Parent'): ?>
                        <i data-lucide="heart" class="w-4 h-4 text-green-500 mr-2"></i>
                    <?php else: ?>
                        <i data-lucide="user-check" class="w-4 h-4 text-purple-500 mr-2"></i>
                    <?php endif; ?>
                    <span class="text-gray-700"><?= $stat['type_utilisateur'] ?>s</span>
                </div>
                <span class="font-semibold text-gray-900"><?= $stat['count'] ?></span>
            </div>
            <?php endforeach; ?>
        </div>
    </div>
    
    <div class="bg-white rounded-lg shadow-md p-6">
        <h3 class="text-lg font-semibold text-gray-800 mb-4 flex items-center">
            <i data-lucide="activity" class="w-5 h-5 mr-2 text-gai-green"></i>
            État du Système
        </h3>
        <div class="space-y-3">
            <div class="flex items-center justify-between">
                <span class="text-gray-700">Classes avec enseignant</span>
                <span class="font-semibold text-green-600"><?= $classStats['classes_avec_enseignant'] ?>/<?= $classStats['total_classes'] ?></span>
            </div>
            <div class="flex items-center justify-between">
                <span class="text-gray-700">Élèves avec parent</span>
                <span class="font-semibold text-purple-600"><?= $globalStats['eleves_avec_parent'] ?>/<?= $globalStats['total_eleves_assignes'] ?></span>
            </div>
            <div class="flex items-center justify-between">
                <span class="text-gray-700">Élèves en classe</span>
                <span class="font-semibold text-blue-600"><?= $globalStats['total_eleves_assignes'] ?></span>
            </div>
        </div>
    </div>
</div>

<!-- Actions rapides -->
<div class="bg-white rounded-lg shadow-md p-6">
    <h3 class="text-lg font-semibold text-gray-800 mb-4 flex items-center">
        <i data-lucide="zap" class="w-5 h-5 mr-2 text-gai-blue"></i>
        Actions Rapides
    </h3>
    <div class="grid md:grid-cols-4 gap-4">
        <a href="modules/users/create.php" class="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
            <i data-lucide="user-plus" class="w-6 h-6 text-gai-blue mr-3"></i>
            <div>
                <div class="font-medium text-gray-900">Nouvel Utilisateur</div>
                <div class="text-sm text-gray-500">Ajouter élève/parent/enseignant</div>
            </div>
        </a>
        
        <a href="modules/classes/create.php" class="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
            <i data-lucide="school" class="w-6 h-6 text-gai-green mr-3"></i>
            <div>
                <div class="font-medium text-gray-900">Nouvelle Classe</div>
                <div class="text-sm text-gray-500">Créer une classe</div>
            </div>
        </a>
        
        <a href="modules/users/index.php" class="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
            <i data-lucide="users" class="w-6 h-6 text-gai-orange mr-3"></i>
            <div>
                <div class="font-medium text-gray-900">Gérer Utilisateurs</div>
                <div class="text-sm text-gray-500">Liste et modification</div>
            </div>
        </a>
        
        <a href="modules/classes/index.php" class="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
            <i data-lucide="list" class="w-6 h-6 text-purple-500 mr-3"></i>
            <div>
                <div class="font-medium text-gray-900">Gérer Classes</div>
                <div class="text-sm text-gray-500">Liste et assignation</div>
            </div>
        </a>
    </div>
</div>

<!-- Phase suivante -->
<div class="bg-gradient-to-r from-gai-blue to-blue-600 rounded-lg shadow-md p-6 mt-8 text-white">
    <h3 class="text-xl font-semibold mb-2 flex items-center">
        <i data-lucide="rocket" class="w-6 h-6 mr-2"></i>
        Phase 1 Terminée - Prochaine Étape
    </h3>
    <p class="mb-4 opacity-90">
        Le système de gestion des utilisateurs et classes est opérationnel. 
        Prêt pour la Phase 2 : Module Rappels d'Hygiène (cœur métier de l'application).
    </p>
    <div class="flex items-center">
        <i data-lucide="check-circle" class="w-5 h-5 mr-2 text-green-300"></i>
        <span class="text-green-300 font-medium">Phase 1 : Gestion Utilisateurs & Classes - TERMINÉE</span>
    </div>
</div>

<?php include 'shared/layouts/footer.php'; ?>