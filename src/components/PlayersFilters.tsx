'use client'

import { useState, useEffect } from 'react'
import { ChevronDown, Filter } from 'lucide-react'
import { createClientComponentClient } from '@/lib/supabase'
import type { Database } from '@/types/database'

type Player = Database['public']['Tables']['players']['Row']

export function PlayersFilters() {
  const [roles, setRoles] = useState<string[]>([])
  const [teams, setTeams] = useState<string[]>([])
  const [selectedRole, setSelectedRole] = useState<string>('all')
  const [selectedTeam, setSelectedTeam] = useState<string>('all')
  const [selectedStatus, setSelectedStatus] = useState<string>('all')
  const [isRoleOpen, setIsRoleOpen] = useState(false)
  const [isTeamOpen, setIsTeamOpen] = useState(false)
  const [isStatusOpen, setIsStatusOpen] = useState(false)
  const supabase = createClientComponentClient()

  useEffect(() => {
    async function fetchFilters() {
      try {
        // Fetch roles
        const { data: rolesData, error: rolesError } = await supabase
          .from('players')
          .select('role')
          .order('role')

        if (!rolesError && rolesData) {
          const uniqueRoles = [...new Set(rolesData.map(player => player.role))]
          setRoles(uniqueRoles)
        }

        // Fetch teams
        const { data: teamsData, error: teamsError } = await supabase
          .from('players')
          .select('team_code')
          .not('team_code', 'is', null)
          .order('team_code')

        if (!teamsError && teamsData) {
          const uniqueTeams = [...new Set(teamsData.map(player => player.team_code).filter(Boolean))]
          setTeams(uniqueTeams)
        }
      } catch (err) {
        console.error('Failed to fetch filters:', err)
      }
    }

    fetchFilters()
  }, [supabase])

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">Filters</h3>
        <Filter className="w-5 h-5 text-gray-400" />
      </div>

      {/* Role Filter */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Role
        </label>
        <div className="relative">
          <button
            type="button"
            className="w-full bg-white border border-gray-300 rounded-md pl-3 pr-10 py-2 text-left shadow-sm focus:outline-none focus:ring-1 focus:ring-purple-500 focus:border-purple-500"
            onClick={() => setIsRoleOpen(!isRoleOpen)}
          >
            <span className="block truncate">
              {selectedRole === 'all' ? 'All Roles' : selectedRole}
            </span>
            <span className="absolute inset-y-0 right-0 flex items-center pr-2">
              <ChevronDown className="w-5 h-5 text-gray-400" />
            </span>
          </button>

          {isRoleOpen && (
            <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-auto">
              <button
                className="w-full text-left px-3 py-2 text-sm hover:bg-gray-100 focus:bg-gray-100 focus:outline-none"
                onClick={() => {
                  setSelectedRole('all')
                  setIsRoleOpen(false)
                }}
              >
                All Roles
              </button>
              {roles.map((role) => (
                <button
                  key={role}
                  className="w-full text-left px-3 py-2 text-sm hover:bg-gray-100 focus:bg-gray-100 focus:outline-none"
                  onClick={() => {
                    setSelectedRole(role)
                    setIsRoleOpen(false)
                  }}
                >
                  {role}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Team Filter */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Team
        </label>
        <div className="relative">
          <button
            type="button"
            className="w-full bg-white border border-gray-300 rounded-md pl-3 pr-10 py-2 text-left shadow-sm focus:outline-none focus:ring-1 focus:ring-purple-500 focus:border-purple-500"
            onClick={() => setIsTeamOpen(!isTeamOpen)}
          >
            <span className="block truncate">
              {selectedTeam === 'all' ? 'All Teams' : selectedTeam}
            </span>
            <span className="absolute inset-y-0 right-0 flex items-center pr-2">
              <ChevronDown className="w-5 h-5 text-gray-400" />
            </span>
          </button>

          {isTeamOpen && (
            <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-auto">
              <button
                className="w-full text-left px-3 py-2 text-sm hover:bg-gray-100 focus:bg-gray-100 focus:outline-none"
                onClick={() => {
                  setSelectedTeam('all')
                  setIsTeamOpen(false)
                }}
              >
                All Teams
              </button>
              {teams.map((team) => (
                <button
                  key={team}
                  className="w-full text-left px-3 py-2 text-sm hover:bg-gray-100 focus:bg-gray-100 focus:outline-none"
                  onClick={() => {
                    setSelectedTeam(team)
                    setIsTeamOpen(false)
                  }}
                >
                  {team}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Status Filter */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Status
        </label>
        <div className="relative">
          <button
            type="button"
            className="w-full bg-white border border-gray-300 rounded-md pl-3 pr-10 py-2 text-left shadow-sm focus:outline-none focus:ring-1 focus:ring-purple-500 focus:border-purple-500"
            onClick={() => setIsStatusOpen(!isStatusOpen)}
          >
            <span className="block truncate">
              {selectedStatus === 'all' ? 'All Status' : selectedStatus}
            </span>
            <span className="absolute inset-y-0 right-0 flex items-center pr-2">
              <ChevronDown className="w-5 h-5 text-gray-400" />
            </span>
          </button>

          {isStatusOpen && (
            <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg">
              <button
                className="w-full text-left px-3 py-2 text-sm hover:bg-gray-100 focus:bg-gray-100 focus:outline-none"
                onClick={() => {
                  setSelectedStatus('all')
                  setIsStatusOpen(false)
                }}
              >
                All Status
              </button>
              <button
                className="w-full text-left px-3 py-2 text-sm hover:bg-gray-100 focus:bg-gray-100 focus:outline-none"
                onClick={() => {
                  setSelectedStatus('active')
                  setIsStatusOpen(false)
                }}
              >
                Active
              </button>
              <button
                className="w-full text-left px-3 py-2 text-sm hover:bg-gray-100 focus:bg-gray-100 focus:outline-none"
                onClick={() => {
                  setSelectedStatus('inactive')
                  setIsStatusOpen(false)
                }}
              >
                Inactive
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Clear Filters */}
      {(selectedRole !== 'all' || selectedTeam !== 'all' || selectedStatus !== 'all') && (
        <button
          onClick={() => {
            setSelectedRole('all')
            setSelectedTeam('all')
            setSelectedStatus('all')
          }}
          className="w-full px-4 py-2 text-sm font-medium text-purple-600 bg-purple-50 rounded-md hover:bg-purple-100 focus:outline-none focus:ring-2 focus:ring-purple-500"
        >
          Clear Filters
        </button>
      )}
    </div>
  )
}
