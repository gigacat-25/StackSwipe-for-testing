
'use client';

import { useState, useEffect } from 'react';
import { Send, Search, User as UserIcon } from 'lucide-react';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';
import { conversations as initialConversations, type Conversation, type Message, type UserProfile } from '@/lib/data';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { getAllUsers } from '@/lib/users';


export default function MessagesPage() {
  const [conversations, setConversations] = useState<Conversation[]>(initialConversations);
  const [activeConversation, setActiveConversation] = useState<Conversation | null>(conversations.length > 0 ? conversations[0] : null);
  const [messages, setMessages] = useState<Message[]>(activeConversation ? activeConversation.messages : []);
  const [newMessage, setNewMessage] = useState('');

  useEffect(() => {
    // In a real app, you'd fetch conversations from a service
    // For now, we'll just use the mock data and enrich it with profile info
    const fetchUsersAndBuildConversations = async () => {
        const users = await getAllUsers();
        const existingContactIds = new Set(initialConversations.map(c => c.contactId));
        
        const newConversationsFromUsers = users
            .filter(user => !existingContactIds.has(user.id))
            .map((user: UserProfile) => ({
                contactId: user.id,
                contactName: user.name,
                messages: [],
            }));

        const allConversations = [...initialConversations, ...newConversationsFromUsers];
        setConversations(allConversations);
        if (!activeConversation && allConversations.length > 0) {
            setActiveConversation(allConversations[0]);
            setMessages(allConversations[0].messages);
        }
    };
    fetchUsersAndBuildConversations();
  }, [activeConversation]);

  const handleSelectConversation = (conversation: Conversation) => {
    setActiveConversation(conversation);
    setMessages(conversation.messages);
  };
  
  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (newMessage.trim() === '' || !activeConversation) return;

    const message: Message = {
      id: (messages.length + 1).toString(),
      sender: 'me',
      text: newMessage,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };
    
    const updatedMessages = [...messages, message];
    setMessages(updatedMessages);

    // Update the conversation in the state
    const updatedConversations = conversations.map(convo => 
        convo.contactId === activeConversation.contactId 
        ? { ...convo, messages: updatedMessages } 
        : convo
    );
    setConversations(updatedConversations);
    
    setNewMessage('');
  };
  
  if (!activeConversation) {
    return (
        <div className="h-[calc(100vh-2rem)] m-4 grid grid-cols-1 md:grid-cols-12 gap-4">
             <Card className="md:col-span-4 lg:col-span-3 flex flex-col h-full">
                <CardHeader className="p-4 border-b">
                <div className="relative">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input placeholder="Search messages..." className="pl-8" />
                </div>
                </CardHeader>
                <CardContent className="p-0 flex-1">
                    <ScrollArea className="h-full">
                         <div className="p-4 text-center text-muted-foreground">No conversations found.</div>
                    </ScrollArea>
                </CardContent>
            </Card>
             <Card className="md:col-span-8 lg:col-span-9 flex flex-col h-full items-center justify-center">
                <CardContent>
                    <p>Select a conversation to start chatting.</p>
                </CardContent>
            </Card>
        </div>
    );
  }


  return (
    <div className="h-[calc(100vh-2rem)] m-4 grid grid-cols-1 md:grid-cols-12 gap-4">
      <Card className="md:col-span-4 lg:col-span-3 flex flex-col h-full">
        <CardHeader className="p-4 border-b">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Search messages..." className="pl-8" />
          </div>
        </CardHeader>
        <CardContent className="p-0 flex-1">
          <ScrollArea className="h-full">
            <div className="space-y-1 p-2">
              {conversations.map((convo) => (
                <button
                  key={convo.contactId}
                  onClick={() => handleSelectConversation(convo)}
                  className={cn(
                    'flex w-full items-center gap-3 rounded-lg p-3 text-left transition-colors hover:bg-accent',
                    activeConversation?.contactId === convo.contactId && 'bg-accent'
                  )}
                >
                  <Avatar>
                    <AvatarFallback>{convo.contactName.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1 truncate">
                    <p className="font-semibold">{convo.contactName}</p>
                    {convo.messages.length > 0 &&
                        <p className="text-sm text-muted-foreground truncate">{convo.messages.slice(-1)[0].text}</p>
                    }
                  </div>
                </button>
              ))}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>

      <Card className="md:col-span-8 lg:col-span-9 flex flex-col h-full">
          <CardHeader className="flex flex-row items-center gap-4 p-4 border-b">
             <Avatar>
                <AvatarFallback>{activeConversation.contactName.charAt(0)}</AvatarFallback>
            </Avatar>
            <h2 className="text-lg font-semibold">{activeConversation.contactName}</h2>
          </CardHeader>
          <CardContent className="flex-1 p-4 overflow-hidden">
            <ScrollArea className="h-full">
              <div className="space-y-4">
                  {messages.map((message) => (
                      <div key={message.id} className={cn('flex items-end gap-2', message.sender === 'me' ? 'justify-end' : 'justify-start')}>
                          {message.sender === 'them' && <Avatar className="h-8 w-8"><AvatarFallback>{activeConversation.contactName.charAt(0)}</AvatarFallback></Avatar>}
                          <div className={cn(
                              "max-w-xs md:max-w-md lg:max-w-lg rounded-xl px-4 py-2", 
                              message.sender === 'me' ? 'bg-primary text-primary-foreground' : 'bg-secondary'
                          )}>
                              <p>{message.text}</p>
                              <p className="text-xs opacity-70 mt-1 text-right">{message.timestamp}</p>
                          </div>
                      </div>
                  ))}
              </div>
            </ScrollArea>
          </CardContent>
          <div className="p-4 border-t">
            <form onSubmit={handleSendMessage} className="flex items-center gap-2">
              <Input 
                placeholder="Type a message..." 
                className="flex-1" 
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
              />
              <Button type="submit" size="icon">
                <Send className="h-4 w-4" />
              </Button>
            </form>
          </div>
      </Card>
    </div>
  );
}
