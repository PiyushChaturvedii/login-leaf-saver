
import React, { useState } from 'react';
import { DashboardLayout } from '@/components/dashboard/DashboardLayout';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useForm } from 'react-hook-form';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { AspectRatio } from '@/components/ui/aspect-ratio';
import { Skeleton } from '@/components/ui/skeleton';
import { X, Upload, FileText, CreditCard, User } from 'lucide-react';
import { toast } from 'sonner';

interface ProfileFormData {
  name: string;
  email: string;
  phone: string;
  emergencyContact: string;
  emergencyName: string;
  accountNumber: string;
  ifsc: string;
  bankName: string;
}

interface FileUpload {
  id: string;
  name: string;
  type: string;
  preview: string;
}

export const SalesProfile: React.FC = () => {
  const [activeTab, setActiveTab] = useState('personal');
  const [uploads, setUploads] = useState<Record<string, FileUpload[]>>({
    marksheet: [],
    idProof: [],
    bankDetails: []
  });
  
  // In a real app, this data would be fetched from an API
  const userData = {
    name: "Aditya Sharma",
    email: "aditya.sharma@example.com",
    phone: "9876543210",
    role: "Sales Executive",
    joinDate: "2023-01-15",
    emergencyContact: "",
    emergencyName: "",
    accountNumber: "",
    ifsc: "",
    bankName: ""
  };
  
  const { register, handleSubmit, formState: { errors } } = useForm<ProfileFormData>({
    defaultValues: userData
  });
  
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>, category: string) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    // Create a preview URL for the file
    const fileReader = new FileReader();
    fileReader.onload = () => {
      const newUpload: FileUpload = {
        id: Date.now().toString(),
        name: file.name,
        type: file.type,
        preview: fileReader.result as string
      };
      
      setUploads(prev => ({
        ...prev,
        [category]: [...prev[category], newUpload]
      }));
    };
    fileReader.readAsDataURL(file);
    
    // Reset the input value so the same file can be uploaded again if needed
    e.target.value = '';
    
    toast.success(`File ${file.name} uploaded successfully!`);
  };
  
  const removeFile = (category: string, id: string) => {
    setUploads(prev => ({
      ...prev,
      [category]: prev[category].filter(upload => upload.id !== id)
    }));
    
    toast.success("File removed successfully!");
  };
  
  const onSubmit = (data: ProfileFormData) => {
    console.log('Profile data submitted:', data);
    toast.success("Profile updated successfully!");
  };

  const renderFilePreview = (file: FileUpload) => {
    if (file.type.startsWith('image/')) {
      return (
        <AspectRatio ratio={16/9} className="bg-gray-100 rounded-md overflow-hidden">
          <img 
            src={file.preview} 
            alt={file.name}
            className="w-full h-full object-cover"
          />
        </AspectRatio>
      );
    }
    
    // For non-image files like PDFs
    return (
      <div className="bg-gray-100 rounded-md p-4 flex items-center justify-center h-full">
        <FileText className="h-10 w-10 text-gray-500" />
        <span className="ml-2 text-sm font-medium truncate">{file.name}</span>
      </div>
    );
  };

  return (
    <DashboardLayout>
      <div className="container mx-auto p-4 max-w-4xl">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-green-800">Your Profile</h1>
          <p className="text-gray-600">Manage your personal information and documents</p>
        </div>
        
        <Tabs defaultValue="personal" value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid grid-cols-3 mb-8">
            <TabsTrigger value="personal" className="flex items-center gap-2">
              <User className="h-4 w-4" />
              <span>Personal Info</span>
            </TabsTrigger>
            <TabsTrigger value="documents" className="flex items-center gap-2">
              <FileText className="h-4 w-4" />
              <span>Documents</span>
            </TabsTrigger>
            <TabsTrigger value="bank" className="flex items-center gap-2">
              <CreditCard className="h-4 w-4" />
              <span>Bank Details</span>
            </TabsTrigger>
          </TabsList>
          
          <form onSubmit={handleSubmit(onSubmit)}>
            <TabsContent value="personal">
              <Card>
                <CardHeader>
                  <CardTitle>Personal Information</CardTitle>
                  <CardDescription>Update your personal details and emergency contact</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Full Name</Label>
                      <Input 
                        id="name" 
                        {...register("name", { required: "Name is required" })}
                      />
                      {errors.name && <p className="text-sm text-red-500">{errors.name.message}</p>}
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input 
                        id="email" 
                        {...register("email", { required: "Email is required" })}
                        disabled
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone Number</Label>
                      <Input 
                        id="phone" 
                        {...register("phone", { required: "Phone number is required" })}
                      />
                      {errors.phone && <p className="text-sm text-red-500">{errors.phone.message}</p>}
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="role">Role</Label>
                      <Input id="role" defaultValue={userData.role} disabled />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="emergencyName">Emergency Contact Name</Label>
                      <Input 
                        id="emergencyName" 
                        {...register("emergencyName", { required: "Emergency contact name is required" })}
                      />
                      {errors.emergencyName && <p className="text-sm text-red-500">{errors.emergencyName.message}</p>}
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="emergencyContact">Emergency Contact Number</Label>
                      <Input 
                        id="emergencyContact" 
                        {...register("emergencyContact", { required: "Emergency contact number is required" })}
                      />
                      {errors.emergencyContact && <p className="text-sm text-red-500">{errors.emergencyContact.message}</p>}
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button type="submit" className="bg-green-600 hover:bg-green-700">
                    Update Profile
                  </Button>
                </CardFooter>
              </Card>
            </TabsContent>
            
            <TabsContent value="documents">
              <Card>
                <CardHeader>
                  <CardTitle>Documents</CardTitle>
                  <CardDescription>Upload your marksheet and ID proof documents</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <Label>Marksheet</Label>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {uploads.marksheet.map(file => (
                        <div key={file.id} className="relative h-40 border rounded-md p-2">
                          {renderFilePreview(file)}
                          <Button 
                            type="button"
                            variant="destructive" 
                            size="icon" 
                            className="absolute top-2 right-2 h-6 w-6" 
                            onClick={() => removeFile('marksheet', file.id)}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                      
                      <div className="h-40 border-2 border-dashed rounded-md flex flex-col items-center justify-center cursor-pointer hover:bg-gray-50 transition-colors p-4"
                        onClick={() => document.getElementById('marksheet-upload')?.click()}
                      >
                        <Upload className="h-10 w-10 text-gray-400" />
                        <p className="mt-2 text-sm text-gray-500">Click to upload marksheet</p>
                        <p className="text-xs text-gray-400">PDF, JPG, PNG up to 10MB</p>
                        <Input 
                          id="marksheet-upload" 
                          type="file" 
                          className="hidden" 
                          onChange={(e) => handleFileUpload(e, 'marksheet')}
                          accept=".pdf,.jpg,.jpeg,.png"
                        />
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <Label>ID Proof</Label>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {uploads.idProof.map(file => (
                        <div key={file.id} className="relative h-40 border rounded-md p-2">
                          {renderFilePreview(file)}
                          <Button 
                            type="button"
                            variant="destructive" 
                            size="icon" 
                            className="absolute top-2 right-2 h-6 w-6" 
                            onClick={() => removeFile('idProof', file.id)}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                      
                      <div className="h-40 border-2 border-dashed rounded-md flex flex-col items-center justify-center cursor-pointer hover:bg-gray-50 transition-colors p-4"
                        onClick={() => document.getElementById('id-proof-upload')?.click()}
                      >
                        <Upload className="h-10 w-10 text-gray-400" />
                        <p className="mt-2 text-sm text-gray-500">Click to upload ID proof</p>
                        <p className="text-xs text-gray-400">PDF, JPG, PNG up to 10MB</p>
                        <Input 
                          id="id-proof-upload" 
                          type="file" 
                          className="hidden" 
                          onChange={(e) => handleFileUpload(e, 'idProof')}
                          accept=".pdf,.jpg,.jpeg,.png"
                        />
                      </div>
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button 
                    type="button" 
                    className="bg-green-600 hover:bg-green-700"
                    onClick={() => setActiveTab('bank')}
                  >
                    Next: Bank Details
                  </Button>
                </CardFooter>
              </Card>
            </TabsContent>
            
            <TabsContent value="bank">
              <Card>
                <CardHeader>
                  <CardTitle>Bank Details</CardTitle>
                  <CardDescription>Provide your bank account information for salary payments</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="accountNumber">Account Number</Label>
                      <Input 
                        id="accountNumber" 
                        {...register("accountNumber", { required: "Account number is required" })}
                      />
                      {errors.accountNumber && <p className="text-sm text-red-500">{errors.accountNumber.message}</p>}
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="ifsc">IFSC Code</Label>
                      <Input 
                        id="ifsc" 
                        {...register("ifsc", { required: "IFSC code is required" })}
                      />
                      {errors.ifsc && <p className="text-sm text-red-500">{errors.ifsc.message}</p>}
                    </div>
                    
                    <div className="space-y-2 md:col-span-2">
                      <Label htmlFor="bankName">Bank Name</Label>
                      <Input 
                        id="bankName" 
                        {...register("bankName", { required: "Bank name is required" })}
                      />
                      {errors.bankName && <p className="text-sm text-red-500">{errors.bankName.message}</p>}
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <Label>Bank Proof (Optional)</Label>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {uploads.bankDetails.map(file => (
                        <div key={file.id} className="relative h-40 border rounded-md p-2">
                          {renderFilePreview(file)}
                          <Button 
                            type="button"
                            variant="destructive" 
                            size="icon" 
                            className="absolute top-2 right-2 h-6 w-6" 
                            onClick={() => removeFile('bankDetails', file.id)}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                      
                      <div className="h-40 border-2 border-dashed rounded-md flex flex-col items-center justify-center cursor-pointer hover:bg-gray-50 transition-colors p-4"
                        onClick={() => document.getElementById('bank-proof-upload')?.click()}
                      >
                        <Upload className="h-10 w-10 text-gray-400" />
                        <p className="mt-2 text-sm text-gray-500">Click to upload bank proof</p>
                        <p className="text-xs text-gray-400">PDF, JPG, PNG up to 10MB</p>
                        <Input 
                          id="bank-proof-upload" 
                          type="file" 
                          className="hidden" 
                          onChange={(e) => handleFileUpload(e, 'bankDetails')}
                          accept=".pdf,.jpg,.jpeg,.png"
                        />
                      </div>
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button type="submit" className="bg-green-600 hover:bg-green-700">
                    Save Bank Details
                  </Button>
                </CardFooter>
              </Card>
            </TabsContent>
          </form>
        </Tabs>
      </div>
    </DashboardLayout>
  );
};
