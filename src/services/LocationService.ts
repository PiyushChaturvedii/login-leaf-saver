
interface LocationData {
  userId: string;
  role: string;
  lat: number;
  lng: number;
  timestamp: string;
  date: string;
}

class LocationService {
  private trackingInterval: number | null = null;
  private isTracking = false;
  
  constructor() {
    this.isTracking = false;
  }
  
  hasUserGivenConsent(): boolean {
    const consent = localStorage.getItem('locationConsent');
    if (!consent) return false;
    
    try {
      const consentData = JSON.parse(consent);
      return consentData.trackingConsent && consentData.sharingConsent;
    } catch (e) {
      return false;
    }
  }
  
  startTracking(userId: string, userRole: string): void {
    if (this.isTracking) return;
    if (!this.hasUserGivenConsent()) return;
    
    // Check if geolocation is available
    if (!navigator.geolocation) {
      console.error("Geolocation is not supported by this browser");
      return;
    }
    
    // Log once immediately
    this.logCurrentPosition(userId, userRole);
    
    // Then set interval for every hour (3600000 ms)
    // For testing purposes, we're using a shorter interval (60000 ms = 1 minute)
    this.trackingInterval = window.setInterval(() => {
      this.logCurrentPosition(userId, userRole);
    }, 60000); // Every minute for testing, change to 3600000 for production
    
    this.isTracking = true;
    console.log("Location tracking started");
  }
  
  stopTracking(): void {
    if (this.trackingInterval) {
      clearInterval(this.trackingInterval);
      this.trackingInterval = null;
      this.isTracking = false;
      console.log("Location tracking stopped");
    }
  }
  
  private logCurrentPosition(userId: string, userRole: string): void {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const locationData: LocationData = {
          userId,
          role: userRole,
          lat: position.coords.latitude,
          lng: position.coords.longitude,
          timestamp: new Date().toISOString(),
          date: new Date().toLocaleDateString()
        };
        
        this.saveLocationData(locationData);
      },
      (error) => {
        console.error("Error getting location:", error);
      }
    );
  }
  
  private saveLocationData(data: LocationData): void {
    // In a real implementation, this would send data to a backend API
    // For now, we'll store in localStorage for demo purposes only
    const storedLogs = localStorage.getItem('locationLogs') || '[]';
    try {
      const logs = JSON.parse(storedLogs) as LocationData[];
      logs.push(data);
      localStorage.setItem('locationLogs', JSON.stringify(logs));
      console.log("Location logged:", data);
    } catch (e) {
      console.error("Error saving location data:", e);
    }
  }
  
  getAllLocationLogs(): LocationData[] {
    const storedLogs = localStorage.getItem('locationLogs') || '[]';
    try {
      return JSON.parse(storedLogs) as LocationData[];
    } catch (e) {
      console.error("Error reading location logs:", e);
      return [];
    }
  }
  
  getLocationLogsByDate(date: string): LocationData[] {
    const logs = this.getAllLocationLogs();
    return logs.filter(log => log.date === date);
  }
  
  getLocationLogsByRole(role: string): LocationData[] {
    const logs = this.getAllLocationLogs();
    return logs.filter(log => log.role === role);
  }
  
  getLocationLogsByUser(userId: string): LocationData[] {
    const logs = this.getAllLocationLogs();
    return logs.filter(log => log.userId === userId);
  }
  
  clearConsentAndLogs(): void {
    localStorage.removeItem('locationConsent');
    localStorage.removeItem('locationLogs');
    this.stopTracking();
  }
}

export const locationService = new LocationService();
