export interface Database {
  public: {
    Tables: {
      teams: {
        Row: {
          id: string
          team_name: string
          team_code: string
          logo: string | null
          region: string | null
          region_id: string | null
          created_at?: string
          updated_at?: string
        }
        Insert: {
          id?: string
          team_name: string
          team_code: string
          logo?: string | null
          region?: string | null
          region_id?: string | null
        }
        Update: {
          id?: string
          team_name?: string
          team_code?: string
          logo?: string | null
          region?: string | null
          region_id?: string | null
        }
      }
      players: {
        Row: {
          id: number
          real_name: string
          in_game_name: string
          team_code: string | null
          player_photo: string | null
          role: string
          status: 'active' | 'inactive'
          created_at?: string
          updated_at?: string
        }
        Insert: {
          id?: number
          real_name: string
          in_game_name: string
          team_code?: string | null
          player_photo?: string | null
          role: string
          status?: 'active' | 'inactive'
        }
        Update: {
          id?: number
          real_name?: string
          in_game_name?: string
          team_code?: string | null
          player_photo?: string | null
          role?: string
          status?: 'active' | 'inactive'
        }
      }
      heroes: {
        Row: {
          id: number
          hero_name: string
          hero_img: string | null
          hero_role: string
          created_at?: string
          updated_at?: string
        }
        Insert: {
          id?: number
          hero_name: string
          hero_img?: string | null
          hero_role: string
        }
        Update: {
          id?: number
          hero_name?: string
          hero_img?: string | null
          hero_role?: string
        }
      }
      skills: {
        Row: {
          id: number
          skill_name: string
          skill_hero: number
          created_at?: string
          updated_at?: string
        }
        Insert: {
          id?: number
          skill_name: string
          skill_hero: number
        }
        Update: {
          id?: number
          skill_name?: string
          skill_hero?: number
        }
      }
      items: {
        Row: {
          id: number
          item_name: string
          item_img: string | null
          price: number
          created_at?: string
          updated_at?: string
        }
        Insert: {
          id?: number
          item_name: string
          item_img?: string | null
          price: number
        }
        Update: {
          id?: number
          item_name?: string
          item_img?: string | null
          price?: number
        }
      }
      emblems: {
        Row: {
          id: number
          name: string
          img: string | null
          created_at?: string
          updated_at?: string
        }
        Insert: {
          id?: number
          name: string
          img?: string | null
        }
        Update: {
          id?: number
          name?: string
          img?: string | null
        }
      }
      talents: {
        Row: {
          id: number
          name: string
          img: string | null
          created_at?: string
          updated_at?: string
        }
        Insert: {
          id?: number
          name: string
          img?: string | null
        }
        Update: {
          id?: number
          name?: string
          img?: string | null
        }
      }
      spells: {
        Row: {
          id: number
          name: string
          img: string | null
          created_at?: string
          updated_at?: string
        }
        Insert: {
          id?: number
          name: string
          img?: string | null
        }
        Update: {
          id?: number
          name?: string
          img?: string | null
        }
      }
      roles: {
        Row: {
          id: number
          name: string
          img: string | null
          created_at?: string
          updated_at?: string
        }
        Insert: {
          id?: number
          name: string
          img?: string | null
        }
        Update: {
          id?: number
          name?: string
          img?: string | null
        }
      }
      tournaments: {
        Row: {
          id: string
          name: string
          description: string | null
          start_date: string
          end_date: string
          prize_pool: number | null
          entry_fee: number | null
          max_teams: number | null
          min_teams: number | null
          status: 'upcoming' | 'ongoing' | 'completed' | 'cancelled'
          tournament_type: 'Single Elimination' | 'Double Elimination' | 'Round Robin' | 'Round Robin 2 Legs' | 'Complex Tournament'
          logo: string | null
          banner: string | null
          format_config: any | null
          has_multiple_stages: boolean | null
          created_at?: string
          updated_at?: string
        }
        Insert: {
          id?: string
          name: string
          description?: string | null
          start_date: string
          end_date: string
          prize_pool?: number | null
          entry_fee?: number | null
          max_teams?: number | null
          min_teams?: number | null
          status?: 'upcoming' | 'ongoing' | 'completed' | 'cancelled'
          tournament_type?: 'Single Elimination' | 'Double Elimination' | 'Round Robin' | 'Round Robin 2 Legs' | 'Complex Tournament'
          logo?: string | null
          banner?: string | null
          format_config?: any | null
          has_multiple_stages?: boolean | null
        }
        Update: {
          id?: string
          name?: string
          description?: string | null
          start_date?: string
          end_date?: string
          prize_pool?: number | null
          entry_fee?: number | null
          max_teams?: number | null
          min_teams?: number | null
          status?: 'upcoming' | 'ongoing' | 'completed' | 'cancelled'
          tournament_type?: 'Single Elimination' | 'Double Elimination' | 'Round Robin' | 'Round Robin 2 Legs' | 'Complex Tournament'
          logo?: string | null
          banner?: string | null
          format_config?: any | null
          has_multiple_stages?: boolean | null
        }
      }
      tournament_formats: {
        Row: {
          id: number
          name: string
          description: string | null
          is_active: boolean
          created_at?: string
          updated_at?: string
        }
        Insert: {
          id?: number
          name: string
          description?: string | null
          is_active?: boolean
        }
        Update: {
          id?: number
          name?: string
          description?: string | null
          is_active?: boolean
        }
      }
      tournament_stages: {
        Row: {
          id: number
          tournament_id: number
          stage_name: string
          stage_order: number
          format_type: string
          format_config: any | null
          is_active: boolean
          created_at?: string
          updated_at?: string
        }
        Insert: {
          id?: number
          tournament_id: number
          stage_name: string
          stage_order: number
          format_type: string
          format_config?: any | null
          is_active?: boolean
        }
        Update: {
          id?: number
          tournament_id?: number
          stage_name?: string
          stage_order?: number
          format_type?: string
          format_config?: any | null
          is_active?: boolean
        }
      }
      tournament_teams: {
        Row: {
          id: number
          tournament_id: number
          team_id: number
          seed: number | null
          final_position: number | null
          prize_money: number
          created_at?: string
          updated_at?: string
        }
        Insert: {
          id?: number
          tournament_id: number
          team_id: number
          seed?: number | null
          final_position?: number | null
          prize_money?: number
        }
        Update: {
          id?: number
          tournament_id?: number
          team_id?: number
          seed?: number | null
          final_position?: number | null
          prize_money?: number
        }
      }
      matches: {
        Row: {
          id: number
          tournament_id: number
          team1_id: number | null
          team2_id: number | null
          match_date: string
          match_type: 'bo1' | 'bo3' | 'bo5' | 'bo7'
          status: 'scheduled' | 'live' | 'completed' | 'cancelled'
          winner_id: number | null
          team1_score: number
          team2_score: number
          stage: string
          round_number: number
          match_number: number
          venue: string | null
          stream_url: string | null
          created_at?: string
          updated_at?: string
        }
        Insert: {
          id?: number
          tournament_id: number
          team1_id?: number | null
          team2_id?: number | null
          match_date: string
          match_type?: 'bo1' | 'bo3' | 'bo5' | 'bo7'
          status?: 'scheduled' | 'live' | 'completed' | 'cancelled'
          winner_id?: number | null
          team1_score?: number
          team2_score?: number
          stage?: string
          round_number?: number
          match_number?: number
          venue?: string | null
          stream_url?: string | null
        }
        Update: {
          id?: number
          tournament_id?: number
          team1_id?: number | null
          team2_id?: number | null
          match_date?: string
          match_type?: 'bo1' | 'bo3' | 'bo5' | 'bo7'
          status?: 'scheduled' | 'live' | 'completed' | 'cancelled'
          winner_id?: number | null
          team1_score?: number
          team2_score?: number
          stage?: string
          round_number?: number
          match_number?: number
          venue?: string | null
          stream_url?: string | null
        }
      }
      games: {
        Row: {
          id: number
          match_id: number
          game_number: number
          team1_score: number
          team2_score: number
          winner_id: number | null
          duration: number
          patch_version: string | null
          game_date: string
          created_at?: string
          updated_at?: string
        }
        Insert: {
          id?: number
          match_id: number
          game_number: number
          team1_score?: number
          team2_score?: number
          winner_id?: number | null
          duration?: number
          patch_version?: string | null
          game_date: string
        }
        Update: {
          id?: number
          match_id?: number
          game_number?: number
          team1_score?: number
          team2_score?: number
          winner_id?: number | null
          duration?: number
          patch_version?: string | null
          game_date?: string
        }
      }
      player_performances: {
        Row: {
          id: number
          game_id: number
          player_id: number
          team_id: number
          hero_id: number
          kills: number
          deaths: number
          assists: number
          kda: number
          gold: number
          damage_dealt: number
          damage_taken: number
          turret_damage: number
          objective_damage: number
          healing: number
          mvp: boolean
          created_at?: string
          updated_at?: string
        }
        Insert: {
          id?: number
          game_id: number
          player_id: number
          team_id: number
          hero_id: number
          kills?: number
          deaths?: number
          assists?: number
          kda?: number
          gold?: number
          damage_dealt?: number
          damage_taken?: number
          turret_damage?: number
          objective_damage?: number
          healing?: number
          mvp?: boolean
        }
        Update: {
          id?: number
          game_id?: number
          player_id?: number
          team_id?: number
          hero_id?: number
          kills?: number
          deaths?: number
          assists?: number
          kda?: number
          gold?: number
          damage_dealt?: number
          damage_taken?: number
          turret_damage?: number
          objective_damage?: number
          healing?: number
          mvp?: boolean
        }
      }
      tournament_brackets: {
        Row: {
          id: number
          tournament_id: number
          bracket_name: string
          bracket_type: string
          round_number: number
          match_number: number
          team1_id: number | null
          team2_id: number | null
          winner_id: number | null
          created_at?: string
          updated_at?: string
        }
        Insert: {
          id?: number
          tournament_id: number
          bracket_name: string
          bracket_type?: string
          round_number: number
          match_number: number
          team1_id?: number | null
          team2_id?: number | null
          winner_id?: number | null
        }
        Update: {
          id?: number
          tournament_id?: number
          bracket_name?: string
          bracket_type?: string
          round_number?: number
          match_number?: number
          team1_id?: number | null
          team2_id?: number | null
          winner_id?: number | null
        }
      }
      statistics: {
        Row: {
          id: number
          team_id: number | null
          tournament_id: number | null
          match_id: number | null
          stat_type: string
          stat_value: number | null
          stat_date: string
          created_at?: string
          updated_at?: string
        }
        Insert: {
          id?: number
          team_id?: number | null
          tournament_id?: number | null
          match_id?: number | null
          stat_type: string
          stat_value?: number | null
          stat_date: string
        }
        Update: {
          id?: number
          team_id?: number | null
          tournament_id?: number | null
          match_id?: number | null
          stat_type?: string
          stat_value?: number | null
          stat_date?: string
        }
      }
    }
  }
}
