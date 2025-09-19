'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Trophy, MapPin } from 'lucide-react'
import { createClientComponentClient } from '@/lib/supabase'
import type { Database } from '@/types/database'

type Team = Database['public']['Tables']['teams']['Row']

export function TeamsList() {
  const [teams, setTeams] = useState<Team[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null)
  const supabase = createClientComponentClient()

  async function fetchTeams() {
    try {
      console.log('🔍 Fetching teams from database...')
      const { data, error } = await supabase
        .from('teams')
        .select('*')
        .order('team_name')

      if (error) {
        console.error('❌ Error fetching teams:', error)
        throw error
      }

      console.log('✅ Teams fetched successfully:', data)
      console.log('📊 Teams with logos:', data?.filter(team => team.logo).length)
      console.log('📊 Teams without logos:', data?.filter(team => !team.logo).length)

      setTeams(data || [])
      setLastUpdated(new Date())
    } catch (err) {
      console.error('❌ Failed to fetch teams:', err)
      setError(err instanceof Error ? err.message : 'Failed to fetch teams')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchTeams()
    
    // Set up periodic refresh every 30 seconds to catch logo updates
    const interval = setInterval(fetchTeams, 30000)
    
    // Listen for logo update events
    const handleLogoUpdate = () => {
      console.log('🔄 Logo update event received, refreshing teams...')
      fetchTeams()
    }
    
    window.addEventListener('logoUpdated', handleLogoUpdate)
    
    return () => {
      clearInterval(interval)
      window.removeEventListener('logoUpdated', handleLogoUpdate)
    }
  }, [supabase])

  const handleRefresh = () => {
    setLoading(true)
    setError(null)
    fetchTeams()
  }

  if (loading) {
    return <TeamsListSkeleton />
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <div className="text-red-500 mb-4">Error loading teams: {error}</div>
        <button
          onClick={() => window.location.reload()}
          className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700"
        >
          Retry
        </button>
      </div>
    )
  }

  if (teams.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-gray-500">No teams found.</div>
      </div>
    )
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Teams</h2>
          {lastUpdated && (
            <p className="text-sm text-gray-500 mt-1">
              Last updated: {lastUpdated.toLocaleTimeString()}
            </p>
          )}
        </div>
        <button
          onClick={handleRefresh}
          className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors flex items-center space-x-2"
        >
          <span>🔄</span>
          <span>Refresh Teams</span>
        </button>
      </div>
      
      {/* Debug Info */}
      <div className="mb-4 p-3 bg-gray-50 rounded-lg text-sm text-gray-600">
        <div><strong>Total Teams:</strong> {teams.length}</div>
        <div><strong>Teams with Logos:</strong> {teams.filter(team => team.logo).length}</div>
        <div><strong>Teams without Logos:</strong> {teams.filter(team => !team.logo).length}</div>
        <div className="mt-2 text-xs">
          <strong>Sample Logo URLs:</strong>
          {teams.slice(0, 3).map(team => (
            <div key={team.id} className="ml-2">
              {team.team_name}: {team.logo || 'null'}
            </div>
          ))}
        </div>
        <div className="mt-2 text-xs">
          <strong>URL Encoding Check:</strong>
          {teams.slice(0, 3).map(team => (
            <div key={team.id} className="ml-2">
              {team.team_name}: 
              <br />
              Raw: {team.logo || 'null'}
              <br />
              Decoded: {team.logo ? decodeURIComponent(team.logo) : 'null'}
              <br />
              Encoded: {team.logo ? encodeURIComponent(team.logo) : 'null'}
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {teams.map((team) => (
        <Link
          key={team.id}
          href={`/teams/${team.id}`}
          className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-lg transition-shadow duration-200"
        >
          <div className="flex items-center space-x-4">
            <div className="flex-shrink-0">
              {team.logo ? (
                <Image
                  src={team.logo}
                  alt={team.team_name}
                  width={48}
                  height={48}
                  className="w-12 h-12 rounded-full object-cover"
                  unoptimized={team.logo.includes('via.placeholder.com')}
                />
              ) : (
                <div className="w-12 h-12 bg-gradient-to-br from-purple-400 to-blue-500 rounded-full flex items-center justify-center">
                  <Trophy className="w-6 h-6 text-white" />
                </div>
              )}
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="text-lg font-semibold text-gray-900 truncate">
                {team.team_name}
              </h3>
              <div className="flex items-center text-sm text-gray-500">
                <MapPin className="w-4 h-4 mr-1" />
                <span>{team.region}</span>
              </div>
              <p className="text-sm text-gray-400 mt-1">
                {team.team_code}
              </p>
            </div>
          </div>
        </Link>
      ))}
    </div>
    </div>
  )
}

function TeamsListSkeleton() {
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
