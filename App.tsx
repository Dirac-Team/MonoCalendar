import React, { useEffect, useState } from 'react';
import { Onboarding } from './components/Onboarding';
import { CalendarView } from './components/CalendarView';
import { UserProfile } from './types';

const App: React.FC = () => {
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check local storage for existing user
    const storedUser = localStorage.getItem('mono_user');
    if (storedUser) {
      setUserProfile(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  const handleOnboardingComplete = (profile: UserProfile) => {
    setUserProfile(profile);
    localStorage.setItem('mono_user', JSON.stringify(profile));
  };

  const handleEditSettings = () => {
    // In a full app, this would be a settings modal. 
    // For now, we allow resetting by clearing userProfile to trigger onboarding.
    if (confirm("This will reset your persona settings. Continue?")) {
        setUserProfile(null);
        localStorage.removeItem('mono_user');
        localStorage.removeItem('mono_plans');
    }
  };

  if (loading) return null;

  return (
    <div className="min-h-screen bg-white text-black selection:bg-black selection:text-white">
      {userProfile?.isOnboarded ? (
        <>
            <CalendarView userProfile={userProfile} />
            <div className="fixed bottom-4 left-4 z-40">
                <button 
                    onClick={handleEditSettings}
                    className="text-xs text-zinc-300 hover:text-zinc-500 transition-colors"
                >
                    Reset Profile
                </button>
            </div>
        </>
      ) : (
        <Onboarding onComplete={handleOnboardingComplete} />
      )}
    </div>
  );
};

export default App;
