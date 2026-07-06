import { Toaster } from "@/components/ui/toaster"
import { QueryClientProvider } from '@tanstack/react-query'
import { queryClientInstance } from '@/lib/query-client'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import PageNotFound from './lib/PageNotFound';
import { AuthProvider, useAuth } from '@/lib/AuthContext';
import UserNotRegisteredError from '@/components/UserNotRegisteredError';
import Home from './pages/Home';
import VacancyDetail from './pages/VacancyDetail';
import PrivacyPolicy from './pages/PrivacyPolicy';
import ContractView from './pages/ContractView';
import Blog from './pages/Blog';
import BlogArticle from './pages/BlogArticle';
import ConsentPage from './pages/ConsentPage';
import About from './pages/About';
import Contact from './pages/Contact';
import Calculator from './pages/Calculator';
import AdminReviews from './pages/AdminReviews';
import CandidateAnketa from './pages/CandidateAnketa';
import SbReview from './pages/SbReview';
import CandidateReview from './pages/CandidateReview';
import CrmLogin from './pages/crm/Login';
import CrmLayout from '@/components/crm/CrmLayout';
import CrmDashboard from './pages/crm/Dashboard';
import CrmRewards from './pages/crm/Rewards';
import CrmManagers from './pages/crm/Managers';
import CrmAssemblyPoints from './pages/crm/AssemblyPoints';
import CrmIntegrationQueue from './pages/crm/IntegrationQueue';
import CrmCandidateDetail from './pages/crm/CandidateDetail';
// Add page imports here

const AuthenticatedApp = () => {
  const { isLoadingAuth, isLoadingPublicSettings, authError, navigateToLogin } = useAuth();

  // Show loading spinner while checking app public settings or auth
  if (isLoadingPublicSettings || isLoadingAuth) {
    return (
      <div className="fixed inset-0 flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-slate-200 border-t-slate-800 rounded-full animate-spin"></div>
      </div>
    );
  }

  // Handle authentication errors
  if (authError) {
    if (authError.type === 'user_not_registered') {
      return <UserNotRegisteredError />;
    } else if (authError.type === 'auth_required') {
      // Redirect to login automatically
      navigateToLogin();
      return null;
    }
  }

  // Render the main app
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/vacancy/:id" element={<VacancyDetail />} />
      <Route path="/contract/:id" element={<ContractView />} />
      <Route path="/privacy" element={<PrivacyPolicy />} />
      <Route path="/blog" element={<Blog />} />
      <Route path="/blog/:slug" element={<BlogArticle />} />
      <Route path="/consent" element={<ConsentPage />} />
      <Route path="/about" element={<About />} />
      <Route path="/contact" element={<Contact />} />
      <Route path="/calculator" element={<Calculator />} />
      <Route path="/admin/reviews" element={<AdminReviews />} />
      <Route path="/candidate-anketa" element={<CandidateAnketa />} />
      <Route path="/sb-review" element={<SbReview />} />
      <Route path="/candidate-review" element={<CandidateReview />} />
      <Route path="/crm/login" element={<CrmLogin />} />
      <Route path="/crm" element={<CrmLayout />}>
        <Route path="dashboard" element={<CrmDashboard />} />
        <Route path="rewards" element={<CrmRewards />} />
        <Route path="managers" element={<CrmManagers />} />
        <Route path="assembly-points" element={<CrmAssemblyPoints />} />
        <Route path="integration-queue" element={<CrmIntegrationQueue />} />
        <Route path="candidate/:id" element={<CrmCandidateDetail />} />
        <Route path="admin/reviews" element={<AdminReviews />} />
      </Route>
      <Route path="*" element={<PageNotFound />} />
    </Routes>
  );
};


function App() {

  return (
    <AuthProvider>
      <QueryClientProvider client={queryClientInstance}>
        <Router>
          <AuthenticatedApp />
        </Router>
        <Toaster />
      </QueryClientProvider>
    </AuthProvider>
  )
}

export default App