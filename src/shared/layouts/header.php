<?php
// Détection de la page active
$currentPath = $_SERVER['REQUEST_URI'];
$isHome = $currentPath === '/' || $currentPath === '/index.php';
$isUsers = strpos($currentPath, '/modules/users/') !== false;
$isAdmin = strpos($currentPath, '/admin.php') !== false;
?>
<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title><?= $title ?? 'GAI - Rappels d\'Hygiène' ?></title>
    <script src="https://cdn.tailwindcss.com"></script>
    <script src="https://unpkg.com/lucide@latest/dist/umd/lucide.js"></script>
    <script>
        tailwind.config = {
            theme: {
                extend: {
                    colors: {
                        'gai-blue': '#007cba',
                        'gai-green': '#28a745',
                        'gai-orange': '#fd7e14'
                    }
                }
            }
        }
    </script>
</head>
<body class="bg-gray-50">
    <div class="flex h-screen">
        <!-- Sidebar -->
        <div class="w-64 bg-white shadow-lg">
            <div class="p-6">
                <a href="/" class="text-xl font-bold text-gai-blue">GAI Hygiène</a>
                <p class="text-sm text-gray-500 mt-1">Complexe Scolaire</p>
            </div>
            
            <nav class="mt-6">
                <div class="px-6 py-2">
                    <h3 class="text-xs font-semibold text-gray-500 uppercase tracking-wider">Navigation</h3>
                </div>
                
                <a href="/" class="flex items-center px-6 py-3 transition-colors <?= $isHome ? 'bg-gai-blue text-white' : 'text-gray-700 hover:bg-gai-blue hover:text-white' ?>">
                    <i data-lucide="home" class="w-5 h-5 mr-3"></i>
                    Accueil
                </a>
                
                <div class="px-6 py-2 mt-4">
                    <h3 class="text-xs font-semibold text-gray-500 uppercase tracking-wider">Gestion</h3>
                </div>
                
                <a href="/modules/users/" class="flex items-center px-6 py-3 transition-colors <?= $isUsers ? 'bg-gai-blue text-white' : 'text-gray-700 hover:bg-gai-blue hover:text-white' ?>">
                    <i data-lucide="users" class="w-5 h-5 mr-3"></i>
                    Utilisateurs
                </a>
                
                <a href="#" class="flex items-center px-6 py-3 text-gray-400 cursor-not-allowed">
                    <i data-lucide="bell" class="w-5 h-5 mr-3"></i>
                    Rappels
                    <span class="ml-auto text-xs bg-gai-orange text-white px-2 py-1 rounded-full">Bientôt</span>
                </a>
                
                <a href="#" class="flex items-center px-6 py-3 text-gray-400 cursor-not-allowed">
                    <i data-lucide="calendar" class="w-5 h-5 mr-3"></i>
                    Programmation
                    <span class="ml-auto text-xs bg-gai-orange text-white px-2 py-1 rounded-full">Bientôt</span>
                </a>
                
                <div class="px-6 py-2 mt-4">
                    <h3 class="text-xs font-semibold text-gray-500 uppercase tracking-wider">Administration</h3>
                </div>
                
                <a href="/admin.php" class="flex items-center px-6 py-3 transition-colors <?= $isAdmin ? 'bg-gai-blue text-white' : 'text-gray-700 hover:bg-gai-blue hover:text-white' ?>">
                    <i data-lucide="database" class="w-5 h-5 mr-3"></i>
                    Base de données
                </a>
            </nav>
        </div>
        
        <!-- Main Content -->
        <div class="flex-1 flex flex-col overflow-hidden">
            <!-- Top Header -->
            <header class="bg-white shadow-sm border-b border-gray-200">
                <div class="px-6 py-4">
                    <div class="flex items-center justify-between">
                        <div>
                            <h1 class="text-2xl font-semibold text-gray-800"><?= $pageTitle ?? 'Tableau de bord' ?></h1>
                            <?php if(isset($breadcrumb)): ?>
                                <nav class="text-sm text-gray-500 mt-1">
                                    <?= $breadcrumb ?>
                                </nav>
                            <?php endif; ?>
                        </div>
                        <div class="flex items-center space-x-4">
                            <div class="flex items-center text-sm text-gray-500">
                                <i data-lucide="clock" class="w-4 h-4 mr-2"></i>
                                <?= date('d/m/Y H:i') ?>
                            </div>
                        </div>
                    </div>
                </div>
            </header>
            
            <!-- Page Content -->
            <main class="flex-1 overflow-y-auto p-6">
            <script>
                // Initialiser Lucide icons après le chargement du DOM
                document.addEventListener('DOMContentLoaded', function() {
                    lucide.createIcons();
                });
            </script>