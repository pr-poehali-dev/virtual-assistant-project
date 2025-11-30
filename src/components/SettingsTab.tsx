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
              <Badge variant="secondary">Активна</Badge>
            </div>
            <div className="p-3 bg-accent/20 rounded-lg">
              <p className="text-sm mb-2 font-medium">Как это работает:</p>
              <ul className="text-xs space-y-1 text-muted-foreground">
                <li>• В онлайн режиме помощник учится и сохраняет данные</li>
                <li>• Все диалоги записываются в базу знаний</li>
                <li>• Переводы кэшируются для оффлайн доступа</li>
                <li>• Без интернета используются накопленные знания</li>
              </ul>
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block">База знаний</label>
              <div className="flex items-center justify-between text-xs mb-1">
                <span>Накопленные данные</span>
                <span className="text-primary font-medium">Растёт автоматически</span>
              </div>
              <Progress value={100} className="h-2" />
            </div>
          </div>
        </Card>
      </div>
    </TabsContent>
  );
}