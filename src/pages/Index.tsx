import { useState, useEffect } from 'react';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import Icon from '@/components/ui/icon';
import ChatTab from '@/components/ChatTab';
import SettingsTab from '@/components/SettingsTab';
import HistoryTab from '@/components/HistoryTab';
import DataTab from '@/components/DataTab';
import StatsTab from '@/components/StatsTab';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

interface Task {
  id: string;
  title: string;
  status: 'pending' | 'completed';
  createdAt: Date;
}

interface DataFile {
  id: string;
  name: string;
  size: string;
  uploadedAt: Date;
}

export default function Index() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      content: 'Здравствуйте! Я ваш виртуальный помощник. Готов помочь вам с любыми задачами. Сейчас я в режиме обучения и накапливаю знания для автономной работы.',
      timestamp: new Date()
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [activeTab, setActiveTab] = useState('chat');
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  
  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);
  
  const [tasks] = useState<Task[]>([
    { id: '1', title: 'Напомнить о встрече в 15:00', status: 'completed', createdAt: new Date('2024-11-30T10:00:00') },
    { id: '2', title: 'Проверить почту каждые 30 минут', status: 'pending', createdAt: new Date('2024-11-30T11:00:00') },
    { id: '3', title: 'Создать отчет по итогам дня', status: 'pending', createdAt: new Date('2024-11-30T12:00:00') }
  ]);

  const [dataFiles] = useState<DataFile[]>([
    { id: '1', name: 'База знаний.pdf', size: '2.4 MB', uploadedAt: new Date('2024-11-25') },
    { id: '2', name: 'Инструкции.docx', size: '1.1 MB', uploadedAt: new Date('2024-11-28') },
    { id: '3', name: 'Справочник.txt', size: '156 KB', uploadedAt: new Date('2024-11-29') }
  ]);

  const stats = {
    totalMessages: 247,
    tasksCompleted: 89,
    learningProgress: 67,
    uptime: '12 дней'
  };

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: inputValue,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    const currentInput = inputValue;
    setInputValue('');
    setIsTyping(true);

    try {
      const history = messages.map(msg => ({
        role: msg.role,
        content: msg.content
      }));

      const response = await fetch('https://functions.poehali.dev/f83a722f-e8be-4fff-b8e0-7f1058c35190', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: currentInput,
          history: history,
          online: isOnline
        })
      });

      const data = await response.json();

      if (response.ok && data.message) {
        const assistantMessage: Message = {
          id: (Date.now() + 1).toString(),
          role: 'assistant',
          content: data.message,
          timestamp: new Date()
        };
        setMessages(prev => [...prev, assistantMessage]);
      } else {
        const errorMessage: Message = {
          id: (Date.now() + 1).toString(),
          role: 'assistant',
          content: data.error || 'Извините, произошла ошибка при обработке вашего сообщения. Проверьте, что добавлен OPENAI_API_KEY в секреты проекта.',
          timestamp: new Date()
        };
        setMessages(prev => [...prev, errorMessage]);
      }
    } catch (error) {
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: 'Не удалось связаться с сервером. Проверьте подключение к интернету.',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-accent/10 dark:from-background dark:via-background dark:to-accent/5">
      <div className="container mx-auto p-4 h-screen flex flex-col">
        <header className="mb-6 animate-slide-up">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-primary via-secondary to-primary bg-[length:200%_auto] animate-gradient bg-clip-text text-transparent">
                Виртуальный Помощник
              </h1>
              <p className="text-muted-foreground mt-1">Интеллектуальный ассистент с саморазвитием</p>
            </div>
            <div className="flex items-center gap-2">
              {isOnline ? (
                <Badge variant="outline" className="animate-pulse-soft">
                  <Icon name="Wifi" className="w-3 h-3 mr-1" />
                  Online - Обучение
                </Badge>
              ) : (
                <Badge variant="destructive">
                  <Icon name="WifiOff" className="w-3 h-3 mr-1" />
                  Offline - Автономно
                </Badge>
              )}
              <Badge variant="secondary">
                <Icon name="Brain" className="w-3 h-3 mr-1" />
                Саморазвитие
              </Badge>
            </div>
          </div>
        </header>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col animate-fade-in">
          <TabsList className="grid w-full grid-cols-5 mb-4">
            <TabsTrigger value="chat" className="flex items-center gap-2">
              <Icon name="MessageSquare" className="w-4 h-4" />
              Чат
            </TabsTrigger>
            <TabsTrigger value="settings" className="flex items-center gap-2">
              <Icon name="Settings" className="w-4 h-4" />
              Настройки
            </TabsTrigger>
            <TabsTrigger value="history" className="flex items-center gap-2">
              <Icon name="History" className="w-4 h-4" />
              История
            </TabsTrigger>
            <TabsTrigger value="data" className="flex items-center gap-2">
              <Icon name="Database" className="w-4 h-4" />
              Данные
            </TabsTrigger>
            <TabsTrigger value="stats" className="flex items-center gap-2">
              <Icon name="BarChart3" className="w-4 h-4" />
              Статистика
            </TabsTrigger>
          </TabsList>

          <ChatTab 
            messages={messages}
            inputValue={inputValue}
            setInputValue={setInputValue}
            isTyping={isTyping}
            handleSendMessage={handleSendMessage}
          />
          
          <SettingsTab />
          
          <HistoryTab />
          
          <DataTab tasks={tasks} dataFiles={dataFiles} />
          
          <StatsTab stats={stats} />
        </Tabs>
      </div>
    </div>
  );
}