
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BookOpen, Calendar, CreditCard, Users, FileText, Layout } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface QuickLinksProps {
  userRole: string;
}

export const QuickLinks = ({ userRole }: QuickLinksProps) => {
  const navigate = useNavigate();

  const getLinks = () => {
    // Common links for all roles
    const commonLinks = [
      {
        title: "प्रोजेक्ट्स",
        description: "कोर्स सामग्री और प्रोजेक्ट एक्सेस करें",
        icon: <BookOpen className="h-5 w-5" />,
        action: () => navigate('/course-materials'),
        color: "from-amber-600 to-yellow-600 hover:from-amber-700 hover:to-yellow-700"
      },
      {
        title: "अटेंडेंस",
        description: userRole === 'student' ? "अपनी उपस्थिति देखें" : "उपस्थिति रिकॉर्ड करें",
        icon: <Calendar className="h-5 w-5" />,
        action: () => navigate('/attendance'),
        color: "from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
      },
    ];
    
    // Role-specific links
    const roleLinks = {
      admin: [
        {
          title: "यूजर मैनेजमेंट",
          description: "छात्रों और शिक्षकों का प्रबंधन करें",
          icon: <Users className="h-5 w-5" />,
          action: () => navigate('/user-management'),
          color: "from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
        },
        {
          title: "फीस मैनेजमेंट",
          description: "भुगतान और फीस विवरण का प्रबंधन करें",
          icon: <CreditCard className="h-5 w-5" />,
          action: () => navigate('/fees'),
          color: "from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700"
        },
        {
          title: "रिपोर्ट",
          description: "सिस्टम रिपोर्ट और एनालिटिक्स देखें",
          icon: <FileText className="h-5 w-5" />,
          action: () => navigate('/report'),
          color: "from-gray-600 to-gray-700 hover:from-gray-700 hover:to-gray-800"
        },
      ],
      instructor: [
        {
          title: "छात्र प्रगति",
          description: "अपने छात्रों की प्रगति ट्रैक करें",
          icon: <Layout className="h-5 w-5" />,
          action: () => navigate('/reports'),
          color: "from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700"
        }
      ],
      student: [
        {
          title: "फीस और भुगतान",
          description: "भुगतान विवरण और रसीदें देखें",
          icon: <CreditCard className="h-5 w-5" />,
          action: () => navigate('/fees'),
          color: "from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700"
        }
      ],
      accounting: [
        {
          title: "फीस मैनेजमेंट",
          description: "भुगतान और फीस विवरण का प्रबंधन करें",
          icon: <CreditCard className="h-5 w-5" />,
          action: () => navigate('/fees'),
          color: "from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700"
        }
      ]
    };
    
    return [...commonLinks, ...(roleLinks[userRole as keyof typeof roleLinks] || [])];
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>क्विक लिंक्स</CardTitle>
        <CardDescription>अपने प्रमुख मॉड्यूल्स तक पहुंचें</CardDescription>
      </CardHeader>
      <CardContent className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {getLinks().map((link, index) => (
          <Button
            key={index}
            onClick={link.action}
            className={`h-auto py-4 justify-start bg-gradient-to-r ${link.color} shadow hover:shadow-md transition-all duration-200`}
          >
            <div className="mr-3">{link.icon}</div>
            <div className="text-left">
              <div className="font-medium">{link.title}</div>
              <div className="text-xs opacity-90">{link.description}</div>
            </div>
          </Button>
        ))}
      </CardContent>
    </Card>
  );
};
