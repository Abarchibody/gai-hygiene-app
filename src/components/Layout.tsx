import { ReactNode, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, Users, School, Bell, Calendar, Database, Clock, LogOut, User, BarChart3, Menu, X } from 'lucide-react';
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
  const [sidebarOpen, setSidebarOpen] = useState(false);

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
      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 z-40 bg-black bg-opacity-50 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
      
      {/* Sidebar */}
      <div className={`fixed inset-y-0 left-0 z-50 w-64 bg-white dark:bg-gray-800 shadow-lg transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0 ${
        sidebarOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
        <div className="flex items-center justify-between p-4 lg:p-6">
          <div>
            <Link to="/" className="text-lg lg:text-xl font-bold text-gai-blue dark:text-blue-400">
              GAI Hygiène
            </Link>
            <p className="text-xs lg:text-sm text-gray-500 dark:text-gray-400 mt-1">Complexe Scolaire</p>
          </div>
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden p-2 rounded-md text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <nav className="mt-6">
          <div className="px-6 py-2">
            <h3 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              Navigation
            </h3>
          </div>
          
          <Link
            to="/"
            onClick={() => setSidebarOpen(false)}
            className={`flex items-center px-4 lg:px-6 py-3 transition-colors ${
              isActive('/') && location.pathname === '/'
                ? 'bg-gai-blue text-white' 
                : 'text-gray-700 dark:text-gray-300 hover:bg-gai-blue hover:text-white'
            }`}
          >
            <Home className="w-5 h-5 mr-3" />
            <span className="text-sm lg:text-base">Tableau de Bord</span>
          </Link>
          
          <div className="px-6 py-2 mt-4">
            <h3 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              Gestion
            </h3>
          </div>
          
          {user?.role.canViewUsers && (
            <Link
              to="/users"
              onClick={() => setSidebarOpen(false)}
              className={`flex items-center px-4 lg:px-6 py-3 transition-colors ${
                isActive('/users')
                  ? 'bg-gai-blue text-white' 
                  : 'text-gray-700 dark:text-gray-300 hover:bg-gai-blue hover:text-white'
              }`}
            >
              <Users className="w-5 h-5 mr-3" />
              <span className="text-sm lg:text-base">Utilisateurs</span>
            </Link>
          )}
          
          {user?.role.canViewClasses && (
            <Link
              to="/classes"
              onClick={() => setSidebarOpen(false)}
              className={`flex items-center px-4 lg:px-6 py-3 transition-colors ${
                isActive('/classes')
                  ? 'bg-gai-blue text-white' 
                  : 'text-gray-700 dark:text-gray-300 hover:bg-gai-blue hover:text-white'
              }`}
            >
              <School className="w-5 h-5 mr-3" />
              <span className="text-sm lg:text-base">Classes</span>
            </Link>
          )}
          
          <Link
            to="/reminders"
            onClick={() => setSidebarOpen(false)}
            className={`flex items-center px-4 lg:px-6 py-3 transition-colors ${
              isActive('/reminders')
                ? 'bg-gai-blue text-white' 
                : 'text-gray-700 dark:text-gray-300 hover:bg-gai-blue hover:text-white'
            }`}
          >
            <Bell className="w-5 h-5 mr-3" />
            <span className="text-sm lg:text-base">Rappels</span>
          </Link>
          
          <Link
            to="/notifications"
            onClick={() => setSidebarOpen(false)}
            className={`flex items-center px-4 lg:px-6 py-3 transition-colors ${
              isActive('/notifications')
                ? 'bg-gai-blue text-white' 
                : 'text-gray-700 dark:text-gray-300 hover:bg-gai-blue hover:text-white'
            }`}
          >
            <Bell className="w-5 h-5 mr-3" />
            <span className="text-sm lg:text-base">Notifications</span>
          </Link>
          
          <Link
            to="/reports"
            onClick={() => setSidebarOpen(false)}
            className={`flex items-center px-4 lg:px-6 py-3 transition-colors ${
              isActive('/reports')
                ? 'bg-gai-blue text-white' 
                : 'text-gray-700 dark:text-gray-300 hover:bg-gai-blue hover:text-white'
            }`}
          >
            <BarChart3 className="w-5 h-5 mr-3" />
            <span className="text-sm lg:text-base">Rapports</span>
          </Link>
          
          <Link
            to="/events"
            onClick={() => setSidebarOpen(false)}
            className={`flex items-center px-4 lg:px-6 py-3 transition-colors ${
              isActive('/events')
                ? 'bg-gai-blue text-white' 
                : 'text-gray-700 dark:text-gray-300 hover:bg-gai-blue hover:text-white'
            }`}
          >
            <Calendar className="w-5 h-5 mr-3" />
            <span className="text-sm lg:text-base">Programmation</span>
          </Link>
          
          
          {user?.role.canAccessAdmin && (
            <>
              <div className="px-6 py-2 mt-4">
                <h3 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Administration
                </h3>
              </div>
              
              <Link
                to="/admin"
                onClick={() => setSidebarOpen(false)}
                className={`flex items-center px-4 lg:px-6 py-3 transition-colors ${
                  isActive('/admin')
                    ? 'bg-gai-blue text-white' 
                    : 'text-gray-700 dark:text-gray-300 hover:bg-gai-blue hover:text-white'
                }`}
              >
                <Database className="w-5 h-5 mr-3" />
                <span className="text-sm lg:text-base">Base de données</span>
              </Link>
            </>
          )}
        </nav>
      </div>
      
      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden lg:ml-0">
        {/* Top Header */}
        <header className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
          <div className="px-4 lg:px-6 py-3 lg:py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <button
                  onClick={() => setSidebarOpen(true)}
                  className="lg:hidden p-2 rounded-md text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 mr-3"
                >
                  <Menu className="w-5 h-5" />
                </button>
                <div>
                  <h1 className="text-lg lg:text-2xl font-semibold text-gray-800 dark:text-gray-100">{pageTitle}</h1>
                  {breadcrumb && (
                    <nav className="text-xs lg:text-sm text-gray-500 dark:text-gray-400 mt-1">
                      {breadcrumb}
                    </nav>
                  )}
                </div>
              </div>
              <div className="flex items-center space-x-2 lg:space-x-4">
                <ThemeToggle />
                <div className="hidden md:flex items-center text-xs lg:text-sm text-gray-500 dark:text-gray-400">
                  <Clock className="w-3 lg:w-4 h-3 lg:h-4 mr-1 lg:mr-2" />
                  <span className="hidden lg:inline">{formatDateTime()}</span>
                  <span className="lg:hidden">{new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}</span>
                </div>
                
                {/* User Info & Logout */}
                <div className="flex items-center space-x-2 lg:space-x-3">
                  <Link 
                    to="/profile"
                    className="hidden sm:flex items-center text-xs lg:text-sm text-gray-600 dark:text-gray-300 hover:text-gai-blue transition-colors"
                  >
                    <User className="w-3 lg:w-4 h-3 lg:h-4 mr-1 lg:mr-2" />
                    <span className="hidden md:inline">{user?.prenom} {user?.nom}</span>
                    <span className="md:hidden">{user?.prenom}</span>
                    <span className="ml-1 lg:ml-2 px-1 lg:px-2 py-1 bg-gai-blue text-white text-xs rounded-full">
                      {user?.type_utilisateur}
                    </span>
                  </Link>
                  <button
                    onClick={logout}
                    className="flex items-center px-2 lg:px-3 py-2 text-xs lg:text-sm text-gray-600 dark:text-gray-300 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-md transition-colors"
                    title="Se déconnecter"
                  >
                    <LogOut className="w-3 lg:w-4 h-3 lg:h-4 mr-0 lg:mr-1" />
                    <span className="hidden lg:inline">Déconnexion</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </header>
        
        {/* Page Content */}
        <main className="flex-1 overflow-y-auto p-4 lg:p-6">
          {children}
        </main>
      </div>
    </div>
  );
}