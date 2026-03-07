import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import { AuthProvider } from "@/hooks/useAuth";

import Auth from "@/pages/Auth";
import Dashboard from "@/pages/Dashboard";
import Friends from "@/pages/Friends";
import Landing from "@/pages/Landing";
import Leaderboard from "@/pages/Leaderboard";
import Mountains from "@/pages/Mountains";
import Profile from "@/pages/Profile";
import Stats from "@/pages/Stats";
import Calendar from "@/pages/Calendar";
import NotFound from "@/pages/NotFound";

import { ErrorBoundary } from "@/components/ErrorBoundary";
import { Navbar } from "@/components/Navbar";
import { PWAInstallPrompt } from "@/components/PWAInstallPrompt";
import { FriendNotifications } from "@/components/friends/FriendNotifications";

const queryClient = new QueryClient();

const App = () => {
  return (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <ErrorBoundary>
        <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
          <AuthProvider>
            <FriendNotifications />
            <div className="min-h-screen flex flex-col">
              <Navbar />
              <main className="flex-1">
                <Routes>
                  <Route path="/" element={<Landing />} />
                  <Route path="/auth" element={<Auth />} />
                  <Route path="/dashboard" element={<Dashboard />} />
                  <Route path="/mountains" element={<Mountains />} />
                  <Route path="/stats" element={<Stats />} />
                  <Route path="/profile" element={<Profile />} />
                  <Route path="/leaderboard" element={<Leaderboard />} />
                  <Route path="/calendar" element={<Calendar />} />
                  <Route path="/friends" element={<Friends />} />
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </main>
              <PWAInstallPrompt />
            </div>
          </AuthProvider>
        </BrowserRouter>
      </ErrorBoundary>
    </TooltipProvider>
  </QueryClientProvider>
  )
};

export default App;
