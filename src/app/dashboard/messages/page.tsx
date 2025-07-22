
'use client';

import { useState } from 'react';
import { Send, Search } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';
import { conversations, type Conversation, type Message } from '@/lib/data';
import { Card, CardContent, CardHeader } from '@/components/ui/card';

export default function MessagesPage() {
  const [activeConversation, setActiveConversation] = useState<Conversation>(conversations[0]);
  const [messages, setMessages] = useState<Message[]>(activeConversation.messages);
  const [newMessage, setNewMessage] = useState('');

  const handleSelectConversation = (conversation: Conversation) => {
    setActiveConversation(conversation);
    setMessages(conversation.messages);
  };
  
  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (newMessage.trim() === '') return;

    const message: Message = {
      id: (messages.length + 1).toString(),
      sender: 'me',
      text: newMessage,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };
    
    setMessages([...messages, message]);
    setNewMessage('');
  };

  return (
    <div className="h-[calc(100vh-2rem)] m-4 grid grid-cols-1 md:grid-cols-12 gap-4">
      <Card className="md:col-span-4 lg:col-span-3 flex flex-col h-full">
        <CardHeader className="p-4">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Search messages..." className="pl-8" />
          </div>
        </CardHeader>
        <ScrollArea className="flex-1">
          <div className="space-y-1 p-2">
            {conversations.map((convo) => (
              <button
                key={convo.contactId}
                onClick={() => handleSelectConversation(convo)}
                className={cn(
                  'flex w-full items-center gap-3 rounded-lg p-3 text-left transition-colors hover:bg-accent',
                  activeConversation.contactId === convo.contactId && 'bg-accent'
                )}
              >
                <Avatar>
                  <AvatarImage src={convo.contactAvatarUrl} />
                  <AvatarFallback>{convo.contactName.charAt(0)}</AvatarFallback>
                </Avatar>
                <div className="flex-1 truncate">
                  <p className="font-semibold">{convo.contactName}</p>
                  <p className="text-sm text-muted-foreground truncate">{convo.messages.slice(-1)[0].text}</p>
                </div>
              </button>
            ))}
          </div>
        </ScrollArea>
      </Card>

      <Card className="md:col-span-8 lg:col-span-9 flex flex-col h-full">
          <CardHeader className="flex flex-row items-center gap-4 p-4 border-b">
             <Avatar>
                <AvatarImage src={activeConversation.contactAvatarUrl} />
                <AvatarFallback>{activeConversation.contactName.charAt(0)}</AvatarFallback>
            </Avatar>
            <h2 className="text-lg font-semibold">{activeConversation.contactName}</h2>
          </CardHeader>
          <ScrollArea className="flex-1 p-4">
            <div className="space-y-4">
                {messages.map((message) => (
                    <div key={message.id} className={cn('flex items-end gap-2', message.sender === 'me' ? 'justify-end' : 'justify-start')}>
                        {message.sender === 'them' && <Avatar className="h-8 w-8"><AvatarImage src={activeConversation.contactAvatarUrl} /></Avatar>}
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
