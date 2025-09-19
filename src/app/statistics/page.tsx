'use client'

import { useEffect, useState } from 'react'
import { BarChart3, TrendingUp, Trophy, Users, Target, Activity } from 'lucide-react'
import { createClientComponentClient } from '@/lib/supabase'
import type { Database } from '@/types/database'

type Statistic = Database['public']['Tables']['statistics']['Row']
type Team = Database['public']['Tables']['teams']['Row']
type Match = Database['public']['Tables']['matches']['Row']

// Type for teams data being fetched (only selected fields)
type TeamSummary = {
  id: number
  team_name: string
  team_code: string
  logo: string | null
}

export default function StatisticsPage() {
  const [statistics, setStatistics] = useState<Statistic[]>([])
  const [teams, setTeams] = useState<TeamSummary[]>([])
  const [matches, setMatches] = useState<Match[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedTeam, setSelectedTeam] = useState<number | null>(null)
  const supabase = createClientComponentClient()

  useEffect(() => {
    async function fetchData() {
      try {
        // Fetch statistics
        const { data: statsData, error: statsError } = await supabase
          .from('statistics')
          .select('*')
          .order('stat_date', { ascending: false })

        if (statsError) throw statsError

        // Fetch teams
        const { data: teamsData, error: teamsError } = await supabase
          .from('teams')
          .select('id, team_name, team_code, logo')
          .order('team_name')

        if (teamsError) throw teamsError

        // Fetch matches for matchup scores
        const { data: matchesData, error: matchesError } = await supabase
          .from('matches')
          .select('*')
          .eq('status', 'completed')
          .not('team1_id', 'is', null)
          .not('team2_id', 'is', null)

        if (matchesError) throw matchesError

        setStatistics(statsData || [])
        setTeams(teamsData || [])
        setMatches(matchesData || [])
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch statistics')
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [supabase])

  // Calculate summary statistics
  const totalTeams = teams.length
  const totalTournaments = statistics.filter(s => s.stat_type === 'tournament_count').length
  const totalMatches = statistics.filter(s => s.stat_type === 'match_count').length
  const avgWinRate = statistics
    .filter(s => s.stat_type === 'win_rate' && s.stat_value)
    .reduce((acc, stat) => acc + (stat.stat_value || 0), 0) / 
    statistics.filter(s => s.stat_type === 'win_rate' && s.stat_value).length || 0

  // Get team statistics
  const teamStats = teams.map(team => {
    const teamStats = statistics.filter(s => s.team_id === team.id)
    const winRate = teamStats.find(s => s.stat_type === 'win_rate')?.stat_value || 0
    const totalMatches = teamStats.find(s => s.stat_type === 'match_count')?.stat_value || 0
    const totalWins = teamStats.find(s => s.stat_type === 'total_wins')?.stat_value || 0
    
    return {
      ...team,
      winRate,
      totalMatches,
      totalWins
    }
  })

  // Filter statistics based on selected team
  const filteredStats = selectedTeam 
    ? statistics.filter(s => s.team_id === selectedTeam)
    : statistics

  // Generate matchup score matrix
  const generateMatchupScores = () => {
    const matrix: { [key: number]: { [key: number]: string } } = {}
    
    // Initialize matrix with empty cells
    teams.forEach(team1 => {
      matrix[team1.id] = {}
      teams.forEach(team2 => {
        if (team1.id === team2.id) {
          matrix[team1.id][team2.id] = '-'
        } else {
          matrix[team1.id][team2.id] = 'N/A'
        }
      })
    })

    // Fill in actual scores from matches
    matches.forEach(match => {
      if (match.team1_id && match.team2_id && match.status === 'completed') {
        const score = `${match.team1_score}-${match.team2_score}`
        matrix[match.team1_id][match.team2_id] = score
        
        // Also add reverse matchup if it doesn't exist
        if (matrix[match.team2_id][match.team1_id] === 'N/A') {
          const reverseScore = `${match.team2_score}-${match.team1_score}`
          matrix[match.team2_id][match.team1_id] = reverseScore
        }
      }
    })

    return matrix
  }

  const matchupScores = generateMatchupScores()

  if (loading) {
    return <StatisticsSkeleton />
  }

  if (error) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center py-12">
          <div className="text-red-500 mb-4">Error loading statistics: {error}</div>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700"
          >
            Retry
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Statistics & Analytics</h1>
        <p className="text-gray-600">Comprehensive analytics and performance metrics</p>
      </div>

      {/* Team Filter */}
      <div className="mb-6">
        <label htmlFor="team-select" className="block text-sm font-medium text-gray-700 mb-2">
          Filter by Team
        </label>
        <select
          id="team-select"
          value={selectedTeam || ''}
          onChange={(e) => setSelectedTeam(e.target.value ? Number(e.target.value) : null)}
          className="block w-full max-w-xs px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500"
        >
          <option value="">All Teams</option>
          {teams.map((team) => (
            <option key={team.id} value={team.id}>
              {team.team_name}
            </option>
          ))}
        </select>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <Users className="w-8 h-8 text-purple-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Total Teams</p>
              <p className="text-2xl font-bold text-gray-900">{totalTeams}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <Trophy className="w-8 h-8 text-yellow-500" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Tournaments</p>
              <p className="text-2xl font-bold text-gray-900">{totalTournaments}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <Activity className="w-8 h-8 text-green-500" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Total Matches</p>
              <p className="text-2xl font-bold text-gray-900">{totalMatches}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <Target className="w-8 h-8 text-blue-500" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Avg Win Rate</p>
              <p className="text-2xl font-bold text-gray-900">
                {avgWinRate > 0 ? `${(avgWinRate * 100).toFixed(1)}%` : 'N/A'}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Team Performance */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
        <h2 className="text-xl font-semibold text-gray-900 mb-6">Team Performance</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Team
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Matches
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Wins
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Win Rate
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {teamStats.map((team) => (
                <tr key={team.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      {team.logo && (
                        <img
                          src={team.logo}
                          alt={team.team_name}
                          className="w-8 h-8 rounded-full object-cover mr-3"
                        />
                      )}
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          {team.team_name}
                        </div>
                        <div className="text-sm text-gray-500">
                          {team.team_code}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {team.totalMatches}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {team.totalWins}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-1 bg-gray-200 rounded-full h-2 mr-2">
                        <div
                          className="bg-purple-600 h-2 rounded-full"
                          style={{ width: `${team.winRate * 100}%` }}
                        ></div>
                      </div>
                      <span className="text-sm text-gray-900">
                        {(team.winRate * 100).toFixed(1)}%
                      </span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Matchup Scores Table */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
        <h2 className="text-xl font-semibold text-gray-900 mb-6">Team Matchup Scores</h2>
        <p className="text-gray-600 mb-4">Head-to-head scores between all teams</p>
        
        {teams.length === 0 ? (
          <div className="text-center py-8">
            <BarChart3 className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <p className="text-gray-500">No teams available for matchup comparison.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <div className="inline-block min-w-full align-middle">
              <div className="overflow-hidden border border-gray-200 rounded-lg">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-32">
                        Team
                      </th>
                      {teams.map((team) => (
                        <th key={team.id} className="px-2 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider w-20">
                          <div className="flex flex-col items-center">
                            {team.logo && (
                              <img
                                src={team.logo}
                                alt={team.team_name}
                                className="w-8 h-8 rounded-full object-cover mb-1"
                                onError={(e) => {
                                  const target = e.target as HTMLImageElement
                                  target.style.display = 'none'
                                }}
                              />
                            )}
                            <span className="text-xs text-gray-500 truncate max-w-16">
                              {team.team_code}
                            </span>
                          </div>
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {teams.map((team1) => (
                      <tr key={team1.id} className="hover:bg-gray-50">
                        <td className="px-4 py-3 whitespace-nowrap">
                          <div className="flex items-center">
                            {team1.logo && (
                              <img
                                src={team1.logo}
                                alt={team1.team_name}
                                className="w-8 h-8 rounded-full object-cover mr-3"
                                onError={(e) => {
                                  const target = e.target as HTMLImageElement
                                  target.style.display = 'none'
                                }}
                              />
                            )}
                            <div>
                              <div className="text-sm font-medium text-gray-900">
                                {team1.team_name}
                              </div>
                              <div className="text-sm text-gray-500">
                                {team1.team_code}
                              </div>
                            </div>
                          </div>
                        </td>
                        {teams.map((team2) => (
                          <td key={team2.id} className="px-2 py-3 text-center">
                            <div className={`text-sm font-medium px-2 py-1 rounded ${
                              team1.id === team2.id 
                                ? 'bg-gray-100 text-gray-400' 
                                : matchupScores[team1.id]?.[team2.id] === 'N/A'
                                ? 'bg-gray-50 text-gray-400'
                                : 'bg-blue-50 text-blue-700'
                            }`}>
                              {matchupScores[team1.id]?.[team2.id] || 'N/A'}
                            </div>
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Recent Statistics */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-6">Recent Statistics</h2>
        {filteredStats.length === 0 ? (
          <div className="text-center py-8">
            <BarChart3 className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <p className="text-gray-500">No statistics available for the selected filter.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Type
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Value
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Team
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredStats.slice(0, 10).map((stat) => (
                  <tr key={stat.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {stat.stat_type.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {stat.stat_value ? (
                        stat.stat_type === 'win_rate' 
                          ? `${(stat.stat_value * 100).toFixed(1)}%`
                          : stat.stat_value.toString()
                      ) : 'N/A'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(stat.stat_date).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {teams.find(t => t.id === stat.team_id)?.team_name || 'All Teams'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}

function StatisticsSkeleton() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <div className="h-8 bg-gray-200 rounded w-64 mb-2"></div>
        <div className="h-4 bg-gray-200 rounded w-96"></div>
      </div>

      <div className="mb-6">
        <div className="h-4 bg-gray-200 rounded w-24 mb-2"></div>
        <div className="h-10 bg-gray-200 rounded w-64"></div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="w-8 h-8 bg-gray-200 rounded"></div>
              <div className="ml-4 flex-1">
                <div className="h-4 bg-gray-200 rounded w-20 mb-1"></div>
                <div className="h-6 bg-gray-200 rounded w-12"></div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
        <div className="h-6 bg-gray-200 rounded w-48 mb-6"></div>
        <div className="space-y-4">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="w-8 h-8 bg-gray-200 rounded-full mr-3"></div>
                <div>
                  <div className="h-4 bg-gray-200 rounded w-24 mb-1"></div>
                  <div className="h-3 bg-gray-200 rounded w-16"></div>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="h-4 bg-gray-200 rounded w-8"></div>
                <div className="h-4 bg-gray-200 rounded w-8"></div>
                <div className="h-4 bg-gray-200 rounded w-12"></div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Matchup Scores Table Skeleton */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
        <div className="h-6 bg-gray-200 rounded w-48 mb-2"></div>
        <div className="h-4 bg-gray-200 rounded w-64 mb-6"></div>
        <div className="overflow-x-auto">
          <div className="inline-block min-w-full align-middle">
            <div className="overflow-hidden border border-gray-200 rounded-lg">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 w-32">
                      <div className="h-4 bg-gray-200 rounded w-16"></div>
                    </th>
                    {[1, 2, 3, 4, 5].map((i) => (
                      <th key={i} className="px-2 py-3 w-20">
                        <div className="flex flex-col items-center">
                          <div className="w-8 h-8 bg-gray-200 rounded-full mb-1"></div>
                          <div className="h-3 bg-gray-200 rounded w-12"></div>
                        </div>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {[1, 2, 3, 4, 5].map((row) => (
                    <tr key={row}>
                      <td className="px-4 py-3">
                        <div className="flex items-center">
                          <div className="w-8 h-8 bg-gray-200 rounded-full mr-3"></div>
                          <div>
                            <div className="h-4 bg-gray-200 rounded w-24 mb-1"></div>
                            <div className="h-3 bg-gray-200 rounded w-16"></div>
                          </div>
                        </div>
                      </td>
                      {[1, 2, 3, 4, 5].map((col) => (
                        <td key={col} className="px-2 py-3 text-center">
                          <div className="h-6 bg-gray-200 rounded w-12 mx-auto"></div>
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
