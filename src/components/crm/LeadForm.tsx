
import React, { useState } from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from 'sonner';

interface LeadFormProps {
  onLeadAdded: () => void;
  onCancel: () => void;
}

export const LeadForm: React.FC<LeadFormProps> = ({ onLeadAdded, onCancel }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [course, setCourse] = useState('');
  const [notes, setNotes] = useState('');
  const [source, setSource] = useState('website');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      // Generate unique ID
      const id = Date.now().toString();
      
      // Create new lead object
      const newLead = {
        id,
        name,
        email,
        phone,
        course,
        notes,
        source,
        status: 'new' as const,
        createdAt: new Date().toISOString(),
      };
      
      // Get existing leads from localStorage
      const existingLeads = JSON.parse(localStorage.getItem('crm_leads') || '[]');
      
      // Add new lead to array
      const updatedLeads = [...existingLeads, newLead];
      
      // Save to localStorage
      localStorage.setItem('crm_leads', JSON.stringify(updatedLeads));
      
      // Notify parent component
      onLeadAdded();
      
    } catch (error) {
      console.error('Error saving lead:', error);
      toast.error('Failed to add lead. Please try again.');
    }
  };

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle>Add New Lead</CardTitle>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label htmlFor="name" className="text-sm font-medium">Full Name *</label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter full name"
                required
              />
            </div>
            
            <div className="space-y-2">
              <label htmlFor="email" className="text-sm font-medium">Email Address *</label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="email@example.com"
                required
              />
            </div>
            
            <div className="space-y-2">
              <label htmlFor="phone" className="text-sm font-medium">Phone Number *</label>
              <Input
                id="phone"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="Enter phone number"
                required
              />
            </div>
            
            <div className="space-y-2">
              <label htmlFor="course" className="text-sm font-medium">Course Interest *</label>
              <Input
                id="course"
                value={course}
                onChange={(e) => setCourse(e.target.value)}
                placeholder="Which course are they interested in?"
                required
              />
            </div>
            
            <div className="space-y-2">
              <label htmlFor="source" className="text-sm font-medium">Lead Source</label>
              <Select value={source} onValueChange={setSource}>
                <SelectTrigger>
                  <SelectValue placeholder="Select source" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="website">Website</SelectItem>
                  <SelectItem value="referral">Referral</SelectItem>
                  <SelectItem value="social">Social Media</SelectItem>
                  <SelectItem value="event">Event</SelectItem>
                  <SelectItem value="advertisement">Advertisement</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2 md:col-span-2">
              <label htmlFor="notes" className="text-sm font-medium">Notes</label>
              <Textarea
                id="notes"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Add any additional notes about this lead"
                rows={4}
              />
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button type="submit">Save Lead</Button>
        </CardFooter>
      </form>
    </Card>
  );
};
