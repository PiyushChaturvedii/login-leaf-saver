
import React from 'react';
import { Languages } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { useLanguage } from '@/context/LanguageContext';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

export const LanguageToggle = () => {
  const { language, toggleLanguage } = useLanguage();

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={toggleLanguage}
            className="hover:bg-soft-purple rounded-full"
          >
            <Languages 
              className={`w-5 h-5 ${language === 'hi' ? 'text-secondary-purple' : 'text-primary-purple'}`} 
            />
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>{language === 'hi' ? 'Switch to English' : 'हिंदी में बदलें'}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};
