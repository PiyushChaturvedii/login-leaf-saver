
import { useEffect } from 'react';
import { locationService } from '../services/LocationService';

export function useLocationTracking(userId: string, userRole: string) {
  useEffect(() => {
    // Start tracking if user has given consent
    if (locationService.hasUserGivenConsent()) {
      locationService.startTracking(userId, userRole);
      
      // Clean up on component unmount
      return () => {
        locationService.stopTracking();
      };
    }
  }, [userId, userRole]);
  
  return {
    hasConsent: locationService.hasUserGivenConsent(),
    clearConsent: locationService.clearConsentAndLogs.bind(locationService)
  };
}
