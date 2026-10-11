import { query } from '../db.js';
import { simulateEpidemicSpread, generateHourlyRiskProfile } from '../services/riskEngineService.js';

export async function getAdvisoryById(req, res) {
  try {
    const { id } = req.params;

    const sql = `
      SELECT 
        a.id AS advisory_id,
        a.risk_score,
        a.risk_level,
        a.intervention_viability,
        a.treatment_recommendation,
        a.optimal_spray_window,
        a.created_at AS advisory_created_at,
        d.id AS diagnostic_id,
        d.image_url,
        d.detected_disease,
        d.diagnostic_confidence,
        d.symptom_summary,
        d.created_at AS diagnostic_created_at,
        f.id AS field_id,
        f.name AS field_name,
        f.crop_type,
        f.location AS field_location,
        f.latitude,
        f.longitude,
        m.temperature,
        m.relative_humidity,
        m.leaf_wetness_hours,
        m.wind_speed,
        m.recorded_at AS weather_recorded_at
      FROM advisories a
      JOIN diagnostics d ON a.diagnostic_id = d.id
      JOIN fields f ON d.field_id = f.id
      LEFT JOIN LATERAL (
        SELECT temperature, relative_humidity, leaf_wetness_hours, wind_speed, recorded_at
        FROM micro_climates
        WHERE field_id = f.id
        ORDER BY recorded_at DESC
        LIMIT 1
      ) m ON true
      WHERE a.id = $1;
    `;

    const result = await query(sql, [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'Advisory not found'
      });
    }

    const row = result.rows[0];

    const riskScore = parseFloat(row.risk_score) || 75.0;
    const temp = parseFloat(row.temperature) || 20.0;
    const humidity = parseFloat(row.relative_humidity) || 85.0;

    // Generate predictive epidemic spread models (7, 14, 30 days)
    const epidemicSimulation = simulateEpidemicSpread(riskScore);

    // Generate 24-hour diurnal risk curve
    const hourlyRiskProfile = generateHourlyRiskProfile(temp, humidity);

    return res.json({
      success: true,
      advisory: {
        id: row.advisory_id,
        riskScore: parseFloat(row.risk_score),
        riskLevel: row.risk_level,
        interventionViability: row.intervention_viability,
        treatmentRecommendation: row.treatment_recommendation,
        optimalSprayWindow: row.optimal_spray_window,
        createdAt: row.advisory_created_at
      },
      diagnostic: {
        id: row.diagnostic_id,
        imageUrl: row.image_url,
        detectedDisease: row.detected_disease,
        diagnosticConfidence: parseFloat(row.diagnostic_confidence),
        symptomSummary: row.symptom_summary,
        createdAt: row.diagnostic_created_at
      },
      field: {
        id: row.field_id,
        name: row.field_name,
        cropType: row.crop_type,
        location: row.field_location,
        latitude: row.latitude,
        longitude: row.longitude
      },
      microClimate: {
        temperature: parseFloat(row.temperature),
        relativeHumidity: parseFloat(row.relative_humidity),
        leafWetnessHours: parseFloat(row.leaf_wetness_hours),
        windSpeed: parseFloat(row.wind_speed),
        recordedAt: row.weather_recorded_at
      },
      epidemicSimulation,
      hourlyRiskProfile
    });
  } catch (error) {
    console.error('Error fetching advisory:', error);
    return res.status(500).json({
      success: false,
      error: 'Failed to retrieve advisory details',
      message: error.message
    });
  }
}

export async function getAdvisories(req, res) {
  try {
    const sql = `
      SELECT 
        a.id AS advisory_id,
        a.risk_score,
        a.risk_level,
        a.intervention_viability,
        a.treatment_recommendation,
        a.optimal_spray_window,
        a.created_at,
        d.detected_disease,
        d.diagnostic_confidence,
        d.image_url,
        f.name AS field_name,
        f.crop_type,
        f.location
      FROM advisories a
      JOIN diagnostics d ON a.diagnostic_id = d.id
      JOIN fields f ON d.field_id = f.id
      ORDER BY a.created_at DESC;
    `;
    const result = await query(sql);
    return res.json({
      success: true,
      advisories: result.rows
    });
  } catch (error) {
    console.error('Error retrieving advisories list:', error);
    return res.status(500).json({
      success: false,
      error: 'Failed to fetch advisories',
      message: error.message
    });
  }
}
