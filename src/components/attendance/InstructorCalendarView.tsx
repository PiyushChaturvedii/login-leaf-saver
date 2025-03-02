
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";

interface InstructorCalendarViewProps {
  sessionDate: Date | undefined;
  setSessionDate: (date: Date | undefined) => void;
  selectedMonth: Date;
  setSelectedMonth: (date: Date) => void;
  getDaysWithSessions: () => Date[];
  getSessionsForDate: (date: Date) => string[];
  isDateInMonth: (date: Date, month: Date) => boolean;
}

export const InstructorCalendarView = ({
  sessionDate,
  setSessionDate,
  selectedMonth,
  setSelectedMonth,
  getDaysWithSessions,
  getSessionsForDate,
  isDateInMonth
}: InstructorCalendarViewProps) => {
  return (
    <div className="p-1">
      <div className="flex justify-between items-center mb-4">
        <h4 className="font-medium text-gray-700">
          Session Calendar
        </h4>
        <div>
          <Button 
            variant="outline"
            size="sm"
            onClick={() => setSelectedMonth(new Date())}
            className="text-xs"
          >
            Today
          </Button>
        </div>
      </div>
      
      <div className="border border-indigo-100 rounded-lg overflow-hidden bg-white">
        <Calendar
          mode="single"
          selected={sessionDate}
          onSelect={setSessionDate}
          className="rounded-md"
          onMonthChange={setSelectedMonth}
          defaultMonth={selectedMonth}
          modifiers={{
            hasSessions: getDaysWithSessions().filter(date => isDateInMonth(date, selectedMonth))
          }}
          modifiersClassNames={{
            hasSessions: "bg-indigo-100 font-bold text-indigo-700"
          }}
        />
      </div>
      
      {sessionDate && (
        <div className="mt-4 p-4 border border-indigo-100 rounded-lg">
          <h5 className="font-medium text-gray-700 mb-2">
            {format(sessionDate, "MMMM d, yyyy")}
          </h5>
          {getSessionsForDate(sessionDate).length > 0 ? (
            <div className="space-y-2">
              <p className="text-sm text-gray-600">Sessions on this day:</p>
              <ul className="space-y-1">
                {getSessionsForDate(sessionDate).map((session, idx) => (
                  <li key={idx} className="text-sm bg-indigo-50 px-3 py-2 rounded-md text-indigo-700">
                    {session}
                  </li>
                ))}
              </ul>
            </div>
          ) : (
            <p className="text-sm text-gray-500 italic">No sessions on this day</p>
          )}
        </div>
      )}
    </div>
  );
};
