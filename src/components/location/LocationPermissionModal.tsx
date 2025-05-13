
import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";

interface LocationPermissionProps {
  isOpen: boolean;
  onClose: () => void;
  onAccept: () => void;
}

export const LocationPermissionModal = ({ isOpen, onClose, onAccept }: LocationPermissionProps) => {
  const [trackingConsent, setTrackingConsent] = useState(false);
  const [sharingConsent, setSharingConsent] = useState(false);
  
  const handleAcceptAll = () => {
    if (!trackingConsent || !sharingConsent) {
      toast.error("कृपया सभी अनुमतियों को स्वीकार करें");
      return;
    }
    
    // Store consent in localStorage
    const consentData = {
      trackingConsent: true,
      sharingConsent: true,
      timestamp: new Date().toISOString(),
    };
    
    localStorage.setItem("locationConsent", JSON.stringify(consentData));
    toast.success("अनुमतियां स्वीकार की गईं");
    onAccept();
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>लोकेशन ट्रैकिंग अनुमतियां</DialogTitle>
          <DialogDescription>
            बेहतर सेवा प्रदान करने के लिए हमें आपके स्थान की जानकारी की आवश्यकता है
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          <div className="flex items-start space-x-3">
            <Checkbox 
              id="trackingConsent" 
              checked={trackingConsent}
              onCheckedChange={(checked) => setTrackingConsent(!!checked)}
            />
            <div className="grid gap-1.5">
              <label 
                htmlFor="trackingConsent" 
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                हर घंटे बैकग्राउंड लोकेशन ट्रैकिंग की अनुमति दें
              </label>
              <p className="text-sm text-gray-500">
                हम आपके स्थान को हर घंटे एकत्र करेंगे, भले ही आप ऐप का उपयोग न कर रहे हों
              </p>
            </div>
          </div>
          
          <div className="flex items-start space-x-3">
            <Checkbox 
              id="sharingConsent" 
              checked={sharingConsent}
              onCheckedChange={(checked) => setSharingConsent(!!checked)}
            />
            <div className="grid gap-1.5">
              <label 
                htmlFor="sharingConsent" 
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                लोकेशन डेटा को निगरानी और प्रदर्शन विश्लेषण के लिए एडमिन के साथ साझा करने की अनुमति दें
              </label>
              <p className="text-sm text-gray-500">
                आपका स्थान डेटा केवल प्रशासकों को प्रदर्शन विश्लेषण के लिए दिखाया जाएगा
              </p>
            </div>
          </div>
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>अस्वीकार करें</Button>
          <Button onClick={handleAcceptAll}>सभी स्वीकार करें</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
