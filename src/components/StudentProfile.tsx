
import { useState } from 'react';
import { Card } from "@/components/ui/card";
import { User, Camera } from 'lucide-react';

interface ProfileProps {
  userData: {
    name: string;
    email: string;
    photo?: string;
    college?: string;
    course?: string;
    github?: string;
    linkedin?: string;
    whatsapp?: string;
  };
}

export const StudentProfile = ({ userData }: ProfileProps) => {
  const [profilePhoto, setProfilePhoto] = useState<string>(userData.photo || '');
  const fees = JSON.parse(localStorage.getItem('users') || '[]')
    .find((user: any) => user.email === userData.email)?.fees;

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        setProfilePhoto(base64String);
        
        const users = JSON.parse(localStorage.getItem('users') || '[]');
        const updatedUsers = users.map((user: any) =>
          user.email === userData.email ? { ...user, photo: base64String } : user
        );
        localStorage.setItem('users', JSON.stringify(updatedUsers));
        localStorage.setItem('currentUser', JSON.stringify({ ...userData, photo: base64String }));
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <Card className="p-6 bg-white shadow-lg">
      <h3 className="text-lg font-medium text-gray-800 mb-4">Student Profile</h3>
      <div className="space-y-4">
        <div className="flex items-center space-x-4">
          <div className="relative">
            {profilePhoto || userData.photo ? (
              <img
                src={profilePhoto || userData.photo}
                alt="Profile"
                className="w-24 h-24 rounded-full object-cover"
              />
            ) : (
              <div className="w-24 h-24 rounded-full bg-gray-200 flex items-center justify-center">
                <User className="w-12 h-12 text-gray-400" />
              </div>
            )}
            <label className="absolute bottom-0 right-0 bg-white rounded-full p-2 shadow-lg cursor-pointer">
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handlePhotoUpload}
              />
              <Camera className="w-4 h-4 text-gray-600" />
            </label>
          </div>
          <div>
            <h4 className="text-xl font-semibold">{userData.name}</h4>
            <p className="text-gray-600">{userData.email}</p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium text-gray-600">College</label>
            <p className="mt-1">{userData.college}</p>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-600">Course</label>
            <p className="mt-1">{userData.course}</p>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-600">GitHub</label>
            <a
              href={userData.github}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-1 text-blue-600 hover:underline block"
            >
              {userData.github}
            </a>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-600">LinkedIn</label>
            <a
              href={userData.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-1 text-blue-600 hover:underline block"
            >
              {userData.linkedin}
            </a>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-600">WhatsApp</label>
            <p className="mt-1">{userData.whatsapp}</p>
          </div>
        </div>

        {fees && (
          <div className="mt-8">
            <h4 className="text-lg font-medium text-gray-800 mb-4">Fee Details</h4>
            <div className="grid grid-cols-2 gap-4 bg-gray-50 p-4 rounded-lg">
              <div>
                <label className="text-sm font-medium text-gray-600">Base Amount</label>
                <p className="mt-1">₹{fees.amount}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600">GST (18%)</label>
                <p className="mt-1">₹{fees.gstAmount}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600">Total Amount</label>
                <p className="mt-1">₹{fees.totalAmount}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600">Amount Paid</label>
                <p className="mt-1">₹{fees.paid}</p>
              </div>
              {fees.emiPlan && (
                <>
                  <div>
                    <label className="text-sm font-medium text-gray-600">EMI Amount</label>
                    <p className="mt-1">₹{fees.emiPlan.emiAmount}/month</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">EMIs Status</label>
                    <p className="mt-1">{fees.emiPlan.paidEmis} paid of {fees.emiPlan.totalEmis} total</p>
                  </div>
                </>
              )}
              {fees.lastPaid && (
                <div className="col-span-2">
                  <label className="text-sm font-medium text-gray-600">Last Payment Date</label>
                  <p className="mt-1">{new Date(fees.lastPaid).toLocaleDateString()}</p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </Card>
  );
};

