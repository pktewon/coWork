import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Plus, UserPlus, X, Search } from 'lucide-react';
import toast from 'react-hot-toast';
import { teamApi } from '../../api/teamApi';
import { taskApi } from '../../api/taskApi';
import type { Team, TeamMember, Task, TaskUpdateRequest } from '../../types';
import { MainLayout } from '../../components/layout/MainLayout';
import { Button } from '../../components/ui/Button';
import { Card, CardContent } from '../../components/ui/Card';
import { Input } from '../../components/ui/Input';
import { TaskCard } from '../../components/team/TaskCard';
import { TaskDetailModal } from '../../components/team/TaskDetailModal';

export function TeamDetail() {
  const { teamId } = useParams<{ teamId: string }>();
  const navigate = useNavigate();
  const id = Number(teamId);

  const [team, setTeam] = useState<Team | null>(null);
  const [members, setMembers] = useState<TeamMember[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Modals state
  const [showTaskModal, setShowTaskModal] = useState(false);
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);

  // Form states
  const [newTask, setNewTask] = useState({
    title: '',
    content: '',
    priority: 'MEDIUM' as 'LOW' | 'MEDIUM' | 'HIGH',
    deadline: '',
    workerLoginId: '',
  });
  const [inviteLoginId, setInviteLoginId] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchData = async () => {
    try {
      if (!id) return;
      const [teamData, membersData, tasksData] = await Promise.all([
        teamApi.getTeam(id),
        teamApi.getTeamMembers(id),
        taskApi.getTeamTasks(id),
      ]);
      setTeam(teamData);
      setMembers(membersData);
      setTasks(tasksData);
    } catch (error) {
      console.error(error);
      toast.error('Failed to load team data');
      navigate('/teams');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [id]);

  const handleCreateTask = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const payload = {
        ...newTask,
        deadline: newTask.deadline || undefined,
        workerLoginId: newTask.workerLoginId || undefined,
      };
      await taskApi.createTask(id, payload);
      toast.success('Task created successfully');
      setShowTaskModal(false);
      setNewTask({
        title: '',
        content: '',
        priority: 'MEDIUM',
        deadline: '',
        workerLoginId: '',
      });
      fetchData(); // Refresh data
    } catch {
      // Error handled by interceptor
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInviteMember = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await teamApi.inviteMember(id, { loginId: inviteLoginId });
      toast.success('Member invited successfully');
      setShowInviteModal(false);
      setInviteLoginId('');
      fetchData(); // Refresh members
    } catch {
      // Error handled by interceptor
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUpdateTask = async (taskId: number, data: TaskUpdateRequest) => {
    try {
      await taskApi.updateTask(taskId, data);
      toast.success('Task updated');
      fetchData();
    } catch {
      // Error handled by interceptor
    }
  };

  const handleDeleteTask = async (taskId: number) => {
    try {
      await taskApi.deleteTask(taskId);
      toast.success('Task deleted');
      fetchData();
    } catch {
      // Error handled by interceptor
    }
  };

  if (isLoading) {
    return (
      <MainLayout>
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary-200 border-t-primary-600"></div>
        </div>
      </MainLayout>
    );
  }

  if (!team) return null;

  return (
    <MainLayout
      title={team.name}
      subtitle={team.description}
      action={
        <div className="flex gap-2">
          {/* Mobile only invite button */}
          <div className="xl:hidden">
            <Button
              variant="outline"
              onClick={() => setShowInviteModal(true)}
              leftIcon={<UserPlus className="w-4 h-4" />}
            >
              Invite
            </Button>
          </div>
          <Button
            onClick={() => setShowTaskModal(true)}
            leftIcon={<Plus className="w-4 h-4" />}
          >
            New Task
          </Button>
        </div>
      }
    >
      <div className="flex flex-col lg:flex-row gap-6 h-[calc(100vh-4rem)] items-start">
        {/* Kanban Board */}
        <div className="flex-1 min-w-0 h-full overflow-x-auto">
          <div className="flex gap-6 h-full min-w-[320px] md:min-w-0">
            {/* TODO Column */}
            <div className="bg-gray-100 rounded-xl p-4 flex flex-col gap-3 min-w-[280px] h-full">
              <div className="flex items-center justify-between mb-2 px-1">
                <h3 className="font-semibold text-gray-700 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-amber-500"></span>
                  To Do
                </h3>
                <span className="bg-gray-200 text-gray-600 text-xs px-2 py-1 rounded-full">
                  {tasks.filter(t => t.status === 'TODO').length}
                </span>
              </div>
              <div className="flex-1 overflow-y-auto min-h-[100px] pr-2 custom-scrollbar">
                {tasks
                  .filter(t => t.status === 'TODO')
                  .map(task => (
                    <TaskCard
                      key={task.id}
                      task={task}
                      onUpdate={handleUpdateTask}
                      onDelete={handleDeleteTask}
                      onClick={setSelectedTask}
                    />
                  ))}
              </div>
            </div>

            {/* IN_PROGRESS Column */}
            <div className="bg-gray-100 rounded-xl p-4 flex flex-col gap-3 min-w-[280px] h-full">
              <div className="flex items-center justify-between mb-2 px-1">
                <h3 className="font-semibold text-gray-700 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-blue-500"></span>
                  In Progress
                </h3>
                <span className="bg-gray-200 text-gray-600 text-xs px-2 py-1 rounded-full">
                  {tasks.filter(t => t.status === 'IN_PROGRESS').length}
                </span>
              </div>
              <div className="flex-1 overflow-y-auto min-h-[100px] pr-2 custom-scrollbar">
                {tasks
                  .filter(t => t.status === 'IN_PROGRESS')
                  .map(task => (
                    <TaskCard
                      key={task.id}
                      task={task}
                      onUpdate={handleUpdateTask}
                      onDelete={handleDeleteTask}
                      onClick={setSelectedTask}
                    />
                  ))}
              </div>
            </div>

            {/* DONE Column */}
            <div className="bg-gray-100 rounded-xl p-4 flex flex-col gap-3 min-w-[280px] h-full">
              <div className="flex items-center justify-between mb-2 px-1">
                <h3 className="font-semibold text-gray-700 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-green-500"></span>
                  Done
                </h3>
                <span className="bg-gray-200 text-gray-600 text-xs px-2 py-1 rounded-full">
                  {tasks.filter(t => t.status === 'DONE').length}
                </span>
              </div>
              <div className="flex-1 overflow-y-auto min-h-[100px] pr-2 custom-scrollbar">
                {tasks
                  .filter(t => t.status === 'DONE')
                  .map(task => (
                    <TaskCard
                      key={task.id}
                      task={task}
                      onUpdate={handleUpdateTask}
                      onDelete={handleDeleteTask}
                      onClick={setSelectedTask}
                    />
                  ))}
              </div>
            </div>
          </div>
        </div>

        {/* Team Members Sidebar (Desktop only) */}
        <div className="w-80 shrink-0 hidden lg:block h-full">
          <Card className="bg-white shadow-sm h-full max-h-full">
            <CardContent className="p-0 flex flex-col h-full">
              <div className="p-4 border-b border-gray-100">
                <h3 className="font-bold text-gray-900 flex items-center justify-between">
                  Team Members
                  <span className="bg-gray-100 text-gray-600 text-xs px-2 py-0.5 rounded-full">
                    {members.length}
                  </span>
                </h3>
              </div>
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {members.map(member => (
                  <div key={member.id} className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-primary-100 flex items-center justify-center text-primary-700 font-bold text-xs shrink-0">
                      {member.nickname.charAt(0).toUpperCase()}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">
                        {member.nickname}
                      </p>
                      <p className="text-xs text-gray-500 truncate">
                        {member.loginId}
                      </p>
                    </div>
                    {member.role === 'LEADER' && (
                      <span className="text-[10px] font-bold text-amber-600 bg-amber-50 px-1.5 py-0.5 rounded">
                        LEADER
                      </span>
                    )}
                  </div>
                ))}
              </div>
              <div className="p-4 border-t border-gray-100">
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => setShowInviteModal(true)}
                  leftIcon={<UserPlus className="w-4 h-4" />}
                >
                  Invite Member
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Task Detail Modal */}
      {selectedTask && (
        <TaskDetailModal
          task={selectedTask}
          onClose={() => setSelectedTask(null)}
          onUpdate={fetchData}
        />
      )}

      {/* Create Task Modal */}
      {showTaskModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <Card className="w-full max-w-lg bg-white shadow-2xl animate-in fade-in zoom-in duration-200">
            <CardContent className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold text-gray-900">Create New Task</h3>
                <button 
                  onClick={() => setShowTaskModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              
              <form onSubmit={handleCreateTask} className="space-y-4">
                <Input
                  label="Title"
                  value={newTask.title}
                  onChange={e => setNewTask({ ...newTask, title: e.target.value })}
                  required
                  placeholder="Task title"
                />
                
                <div className="space-y-1.5">
                  <label className="block text-sm font-medium text-gray-700">Content</label>
                  <textarea
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 min-h-[100px]"
                    value={newTask.content}
                    onChange={e => setNewTask({ ...newTask, content: e.target.value })}
                    placeholder="Task description..."
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="block text-sm font-medium text-gray-700">Priority</label>
                    <select
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                      value={newTask.priority}
                      onChange={e => setNewTask({ ...newTask, priority: e.target.value as any })}
                    >
                      <option value="LOW">Low</option>
                      <option value="MEDIUM">Medium</option>
                      <option value="HIGH">High</option>
                    </select>
                  </div>
                  
                  <Input
                    label="Deadline"
                    type="date"
                    value={newTask.deadline}
                    onChange={e => setNewTask({ ...newTask, deadline: e.target.value })}
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="block text-sm font-medium text-gray-700">Assignee</label>
                  <select
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                    value={newTask.workerLoginId}
                    onChange={e => setNewTask({ ...newTask, workerLoginId: e.target.value })}
                  >
                    <option value="">Unassigned</option>
                    {members.map(member => (
                      <option key={member.id} value={member.loginId}>
                        {member.nickname} ({member.loginId})
                      </option>
                    ))}
                  </select>
                </div>

                <div className="flex justify-end gap-3 mt-6">
                  <Button
                    type="button"
                    variant="ghost"
                    onClick={() => setShowTaskModal(false)}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    isLoading={isSubmitting}
                  >
                    Create Task
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Invite Member Modal */}
      {showInviteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <Card className="w-full max-w-md bg-white shadow-2xl animate-in fade-in zoom-in duration-200">
            <CardContent className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold text-gray-900">Invite Member</h3>
                <button 
                  onClick={() => setShowInviteModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              
              <form onSubmit={handleInviteMember} className="space-y-4">
                <Input
                  label="Member ID"
                  value={inviteLoginId}
                  onChange={e => setInviteLoginId(e.target.value)}
                  required
                  placeholder="Enter login ID to invite"
                  leftIcon={<Search className="w-4 h-4" />}
                />
                
                <div className="bg-blue-50 text-blue-700 p-3 rounded-lg text-sm">
                  <p>Inviting a member allows them to see this team and its tasks.</p>
                </div>

                <div className="flex justify-end gap-3 mt-6">
                  <Button
                    type="button"
                    variant="ghost"
                    onClick={() => setShowInviteModal(false)}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    isLoading={isSubmitting}
                  >
                    Invite
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      )}
    </MainLayout>
  );
}
