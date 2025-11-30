import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { TabsContent } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import Icon from '@/components/ui/icon';
import { cn } from '@/lib/utils';

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

interface DataTabProps {
  tasks: Task[];
  dataFiles: DataFile[];
}

export default function DataTab({ tasks, dataFiles }: DataTabProps) {
  return (
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
  );
}
