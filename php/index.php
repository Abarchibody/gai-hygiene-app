<?php
require_once 'config/database.php';

$database = new Database();
$db = $database->getConnection();

$title = 'Accueil - GAI';
$pageTitle = 'Tableau de bord';
include 'shared/layouts/header.php';
?>
            <?php if ($db): ?>
                <!-- Status Card -->
                <div class="bg-white rounded-lg shadow-md p-6 mb-8">
                    <div class="flex items-center">
                        <div class="w-3 h-3 bg-gai-green rounded-full mr-3"></div>
                        <h2 class="text-xl font-semibold text-gray-800">Système opérationnel</h2>
                    </div>
                    <p class="text-gray-600 mt-2">Connexion à la base de données réussie</p>
                    <?php
                    $query = "SELECT COUNT(*) as count FROM utilisateurs";
                    $stmt = $db->prepare($query);
                    $stmt->execute();
                    $result = $stmt->fetch(PDO::FETCH_ASSOC);
                    ?>
                    <p class="text-sm text-gray-500 mt-1">Utilisateurs enregistrés: <?= $result['count'] ?></p>
                </div>

                <!-- Navigation Cards -->
                <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <a href="/modules/users/" class="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
                        <div class="text-gai-blue mb-3">
                            <i data-lucide="users" class="w-8 h-8"></i>
                        </div>
                        <h3 class="text-lg font-semibold text-gray-800 mb-2">Utilisateurs</h3>
                        <p class="text-gray-600 text-sm">Gestion des élèves, parents et enseignants</p>
                    </a>
                    
                    <a href="/admin.php" class="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
                        <div class="text-gai-blue mb-3">
                            <i data-lucide="database" class="w-8 h-8"></i>
                        </div>
                        <h3 class="text-lg font-semibold text-gray-800 mb-2">Administration DB</h3>
                        <p class="text-gray-600 text-sm">Consulter et gérer la base de données</p>
                    </a>
                    
                    <div class="bg-white rounded-lg shadow-md p-6 opacity-75">
                        <div class="text-gray-400 mb-3">
                            <i data-lucide="bell" class="w-8 h-8"></i>
                        </div>
                        <h3 class="text-lg font-semibold text-gray-500 mb-2">Rappels</h3>
                        <p class="text-gray-400 text-sm">Création et gestion des rappels d'hygiène</p>
                        <span class="text-xs text-gai-orange">Bientôt disponible</span>
                    </div>
                </div>
            <?php else: ?>
                <div class="bg-red-50 border border-red-200 rounded-lg p-6">
                    <div class="flex items-center">
                        <div class="w-3 h-3 bg-red-500 rounded-full mr-3"></div>
                        <h2 class="text-xl font-semibold text-red-800">Erreur de connexion</h2>
                    </div>
                    <p class="text-red-600 mt-2">Impossible de se connecter à la base de données</p>
                </div>
            <?php endif; ?>
<?php include 'shared/layouts/footer.php'; ?>