import { ReactNode } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, Users, School, Bell, Calendar, Database, Clock, LogOut, User, BarChart3 } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import ThemeToggle from './ui/ThemeToggle';

interface LayoutProps {
  children: ReactNode;
  pageTitle?: string;
  breadcrumb?: ReactNode;
}

export default function Layout({ children, pageTitle = 'Tableau de bord', breadcrumb }: LayoutProps) {
  const location = useLocation();
  const { user, logout } = useAuth();

  const isActive = (path: string) => {
    if (path === '/') return location.pathname === '/';
    return location.pathname.startsWith(path);
  };

  const formatDateTime = () => {
    const now = new Date();
    return now.toLocaleDateString('fr-FR') + ' ' + now.toLocaleTimeString('fr-FR', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-900">
      {/* Sidebar */}
      <div className="w-64 bg-white dark:bg-gray-800 shadow-lg">
        <div className="p-6">
          <Link to="/" className="text-xl font-bold text-gai-blue dark:text-blue-400">
            GAI Hygiène
          </Link>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Complexe Scolaire</p>
        </div>
        
        <nav className="mt-6">
          <div className="px-6 py-2">
            <h3 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              Navigation
            </h3>
          </div>
          
          <Link
            to="/"
            className={`flex items-center px-6 py-3 transition-colors ${
              isActive('/') && location.pathname === '/'
                ? 'bg-gai-blue text-white' 
                : 'text-gray-700 dark:text-gray-300 hover:bg-gai-blue hover:text-white'
            }`}
          >
            <Home className="w-5 h-5 mr-3" />
            Tableau de Bord
          </Link>
          
          <div className="px-6 py-2 mt-4">
            <h3 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              Gestion
            </h3>
          </div>
          
          <Link
            to="/users"
            className={`flex items-center px-6 py-3 transition-colors ${
              isActive('/users')
                ? 'bg-gai-blue text-white' 
                : 'text-gray-700 dark:text-gray-300 hover:bg-gai-blue hover:text-white'
            }`}
          >
            <Users className="w-5 h-5 mr-3" />
            Utilisateurs
          </Link>
          
          <Link
            to="/classes"
            className={`flex items-center px-6 py-3 transition-colors ${
              isActive('/classes')
                ? 'bg-gai-blue text-white' 
                : 'text-gray-700 dark:text-gray-300 hover:bg-gai-blue hover:text-white'
            }`}
          >
            <School className="w-5 h-5 mr-3" />
            Classes
          </Link>
          
          <Link
            to="/reminders"
            className={`flex items-center px-6 py-3 transition-colors ${
              isActive('/reminders')
                ? 'bg-gai-blue text-white' 
                : 'text-gray-700 dark:text-gray-300 hover:bg-gai-blue hover:text-white'
            }`}
          >
            <Bell className="w-5 h-5 mr-3" />
            Rappels
          </Link>
          
          <Link
            to="/notifications"
            className={`flex items-center px-6 py-3 transition-colors ${
              isActive('/notifications')
                ? 'bg-gai-blue text-white' 
                : 'text-gray-700 dark:text-gray-300 hover:bg-gai-blue hover:text-white'
            }`}
          >
            <Bell className="w-5 h-5 mr-3" />
            Notifications
          </Link>
          
          <Link
            to="/reports"
            className={`flex items-center px-6 py-3 transition-colors ${
              isActive('/reports')
                ? 'bg-gai-blue text-white' 
                : 'text-gray-700 dark:text-gray-300 hover:bg-gai-blue hover:text-white'
            }`}
          >
            <BarChart3 className="w-5 h-5 mr-3" />
            Rapports
          </Link>
          
          <Link
            to="/events"
            className={`flex items-center px-6 py-3 transition-colors ${
              isActive('/events')
                ? 'bg-gai-blue text-white' 
                : 'text-gray-700 dark:text-gray-300 hover:bg-gai-blue hover:text-white'
            }`}
          >
            <Calendar className="w-5 h-5 mr-3" />
            Programmation
          </Link>
          
          <div className="px-6 py-2 mt-4">
            <h3 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              Administration
            </h3>
          </div>
          
          <Link
            to="/admin"
            className={`flex items-center px-6 py-3 transition-colors ${
              isActive('/admin')
                ? 'bg-gai-blue text-white' 
                : 'text-gray-700 dark:text-gray-300 hover:bg-gai-blue hover:text-white'
            }`}
          >
            <Database className="w-5 h-5 mr-3" />
            Base de données
          </Link>
        </nav>
      </div>
      
      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Header */}
        <header className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
          <div className="px-6 py-4">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-semibold text-gray-800 dark:text-gray-100">{pageTitle}</h1>
                {breadcrumb && (
                  <nav className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                    {breadcrumb}
                  </nav>
                )}
              </div>
              <div className="flex items-center space-x-4">
                <ThemeToggle />
                <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                  <Clock className="w-4 h-4 mr-2" />
                  {formatDateTime()}
                </div>
                
                {/* User Info & Logout */}
                <div className="flex items-center space-x-3">
                  <div className="flex items-center text-sm text-gray-600 dark:text-gray-300">
                    <User className="w-4 h-4 mr-2" />
                    <span>{user?.prenom} {user?.nom}</span>
                    <span className="ml-2 px-2 py-1 bg-gai-blue text-white text-xs rounded-full">
                      {user?.type_utilisateur}
                    </span>
                  </div>
                  <button
                    onClick={logout}
                    className="flex items-center px-3 py-2 text-sm text-gray-600 dark:text-gray-300 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-md transition-colors"
                    title="Se déconnecter"
                  >
                    <LogOut className="w-4 h-4 mr-1" />
                    Déconnexion
                  </button>
                </div>
              </div>
            </div>
          </div>
        </header>
        
        {/* Page Content */}
        <main className="flex-1 overflow-y-auto p-6">
          {children}
        </main>
      </div>
    </div>
  );
}