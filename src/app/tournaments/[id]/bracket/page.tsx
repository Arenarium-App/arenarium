'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { ArrowLeft, Trophy, Users, Calendar } from 'lucide-react'
import { createClientComponentClient } from '@/lib/supabase'
import type { Database } from '@/types/database'
import TournamentBracket from '@/components/TournamentBracket'

type Tournament = Database['public']['Tables']['tournaments']['Row']
type TournamentStage = Database['public']['Tables']['tournament_stages']['Row']

interface TournamentWithStages extends Tournament {
  stages?: TournamentStage[]
}

export default function TournamentBracketPage() {
  const params = useParams();
  const router = useRouter()
  const [tournament, setTournament] = useState<TournamentWithStages | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const supabase = createClientComponentClient()

  useEffect(() => {
    async function fetchTournament() {
      try {
        const tournamentId = parseInt(params.id as string)
        
        if (isNaN(tournamentId)) {
          throw new Error('Invalid tournament ID')
        }

        // Fetch tournament data
        const { data: tournamentData, error: tournamentError } = await supabase
          .from('tournaments')
          .select('*')
          .eq('id', tournamentId)
          .single()

        if (tournamentError) {
          throw tournamentError
        }

        // Fetch stages for the tournament
        const { data: stagesData, error: stagesError } = await supabase
          .from('tournament_stages')
          .select('*')
          .eq('tournament_id', tournamentId)
          .order('stage_order')

        if (stagesError) {
          throw stagesError
        }

        setTournament({
          ...tournamentData,
          stages: stagesData || []
        })
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch tournament')
      } finally {
        setLoading(false)
      }
    }

    if (params.id) {
      fetchTournament()
    }
  }, [params.id, supabase])

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-64 mb-8"></div>
            <div className="h-96 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    )
  }

  if (error || !tournament) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Tournament Not Found</h1>
            <p className="text-gray-600 mb-6">{error || 'The tournament you are looking for does not exist.'}</p>
            <button
              onClick={() => router.back()}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-purple-600 hover:bg-purple-700"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Go Back
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => router.back()}
            className="inline-flex items-center text-sm text-gray-600 hover:text-gray-900 mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Tournaments
          </button>
          
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <h1 className="text-3xl font-bold text-gray-900 mb-2">{tournament.name}</h1>
                {tournament.description && (
                  <p className="text-gray-600 mb-4">{tournament.description}</p>
                )}
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600">
                  <div className="flex items-center">
                    <Calendar className="w-4 h-4 mr-2" />
                    <span>{formatDate(tournament.start_date)} - {formatDate(tournament.end_date)}</span>
                  </div>
                  
                  {tournament.stages && tournament.stages.length > 0 && (
                    <div className="flex items-center">
                      <Trophy className="w-4 h-4 mr-2" />
                      <span>{tournament.stages.length} Stage{tournament.stages.length !== 1 ? 's' : ''}</span>
                    </div>
                  )}
                  
                  {tournament.stages?.[0]?.format_config?.teams_count && (
                    <div className="flex items-center">
                      <Users className="w-4 h-4 mr-2" />
                      <span>{tournament.stages[0].format_config.teams_count} Teams</span>
                    </div>
                  )}
                </div>
              </div>
              
              {tournament.logo && (
                <img
                  src={tournament.logo}
                  alt={tournament.name}
                  className="w-20 h-20 rounded-lg object-cover"
                />
              )}
            </div>
          </div>
        </div>

        {/* Tournament Bracket */}
        {tournament.stages && tournament.stages.length > 0 ? (
          <div className="bg-white rounded-lg shadow-sm border">
            <TournamentBracket
              tournament={tournament}
              stages={tournament.stages}
              teams={[]}
              matches={[]}
              isExpanded={true}
              onToggle={() => {}}
            />
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-sm border p-12 text-center">
            <Trophy className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No Bracket Available</h3>
            <p className="text-gray-500">
              This tournament doesn&apos;t have any stages or bracket configuration yet.
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
