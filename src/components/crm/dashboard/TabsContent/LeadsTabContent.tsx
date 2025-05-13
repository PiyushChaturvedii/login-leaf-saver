
import React from 'react';
import { Button } from "@/components/ui/button";
import { UserPlus } from 'lucide-react';
import { LeadsList } from '../../LeadsList';
import { LeadForm } from '../../LeadForm';

interface LeadsTabContentProps {
  showAddLeadForm: boolean;
  onAddLead: () => void;
  onLeadAdded: () => void;
  onCancelLeadForm: () => void;
}

export const LeadsTabContent: React.FC<LeadsTabContentProps> = ({
  showAddLeadForm,
  onAddLead,
  onLeadAdded,
  onCancelLeadForm,
}) => {
  return (
    <>
      {showAddLeadForm ? (
        <LeadForm onLeadAdded={onLeadAdded} onCancel={onCancelLeadForm} />
      ) : (
        <>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Leads Management</h2>
            <Button onClick={onAddLead}>
              <UserPlus className="w-4 h-4 mr-2" />
              Add New Lead
            </Button>
          </div>
          <LeadsList />
        </>
      )}
    </>
  );
};
