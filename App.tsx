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

  const handleProfileUpdate = (profile: UserProfile) => {
    setUserProfile(profile);
    localStorage.setItem('mono_user', JSON.stringify(profile));
  };

  if (loading) return null;

  return (
    <div className="min-h-screen bg-white text-black selection:bg-black selection:text-white">
      {userProfile?.isOnboarded ? (
        <>
            <CalendarView 
              userProfile={userProfile} 
              onUpdateProfile={handleProfileUpdate}
            />
        </>
      ) : (
        <Onboarding onComplete={handleOnboardingComplete} />
      )}
    </div>
  );
};

export default App;