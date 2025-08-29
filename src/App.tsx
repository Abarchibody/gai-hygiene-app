import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
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
import DataManager from './pages/Admin/DataManager';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={
          <Layout pageTitle="Tableau de Bord">
            <Dashboard />
          </Layout>
        } />
        <Route path="/users" element={
          <Layout pageTitle="Utilisateurs">
            <UsersList />
          </Layout>
        } />
        <Route path="/users/create" element={
          <Layout pageTitle="Créer un utilisateur">
            <CreateUser />
          </Layout>
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
        <Route path="/admin" element={
          <Layout pageTitle="Administration">
            <DataManager />
          </Layout>
        } />
      </Routes>
    </Router>
  )
}

export default App