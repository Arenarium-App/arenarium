'use client'

import { useState, useEffect } from 'react'
import { createClientComponentClient } from '@/lib/supabase'
import type { Database } from '@/types/database'
import ImageUpload from './ImageUpload'
import { STORAGE_BUCKETS } from '@/lib/supabase-storage'
import { CheckCircle, AlertCircle, Loader2, Edit2, Trash2, Save, X } from 'lucide-react'

type Team = Database['public']['Tables']['teams']['Row']

interface EditableTeam {
  id: string
  team_name: string
  team_code: string
  region: string | null
  founded_year: number | null
  coach_name: string | null
  manager_name: string | null
}

interface TeamLogoManagerProps {
  onLogoUpdated?: (teamId: string, newLogoUrl: string) => void
  onTeamUpdated?: (teamId: string, updatedTeam: EditableTeam) => void
  onTeamDeleted?: (teamId: string) => void
}

export default function TeamLogoManager({ onLogoUpdated, onTeamUpdated, onTeamDeleted }: TeamLogoManagerProps) {
  const [teams, setTeams] = useState<Team[]>([])
  const [loading, setLoading] = useState(true)
  const [updatingTeam, setUpdatingTeam] = useState<string | null>(null)
  const [editingTeam, setEditingTeam] = useState<string | null>(null)
  const [editingData, setEditingData] = useState<EditableTeam | null>(null)
  const [showAddForm, setShowAddForm] = useState(false)
  const [newTeam, setNewTeam] = useState<Partial<EditableTeam>>({
    team_name: '',
    team_code: '',
    region: null,
    founded_year: null,
    coach_name: null,
    manager_name: null
  })
  const [updateStatus, setUpdateStatus] = useState<{
    teamId: string
    success: boolean
    message: string
  } | null>(null)
  const supabase = createClientComponentClient()

  useEffect(() => {
    fetchTeams()
  }, [])

  async function fetchTeams() {
    try {
      const { data, error } = await supabase
        .from('teams')
        .select('*')
        .order('team_name')

      if (error) throw error
      setTeams(data || [])
    } catch (err) {
      console.error('Error fetching teams:', err)
    } finally {
      setLoading(false)
    }
  }

  // Edit team functions
  function startEdit(team: Team) {
    setEditingTeam(team.id)
    setEditingData({
      id: team.id,
      team_name: team.team_name,
      team_code: team.team_code,
      region: team.region,
      founded_year: team.founded_year,
      coach_name: team.coach_name,
      manager_name: team.manager_name
    })
  }

  function cancelEdit() {
    setEditingTeam(null)
    setEditingData(null)
  }

  function updateEditingData(field: keyof EditableTeam, value: string | number | null) {
    if (editingData) {
      setEditingData({
        ...editingData,
        [field]: value
      })
    }
  }

  async function saveEdit() {
    if (!editingData || !editingTeam) return

    setUpdatingTeam(editingTeam)
    setUpdateStatus(null)

    try {
      const { error } = await supabase
        .from('teams')
        .update({
          team_name: editingData.team_name,
          team_code: editingData.team_code,
          region: editingData.region,
          founded_year: editingData.founded_year,
          coach_name: editingData.coach_name,
          manager_name: editingData.manager_name
        })
        .eq('id', editingTeam)

      if (error) throw error

      // Update local state
      setTeams(teams.map(team => 
        team.id === editingTeam 
          ? { ...team, ...editingData }
          : team
      ))

      setUpdateStatus({
        teamId: editingTeam,
        success: true,
        message: 'Team updated successfully!'
      })

      onTeamUpdated?.(editingTeam, editingData)
      cancelEdit()
    } catch (error) {
      console.error('Error updating team:', error)
      setUpdateStatus({
        teamId: editingTeam,
        success: false,
        message: 'Failed to update team'
      })
    } finally {
      setUpdatingTeam(null)
    }
  }

  // Add new team function
  async function addTeam() {
    if (!newTeam.team_name || !newTeam.team_code) {
      setUpdateStatus({
        teamId: 'new',
        success: false,
        message: 'Team name and code are required'
      })
      return
    }

    setUpdatingTeam('new')
    setUpdateStatus(null)

    try {
      const { data, error } = await supabase
        .from('teams')
        .insert({
          team_name: newTeam.team_name,
          team_code: newTeam.team_code,
          region: newTeam.region,
          founded_year: newTeam.founded_year,
          coach_name: newTeam.coach_name,
          manager_name: newTeam.manager_name
        })
        .select()
        .single()

      if (error) throw error

      // Add to local state
      setTeams([...teams, data])

      setUpdateStatus({
        teamId: 'new',
        success: true,
        message: 'Team added successfully!'
      })

      // Reset form
      setNewTeam({
        team_name: '',
        team_code: '',
        region: null,
        founded_year: null,
        coach_name: null,
        manager_name: null
      })
      setShowAddForm(false)
    } catch (error) {
      console.error('Error adding team:', error)
      setUpdateStatus({
        teamId: 'new',
        success: false,
        message: 'Failed to add team'
      })
    } finally {
      setUpdatingTeam(null)
    }
  }

  // Delete team function
  async function deleteTeam(teamId: string) {
    if (!confirm('Are you sure you want to delete this team? This action cannot be undone.')) {
      return
    }

    setUpdatingTeam(teamId)
    setUpdateStatus(null)

    try {
      const { error } = await supabase
        .from('teams')
        .delete()
        .eq('id', teamId)

      if (error) throw error

      // Update local state
      setTeams(teams.filter(team => team.id !== teamId))

      setUpdateStatus({
        teamId: teamId,
        success: true,
        message: 'Team deleted successfully!'
      })

      onTeamDeleted?.(teamId)
    } catch (error) {
      console.error('Error deleting team:', error)
      setUpdateStatus({
        teamId: teamId,
        success: false,
        message: 'Failed to delete team'
      })
    } finally {
      setUpdatingTeam(null)
    }
  }

  async function handleLogoUpdate(teamId: string, imageUrl: string) {
    setUpdatingTeam(teamId)
    setUpdateStatus(null)

    console.log(`🔍 Starting logo update for team ${teamId} with URL: ${imageUrl}`)
    console.log(`🔍 Current team data:`, teams.find(t => t.id === teamId))

    try {
      // First, let's verify the current state
      const { data: beforeData, error: beforeError } = await supabase
        .from('teams')
        .select('*')
        .eq('id', teamId)
        .single()

      if (beforeError) {
        console.error('❌ Error fetching team before update:', beforeError)
      } else {
        console.log(`🔍 Team ${teamId} before update:`, beforeData)
      }

      // Now perform the update
      const { data: updateData, error } = await supabase
        .from('teams')
        .update({ logo: imageUrl })
        .eq('id', teamId)
        .select()

      if (error) {
        console.error('❌ Database update error:', error)
        throw error
      }

      console.log(`✅ Database update successful for team ${teamId}`)
      console.log(`✅ Update result:`, updateData)

      // Verify the update by fetching the team again
      const { data: verifyData, error: verifyError } = await supabase
        .from('teams')
        .select('logo')
        .eq('id', teamId)
        .single()

      if (verifyError) {
        console.error('❌ Verification failed:', verifyError)
      } else {
        console.log(`🔍 Verification - Team ${teamId} logo in DB:`, verifyData?.logo)
      }

      // Update local state
      setTeams(prev => prev.map(team => 
        team.id === teamId ? { ...team, logo: imageUrl } : team
      ))

      console.log(`🔄 Local state updated for team ${teamId}`)

      setUpdateStatus({
        teamId,
        success: true,
        message: 'Logo updated successfully!'
      })

      // Call callback if provided
      if (onLogoUpdated) {
        console.log(`📞 Calling onLogoUpdated callback for team ${teamId}`)
        onLogoUpdated(teamId, imageUrl)
      }

      // Dispatch custom event to notify other components
      window.dispatchEvent(new CustomEvent('logoUpdated', { 
        detail: { teamId, newLogoUrl: imageUrl } 
      }))
      console.log(`📢 Dispatched logoUpdated event for team ${teamId}`)

      // Clear success message after 3 seconds
      setTimeout(() => setUpdateStatus(null), 3000)

    } catch (err) {
      console.error('❌ Error updating team logo:', err)
      setUpdateStatus({
        teamId,
        success: false,
        message: 'Failed to update logo. Please try again.'
      })
    } finally {
      setUpdatingTeam(null)
    }
  }

  async function refreshTeams() {
    console.log('🔄 Manually refreshing teams...')
    await fetchTeams()
  }

  async function testDatabaseConnection() {
    console.log('🧪 Testing database connection...')
    try {
      // Test a simple select
      const { data, error } = await supabase
        .from('teams')
        .select('id, team_name, logo')
        .limit(1)

      if (error) {
        console.error('❌ Database connection test failed:', error)
        alert('Database connection test failed: ' + error.message)
      } else {
        console.log('✅ Database connection test successful:', data)
        alert('Database connection test successful! Found ' + (data?.length || 0) + ' teams')
      }
    } catch (err) {
      console.error('❌ Database connection test error:', err)
      alert('Database connection test error: ' + err)
    }
  }

  async function debugTeamInDatabase(teamId: number) {
    console.log(`🔍 Debugging team ${teamId} in database...`)
    try {
      const { data, error } = await supabase
        .from('teams')
        .select('*')
        .eq('id', teamId)
        .single()

      if (error) {
        console.error('❌ Error fetching team for debug:', error)
        alert('Error fetching team for debug: ' + error.message)
      } else {
        console.log('✅ Team data for debug:', data)
        alert('Team data for debug: ' + JSON.stringify(data, null, 2))
      }
    } catch (err) {
      console.error('❌ Error in debugTeamInDatabase:', err)
      alert('Error in debugTeamInDatabase: ' + err)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-8 h-8 animate-spin text-purple-600" />
        <span className="ml-2 text-gray-600">Loading teams...</span>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-blue-800 font-medium">📋 Team Management</h3>
          <div className="flex space-x-2">
            <button
              onClick={() => setShowAddForm(!showAddForm)}
              className="px-3 py-1 bg-purple-600 text-white text-sm rounded-md hover:bg-purple-700 transition-colors"
            >
              {showAddForm ? '❌ Cancel' : '➕ Add Team'}
            </button>
            <button
              onClick={testDatabaseConnection}
              className="px-3 py-1 bg-green-600 text-white text-sm rounded-md hover:bg-green-700 transition-colors"
            >
              🧪 Test DB
            </button>
            <button
              onClick={refreshTeams}
              className="px-3 py-1 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700 transition-colors"
            >
              🔄 Refresh
            </button>
          </div>
        </div>
        <ul className="text-blue-700 text-sm space-y-1">
          <li>• Add new teams using the "Add Team" button</li>
          <li>• Edit team details by clicking the edit button</li>
          <li>• Upload team logos (PNG, JPG, WebP recommended)</li>
          <li>• Delete teams using the delete button (with confirmation)</li>
        </ul>
      </div>

      {/* Add New Team Form */}
      {showAddForm && (
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Add New Team</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Team Name *</label>
              <input
                type="text"
                value={newTeam.team_name || ''}
                onChange={(e) => setNewTeam({...newTeam, team_name: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                placeholder="e.g., EVOS Legends"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Team Code *</label>
              <input
                type="text"
                value={newTeam.team_code || ''}
                onChange={(e) => setNewTeam({...newTeam, team_code: e.target.value.toUpperCase()})}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                placeholder="e.g., EVOS"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Region</label>
              <input
                type="text"
                value={newTeam.region || ''}
                onChange={(e) => setNewTeam({...newTeam, region: e.target.value || null})}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                placeholder="e.g., Indonesia"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Founded Year</label>
              <input
                type="number"
                value={newTeam.founded_year || ''}
                onChange={(e) => setNewTeam({...newTeam, founded_year: e.target.value ? parseInt(e.target.value) : null})}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                placeholder="e.g., 2017"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Coach Name</label>
              <input
                type="text"
                value={newTeam.coach_name || ''}
                onChange={(e) => setNewTeam({...newTeam, coach_name: e.target.value || null})}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                placeholder="e.g., Zeys"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Manager Name</label>
              <input
                type="text"
                value={newTeam.manager_name || ''}
                onChange={(e) => setNewTeam({...newTeam, manager_name: e.target.value || null})}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                placeholder="e.g., John Doe"
              />
            </div>
          </div>
          
          {/* Status Messages for Add Form */}
          {updateStatus?.teamId === 'new' && (
            <div className={`mt-4 p-3 rounded-md flex items-center space-x-2 ${
              updateStatus.success 
                ? 'bg-green-50 text-green-800 border border-green-200' 
                : 'bg-red-50 text-red-800 border border-red-200'
            }`}>
              {updateStatus.success ? (
                <CheckCircle className="w-4 h-4" />
              ) : (
                <AlertCircle className="w-4 h-4" />
              )}
              <span className="text-sm font-medium">{updateStatus.message}</span>
            </div>
          )}
          
          <div className="mt-4 flex space-x-3">
            <button
              onClick={addTeam}
              disabled={updatingTeam === 'new'}
              className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 disabled:opacity-50 flex items-center space-x-2"
            >
              {updatingTeam === 'new' ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <CheckCircle className="w-4 h-4" />
              )}
              <span>{updatingTeam === 'new' ? 'Adding...' : 'Add Team'}</span>
            </button>
            <button
              onClick={() => setShowAddForm(false)}
              disabled={updatingTeam === 'new'}
              className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 disabled:opacity-50"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      <div className="grid gap-6">
        {teams.map((team) => (
          <div key={team.id} className="bg-white border border-gray-200 rounded-lg p-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Team Info and Current Logo */}
              <div className="lg:col-span-2">
                <div className="flex items-start space-x-4">
                  {/* Current Logo Display */}
                  <div className="flex-shrink-0">
                    <div className="relative">
                      {team.logo ? (
                        <img
                          src={team.logo}
                          alt={`${team.team_name} logo`}
                          className="w-20 h-20 rounded-lg object-cover border-2 border-gray-200"
                        />
                      ) : (
                        <div className="w-20 h-20 bg-gradient-to-br from-gray-300 to-gray-400 rounded-lg flex items-center justify-center">
                          <span className="text-gray-500 text-xs text-center">No Logo</span>
                        </div>
                      )}
                      <div className="absolute -top-2 -right-2 bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded-full">
                        Current
                      </div>
                    </div>
                  </div>

                  {/* Team Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        {editingTeam === team.id ? (
                          // Edit Mode
                          <div className="space-y-3">
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">Team Name</label>
                              <input
                                type="text"
                                value={editingData?.team_name || ''}
                                onChange={(e) => updateEditingData('team_name', e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">Team Code</label>
                              <input
                                type="text"
                                value={editingData?.team_code || ''}
                                onChange={(e) => updateEditingData('team_code', e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">Region</label>
                              <input
                                type="text"
                                value={editingData?.region || ''}
                                onChange={(e) => updateEditingData('region', e.target.value || null)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                              />
                            </div>
                            <div className="grid grid-cols-2 gap-3">
                              <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Founded Year</label>
                                <input
                                  type="number"
                                  value={editingData?.founded_year || ''}
                                  onChange={(e) => updateEditingData('founded_year', e.target.value ? parseInt(e.target.value) : null)}
                                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                                />
                              </div>
                              <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Coach</label>
                                <input
                                  type="text"
                                  value={editingData?.coach_name || ''}
                                  onChange={(e) => updateEditingData('coach_name', e.target.value || null)}
                                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                                />
                              </div>
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">Manager</label>
                              <input
                                type="text"
                                value={editingData?.manager_name || ''}
                                onChange={(e) => updateEditingData('manager_name', e.target.value || null)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                              />
                            </div>
                          </div>
                        ) : (
                          // View Mode
                          <div>
                            <h3 className="text-lg font-semibold text-gray-900 mb-1">
                              {team.team_name}
                            </h3>
                            <p className="text-sm text-gray-600 mb-2">
                              Code: <span className="font-mono bg-gray-100 px-2 py-1 rounded">{team.team_code}</span>
                            </p>
                            <p className="text-sm text-gray-500 mb-1">
                              Region: {team.region || 'Not specified'}
                            </p>
                            {team.founded_year && (
                              <p className="text-sm text-gray-500 mb-1">
                                Founded: {team.founded_year}
                              </p>
                            )}
                            {team.coach_name && (
                              <p className="text-sm text-gray-500 mb-1">
                                Coach: {team.coach_name}
                              </p>
                            )}
                            {team.manager_name && (
                              <p className="text-sm text-gray-500 mb-1">
                                Manager: {team.manager_name}
                              </p>
                            )}
                          </div>
                        )}
                      </div>
                      
                      {/* Action Buttons */}
                      <div className="flex space-x-2 ml-4">
                        {editingTeam === team.id ? (
                          // Edit Mode Buttons
                          <>
                            <button
                              onClick={saveEdit}
                              disabled={updatingTeam === team.id}
                              className="p-2 bg-green-500 text-white rounded-md hover:bg-green-600 disabled:opacity-50"
                              title="Save changes"
                            >
                              <Save className="w-4 h-4" />
                            </button>
                            <button
                              onClick={cancelEdit}
                              disabled={updatingTeam === team.id}
                              className="p-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 disabled:opacity-50"
                              title="Cancel editing"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          </>
                        ) : (
                          // View Mode Buttons
                          <>
                            <button
                              onClick={() => startEdit(team)}
                              disabled={updatingTeam === team.id}
                              className="p-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:opacity-50"
                              title="Edit team"
                            >
                              <Edit2 className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => deleteTeam(team.id)}
                              disabled={updatingTeam === team.id}
                              className="p-2 bg-red-500 text-white rounded-md hover:bg-red-600 disabled:opacity-50"
                              title="Delete team"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </>
                        )}
                      </div>
                    </div>
                    
                    {/* Status Messages */}
                    {updateStatus?.teamId === team.id && (
                      <div className={`mt-3 p-3 rounded-md flex items-center space-x-2 ${
                        updateStatus.success 
                          ? 'bg-green-50 text-green-800 border border-green-200' 
                          : 'bg-red-50 text-red-800 border border-red-200'
                      }`}>
                        {updateStatus.success ? (
                          <CheckCircle className="w-4 h-4" />
                        ) : (
                          <AlertCircle className="w-4 h-4" />
                        )}
                        <span className="text-sm font-medium">{updateStatus.message}</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Debug Info - Full Width */}
                <div className="mt-4 p-3 bg-gray-50 rounded text-xs text-gray-600">
                  <div className="break-all"><strong>DB Logo:</strong> {team.logo || 'null'}</div>
                  <div className="break-all"><strong>Team ID:</strong> {team.id}</div>
                  <button
                    onClick={() => debugTeamInDatabase(team.id)}
                    className="mt-2 px-3 py-1 bg-yellow-500 text-white text-xs rounded hover:bg-yellow-600"
                  >
                    🔍 Debug DB
                  </button>
                </div>
              </div>

              {/* Logo Upload Section */}
              <div className="lg:col-span-1">
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                  <h4 className="text-sm font-medium text-gray-700 mb-3">Upload New Logo</h4>
                  
                  <ImageUpload
                    bucket={STORAGE_BUCKETS.TEAM_LOGOS}
                    currentImageUrl={team.logo || undefined}
                    onSave={(imageUrl) => handleLogoUpdate(team.id, imageUrl)}
                    disabled={updatingTeam === team.id}
                    placeholder={`Upload logo for ${team.team_name}`}
                  />
                  
                  {updatingTeam === team.id && (
                    <div className="mt-3 flex items-center justify-center text-sm text-gray-600">
                      <Loader2 className="w-4 h-4 animate-spin mr-2" />
                      Updating logo...
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {teams.length === 0 && (
        <div className="text-center py-12">
          <div className="text-gray-500">No teams found in the database.</div>
        </div>
      )}
    </div>
  )
}
