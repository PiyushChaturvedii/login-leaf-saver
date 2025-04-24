
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

interface UserData {
  email: string;
  role: string;
  name: string;
  profileCompleted?: boolean;
}

export const useProfileCompletion = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    const checkProfileCompletion = () => {
      const currentUser = localStorage.getItem('currentUser');
      
      if (!currentUser) {
        navigate('/');
        return;
      }
      
      const userData: UserData = JSON.parse(currentUser);
      
      // If profile isn't completed and user is not already on the profile form page
      if (!userData.profileCompleted && 
          !window.location.pathname.includes('/profile-setup')) {
        navigate('/profile-setup');
      }
      
      setIsLoading(false);
    };
    
    checkProfileCompletion();
  }, [navigate]);
  
  return { isLoading };
};
