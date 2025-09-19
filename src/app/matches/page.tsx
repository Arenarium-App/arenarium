'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Calendar, Clock, Users, Trophy, Play, CheckCircle, XCircle } from 'lucide-react'
import { createClientComponentClient } from '@/lib/supabase'
import type { Database } from '@/types/database'

type Match = Database['public']['Tables']['matches']['Row'] & {
  team1: { team_name: string; team_code: string; logo: string | null } | null
  team2: { team_name: string; team_code: string; logo: string | null } | null
  tournament: { name: string } | null
}

export default function MatchesPage() {
  const [matches, setMatches] = useState<Match[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [filter, setFilter] = useState<'all' | 'scheduled' | 'live' | 'completed'>('all')
  const supabase = createClientComponentClient()

  useEffect(() => {
    async function fetchMatches() {
      try {
        let query = supabase
          .from('matches')
          .select(`
            *,
            team1:teams!team1_id(team_name, team_code, logo),
            team2:teams!team2_id(team_name, team_code, logo),
            tournament:tournaments(name)
          `)
          .order('match_date', { ascending: false })

        if (filter !== 'all') {
          query = query.eq('status', filter)
        }

        const { data, error } = await query

        if (error) {
          throw error
        }

        setMatches(data || [])
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch matches')
      } finally {
        setLoading(false)
      }
    }

    fetchMatches()
  }, [supabase, filter])

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'scheduled':
        return 'bg-blue-100 text-blue-800'
      case 'live':
        return 'bg-red-100 text-red-800'
      case 'completed':
        return 'bg-green-100 text-green-800'
      case 'cancelled':
        return 'bg-gray-100 text-gray-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'scheduled':
        return <Calendar className="w-4 h-4" />
      case 'live':
        return <Play className="w-4 h-4" />
      case 'completed':
        return <CheckCircle className="w-4 h-4" />
      case 'cancelled':
        return <XCircle className="w-4 h-4" />
      default:
        return <Calendar className="w-4 h-4" />
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60)
    const mins = minutes % 60
    return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`
  }

  if (loading) {
    return <MatchesSkeleton />
  }

  if (error) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center py-12">
          <div className="text-red-500 mb-4">Error loading matches: {error}</div>
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
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Matches</h1>
        <p className="text-gray-600">Track live and upcoming competitive matches</p>
      </div>

      {/* Filters */}
      <div className="mb-6">
        <div className="flex flex-wrap gap-2">
          {['all', 'scheduled', 'live', 'completed'].map((status) => (
            <button
              key={status}
              onClick={() => setFilter(status as 'all' | 'scheduled' | 'live' | 'completed')}
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

      {/* Matches List */}
      {matches.length === 0 ? (
        <div className="text-center py-12">
          <Trophy className="mx-auto h-12 w-12 text-gray-400 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No matches found</h3>
          <p className="text-gray-500">Check back later for upcoming matches.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {matches.map((match) => (
            <Link
              key={match.id}
              href={`/matches/${match.id}`}
              className="group bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-lg transition-shadow duration-200 p-6"
            >
              <div className="flex items-center justify-between">
                {/* Match Info */}
                <div className="flex-1">
                  <div className="flex items-center gap-4 mb-2">
                    <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(match.status)}`}>
                      {getStatusIcon(match.status)}
                      {match.status.charAt(0).toUpperCase() + match.status.slice(1)}
                    </span>
                    {match.tournament && (
                      <span className="text-sm text-gray-500">
                        {match.tournament.name}
                      </span>
                    )}
                    <span className="text-sm text-gray-500">
                      {match.stage}
                    </span>
                  </div>

                  {/* Teams */}
                  <div className="flex items-center gap-4 mb-2">
                    <div className="flex items-center gap-2">
                      {match.team1?.logo && (
                        <img
                          src={match.team1.logo}
                          alt={match.team1.team_name}
                          className="w-8 h-8 rounded-full object-cover"
                        />
                      )}
                      <span className="font-semibold text-gray-900">{match.team1?.team_name || 'TBD'}</span>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="text-2xl font-bold text-gray-900">VS</span>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-gray-900">{match.team2?.team_name || 'TBD'}</span>
                      {match.team2?.logo && (
                        <img
                          src={match.team2.logo}
                          alt={match.team2.team_name}
                          className="w-8 h-8 rounded-full object-cover"
                        />
                      )}
                    </div>
                  </div>

                  {/* Score */}
                  {match.status === 'completed' && (match.team1_score > 0 || match.team2_score > 0) && (
                    <div className="flex items-center gap-4 text-lg font-bold">
                      <span className={match.team1_score > match.team2_score ? 'text-green-600' : ''}>
                        {match.team1_score}
                      </span>
                      <span>-</span>
                      <span className={match.team2_score > match.team1_score ? 'text-green-600' : ''}>
                        {match.team2_score}
                      </span>
                    </div>
                  )}

                  {/* Match Details */}
                  <div className="flex items-center gap-4 text-sm text-gray-500 mt-2">
                    <div className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      <span>{formatDate(match.match_date)}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Users className="w-4 h-4" />
                      <span className="uppercase">{match.match_type}</span>
                    </div>
                    {match.venue && (
                      <div className="flex items-center gap-1">
                        <span>{match.venue}</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Arrow */}
                <div className="text-gray-400 group-hover:text-purple-600 transition-colors">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}

function MatchesSkeleton() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <div className="h-8 bg-gray-200 rounded w-32 mb-2"></div>
        <div className="h-4 bg-gray-200 rounded w-80"></div>
      </div>

      <div className="mb-6">
        <div className="flex gap-2">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-10 bg-gray-200 rounded w-24"></div>
          ))}
        </div>
      </div>

      <div className="space-y-4">
        {[1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-4 mb-2">
                  <div className="h-4 bg-gray-200 rounded w-16"></div>
                  <div className="h-4 bg-gray-200 rounded w-24"></div>
                  <div className="h-4 bg-gray-200 rounded w-20"></div>
                </div>
                <div className="flex items-center gap-4 mb-2">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-gray-200 rounded-full"></div>
                    <div className="h-4 bg-gray-200 rounded w-20"></div>
                  </div>
                  <div className="h-4 bg-gray-200 rounded w-8"></div>
                  <div className="flex items-center gap-2">
                    <div className="h-4 bg-gray-200 rounded w-20"></div>
                    <div className="w-8 h-8 bg-gray-200 rounded-full"></div>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="h-4 bg-gray-200 rounded w-32"></div>
                  <div className="h-4 bg-gray-200 rounded w-16"></div>
                </div>
              </div>
              <div className="w-5 h-5 bg-gray-200 rounded"></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
