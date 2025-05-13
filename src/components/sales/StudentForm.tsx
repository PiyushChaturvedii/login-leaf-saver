
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useForm, Controller } from 'react-hook-form';

interface StudentFormData {
  name: string;
  contact: string;
  courseInterested: string;
  source: string;
  status: 'New' | 'Called' | 'Follow-up' | 'Converted';
}

interface StudentFormProps {
  onSubmit: (data: StudentFormData) => void;
  onCancel: () => void;
}

export const StudentForm: React.FC<StudentFormProps> = ({ onSubmit, onCancel }) => {
  const { register, handleSubmit, control, formState: { errors } } = useForm<StudentFormData>({
    defaultValues: {
      name: '',
      contact: '',
      courseInterested: '',
      source: '',
      status: 'New'
    }
  });

  const courses = [
    "Web Development",
    "UI/UX Design",
    "Python Programming",
    "Digital Marketing",
    "Mobile App Development",
    "Data Science",
    "Machine Learning",
    "Full Stack Development"
  ];

  const sources = [
    "Instagram",
    "Facebook",
    "Website",
    "Referral",
    "Google Search",
    "YouTube",
    "Newspaper",
    "Outdoor Ad",
    "Event"
  ];

  return (
    <Dialog open={true} onOpenChange={onCancel}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Add New Student Record</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 py-4">
          <div className="grid grid-cols-1 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input
                id="name"
                {...register("name", { required: "Name is required" })}
                placeholder="Enter student's full name"
              />
              {errors.name && <p className="text-sm text-red-500">{errors.name.message}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="contact">Contact Number</Label>
              <Input
                id="contact"
                {...register("contact", { 
                  required: "Contact number is required",
                  pattern: {
                    value: /^\d{10}$/,
                    message: "Please enter a valid 10-digit contact number"
                  }
                })}
                placeholder="Enter 10-digit contact number"
              />
              {errors.contact && <p className="text-sm text-red-500">{errors.contact.message}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="courseInterested">Course Interested</Label>
              <Controller
                name="courseInterested"
                control={control}
                rules={{ required: "Please select a course" }}
                render={({ field }) => (
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a course" />
                    </SelectTrigger>
                    <SelectContent>
                      {courses.map(course => (
                        <SelectItem key={course} value={course}>{course}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
              {errors.courseInterested && <p className="text-sm text-red-500">{errors.courseInterested.message}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="source">Lead Source</Label>
              <Controller
                name="source"
                control={control}
                rules={{ required: "Please select a source" }}
                render={({ field }) => (
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select lead source" />
                    </SelectTrigger>
                    <SelectContent>
                      {sources.map(source => (
                        <SelectItem key={source} value={source}>{source}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
              {errors.source && <p className="text-sm text-red-500">{errors.source.message}</p>}
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onCancel}>
              Cancel
            </Button>
            <Button type="submit" className="bg-green-600 hover:bg-green-700">
              Add Record
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
