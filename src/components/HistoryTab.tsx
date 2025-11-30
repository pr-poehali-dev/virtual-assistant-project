import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { TabsContent } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import Icon from '@/components/ui/icon';

export default function HistoryTab() {
  return (
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
  );
}
