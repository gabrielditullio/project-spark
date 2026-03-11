import { Outlet } from 'react-router-dom';
import { useState } from 'react';
import { Menu } from 'lucide-react';
import Sidebar from './Sidebar';
import Header from './Header';

export default function AppLayout() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      {/* Sidebar desktop */}
      <div className="hidden md:block">
        <Sidebar />
      </div>

      {/* Sidebar mobile overlay */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div className="fixed inset-0 bg-black/50" onClick={() => setMobileMenuOpen(false)} />
          <div className="fixed inset-y-0 left-0 z-50 w-60">
            <Sidebar onNavigate={() => setMobileMenuOpen(false)} />
          </div>
        </div>
      )}

      <div className="flex flex-1 flex-col min-w-0">
        {/* Header com botão de menu mobile */}
        <header className="flex items-center h-14 px-4 md:px-6 border-b border-border bg-card gap-3">
          <button
            onClick={() => setMobileMenuOpen(true)}
            className="md:hidden p-1.5 rounded-md hover:bg-muted transition-colors"
          >
            <Menu className="w-5 h-5 text-muted-foreground" />
          </button>
          <Header />
        </header>
        <main className="flex-1 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
