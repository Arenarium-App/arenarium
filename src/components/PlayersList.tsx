'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { User, MapPin, Shield } from 'lucide-react'
import { createClientComponentClient } from '@/lib/supabase'
import type { Database } from '@/types/database'

type Player = Database['public']['Tables']['players']['Row']

export function PlayersList() {
  const [players, setPlayers] = useState<Player[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const supabase = createClientComponentClient()

  useEffect(() => {
    async function fetchPlayers() {
      try {
        const { data, error } = await supabase
          .from('players')
          .select('*')
          .order('in_game_name')

        if (error) {
          throw error
        }

        setPlayers(data || [])
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch players')
      } finally {
        setLoading(false)
      }
    }

    fetchPlayers()
  }, [supabase])

  if (loading) {
    return <PlayersListSkeleton />
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <div className="text-red-500 mb-4">Error loading players: {error}</div>
        <button
          onClick={() => window.location.reload()}
          className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700"
        >
          Retry
        </button>
      </div>
    )
  }

  if (players.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-gray-500">No players found.</div>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {players.map((player) => (
        <Link
          key={player.id}
          href={`/players/${player.id}`}
          className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-lg transition-shadow duration-200"
        >
          <div className="flex items-center space-x-4">
            <div className="flex-shrink-0">
              {player.player_photo ? (
                <Image
                  src={player.player_photo}
                  alt={player.in_game_name}
                  width={48}
                  height={48}
                  className="w-12 h-12 rounded-full object-cover"
                />
              ) : (
                <div className="w-12 h-12 bg-gradient-to-br from-green-400 to-blue-500 rounded-full flex items-center justify-center">
                  <User className="w-6 h-6 text-white" />
                </div>
              )}
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="text-lg font-semibold text-gray-900 truncate">
                {player.in_game_name}
              </h3>
              <p className="text-sm text-gray-500 truncate">
                {player.real_name}
              </p>
              <div className="flex items-center mt-1">
                <Shield className="w-4 h-4 text-gray-400 mr-1" />
                <span className="text-sm text-gray-400">{player.role}</span>
                <span className={`ml-2 px-2 py-1 text-xs rounded-full ${
                  player.status === 'active' 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-gray-100 text-gray-800'
                }`}>
                  {player.status}
                </span>
              </div>
            </div>
          </div>
        </Link>
      ))}
    </div>
  )
}

function PlayersListSkeleton() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {[...Array(6)].map((_, i) => (
        <div key={i} className="bg-white rounded-lg shadow p-6 animate-pulse">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-gray-200 rounded-full"></div>
            <div className="flex-1">
              <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
              <div className="h-3 bg-gray-200 rounded w-1/2"></div>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
