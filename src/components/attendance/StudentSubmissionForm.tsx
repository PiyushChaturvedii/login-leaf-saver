
import { useState } from 'react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface StudentSubmissionFormProps {
  submittedCode: string;
  setSubmittedCode: (code: string) => void;
  submitAttendance: (e: React.FormEvent) => void;
}

export const StudentSubmissionForm = ({
  submittedCode,
  setSubmittedCode,
  submitAttendance
}: StudentSubmissionFormProps) => {
  return (
    <form onSubmit={submitAttendance} className="space-y-4">
      <div className="relative">
        <Input
          placeholder="Enter Attendance Code"
          value={submittedCode}
          onChange={(e) => setSubmittedCode(e.target.value.toUpperCase())}
          required
          className="border-indigo-100 pr-24 font-mono uppercase tracking-wider text-center text-lg h-12"
          maxLength={6}
        />
        <Button 
          type="submit" 
          className="absolute right-1 top-1 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 h-10"
        >
          Submit
        </Button>
      </div>
    </form>
  );
};
