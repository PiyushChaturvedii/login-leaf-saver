
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { LocationPermissionModal } from "./LocationPermissionModal";
import { useLocationTracking } from "../../hooks/useLocationTracking";

interface LocationTrackerProps {
  onPermissionGranted: () => void;
  userEmail: string;
  userRole: string;
}

export const LocationTracker = ({ onPermissionGranted, userEmail, userRole }: LocationTrackerProps) => {
  const [showPermissionModal, setShowPermissionModal] = useState(false);
  const { hasConsent } = useLocationTracking(userEmail, userRole);
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user already gave consent
    if (!hasConsent) {
      setShowPermissionModal(true);
    } else {
      onPermissionGranted();
    }
  }, [hasConsent, onPermissionGranted]);

  const handleClose = () => {
    // If user dismisses without accepting, log them out
    localStorage.removeItem('currentUser');
    navigate('/');
  };

  const handleAccept = () => {
    setShowPermissionModal(false);
    onPermissionGranted();
  };

  return (
    <LocationPermissionModal
      isOpen={showPermissionModal}
      onClose={handleClose}
      onAccept={handleAccept}
    />
  );
};
