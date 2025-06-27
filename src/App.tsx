import React from 'react';
import { ThemeProvider } from '@/components/theme-provider';
import { AuthProvider } from '@/hooks/use-auth';
import { ProtectedRoute } from '@/components/protected-route';
import AdminPage from '../app/admin/page';
import ChatPage from '../app/chat/page';

function Router() {
  const path = window.location.pathname;
  
  // Handle individual chat routes
  if (path.startsWith('/chat/') && path !== '/chat') {
    const slug = path.replace('/chat/', '');
    const ChatSlugPage = React.lazy(() => import('../app/chat/[slug]/page'));
    return (
      <React.Suspense fallback={
        <div className="min-h-screen bg-sidebar flex items-center justify-center">
          <div className="w-8 h-8 border-2 border-sidebar-foreground border-t-transparent rounded-full animate-spin"></div>
        </div>
      }>
        <ChatSlugPage params={{ slug }} />
      </React.Suspense>
    );
  }
  
  // Handle main chat discovery page (no auth required)
  if (path === '/chat') {
    return <ChatPage />;
  }
  
  // Handle admin routes (auth required)
  return (
    <ProtectedRoute>
      <AdminPage />
    </ProtectedRoute>
  );
}

function App() {
  return (
    <div className="h-screen bg-sidebar overflow-hidden">
      <ThemeProvider defaultTheme="dark" attribute="class">
        <AuthProvider>
          <Router />
        </AuthProvider>
      </ThemeProvider>
    </div>
  );
}

export default App;