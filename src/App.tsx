import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ProcurementProvider } from './context/ProcurementContext';
import { AuthProvider, useAuth } from './context/AuthContext';
import { Shell } from './components/layout/Shell';

// Pages
import { DashboardPage } from './pages/DashboardPage';
import { ProjectsPage } from './pages/ProjectsPage';
import { CreateProjectPage } from './pages/CreateProjectPage';
import { VendorsPage } from './pages/VendorsPage';
import { ProposalsPage } from './pages/ProposalsPage';
import { ProposalReviewPage } from './pages/ProposalReviewPage';
import { ComparisonPage } from './pages/ComparisonPage';
import { CriteriaPage } from './pages/CriteriaPage';
import { RecommendationsPage } from './pages/RecommendationsPage';
import { ReportsPage } from './pages/ReportsPage';
import { SettingsPage } from './pages/SettingsPage';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { WeeklyTrackerPage } from './pages/WeeklyTrackerPage';

// Protected Route Guard
const ProtectedShellLayout: React.FC = () => {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <Shell />;
};

// Public Route Guard (prevents logged in users from getting stuck in login/register)
const PublicAuthRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated } = useAuth();

  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};

export const App: React.FC = () => {
  return (
    <AuthProvider>
      <ProcurementProvider>
        <BrowserRouter>
          <Routes>
            {/* Public Authentication Routes */}
            <Route
              path="/login"
              element={
                <PublicAuthRoute>
                  <LoginPage />
                </PublicAuthRoute>
              }
            />
            <Route
              path="/register"
              element={
                <PublicAuthRoute>
                  <RegisterPage />
                </PublicAuthRoute>
              }
            />

            {/* Protected Enterprise Platform Routes */}
            <Route element={<ProtectedShellLayout />}>
              <Route path="/" element={<DashboardPage />} />
              <Route path="/projects" element={<ProjectsPage />} />
              <Route path="/projects/new" element={<CreateProjectPage />} />
              <Route path="/vendors" element={<VendorsPage />} />
              <Route path="/proposals" element={<ProposalsPage />} />
              <Route path="/proposals/:proposalId/review" element={<ProposalReviewPage />} />
              <Route path="/compare" element={<ComparisonPage />} />
              <Route path="/criteria" element={<CriteriaPage />} />
              <Route path="/recommendations" element={<RecommendationsPage />} />
              <Route path="/reports" element={<ReportsPage />} />
              <Route path="/weekly-tracker" element={<WeeklyTrackerPage />} />
              <Route path="/settings" element={<SettingsPage />} />
            </Route>

            {/* Fallback */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </BrowserRouter>
      </ProcurementProvider>
    </AuthProvider>
  );
};

export default App;
