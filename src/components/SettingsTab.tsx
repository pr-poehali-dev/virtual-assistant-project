import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { TabsContent } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import Icon from '@/components/ui/icon';

export default function SettingsTab() {
  return (
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
  );
}
