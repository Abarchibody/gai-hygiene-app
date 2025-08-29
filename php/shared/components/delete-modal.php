<!-- Modal de confirmation de suppression -->
<div id="deleteModal" class="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full hidden z-50">
    <div class="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
        <!-- Header -->
        <div class="flex items-center justify-between mb-4">
            <div class="flex items-center">
                <i data-lucide="alert-triangle" class="w-6 h-6 text-red-500 mr-2"></i>
                <h3 class="text-lg font-semibold text-gray-900">Confirmer la suppression</h3>
            </div>
            <button onclick="closeDeleteModal()" class="text-gray-400 hover:text-gray-600">
                <i data-lucide="x" class="w-5 h-5"></i>
            </button>
        </div>
        
        <!-- Contenu -->
        <div class="mb-6">
            <p class="text-gray-600 mb-3">Êtes-vous sûr de vouloir supprimer cet utilisateur ?</p>
            <div id="userInfo" class="bg-gray-50 rounded-lg p-3">
                <div class="flex items-center">
                    <div id="userIcon" class="text-gai-blue mr-3"></div>
                    <div>
                        <div id="userName" class="font-medium text-gray-900"></div>
                        <div id="userType" class="text-sm text-gray-500"></div>
                    </div>
                </div>
            </div>
            <p class="text-red-600 text-sm mt-3">
                <i data-lucide="alert-circle" class="w-4 h-4 inline mr-1"></i>
                Cette action est irréversible
            </p>
        </div>
        
        <!-- Actions -->
        <div class="flex justify-end space-x-3">
            <button onclick="closeDeleteModal()" 
                    class="bg-gray-100 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-200 transition-colors flex items-center">
                <i data-lucide="x" class="w-4 h-4 mr-2"></i>
                Annuler
            </button>
            <button id="confirmDeleteBtn" 
                    class="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 transition-colors flex items-center">
                <i data-lucide="trash-2" class="w-4 h-4 mr-2"></i>
                Supprimer
            </button>
        </div>
    </div>
</div>

<script>
let deleteUserId = null;

function openDeleteModal(userId, userName, userType) {
    deleteUserId = userId;
    
    // Mettre à jour les informations utilisateur
    document.getElementById('userName').textContent = userName;
    document.getElementById('userType').textContent = userType;
    
    // Icône selon le type
    const iconElement = document.getElementById('userIcon');
    if (userType === 'Élève') {
        iconElement.innerHTML = '<i data-lucide="graduation-cap" class="w-6 h-6"></i>';
    } else if (userType === 'Parent') {
        iconElement.innerHTML = '<i data-lucide="heart" class="w-6 h-6"></i>';
    } else {
        iconElement.innerHTML = '<i data-lucide="user-check" class="w-6 h-6"></i>';
    }
    
    // Réinitialiser les icônes Lucide
    lucide.createIcons();
    
    // Afficher le modal
    document.getElementById('deleteModal').classList.remove('hidden');
    document.body.style.overflow = 'hidden';
}

function closeDeleteModal() {
    document.getElementById('deleteModal').classList.add('hidden');
    document.body.style.overflow = 'auto';
    deleteUserId = null;
}

function confirmDelete() {
    if (deleteUserId) {
        // Créer un formulaire pour la suppression
        const form = document.createElement('form');
        form.method = 'POST';
        form.action = 'delete.php?id=' + deleteUserId;
        
        const input = document.createElement('input');
        input.type = 'hidden';
        input.name = 'confirm_delete';
        input.value = '1';
        
        form.appendChild(input);
        document.body.appendChild(form);
        form.submit();
    }
}

// Event listener pour le bouton de confirmation
document.getElementById('confirmDeleteBtn').addEventListener('click', confirmDelete);

// Fermer le modal en cliquant à l'extérieur
document.getElementById('deleteModal').addEventListener('click', function(e) {
    if (e.target === this) {
        closeDeleteModal();
    }
});

// Fermer le modal avec Escape
document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
        closeDeleteModal();
    }
});
</script>