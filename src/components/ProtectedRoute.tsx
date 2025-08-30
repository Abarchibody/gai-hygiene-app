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
    const userType = user.type_utilisateur;
    const hasPermission = 
      userType === 'Admin' || 
      (requiredPermission.includes('Users') && (userType === 'Admin' || userType === 'Enseignant')) ||
      (requiredPermission.includes('Classes') && (userType === 'Admin' || userType === 'Enseignant')) ||
      (requiredPermission.includes('Reminders') && (userType === 'Admin' || userType === 'Enseignant')) ||
      (requiredPermission.includes('Reports') && (userType === 'Admin' || userType === 'Enseignant')) ||
      (requiredPermission.includes('Events') && (userType === 'Admin' || userType === 'Enseignant')) ||
      (requiredPermission.includes('Admin') && userType === 'Admin');

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