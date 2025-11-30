import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import Icon from '@/components/ui/icon';
import { cn } from '@/lib/utils';

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

  const handleSendMessage = () => {
    if (!inputValue.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: inputValue,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsTyping(true);

    setTimeout(() => {
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: 'Понял вас! Выполняю задачу и запоминаю паттерн для будущего автономного использования. Эти данные будут доступны даже в оффлайн режиме.',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, assistantMessage]);
      setIsTyping(false);
    }, 1500);
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
              <Badge variant="outline" className="animate-pulse-soft">
                <Icon name="Wifi" className="w-3 h-3 mr-1" />
                Online
              </Badge>
              <Badge variant="secondary">
                <Icon name="Brain" className="w-3 h-3 mr-1" />
                Режим обучения
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

          <TabsContent value="chat" className="flex-1 flex flex-col space-y-4 mt-0">
            <Card className="flex-1 flex flex-col p-6 bg-card/50 backdrop-blur-sm border-2">
              <ScrollArea className="flex-1 pr-4 mb-4">
                <div className="space-y-4">
                  {messages.map((message, index) => (
                    <div
                      key={message.id}
                      className={cn(
                        'flex gap-3 animate-slide-up',
                        message.role === 'user' ? 'justify-end' : 'justify-start'
                      )}
                      style={{ animationDelay: `${index * 0.1}s` }}
                    >
                      {message.role === 'assistant' && (
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center shrink-0">
                          <Icon name="Bot" className="w-5 h-5 text-primary-foreground" />
                        </div>
                      )}
                      <div
                        className={cn(
                          'max-w-[70%] rounded-2xl px-4 py-3',
                          message.role === 'user'
                            ? 'bg-primary text-primary-foreground'
                            : 'bg-muted'
                        )}
                      >
                        <p className="text-sm">{message.content}</p>
                        <span className="text-xs opacity-70 mt-1 block">
                          {message.timestamp.toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                      {message.role === 'user' && (
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-secondary to-primary flex items-center justify-center shrink-0">
                          <Icon name="User" className="w-5 h-5 text-primary-foreground" />
                        </div>
                      )}
                    </div>
                  ))}
                  {isTyping && (
                    <div className="flex gap-3 animate-fade-in">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center shrink-0">
                        <Icon name="Bot" className="w-5 h-5 text-primary-foreground" />
                      </div>
                      <div className="max-w-[70%] rounded-2xl px-4 py-3 bg-muted">
                        <div className="flex gap-1">
                          <span className="w-2 h-2 rounded-full bg-muted-foreground animate-bounce" style={{ animationDelay: '0s' }}></span>
                          <span className="w-2 h-2 rounded-full bg-muted-foreground animate-bounce" style={{ animationDelay: '0.2s' }}></span>
                          <span className="w-2 h-2 rounded-full bg-muted-foreground animate-bounce" style={{ animationDelay: '0.4s' }}></span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </ScrollArea>
              <div className="flex gap-2">
                <Input
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                  placeholder="Напишите сообщение..."
                  className="flex-1"
                />
                <Button onClick={handleSendMessage} size="icon" className="shrink-0">
                  <Icon name="Send" className="w-4 h-4" />
                </Button>
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="settings" className="flex-1 space-y-4 mt-0">
            <div className="grid gap-4 md:grid-cols-2">
              <Card className="p-6 animate-fade-in">
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <Icon name="Mic" className="w-5 h-5 text-primary" />
                  Голосовые настройки
                </h3>
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium mb-2 block">Голос помощника</label>
                    <select className="w-full p-2 rounded-md border bg-background">
                      <option>Мужской (Дмитрий)</option>
                      <option>Женский (Алина)</option>
                      <option>Нейтральный</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-2 block">Скорость речи</label>
                    <input type="range" min="50" max="150" defaultValue="100" className="w-full" />
                  </div>
                </div>
              </Card>

              <Card className="p-6 animate-fade-in" style={{ animationDelay: '0.1s' }}>
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <Icon name="Brain" className="w-5 h-5 text-primary" />
                  Обучение
                </h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Автоматическое обучение</span>
                    <input type="checkbox" defaultChecked className="toggle" />
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Сохранять контекст</span>
                    <input type="checkbox" defaultChecked className="toggle" />
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Режим саморазвития</span>
                    <input type="checkbox" defaultChecked className="toggle" />
                  </div>
                </div>
              </Card>

              <Card className="p-6 animate-fade-in" style={{ animationDelay: '0.2s' }}>
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <Icon name="Zap" className="w-5 h-5 text-primary" />
                  Поведение
                </h3>
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium mb-2 block">Уровень проактивности</label>
                    <input type="range" min="0" max="100" defaultValue="70" className="w-full" />
                    <div className="flex justify-between text-xs text-muted-foreground mt-1">
                      <span>Пассивный</span>
                      <span>Активный</span>
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-2 block">Стиль общения</label>
                    <select className="w-full p-2 rounded-md border bg-background">
                      <option>Дружелюбный</option>
                      <option>Профессиональный</option>
                      <option>Краткий</option>
                    </select>
                  </div>
                </div>
              </Card>

              <Card className="p-6 animate-fade-in" style={{ animationDelay: '0.3s' }}>
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <Icon name="WifiOff" className="w-5 h-5 text-primary" />
                  Оффлайн режим
                </h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Автономная работа</span>
                    <Badge variant="secondary">Готов</Badge>
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-2 block">Объем кэша знаний</label>
                    <Progress value={67} className="h-2" />
                    <p className="text-xs text-muted-foreground mt-1">3.2 GB из 4.8 GB</p>
                  </div>
                  <Button variant="outline" className="w-full">
                    <Icon name="Download" className="w-4 h-4 mr-2" />
                    Загрузить дополнительные знания
                  </Button>
                </div>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="history" className="flex-1 mt-0">
            <Card className="p-6 h-full animate-fade-in">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold flex items-center gap-2">
                  <Icon name="History" className="w-5 h-5 text-primary" />
                  История диалогов
                </h3>
                <Input placeholder="Поиск..." className="w-64" />
              </div>
              <ScrollArea className="h-[calc(100%-4rem)]">
                <div className="space-y-3">
                  {[
                    { date: 'Сегодня, 14:30', topic: 'Планирование задач на неделю', messages: 12 },
                    { date: 'Сегодня, 10:15', topic: 'Анализ финансового отчета', messages: 8 },
                    { date: 'Вчера, 16:45', topic: 'Настройка автоматизации', messages: 15 },
                    { date: 'Вчера, 09:20', topic: 'Подготовка презентации', messages: 24 },
                    { date: '28 ноября', topic: 'Исследование конкурентов', messages: 19 },
                    { date: '27 ноября', topic: 'Создание контент-плана', messages: 31 }
                  ].map((item, index) => (
                    <Card key={index} className="p-4 hover:bg-accent/50 cursor-pointer transition-colors animate-slide-up" style={{ animationDelay: `${index * 0.05}s` }}>
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <p className="font-medium">{item.topic}</p>
                          <p className="text-sm text-muted-foreground mt-1">{item.date}</p>
                        </div>
                        <Badge variant="outline">{item.messages} сообщений</Badge>
                      </div>
                    </Card>
                  ))}
                </div>
              </ScrollArea>
            </Card>
          </TabsContent>

          <TabsContent value="data" className="flex-1 mt-0">
            <div className="grid gap-4 h-full md:grid-cols-2">
              <Card className="p-6 animate-fade-in">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold flex items-center gap-2">
                    <Icon name="FolderOpen" className="w-5 h-5 text-primary" />
                    Загруженные файлы
                  </h3>
                  <Button size="sm">
                    <Icon name="Upload" className="w-4 h-4 mr-2" />
                    Загрузить
                  </Button>
                </div>
                <ScrollArea className="h-[calc(100%-4rem)]">
                  <div className="space-y-2">
                    {dataFiles.map((file, index) => (
                      <Card key={file.id} className="p-3 hover:bg-accent/50 transition-colors animate-slide-up" style={{ animationDelay: `${index * 0.1}s` }}>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                              <Icon name="FileText" className="w-5 h-5 text-primary" />
                            </div>
                            <div>
                              <p className="font-medium text-sm">{file.name}</p>
                              <p className="text-xs text-muted-foreground">{file.size}</p>
                            </div>
                          </div>
                          <Button variant="ghost" size="icon">
                            <Icon name="Trash2" className="w-4 h-4" />
                          </Button>
                        </div>
                      </Card>
                    ))}
                  </div>
                </ScrollArea>
              </Card>

              <Card className="p-6 animate-fade-in" style={{ animationDelay: '0.1s' }}>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold flex items-center gap-2">
                    <Icon name="CheckSquare" className="w-5 h-5 text-primary" />
                    Задачи и напоминания
                  </h3>
                  <Button size="sm">
                    <Icon name="Plus" className="w-4 h-4 mr-2" />
                    Создать
                  </Button>
                </div>
                <ScrollArea className="h-[calc(100%-4rem)]">
                  <div className="space-y-2">
                    {tasks.map((task, index) => (
                      <Card key={task.id} className="p-3 hover:bg-accent/50 transition-colors animate-slide-up" style={{ animationDelay: `${index * 0.1}s` }}>
                        <div className="flex items-start gap-3">
                          <input
                            type="checkbox"
                            checked={task.status === 'completed'}
                            className="mt-1"
                            readOnly
                          />
                          <div className="flex-1">
                            <p className={cn(
                              'font-medium text-sm',
                              task.status === 'completed' && 'line-through opacity-60'
                            )}>
                              {task.title}
                            </p>
                            <p className="text-xs text-muted-foreground mt-1">
                              {task.createdAt.toLocaleString('ru-RU', { 
                                day: 'numeric',
                                month: 'short',
                                hour: '2-digit',
                                minute: '2-digit'
                              })}
                            </p>
                          </div>
                          <Badge variant={task.status === 'completed' ? 'secondary' : 'default'}>
                            {task.status === 'completed' ? 'Выполнено' : 'В работе'}
                          </Badge>
                        </div>
                      </Card>
                    ))}
                  </div>
                </ScrollArea>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="stats" className="flex-1 mt-0">
            <div className="grid gap-4 h-full md:grid-cols-2 lg:grid-cols-4">
              <Card className="p-6 animate-fade-in">
                <div className="flex items-center justify-between mb-2">
                  <Icon name="MessageSquare" className="w-8 h-8 text-primary" />
                  <Icon name="TrendingUp" className="w-4 h-4 text-green-500" />
                </div>
                <p className="text-3xl font-bold">{stats.totalMessages}</p>
                <p className="text-sm text-muted-foreground mt-1">Всего диалогов</p>
                <Progress value={85} className="h-1 mt-3" />
              </Card>

              <Card className="p-6 animate-fade-in" style={{ animationDelay: '0.1s' }}>
                <div className="flex items-center justify-between mb-2">
                  <Icon name="CheckCircle2" className="w-8 h-8 text-primary" />
                  <Icon name="TrendingUp" className="w-4 h-4 text-green-500" />
                </div>
                <p className="text-3xl font-bold">{stats.tasksCompleted}</p>
                <p className="text-sm text-muted-foreground mt-1">Задач выполнено</p>
                <Progress value={72} className="h-1 mt-3" />
              </Card>

              <Card className="p-6 animate-fade-in" style={{ animationDelay: '0.2s' }}>
                <div className="flex items-center justify-between mb-2">
                  <Icon name="Brain" className="w-8 h-8 text-primary" />
                  <Icon name="TrendingUp" className="w-4 h-4 text-green-500" />
                </div>
                <p className="text-3xl font-bold">{stats.learningProgress}%</p>
                <p className="text-sm text-muted-foreground mt-1">Прогресс обучения</p>
                <Progress value={stats.learningProgress} className="h-1 mt-3" />
              </Card>

              <Card className="p-6 animate-fade-in" style={{ animationDelay: '0.3s' }}>
                <div className="flex items-center justify-between mb-2">
                  <Icon name="Clock" className="w-8 h-8 text-primary" />
                  <Icon name="Activity" className="w-4 h-4 text-primary animate-pulse-soft" />
                </div>
                <p className="text-3xl font-bold">{stats.uptime}</p>
                <p className="text-sm text-muted-foreground mt-1">Время работы</p>
                <Progress value={100} className="h-1 mt-3" />
              </Card>

              <Card className="p-6 col-span-full lg:col-span-2 animate-fade-in" style={{ animationDelay: '0.4s' }}>
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <Icon name="BarChart3" className="w-5 h-5 text-primary" />
                  Активность по дням
                </h3>
                <div className="space-y-3">
                  {[
                    { day: 'Понедельник', value: 85 },
                    { day: 'Вторник', value: 92 },
                    { day: 'Среда', value: 78 },
                    { day: 'Четверг', value: 95 },
                    { day: 'Пятница', value: 88 },
                    { day: 'Суббота', value: 45 },
                    { day: 'Воскресенье', value: 32 }
                  ].map((item, index) => (
                    <div key={index} className="space-y-1">
                      <div className="flex items-center justify-between text-sm">
                        <span>{item.day}</span>
                        <span className="text-muted-foreground">{item.value}%</span>
                      </div>
                      <Progress value={item.value} className="h-2" />
                    </div>
                  ))}
                </div>
              </Card>

              <Card className="p-6 col-span-full lg:col-span-2 animate-fade-in" style={{ animationDelay: '0.5s' }}>
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <Icon name="Award" className="w-5 h-5 text-primary" />
                  Достижения саморазвития
                </h3>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { title: 'Первый диалог', icon: 'MessageCircle', unlocked: true },
                    { title: '100 задач', icon: 'Target', unlocked: true },
                    { title: 'Неделя работы', icon: 'Calendar', unlocked: true },
                    { title: 'Оффлайн режим', icon: 'WifiOff', unlocked: true },
                    { title: '1000 диалогов', icon: 'TrendingUp', unlocked: false },
                    { title: 'Эксперт', icon: 'Crown', unlocked: false }
                  ].map((achievement, index) => (
                    <Card
                      key={index}
                      className={cn(
                        'p-4 text-center transition-all',
                        achievement.unlocked
                          ? 'bg-gradient-to-br from-primary/20 to-secondary/20 border-primary'
                          : 'opacity-50 grayscale'
                      )}
                    >
                      <Icon name={achievement.icon as any} className="w-8 h-8 mx-auto mb-2" />
                      <p className="text-sm font-medium">{achievement.title}</p>
                    </Card>
                  ))}
                </div>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
