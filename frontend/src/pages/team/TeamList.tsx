import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Users, X, FolderOpen } from 'lucide-react';
import toast from 'react-hot-toast';
import { useTranslation } from 'react-i18next';
import { teamApi } from '../../api/teamApi';
import type { Team } from '../../types';
import { MainLayout } from '../../components/layout/MainLayout';
import { Button } from '../../components/ui/Button';
import { Card, CardContent } from '../../components/ui/Card';
import { Input } from '../../components/ui/Input';
import { RoleBadge } from '../../components/ui/Badge';

export function TeamList() {
  const [teams, setTeams] = useState<Team[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newTeamName, setNewTeamName] = useState('');
  const [newTeamDescription, setNewTeamDescription] = useState('');
  const [isCreating, setIsCreating] = useState(false);
  const { t } = useTranslation();

  const fetchTeams = async () => {
    try {
      const data = await teamApi.getMyTeams();
      setTeams(data);
    } catch {
      // Error handled by interceptor
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTeams();
  }, []);

  const handleCreateTeam = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsCreating(true);

    try {
      await teamApi.createTeam({
        name: newTeamName,
        description: newTeamDescription,
      });
      toast.success(t('team.createSuccess'));
      setShowCreateForm(false);
      setNewTeamName('');
      setNewTeamDescription('');
      fetchTeams();
    } catch {
      // Error handled by interceptor
    } finally {
      setIsCreating(false);
    }
  };

  if (isLoading) {
    return (
      <MainLayout title={t('team.myTeams')}>
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary-200 border-t-primary-600"></div>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout
      title={t('team.myTeams')}
      subtitle={t('team.manageSubtitle')}
      action={
        <Button
          onClick={() => setShowCreateForm(!showCreateForm)}
          leftIcon={showCreateForm ? <X className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
          variant={showCreateForm ? 'secondary' : 'primary'}
        >
          {showCreateForm ? t('common.cancel') : t('team.createTeam')}
        </Button>
      }
    >
      <div className="space-y-6">
        {/* Create Team Form */}
        {showCreateForm && (
          <Card className="border-2 border-primary-200 bg-primary-50/30">
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">{t('team.createNewTeam')}</h3>
              <form onSubmit={handleCreateTeam} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input
                    label={t('team.teamName')}
                    value={newTeamName}
                    onChange={(e) => setNewTeamName(e.target.value)}
                    required
                    placeholder={t('team.enterTeamName')}
                  />
                  <Input
                    label={t('team.descriptionOptional')}
                    value={newTeamDescription}
                    onChange={(e) => setNewTeamDescription(e.target.value)}
                    placeholder={t('team.enterDescription')}
                  />
                </div>
                <div className="flex justify-end">
                  <Button type="submit" isLoading={isCreating} leftIcon={<Plus className="w-4 h-4" />}>
                    {t('team.createTeam')}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        )}

        {/* Empty State */}
        {teams.length === 0 ? (
          <Card>
            <CardContent className="py-16">
              <div className="text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-100 rounded-full mb-4">
                  <FolderOpen className="w-8 h-8 text-gray-400" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-1">{t('team.noTeams')}</h3>
                <p className="text-gray-500 mb-4">{t('team.noTeamsSubtitle')}</p>
                <Button onClick={() => setShowCreateForm(true)} leftIcon={<Plus className="w-4 h-4" />}>
                  {t('team.createTeam')}
                </Button>
              </div>
            </CardContent>
          </Card>
        ) : (
          /* Team Grid */
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-6">
            {teams.map((team) => (
              <Link key={team.id} to={`/teams/${team.id}`}>
                <Card 
                  hover 
                  className={`h-full ${team.myRole === 'LEADER' ? 'ring-2 ring-primary-200' : ''}`}
                >
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-3">
                      <div className="w-12 h-12 bg-gradient-to-br from-primary-400 to-primary-600 rounded-xl flex items-center justify-center shadow-md">
                        <Users className="w-6 h-6 text-white" />
                      </div>
                      <RoleBadge role={team.myRole as 'LEADER' | 'MEMBER'} />
                    </div>
                    
                    <h3 className="text-lg font-semibold text-gray-900 mb-1 truncate">
                      {team.name}
                    </h3>
                    <p className="text-sm text-gray-500 line-clamp-2 min-h-[2.5rem]">
                      {team.description || 'No description provided'}
                    </p>
                    
                    <div className="mt-4 pt-4 border-t border-gray-100 flex items-center text-sm text-gray-500">
                      <Users className="w-4 h-4 mr-1.5" />
                      <span>{t('team.viewDetails')} →</span>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        )}
      </div>
    </MainLayout>
  );
}
