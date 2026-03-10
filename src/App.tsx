import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider, useAuth } from '@/contexts/AuthContext';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import AppLayout from '@/components/layout/AppLayout';
import LoginPage from '@/pages/LoginPage';
import DashboardPage from '@/pages/DashboardPage';
import PlaceholderPage from '@/pages/PlaceholderPage';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60,
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

function AuthRedirect({ children }: { children: React.ReactNode }) {
  const { user, isLoading } = useAuth();
  if (isLoading) return null;
  if (user) return <Navigate to="/" replace />;
  return <>{children}</>;
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            <Route
              path="/login"
              element={
                <AuthRedirect>
                  <LoginPage />
                </AuthRedirect>
              }
            />
            <Route
              element={
                <ProtectedRoute>
                  <AppLayout />
                </ProtectedRoute>
              }
            >
              <Route index element={<DashboardPage />} />
              <Route path="contatos" element={<PlaceholderPage title="Contatos" description="Gerencie seus contatos e leads." />} />
              <Route path="empresas" element={<PlaceholderPage title="Empresas" description="Gerencie suas empresas e organizações." />} />
              <Route path="pipeline" element={<PlaceholderPage title="Pipeline" description="Visualize e gerencie seus deals." />} />
              <Route path="inbox" element={<PlaceholderPage title="Inbox" description="Atenda seus clientes em tempo real." />} />
              <Route path="automacoes" element={<PlaceholderPage title="Automações" description="Crie workflows automatizados." />} />
              <Route path="configuracoes" element={<PlaceholderPage title="Configurações" description="Configure seu CRM." />} />
            </Route>
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </QueryClientProvider>
  );
}
