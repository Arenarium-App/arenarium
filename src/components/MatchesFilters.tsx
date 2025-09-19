'use client'

import { useState, useEffect } from 'react'
import { ChevronDown, Filter, Calendar } from 'lucide-react'
import { createClientComponentClient } from '@/lib/supabase'
import type { Database } from '@/types/database'

type Game = Database['public']['Tables']['games']['Row']

export function MatchesFilters() {
  const [teams, setTeams] = useState<string[]>([])
  const [stages, setStages] = useState<string[]>([])
  const [selectedTeam, setSelectedTeam] = useState<string>('all')
  const [selectedStage, setSelectedStage] = useState<string>('all')
  const [isTeamOpen, setIsTeamOpen] = useState(false)
  const [isStageOpen, setIsStageOpen] = useState(false)
  const supabase = createClientComponentClient()

  useEffect(() => {
    async function fetchFilters() {
      try {
        // Fetch teams
        const { data: teamsData, error: teamsError } = await supabase
          .from('games')
          .select('team')
          .order('team')

        if (!teamsError && teamsData) {
          const uniqueTeams = [...new Set(teamsData.map(game => game.team))]
          setTeams(uniqueTeams)
        }

        // Fetch stages
        const { data: stagesData, error: stagesError } = await supabase
          .from('games')
          .select('stage')
          .order('stage')

        if (!stagesError && stagesData) {
          const uniqueStages = [...new Set(stagesData.map(game => game.stage))]
          setStages(uniqueStages)
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

      {/* Stage Filter */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Stage
        </label>
        <div className="relative">
          <button
            type="button"
            className="w-full bg-white border border-gray-300 rounded-md pl-3 pr-10 py-2 text-left shadow-sm focus:outline-none focus:ring-1 focus:ring-purple-500 focus:border-purple-500"
            onClick={() => setIsStageOpen(!isStageOpen)}
          >
            <span className="block truncate">
              {selectedStage === 'all' ? 'All Stages' : selectedStage}
            </span>
            <span className="absolute inset-y-0 right-0 flex items-center pr-2">
              <ChevronDown className="w-5 h-5 text-gray-400" />
            </span>
          </button>

          {isStageOpen && (
            <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-auto">
              <button
                className="w-full text-left px-3 py-2 text-sm hover:bg-gray-100 focus:bg-gray-100 focus:outline-none"
                onClick={() => {
                  setSelectedStage('all')
                  setIsStageOpen(false)
                }}
              >
                All Stages
              </button>
              {stages.map((stage) => (
                <button
                  key={stage}
                  className="w-full text-left px-3 py-2 text-sm hover:bg-gray-100 focus:bg-gray-100 focus:outline-none"
                  onClick={() => {
                    setSelectedStage(stage)
                    setIsStageOpen(false)
                  }}
                >
                  {stage}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Clear Filters */}
      {(selectedTeam !== 'all' || selectedStage !== 'all') && (
        <button
          onClick={() => {
            setSelectedTeam('all')
            setSelectedStage('all')
          }}
          className="w-full px-4 py-2 text-sm font-medium text-purple-600 bg-purple-50 rounded-md hover:bg-purple-100 focus:outline-none focus:ring-2 focus:ring-purple-500"
        >
          Clear Filters
        </button>
      )}
    </div>
  )
}
