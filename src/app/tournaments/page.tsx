'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Trophy, Calendar, DollarSign, MapPin, Layers, ChevronDown, Play, History } from 'lucide-react'
import { createClientComponentClient } from '@/lib/supabase'
import type { Database } from '@/types/database'
import TournamentBracket from '@/components/TournamentBracket'

type Tournament = Database['public']['Tables']['tournaments']['Row']
type TournamentStage = Database['public']['Tables']['tournament_stages']['Row']
type Match = Database['public']['Tables']['matches']['Row']

interface TournamentWithStages extends Tournament {
  stages?: TournamentStage[]
  upcomingMatch?: Match | null
  lastMatch?: Match | null
}

export default function TournamentsPage() {
  const [tournaments, setTournaments] = useState<TournamentWithStages[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [filter, setFilter] = useState<'all' | 'upcoming' | 'ongoing' | 'completed'>('all')
  const [expandedTournaments, setExpandedTournaments] = useState<Set<number>>(new Set())
  const supabase = createClientComponentClient()

  useEffect(() => {
    async function fetchTournaments() {
      try {
        let query = supabase
          .from('tournaments')
          .select('*')
          .order('start_date', { ascending: false })

        if (filter !== 'all') {
          query = query.eq('status', filter)
        }

        const { data: tournamentsData, error: tournamentsError } = await query

        if (tournamentsError) {
          throw tournamentsError
        }

        // Fetch stages and match information for each tournament
        const tournamentsWithStages = await Promise.all(
          (tournamentsData || []).map(async (tournament) => {
            const { data: stagesData } = await supabase
              .from('tournament_stages')
              .select('*')
              .eq('tournament_id', tournament.id)
              .order('stage_order')
            
            // Fetch upcoming match for ongoing tournaments
            let upcomingMatch = null
            if (tournament.status === 'ongoing') {
              const { data: upcomingMatchData } = await supabase
                .from('matches')
                .select('*')
                .eq('tournament_id', tournament.id)
                .eq('status', 'scheduled')
                .gte('scheduled_time', new Date().toISOString())
                .order('scheduled_time', { ascending: true })
                .limit(1)
              upcomingMatch = upcomingMatchData?.[0] || null
            }

            // Fetch last completed match for completed tournaments
            let lastMatch = null
            if (tournament.status === 'completed') {
              const { data: lastMatchData } = await supabase
                .from('matches')
                .select('*')
                .eq('tournament_id', tournament.id)
                .eq('status', 'completed')
                .order('scheduled_time', { ascending: false })
                .limit(1)
              lastMatch = lastMatchData?.[0] || null
            }
            
            return {
              ...tournament,
              stages: stagesData || [],
              upcomingMatch,
              lastMatch
            }
          })
        )

        setTournaments(tournamentsWithStages)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch tournaments')
      } finally {
        setLoading(false)
      }
    }

    fetchTournaments()
  }, [supabase, filter])

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'upcoming':
        return 'bg-blue-100 text-blue-800'
      case 'ongoing':
        return 'bg-green-100 text-green-800'
      case 'completed':
        return 'bg-gray-100 text-gray-800'
      case 'cancelled':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  const formatPrizePool = (amount: number, currency: string) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency || 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount)
  }

  const getFormatDisplay = (tournament: TournamentWithStages) => {
    if (!tournament.stages || tournament.stages.length === 0) {
      return tournament.tournament_type.replace('_', ' ')
    }

    if (tournament.stages.length === 1) {
      return tournament.stages[0].format_type
    }

    return `${tournament.stages.length} Stages`
  }

  const getStagesPreview = (tournament: TournamentWithStages) => {
    if (!tournament.stages || tournament.stages.length === 0) {
      return null
    }

    if (tournament.stages.length === 1) {
      return null
    }

    return (
      <div className="flex items-center text-sm text-gray-500">
        <Layers className="w-4 h-4 mr-2" />
        <span>
          {tournament.stages.slice(0, 2).map((stage, index) => (
            <span key={stage.id}>
              {index > 0 && ' → '}
              {stage.stage_name}
            </span>
          ))}
          {tournament.stages.length > 2 && '...'}
        </span>
      </div>
    )
  }

  const toggleTournamentExpansion = (tournamentId: number) => {
    const newExpanded = new Set(expandedTournaments)
    if (newExpanded.has(tournamentId)) {
      newExpanded.delete(tournamentId)
    } else {
      newExpanded.add(tournamentId)
    }
    setExpandedTournaments(newExpanded)
  }

  const getMatchButtonText = (tournament: TournamentWithStages) => {
    if (tournament.status === 'ongoing' && tournament.upcomingMatch) {
      return 'Next Match'
    } else if (tournament.status === 'completed' && tournament.lastMatch) {
      return 'Last Match'
    } else if (tournament.status === 'upcoming') {
      return 'Tournament Info'
    }
    return 'Show Bracket'
  }

  const getMatchButtonIcon = (tournament: TournamentWithStages) => {
    if (tournament.status === 'ongoing' && tournament.upcomingMatch) {
      return Play
    } else if (tournament.status === 'completed' && tournament.lastMatch) {
      return History
    } else if (tournament.status === 'upcoming') {
      return Calendar
    }
    return ChevronDown
  }

  const getMatchButtonAction = (tournament: TournamentWithStages) => {
    if (tournament.status === 'ongoing' && tournament.upcomingMatch) {
      return () => {
        // Show upcoming match details
        alert(`Next match: ${tournament.upcomingMatch?.team1_name || 'TBD'} vs ${tournament.upcomingMatch?.team2_name || 'TBD'} on ${formatDate(tournament.upcomingMatch?.scheduled_time || '')}`)
      }
    } else if (tournament.status === 'completed' && tournament.lastMatch) {
      return () => {
        // Show last match details
        alert(`Last match: ${tournament.lastMatch?.team1_name || 'TBD'} vs ${tournament.lastMatch?.team2_name || 'TBD'} - ${tournament.lastMatch?.team1_score || 0} - ${tournament.lastMatch?.team2_score || 0}`)
      }
    } else if (tournament.status === 'upcoming') {
      return () => {
        // Show upcoming tournament info
        alert(`Tournament starts on ${formatDate(tournament.start_date)}`)
      }
    }
    return () => toggleTournamentExpansion(tournament.id)
  }

  if (loading) {
    return <TournamentsSkeleton />
  }

  if (error) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center py-12">
          <div className="text-red-500 mb-4">Error loading tournaments: {error}</div>
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
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Tournaments</h1>
        <p className="text-gray-600">Discover and track competitive gaming tournaments</p>
      </div>

      {/* Filters */}
      <div className="mb-6">
        <div className="flex flex-wrap gap-2">
          {['all', 'upcoming', 'ongoing', 'completed'].map((status) => (
            <button
              key={status}
              onClick={() => setFilter(status as 'all' | 'upcoming' | 'ongoing' | 'completed')}
              className={`px-4 py-2 rounded-md font-medium transition-colors ${
                filter === status
                  ? 'bg-purple-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {status.charAt(0).toUpperCase() + status.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Tournaments Grid */}
      {tournaments.length === 0 ? (
        <div className="text-center py-12">
          <Trophy className="mx-auto h-12 w-12 text-gray-400 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No tournaments found</h3>
          <p className="text-gray-500">Check back later for upcoming tournaments.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {tournaments.map((tournament) => (
            <div
              key={tournament.id}
              className="bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-lg transition-shadow duration-200"
            >
              <div className="p-6">
                {/* Tournament Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900">
                      {tournament.name}
                    </h3>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(tournament.status)}`}>
                      {tournament.status.charAt(0).toUpperCase() + tournament.status.slice(1)}
                    </span>
                  </div>
                  {tournament.logo && (
                    <img
                      src={tournament.logo}
                      alt={tournament.name}
                      className="w-12 h-12 rounded-lg object-cover"
                    />
                  )}
                </div>

                {/* Tournament Details */}
                <div className="space-y-3">
                  {tournament.description && (
                    <p className="text-gray-600 text-sm line-clamp-2">
                      {tournament.description}
                    </p>
                  )}

                  <div className="flex items-center text-sm text-gray-500">
                    <Calendar className="w-4 h-4 mr-2" />
                    <span>
                      {formatDate(tournament.start_date)} - {formatDate(tournament.end_date)}
                    </span>
                  </div>

                  {tournament.prize_pool > 0 && (
                    <div className="flex items-center text-sm text-gray-500">
                      <DollarSign className="w-4 h-4 mr-2" />
                      <span>Prize Pool: {formatPrizePool(tournament.prize_pool, tournament.currency)}</span>
                    </div>
                  )}

                  {tournament.region && (
                    <div className="flex items-center text-sm text-gray-500">
                      <MapPin className="w-4 h-4 mr-2" />
                      <span>{tournament.region}</span>
                    </div>
                  )}

                  <div className="flex items-center text-sm text-gray-500">
                    <Trophy className="w-4 h-4 mr-2" />
                    <span className="capitalize">{getFormatDisplay(tournament)}</span>
                  </div>

                  {/* Show stages preview for multi-stage tournaments */}
                  {getStagesPreview(tournament)}

                  {/* Action Buttons */}
                  {tournament.stages && tournament.stages.length > 0 && (
                    <div className="flex gap-2 mt-4">
                      <button
                        onClick={getMatchButtonAction(tournament)}
                        className="flex-1 flex items-center justify-center py-2 px-4 text-sm font-medium text-purple-600 bg-purple-50 rounded-md hover:bg-purple-100 transition-colors"
                      >
                        {(() => {
                          const Icon = getMatchButtonIcon(tournament)
                          return <Icon className="w-4 h-4 mr-2" />
                        })()}
                        {getMatchButtonText(tournament)}
                      </button>
                      <Link
                        href={`/tournaments/${tournament.id}`}
                        className="flex items-center justify-center py-2 px-4 text-sm font-medium text-gray-600 bg-gray-50 rounded-md hover:bg-gray-100 transition-colors"
                      >
                        View Details
                      </Link>
                    </div>
                  )}

                  {/* Full Bracket Button */}
                  {tournament.stages && tournament.stages.length > 0 && (
                    <div className="mt-2">
                      <Link
                        href={`/tournaments/${tournament.id}/bracket`}
                        className="w-full flex items-center justify-center py-2 px-4 text-sm font-medium text-purple-600 bg-purple-50 rounded-md hover:bg-purple-100 transition-colors border border-purple-200"
                      >
                        <Trophy className="w-4 h-4 mr-2" />
                        Full Bracket
                      </Link>
                    </div>
                  )}
                </div>
              </div>

              {/* Expandable Bracket Section */}
              {expandedTournaments.has(tournament.id) && tournament.stages && tournament.stages.length > 0 && (
                <div className="border-t border-gray-200">
                  <TournamentBracket
                    tournament={tournament}
                    stages={tournament.stages}
                    teams={[]}
                    matches={[]}
                    isExpanded={true}
                    onToggle={() => toggleTournamentExpansion(tournament.id)}
                  />
                </div>
              )}

              {/* Match Information Display */}
              {tournament.status === 'ongoing' && tournament.upcomingMatch && (
                <div className="border-t border-gray-200 p-4 bg-blue-50">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium text-blue-900">Next Match</h4>
                      <p className="text-sm text-blue-700">
                        {tournament.upcomingMatch.team1_name || 'TBD'} vs {tournament.upcomingMatch.team2_name || 'TBD'}
                      </p>
                      <p className="text-xs text-blue-600">
                        {formatDate(tournament.upcomingMatch.scheduled_time || '')}
                      </p>
                    </div>
                    <Play className="w-5 h-5 text-blue-600" />
                  </div>
                </div>
              )}

              {tournament.status === 'completed' && tournament.lastMatch && (
                <div className="border-t border-gray-200 p-4 bg-gray-50">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium text-gray-900">Last Match Result</h4>
                      <p className="text-sm text-gray-700">
                        {tournament.lastMatch.team1_name || 'TBD'} vs {tournament.lastMatch.team2_name || 'TBD'}
                      </p>
                      <p className="text-xs text-gray-600">
                        Final Score: {tournament.lastMatch.team1_score || 0} - {tournament.lastMatch.team2_score || 0}
                      </p>
                    </div>
                    <History className="w-5 h-5 text-gray-600" />
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

function TournamentsSkeleton() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <div className="h-8 bg-gray-200 rounded w-48 mb-2"></div>
        <div className="h-4 bg-gray-200 rounded w-96"></div>
      </div>

      <div className="mb-6">
        <div className="flex gap-2">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-10 bg-gray-200 rounded w-20"></div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div key={i} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <div className="h-5 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-16"></div>
              </div>
              <div className="w-12 h-12 bg-gray-200 rounded-lg"></div>
            </div>
            <div className="space-y-3">
              <div className="h-4 bg-gray-200 rounded w-full"></div>
              <div className="h-4 bg-gray-200 rounded w-3/4"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2"></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
