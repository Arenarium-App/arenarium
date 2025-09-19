'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Image from 'next/image';

import TournamentBracket from '@/components/TournamentBracket';
import type { Database } from '@/types/database';
import { createClientComponentClient } from '@/lib/supabase';

type Tournament = Database['public']['Tables']['tournaments']['Row']
type TournamentStage = Database['public']['Tables']['tournament_stages']['Row']

interface Match {
  id: string;
  tournament_id: string;
  stage_id: string;
  team1_id: string;
  team2_id: string;
  team1_score: number;
  team2_score: number;
  scheduled_time: string;
  status: string;
  round_name: string;
  match_order: number;
  team1: { team_name: string; team_code: string; logo: string };
  team2: { team_name: string; team_code: string; logo: string };
}

interface TournamentTeam {
  id: string;
  tournament_id: string;
  team_id: string;
  seed: number | null;
  final_position: number | null;
  prize_money: number | null;
  team: { team_name: string; team_code: string; logo: string; region: string };
}

export default function TournamentDetail() {
  const params = useParams();
  const [tournament, setTournament] = useState<Tournament | null>(null);
  const [matches, setMatches] = useState<Match[]>([]);
  const [teams, setTeams] = useState<TournamentTeam[]>([]);
  const [stages, setStages] = useState<TournamentStage[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);



  useEffect(() => {
    const fetchTournamentData = async () => {
      try {
        const tournamentId = params.id as string;
        
        // Fetch tournament details
        const { data: tournamentData, error: tournamentError } = await createClientComponentClient()
          .from('tournaments')
          .select('*')
          .eq('id', tournamentId)
          .single();

        if (tournamentError) throw tournamentError;
        setTournament(tournamentData);

        // Fetch tournament teams
        const { data: teamsData } = await createClientComponentClient()
          .from('tournament_teams')
          .select(`
            *,
            team:teams(team_name, team_code, logo, region)
          `)
          .eq('tournament_id', tournamentId)
          .order('seed');

        if (teamsData) {
          setTeams(teamsData);
        }

        // Fetch matches
        const { data: matchesData, error: matchesError } = await createClientComponentClient()
          .from('matches')
          .select(`
            *,
            team1:teams!team1_id(team_name, team_code, logo),
            team2:teams!team2_id(team_name, team_code, logo)
          `)
          .eq('tournament_id', tournamentId)
          .order('scheduled_time');

        if (matchesError) throw matchesError;
        if (matchesData) {
          setMatches(matchesData);
        }


        // Fetch tournament stages
        const { data: stagesData, error: stagesError } = await createClientComponentClient()
          .from('tournament_stages')
          .select('*')
          .eq('tournament_id', tournamentId)
          .order('stage_order');

        if (stagesError) throw stagesError;
        setStages(stagesData || []);

      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch tournament data');
      } finally {
        setLoading(false);
      }
    };

    fetchTournamentData();
  }, [params.id]);

  const upcomingMatches = matches.filter(m => m.status === 'scheduled');
  const completedMatches = matches.filter(m => m.status === 'completed');
  const liveMatches = matches.filter(m => m.status === 'ongoing');

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-purple-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading tournament...</p>
        </div>
      </div>
    );
  }

  if (error || !tournament) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Error Loading Tournament</h1>
          <p className="text-gray-600 mb-6">{error || 'The tournament could not be loaded.'}</p>
          <button
            onClick={() => window.history.back()}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-purple-600 hover:bg-purple-700"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800';
      case 'ongoing': return 'bg-blue-100 text-blue-800';
      case 'upcoming': return 'bg-yellow-100 text-yellow-800';
      case 'live': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center space-x-4">
            {tournament.logo && (
              <div className="relative w-16 h-16">
                <Image
                  src={tournament.logo}
                  alt={tournament.name}
                  fill
                  className="rounded-lg object-cover"
                />
              </div>
            )}
            <div>
              <h1 className="text-3xl font-bold text-gray-900">{tournament.name}</h1>
              <p className="text-gray-600 mt-1">{tournament.description}</p>
            </div>
          </div>
          
          {/* Tournament Info */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">
                ${tournament.prize_pool.toLocaleString()}
              </div>
              <div className="text-sm text-gray-500">Prize Pool</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-semibold text-gray-900">
                {formatDate(tournament.start_date)}
              </div>
              <div className="text-sm text-gray-500">Start Date</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-semibold text-gray-900">
                {formatDate(tournament.end_date)}
              </div>
              <div className="text-sm text-gray-500">End Date</div>
            </div>
            <div className="text-center">
              <span className={`inline-flex px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(tournament.status)}`}>
                {tournament.status.charAt(0).toUpperCase() + tournament.status.slice(1)}
              </span>
              <div className="text-sm text-gray-500 mt-1">Status</div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Left Column - Teams & Standings */}
          <div className="lg:col-span-1 space-y-6">
            {/* Participating Teams */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Participating Teams</h2>
              <div className="space-y-3">
                {teams.map((team) => (
                  <div key={team.id} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                    <div className="relative w-10 h-10">
                      <Image
                        src={team.team.logo}
                        alt={team.team.team_name}
                        fill
                        className="rounded object-cover"
                      />
                    </div>
                    <div className="flex-1">
                      <div className="font-medium text-gray-900">{team.team.team_name}</div>
                      <div className="text-sm text-gray-500">{team.team.region}</div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-medium text-gray-900">Seed {team.seed}</div>
                      {team.final_position && (
                        <div className="text-xs text-gray-500">
                          {team.final_position === 1 ? '🥇' : 
                           team.final_position === 2 ? '🥈' : 
                           team.final_position === 3 ? '🥉' : 
                           `${team.final_position}th`}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Tournament Info */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Tournament Info</h2>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Type:</span>
                  <span className="font-medium">{tournament.tournament_type}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Teams:</span>
                  <span className="font-medium">{teams.length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Matches:</span>
                  <span className="font-medium">{matches.length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Stages:</span>
                  <span className="font-medium">{stages.length}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Matches & Games */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Live Matches */}
            {liveMatches.length > 0 && (
              <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                  <span className="w-3 h-3 bg-red-500 rounded-full mr-2 animate-pulse"></span>
                  Live Matches
                </h2>
                <div className="space-y-4">
                  {liveMatches.map((match) => (
                    <div key={match.id} className="border border-red-200 bg-red-50 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-sm font-medium text-red-800">{match.round_name}</span>
                        <span className="text-sm text-red-600">LIVE</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div className="relative w-12 h-12">
                            <Image
                              src={match.team1.logo}
                              alt={match.team1.team_name}
                              fill
                              className="rounded object-cover"
                            />
                          </div>
                          <div>
                            <div className="font-medium text-gray-900">{match.team1.team_name}</div>
                            <div className="text-sm text-gray-500">{match.team1.team_code}</div>
                          </div>
                        </div>
                        <div className="text-center">
                          <div className="text-2xl font-bold text-gray-900">
                            {match.team1_score} - {match.team2_score}
                          </div>
                          <div className="text-sm text-gray-500">{match.round_name}</div>
                        </div>
                        <div className="flex items-center space-x-3">
                          <div>
                            <div className="font-medium text-gray-900">{match.team2.team_name}</div>
                            <div className="text-sm text-gray-500">{match.team2.team_code}</div>
                          </div>
                          <div className="relative w-12 h-12">
                            <Image
                              src={match.team2.logo}
                              alt={match.team2.team_name}
                              fill
                              className="rounded object-cover"
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Upcoming Matches */}
            {upcomingMatches.length > 0 && (
              <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Upcoming Matches</h2>
                <div className="space-y-4">
                  {upcomingMatches.map((match) => (
                    <div key={match.id} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-sm font-medium text-gray-600">{match.round_name}</span>
                        <span className="text-sm text-gray-500">{formatDateTime(match.scheduled_time)}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div className="relative w-12 h-12">
                            <Image
                              src={match.team1.logo}
                              alt={match.team1.team_name}
                              fill
                              className="rounded object-cover"
                            />
                          </div>
                          <div>
                            <div className="font-medium text-gray-900">{match.team1.team_name}</div>
                            <div className="text-sm text-gray-500">{match.team1.team_code}</div>
                          </div>
                        </div>
                        <div className="text-center">
                          <div className="text-lg font-medium text-gray-600">VS</div>
                          <div className="text-sm text-gray-500">{match.round_name}</div>
                        </div>
                        <div className="flex items-center space-x-3">
                          <div className="text-right">
                            <div className="font-medium text-gray-900">{match.team2.team_name}</div>
                            <div className="text-sm text-gray-500">{match.team2.team_code}</div>
                          </div>
                          <div className="relative w-12 h-12">
                            <Image
                              src={match.team2.logo}
                              alt={match.team2.team_name}
                              fill
                              className="rounded object-cover"
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Recent Matches */}
            {completedMatches.length > 0 && (
              <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Recent Matches</h2>
                <div className="space-y-4">
                  {completedMatches.slice(0, 5).map((match) => (
                    <div key={match.id} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-sm font-medium text-gray-600">{match.round_name}</span>
                        <span className="text-sm text-gray-500">{formatDate(match.scheduled_time)}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div className="relative w-12 h-12">
                            <Image
                              src={match.team1.logo}
                              alt={match.team1.team_name}
                              fill
                              className="rounded object-cover"
                            />
                          </div>
                          <div>
                            <div className="font-medium text-gray-900">{match.team1.team_name}</div>
                            <div className="text-sm text-gray-500">{match.team1.team_code}</div>
                          </div>
                        </div>
                        <div className="text-center">
                          <div className="text-2xl font-bold text-gray-900">
                            {match.team1_score} - {match.team2_score}
                          </div>
                          <div className="text-sm text-gray-500">{match.round_name}</div>
                        </div>
                        <div className="flex items-center space-x-3">
                          <div className="text-right">
                            <div className="font-medium text-gray-900">{match.team2.team_name}</div>
                            <div className="text-sm text-gray-500">{match.team2.team_code}</div>
                          </div>
                          <div className="relative w-12 h-12">
                            <Image
                              src={match.team2.logo}
                              alt={match.team2.team_name}
                              fill
                              className="rounded object-cover"
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}


          </div>
        </div>

        {/* Full Width Tournament Bracket Section */}
        <div className="mt-8">
          {stages && stages.length > 0 ? (
            <TournamentBracket
              tournament={tournament!}
              stages={stages}
              teams={teams}
              matches={matches}
              isExpanded={true}
              onToggle={() => {}}
            />
          ) : (
            <div className="bg-white rounded-lg shadow p-6 text-center">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Tournament Bracket</h2>
              <p className="text-gray-500">
                No tournament stages or bracket configuration available yet.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
