'use client'

import { useState, useEffect } from 'react'
import { createClientComponentClient } from '@/lib/supabase'
import { ArrowLeft, Trophy, Users, Search } from 'lucide-react'
import Link from 'next/link'
import TournamentTeamManager from '@/components/TournamentTeamManager'
import type { Database } from '@/types/database'

type Tournament = Database['public']['Tables']['tournaments']['Row']

export default function AdminTournamentTeamsPage() {
  const [tournaments, setTournaments] = useState<Tournament[]>([])
  const [selectedTournament, setSelectedTournament] = useState<Tournament | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  
  const supabase = createClientComponentClient()

  useEffect(() => {
    fetchTournaments()
  }, [])

  async function fetchTournaments() {
    try {
      setLoading(true)
      
      const { data, error } = await supabase
        .from('tournaments')
        .select('*')
        .order('name')
      
      if (error) throw error
      
      setTournaments(data || [])
      
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch tournaments')
    } finally {
      setLoading(false)
    }
  }

  const filteredTournaments = tournaments.filter(tournament =>
    tournament.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    tournament.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    tournament.tournament_type.toLowerCase().includes(searchTerm.toLowerCase())
  )

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-purple-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading tournaments...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Error Loading Tournaments</h1>
          <p className="text-gray-600 mb-6">{error}</p>
          <button
            onClick={() => window.history.back()}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-purple-600 hover:bg-purple-700"
          >
            Go Back
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <Link
                href="/admin"
                className="flex items-center text-gray-500 hover:text-gray-700 transition-colors"
              >
                <ArrowLeft className="w-5 h-5 mr-2" />
                Back to Admin
              </Link>
              <div className="h-6 w-px bg-gray-300" />
              <div className="flex items-center space-x-2">
                <Trophy className="w-6 h-6 text-purple-600" />
                <h1 className="text-xl font-semibold text-gray-900">Tournament Team Management</h1>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
                {tournaments.length} tournaments
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Description */}
        <div className="mb-8">
          <div className="flex items-center space-x-3 mb-4">
            <Users className="w-8 h-8 text-purple-600" />
            <h2 className="text-2xl font-bold text-gray-900">Manage Tournament Teams</h2>
          </div>
          <p className="text-gray-600 max-w-3xl">
            Add, remove, and manage participating teams for tournaments. You can set team seeds, 
            final positions, and prize money. All changes are immediately reflected in the user view.
          </p>
        </div>

        {!selectedTournament ? (
          /* Tournament Selection View */
          <div className="space-y-6">
            {/* Search */}
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search tournaments by name, description, or type..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-purple-500 focus:border-purple-500 sm:text-sm"
              />
            </div>

            {/* Tournaments Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredTournaments.map((tournament) => (
                <div
                  key={tournament.id}
                  className="bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow cursor-pointer"
                  onClick={() => setSelectedTournament(tournament)}
                >
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-blue-600 rounded-lg flex items-center justify-center">
                        <Trophy className="w-6 h-6 text-white" />
                      </div>
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                        tournament.status === 'upcoming' ? 'bg-blue-100 text-blue-800' :
                        tournament.status === 'ongoing' ? 'bg-green-100 text-green-800' :
                        tournament.status === 'completed' ? 'bg-gray-100 text-gray-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {tournament.status.replace('_', ' ')}
                      </span>
                    </div>
                    
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">{tournament.name}</h3>
                    <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                      {tournament.description || 'No description available'}
                    </p>
                    
                    <div className="space-y-2 text-sm text-gray-500">
                      <div className="flex items-center justify-between">
                        <span>Type:</span>
                        <span className="font-medium text-gray-900 capitalize">
                          {tournament.tournament_type.replace('_', ' ')}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span>Prize Pool:</span>
                        <span className="font-medium text-gray-900">
                          ${tournament.prize_pool?.toLocaleString() || '0'}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span>Dates:</span>
                        <span className="font-medium text-gray-900 text-right">
                          {new Date(tournament.start_date).toLocaleDateString()} - {new Date(tournament.end_date).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                    
                    <div className="mt-4 pt-4 border-t border-gray-200">
                      <button className="w-full inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500">
                        <Users className="w-4 h-4 mr-2" />
                        Manage Teams
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {filteredTournaments.length === 0 && (
              <div className="text-center py-12">
                <Trophy className="w-16 h-16 mx-auto text-gray-300 mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No tournaments found</h3>
                <p className="text-gray-500">
                  {searchTerm ? `No tournaments match "${searchTerm}"` : 'No tournaments available'}
                </p>
              </div>
            )}
          </div>
        ) : (
          /* Tournament Team Management View */
          <div className="space-y-6">
            {/* Back to Tournament Selection */}
            <div className="flex items-center justify-between">
              <button
                onClick={() => setSelectedTournament(null)}
                className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Tournaments
              </button>
              
              <div className="text-right">
                <h3 className="text-lg font-medium text-gray-900">{selectedTournament.name}</h3>
                <p className="text-sm text-gray-500">
                  {selectedTournament.tournament_type.replace('_', ' ')} • {selectedTournament.status}
                </p>
              </div>
            </div>

            {/* Tournament Team Manager */}
            <TournamentTeamManager tournamentId={selectedTournament.id} />
          </div>
        )}

        {/* Quick Actions */}
        <div className="mt-12 bg-white border border-gray-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Link
              href="/admin/tournament-formats"
              className="flex items-center p-4 border border-gray-200 rounded-lg hover:border-purple-300 hover:bg-purple-50 transition-colors"
            >
              <Trophy className="w-5 h-5 text-purple-600 mr-3" />
              <div>
                <div className="font-medium text-gray-900">Tournament Formats</div>
                <div className="text-sm text-gray-500">Configure tournament structures and rules</div>
              </div>
            </Link>
            
            <Link
              href="/admin/teams"
              className="flex items-center p-4 border border-gray-200 rounded-lg hover:border-purple-300 hover:bg-purple-50 transition-colors"
            >
              <Users className="w-5 h-5 text-purple-600 mr-3" />
              <div>
                <div className="font-medium text-gray-900">Team Management</div>
                <div className="text-sm text-gray-500">Manage team logos and information</div>
              </div>
            </Link>
            
            <Link
              href="/tournaments"
              className="flex items-center p-4 border border-gray-200 rounded-lg hover:border-purple-300 hover:bg-purple-50 transition-colors"
            >
              <Trophy className="w-5 h-5 text-purple-600 mr-3" />
              <div>
                <div className="font-medium text-gray-900">View Public Tournaments</div>
                <div className="text-sm text-gray-500">See how tournaments appear to visitors</div>
              </div>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}




