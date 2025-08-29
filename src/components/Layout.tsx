import { ReactNode } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, Users, School, Bell, Calendar, Database, Clock } from 'lucide-react';

interface LayoutProps {
  children: ReactNode;
  pageTitle?: string;
  breadcrumb?: ReactNode;
}

export default function Layout({ children, pageTitle = 'Tableau de bord', breadcrumb }: LayoutProps) {
  const location = useLocation();

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
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <div className="w-64 bg-white shadow-lg">
        <div className="p-6">
          <Link to="/" className="text-xl font-bold text-gai-blue">
            GAI Hygiène
          </Link>
          <p className="text-sm text-gray-500 mt-1">Complexe Scolaire</p>
        </div>
        
        <nav className="mt-6">
          <div className="px-6 py-2">
            <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
              Navigation
            </h3>
          </div>
          
          <Link
            to="/"
            className={`flex items-center px-6 py-3 transition-colors ${
              isActive('/') && location.pathname === '/'
                ? 'bg-gai-blue text-white' 
                : 'text-gray-700 hover:bg-gai-blue hover:text-white'
            }`}
          >
            <Home className="w-5 h-5 mr-3" />
            Tableau de Bord
          </Link>
          
          <div className="px-6 py-2 mt-4">
            <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
              Gestion
            </h3>
          </div>
          
          <Link
            to="/users"
            className={`flex items-center px-6 py-3 transition-colors ${
              isActive('/users')
                ? 'bg-gai-blue text-white' 
                : 'text-gray-700 hover:bg-gai-blue hover:text-white'
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
                : 'text-gray-700 hover:bg-gai-blue hover:text-white'
            }`}
          >
            <School className="w-5 h-5 mr-3" />
            Classes
          </Link>
          
          <div className="flex items-center px-6 py-3 text-gray-400 cursor-not-allowed">
            <Bell className="w-5 h-5 mr-3" />
            Rappels
            <span className="ml-auto text-xs bg-gai-orange text-white px-2 py-1 rounded-full">
              Bientôt
            </span>
          </div>
          
          <div className="flex items-center px-6 py-3 text-gray-400 cursor-not-allowed">
            <Calendar className="w-5 h-5 mr-3" />
            Programmation
            <span className="ml-auto text-xs bg-gai-orange text-white px-2 py-1 rounded-full">
              Bientôt
            </span>
          </div>
          
          <div className="px-6 py-2 mt-4">
            <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
              Administration
            </h3>
          </div>
          
          <Link
            to="/admin"
            className={`flex items-center px-6 py-3 transition-colors ${
              isActive('/admin')
                ? 'bg-gai-blue text-white' 
                : 'text-gray-700 hover:bg-gai-blue hover:text-white'
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
        <header className="bg-white shadow-sm border-b border-gray-200">
          <div className="px-6 py-4">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-semibold text-gray-800">{pageTitle}</h1>
                {breadcrumb && (
                  <nav className="text-sm text-gray-500 mt-1">
                    {breadcrumb}
                  </nav>
                )}
              </div>
              <div className="flex items-center space-x-4">
                <div className="flex items-center text-sm text-gray-500">
                  <Clock className="w-4 h-4 mr-2" />
                  {formatDateTime()}
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