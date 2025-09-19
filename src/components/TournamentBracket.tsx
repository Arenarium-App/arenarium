'use client'

import { useState } from 'react'
import { ChevronDown, ChevronUp, Users, Trophy, Award } from 'lucide-react'
import type { Database } from '@/types/database'

type TournamentStage = Database['public']['Tables']['tournament_stages']['Row']
type Tournament = Database['public']['Tables']['tournaments']['Row']

interface TournamentBracketProps {
  tournament: Tournament
  stages: TournamentStage[]
  teams?: Array<{
    id: number
    tournament_id: number
    team_id: number
    seed: number
    final_position: number | null
    prize_money: number | null
    team: { team_name: string; team_code: string; logo: string; region: string }
  }>
  matches?: Array<{
    id: number
    team1_id: number
    team2_id: number
    status: string
    team1_score: number
    team2_score: number
    team1: { team_name: string; team_code: string; logo: string }
    team2: { team_name: string; team_code: string; logo: string }
  }>
  isExpanded: boolean
  onToggle: () => void
}

interface BracketMatch {
  id: string
  round: number
  match: number
  team1: { id: number; name: string; logo: string; code: string }
  team2: { id: number; name: string; logo: string; code: string }
  score1?: number
  score2?: number
  winner?: number
  isComplete: boolean
}

interface RoundRobinMatch {
  id: string
  team1: string
  team2: string
  score1?: number
  score2?: number
  winner?: string
  isComplete: boolean
}

export default function TournamentBracket({ 
  tournament, 
  stages, 
  teams = [],
  matches = [],
  isExpanded, 
  onToggle 
}: TournamentBracketProps) {
  const [selectedStage, setSelectedStage] = useState<TournamentStage | null>(
    stages.length > 0 ? stages[0] : null
  )

  // Generate sample bracket data based on format type and real teams
  const generateBracketData = (stage: TournamentStage): BracketMatch[] => {
    const formatType = stage.format_type
    const teamsCount = (stage.format_config?.teams_count as number) || teams.length || 8
    
    if (formatType === 'Single Elimination') {
      return generateSingleEliminationBracket(teamsCount)
    } else if (formatType === 'Double Elimination') {
      return generateDoubleEliminationBracket(teamsCount)
    }
    
    return []
  }

  const generateSingleEliminationBracket = (teamsCount: number): BracketMatch[] => {
    const matches: BracketMatch[] = []
    const rounds = Math.ceil(Math.log2(teamsCount))
    
    // Use real teams if available, otherwise generate placeholder teams
    const availableTeams = teams.length > 0 ? teams : []
    
    for (let round = 1; round <= rounds; round++) {
      const matchesInRound = Math.ceil(teamsCount / Math.pow(2, round))
      for (let match = 1; match <= matchesInRound; match++) {
        const team1Index = (match - 1) * 2
        const team2Index = (match - 1) * 2 + 1
        
        const team1 = availableTeams[team1Index] || {
          id: team1Index + 1,
          tournament_id: tournament.id,
          team_id: team1Index + 1,
          seed: team1Index + 1,
          final_position: null,
          prize_money: null,
          team: { team_name: `Team ${team1Index + 1}`, team_code: `T${team1Index + 1}`, logo: '', region: '' }
        }
        
        const team2 = availableTeams[team2Index] || {
          id: team2Index + 1,
          tournament_id: tournament.id,
          team_id: team2Index + 1,
          seed: team2Index + 1,
          final_position: null,
          prize_money: null,
          team: { team_name: `Team ${team2Index + 1}`, team_code: `T${team2Index + 1}`, logo: '', region: '' }
        }
        
        matches.push({
          id: `r${round}m${match}`,
          round,
          match,
          team1: {
            id: team1.team_id,
            name: team1.team.team_name,
            logo: team1.team.logo,
            code: team1.team.team_code
          },
          team2: {
            id: team2.team_id,
            name: team2.team.team_name,
            logo: team2.team.logo,
            code: team2.team.team_code
          },
          score1: Math.floor(Math.random() * 16),
          score2: Math.floor(Math.random() * 16),
          winner: Math.random() > 0.5 ? team1.team_id : team2.team_id,
          isComplete: Math.random() > 0.3
        })
      }
    }
    
    return matches
  }

  const generateDoubleEliminationBracket = (teamsCount: number): BracketMatch[] => {
    const matches: BracketMatch[] = []
    const rounds = Math.ceil(Math.log2(teamsCount)) * 2
    
    // Use real teams if available, otherwise generate placeholder teams
    const availableTeams = teams.length > 0 ? teams : []
    
    for (let round = 1; round <= rounds; round++) {
      const matchesInRound = Math.ceil(teamsCount / Math.pow(2, Math.ceil(round / 2)))
      for (let match = 1; match <= matchesInRound; match++) {
        const team1Index = (match - 1) * 2
        const team2Index = (match - 1) * 2 + 1
        
        const team1 = availableTeams[team1Index] || {
          id: team1Index + 1,
          tournament_id: tournament.id,
          team_id: team1Index + 1,
          seed: team1Index + 1,
          final_position: null,
          prize_money: null,
          team: { team_name: `Team ${team1Index + 1}`, team_code: `T${team1Index + 1}`, logo: '', region: '' }
        }
        
        const team2 = availableTeams[team2Index] || {
          id: team2Index + 1,
          tournament_id: tournament.id,
          team_id: team2Index + 1,
          seed: team2Index + 1,
          final_position: null,
          prize_money: null,
          team: { team_name: `Team ${team2Index + 1}`, team_code: `T${team2Index + 1}`, logo: '', region: '' }
        }
        
        matches.push({
          id: `r${round}m${match}`,
          round,
          match,
          team1: {
            id: team1.team_id,
            name: team1.team.team_name,
            logo: team1.team.logo,
            code: team1.team.team_code
          },
          team2: {
            id: team2.team_id,
            name: team2.team.team_name,
            logo: team2.team.logo,
            code: team2.team.team_code
          },
          score1: Math.floor(Math.random() * 16),
          score2: Math.floor(Math.random() * 16),
          winner: Math.random() > 0.5 ? team1.team_id : team2.team_id,
          isComplete: Math.random() > 0.3
        })
      }
    }
    
    return matches
  }

  const generateRoundRobinTable = (stage: TournamentStage) => {
    const teamsCount = (stage.format_config?.teams_count as number) || teams.length || 8
    
    // Use real teams if available, otherwise generate placeholder teams
    const availableTeams = teams.length > 0 ? teams : []
    const teamNames = availableTeams.length > 0 
      ? availableTeams.map(t => t.team.team_name)
      : Array.from({ length: teamsCount }, (_, i) => `Team ${i + 1}`)
    
    // Generate sample standings
    const standings = teamNames.map((team, index) => ({
      position: index + 1,
      team,
      played: Math.floor(Math.random() * 10) + 5,
      won: Math.floor(Math.random() * 8) + 2,
      drawn: Math.floor(Math.random() * 3),
      lost: Math.floor(Math.random() * 5),
      points: Math.floor(Math.random() * 25) + 10
    }))
    
    // Sort by points
    standings.sort((a, b) => b.points - a.points)
    standings.forEach((standing, index) => {
      standing.position = index + 1
    })
    
    return standings
  }

  const generateSwissTable = (stage: TournamentStage) => {
    const teamsCount = (stage.format_config?.teams_count as number) || teams.length || 8
    
    // Use real teams if available, otherwise generate placeholder teams
    const availableTeams = teams.length > 0 ? teams : []
    const teamNames = availableTeams.length > 0 
      ? availableTeams.map(t => t.team.team_name)
      : Array.from({ length: teamsCount }, (_, i) => `Team ${i + 1}`)
    
    return teamNames.map((team, index) => ({
      position: index + 1,
      team,
      score: Math.floor(Math.random() * 10) + 1,
      tiebreak: Math.floor(Math.random() * 100) + 1,
      played: Math.floor(Math.random() * 5) + 3
    })).sort((a, b) => b.score - a.score)
  }

  const getPhaseName = (roundNumber: number, totalRounds: number, stage?: TournamentStage): string => {
    // Check if custom round names are configured in the stage
    if (stage?.format_config?.round_names && Array.isArray(stage.format_config.round_names)) {
      const customName = stage.format_config.round_names[roundNumber - 1]
      if (customName) {
        return customName
      }
    }
    
    // Fallback to default names
    if (totalRounds === 3) {
      if (roundNumber === 1) return 'Quarter Finals'
      if (roundNumber === 2) return 'Semi Finals'
      if (roundNumber === 3) return '🏆 Grand Final'
    } else if (totalRounds === 4) {
      if (roundNumber === 1) return 'Round of 16'
      if (roundNumber === 2) return 'Quarter Finals'
      if (roundNumber === 3) return 'Semi Finals'
      if (roundNumber === 4) return '🏆 Grand Final'
    } else if (totalRounds === 2) {
      if (roundNumber === 1) return 'Semi Finals'
      if (roundNumber === 2) return '🏆 Grand Final'
    }
    return `Round ${roundNumber}`
  }

  // Generate matchup scores for round robin tournaments
  const generateMatchupScores = () => {
    if (!teams.length || !matches.length) return {}
    
    const matrix: { [key: number]: { [key: number]: string } } = {}
    
    teams.forEach(team1 => {
      matrix[team1.team_id] = {}
      teams.forEach(team2 => {
        if (team1.team_id === team2.team_id) {
          matrix[team1.team_id][team2.team_id] = '-'
        } else {
          matrix[team1.team_id][team2.team_id] = 'N/A'
        }
      })
    })
    
    matches.forEach(match => {
      if (match.team1_id && match.team2_id && match.status === 'completed') {
        const score = `${match.team1_score}-${match.team2_score}`
        matrix[match.team1_id][match.team2_id] = score
        
        if (matrix[match.team2_id][match.team1_id] === 'N/A') {
          const reverseScore = `${match.team2_score}-${match.team1_score}`
          matrix[match.team2_id][match.team1_id] = reverseScore
        }
      }
    })
    
    return matrix
  }

  const renderBracket = (stage: TournamentStage) => {
    const formatType = stage.format_type
    
    if (formatType === 'Single Elimination' || formatType === 'Double Elimination') {
      const matches = generateBracketData(stage)
      const rounds = Math.max(...matches.map(m => m.round))
      
      return (
        <div className="relative">
          {/* Phase labels at the top */}
          <div className="flex justify-between mb-8 px-4">
            {Array.from({ length: rounds }, (_, roundIndex) => {
              const roundNumber = roundIndex + 1
              const phaseName = getPhaseName(roundNumber, rounds, stage)
              const isFinalRound = roundNumber === rounds
              const isSemiFinal = roundNumber === rounds - 1
              const isQuarterFinal = roundNumber === rounds - 2
              
              return (
                <div key={roundNumber} className="text-center flex-1">
                  <h4 className={`text-lg font-bold ${
                    isFinalRound ? 'text-yellow-600' : 
                    isSemiFinal ? 'text-purple-600' : 
                    isQuarterFinal ? 'text-blue-600' :
                    'text-gray-800'
                  }`}>
                    {phaseName}
                  </h4>
                </div>
              )
            })}
          </div>
          
          {/* Bracket matches with connecting lines */}
          <div className="grid gap-8" style={{ gridTemplateColumns: `repeat(${rounds}, 1fr)` }}>
            {Array.from({ length: rounds }, (_, roundIndex) => {
              const roundNumber = roundIndex + 1
              const roundMatches = matches.filter(m => m.round === roundNumber)
              const isFinalRound = roundNumber === rounds
              const isSemiFinal = roundNumber === rounds - 1
              const isQuarterFinal = roundNumber === rounds - 2
              
              return (
                <div key={roundNumber} className="space-y-6 relative">
                  {/* Vertical connecting lines */}
                  {roundNumber < rounds && (
                    <div className="absolute top-1/2 left-full w-8 h-px bg-gray-300 transform -translate-y-1/2 z-10"></div>
                  )}
                  
                  {roundMatches.map((match, matchIndex) => (
                    <div key={match.id} className="relative">
                      {/* Horizontal connecting lines to next round */}
                      {roundNumber < rounds && (
                        <div className="absolute top-1/2 left-full w-8 h-px bg-gray-300 transform -translate-y-1/2 z-10"></div>
                      )}
                      
                      {/* Match box */}
                      <div className={`bg-gradient-to-r from-gray-50 to-white rounded-lg border-2 border-gray-200 p-4 shadow-sm hover:shadow-md transition-shadow ${
                        isFinalRound ? 'border-yellow-300 shadow-lg' :
                        isSemiFinal ? 'border-purple-300' :
                        isQuarterFinal ? 'border-blue-300' :
                        'border-gray-200'
                      }`}>
                        <div className="space-y-3">
                          {/* Team 1 */}
                          <div className={`p-3 rounded-lg border-2 transition-all flex items-center space-x-3 ${
                            match.winner === match.team1.id
                              ? 'bg-green-50 border-green-300 shadow-sm' 
                              : 'bg-gray-50 border-gray-200'
                          }`}>
                            {match.team1.logo && (
                              <div className="w-8 h-8 rounded-full overflow-hidden bg-gray-200 flex-shrink-0">
                                <img 
                                  src={match.team1.logo} 
                                  alt={match.team1.name}
                                  className="w-full h-full object-cover"
                                  onError={(e) => {
                                    const target = e.target as HTMLImageElement
                                    target.style.display = 'none'
                                  }}
                                />
                              </div>
                            )}
                            <div className="flex-1 min-w-0">
                              <span className="font-semibold text-gray-900 block truncate">{match.team1.name}</span>
                              <span className="text-xs text-gray-500">{match.team1.code}</span>
                            </div>
                            {match.score1 !== undefined && (
                              <span className="text-lg font-bold text-gray-600 ml-2">({match.score1})</span>
                            )}
                          </div>
                          
                          {/* Team 2 */}
                          <div className={`p-3 rounded-lg border-2 transition-all flex items-center space-x-3 ${
                            match.winner === match.team2.id
                              ? 'bg-green-50 border-green-300 shadow-sm' 
                              : 'bg-gray-50 border-gray-200'
                          }`}>
                            {match.team2.logo && (
                              <div className="w-8 h-8 rounded-full overflow-hidden bg-gray-200 flex-shrink-0">
                                <img 
                                  src={match.team2.logo} 
                                  alt={match.team2.name}
                                  className="w-full h-full object-cover"
                                  onError={(e) => {
                                    const target = e.target as HTMLImageElement
                                    target.style.display = 'none'
                                  }}
                                />
                              </div>
                            )}
                            <div className="flex-1 min-w-0">
                              <span className="font-semibold text-gray-900 block truncate">{match.team2.name}</span>
                              <span className="text-xs text-gray-500">{match.team2.code}</span>
                            </div>
                            {match.score2 !== undefined && (
                              <span className="text-lg font-bold text-gray-600 ml-2">({match.score2})</span>
                            )}
                          </div>
                        </div>
                        
                        {/* Match status */}
                        <div className="mt-3 text-center">
                          <div className={`text-sm font-medium px-3 py-1 rounded-full inline-block ${
                            match.isComplete 
                              ? 'text-green-700 bg-green-100' 
                              : 'text-yellow-700 bg-yellow-100'
                          }`}>
                            {match.isComplete ? '✓ Complete' : '⏳ Pending'}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )
            })}
          </div>
        </div>
      )
    }
    
    if (formatType === 'Round Robin' || formatType === 'Round Robin 2 Legs') {
      const standings = generateRoundRobinTable(stage)
      const matchupScores = generateMatchupScores()
      
      return (
        <div className="space-y-8">
          {/* League Table */}
          <div className="overflow-x-auto">
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-4 mb-4">
              <h4 className="text-lg font-semibold text-blue-900 mb-2">League Table</h4>
              <p className="text-blue-700 text-sm">Teams ranked by points earned</p>
            </div>
            <table className="min-w-full bg-white rounded-lg border shadow-sm">
              <thead className="bg-gradient-to-r from-gray-50 to-gray-100">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Pos</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Team</th>
                  <th className="px-4 py-3 text-center text-xs font-medium text-gray-600 uppercase tracking-wider">P</th>
                  <th className="px-4 py-3 text-center text-xs font-medium text-gray-600 uppercase tracking-wider">W</th>
                  <th className="px-4 py-3 text-center text-xs font-medium text-gray-600 uppercase tracking-wider">D</th>
                  <th className="px-4 py-3 text-center text-xs font-medium text-gray-600 uppercase tracking-wider">L</th>
                  <th className="px-4 py-3 text-center text-xs font-medium text-gray-600 uppercase tracking-wider">Pts</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {standings.map((standing) => (
                  <tr key={standing.team} className="hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-3 text-sm font-medium text-gray-900">
                      <div className="flex items-center">
                        {standing.position === 1 && <Trophy className="w-5 h-5 text-yellow-500 mr-2" />}
                        {standing.position === 2 && <Award className="w-5 h-5 text-gray-400 mr-2" />}
                        {standing.position === 3 && <Award className="w-5 h-5 text-amber-600 mr-2" />}
                        <span className={`px-2 py-1 rounded-full text-xs font-bold ${
                          standing.position === 1 ? 'bg-yellow-100 text-yellow-800' :
                          standing.position === 2 ? 'bg-gray-100 text-gray-800' :
                          standing.position === 3 ? 'bg-amber-100 text-amber-800' :
                          'bg-gray-100 text-gray-600'
                        }`}>
                          {standing.position}
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-sm font-medium text-gray-900">{standing.team}</td>
                    <td className="px-4 py-3 text-sm text-center text-gray-900 font-medium">{standing.played}</td>
                    <td className="px-4 py-3 text-sm text-center text-green-600 font-semibold">{standing.won}</td>
                    <td className="px-4 py-3 text-sm text-center text-blue-600 font-semibold">{standing.drawn}</td>
                    <td className="px-4 py-3 text-sm text-center text-red-600 font-semibold">{standing.lost}</td>
                    <td className="px-4 py-3 text-sm text-center font-bold text-gray-900 bg-gray-100 py-1 px-2 rounded">
                      {standing.points}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Matchup Scores Table */}
          {teams.length > 0 && (
            <div className="overflow-x-auto">
              <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg p-4 mb-4">
                <h4 className="text-lg font-semibold text-purple-900 mb-2">Head-to-Head Results</h4>
                <p className="text-purple-700 text-sm">Matchup scores between all teams</p>
              </div>
              <div className="bg-white rounded-lg border shadow-sm p-6">
                <div className="grid gap-4" style={{ 
                  gridTemplateColumns: `auto repeat(${teams.length}, 1fr)` 
                }}>
                  {/* Header row with team logos */}
                  <div className="flex items-center justify-center">
                    <span className="text-sm font-medium text-gray-600">Teams</span>
                  </div>
                  {teams.map((team) => (
                    <div key={team.team_id} className="flex flex-col items-center">
                      <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center mb-2">
                        {team.team.logo ? (
                          <img
                            src={team.team.logo}
                            alt={team.team.team_name}
                            className="w-8 h-8 rounded-full object-cover"
                            onError={(e) => {
                              const target = e.target as HTMLImageElement;
                              target.style.display = 'none';
                              const fallback = target.nextElementSibling as HTMLElement;
                              if (fallback) fallback.style.display = 'flex';
                            }}
                          />
                        ) : null}
                        <div className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center text-xs font-medium text-gray-600" style={{ display: team.team.logo ? 'none' : 'flex' }}>
                          {team.team.team_code}
                        </div>
                      </div>
                      <span className="text-xs text-gray-600 text-center leading-tight">{team.team.team_name}</span>
                    </div>
                  ))}

                  {/* Data rows */}
                  {teams.map((team1) => (
                    <div key={team1.team_id} className="contents">
                      {/* Team logo on the left */}
                      <div className="flex items-center justify-end pr-4">
                        <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center">
                          {team1.team.logo ? (
                            <img
                              src={team1.team.logo}
                              alt={team1.team.team_name}
                              className="w-8 h-8 rounded-full object-cover"
                              onError={(e) => {
                                const target = e.target as HTMLImageElement;
                                target.style.display = 'none';
                                const fallback = target.nextElementSibling as HTMLElement;
                                if (fallback) fallback.style.display = 'flex';
                              }}
                            />
                          ) : null}
                          <div className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center text-xs font-medium text-gray-600" style={{ display: team1.team.logo ? 'none' : 'flex' }}>
                            {team1.team.team_code}
                          </div>
                        </div>
                      </div>

                      {/* Score cells */}
                      {teams.map((team2) => {
                        const score = matchupScores[team1.team_id]?.[team2.team_id] || 'N/A'
                        const isSelf = team1.team_id === team2.team_id
                        const hasScore = score !== 'N/A' && score !== '-'
                        
                        return (
                          <div key={team2.team_id} className="flex items-center justify-center">
                            <div className={`w-16 h-12 rounded-lg border-2 flex items-center justify-center text-sm font-medium transition-colors ${
                              isSelf 
                                ? 'bg-gray-100 text-gray-400 border-gray-200' 
                                : hasScore
                                  ? 'bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100'
                                  : 'bg-gray-50 text-gray-500 border-gray-200'
                            }`}>
                              {score}
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      )
    }
    
    if (formatType === 'Swiss System') {
      const standings = generateSwissTable(stage)
      
      return (
        <div className="overflow-x-auto">
          <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg p-4 mb-4">
            <h4 className="text-lg font-semibold text-green-900 mb-2">Swiss System Standings</h4>
            <p className="text-green-700 text-sm">Teams paired against others with similar records</p>
          </div>
          <table className="min-w-full bg-white rounded-lg border shadow-sm">
            <thead className="bg-gradient-to-r from-gray-50 to-gray-100">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Pos</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Team</th>
                <th className="px-4 py-3 text-center text-xs font-medium text-gray-600 uppercase tracking-wider">Score</th>
                <th className="px-4 py-3 text-center text-xs font-medium text-gray-600 uppercase tracking-wider">Tiebreak</th>
                <th className="px-4 py-3 text-center text-xs font-medium text-gray-600 uppercase tracking-wider">Played</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {standings.map((standing) => (
                <tr key={standing.team} className="hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-3 text-sm font-medium text-gray-900">
                    <div className="flex items-center">
                      {standing.position === 1 && <Trophy className="w-5 h-5 text-yellow-500 mr-2" />}
                      <span className={`px-2 py-1 rounded-full text-xs font-bold ${
                        standing.position === 1 ? 'bg-yellow-100 text-yellow-800' : 'bg-gray-100 text-gray-600'
                      }`}>
                        {standing.position}
                      </span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-sm font-medium text-gray-900">{standing.team}</td>
                  <td className="px-4 py-3 text-sm text-center font-bold text-green-600 bg-green-50 py-1 px-2 rounded">
                    {standing.score}
                  </td>
                  <td className="px-4 py-3 text-sm text-center text-gray-900">{standing.tiebreak}</td>
                  <td className="px-4 py-3 text-sm text-center text-gray-900 font-medium">{standing.played}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )
    }
    
    if (formatType === 'Leaderboard') {
      const standings = generateRoundRobinTable(stage) // Reuse round robin logic
      
      return (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white rounded-lg border shadow-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Pos</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Team</th>
                <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Points</th>
                <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Played</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {standings.map((standing) => (
                <tr key={standing.team} className="hover:bg-gray-50">
                  <td className="px-4 py-3 text-sm font-medium text-gray-900">
                    {standing.position === 1 && <Trophy className="inline w-4 h-4 text-yellow-500 mr-2" />}
                    {standing.position}
                  </td>
                  <td className="px-4 py-3 text-sm font-medium text-gray-900">{standing.team}</td>
                  <td className="px-4 py-3 text-sm text-center font-semibold text-gray-900">{standing.points}</td>
                  <td className="px-4 py-3 text-sm text-center text-gray-900">{standing.played}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )
    }
    
    return (
      <div className="text-center text-gray-500 py-8">
        <Users className="w-12 h-12 mx-auto mb-4 text-gray-400" />
        <p>Bracket view not available for this format type</p>
      </div>
    )
  }

  if (!selectedStage) {
    return (
      <div className="text-center text-gray-500 py-8">
        <p>No tournament stages configured</p>
      </div>
    )
  }

  return (
    <div className="bg-gray-50 rounded-lg p-6">
      {/* Stage Selector */}
      {stages.length > 1 && (
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Select Stage
          </label>
          <select
            value={selectedStage.id}
            onChange={(e) => {
              const stage = stages.find(s => s.id === parseInt(e.target.value))
              setSelectedStage(stage || null)
            }}
            className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
          >
            {stages.map((stage) => (
              <option key={stage.id} value={stage.id}>
                {stage.stage_name} ({stage.format_type})
              </option>
            ))}
          </select>
        </div>
      )}
      
      {/* Stage Info */}
      <div className="mb-6 p-4 bg-white rounded-lg border shadow-sm">
        <h3 className="text-lg font-semibold text-gray-800 mb-2">
          {selectedStage.stage_name}
        </h3>
        <div className="flex items-center text-sm text-gray-600">
          <Trophy className="w-4 h-4 mr-2" />
          <span className="capitalize">{selectedStage.format_type}</span>
          {selectedStage.format_config?.teams_count && (
            <span className="ml-4">
              <Users className="w-4 h-4 inline mr-1" />
              {selectedStage.format_config.teams_count} teams
            </span>
          )}
        </div>
      </div>
      
      {/* Bracket/Table Display */}
      <div className="bg-white rounded-lg border shadow-sm p-6">
        {renderBracket(selectedStage)}
      </div>
    </div>
  )
}
