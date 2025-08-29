import { useState } from 'react';
import { Database, Download, Upload, Trash2, Sprout, AlertTriangle, CheckCircle } from 'lucide-react';
import { seedDatabase, clearDatabase } from '../../db/seedData';
import { exportData, importData } from '../../utils/dataManager';
import Button from '../../components/ui/Button';

export default function DataManager() {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const showMessage = (type: 'success' | 'error', text: string) => {
    setMessage({ type, text });
    setTimeout(() => setMessage(null), 5000);
  };

  const handleSeedData = async () => {
    if (!confirm('Cela va remplacer toutes les données existantes. Continuer ?')) {
      return;
    }

    setLoading(true);
    try {
      const result = await seedDatabase();
      showMessage('success', 
        `Données de test ajoutées : ${result.users} utilisateurs, ${result.classes} classes, ${result.relations} relations`
      );
    } catch (error) {
      showMessage('error', 'Erreur lors de l\'ajout des données de test');
    } finally {
      setLoading(false);
    }
  };

  const handleClearData = async () => {
    if (!confirm('⚠️ ATTENTION : Cela va supprimer TOUTES les données de façon permanente. Êtes-vous sûr ?')) {
      return;
    }

    setLoading(true);
    try {
      await clearDatabase();
      showMessage('success', 'Toutes les données ont été supprimées');
    } catch (error) {
      showMessage('error', 'Erreur lors de la suppression des données');
    } finally {
      setLoading(false);
    }
  };

  const handleExportData = async () => {
    setLoading(true);
    try {
      await exportData();
      showMessage('success', 'Données exportées avec succès');
    } catch (error) {
      showMessage('error', 'Erreur lors de l\'export des données');
    } finally {
      setLoading(false);
    }
  };

  const handleImportData = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!confirm('Cela va remplacer toutes les données existantes. Continuer ?')) {
      event.target.value = '';
      return;
    }

    setLoading(true);
    try {
      await importData(file);
      showMessage('success', 'Données importées avec succès');
    } catch (error) {
      showMessage('error', 'Erreur lors de l\'import des données');
    } finally {
      setLoading(false);
      event.target.value = '';
    }
  };

  return (
    <div>
      <div className="mb-8">
        <p className="text-gray-600">Gestion des données de l'application</p>
      </div>

      {message && (
        <div className={`mb-6 p-4 rounded-lg border-l-4 ${
          message.type === 'success' 
            ? 'bg-green-50 border-green-400 text-green-800' 
            : 'bg-red-50 border-red-400 text-red-800'
        }`}>
          <div className="flex items-center">
            {message.type === 'success' ? (
              <CheckCircle className="w-5 h-5 mr-2" />
            ) : (
              <AlertTriangle className="w-5 h-5 mr-2" />
            )}
            {message.text}
          </div>
        </div>
      )}

      <div className="grid md:grid-cols-2 gap-6">
        {/* Données de test */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-800 flex items-center">
              <Sprout className="w-5 h-5 mr-2 text-gai-green" />
              Données de test
            </h3>
          </div>
          <div className="p-6">
            <p className="text-gray-600 mb-4">
              Ajouter des données de test réalistes pour l'école GAI :
            </p>
            <ul className="text-sm text-gray-500 mb-6 space-y-1">
              <li>• 3 Enseignants avec emails</li>
              <li>• 4 Parents avec contacts</li>
              <li>• 6 Élèves avec relations familiales</li>
              <li>• 4 Classes avec assignations</li>
            </ul>
            <Button 
              onClick={handleSeedData} 
              disabled={loading}
              className="w-full"
            >
              <Sprout className="w-4 h-4 mr-2" />
              {loading ? 'Ajout en cours...' : 'Ajouter les données de test'}
            </Button>
          </div>
        </div>

        {/* Export/Import */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-800 flex items-center">
              <Database className="w-5 h-5 mr-2 text-gai-blue" />
              Sauvegarde
            </h3>
          </div>
          <div className="p-6 space-y-4">
            <div>
              <p className="text-gray-600 mb-3">Exporter toutes les données :</p>
              <Button 
                onClick={handleExportData} 
                disabled={loading}
                variant="secondary"
                className="w-full"
              >
                <Download className="w-4 h-4 mr-2" />
                {loading ? 'Export en cours...' : 'Télécharger la sauvegarde'}
              </Button>
            </div>

            <div>
              <p className="text-gray-600 mb-3">Importer des données :</p>
              <div className="relative">
                <input
                  type="file"
                  accept=".json"
                  onChange={handleImportData}
                  disabled={loading}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />
                <Button 
                  variant="secondary"
                  disabled={loading}
                  className="w-full"
                >
                  <Upload className="w-4 h-4 mr-2" />
                  {loading ? 'Import en cours...' : 'Choisir un fichier de sauvegarde'}
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Actions dangereuses */}
        <div className="md:col-span-2">
          <div className="bg-white rounded-lg shadow-sm border border-red-200">
            <div className="px-6 py-4 border-b border-red-200">
              <h3 className="text-lg font-semibold text-red-800 flex items-center">
                <AlertTriangle className="w-5 h-5 mr-2" />
                Zone dangereuse
              </h3>
            </div>
            <div className="p-6">
              <p className="text-red-600 mb-4">
                ⚠️ Ces actions sont irréversibles et supprimeront définitivement toutes les données.
              </p>
              <Button 
                onClick={handleClearData} 
                disabled={loading}
                variant="danger"
              >
                <Trash2 className="w-4 h-4 mr-2" />
                {loading ? 'Suppression en cours...' : 'Supprimer toutes les données'}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}