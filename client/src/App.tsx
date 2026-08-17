import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import DashboardLayout from "./components/layout/DashboardLayout";
import DashboardPage from "./pages/DashboardPage";
import AuditProgramPage from "./pages/AuditProgramPage";
import AuditsPage from "./pages/AuditsPage";
import ChecklistPage from "./pages/ChecklistPage";
import FindingsPage from "./pages/FindingsPage";
import CapaPage from "./pages/CapaPage";
import RisksPage from "./pages/RisksPage";
import EvidencePage from "./pages/EvidencePage";
import AssetsPage from "./pages/AssetsPage";
import ReportsPage from "./pages/ReportsPage";
import UsersPage from "./pages/UsersPage";
import SettingsPage from "./pages/SettingsPage";
import LoginPage from "./pages/LoginPage";
import ProtectedRoute from "./components/layout/ProtectedRoute";
import { AuthProvider } from "./context/AuthContext";

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter basename="/is-audit">
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route element={<ProtectedRoute />}>
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            <Route element={<DashboardLayout />}>
              <Route path="/dashboard" element={<DashboardPage />} />
              <Route path="/audit-program" element={<AuditProgramPage />} />
              <Route path="/audits" element={<AuditsPage />} />
              <Route path="/checklist" element={<ChecklistPage />} />
              <Route path="/findings" element={<FindingsPage />} />
              <Route path="/capa" element={<CapaPage />} />
              <Route path="/risks" element={<RisksPage />} />
              <Route path="/evidence" element={<EvidencePage />} />
              <Route path="/assets" element={<AssetsPage />} />
              <Route path="/reports" element={<ReportsPage />} />
              <Route path="/users" element={<UsersPage />} />
              <Route path="/settings" element={<SettingsPage />} />
            </Route>
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
