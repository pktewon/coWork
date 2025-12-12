import { useEffect, useState } from 'react';
import { X, Send, User, Clock } from 'lucide-react';
import toast from 'react-hot-toast';
import { useTranslation } from 'react-i18next';
import { taskApi } from '../../api/taskApi';
import type { Task, Comment } from '../../types';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { PriorityBadge } from '../ui/Badge';

interface TaskDetailModalProps {
  task: Task;
  onClose: () => void;
  onUpdate: () => void; // To refresh the parent list if needed
}

export function TaskDetailModal({ task, onClose, onUpdate }: TaskDetailModalProps) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { t } = useTranslation();

  const fetchComments = async () => {
    try {
      const data = await taskApi.getComments(task.id);
      setComments(data);
    } catch (error) {
      console.error(error);
      toast.error(t('task.loadCommentsError'));
    }
  };

  useEffect(() => {
    fetchComments();
  }, [task.id]);

  const handleAddComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    setIsSubmitting(true);
    try {
      await taskApi.addComment(task.id, { content: newComment });
      setNewComment('');
      fetchComments();
      onUpdate(); // Notify parent to refresh if needed
      toast.success(t('task.commentAdded'));
    } catch (error) {
      console.error(error);
      toast.error(t('task.addCommentError'));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <Card className="w-full max-w-2xl bg-white shadow-2xl animate-in fade-in zoom-in duration-200 h-[80vh] flex flex-col">
        {/* Header */}
        <div className="p-6 border-b border-gray-100 flex justify-between items-start shrink-0">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <PriorityBadge priority={task.priority} />
              <span className={`px-2 py-0.5 text-xs font-medium rounded-full ${
                task.status === 'DONE' ? 'bg-green-100 text-green-800' :
                task.status === 'IN_PROGRESS' ? 'bg-blue-100 text-blue-800' :
                'bg-gray-100 text-gray-800'
              }`}>
                {task.status.replace('_', ' ')}
              </span>
            </div>
            <h2 className="text-xl font-bold text-gray-900">{task.title}</h2>
          </div>
          <button 
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 p-1 rounded-full hover:bg-gray-100"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content - Scrollable */}
        <div className="flex-1 overflow-y-auto p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="col-span-2 space-y-6">
              <div>
                <h3 className="text-sm font-semibold text-gray-700 mb-2">{t('task.description')}</h3>
                <div className="bg-gray-50 rounded-lg p-4 text-gray-700 whitespace-pre-wrap min-h-[100px]">
                  {task.content || t('task.noDescription')}
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-semibold text-gray-700 mb-1">{t('task.assignee')}</h3>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <User className="w-4 h-4" />
                  <span>{task.workerNickname || t('task.unassigned')}</span>
                </div>
              </div>
              <div>
                <h3 className="text-sm font-semibold text-gray-700 mb-1">{t('task.deadline')}</h3>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Clock className="w-4 h-4" />
                  <span>{task.deadline ? new Date(task.deadline).toLocaleDateString() : t('task.noDeadline')}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Comments Section */}
          <div className="border-t border-gray-100 pt-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
              {t('task.comments')}
              <span className="text-sm font-normal text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full">
                {comments.length}
              </span>
            </h3>

            <div className="space-y-4 mb-6">
              {comments.map((comment) => (
                <div key={comment.id} className="flex gap-3">
                  <div className="w-8 h-8 rounded-full bg-primary-100 flex items-center justify-center text-primary-700 font-bold text-xs shrink-0">
                    {comment.writerNickname.charAt(0).toUpperCase()}
                  </div>
                  <div className="flex-1 bg-gray-50 rounded-lg rounded-tl-none p-3">
                    <div className="flex justify-between items-center mb-1">
                      <span className="font-semibold text-sm text-gray-900">{comment.writerNickname}</span>
                      <span className="text-xs text-gray-400">
                        {new Date(comment.createdAt).toLocaleString()}
                      </span>
                    </div>
                    <p className="text-sm text-gray-700 whitespace-pre-wrap">{comment.content}</p>
                  </div>
                </div>
              ))}
              
              {comments.length === 0 && (
                <p className="text-center text-gray-500 text-sm py-4">
                  {t('task.noComments')}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Footer - Comment Input */}
        <div className="p-4 border-t border-gray-100 bg-white shrink-0">
          <form onSubmit={handleAddComment} className="flex gap-2">
            <textarea
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder={t('task.writeComment')}
              className="flex-1 resize-none border border-gray-200 rounded-lg p-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent min-h-[50px] max-h-[100px]"
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleAddComment(e);
                }
              }}
            />
            <Button
              type="submit"
              disabled={isSubmitting || !newComment.trim()}
              isLoading={isSubmitting}
              className="h-auto"
            >
              <Send className="w-4 h-4" />
            </Button>
          </form>
        </div>
      </Card>
    </div>
  );
}
