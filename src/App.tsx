import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useEffect } from 'react';
import { AuthProvider } from './contexts/AuthContext';
import { ThemeProvider } from './contexts/ThemeContext';
import ProtectedRoute from './components/ProtectedRoute';
import Layout from './components/Layout';
import { pwaService } from './utils/pwaService';
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
import DataManager from './pages/Admin/DataManager';
import SystemStatus from './pages/Admin/SystemStatus';

function App() {
  useEffect(() => {
    // Enregistrer le Service Worker au démarrage
    pwaService.registerServiceWorker();
  }, []);

  return (
    <ThemeProvider>
      <AuthProvider>
        <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/" element={
            <ProtectedRoute>
              <Layout pageTitle="Tableau de Bord">
                <Dashboard />
              </Layout>
            </ProtectedRoute>
          } />
        <Route path="/users" element={
          <Layout pageTitle="Utilisateurs">
            <UsersList />
          </Layout>
        } />
          <Route path="/users/create" element={
            <ProtectedRoute requiredPermission="canCreateUsers">
              <Layout pageTitle="Créer un utilisateur">
                <CreateUser />
              </Layout>
            </ProtectedRoute>
          } />
        <Route path="/users/:id" element={
          <Layout pageTitle="Détail utilisateur">
            <UserDetail />
          </Layout>
        } />
        <Route path="/users/:id/edit" element={
          <Layout pageTitle="Modifier utilisateur">
            <EditUser />
          </Layout>
        } />
        <Route path="/users/:id/assign-parent" element={
          <Layout pageTitle="Assigner un parent">
            <AssignParent />
          </Layout>
        } />
        <Route path="/classes" element={
          <Layout pageTitle="Classes">
            <ClassesList />
          </Layout>
        } />
        <Route path="/classes/create" element={
          <Layout pageTitle="Créer une classe">
            <CreateClass />
          </Layout>
        } />
        <Route path="/classes/:id" element={
          <Layout pageTitle="Détail classe">
            <ClassDetail />
          </Layout>
        } />
        <Route path="/classes/:id/edit" element={
          <Layout pageTitle="Modifier classe">
            <EditClass />
          </Layout>
        } />
        <Route path="/classes/:id/assign-students" element={
          <Layout pageTitle="Assigner des élèves">
            <AssignStudents />
          </Layout>
        } />
        <Route path="/reminders" element={
          <Layout pageTitle="Rappels d'hygiène">
            <RemindersList />
          </Layout>
        } />
        <Route path="/reminders/create" element={
          <Layout pageTitle="Créer un rappel">
            <CreateReminder />
          </Layout>
        } />
        <Route path="/reminders/:id" element={
          <Layout pageTitle="Détail rappel">
            <ReminderDetail />
          </Layout>
        } />
        <Route path="/reminders/:id/edit" element={
          <Layout pageTitle="Modifier rappel">
            <EditReminder />
          </Layout>
        } />
        <Route path="/reminders/:id/assign" element={
          <Layout pageTitle="Assigner rappel">
            <AssignReminder />
          </Layout>
        } />
        <Route path="/notifications" element={
          <Layout pageTitle="Centre de notifications">
            <NotificationCenter />
          </Layout>
        } />
        <Route path="/admin" element={
          <Layout pageTitle="Administration">
            <div className="space-y-6">
              <SystemStatus />
              <DataManager />
            </div>
          </Layout>
        } />
        </Routes>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  )
}

export default App