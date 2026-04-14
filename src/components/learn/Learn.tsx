import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import LearnLanding from './LearnLanding';
import Auth from './Auth';
import ParentDashboard from './ParentDashboard';
import StudentDashboard from './StudentDashboard';
import AdminDashboard from './AdminDashboard';
import StudentSetup from './StudentSetup';
import { UserProfile } from '../../../types';

const Learn: React.FC = () => {
  const { user, profile, loading } = useAuth();
  const [view, setView] = useState<'landing' | 'auth' | 'dashboard' | 'setup'>('landing');
  const [previewRole, setPreviewRole] = useState<'parent' | 'student' | null>(null);

  useEffect(() => {
    // Check for setup token in URL
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.has('token')) {
      setView('setup');
    }
  }, []);

  useEffect(() => {
    if (!loading) {
      if (user && profile) {
        setView('dashboard');
      } else if (user && !profile) {
        // This case might happen during profile creation
        setView('auth');
      }
    }
  }, [user, profile, loading]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-900">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (view === 'setup') {
    return <StudentSetup onComplete={() => setView('dashboard')} />;
  }

  if (view === 'landing' && !user) {
    return <LearnLanding onGetStarted={() => setView('auth')} />;
  }

  if (view === 'auth' || (user && !profile)) {
    return <Auth onBack={() => setView('landing')} />;
  }

  if (user && profile) {
    const effectiveRole = previewRole || profile.role;
    
    if (effectiveRole === 'admin') return <AdminDashboard />;
    if (effectiveRole === 'parent') {
      return <ParentDashboard onSwitchView={() => setPreviewRole('student')} />;
    }
    if (effectiveRole === 'student') {
      return <StudentDashboard onSwitchView={profile.role === 'parent' ? () => setPreviewRole('parent') : undefined} />;
    }
  }

  return <LearnLanding onGetStarted={() => setView('auth')} />;
};

export default Learn;
