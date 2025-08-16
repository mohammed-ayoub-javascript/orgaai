'use client';

import { useEffect, useState, useRef, useCallback } from 'react';
import { openDB } from 'idb';
import { Button } from "@/components/ui/button";
import { Blocks, Plus, Menu, X } from 'lucide-react';
import { authClient } from "@/lib/auth-client"
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Input } from '@/components/ui/input';
import {
  Conversation,
  ConversationContent,
  ConversationScrollButton,
} from '@/components/ai-elements/conversation';
import { Message, MessageContent } from '@/components/ai-elements/message';
import { Response } from '@/components/ai-elements/response';
import Link from 'next/link';

type MessageType = {
  id: number;
  role: 'user' | 'ai';
  text: string;
  parts: any[];
};

type ChatSession = {
  id: number;
  title: string;
  messages: MessageType[];
};

export default function ChatPage() {
  const [sessions, setSessions] = useState<ChatSession[]>([]);
  const [currentSessionId, setCurrentSessionId] = useState<number | null>(null);
  const [prompt, setPrompt] = useState('');
  const [loading, setLoading] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [animatedMessages, setAnimatedMessages] = useState<Set<number>>(new Set());
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { data: session } = authClient.useSession();
  const [displayedTexts, setDisplayedTexts] = useState<Record<number, string>>({});
  const animationIntervals = useRef<Record<number, NodeJS.Timeout>>({});

  useEffect(() => {
    const loadSessions = async () => {
      try {
        const db = await openDB('chatDB', 1, {
          upgrade(db) {
            if (!db.objectStoreNames.contains('sessions')) {
              db.createObjectStore('sessions', { keyPath: 'id', autoIncrement: true });
            }
          },
        });
        
        const allSessions = await db.getAll('sessions');
        setSessions(allSessions);
        
        if (allSessions.length > 0) {
          setCurrentSessionId(allSessions[0].id);
          const existingIds = allSessions.flatMap(s => s.messages.map((m : any) => m.id));
          setAnimatedMessages(new Set(existingIds));
        }
      } catch (error) {
        console.error('Failed to load sessions:', error);
      }
    };

    loadSessions();
  }, []);

useEffect(() => {
    if (!currentSession) return;

    currentSession.messages.forEach(message => {
      if (message.role === 'ai' && !animatedMessages.has(message.id)) {
        // Initialize displayed text if not present
        if (displayedTexts[message.id] === undefined) {
          setDisplayedTexts(prev => ({ ...prev, [message.id]: '' }));
        }

        // Start animation if not already running
        if (!animationIntervals.current[message.id] && displayedTexts[message.id] !== message.text) {
          const fullText = message.text;
          let currentIndex = displayedTexts[message.id]?.length || 0;

          // Calculate optimal step size based on message length
          let step = 1;
          if (fullText.length > 100) step = 3;
          if (fullText.length > 300) step = 5;

          animationIntervals.current[message.id] = setInterval(() => {
            if (currentIndex >= fullText.length) {
              clearInterval(animationIntervals.current[message.id]);
              delete animationIntervals.current[message.id];
              markMessageAsAnimated(message.id);
              return;
            }

            // Increase current index with optimized step size
            currentIndex = Math.min(currentIndex + step, fullText.length);
            
            setDisplayedTexts(prev => ({
              ...prev,
              [message.id]: fullText.substring(0, currentIndex)
            }));
          }, 5); // Reduced delay for faster typing
        }
      }
    });

    return () => {
      // Cleanup intervals
      Object.values(animationIntervals.current).forEach(clearInterval);
      animationIntervals.current = {};
    };
  }, [animatedMessages, displayedTexts]);
  const saveSessions = useCallback(async (newSessions: ChatSession[]) => {
    try {
      const db = await openDB('chatDB', 1);
      const tx = db.transaction('sessions', 'readwrite');
      const store = tx.objectStore('sessions');
      
      await store.clear();
      await Promise.all(newSessions.map(s => store.put(s)));
      
      setSessions(newSessions);
    } catch (error) {
      console.error('Failed to save sessions:', error);
    }
  }, []);

  const newChat = useCallback(async () => {
    const newSession: ChatSession = {
      id: Date.now(),
      title: `Chat ${sessions.length + 1}`,
      messages: []
    };
    
    const updated = [newSession, ...sessions];
    await saveSessions(updated);
    setCurrentSessionId(newSession.id);
    setSidebarOpen(false);
  }, [sessions, saveSessions]);


const sendMessage = useCallback(async () => {
  if (!prompt.trim() || currentSessionId === null) return;
  
  setLoading(true);
  const userMessageId = Date.now();
  
  // Update sessions with new user message
  const updated = sessions.map(s => {
    if (s.id === currentSessionId) {
      const newMsg: MessageType = {
        id: userMessageId,
        role: 'user',
        text: prompt,
        parts: [{ type: 'text', text: prompt }]
      };
      return { ...s, messages: [...s.messages, newMsg] };
    }
    return s;
  });
  
  await saveSessions(updated);
  setPrompt('');
  
  try {
    const currentSession = updated.find(s => s.id === currentSessionId);
    if (!currentSession) return;
    
    // Format entire conversation history including the new message
    const fullConversation = currentSession.messages.map(msg => 
      `${msg.role === 'user' ? 'User' : 'Assistant'}: ${msg.text}`
    ).join('\n');

    // Send full conversation history as prompt
    const res = await fetch('/api/chat', {
      method: 'POST',
      body: JSON.stringify({ 
        prompt: fullConversation
      }),
      headers: { 'Content-Type': 'application/json' }
    });
    
    if (!res.ok) throw new Error('فشل طلب API');
    
    const data = await res.json();
    const aiMessageId = Date.now() + 1;
    
    // Update sessions with AI response
    const updatedWithAI = updated.map(s => {
      if (s.id === currentSessionId) {
        const newMsg: MessageType = {
          id: aiMessageId,
          role: 'ai',
          text: data.response,
          parts: [{ type: 'text', text: data.response }]
        };
        return { ...s, messages: [...s.messages, newMsg] };
      }
      return s;
    });
    
    await saveSessions(updatedWithAI);
    setDisplayedTexts(prev => ({ ...prev, [aiMessageId]: '' }));
  } catch (error) {
    console.error('فشل الحصول على رد الذكاء الاصطناعي:', error);
    
    // Add error message to chat
    const updatedWithError = updated.map(s => {
      if (s.id === currentSessionId) {
        const errorMsg: MessageType = {
          id: Date.now() + 2,
          role: 'ai',
          text: 'عذرًا، حدث خطأ. يرجى المحاولة مرة أخرى.',
          parts: [{ type: 'text', text: 'عذرًا، حدث خطأ. يرجى المحاولة مرة أخرى.' }]
        };
        return { ...s, messages: [...s.messages, errorMsg] };
      }
      return s;
    });
    
    await saveSessions(updatedWithError);
  } finally {
    setLoading(false);
  }
}, [prompt, currentSessionId, sessions, saveSessions]);

  const currentSession = sessions.find(s => s.id === currentSessionId);
  
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [currentSession?.messages]);

  const markMessageAsAnimated = useCallback((id: number) => {
    setAnimatedMessages(prev => {
      const newSet = new Set(prev);
      newSet.add(id);
      return newSet;
    });
  }, []);

  return (
    <div className="flex flex-col md:flex-row h-screen bg-gradient-to-br">
      <div className="md:hidden flex items-center justify-between p-4 border-b">
        <Button 
          variant="ghost" 
          size="icon"
          onClick={() => setSidebarOpen(!sidebarOpen)}
        >
          {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
        </Button>
        <h1 className="text-xl font-bold">AI Chat</h1>
        <div className="w-8"></div>
      </div>

      <div 
        className={`
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'} 
          fixed md:static inset-y-0 left-0 z-30 w-64 backdrop-blur-sm md:bg-muted/20
          border-r p-4 flex flex-col justify-between transition-transform duration-300
          md:translate-x-0 shadow-lg md:shadow-none
        `}
      >
        <div>
          <Button 
            variant="default" 
            className="w-full bg-gradient-to-br from-purple-500 to-blue-600 text-white font-semibold shadow-md hover:from-purple-600 hover:to-blue-700"
          >
            Upgrade Plan
          </Button>

          <div className="mt-4 space-y-2">
            <Button 
              variant="outline" 
              className="w-full justify-start gap-2" 
              onClick={newChat}
            >
              <Plus size={16} /> محادثة جديدة
            </Button>
            <Link href={"/app/apps"}>
              <Button 
                variant="outline" 
                className="w-full justify-start gap-2"
              >
                <Blocks size={16} /> التطبيقات
              </Button>            
            </Link>

          </div>

          <div className="mt-6">
            <h3 className="text-sm font-medium mb-2">المحادثات</h3>
            <div className="h-[50vh] md:h-[60vh]">
              <ScrollArea className="h-full pr-3">
                <ul className="space-y-1">
                  {sessions.map(s => (
                    <li
                      key={s.id}
                      onClick={() => {
                        setCurrentSessionId(s.id);
                        setSidebarOpen(false);
                      }}
                      className={`
                        p-2 rounded cursor-pointer transition flex items-center
                        ${s.id === currentSessionId 
                          ? ' bg-muted' 
                          : 'hover:bg-gray-950'}
                      `}
                    >
                      <span className="truncate flex-1">{s.title}</span>
                      {s.id === currentSessionId && (
                        <span className="h-2 w-2 rounded-full ml-2"></span>
                      )}
                    </li>
                  ))}
                </ul>
                <ScrollBar orientation="vertical" />
              </ScrollArea>
            </div>
          </div>
        </div>

        <div className="mt-6 border-t pt-4">
          <div className="flex items-center gap-3">
            <img 
              src={session?.user.image as string} 
              alt="User profile" 
              width={40} 
              height={40} 
              className="rounded-full border-2 shadow"
            />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">
                {session?.user.name}
              </p>
              <p className="text-xs text-muted-foreground truncate">
                {session?.user.email}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-col flex-1 min-h-0">
        <div className="p-4 border-b flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold">
              {currentSession?.title || 'New Chat'}
            </h2>
            <p className="text-xs">
              {currentSession?.messages.length || 0} messages
            </p>
          </div>
          <Button 
            variant="ghost" 
            size="icon" 
            className="md:hidden"
            onClick={() => setSidebarOpen(true)}
          >
            <Menu size={20} />
          </Button>
        </div>

        <div className="flex-1 overflow-hidden p-4">
          <Conversation className="h-full" dir='ltr'>
            <ConversationContent className="h-full">
              {currentSession?.messages.length === 0 && (
                <div className="flex flex-col items-center justify-center h-full text-center p-4">
                  <div className="bg-gradient-to-br p-6 rounded-xl max-w-md">
                    <h3 className="text-xl font-bold mb-2">
                      مرحبا
                    </h3>
                    <p className="mb-4">
                      ابدأ بالكتابة أدناه للتواصل مع المساعد الذكي. يمكنني مساعدتك في الإجابة على الأسئلة، توليد الأفكار، والكثير!
                    </p>
              
                    </div>
                  </div>
              
              )}
              
              {currentSession?.messages.map((message) => (
                <Message 
                  from={message.role as any} 
                  key={message.id} 
                  className={message.role === 'ai' ? 'bg-gradient-to-br' : ''}
                >
                  <MessageContent>
                    {message.parts.map((part, i) => {
                      if (part.type !== 'text') return null;
                      
                      let textToShow = part.text;
                      let isAnimating = false;

                      if (message.role === 'ai' && !animatedMessages.has(message.id)) {
                        textToShow = displayedTexts[message.id] || '';
                        isAnimating = textToShow.length < part.text.length;
                      }

                      return (
                        <Response key={`${message.id}-${i}`}>
                          {textToShow}
                          
                        </Response>
                      );
                    })}
                  </MessageContent>
                </Message>
              ))}
              <div ref={messagesEndRef} />
            </ConversationContent>
            <ConversationScrollButton />
          </Conversation>
        </div>

        {currentSessionId && (
          <div className="p-4 border-t">
            <div className="flex gap-2">
              <Input 
                placeholder="اكتب رسالتك هنا..."
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    sendMessage();
                  }
                }}
                disabled={loading}
                className="flex-1 min-h-[50px] rounded-xl"
              />
              <Button 
                onClick={sendMessage}
                disabled={loading || !prompt.trim()}
                className="bg-gradient-to-br from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
              >
                {loading ? (
                  <div className="flex items-center">
                    <div className="h-4 w-4 border-2 border-t-transparent rounded-full animate-spin mr-2"></div>
                    جاري الإرسال...
                  </div>
                ) : 'إرسال'}
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}