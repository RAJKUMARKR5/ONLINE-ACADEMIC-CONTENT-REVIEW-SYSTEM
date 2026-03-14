import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Header from './components/Navbar';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import ReviewDashboard from './pages/ReviewDashboard';
import AdminDashboard from './pages/AdminDashboard';
import SubmitContent from './pages/SubmitContent';
import SubmitReview from './pages/SubmitReview';
import ViewFeedback from './pages/ViewFeedback';
import Viewer from './pages/Viewer';
import GoogleCallback from './pages/GoogleCallback';
import ProtectedRoute from './components/ProtectedRoute';
import { useSelector } from 'react-redux';

const RoleBasedDashboard = ({ user }) => {
  if (user) {
    if (user.role === 'Admin') return <AdminDashboard />;
    if (user.role === 'Reviewer') return <ReviewDashboard />;
    return <Dashboard />; // Author
  }
  return <Login />;
};

function App() {
  const { user } = useSelector((state) => state.auth);

  // Hide Navbar for all logged-in users since they have sidebar layouts.
  // Only show Navbar on unauthenticated pages (Login/Register).
  const showNavbar = !user;

  return (
    <Router>
      <div className='min-h-screen bg-gray-100 text-gray-900'>
        <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} />
        {showNavbar && <Header />}
        <Routes>
          <Route path="/" element={<Navigate to="/login" />} />
          <Route path="/login" element={<Login />} />
          <Route path="/viewer" element={<Viewer />} />
          <Route path="/register" element={<Register />} />
          <Route path="/auth/callback" element={<GoogleCallback />} />
          <Route path="/dashboard" element={
            <ProtectedRoute>
              <RoleBasedDashboard user={user} />
            </ProtectedRoute>
          } />
          <Route path="/submit-content" element={
            <ProtectedRoute>
              <SubmitContent />
            </ProtectedRoute>
          } />
          <Route path="/submit-review/:submissionId/:assignmentId" element={
            <ProtectedRoute>
              <SubmitReview />
            </ProtectedRoute>
          } />
          <Route path="/view-feedback/:submissionId" element={
            <ProtectedRoute>
              <ViewFeedback />
            </ProtectedRoute>
          } />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
