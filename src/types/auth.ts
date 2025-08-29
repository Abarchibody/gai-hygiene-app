export interface AuthUser {
  id: number;
  email: string;
  nom: string;
  prenom: string;
  type_utilisateur: 'Élève' | 'Parent' | 'Enseignant' | 'Admin';
  role: UserRole;
}

export interface UserRole {
  canCreateUsers: boolean;
  canManageClasses: boolean;
  canCreateReminders: boolean;
  canViewReports: boolean;
  canManageSystem: boolean;
}

export const getRoleByUserType = (type: string): UserRole => {
  switch (type) {
    case 'Admin':
      return {
        canCreateUsers: true,
        canManageClasses: true,
        canCreateReminders: true,
        canViewReports: true,
        canManageSystem: true
      };
    case 'Enseignant':
      return {
        canCreateUsers: false,
        canManageClasses: true,
        canCreateReminders: true,
        canViewReports: true,
        canManageSystem: false
      };
    case 'Parent':
      return {
        canCreateUsers: false,
        canManageClasses: false,
        canCreateReminders: false,
        canViewReports: false,
        canManageSystem: false
      };
    case 'Élève':
      return {
        canCreateUsers: false,
        canManageClasses: false,
        canCreateReminders: false,
        canViewReports: false,
        canManageSystem: false
      };
    default:
      return {
        canCreateUsers: false,
        canManageClasses: false,
        canCreateReminders: false,
        canViewReports: false,
        canManageSystem: false
      };
  }
};