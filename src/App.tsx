import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AppProvider, useApp } from "./context/AppContext";
import Layout from "./components/Layout";
import LoginPage from "./pages/LoginPage";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminSchedule from "./pages/admin/AdminSchedule";
import AdminChat from "./pages/admin/AdminChat";
import AdminFinancial from "./pages/admin/AdminFinancial";
import AdminReports from "./pages/admin/AdminReports";
import AdminClients from "./pages/admin/AdminClients";
import ClientDashboard from "./pages/client/ClientDashboard";
import ClientSchedule from "./pages/client/ClientSchedule";
import ClientChat from "./pages/client/ClientChat";
import ClientPayments from "./pages/client/ClientPayments";

function ProtectedRoute({ children, role }: { children: React.ReactNode; role: "admin" | "client" }) {
  const { currentUser } = useApp();
  if (!currentUser) return <Navigate to="/" replace />;
  if (currentUser.role !== role) return <Navigate to="/" replace />;
  return <Layout>{children}</Layout>;
}

function AppRoutes() {
  const { currentUser } = useApp();

  return (
    <Routes>
      <Route path="/" element={
        currentUser ? (
          currentUser.role === "admin" ? <Navigate to="/admin" replace /> : <Navigate to="/cliente" replace />
        ) : <LoginPage />
      } />
      
      {/* Admin Routes */}
      <Route path="/admin" element={<ProtectedRoute role="admin"><AdminDashboard /></ProtectedRoute>} />
      <Route path="/admin/agendamentos" element={<ProtectedRoute role="admin"><AdminSchedule /></ProtectedRoute>} />
      <Route path="/admin/chat" element={<ProtectedRoute role="admin"><AdminChat /></ProtectedRoute>} />
      <Route path="/admin/financeiro" element={<ProtectedRoute role="admin"><AdminFinancial /></ProtectedRoute>} />
      <Route path="/admin/relatorios" element={<ProtectedRoute role="admin"><AdminReports /></ProtectedRoute>} />
      <Route path="/admin/clientes" element={<ProtectedRoute role="admin"><AdminClients /></ProtectedRoute>} />
      
      {/* Client Routes */}
      <Route path="/cliente" element={<ProtectedRoute role="client"><ClientDashboard /></ProtectedRoute>} />
      <Route path="/cliente/agendar" element={<ProtectedRoute role="client"><ClientSchedule /></ProtectedRoute>} />
      <Route path="/cliente/chat" element={<ProtectedRoute role="client"><ClientChat /></ProtectedRoute>} />
      <Route path="/cliente/pagamentos" element={<ProtectedRoute role="client"><ClientPayments /></ProtectedRoute>} />
      
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AppProvider>
        <AppRoutes />
      </AppProvider>
    </BrowserRouter>
  );
}
