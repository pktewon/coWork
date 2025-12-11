import { useState } from 'react';
import { MoreVertical, Trash2, Calendar, User as UserIcon } from 'lucide-react';
import type { Task, TaskUpdateRequest } from '../../types';
import { Card, CardContent } from '../ui/Card';
import { PriorityBadge } from '../ui/Badge';

interface TaskCardProps {
  task: Task;
  onUpdate: (taskId: number, data: TaskUpdateRequest) => Promise<void>;
  onDelete: (taskId: number) => Promise<void>;
  onClick: (task: Task) => void;
}

export function TaskCard({ task, onUpdate, onDelete, onClick }: TaskCardProps) {
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (window.confirm('Are you sure you want to delete this task?')) {
      setIsDeleting(true);
      try {
        await onDelete(task.id);
      } catch {
        setIsDeleting(false);
      }
    }
  };

  const handleStatusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    e.stopPropagation();
    onUpdate(task.id, { 
      status: e.target.value as 'TODO' | 'IN_PROGRESS' | 'DONE',
      version: task.version 
    });
  };

  return (
    <Card 
      className="bg-white mb-3 hover:shadow-md transition-shadow cursor-pointer"
      onClick={() => onClick(task)}
    >
      <CardContent className="p-4">
        <div className="flex justify-between items-start mb-2">
          <PriorityBadge priority={task.priority} />
          <div className="relative group">
            <button 
              className="text-gray-400 hover:text-gray-600 p-1 rounded-full hover:bg-gray-100"
              onClick={(e) => e.stopPropagation()}
            >
              <MoreVertical className="w-4 h-4" />
            </button>
            {/* Dropdown Menu - Simple implementation using group-hover */}
            <div className="absolute right-0 mt-1 w-32 bg-white rounded-md shadow-lg border border-gray-200 hidden group-hover:block z-10">
              <button
                onClick={handleDelete}
                disabled={isDeleting}
                className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center gap-2"
              >
                <Trash2 className="w-3 h-3" />
                Delete
              </button>
            </div>
          </div>
        </div>

        <h4 className="font-semibold text-gray-900 mb-1">{task.title}</h4>
        
        {task.content && (
          <p className="text-sm text-gray-500 mb-3 line-clamp-2">
            {task.content}
          </p>
        )}

        <div className="flex flex-col gap-2 mt-3">
          <div className="flex items-center justify-between text-xs text-gray-500">
            <div className="flex items-center gap-1">
              <UserIcon className="w-3 h-3" />
              <span>{task.workerNickname || 'Unassigned'}</span>
            </div>
            {task.deadline && (
              <div className="flex items-center gap-1">
                <Calendar className="w-3 h-3" />
                <span>{new Date(task.deadline).toLocaleDateString()}</span>
              </div>
            )}
          </div>

          <div className="pt-2 border-t border-gray-100" onClick={(e) => e.stopPropagation()}>
            <select
              value={task.status}
              onChange={handleStatusChange}
              className="w-full text-xs border-gray-200 rounded-md py-1 pr-8 pl-2 focus:ring-primary-500 focus:border-primary-500"
            >
              <option value="TODO">To Do</option>
              <option value="IN_PROGRESS">In Progress</option>
              <option value="DONE">Done</option>
            </select>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
