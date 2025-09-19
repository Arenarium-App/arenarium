'use client'

import { useState, useEffect } from 'react'
import { createClientComponentClient } from '@/lib/supabase'
import { Plus, Edit, Trash2, Save, X, ArrowUp, ArrowDown } from 'lucide-react'
import type { Database } from '@/types/database'

type Tournament = Database['public']['Tables']['tournaments']['Row']
type TournamentFormat = Database['public']['Tables']['tournament_formats']['Row']
type TournamentStage = Database['public']['Tables']['tournament_stages']['Row']

interface StageConfig {
  stage_name: string
  stage_order: number
  format_type: string
  format_config: any
}

export default function TournamentFormatManager() {
  const [tournaments, setTournaments] = useState<Tournament[]>([])
  const [formats, setFormats] = useState<TournamentFormat[]>([])
  const [selectedTournament, setSelectedTournament] = useState<Tournament | null>(null)
  const [stages, setStages] = useState<TournamentStage[]>([])
  const [editingStages, setEditingStages] = useState<StageConfig[]>([])
  const [isEditing, setIsEditing] = useState(false)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  
  const supabase = createClientComponentClient()

  useEffect(() => {
    fetchData()
  }, [])

  async function fetchData() {
    try {
      setLoading(true)
      
      const { data: tournamentsData, error: tournamentsError } = await supabase
        .from('tournaments')
        .select('*')
        .order('name')
      
      if (tournamentsError) throw tournamentsError
      
      const { data: formatsData, error: formatsError } = await supabase
        .from('tournament_formats')
        .select('*')
        .eq('is_active', true)
        .order('name')
      
      if (formatsError) throw formatsError
      
      setTournaments(tournamentsData || [])
      setFormats(formatsData || [])
      
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch data')
    } finally {
      setLoading(false)
    }
  }

  async function fetchTournamentStages(tournamentId: number) {
    try {
      const { data, error } = await supabase
        .from('tournament_stages')
        .select('*')
        .eq('tournament_id', tournamentId)
        .order('stage_order')
      
      if (error) throw error
      
      setStages(data || [])
      
      const editingStagesData = (data || []).map(stage => {
        // Initialize round_names if not present for elimination formats
        let formatConfig = stage.format_config || {}
        if ((stage.format_type === 'Single Elimination' || stage.format_type === 'Double Elimination') && !formatConfig.round_names) {
          const teamsCount = formatConfig.teams_count || 8
          const rounds = Math.ceil(Math.log2(teamsCount))
          formatConfig.round_names = Array.from({ length: rounds }, (_, index) => {
            const roundNumber = index + 1
            if (roundNumber === rounds) return 'Grand Final'
            if (roundNumber === rounds - 1) return 'Semi Final'
            if (roundNumber === rounds - 2) return 'Quarter Final'
            if (roundNumber === rounds - 3) return 'Round of 16'
            return `Round ${roundNumber}`
          })
        }
        
        return {
          stage_name: stage.stage_name,
          stage_order: stage.stage_order,
          format_type: stage.format_type,
          format_config: formatConfig
        }
      })
      
      setEditingStages(editingStagesData)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch stages')
    }
  }

  function handleTournamentSelect(tournament: Tournament) {
    setSelectedTournament(tournament)
    fetchTournamentStages(tournament.id)
    setIsEditing(false)
  }

  function addStage() {
    const newStage: StageConfig = {
      stage_name: `Stage ${editingStages.length + 1}`,
      stage_order: editingStages.length + 1,
      format_type: 'Single Elimination',
      format_config: {
        teams_count: 8,
        matches_per_round: 1,
        round_names: ['Quarter Final', 'Semi Final', 'Grand Final']
      }
    }
    setEditingStages([...editingStages, newStage])
  }

  function removeStage(index: number) {
    const newStages = editingStages.filter((_, i) => i !== index)
    const reorderedStages = newStages.map((stage, i) => ({
      ...stage,
      stage_order: i + 1
    }))
    setEditingStages(reorderedStages)
  }

  function moveStage(index: number, direction: 'up' | 'down') {
    if (
      (direction === 'up' && index === 0) ||
      (direction === 'down' && index === editingStages.length - 1)
    ) {
      return
    }

    const newStages = [...editingStages]
    const targetIndex = direction === 'up' ? index - 1 : index + 1
    
    const temp = newStages[index]
    newStages[index] = newStages[targetIndex]
    newStages[targetIndex] = temp
    
    newStages.forEach((stage, i) => {
      stage.stage_order = i + 1
    })
    
    setEditingStages(newStages)
  }

  function updateStage(index: number, field: keyof StageConfig, value: any) {
    const newStages = [...editingStages]
    newStages[index] = { ...newStages[index], [field]: value }
    
    // If format type changed to elimination format, initialize round names
    if (field === 'format_type' && (value === 'Single Elimination' || value === 'Double Elimination')) {
      const teamsCount = newStages[index].format_config?.teams_count || 8
      const rounds = Math.ceil(Math.log2(teamsCount))
      const roundNames = Array.from({ length: rounds }, (_, roundIndex) => {
        const roundNumber = roundIndex + 1
        if (roundNumber === rounds) return 'Grand Final'
        if (roundNumber === rounds - 1) return 'Semi Final'
        if (roundNumber === rounds - 2) return 'Quarter Final'
        if (roundNumber === rounds - 3) return 'Round of 16'
        return `Round ${roundNumber}`
      })
      
      newStages[index].format_config = {
        ...newStages[index].format_config,
        round_names: roundNames
      }
    }
    
    setEditingStages(newStages)
  }

  function updateStageConfig(index: number, field: string, value: any) {
    const newStages = [...editingStages]
    newStages[index].format_config = {
      ...newStages[index].format_config,
      [field]: value
    }
    
    // If teams_count changed for elimination format, update round names
    if (field === 'teams_count' && 
        (newStages[index].format_type === 'Single Elimination' || newStages[index].format_type === 'Double Elimination')) {
      const rounds = Math.ceil(Math.log2(value))
      const roundNames = Array.from({ length: rounds }, (_, roundIndex) => {
        const roundNumber = roundIndex + 1
        if (roundNumber === rounds) return 'Grand Final'
        if (roundNumber === rounds - 1) return 'Semi Final'
        if (roundNumber === rounds - 2) return 'Quarter Final'
        if (roundNumber === rounds - 3) return 'Round of 16'
        return `Round ${roundNumber}`
      })
      
      newStages[index].format_config.round_names = roundNames
    }
    
    setEditingStages(newStages)
  }

  async function saveFormat() {
    if (!selectedTournament || editingStages.length === 0) return
    
    try {
      setLoading(true)
      
      const formatConfig = {
        total_stages: editingStages.length,
        teams_count: editingStages[0]?.format_config?.teams_count || 0,
        created_at: new Date().toISOString()
      }
      
      const stagesData = editingStages.map(stage => ({
        stage_name: stage.stage_name,
        stage_order: stage.stage_order,
        format_type: stage.format_type,
        format_config: stage.format_config
      }))
      
      const { error } = await supabase.rpc('update_tournament_format', {
        p_tournament_id: selectedTournament.id,
        p_format_config: formatConfig,
        p_stages: stagesData
      })
      
      if (error) throw error
      
      await fetchTournamentStages(selectedTournament.id)
      setIsEditing(false)
      alert('Tournament format updated successfully!')
      
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save format')
    } finally {
      setLoading(false)
    }
  }

  function cancelEdit() {
    setEditingStages(stages.map(stage => ({
      stage_name: stage.stage_name,
      stage_order: stage.stage_order,
      format_type: stage.format_type,
      format_config: stage.format_config || {}
    })))
    setIsEditing(false)
  }

  function getDefaultRoundName(roundNumber: number, totalRounds: number): string {
    if (roundNumber === totalRounds) return 'Grand Final'
    if (roundNumber === totalRounds - 1) return 'Semi Final'
    if (roundNumber === totalRounds - 2) return 'Quarter Final'
    if (roundNumber === totalRounds - 3) return 'Round of 16'
    return `Round ${roundNumber}`
  }

  async function setupMPLIDFormat() {
    if (!selectedTournament) {
      alert('Please select a tournament first')
      return
    }
    
    const newStages: StageConfig[] = [
      {
        stage_name: 'Regular Season',
        stage_order: 1,
        format_type: 'Round Robin 2 Legs',
        format_config: {
          teams_count: 9,
          matches_per_round: 1,
          home_away_rules: 'designated',
          points_system: '3_1_0',
          tiebreaker_rules: 'head_to_head',
          balance_home_away: true,
          head_to_head_tiebreak: true
        }
      },
      {
        stage_name: 'Playoffs',
        stage_order: 2,
        format_type: 'Double Elimination',
        format_config: {
          teams_count: 6,
          matches_per_round: 1,
          seeding_rules: 'by_standings',
          bye_rules: 'top_seeds',
          top_seeds_bye_rounds: 1,
          round_names: ['Upper Quarter Final', 'Lower Quarter Final', 'Upper Semi Final', 'Lower Semi Final', 'Upper Final', 'Lower Final', 'Grand Final']
        }
      }
    ]
    
    setEditingStages(newStages)
    setIsEditing(true)
  }

  async function setupChampionsLeagueFormat() {
    if (!selectedTournament) {
      alert('Please select a tournament first')
      return
    }
    
    const newStages: StageConfig[] = [
      {
        stage_name: 'Group Stage',
        stage_order: 1,
        format_type: 'Group Stage + Playoffs',
        format_config: {
          teams_count: 8,
          group_size: 4,
          groups_count: 2,
          advancement_rules: 'top_2',
          playoff_format: 'single_elimination',
          seeding_source: 'group_standings'
        }
      }
    ]
    
    setEditingStages(newStages)
    setIsEditing(true)
  }

  async function setupWorldCupFormat() {
    if (!selectedTournament) {
      alert('Please select a tournament first')
      return
    }
    
    const newStages: StageConfig[] = [
      {
        stage_name: 'Group Stage',
        stage_order: 1,
        format_type: 'Group Stage + Playoffs',
        format_config: {
          teams_count: 8,
          group_size: 4,
          groups_count: 2,
          advancement_rules: 'top_2',
          playoff_format: 'single_elimination',
          seeding_source: 'group_standings'
        }
      }
    ]
    
    setEditingStages(newStages)
    setIsEditing(true)
  }

  function getFormatConfigFields(formatType: string) {
    switch (formatType) {
      case 'Single Elimination':
      case 'Double Elimination':
        return [
          { key: 'teams_count', label: 'Number of Teams', type: 'number', min: 2, max: 64 },
          { key: 'matches_per_round', label: 'Matches per Round', type: 'number', min: 1, max: 10 },
          { key: 'seeding_rules', label: 'Seeding Rules', type: 'select', options: ['random', 'by_standings', 'by_rank', 'custom'] },
          { key: 'bye_rules', label: 'Bye Rules', type: 'select', options: ['none', 'top_seeds', 'power_of_2', 'custom'] },
          { key: 'top_seeds_bye_rounds', label: 'Top Seeds Bye Rounds', type: 'number', min: 0, max: 3, condition: 'bye_rules === "top_seeds" || bye_rules === "custom"' }
        ]
      
      case 'Round Robin':
      case 'Round Robin 2 Legs':
        return [
          { key: 'teams_count', label: 'Number of Teams', type: 'number', min: 2, max: 32 },
          { key: 'matches_per_round', label: 'Matches per Round', type: 'number', min: 1, max: 5 },
          { key: 'home_away_rules', label: 'Side Selection Rules', type: 'select', options: ['none', 'alternating', 'designated', 'random'] },
          { key: 'points_system', label: 'Points System', type: 'select', options: ['win_loss', '3_1_0', '2_1_0', 'custom'] },
          { key: 'tiebreaker_rules', label: 'Tiebreaker Rules', type: 'select', options: ['head_to_head', 'kills_difference', 'objectives_difference', 'total_score', 'random'] }
        ]
      
      case 'Swiss System':
        return [
          { key: 'teams_count', label: 'Number of Teams', type: 'number', min: 4, max: 128 },
          { key: 'rounds', label: 'Number of Rounds', type: 'number', min: 3, max: 10 },
          { key: 'pairing_system', label: 'Pairing System', type: 'select', options: ['standard', 'accelerated', 'modified'] }
        ]
      
      case 'Group Stage + Playoffs':
        return [
          { key: 'teams_count', label: 'Total Teams', type: 'number', min: 8, max: 64 },
          { key: 'group_size', label: 'Teams per Group', type: 'number', min: 4, max: 8 },
          { key: 'groups_count', label: 'Number of Groups', type: 'number', min: 2, max: 8 },
          { key: 'advancement_rules', label: 'Advancement Rules', type: 'select', options: ['top_2', 'top_3', 'top_4', 'custom'] },
          { key: 'playoff_format', label: 'Playoff Format', type: 'select', options: ['single_elimination', 'double_elimination', 'round_robin'] },
          { key: 'seeding_source', label: 'Seeding Source', type: 'select', options: ['group_standings', 'overall_record', 'head_to_head'] }
        ]
      
      case 'Leaderboard':
        return [
          { key: 'teams_count', label: 'Number of Teams', type: 'number', min: 2, max: 100 },
          { key: 'points_system', label: 'Points System', type: 'select', options: ['win_loss', 'points_based'] }
        ]
      
      case 'Multi-Stage Tournament':
        return [
          { key: 'stages_count', label: 'Number of Stages', type: 'number', min: 2, max: 5 },
          { key: 'qualification_rules', label: 'Qualification Rules', type: 'select', options: ['top_n', 'percentage', 'points_threshold', 'custom'] },
          { key: 'qualification_count', label: 'Teams to Advance', type: 'number', min: 2, max: 16, condition: 'qualification_rules === "top_n"' },
          { key: 'qualification_percentage', label: 'Advancement %', type: 'number', min: 10, max: 100, condition: 'qualification_rules === "percentage"' },
          { key: 'seeding_transfer', label: 'Seeding Transfer', type: 'select', options: ['none', 'standings_order', 'points_based', 'head_to_head'] }
        ]
      
      case 'Complex Tournament':
        return [
          { key: 'total_teams', label: 'Total Teams', type: 'number', min: 4, max: 32 },
          { key: 'stage1_format', label: 'Stage 1 Format', type: 'select', options: ['round_robin', 'round_robin_2_legs', 'swiss', 'groups'] },
          { key: 'stage1_teams', label: 'Stage 1 Teams', type: 'number', min: 4, max: 32 },
          { key: 'stage1_advance', label: 'Teams to Advance', type: 'number', min: 2, max: 16 },
          { key: 'stage2_format', label: 'Stage 2 Format', type: 'select', options: ['single_elimination', 'double_elimination', 'round_robin'] },
          { key: 'stage2_teams', label: 'Stage 2 Teams', type: 'number', min: 2, max: 16 },
          { key: 'seeding_rules', label: 'Seeding Rules', type: 'select', options: ['by_standings', 'by_points', 'by_head_to_head', 'random'] },
          { key: 'bye_rules', label: 'Bye Rules', type: 'select', options: ['none', 'top_2_semifinal', 'top_4_quarterfinal', 'custom'] }
        ]
      
      default:
        return [
          { key: 'teams_count', label: 'Number of Teams', type: 'number', min: 2, max: 64 }
        ]
    }
  }

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/3 mb-4"></div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="h-64 bg-gray-200 rounded"></div>
            <div className="lg:col-span-2 h-64 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="text-center py-12">
          <div className="text-red-500 mb-4">Error: {error}</div>
          <button
            onClick={fetchData}
            className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700"
          >
            Retry
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Tournament Format Manager</h1>
        <p className="text-gray-600">Configure tournament formats and stages for each tournament</p>
      </div>

      {/* Quick Setup Wizards */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Quick Setup Wizards</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {/* MPL ID Style Wizard */}
          <div className="bg-gradient-to-br from-blue-50 to-indigo-100 border border-blue-200 rounded-lg p-4">
            <h3 className="text-lg font-semibold text-blue-900 mb-2">MPL ID Style</h3>
            <p className="text-sm text-blue-700 mb-3">
              9 teams, Round Robin 2 Legs → Top 6 advance to Double Elimination
            </p>
            <button
              onClick={() => setupMPLIDFormat()}
              className="w-full px-3 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-sm font-medium"
            >
              Setup MPL ID Format
            </button>
          </div>

          {/* Champions League Style Wizard */}
          <div className="bg-gradient-to-br from-green-50 to-emerald-100 border border-green-200 rounded-lg p-4">
            <h3 className="text-lg font-semibold text-green-900 mb-2">Champions League Style</h3>
            <p className="text-sm text-green-700 mb-3">
              Groups → Top 2 advance → Single Elimination Playoffs
            </p>
            <button
              onClick={() => setupChampionsLeagueFormat()}
              className="w-full px-3 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 text-sm font-medium"
            >
              Setup Champions League Format
            </button>
          </div>

          {/* World Cup Style Wizard */}
          <div className="bg-gradient-to-br from-yellow-50 to-amber-100 border border-yellow-200 rounded-lg p-4">
            <h3 className="text-lg font-semibold text-yellow-900 mb-2">World Cup Style</h3>
            <p className="text-sm text-yellow-700 mb-3">
              Groups → Top 2 advance → Single Elimination Knockout
            </p>
            <button
              onClick={() => setupWorldCupFormat()}
              className="w-full px-3 py-2 bg-yellow-600 text-white rounded-md hover:bg-yellow-700 text-sm font-medium"
            >
              Setup World Cup Format
            </button>
          </div>
        </div>
      </div>

      {/* Help Section */}
      <div className="mb-8">
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">How to Configure Complex Tournaments</h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-medium text-gray-800 mb-3">For MPL ID Style Tournaments:</h3>
              <ol className="list-decimal list-inside space-y-2 text-sm text-gray-700">
                <li><strong>Select your tournament</strong> from the left panel</li>
                <li><strong>Click "Setup MPL ID Format"</strong> above for instant configuration</li>
                <li><strong>Customize Stage 1:</strong> Round Robin 2 Legs with 9 teams</li>
                <li><strong>Configure Stage 2:</strong> Double Elimination playoffs for top 6</li>
                <li><strong>Set qualification rules:</strong> Top 6 teams advance automatically</li>
                <li><strong>Configure seeding:</strong> Top 2 teams get byes to semifinals</li>
              </ol>
            </div>
            <div>
              <h3 className="text-lg font-medium text-gray-800 mb-3">Advanced Configuration Options:</h3>
              <ul className="space-y-2 text-sm text-gray-700">
                <li><strong>Side Selection Rules:</strong> Designate side selection for Round Robin</li>
                <li><strong>Points System:</strong> 3 points for win, 1 for draw, 0 for loss</li>
                <li><strong>Tiebreakers:</strong> Head-to-head results, kills difference</li>
                <li><strong>Bye Rules:</strong> Top seeds automatically advance to later rounds</li>
                <li><strong>Custom Round Names:</strong> "Upper Semi", "Lower Final", "Grand Final"</li>
                <li><strong>Seeding Transfer:</strong> Carry standings from group stage to playoffs</li>
              </ul>
            </div>
          </div>
          <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <h4 className="text-sm font-semibold text-blue-800 mb-2">💡 Pro Tips:</h4>
            <ul className="text-sm text-blue-700 space-y-1">
              <li>• Use the <strong>Complex Tournament</strong> format type for multi-stage tournaments</li>
              <li>• Enable <strong>Auto-advance</strong> to automatically qualify teams based on standings</li>
              <li>• Set <strong>Seeding Protection</strong> to keep top teams apart in early playoff rounds</li>
              <li>• Configure <strong>Bye Rules</strong> to give top seeds advantages in elimination brackets</li>
            </ul>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Tournament Selection */}
        <div className="space-y-6">
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Select Tournament</h2>
            <div className="space-y-2">
              {tournaments.map((tournament) => (
                <button
                  key={tournament.id}
                  onClick={() => handleTournamentSelect(tournament)}
                  className={`w-full text-left p-3 rounded-lg border transition-colors ${
                    selectedTournament?.id === tournament.id
                      ? 'border-purple-500 bg-purple-50 text-purple-700'
                      : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  <div className="font-medium">{tournament.name}</div>
                  <div className="text-sm text-gray-500">
                    {tournament.status} • {tournament.tournament_type.replace('_', ' ')}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Available Formats */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Available Formats</h2>
            <div className="space-y-2">
              {formats.map((format) => (
                <div key={format.id} className="p-3 bg-gray-50 rounded-lg">
                  <div className="font-medium text-gray-900">{format.name}</div>
                  <div className="text-sm text-gray-600">{format.description}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column - Format Configuration */}
        <div className="lg:col-span-2">
          {selectedTournament ? (
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-xl font-semibold text-gray-900">
                    {selectedTournament.name} - Format Configuration
                  </h2>
                  <p className="text-gray-600">
                    {selectedTournament.has_multiple_stages ? 'Multi-stage tournament' : 'Single stage tournament'}
                  </p>
                </div>
                <div className="flex gap-2">
                  {!isEditing ? (
                    <button
                      onClick={() => setIsEditing(true)}
                      className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 flex items-center gap-2"
                    >
                      <Edit className="w-4 h-4" />
                      Edit Format
                    </button>
                  ) : (
                    <>
                      <button
                        onClick={saveFormat}
                        disabled={loading}
                        className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 flex items-center gap-2 disabled:opacity-50"
                      >
                        <Save className="w-4 h-4" />
                        Save
                      </button>
                      <button
                        onClick={cancelEdit}
                        className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 flex items-center gap-2"
                      >
                        <X className="w-4 h-4" />
                        Cancel
                      </button>
                    </>
                  )}
                </div>
              </div>

              {isEditing ? (
                /* Editing Mode */
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-medium text-gray-900">Tournament Stages</h3>
                    <button
                      onClick={addStage}
                      className="px-3 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center gap-2"
                    >
                      <Plus className="w-4 h-4" />
                      Add Stage
                    </button>
                  </div>

                  {editingStages.map((stage, index) => (
                    <div key={index} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-4">
                        <h4 className="font-medium text-gray-900">Stage {stage.stage_order}</h4>
                        <div className="flex gap-2">
                          <button
                            onClick={() => moveStage(index, 'up')}
                            disabled={index === 0}
                            className="p-1 text-gray-400 hover:text-gray-600 disabled:opacity-50"
                          >
                            <ArrowUp className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => moveStage(index, 'down')}
                            disabled={index === editingStages.length - 1}
                            className="p-1 text-gray-400 hover:text-gray-600 disabled:opacity-50"
                          >
                            <ArrowDown className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => removeStage(index)}
                            className="p-1 text-red-400 hover:text-red-600"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Stage Name
                          </label>
                          <input
                            type="text"
                            value={stage.stage_name}
                            onChange={(e) => updateStage(index, 'stage_name', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Format Type
                          </label>
                          <select
                            value={stage.format_type}
                            onChange={(e) => updateStage(index, 'format_type', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                          >
                            {formats.map((format) => (
                              <option key={format.id} value={format.name}>
                                {format.name}
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>

                      {/* Format-specific configuration */}
                      <div className="mt-4">
                        <h5 className="text-sm font-medium text-gray-700 mb-2">Format Configuration</h5>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {getFormatConfigFields(stage.format_type).map((field) => {
                            // Check if field should be shown based on conditions
                            if (field.condition) {
                              const [conditionField, conditionValue] = field.condition.split(' === ')
                              const shouldShow = stage.format_config[conditionField] === conditionValue.replace(/"/g, '')
                              if (!shouldShow) return null
                            }
                            
                            return (
                              <div key={field.key}>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                  {field.label}
                                </label>
                                {field.type === 'select' ? (
                                  <select
                                    value={stage.format_config[field.key] || ''}
                                    onChange={(e) => updateStageConfig(index, field.key, e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                                  >
                                    <option value="">Select...</option>
                                    {field.options?.map((option) => (
                                      <option key={option} value={option}>
                                        {option.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
                                      </option>
                                    ))}
                                  </select>
                                ) : (
                                  <input
                                    type={field.type}
                                    min={field.min}
                                    max={field.max}
                                    value={stage.format_config[field.key] || ''}
                                    onChange={(e) => updateStageConfig(index, field.key, 
                                      field.type === 'number' ? parseInt(e.target.value) : e.target.value
                                    )}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                                  />
                                )}
                              </div>
                            )
                          })}
                        </div>
                      </div>

                      {/* Advanced Tournament Rules */}
                      {stage.format_type === 'Multi-Stage Tournament' && (
                        <div className="mt-4">
                          <h5 className="text-sm font-medium text-gray-700 mb-2">Advanced Tournament Rules</h5>
                          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div>
                                <label className="block text-sm font-medium text-blue-700 mb-1">
                                  Stage Transition Rules
                                </label>
                                <div className="space-y-2">
                                  <div className="flex items-center gap-2">
                                    <input
                                      type="checkbox"
                                      id={`auto_advance_${index}`}
                                      checked={stage.format_config?.auto_advance || false}
                                      onChange={(e) => updateStageConfig(index, 'auto_advance', e.target.checked)}
                                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                    />
                                    <label htmlFor={`auto_advance_${index}`} className="text-sm text-blue-700">
                                      Auto-advance teams based on standings
                                    </label>
                                  </div>
                                  <div className="flex items-center gap-2">
                                    <input
                                      type="checkbox"
                                      id={`carry_seeds_${index}`}
                                      checked={stage.format_config?.carry_seeds || false}
                                      onChange={(e) => updateStageConfig(index, 'carry_seeds', e.target.checked)}
                                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                    />
                                    <label htmlFor={`carry_seeds_${index}`} className="text-sm text-blue-700">
                                      Carry seeding from previous stage
                                    </label>
                                  </div>
                                </div>
                              </div>
                              
                              <div>
                                <label className="block text-sm font-medium text-blue-700 mb-1">
                                  Bracket Generation
                                </label>
                                <div className="space-y-2">
                                  <div className="flex items-center gap-2">
                                    <input
                                      type="checkbox"
                                      id={`auto_bracket_${index}`}
                                      checked={stage.format_config?.auto_bracket || false}
                                      onChange={(e) => updateStageConfig(index, 'auto_bracket', e.target.checked)}
                                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                    />
                                    <label htmlFor={`auto_bracket_${index}`} className="text-sm text-blue-700">
                                      Auto-generate brackets
                                    </label>
                                  </div>
                                  <div className="flex items-center gap-2">
                                    <input
                                      type="checkbox"
                                      id={`bye_rules_${index}`}
                                      checked={stage.format_config?.bye_rules_enabled || false}
                                      onChange={(e) => updateStageConfig(index, 'bye_rules_enabled', e.target.checked)}
                                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                    />
                                    <label htmlFor={`bye_rules_${index}`} className="text-sm text-blue-700">
                                      Apply bye rules for top seeds
                                    </label>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Round Robin Specific Rules */}
                      {(stage.format_type === 'Round Robin' || stage.format_type === 'Round Robin 2 Legs') && (
                        <div className="mt-4">
                          <h5 className="text-sm font-medium text-gray-700 mb-2">Round Robin Rules</h5>
                          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div>
                                <label className="block text-sm font-medium text-green-700 mb-1">
                                  Match Scheduling
                                </label>
                                <div className="space-y-2">
                                  <div className="flex items-center gap-2">
                                    <input
                                      type="checkbox"
                                      id={`randomize_schedule_${index}`}
                                      checked={stage.format_config?.randomize_schedule || false}
                                      onChange={(e) => updateStageConfig(index, 'randomize_schedule', e.target.checked)}
                                      className="rounded border-gray-300 text-green-600 focus:ring-green-500"
                                    />
                                    <label htmlFor={`randomize_schedule_${index}`} className="text-sm text-green-700">
                                      Randomize match schedule
                                    </label>
                                  </div>
                                  <div className="flex items-center gap-2">
                                    <input
                                      type="checkbox"
                                      id={`balance_home_away_${index}`}
                                      checked={stage.format_config?.balance_home_away || false}
                                      onChange={(e) => updateStageConfig(index, 'balance_home_away', e.target.checked)}
                                      className="rounded border-gray-300 text-green-600 focus:ring-green-500"
                                    />
                                    <label htmlFor={`balance_home_away_${index}`} className="text-sm text-green-700">
                                      Balance side selection distribution
                                    </label>
                                  </div>
                                </div>
                              </div>
                              
                              <div>
                                <label className="block text-sm font-medium text-green-700 mb-1">
                                  Standings Rules
                                </label>
                                <div className="space-y-2">
                                  <div className="flex items-center gap-2">
                                    <input
                                      type="checkbox"
                                      id={`head_to_head_tiebreak_${index}`}
                                      checked={stage.format_config?.head_to_head_tiebreak || false}
                                      onChange={(e) => updateStageConfig(index, 'head_to_head_tiebreak', e.target.checked)}
                                      className="rounded border-gray-300 text-green-600 focus:ring-green-500"
                                    />
                                    <label htmlFor={`head_to_head_tiebreak_${index}`} className="text-sm text-green-700">
                                      Use head-to-head for tiebreaks
                                    </label>
                                  </div>
                                  <div className="flex items-center gap-2">
                                    <input
                                      type="checkbox"
                                      id={`kills_difference_tiebreak_${index}`}
                                      checked={stage.format_config?.kills_difference_tiebreak || false}
                                      onChange={(e) => updateStageConfig(index, 'kills_difference_tiebreak', e.target.checked)}
                                      className="rounded border-gray-300 text-green-600 focus:ring-green-500"
                                    />
                                    <label htmlFor={`kills_difference_tiebreak_${index}`} className="text-sm text-green-700">
                                      Use kills difference for tiebreaks
                                    </label>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Complex Tournament Wizard */}
                      {stage.format_type === 'Complex Tournament' && (
                        <div className="mt-4">
                          <h5 className="text-sm font-medium text-gray-700 mb-2">Complex Tournament Setup</h5>
                          <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                            <div className="mb-4">
                              <h6 className="text-sm font-semibold text-purple-800 mb-2">Stage 1: Group/League Phase</h6>
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                  <label className="block text-xs font-medium text-purple-700 mb-1">
                                    Side Selection Rules
                                  </label>
                                  <div className="space-y-1">
                                    <div className="flex items-center gap-2">
                                      <input
                                        type="checkbox"
                                        id={`home_away_enabled_${index}`}
                                        checked={stage.format_config?.home_away_enabled || false}
                                        onChange={(e) => updateStageConfig(index, 'home_away_enabled', e.target.checked)}
                                        className="rounded border-purple-300 text-purple-600 focus:ring-purple-500"
                                      />
                                                                              <label htmlFor={`home_away_enabled_${index}`} className="text-xs text-purple-700">
                                          Enable side selection designation
                                        </label>
                                    </div>
                                    <div className="flex items-center gap-2">
                                      <input
                                        type="checkbox"
                                        id={`balance_schedule_${index}`}
                                        checked={stage.format_config?.balance_schedule || false}
                                        onChange={(e) => updateStageConfig(index, 'balance_schedule', e.target.checked)}
                                        className="rounded border-purple-300 text-purple-600 focus:ring-purple-500"
                                      />
                                                                              <label htmlFor={`balance_schedule_${index}`} className="text-xs text-purple-700">
                                          Balance side selection distribution
                                        </label>
                                    </div>
                                  </div>
                                </div>
                                
                                <div>
                                  <label className="block text-xs font-medium text-purple-700 mb-1">
                                    Qualification Rules
                                  </label>
                                  <div className="space-y-1">
                                    <div className="flex items-center gap-2">
                                      <input
                                        type="checkbox"
                                        id={`auto_qualify_${index}`}
                                        checked={stage.format_config?.auto_qualify || false}
                                        onChange={(e) => updateStageConfig(index, 'auto_qualify', e.target.checked)}
                                        className="rounded border-purple-300 text-purple-600 focus:ring-purple-500"
                                      />
                                      <label htmlFor={`auto_qualify_${index}`} className="text-xs text-purple-700">
                                        Auto-qualify top teams
                                      </label>
                                    </div>
                                    <div className="flex items-center gap-2">
                                      <input
                                        type="checkbox"
                                        id={`playoff_qualify_${index}`}
                                        checked={stage.format_config?.playoff_qualify || false}
                                        onChange={(e) => updateStageConfig(index, 'playoff_qualify', e.target.checked)}
                                        className="rounded border-purple-300 text-purple-600 focus:ring-purple-500"
                                      />
                                      <label htmlFor={`playoff_qualify_${index}`} className="text-xs text-purple-700">
                                        Playoff for remaining spots
                                      </label>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                            
                            <div>
                              <h6 className="text-sm font-semibold text-purple-800 mb-2">Stage 2: Playoff Phase</h6>
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                  <label className="block text-xs font-medium text-purple-700 mb-1">
                                    Bracket Structure
                                  </label>
                                  <div className="space-y-1">
                                    <div className="flex items-center gap-2">
                                      <input
                                        type="checkbox"
                                        id={`top_seeds_bye_${index}`}
                                        checked={stage.format_config?.top_seeds_bye || false}
                                        onChange={(e) => updateStageConfig(index, 'top_seeds_bye', e.target.checked)}
                                        className="rounded border-purple-300 text-purple-600 focus:ring-purple-500"
                                      />
                                      <label htmlFor={`top_seeds_bye_${index}`} className="text-xs text-purple-700">
                                        Top seeds get byes
                                      </label>
                                    </div>
                                    <div className="flex items-center gap-2">
                                      <input
                                        type="checkbox"
                                        id={`seeding_protection_${index}`}
                                        checked={stage.format_config?.seeding_protection || false}
                                        onChange={(e) => updateStageConfig(index, 'seeding_protection', e.target.checked)}
                                        className="rounded border-purple-300 text-purple-600 focus:ring-purple-500"
                                      />
                                      <label htmlFor={`seeding_protection_${index}`} className="text-xs text-purple-700">
                                        Protect top seeds in early rounds
                                      </label>
                                    </div>
                                  </div>
                                </div>
                                
                                <div>
                                  <label className="block text-xs font-medium text-purple-700 mb-1">
                                    Match Rules
                                  </label>
                                  <div className="space-y-1">
                                    <div className="flex items-center gap-2">
                                      <input
                                        type="checkbox"
                                        id={`bo3_playoffs_${index}`}
                                        checked={stage.format_config?.bo3_playoffs || false}
                                        onChange={(e) => updateStageConfig(index, 'bo3_playoffs', e.target.checked)}
                                        className="rounded border-purple-300 text-purple-600 focus:ring-purple-500"
                                      />
                                      <label htmlFor={`bo3_playoffs_${index}`} className="text-xs text-purple-700">
                                        Best of 3 for playoffs
                                      </label>
                                    </div>
                                    <div className="flex items-center gap-2">
                                      <input
                                        type="checkbox"
                                        id={`bo5_finals_${index}`}
                                        checked={stage.format_config?.bo5_finals || false}
                                        onChange={(e) => updateStageConfig(index, 'bo5_finals', e.target.checked)}
                                        className="rounded border-purple-300 text-purple-600 focus:ring-purple-500"
                                      />
                                      <label htmlFor={`bo5_finals_${index}`} className="text-xs text-purple-700">
                                        Best of 5 for finals
                                      </label>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Round Names Configuration for Elimination Formats */}
                      {(stage.format_type === 'Single Elimination' || stage.format_type === 'Double Elimination') && (
                        <div className="mt-4">
                          <h5 className="text-sm font-medium text-gray-700 mb-2">Round Names</h5>
                          <p className="text-xs text-gray-500 mb-3">
                            Customize the names for each round in the bracket (e.g., "Upper Semi", "Lower Final", "Grand Final")
                          </p>
                          <div className="space-y-3">
                            {(() => {
                              const teamsCount = stage.format_config?.teams_count || 8
                              const rounds = Math.ceil(Math.log2(teamsCount))
                              const roundNames = stage.format_config?.round_names || []
                              
                              return Array.from({ length: rounds }, (_, roundIndex) => {
                                const roundNumber = roundIndex + 1
                                const defaultName = getDefaultRoundName(roundNumber, rounds)
                                
                                return (
                                  <div key={roundNumber} className="flex items-center gap-3">
                                    <label className="block text-sm font-medium text-gray-700 min-w-[80px]">
                                      Round {roundNumber}:
                                    </label>
                                    <input
                                      type="text"
                                      placeholder={defaultName}
                                      value={roundNames[roundIndex] || ''}
                                      onChange={(e) => {
                                        const newRoundNames = [...roundNames]
                                        newRoundNames[roundIndex] = e.target.value
                                        updateStageConfig(index, 'round_names', newRoundNames)
                                      }}
                                      className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                                    />
                                    <button
                                      onClick={() => {
                                        const newRoundNames = [...roundNames]
                                        newRoundNames[roundIndex] = defaultName
                                        updateStageConfig(index, 'round_names', newRoundNames)
                                      }}
                                      className="px-2 py-2 text-xs bg-gray-100 text-gray-600 rounded hover:bg-gray-200"
                                      title="Use default name"
                                    >
                                      Default
                                    </button>
                                  </div>
                                )
                              })
                            })()}
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                /* View Mode */
                <div className="space-y-4">
                  <h3 className="text-lg font-medium text-gray-900">Current Stages</h3>
                  {stages.length === 0 ? (
                    <p className="text-gray-500">No stages configured for this tournament.</p>
                  ) : (
                    stages.map((stage) => (
                      <div key={stage.id} className="border border-gray-200 rounded-lg p-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <h4 className="font-medium text-gray-900">
                              {stage.stage_order}. {stage.stage_name}
                            </h4>
                            <p className="text-sm text-gray-600">{stage.format_type}</p>
                          </div>
                          <span className="text-sm text-gray-500">Order: {stage.stage_order}</span>
                        </div>
                        {stage.format_config && Object.keys(stage.format_config).length > 0 && (
                          <div className="mt-3 pt-3 border-t border-gray-100">
                            <h5 className="text-sm font-medium text-gray-700 mb-2">Configuration</h5>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                              {Object.entries(stage.format_config).map(([key, value]) => (
                                <div key={key}>
                                  <span className="text-gray-600">{key.replace('_', ' ')}:</span>
                                  <span className="ml-1 font-medium">{String(value)}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                        
                        {/* Display Round Names if configured */}
                        {stage.format_config?.round_names && Array.isArray(stage.format_config.round_names) && stage.format_config.round_names.some((name: any) => name) && (
                          <div className="mt-3 pt-3 border-t border-gray-100">
                            <h5 className="text-sm font-medium text-gray-700 mb-2">Custom Round Names</h5>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                              {stage.format_config.round_names.map((name: any, index) => (
                                name && (
                                  <div key={index}>
                                    <span className="text-gray-600">Round {index + 1}:</span>
                                    <span className="ml-1 font-medium">{name}</span>
                                  </div>
                                )
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    ))
                  )}
                </div>
              )}
            </div>
          ) : (
            <div className="bg-white rounded-lg shadow p-6 text-center py-12">
              <div className="text-gray-400 mb-4">
                <svg className="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">Select a Tournament</h3>
              <p className="text-gray-500">Choose a tournament from the left panel to configure its format.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
