
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useForm, Controller } from 'react-hook-form';
import { Card, CardContent } from '@/components/ui/card';

interface Student {
  id: number;
  name: string;
  contact: string;
  courseInterested: string;
  source: string;
  status: 'New' | 'Called' | 'Follow-up' | 'Converted';
  timestamp: string;
  entryDate: string;
  notes?: string;
}

interface FeedbackFormData {
  status: 'New' | 'Called' | 'Follow-up' | 'Converted';
  notes: string;
}

interface FeedbackPanelProps {
  student: Student;
  onSubmit: (updatedStudent: Student) => void;
  onCancel: () => void;
}

export const FeedbackPanel: React.FC<FeedbackPanelProps> = ({ student, onSubmit, onCancel }) => {
  const { handleSubmit, control, formState: { errors } } = useForm<FeedbackFormData>({
    defaultValues: {
      status: student.status,
      notes: student.notes || ''
    }
  });

  // Logic to only allow one feedback update per day per entry
  const hasUpdatedToday = student.timestamp && new Date(student.timestamp).toDateString() === new Date().toDateString();

  const onSubmitHandler = (data: FeedbackFormData) => {
    const updatedStudent: Student = {
      ...student,
      status: data.status,
      notes: data.notes,
      timestamp: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
    };
    
    onSubmit(updatedStudent);
  };

  return (
    <Dialog open={true} onOpenChange={onCancel}>
      <DialogContent className="sm:max-w-[550px]">
        <DialogHeader>
          <DialogTitle>Update Student Status & Feedback</DialogTitle>
        </DialogHeader>
        
        <Card className="bg-gray-50">
          <CardContent className="p-4 space-y-2">
            <div className="grid grid-cols-2 gap-2">
              <div>
                <p className="text-sm font-medium text-gray-500">Name:</p>
                <p className="font-medium">{student.name}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Contact:</p>
                <p>{student.contact}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Course Interested:</p>
                <p>{student.courseInterested}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Source:</p>
                <p>{student.source}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Current Status:</p>
                <p>{student.status}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Entry Time:</p>
                <p>{student.timestamp}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <form onSubmit={handleSubmit(onSubmitHandler)} className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="status">Update Status</Label>
            <Controller
              name="status"
              control={control}
              rules={{ required: "Status is required" }}
              render={({ field }) => (
                <Select 
                  onValueChange={field.onChange} 
                  defaultValue={field.value}
                  disabled={hasUpdatedToday}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="New">New</SelectItem>
                    <SelectItem value="Called">Called</SelectItem>
                    <SelectItem value="Follow-up">Follow-up</SelectItem>
                    <SelectItem value="Converted">Converted</SelectItem>
                  </SelectContent>
                </Select>
              )}
            />
            {errors.status && <p className="text-sm text-red-500">{errors.status.message}</p>}
            {hasUpdatedToday && (
              <p className="text-xs text-amber-600">Status can only be updated once per day</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">Feedback Notes</Label>
            <Controller
              name="notes"
              control={control}
              render={({ field }) => (
                <Textarea
                  {...field}
                  placeholder="Add notes about the conversation, student requirements, or follow-up details"
                  className="min-h-[100px]"
                  disabled={hasUpdatedToday}
                />
              )}
            />
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onCancel}>
              Cancel
            </Button>
            <Button 
              type="submit" 
              className="bg-green-600 hover:bg-green-700"
              disabled={hasUpdatedToday}
            >
              Update Record
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
