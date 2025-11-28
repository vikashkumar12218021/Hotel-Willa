import { Route, Routes } from 'react-router-dom'
import './App.css'
import { Layout } from './components/layout/Layout'
import { HomePage } from './pages/HomePage'
import { RoomsPage } from './pages/RoomsPage'
import { RoomDetailPage } from './pages/RoomDetailPage'
import { TablesPage } from './pages/TablesPage'
import { TableDetailPage } from './pages/TableDetailPage'
import { ResortsPage } from './pages/ResortsPage'
import { ResortDetailPage } from './pages/ResortDetailPage'
import { PlanesPage } from './pages/PlanesPage'
import { PlaneDetailPage } from './pages/PlaneDetailPage'
import { OccasionsPage } from './pages/OccasionsPage'
import { AdminDashboardPage } from './pages/AdminDashboardPage'
import { LoginPage } from './pages/LoginPage'
import { RegisterPage } from './pages/RegisterPage'
import { ProfilePage } from './pages/ProfilePage'
import { NotFoundPage } from './pages/NotFoundPage'
import { ProtectedRoute } from './components/routing/ProtectedRoute'

function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<HomePage />} />
        <Route path="rooms" element={<RoomsPage />} />
        <Route path="rooms/:id" element={<RoomDetailPage />} />
        <Route path="tables" element={<TablesPage />} />
        <Route path="tables/:id" element={<TableDetailPage />} />
        <Route path="resorts" element={<ResortsPage />} />
        <Route path="resorts/:id" element={<ResortDetailPage />} />
        <Route path="planes" element={<PlanesPage />} />
        <Route path="planes/:id" element={<PlaneDetailPage />} />
        <Route path="occasions" element={<OccasionsPage />} />
        <Route
          path="admin"
          element={
            <ProtectedRoute requireAdmin>
              <AdminDashboardPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="profile"
          element={
            <ProtectedRoute>
              <ProfilePage />
            </ProtectedRoute>
          }
        />
        <Route path="login" element={<LoginPage />} />
        <Route path="register" element={<RegisterPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  )
}

export default App
