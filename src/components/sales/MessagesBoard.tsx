
import React, { useState, useEffect } from 'react';
import { DashboardLayout } from '@/components/dashboard/DashboardLayout';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Bell, MessageSquare, Pin } from 'lucide-react';
import { formatDate } from '@/utils/dateUtils';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface Message {
  id: number;
  title: string;
  content: string;
  date: Date;
  isRead: boolean;
  type: 'announcement' | 'notification' | 'motivation';
  isPinned?: boolean;
}

export const MessagesBoard: React.FC = () => {
  // In a real app, this would come from an API
  const initialMessages: Message[] = [
    {
      id: 1,
      title: "May Sales Target",
      content: "This month's conversion target is 20 students. Keep up the good work!",
      date: new Date(2023, 4, 1),
      isRead: true,
      type: 'announcement',
      isPinned: true
    },
    {
      id: 2,
      title: "New Course Announcement",
      content: "We've launched a new AI and Machine Learning course. Please promote this to interested students.",
      date: new Date(2023, 4, 5),
      isRead: false,
      type: 'announcement'
    },
    {
      id: 3,
      title: "Great job on conversions!",
      content: "Congratulations on achieving 80% of your monthly target already. Keep pushing for excellence!",
      date: new Date(2023, 4, 10),
      isRead: true,
      type: 'motivation'
    },
    {
      id: 4,
      title: "Team Meeting",
      content: "Don't forget the sales team meeting tomorrow at 10:00 AM. We'll be discussing strategies for increasing conversions.",
      date: new Date(2023, 4, 12),
      isRead: false,
      type: 'notification'
    },
    {
      id: 5,
      title: "Success is a journey, not a destination",
      content: "Remember that every call you make and every conversation you have is a step towards success. It's the persistent efforts that lead to great results.",
      date: new Date(2023, 4, 8),
      isRead: false,
      type: 'motivation',
      isPinned: true
    }
  ];

  const [messages, setMessages] = useState(initialMessages);
  const [activeTab, setActiveTab] = useState<string>('all');
  
  const handleReadMessage = (id: number) => {
    setMessages(prevMessages =>
      prevMessages.map(message =>
        message.id === id ? { ...message, isRead: true } : message
      )
    );
  };

  const filteredMessages = activeTab === 'all' 
    ? messages 
    : messages.filter(message => message.type === activeTab);
    
  const pinnedMessages = filteredMessages.filter(m => m.isPinned);
  const unpinnedMessages = filteredMessages.filter(m => !m.isPinned);
  
  const sortedMessages = [
    ...pinnedMessages.sort((a, b) => b.date.getTime() - a.date.getTime()),
    ...unpinnedMessages.sort((a, b) => b.date.getTime() - a.date.getTime())
  ];
  
  const unreadCount = messages.filter(m => !m.isRead).length;
  
  const getMessageIcon = (type: string) => {
    switch (type) {
      case 'announcement': return <Bell className="h-5 w-5 text-blue-500" />;
      case 'motivation': return <MessageSquare className="h-5 w-5 text-green-500" />;
      case 'notification': return <Bell className="h-5 w-5 text-amber-500" />;
      default: return <MessageSquare className="h-5 w-5 text-gray-500" />;
    }
  };

  return (
    <DashboardLayout>
      <div className="container mx-auto p-4 max-w-5xl">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold text-green-800">Messages & Announcements</h1>
            <p className="text-gray-600">Stay updated with important information</p>
          </div>
          {unreadCount > 0 && (
            <Badge className="bg-blue-500">{unreadCount} unread</Badge>
          )}
        </div>
        
        <Tabs defaultValue="all" onValueChange={setActiveTab}>
          <div className="flex justify-between items-center mb-4">
            <TabsList>
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="announcement">Announcements</TabsTrigger>
              <TabsTrigger value="notification">Notifications</TabsTrigger>
              <TabsTrigger value="motivation">Motivational</TabsTrigger>
            </TabsList>
          </div>
          
          <TabsContent value={activeTab} className="mt-0">
            <div className="space-y-4">
              {sortedMessages.length > 0 ? (
                sortedMessages.map((message) => (
                  <Card 
                    key={message.id} 
                    className={`
                      transition-all hover:shadow-md
                      ${!message.isRead ? 'border-l-4 border-l-blue-500' : ''}
                      ${message.isPinned ? 'bg-amber-50' : ''}
                    `}
                    onClick={() => handleReadMessage(message.id)}
                  >
                    <CardHeader className="pb-2">
                      <div className="flex justify-between items-start">
                        <div className="flex items-center gap-2">
                          {getMessageIcon(message.type)}
                          <CardTitle className="text-lg">{message.title}</CardTitle>
                          {message.isPinned && (
                            <Pin className="h-4 w-4 text-amber-500" />
                          )}
                        </div>
                        <CardDescription>{formatDate(message.date)}</CardDescription>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-gray-700">{message.content}</p>
                    </CardContent>
                  </Card>
                ))
              ) : (
                <Card>
                  <CardContent className="flex flex-col items-center justify-center py-10">
                    <MessageSquare className="h-10 w-10 text-gray-400 mb-4" />
                    <p className="text-gray-500">No messages found</p>
                  </CardContent>
                </Card>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
};
