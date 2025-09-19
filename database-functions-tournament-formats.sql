-- Database Functions for Tournament Format Management
-- Run these in your Supabase SQL editor

-- Function to update tournament format and stages
CREATE OR REPLACE FUNCTION update_tournament_format(
  p_tournament_id INTEGER,
  p_format_config JSONB,
  p_stages JSONB
)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  stage_data JSONB;
  stage_record RECORD;
BEGIN
  -- Update tournament with format configuration
  UPDATE tournaments 
  SET 
    format_config = p_format_config,
    has_multiple_stages = CASE WHEN jsonb_array_length(p_stages) > 1 THEN true ELSE false END,
    updated_at = NOW()
  WHERE id = p_tournament_id;
  
  -- Delete existing stages for this tournament
  DELETE FROM tournament_stages WHERE tournament_id = p_tournament_id;
  
  -- Insert new stages
  FOR stage_data IN SELECT * FROM jsonb_array_elements(p_stages)
  LOOP
    INSERT INTO tournament_stages (
      tournament_id,
      stage_name,
      stage_order,
      format_type,
      format_config,
      created_at,
      updated_at
    ) VALUES (
      p_tournament_id,
      stage_data->>'stage_name',
      (stage_data->>'stage_order')::INTEGER,
      stage_data->>'format_type',
      stage_data->'format_config',
      NOW(),
      NOW()
    );
  END LOOP;
  
  -- Log the update
  RAISE NOTICE 'Tournament % format updated with % stages', p_tournament_id, jsonb_array_length(p_stages);
END;
$$;

-- Function to get tournament with stages
CREATE OR REPLACE FUNCTION get_tournament_with_stages(p_tournament_id INTEGER)
RETURNS TABLE(
  tournament_data JSONB,
  stages_data JSONB
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN QUERY
  SELECT 
    to_jsonb(t.*) as tournament_data,
    COALESCE(
      (SELECT jsonb_agg(
        jsonb_build_object(
          'id', ts.id,
          'stage_name', ts.stage_name,
          'stage_order', ts.stage_order,
          'format_type', ts.format_type,
          'format_config', ts.format_config,
          'created_at', ts.created_at,
          'updated_at', ts.updated_at
        ) ORDER BY ts.stage_order
      ) FROM tournament_stages ts WHERE ts.tournament_id = p_tournament_id),
      '[]'::jsonb
    ) as stages_data
  FROM tournaments t
  WHERE t.id = p_tournament_id;
END;
$$;

-- Function to validate tournament format configuration
CREATE OR REPLACE FUNCTION validate_tournament_format(
  p_tournament_id INTEGER,
  p_stages JSONB
)
RETURNS TABLE(
  is_valid BOOLEAN,
  error_message TEXT
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  stage_data JSONB;
  teams_count INTEGER;
  total_teams INTEGER := 0;
BEGIN
  -- Check if tournament exists
  IF NOT EXISTS (SELECT 1 FROM tournaments WHERE id = p_tournament_id) THEN
    RETURN QUERY SELECT false, 'Tournament not found'::TEXT;
    RETURN;
  END IF;
  
  -- Check if stages array is not empty
  IF jsonb_array_length(p_stages) = 0 THEN
    RETURN QUERY SELECT false, 'At least one stage is required'::TEXT;
    RETURN;
  END IF;
  
  -- Validate each stage
  FOR stage_data IN SELECT * FROM jsonb_array_elements(p_stages)
  LOOP
    -- Check required fields
    IF stage_data->>'stage_name' IS NULL OR stage_data->>'stage_name' = '' THEN
      RETURN QUERY SELECT false, 'Stage name is required'::TEXT;
      RETURN;
    END IF;
    
    IF stage_data->>'format_type' IS NULL OR stage_data->>'format_type' = '' THEN
      RETURN QUERY SELECT false, 'Format type is required'::TEXT;
      RETURN;
    END IF;
    
    -- Check teams count
    teams_count := (stage_data->'format_config'->>'teams_count')::INTEGER;
    IF teams_count IS NULL OR teams_count < 2 THEN
      RETURN QUERY SELECT false, 'Valid teams count is required (minimum 2)'::TEXT;
      RETURN;
    END IF;
    
    total_teams := GREATEST(total_teams, teams_count);
  END LOOP;
  
  -- All validations passed
  RETURN QUERY SELECT true, 'Format configuration is valid'::TEXT;
END;
$$;

-- Grant permissions to authenticated users
GRANT EXECUTE ON FUNCTION update_tournament_format(INTEGER, JSONB, JSONB) TO authenticated;
GRANT EXECUTE ON FUNCTION get_tournament_with_stages(INTEGER) TO authenticated;
GRANT EXECUTE ON FUNCTION validate_tournament_format(INTEGER, JSONB) TO authenticated;
