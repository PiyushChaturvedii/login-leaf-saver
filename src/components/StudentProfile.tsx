
import { useState } from 'react';
import { Card } from "@/components/ui/card";
import { User, Camera, Book, Building, Github, Linkedin, Phone } from 'lucide-react';

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
    <Card className="p-6 bg-white shadow-xl rounded-xl border-indigo-100 overflow-hidden relative animate-fade-in">
      <div className="absolute top-0 right-0 w-40 h-40 bg-indigo-100 rounded-full -mt-20 -mr-20 opacity-30"></div>
      <div className="absolute bottom-0 left-0 w-32 h-32 bg-purple-100 rounded-full -mb-16 -ml-16 opacity-30"></div>
      
      <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center">
        <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
          Student Profile
        </span>
      </h3>
      
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row items-center md:space-x-6 animate-fade-in" style={{ animationDelay: '100ms' }}>
          <div className="relative group mb-4 md:mb-0">
            {profilePhoto || userData.photo ? (
              <img
                src={profilePhoto || userData.photo}
                alt="Profile"
                className="w-28 h-28 rounded-full object-cover border-4 border-indigo-100 shadow-md transition-transform duration-300 group-hover:scale-105"
              />
            ) : (
              <div className="w-28 h-28 rounded-full bg-gradient-to-br from-indigo-100 to-purple-100 flex items-center justify-center border-4 border-indigo-50 shadow-md">
                <User className="w-14 h-14 text-indigo-400" />
              </div>
            )}
            <label className="absolute bottom-0 right-0 bg-white rounded-full p-2 shadow-lg cursor-pointer border border-indigo-100 transform transition-transform duration-300 hover:scale-110">
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handlePhotoUpload}
              />
              <Camera className="w-4 h-4 text-indigo-600" />
            </label>
          </div>
          <div className="text-center md:text-left">
            <h4 className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">{userData.name}</h4>
            <p className="text-gray-600 mt-1">{userData.email}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-fade-in" style={{ animationDelay: '200ms' }}>
          <div className="flex items-center space-x-3 bg-indigo-50 p-4 rounded-lg transform transition-transform duration-300 hover:translate-y-[-2px] hover:shadow-md">
            <Building className="w-5 h-5 text-indigo-600" />
            <div>
              <label className="text-sm font-medium text-gray-600">College</label>
              <p className="mt-1 font-medium">{userData.college || 'Not specified'}</p>
            </div>
          </div>
          <div className="flex items-center space-x-3 bg-purple-50 p-4 rounded-lg transform transition-transform duration-300 hover:translate-y-[-2px] hover:shadow-md">
            <Book className="w-5 h-5 text-purple-600" />
            <div>
              <label className="text-sm font-medium text-gray-600">Course</label>
              <p className="mt-1 font-medium">{userData.course || 'Not specified'}</p>
            </div>
          </div>
          <div className="flex items-center space-x-3 bg-blue-50 p-4 rounded-lg transform transition-transform duration-300 hover:translate-y-[-2px] hover:shadow-md">
            <Github className="w-5 h-5 text-blue-600" />
            <div>
              <label className="text-sm font-medium text-gray-600">GitHub</label>
              {userData.github ? (
                <a
                  href={userData.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-1 text-blue-600 hover:text-blue-800 hover:underline block font-medium"
                >
                  {userData.github.replace('https://github.com/', '@')}
                </a>
              ) : (
                <p className="mt-1 font-medium">Not specified</p>
              )}
            </div>
          </div>
          <div className="flex items-center space-x-3 bg-pink-50 p-4 rounded-lg transform transition-transform duration-300 hover:translate-y-[-2px] hover:shadow-md">
            <Linkedin className="w-5 h-5 text-pink-600" />
            <div>
              <label className="text-sm font-medium text-gray-600">LinkedIn</label>
              {userData.linkedin ? (
                <a
                  href={userData.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-1 text-pink-600 hover:text-pink-800 hover:underline block font-medium"
                >
                  {userData.linkedin.replace('https://www.linkedin.com/in/', '@')}
                </a>
              ) : (
                <p className="mt-1 font-medium">Not specified</p>
              )}
            </div>
          </div>
          <div className="flex items-center space-x-3 bg-green-50 p-4 rounded-lg transform transition-transform duration-300 hover:translate-y-[-2px] hover:shadow-md">
            <Phone className="w-5 h-5 text-green-600" />
            <div>
              <label className="text-sm font-medium text-gray-600">WhatsApp</label>
              <p className="mt-1 font-medium">{userData.whatsapp || 'Not specified'}</p>
            </div>
          </div>
        </div>

        {fees && (
          <div className="mt-8 animate-fade-in" style={{ animationDelay: '300ms' }}>
            <h4 className="text-lg font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-4">Fee Details</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-gradient-to-br from-indigo-50 to-purple-50 p-6 rounded-xl shadow-inner">
              <div className="bg-white p-3 rounded-lg shadow-sm">
                <label className="text-sm font-medium text-gray-600">Base Amount</label>
                <p className="mt-1 text-xl font-bold text-indigo-700">₹{fees.amount.toLocaleString()}</p>
              </div>
              <div className="bg-white p-3 rounded-lg shadow-sm">
                <label className="text-sm font-medium text-gray-600">GST (18%)</label>
                <p className="mt-1 text-xl font-bold text-purple-700">₹{fees.gstAmount.toLocaleString()}</p>
              </div>
              <div className="bg-white p-3 rounded-lg shadow-sm">
                <label className="text-sm font-medium text-gray-600">Total Amount</label>
                <p className="mt-1 text-xl font-bold text-blue-700">₹{fees.totalAmount.toLocaleString()}</p>
              </div>
              <div className="bg-white p-3 rounded-lg shadow-sm">
                <label className="text-sm font-medium text-gray-600">Amount Paid</label>
                <p className="mt-1 text-xl font-bold text-green-700">₹{fees.paid.toLocaleString()}</p>
              </div>
              {fees.emiPlan && (
                <>
                  <div className="bg-white p-3 rounded-lg shadow-sm">
                    <label className="text-sm font-medium text-gray-600">EMI Amount</label>
                    <p className="mt-1 text-xl font-bold text-pink-700">₹{fees.emiPlan.emiAmount.toLocaleString()}/month</p>
                  </div>
                  <div className="bg-white p-3 rounded-lg shadow-sm">
                    <label className="text-sm font-medium text-gray-600">EMIs Status</label>
                    <p className="mt-1 text-xl font-bold text-indigo-700">{fees.emiPlan.paidEmis} paid of {fees.emiPlan.totalEmis} total</p>
                  </div>
                </>
              )}
              {fees.lastPaid && (
                <div className="col-span-2 bg-white p-3 rounded-lg shadow-sm">
                  <label className="text-sm font-medium text-gray-600">Last Payment Date</label>
                  <p className="mt-1 text-xl font-bold text-gray-700">{new Date(fees.lastPaid).toLocaleDateString()}</p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </Card>
  );
};
