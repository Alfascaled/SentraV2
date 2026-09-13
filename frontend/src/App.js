import "@/App.css";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "@/components/ui/sonner";
import { AuthProvider, useAuth } from "@/context/AuthContext";
import Home from "@/pages/Home";
import AdminLogin from "@/pages/admin/AdminLogin";
import AdminLayout from "@/pages/admin/AdminLayout";
import Dashboard from "@/pages/admin/Dashboard";
import SettingsPage from "@/pages/admin/SettingsPage";
import CrudPage from "@/pages/admin/CrudPage";
import RegistrationsPage from "@/pages/admin/RegistrationsPage";

const Protected = ({ children }) => {
  const { user } = useAuth();
  if (user === null) return <div className="grid min-h-screen place-items-center bg-[#F8FAFC] text-navy">Memeriksa sesi...</div>;
  if (user === false) return <Navigate to="/admin/login" replace />;
  return children;
};

function App() {
  return (
    <div className="App">
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route path="/admin" element={<Protected><AdminLayout /></Protected>}>
              <Route index element={<Dashboard />} />
              <Route path="settings" element={<SettingsPage />} />
              <Route path="content/:collection" element={<CrudPage />} />
              <Route path="registrations" element={<RegistrationsPage />} />
            </Route>
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </BrowserRouter>
        <Toaster position="top-right" richColors />
      </AuthProvider>
    </div>
  );
}

export default App;
