import { useEffect, useState } from 'react';
import { CheckCircle2, Clock, Circle, Calendar, Users, ClipboardList } from 'lucide-react';
import { taskApi } from '../../api/taskApi';
import type { Task } from '../../types';
import { MainLayout } from '../../components/layout/MainLayout';
import { Card, CardContent } from '../../components/ui/Card';
import { StatusBadge, PriorityBadge } from '../../components/ui/Badge';

export function MyTasks() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState<'ALL' | 'TODO' | 'IN_PROGRESS' | 'DONE'>('ALL');

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const data = await taskApi.getMyTasks();
        setTasks(data);
      } catch {
        // Error handled by interceptor
      } finally {
        setIsLoading(false);
      }
    };

    fetchTasks();
  }, []);

  const filteredTasks = filter === 'ALL' 
    ? tasks 
    : tasks.filter(task => task.status === filter);

  const statusIcon = (status: string) => {
    switch (status) {
      case 'DONE':
        return <CheckCircle2 className="w-5 h-5 text-green-500" />;
      case 'IN_PROGRESS':
        return <Clock className="w-5 h-5 text-blue-500" />;
      default:
        return <Circle className="w-5 h-5 text-amber-500" />;
    }
  };

  const stats = {
    total: tasks.length,
    todo: tasks.filter(t => t.status === 'TODO').length,
    inProgress: tasks.filter(t => t.status === 'IN_PROGRESS').length,
    done: tasks.filter(t => t.status === 'DONE').length,
  };

  if (isLoading) {
    return (
      <MainLayout title="My Tasks">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary-200 border-t-primary-600"></div>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout
      title="My Tasks"
      subtitle="Track and manage your assigned tasks"
    >
      <div className="space-y-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <button
            onClick={() => setFilter('ALL')}
            className={`p-4 rounded-xl border-2 transition-all ${
              filter === 'ALL' 
                ? 'border-primary-500 bg-primary-50' 
                : 'border-gray-200 bg-white hover:border-gray-300'
            }`}
          >
            <div className="text-2xl font-bold text-gray-900">{stats.total}</div>
            <div className="text-sm text-gray-500">Total Tasks</div>
          </button>
          <button
            onClick={() => setFilter('TODO')}
            className={`p-4 rounded-xl border-2 transition-all ${
              filter === 'TODO' 
                ? 'border-amber-500 bg-amber-50' 
                : 'border-gray-200 bg-white hover:border-gray-300'
            }`}
          >
            <div className="text-2xl font-bold text-amber-600">{stats.todo}</div>
            <div className="text-sm text-gray-500">To Do</div>
          </button>
          <button
            onClick={() => setFilter('IN_PROGRESS')}
            className={`p-4 rounded-xl border-2 transition-all ${
              filter === 'IN_PROGRESS' 
                ? 'border-blue-500 bg-blue-50' 
                : 'border-gray-200 bg-white hover:border-gray-300'
            }`}
          >
            <div className="text-2xl font-bold text-blue-600">{stats.inProgress}</div>
            <div className="text-sm text-gray-500">In Progress</div>
          </button>
          <button
            onClick={() => setFilter('DONE')}
            className={`p-4 rounded-xl border-2 transition-all ${
              filter === 'DONE' 
                ? 'border-green-500 bg-green-50' 
                : 'border-gray-200 bg-white hover:border-gray-300'
            }`}
          >
            <div className="text-2xl font-bold text-green-600">{stats.done}</div>
            <div className="text-sm text-gray-500">Completed</div>
          </button>
        </div>

        {/* Task List */}
        {filteredTasks.length === 0 ? (
          <Card>
            <CardContent className="py-16">
              <div className="text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-100 rounded-full mb-4">
                  <ClipboardList className="w-8 h-8 text-gray-400" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-1">
                  {filter === 'ALL' ? 'No tasks assigned' : `No ${filter.toLowerCase().replace('_', ' ')} tasks`}
                </h3>
                <p className="text-gray-500">
                  {filter === 'ALL' 
                    ? 'Tasks assigned to you will appear here'
                    : 'Try selecting a different filter'}
                </p>
              </div>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-3">
            {filteredTasks.map((task) => (
              <Card key={task.id} hover className="overflow-hidden">
                <CardContent className="p-0">
                  <div className="flex items-stretch">
                    {/* Status Indicator */}
                    <div className={`w-1.5 flex-shrink-0 ${
                      task.status === 'DONE' ? 'bg-green-500' :
                      task.status === 'IN_PROGRESS' ? 'bg-blue-500' : 'bg-amber-500'
                    }`} />
                    
                    <div className="flex-1 p-4">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex items-start gap-3 min-w-0">
                          {statusIcon(task.status)}
                          <div className="min-w-0">
                            <h3 className="font-semibold text-gray-900 truncate">
                              {task.title}
                            </h3>
                            <p className="text-sm text-gray-500 mt-0.5 line-clamp-1">
                              {task.content || 'No description'}
                            </p>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-2 flex-shrink-0">
                          <StatusBadge status={task.status} />
                          <PriorityBadge priority={task.priority} />
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-4 mt-3 text-xs text-gray-500">
                        <div className="flex items-center gap-1">
                          <Users className="w-3.5 h-3.5" />
                          <span>{task.teamName}</span>
                        </div>
                        {task.deadline && (
                          <div className="flex items-center gap-1">
                            <Calendar className="w-3.5 h-3.5" />
                            <span>{new Date(task.deadline).toLocaleDateString()}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </MainLayout>
  );
}
