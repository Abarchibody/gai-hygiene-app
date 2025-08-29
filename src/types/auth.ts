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
  canEditUsers: boolean;
  canViewUsers: boolean;
  canManageClasses: boolean;
  canViewClasses: boolean;
  canCreateReminders: boolean;
  canViewReports: boolean;
  canViewEvents: boolean;
  canCreateEvents: boolean;
  canAccessAdmin: boolean;
  canManageSystem: boolean;
}

export const getRoleByUserType = (type: string): UserRole => {
  switch (type) {
    case 'Admin':
      return {
        canCreateUsers: true,
        canEditUsers: true,
        canViewUsers: true,
        canManageClasses: true,
        canViewClasses: true,
        canCreateReminders: true,
        canViewReports: true,
        canViewEvents: true,
        canCreateEvents: true,
        canAccessAdmin: true,
        canManageSystem: true
      };
    case 'Enseignant':
      return {
        canCreateUsers: false,
        canEditUsers: false,
        canViewUsers: true,
        canManageClasses: true,
        canViewClasses: true,
        canCreateReminders: true,
        canViewReports: true,
        canViewEvents: true,
        canCreateEvents: true,
        canAccessAdmin: false,
        canManageSystem: false
      };
    case 'Parent':
      return {
        canCreateUsers: false,
        canEditUsers: false,
        canViewUsers: false,
        canManageClasses: false,
        canViewClasses: false,
        canCreateReminders: false,
        canViewReports: true,
        canViewEvents: false,
        canCreateEvents: false,
        canAccessAdmin: false,
        canManageSystem: false
      };
    case 'Élève':
      return {
        canCreateUsers: false,
        canEditUsers: false,
        canViewUsers: false,
        canManageClasses: false,
        canViewClasses: false,
        canCreateReminders: false,
        canViewReports: false,
        canViewEvents: false,
        canCreateEvents: false,
        canAccessAdmin: false,
        canManageSystem: false
      };
    default:
      return {
        canCreateUsers: false,
        canEditUsers: false,
        canViewUsers: false,
        canManageClasses: false,
        canViewClasses: false,
        canCreateReminders: false,
        canViewReports: false,
        canViewEvents: false,
        canCreateEvents: false,
        canAccessAdmin: false,
        canManageSystem: false
      };
  }
};