import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useEffect } from 'react';
import { AuthProvider } from './contexts/AuthContext';
import { ThemeProvider } from './contexts/ThemeContext';
import ProtectedRoute from './components/ProtectedRoute';
import Layout from './components/Layout';
import { pwaService } from './utils/pwaService';
import { notificationService } from './utils/notificationService';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import UsersList from './pages/Users/UsersList';
import CreateUser from './pages/Users/CreateUser';
import UserDetail from './pages/Users/UserDetail';
import EditUser from './pages/Users/EditUser';
import AssignParent from './pages/Users/AssignParent';
import ClassesList from './pages/Classes/ClassesList';
import CreateClass from './pages/Classes/CreateClass';
import ClassDetail from './pages/Classes/ClassDetail';
import EditClass from './pages/Classes/EditClass';
import AssignStudents from './pages/Classes/AssignStudents';
import RemindersList from './pages/Reminders/RemindersList';
import CreateReminder from './pages/Reminders/CreateReminder';
import ReminderDetail from './pages/Reminders/ReminderDetail';
import EditReminder from './pages/Reminders/EditReminder';
import AssignReminder from './pages/Reminders/AssignReminder';
import NotificationCenter from './pages/Notifications/NotificationCenter';
import ReportsPage from './pages/Reports/ReportsPage';
import EventsPage from './pages/Events/EventsPage';
import CreateEvent from './pages/Events/CreateEvent';
import EventDetail from './pages/Events/EventDetail';
import DataManager from './pages/Admin/DataManager';
import SystemStatus from './pages/Admin/SystemStatus';
import BackupManager from './pages/Admin/BackupManager';
import SyncManager from './pages/Admin/SyncManager';
import ChangePassword from './pages/Users/ChangePassword';
import ProfilePage from './pages/ProfilePage';

function App() {
  useEffect(() => {
    // Enregistrer le Service Worker au démarrage
    pwaService.registerServiceWorker();
    
    // Démarrer le planificateur de notifications
    notificationService.startNotificationScheduler();
    
    // Initialiser le service de sauvegarde
    console.log('💾 Service de sauvegarde initialisé');
  }, []);

  return (
    <ThemeProvider>
      <AuthProvider>
        <Router>
          <Routes>
            <Route path='/login' element={<Login />} />
            <Route
              path='/'
              element={
                <ProtectedRoute>
                  <Layout pageTitle='Tableau de Bord'>
                    <Dashboard />
                  </Layout>
                </ProtectedRoute>
              }
            />
            <Route
              path='/users'
              element={
                <ProtectedRoute requiredPermission='canViewUsers'>
                  <Layout pageTitle='Utilisateurs'>
                    <UsersList />
                  </Layout>
                </ProtectedRoute>
              }
            />
            <Route
              path='/users/create'
              element={
                <ProtectedRoute requiredPermission='canCreateUsers'>
                  <Layout pageTitle='Créer un utilisateur'>
                    <CreateUser />
                  </Layout>
                </ProtectedRoute>
              }
            />
            <Route
              path='/users/:id'
              element={
                <ProtectedRoute>
                  <Layout pageTitle='Détail utilisateur'>
                    <UserDetail />
                  </Layout>
                </ProtectedRoute>
              }
            />
            <Route
              path='/users/:id/edit'
              element={
                <ProtectedRoute requiredPermission='canEditUsers'>
                  <Layout pageTitle='Modifier utilisateur'>
                    <EditUser />
                  </Layout>
                </ProtectedRoute>
              }
            />
            <Route
              path='/users/:id/assign-parent'
              element={
                <ProtectedRoute>
                  <Layout pageTitle='Assigner un parent'>
                    <AssignParent />
                  </Layout>
                </ProtectedRoute>
              }
            />
            <Route
              path='/users/:id/change-password'
              element={
                <ProtectedRoute>
                  <Layout pageTitle='Changer le mot de passe'>
                    <ChangePassword />
                  </Layout>
                </ProtectedRoute>
              }
            />
            <Route
              path='/classes'
              element={
                <ProtectedRoute requiredPermission='canViewClasses'>
                  <Layout pageTitle='Classes'>
                    <ClassesList />
                  </Layout>
                </ProtectedRoute>
              }
            />
            <Route
              path='/classes/create'
              element={
                <ProtectedRoute requiredPermission='canManageClasses'>
                  <Layout pageTitle='Créer une classe'>
                    <CreateClass />
                  </Layout>
                </ProtectedRoute>
              }
            />
            <Route
              path='/classes/:id'
              element={
                <ProtectedRoute requiredPermission='canViewClasses'>
                  <Layout pageTitle='Détail classe'>
                    <ClassDetail />
                  </Layout>
                </ProtectedRoute>
              }
            />
            <Route
              path='/classes/:id/edit'
              element={
                <ProtectedRoute requiredPermission='canManageClasses'>
                  <Layout pageTitle='Modifier classe'>
                    <EditClass />
                  </Layout>
                </ProtectedRoute>
              }
            />
            <Route
              path='/classes/:id/assign-students'
              element={
                <ProtectedRoute>
                  <Layout pageTitle='Assigner des élèves'>
                    <AssignStudents />
                  </Layout>
                </ProtectedRoute>
              }
            />
            <Route
              path='/reminders'
              element={
                <ProtectedRoute>
                  <Layout pageTitle='Rappels'>
                    <RemindersList />
                  </Layout>
                </ProtectedRoute>
              }
            />
            <Route
              path='/reminders/create'
              element={
                <ProtectedRoute requiredPermission='canCreateReminders'>
                  <Layout pageTitle='Créer un rappel'>
                    <CreateReminder />
                  </Layout>
                </ProtectedRoute>
              }
            />
            <Route
              path='/reminders/:id'
              element={
                <ProtectedRoute>
                  <Layout pageTitle='Détail rappel'>
                    <ReminderDetail />
                  </Layout>
                </ProtectedRoute>
              }
            />
            <Route
              path='/reminders/:id/edit'
              element={
                <ProtectedRoute>
                  <Layout pageTitle='Modifier rappel'>
                    <EditReminder />
                  </Layout>
                </ProtectedRoute>
              }
            />
            <Route
              path='/reminders/:id/assign'
              element={
                <ProtectedRoute>
                  <Layout pageTitle='Assigner rappel'>
                    <AssignReminder />
                  </Layout>
                </ProtectedRoute>
              }
            />
            <Route
              path='/notifications'
              element={
                <ProtectedRoute>
                  <Layout pageTitle='Notifications'>
                    <NotificationCenter />
                  </Layout>
                </ProtectedRoute>
              }
            />
            <Route
              path='/reports'
              element={
                <ProtectedRoute requiredPermission='canViewReports'>
                  <Layout pageTitle='Rapports'>
                    <ReportsPage />
                  </Layout>
                </ProtectedRoute>
              }
            />
            <Route
              path='/events'
              element={
                <ProtectedRoute requiredPermission='canViewEvents'>
                  <Layout pageTitle='Programmation'>
                    <EventsPage />
                  </Layout>
                </ProtectedRoute>
              }
            />
            <Route
              path='/events/create'
              element={
                <ProtectedRoute requiredPermission='canCreateEvents'>
                  <Layout pageTitle='Nouvel événement'>
                    <CreateEvent />
                  </Layout>
                </ProtectedRoute>
              }
            />
            <Route
              path='/events/:id'
              element={
                <ProtectedRoute requiredPermission='canViewEvents'>
                  <Layout pageTitle='Détail événement'>
                    <EventDetail />
                  </Layout>
                </ProtectedRoute>
              }
            />
            <Route
              path='/profile'
              element={
                <ProtectedRoute>
                  <Layout pageTitle='Mon Profil'>
                    <ProfilePage />
                  </Layout>
                </ProtectedRoute>
              }
            />
            <Route
              path='/admin'
              element={
                <ProtectedRoute requiredPermission='canAccessAdmin'>
                  <Layout pageTitle='Administration'>
                    <div className='space-y-6'>
                      <SystemStatus />
                      <SyncManager />
                      <DataManager />
                      <BackupManager />
                    </div>
                  </Layout>
                </ProtectedRoute>
              }
            />
          </Routes>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
