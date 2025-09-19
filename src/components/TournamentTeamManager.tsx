'use client'

import { useState, useEffect } from 'react'
import { createClientComponentClient } from '@/lib/supabase'
import { Plus, Edit, Trash2, Save, X, ArrowUp, ArrowDown, Users, Trophy } from 'lucide-react'
import type { Database } from '@/types/database'

type Tournament = Database['public']['Tables']['tournaments']['Row']
type TournamentTeam = Database['public']['Tables']['tournament_teams']['Row']
type Team = Database['public']['Tables']['teams']['Row']

interface TournamentTeamWithTeam extends TournamentTeam {
  team: Team
}

interface EditableTournamentTeam {
  id?: string
  tournament_id: string
  team_id: string
  seed: number | null
  final_position: number | null
  prize_money: number | null
  isNew?: boolean
}

export default function TournamentTeamManager({ tournamentId }: { tournamentId: string }) {
  const [tournament, setTournament] = useState<Tournament | null>(null)
  const [tournamentTeams, setTournamentTeams] = useState<TournamentTeamWithTeam[]>([])
  const [availableTeams, setAvailableTeams] = useState<Team[]>([])
  const [editingTeams, setEditingTeams] = useState<EditableTournamentTeam[]>([])
  const [isEditing, setIsEditing] = useState(false)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)
  
  const supabase = createClientComponentClient()

  useEffect(() => {
    fetchData()
  }, [tournamentId])

  async function fetchData() {
    try {
      setLoading(true)
      
      // Fetch tournament details
      const { data: tournamentData, error: tournamentError } = await supabase
        .from('tournaments')
        .select('*')
        .eq('id', tournamentId)
        .single()
      
      if (tournamentError) throw tournamentError
      setTournament(tournamentData)
      
      // Fetch current tournament teams
      const { data: teamsData, error: teamsError } = await supabase
        .from('tournament_teams')
        .select(`
          *,
          team:teams(*)
        `)
        .eq('tournament_id', tournamentId)
        .order('seed')
      
      if (teamsError) throw teamsError
      setTournamentTeams(teamsData || [])
      
      // Fetch all available teams
      const { data: allTeamsData, error: allTeamsError } = await supabase
        .from('teams')
        .select('*')
        .order('team_name')
      
      if (allTeamsError) throw allTeamsError
      setAvailableTeams(allTeamsData || [])
      
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch data')
    } finally {
      setLoading(false)
    }
  }

  function startEditing() {
    const editingData = tournamentTeams.map(tt => ({
      id: tt.id,
      tournament_id: tt.tournament_id,
      team_id: tt.team_id,
      seed: tt.seed,
      final_position: tt.final_position,
      prize_money: tt.prize_money
    }))
    setEditingTeams(editingData)
    setIsEditing(true)
  }

  function cancelEditing() {
    setEditingTeams([])
    setIsEditing(false)
    setError(null)
    setSuccessMessage(null)
  }

  function addTeam() {
    const newTeam: EditableTournamentTeam = {
      tournament_id: tournamentId,
      team_id: 0,
      seed: null,
      final_position: null,
      prize_money: null,
      isNew: true
    }
    setEditingTeams([...editingTeams, newTeam])
  }

  function removeTeam(index: number) {
    const updatedTeams = editingTeams.filter((_, i) => i !== index)
    setEditingTeams(updatedTeams)
  }

  function updateTeam(index: number, field: keyof EditableTournamentTeam, value: any) {
    const updatedTeams = [...editingTeams]
    updatedTeams[index] = { ...updatedTeams[index], [field]: value }
    setEditingTeams(updatedTeams)
  }

  function moveTeam(index: number, direction: 'up' | 'down') {
    if (direction === 'up' && index === 0) return
    if (direction === 'down' && index === editingTeams.length - 1) return
    
    const updatedTeams = [...editingTeams]
    const targetIndex = direction === 'up' ? index - 1 : index + 1
    
    // Swap teams
    const temp = updatedTeams[index]
    updatedTeams[index] = updatedTeams[targetIndex]
    updatedTeams[targetIndex] = temp
    
    // Update seeds to maintain order
    updatedTeams.forEach((team, i) => {
      team.seed = i + 1
    })
    
    setEditingTeams(updatedTeams)
  }

  async function saveChanges() {
    try {
      setLoading(true)
      setError(null)
      
      // Get teams to remove (existing teams not in editing list)
      const existingTeamIds = tournamentTeams.map(tt => tt.id)
      const editingTeamIds = editingTeams.filter(tt => tt.id).map(tt => tt.id!)
      const teamsToRemove = existingTeamIds.filter(id => !editingTeamIds.includes(id))
      
      // Remove teams
      if (teamsToRemove.length > 0) {
        const { error: removeError } = await supabase
          .from('tournament_teams')
          .delete()
          .in('id', teamsToRemove)
        
        if (removeError) throw removeError
      }
      
      // Update existing teams
      const teamsToUpdate = editingTeams.filter(tt => tt.id && !tt.isNew)
      for (const team of teamsToUpdate) {
        const { error: updateError } = await supabase
          .from('tournament_teams')
          .update({
            seed: team.seed,
            final_position: team.final_position,
            prize_money: team.prize_money
          })
          .eq('id', team.id)
        
        if (updateError) throw updateError
      }
      
      // Insert new teams
      const teamsToInsert = editingTeams.filter(tt => tt.isNew)
      if (teamsToInsert.length > 0) {
        const { error: insertError } = await supabase
          .from('tournament_teams')
          .insert(teamsToInsert.map(tt => ({
            tournament_id: tt.tournament_id,
            team_id: tt.team_id,
            seed: tt.seed,
            final_position: tt.final_position,
            prize_money: tt.prize_money
          })))
        
        if (insertError) throw insertError
      }
      
      setSuccessMessage('Tournament teams updated successfully!')
      setIsEditing(false)
      setEditingTeams([])
      
      // Refresh data
      await fetchData()
      
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save changes')
    } finally {
      setLoading(false)
    }
  }

  function getAvailableTeamsForSelection() {
    const selectedTeamIds = editingTeams.map(tt => tt.team_id).filter(id => id !== 0)
    return availableTeams.filter(team => !selectedTeamIds.includes(team.id))
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
        <span className="ml-2 text-gray-600">Loading...</span>
      </div>
    )
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <div className="flex">
          <div className="text-red-400">
            <X className="h-5 w-5" />
          </div>
          <div className="ml-3">
            <h3 className="text-sm font-medium text-red-800">Error</h3>
            <div className="mt-2 text-sm text-red-700">{error}</div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
      {/* Header */}
      <div className="px-6 py-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-blue-600 rounded-lg flex items-center justify-center">
              <Users className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Tournament Teams</h3>
              <p className="text-sm text-gray-500">
                {tournament?.name} • {tournamentTeams.length} teams
              </p>
            </div>
          </div>
          
          <div className="flex items-center space-x-3">
            {!isEditing ? (
              <button
                onClick={startEditing}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
              >
                <Edit className="w-4 h-4 mr-2" />
                Manage Teams
              </button>
            ) : (
              <>
                <button
                  onClick={cancelEditing}
                  className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
                >
                  <X className="w-4 h-4 mr-2" />
                  Cancel
                </button>
                <button
                  onClick={saveChanges}
                  disabled={loading}
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50"
                >
                  <Save className="w-4 h-4 mr-2" />
                  Save Changes
                </button>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Success Message */}
      {successMessage && (
        <div className="mx-6 mt-4 bg-green-50 border border-green-200 rounded-lg p-4">
          <div className="flex">
            <div className="text-green-400">
              <Trophy className="h-5 w-5" />
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-green-800">{successMessage}</p>
            </div>
          </div>
        </div>
      )}

      {/* Content */}
      <div className="p-6">
        {!isEditing ? (
          /* View Mode */
          <div className="space-y-4">
            {tournamentTeams.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <Users className="w-12 h-12 mx-auto text-gray-300 mb-4" />
                <p>No teams have been added to this tournament yet.</p>
                <p className="text-sm">Click "Manage Teams" to add participating teams.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Seed</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Team</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Region</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Final Position</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Prize Money</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {tournamentTeams.map((tournamentTeam) => (
                      <tr key={tournamentTeam.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {tournamentTeam.seed || '-'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center mr-3">
                              {tournamentTeam.team.logo ? (
                                <img 
                                  src={tournamentTeam.team.logo} 
                                  alt={tournamentTeam.team.team_name}
                                  className="w-6 h-6 rounded-full object-cover"
                                  onError={(e) => {
                                    const target = e.target as HTMLImageElement
                                    target.style.display = 'none'
                                    const fallback = target.nextElementSibling as HTMLElement
                                    if (fallback) fallback.style.display = 'flex'
                                  }}
                                />
                              ) : null}
                              <div 
                                className="w-6 h-6 rounded-full bg-gray-300 flex items-center justify-center text-xs font-medium text-gray-600"
                                style={{ display: tournamentTeam.team.logo ? 'none' : 'flex' }}
                              >
                                {tournamentTeam.team.team_code}
                              </div>
                            </div>
                            <div>
                              <div className="text-sm font-medium text-gray-900">{tournamentTeam.team.team_name}</div>
                              <div className="text-sm text-gray-500">{tournamentTeam.team.team_code}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {tournamentTeam.team.region}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {tournamentTeam.final_position || '-'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {tournamentTeam.prize_money ? `$${tournamentTeam.prize_money.toLocaleString()}` : '-'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        ) : (
          /* Edit Mode */
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="text-md font-medium text-gray-900">Participating Teams</h4>
              <button
                onClick={addTeam}
                className="inline-flex items-center px-3 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Team
              </button>
            </div>

            {editingTeams.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <Users className="w-12 h-12 mx-auto text-gray-300 mb-4" />
                <p>No teams added yet. Click "Add Team" to start.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {editingTeams.map((team, index) => (
                  <div key={index} className="flex items-center space-x-3 p-4 border border-gray-200 rounded-lg bg-gray-50">
                    {/* Move Controls */}
                    <div className="flex flex-col space-y-1">
                      <button
                        onClick={() => moveTeam(index, 'up')}
                        disabled={index === 0}
                        className="p-1 text-gray-400 hover:text-gray-600 disabled:opacity-30"
                      >
                        <ArrowUp className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => moveTeam(index, 'down')}
                        disabled={index === editingTeams.length - 1}
                        className="p-1 text-gray-400 hover:text-gray-600 disabled:opacity-30"
                      >
                        <ArrowDown className="w-4 h-4" />
                      </button>
                    </div>

                    {/* Team Selection */}
                    <div className="flex-1">
                      <select
                        value={team.team_id}
                        onChange={(e) => updateTeam(index, 'team_id', parseInt(e.target.value))}
                        className="block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500 sm:text-sm"
                      >
                        <option value={0}>Select a team...</option>
                        {getAvailableTeamsForSelection().map((availableTeam) => (
                          <option key={availableTeam.id} value={availableTeam.id}>
                            {availableTeam.team_name} ({availableTeam.team_code})
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Seed */}
                    <div className="w-20">
                      <input
                        type="number"
                        value={team.seed || ''}
                        onChange={(e) => updateTeam(index, 'seed', e.target.value ? parseInt(e.target.value) : null)}
                        placeholder="Seed"
                        className="block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500 sm:text-sm"
                      />
                    </div>

                    {/* Final Position */}
                    <div className="w-24">
                      <input
                        type="number"
                        value={team.final_position || ''}
                        onChange={(e) => updateTeam(index, 'final_position', e.target.value ? parseInt(e.target.value) : null)}
                        placeholder="Position"
                        className="block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500 sm:text-sm"
                      />
                    </div>

                    {/* Prize Money */}
                    <div className="w-32">
                      <input
                        type="number"
                        value={team.prize_money || ''}
                        onChange={(e) => updateTeam(index, 'prize_money', e.target.value ? parseFloat(e.target.value) : null)}
                        placeholder="Prize $"
                        className="block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500 sm:text-sm"
                      />
                    </div>

                    {/* Remove Button */}
                    <button
                      onClick={() => removeTeam(index)}
                      className="p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-md"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}

            {/* Help Text */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex">
                <div className="text-blue-400">
                  <Trophy className="h-5 w-5" />
                </div>
                <div className="ml-3">
                  <h4 className="text-sm font-medium text-blue-800">Team Management Tips</h4>
                  <ul className="mt-2 text-sm text-blue-700 space-y-1">
                    <li>• Use the arrow buttons to reorder teams and automatically update seeds</li>
                    <li>• Seeds determine the bracket placement for elimination tournaments</li>
                    <li>• Final positions and prize money can be updated after the tournament</li>
                    <li>• Changes are immediately reflected in the user view</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
