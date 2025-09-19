'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import { createClientComponentClient } from '@/lib/supabase'
import { ArrowLeft, Edit, Settings, Users, Trophy, Calendar, DollarSign } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'
import TournamentBracket from '@/components/TournamentBracket'
import TournamentTeamManager from '@/components/TournamentTeamManager'
import type { Database } from '@/types/database'

type Tournament = Database['public']['Tables']['tournaments']['Row']
type TournamentStage = Database['public']['Tables']['tournament_stages']['Row']
type TournamentTeam = Database['public']['Tables']['tournament_teams']['Row'] & {
  team: Database['public']['Tables']['teams']['Row']
}
type Match = Database['public']['Tables']['matches']['Row']

export default function AdminTournamentDetailPage() {
  const params = useParams()
  const [tournament, setTournament] = useState<Tournament | null>(null)
  const [stages, setStages] = useState<TournamentStage[]>([])
  const [teams, setTeams] = useState<TournamentTeam[]>([])
  const [matches, setMatches] = useState<Match[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState<'overview' | 'teams' | 'bracket' | 'settings'>('overview')

  const supabase = createClientComponentClient()

  useEffect(() => {
    if (params.id) {
      fetchTournamentData()
    }
  }, [params.id])

  async function fetchTournamentData() {
    try {
      setLoading(true)
      const tournamentId = parseInt(params.id as string)

      // Fetch tournament details
      const { data: tournamentData, error: tournamentError } = await supabase
        .from('tournaments')
        .select('*')
        .eq('id', tournamentId)
        .single()

      if (tournamentError) throw tournamentError

      // Fetch tournament stages
      const { data: stagesData, error: stagesError } = await supabase
        .from('tournament_stages')
        .select('*')
        .eq('tournament_id', tournamentId)
        .order('stage_order')

      if (stagesError) throw stagesError

      // Fetch tournament teams with team details
      const { data: teamsData, error: teamsError } = await supabase
        .from('tournament_teams')
        .select(`
          *,
          team:teams(*)
        `)
        .eq('tournament_id', tournamentId)
        .order('seed')

      if (teamsError) throw teamsError

      // Fetch matches
      const { data: matchesData, error: matchesError } = await supabase
        .from('matches')
        .select('*')
        .eq('tournament_id', tournamentId)
        .order('match_date')

      if (matchesError) throw matchesError

      setTournament(tournamentData)
      setStages(stagesData || [])
      setTeams(teamsData || [])
      setMatches(matchesData || [])
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch tournament data')
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/3 mb-4"></div>
            <div className="h-64 bg-gray-200 rounded mb-8"></div>
            <div className="h-96 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    )
  }

  if (error || !tournament) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Error Loading Tournament</h1>
            <p className="text-gray-600 mb-4">{error || 'Tournament not found'}</p>
            <Link
              href="/admin"
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
            >
              Back to Admin Dashboard
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-4">
              <Link
                href="/admin"
                className="inline-flex items-center text-gray-600 hover:text-gray-900"
              >
                <ArrowLeft className="w-5 h-5 mr-2" />
                Back to Admin
              </Link>
              <div className="h-6 w-px bg-gray-300"></div>
              <h1 className="text-3xl font-bold text-gray-900">Tournament Management</h1>
            </div>
            <div className="flex items-center space-x-3">
              <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                tournament.status === 'ongoing' ? 'bg-green-100 text-green-800' :
                tournament.status === 'upcoming' ? 'bg-blue-100 text-blue-800' :
                tournament.status === 'completed' ? 'bg-gray-100 text-gray-800' :
                'bg-yellow-100 text-yellow-800'
              }`}>
                {tournament.status}
              </span>
            </div>
          </div>

          {/* Tournament Info Card */}
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <div className="flex items-start space-x-6">
              {tournament.logo && (
                <div className="relative w-20 h-20">
                  <Image
                    src={tournament.logo}
                    alt={tournament.name}
                    fill
                    className="rounded-lg object-cover"
                  />
                </div>
              )}
              <div className="flex-1">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">{tournament.name}</h2>
                <p className="text-gray-600 mb-4">{tournament.description}</p>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                  <div className="flex items-center space-x-2">
                    <Calendar className="w-4 h-4 text-gray-400" />
                    <span className="text-gray-600">
                      {new Date(tournament.start_date).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Calendar className="w-4 h-4 text-gray-400" />
                    <span className="text-gray-600">
                      {new Date(tournament.end_date).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <DollarSign className="w-4 h-4 text-gray-400" />
                    <span className="text-gray-600">${tournament.prize_pool?.toLocaleString() || '0'}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Trophy className="w-4 h-4 text-gray-400" />
                    <span className="text-gray-600">{tournament.tournament_type}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Admin Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg border p-6 text-center">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-3">
              <Users className="w-6 h-6 text-blue-600" />
            </div>
            <div className="text-2xl font-bold text-gray-900">{teams.length}</div>
            <div className="text-sm text-gray-600">Participating Teams</div>
          </div>
          <div className="bg-white rounded-lg border p-6 text-center">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-3">
              <Trophy className="w-6 h-6 text-green-600" />
            </div>
            <div className="text-2xl font-bold text-gray-900">{stages.length}</div>
            <div className="text-sm text-gray-600">Tournament Stages</div>
          </div>
          <div className="bg-white rounded-lg border p-6 text-center">
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-3">
              <Edit className="w-6 h-6 text-purple-600" />
            </div>
            <div className="text-2xl font-bold text-gray-900">{matches.length}</div>
            <div className="text-sm text-gray-600">Total Matches</div>
          </div>
          <div className="bg-white rounded-lg border p-6 text-center">
            <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mx-auto mb-3">
              <Settings className="w-6 h-6 text-orange-600" />
            </div>
            <div className="text-2xl font-bold text-gray-900">{tournament.status}</div>
            <div className="text-sm text-gray-600">Status</div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="bg-white rounded-lg border mb-8">
          <nav className="flex space-x-8 px-6">
            {[
              { id: 'overview', label: 'Overview', icon: Trophy },
              { id: 'teams', label: 'Team Management', icon: Users },
              { id: 'bracket', label: 'Tournament Bracket', icon: Edit },
              { id: 'settings', label: 'Format Settings', icon: Settings }
            ].map((tab) => {
              const Icon = tab.icon
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as 'overview' | 'teams' | 'bracket' | 'settings')}
                  className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center space-x-2 ${
                    activeTab === tab.id
                      ? 'border-indigo-500 text-indigo-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{tab.label}</span>
                </button>
              )
            })}
          </nav>
        </div>

        {/* Tab Content */}
        <div className="bg-white rounded-lg border p-6">
          {activeTab === 'overview' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Tournament Overview</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">Quick Actions</h4>
                    <div className="space-y-3">
                      <Link
                        href={`/admin/tournament-teams?tournament=${tournament.id}`}
                        className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
                      >
                        Manage Teams
                      </Link>
                      <Link
                        href="/admin/tournament-formats"
                        className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                      >
                        Configure Format
                      </Link>
                    </div>
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">Tournament Details</h4>
                    <dl className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <dt className="text-gray-600">Created:</dt>
                        <dd className="text-gray-900">{tournament.created_at ? new Date(tournament.created_at).toLocaleDateString() : 'N/A'}</dd>
                      </div>
                      <div className="flex justify-between">
                        <dt className="text-gray-600">Updated:</dt>
                        <dd className="text-gray-900">{tournament.updated_at ? new Date(tournament.updated_at).toLocaleDateString() : 'N/A'}</dd>
                      </div>
                      <div className="flex justify-between">
                        <dt className="text-gray-600">Max Teams:</dt>
                        <dd className="text-gray-900">{tournament.max_teams || 'N/A'}</dd>
                      </div>
                    </dl>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'teams' && (
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Team Management</h3>
              <TournamentTeamManager tournamentId={tournament.id} />
            </div>
          )}

          {activeTab === 'bracket' && (
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Tournament Bracket</h3>
              <TournamentBracket
                tournament={tournament}
                stages={stages}
                teams={teams}
                matches={matches}
                isExpanded={true}
                onToggle={() => {}}
              />
            </div>
          )}

          {activeTab === 'settings' && (
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Format Settings</h3>
              <div className="text-center py-8">
                <Settings className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600 mb-4">Configure tournament formats and stages</p>
                <Link
                  href="/admin/tournament-formats"
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
                >
                  Go to Format Manager
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
