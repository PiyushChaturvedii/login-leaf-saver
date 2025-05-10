
import React, { useState, useEffect } from 'react';
import { 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { 
  Dialog,
  DialogContent, 
  DialogDescription, 
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { Edit, MoreVertical, Phone, Trash, MessageCircle, Calendar } from "lucide-react";

interface Lead {
  id: string;
  name: string;
  email: string;
  phone: string;
  status: 'new' | 'follow-up' | 'converted' | 'not-interested';
  course: string;
  notes: string;
  createdAt: string;
  lastContact?: string;
}

export const LeadsList = () => {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [editLead, setEditLead] = useState<Lead | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [followUpNote, setFollowUpNote] = useState('');
  const [isFollowUpDialogOpen, setIsFollowUpDialogOpen] = useState(false);
  const [selectedLeadId, setSelectedLeadId] = useState<string | null>(null);

  useEffect(() => {
    // Load leads from localStorage
    const storedLeads = JSON.parse(localStorage.getItem('crm_leads') || '[]');
    setLeads(storedLeads);
    setIsLoading(false);
  }, []);

  const handleStatusChange = (leadId: string, newStatus: 'new' | 'follow-up' | 'converted' | 'not-interested') => {
    const updatedLeads = leads.map(lead => 
      lead.id === leadId 
        ? { 
            ...lead, 
            status: newStatus,
            lastContact: new Date().toISOString()
          } 
        : lead
    );
    
    localStorage.setItem('crm_leads', JSON.stringify(updatedLeads));
    setLeads(updatedLeads);
    toast.success(`Lead status updated to ${newStatus}`);
  };

  const handleEditClick = (lead: Lead) => {
    setEditLead(lead);
    setIsEditDialogOpen(true);
  };

  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editLead) return;
    
    const updatedLeads = leads.map(lead => 
      lead.id === editLead.id ? editLead : lead
    );
    
    localStorage.setItem('crm_leads', JSON.stringify(updatedLeads));
    setLeads(updatedLeads);
    setIsEditDialogOpen(false);
    toast.success('Lead updated successfully');
  };

  const handleDeleteLead = (leadId: string) => {
    if (confirm('Are you sure you want to delete this lead?')) {
      const filteredLeads = leads.filter(lead => lead.id !== leadId);
      localStorage.setItem('crm_leads', JSON.stringify(filteredLeads));
      setLeads(filteredLeads);
      toast.success('Lead deleted successfully');
    }
  };

  const handleFollowUpClick = (leadId: string) => {
    setSelectedLeadId(leadId);
    setFollowUpNote('');
    setIsFollowUpDialogOpen(true);
  };

  const handleSaveFollowUp = () => {
    if (!selectedLeadId) return;
    
    // Add follow-up note to lead
    const updatedLeads = leads.map(lead => {
      if (lead.id === selectedLeadId) {
        return { 
          ...lead, 
          status: 'follow-up' as const,
          notes: lead.notes + '\n\n' + new Date().toLocaleString() + ': ' + followUpNote,
          lastContact: new Date().toISOString()
        };
      }
      return lead;
    });
    
    localStorage.setItem('crm_leads', JSON.stringify(updatedLeads));
    setLeads(updatedLeads);
    setIsFollowUpDialogOpen(false);
    toast.success('Follow-up added successfully');
  };

  const getStatusBadge = (status: string) => {
    switch(status) {
      case 'new':
        return <Badge className="bg-blue-500">New</Badge>;
      case 'follow-up':
        return <Badge className="bg-yellow-500">Follow-up</Badge>;
      case 'converted':
        return <Badge className="bg-green-500">Converted</Badge>;
      case 'not-interested':
        return <Badge className="bg-gray-500">Not Interested</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  if (isLoading) {
    return <div className="text-center py-8">Loading leads...</div>;
  }

  if (leads.length === 0) {
    return (
      <div className="text-center py-12 bg-white rounded-lg border">
        <p className="text-lg text-gray-500">No leads found. Add your first lead to get started!</p>
      </div>
    );
  }

  return (
    <>
      <div className="bg-white rounded-lg shadow border overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Contact</TableHead>
              <TableHead>Course Interest</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Last Contact</TableHead>
              <TableHead className="w-[100px]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {leads.map((lead) => (
              <TableRow key={lead.id}>
                <TableCell className="font-medium">{lead.name}</TableCell>
                <TableCell>
                  <div>{lead.email}</div>
                  <div className="text-sm text-gray-500">{lead.phone}</div>
                </TableCell>
                <TableCell>{lead.course}</TableCell>
                <TableCell>{getStatusBadge(lead.status)}</TableCell>
                <TableCell>
                  {lead.lastContact ? new Date(lead.lastContact).toLocaleDateString() : 
                   new Date(lead.createdAt).toLocaleDateString()}
                </TableCell>
                <TableCell>
                  <div className="flex items-center">
                    <Button 
                      variant="ghost" 
                      size="icon"
                      onClick={() => handleFollowUpClick(lead.id)}
                      title="Add follow-up"
                    >
                      <Phone className="w-4 h-4" />
                    </Button>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreVertical className="w-4 h-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => handleEditClick(lead)}>
                          <Edit className="w-4 h-4 mr-2" /> Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleDeleteLead(lead.id)}>
                          <Trash className="w-4 h-4 mr-2" /> Delete
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleStatusChange(lead.id, 'new')}>
                          Mark as New
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleStatusChange(lead.id, 'follow-up')}>
                          Mark for Follow-up
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleStatusChange(lead.id, 'converted')}>
                          Mark as Converted
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleStatusChange(lead.id, 'not-interested')}>
                          Mark as Not Interested
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Edit Lead Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Edit Lead</DialogTitle>
            <DialogDescription>
              Update lead information. Click save when done.
            </DialogDescription>
          </DialogHeader>
          
          {editLead && (
            <form onSubmit={handleSaveEdit}>
              <div className="grid grid-cols-2 gap-4 py-4">
                <div className="space-y-2">
                  <label htmlFor="name" className="text-sm font-medium">Name</label>
                  <Input
                    id="name"
                    value={editLead.name}
                    onChange={(e) => setEditLead({...editLead, name: e.target.value})}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label htmlFor="email" className="text-sm font-medium">Email</label>
                  <Input
                    id="email"
                    type="email"
                    value={editLead.email}
                    onChange={(e) => setEditLead({...editLead, email: e.target.value})}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label htmlFor="phone" className="text-sm font-medium">Phone</label>
                  <Input
                    id="phone"
                    value={editLead.phone}
                    onChange={(e) => setEditLead({...editLead, phone: e.target.value})}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label htmlFor="course" className="text-sm font-medium">Course Interest</label>
                  <Input
                    id="course"
                    value={editLead.course}
                    onChange={(e) => setEditLead({...editLead, course: e.target.value})}
                  />
                </div>
                <div className="space-y-2 col-span-2">
                  <label htmlFor="status" className="text-sm font-medium">Status</label>
                  <Select 
                    value={editLead.status} 
                    onValueChange={(value: 'new' | 'follow-up' | 'converted' | 'not-interested') => 
                      setEditLead({...editLead, status: value})
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="new">New</SelectItem>
                      <SelectItem value="follow-up">Follow-up</SelectItem>
                      <SelectItem value="converted">Converted</SelectItem>
                      <SelectItem value="not-interested">Not Interested</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2 col-span-2">
                  <label htmlFor="notes" className="text-sm font-medium">Notes</label>
                  <Textarea
                    id="notes"
                    value={editLead.notes}
                    onChange={(e) => setEditLead({...editLead, notes: e.target.value})}
                    rows={4}
                  />
                </div>
              </div>
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit">Save Changes</Button>
              </DialogFooter>
            </form>
          )}
        </DialogContent>
      </Dialog>

      {/* Follow-up Dialog */}
      <Dialog open={isFollowUpDialogOpen} onOpenChange={setIsFollowUpDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Add Follow-up</DialogTitle>
            <DialogDescription>
              Record details about your follow-up with this lead.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="flex items-center space-x-2">
              <Calendar className="w-5 h-5 text-gray-500" />
              <span>Date: {new Date().toLocaleDateString()}</span>
            </div>
            
            <div className="space-y-2">
              <label htmlFor="followUpNote" className="text-sm font-medium">Follow-up Notes</label>
              <Textarea
                id="followUpNote"
                value={followUpNote}
                onChange={(e) => setFollowUpNote(e.target.value)}
                placeholder="Enter details about your conversation..."
                rows={4}
                required
              />
            </div>
          </div>
          
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setIsFollowUpDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSaveFollowUp}>Save Follow-up</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};
