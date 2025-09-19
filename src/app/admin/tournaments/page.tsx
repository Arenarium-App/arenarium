'use client'

import { useState, useEffect } from 'react'
import { createClientComponentClient } from '@/lib/supabase'
import { ArrowLeft, Search, Edit, Eye, Trophy } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'
import type { Database } from '@/types/database'

type Tournament = Database['public']['Tables']['tournaments']['Row'] & {
  tournament_teams: { count: number }[]
}

export default function AdminTournamentsPage() {
  const [tournaments, setTournaments] = useState<Tournament[]>([])
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
        .select(`
          *,
          tournament_teams(count)
        `)
        .order('created_at', { ascending: false })
      
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
    tournament.type?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    tournament.status?.toLowerCase().includes(searchTerm.toLowerCase())
  )

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/3 mb-4"></div>
            <div className="h-64 bg-gray-200 rounded mb-8"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="h-48 bg-gray-200 rounded"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Error Loading Tournaments</h1>
            <p className="text-gray-600 mb-4">{error}</p>
            <button
              onClick={fetchTournaments}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
            >
              Try Again
            </button>
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
            <div className="text-sm text-gray-600">
              {filteredTournaments.length} tournament{filteredTournaments.length !== 1 ? 's' : ''}
            </div>
          </div>

          {/* Search */}
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search tournaments..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>
        </div>

        {/* Tournaments Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTournaments.map((tournament) => (
            <div key={tournament.id} className="bg-white rounded-lg shadow-sm border hover:shadow-md transition-shadow">
              <div className="p-6">
                {/* Tournament Header */}
                <div className="flex items-start space-x-4 mb-4">
                  {tournament.logo && (
                    <div className="relative w-16 h-16 flex-shrink-0">
                      <Image
                        src={tournament.logo}
                        alt={tournament.name}
                        fill
                        className="rounded-lg object-cover"
                      />
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <h3 className="text-lg font-semibold text-gray-900 truncate">{tournament.name}</h3>
                    <p className="text-sm text-gray-600 truncate">{tournament.description}</p>
                  </div>
                </div>

                {/* Tournament Details */}
                <div className="space-y-3 mb-4">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Type:</span>
                    <span className="font-medium text-gray-900">{tournament.type}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Status:</span>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      tournament.status === 'ongoing' ? 'bg-green-100 text-green-800' :
                      tournament.status === 'upcoming' ? 'bg-blue-100 text-blue-800' :
                      tournament.status === 'completed' ? 'bg-gray-100 text-gray-800' :
                      'bg-yellow-100 text-yellow-800'
                    }`}>
                      {tournament.status}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Prize Pool:</span>
                    <span className="font-medium text-gray-900">${tournament.prize_pool?.toLocaleString() || '0'}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Teams:</span>
                    <span className="font-medium text-gray-900">{tournament.tournament_teams?.[0]?.count || 0}</span>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex space-x-2">
                  <Link
                    href={`/admin/tournaments/${tournament.id}`}
                    className="flex-1 inline-flex items-center justify-center px-3 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  >
                    <Edit className="w-4 h-4 mr-2" />
                    Manage
                  </Link>
                  <Link
                    href={`/tournaments/${tournament.id}`}
                    className="inline-flex items-center justify-center px-3 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
                  >
                    <Eye className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {filteredTournaments.length === 0 && (
          <div className="text-center py-12">
            <Trophy className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              {searchTerm ? 'No tournaments found' : 'No tournaments yet'}
            </h3>
            <p className="text-gray-600 mb-4">
              {searchTerm ? 'Try adjusting your search terms' : 'Create your first tournament to get started'}
            </p>
            {!searchTerm && (
              <Link
                href="/admin/tournament-formats"
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
              >
                Create Tournament
              </Link>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
