import { Navigate } from 'react-router-dom';
import { authService } from '../services';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredPermission?: string;
}

export default function ProtectedRoute({ children, requiredPermission }: ProtectedRouteProps) {
  const user = authService.getCurrentUser();

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Simple permission check based on user type
  if (requiredPermission) {
    const hasPermission = 
      user.type_utilisateur === 'Admin' || 
      (requiredPermission.includes('Users') && (user.type_utilisateur === 'Admin' || user.type_utilisateur === 'Enseignant')) ||
      (requiredPermission.includes('Classes') && (user.type_utilisateur === 'Admin' || user.type_utilisateur === 'Enseignant')) ||
      (requiredPermission.includes('Reminders') && (user.type_utilisateur === 'Admin' || user.type_utilisateur === 'Enseignant')) ||
      (requiredPermission.includes('Reports') && (user.type_utilisateur === 'Admin' || user.type_utilisateur === 'Enseignant')) ||
      (requiredPermission.includes('Events') && (user.type_utilisateur === 'Admin' || user.type_utilisateur === 'Enseignant')) ||
      (requiredPermission.includes('Admin') && user.type_utilisateur === 'Admin');

    if (!hasPermission) {
      return (
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Accès refusé</h1>
            <p className="text-gray-600">Vous n'avez pas les permissions nécessaires pour accéder à cette page.</p>
          </div>
        </div>
      );
    }
  }

  return <>{children}</>;
}