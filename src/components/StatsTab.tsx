import { Card } from '@/components/ui/card';
import { TabsContent } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import Icon from '@/components/ui/icon';
import { cn } from '@/lib/utils';

interface StatsTabProps {
  stats: {
    totalMessages: number;
    tasksCompleted: number;
    learningProgress: number;
    uptime: string;
  };
}

export default function StatsTab({ stats }: StatsTabProps) {
  return (
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
  );
}
