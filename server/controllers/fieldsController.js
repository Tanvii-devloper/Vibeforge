import { query } from '../db.js';
import { fieldCreateSchema } from '../schemas/validation.js';

export async function getFields(req, res) {
  try {
    const sql = `
      SELECT 
        f.*,
        d.detected_disease AS latest_disease,
        d.diagnostic_confidence,
        a.risk_level,
        a.risk_score,
        m.temperature,
        m.relative_humidity,
        m.leaf_wetness_hours
      FROM fields f
      LEFT JOIN LATERAL (
        SELECT id, detected_disease, diagnostic_confidence, created_at
        FROM diagnostics
        WHERE field_id = f.id
        ORDER BY created_at DESC
        LIMIT 1
      ) d ON true
      LEFT JOIN LATERAL (
        SELECT risk_level, risk_score
        FROM advisories
        WHERE diagnostic_id = d.id
        ORDER BY created_at DESC
        LIMIT 1
      ) a ON true
      LEFT JOIN LATERAL (
        SELECT temperature, relative_humidity, leaf_wetness_hours
        FROM micro_climates
        WHERE field_id = f.id
        ORDER BY recorded_at DESC
        LIMIT 1
      ) m ON true
      ORDER BY f.id ASC;
    `;
    const result = await query(sql);
    return res.json({
      success: true,
      fields: result.rows
    });
  } catch (error) {
    console.error('Error fetching fields:', error);
    return res.status(500).json({
      success: false,
      error: 'Failed to retrieve field plots',
      message: error.message
    });
  }
}

export async function createField(req, res) {
  try {
    const validation = fieldCreateSchema.safeParse(req.body);
    if (!validation.success) {
      return res.status(400).json({
        success: false,
        error: 'Validation failed',
        details: validation.error.errors
      });
    }

    const { name, cropType, location, latitude, longitude } = validation.data;

    const sql = `
      INSERT INTO fields (name, crop_type, location, latitude, longitude)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING *;
    `;
    const result = await query(sql, [name, cropType, location, latitude, longitude]);
    return res.status(201).json({
      success: true,
      message: 'Field plot registered successfully',
      field: result.rows[0]
    });
  } catch (error) {
    console.error('Error creating field:', error);
    return res.status(500).json({
      success: false,
      error: 'Failed to create field plot',
      message: error.message
    });
  }
}

export async function deleteField(req, res) {
  try {
    const { id } = req.params;
    const sql = 'DELETE FROM fields WHERE id = $1 RETURNING *;';
    const result = await query(sql, [id]);

    if (result.rowCount === 0) {
      return res.status(404).json({
        success: false,
        error: 'Field plot not found'
      });
    }

    return res.json({
      success: true,
      message: 'Field plot deleted successfully',
      id: parseInt(id, 10)
    });
  } catch (error) {
    console.error('Error deleting field:', error);
    return res.status(500).json({
      success: false,
      error: 'Failed to delete field plot',
      message: error.message
    });
  }
}
