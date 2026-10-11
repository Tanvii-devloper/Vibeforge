import { query, initDatabase } from '../db.js';

async function seed() {
  console.log('--- Initializing Database & Seeding Historical Agricultural Records ---');
  await initDatabase();

  try {
    // 1. Insert Fields
    const f1 = await query(`
      INSERT INTO fields (name, crop_type, location, latitude, longitude)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING *;
    `, ['North Valley Tomato Plot A', 'Tomato', 'Salinas Valley, Sector 12', 36.6777, -121.6555]);

    const f2 = await query(`
      INSERT INTO fields (name, crop_type, location, latitude, longitude)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING *;
    `, ['East Ridge Potato Sector 4', 'Potato', 'Columbia Basin, Plot B', 46.2234, -119.1235]);

    const f3 = await query(`
      INSERT INTO fields (name, crop_type, location, latitude, longitude)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING *;
    `, ['Sunburst Wheat Field 2', 'Wheat', 'Walla Walla Flats', 46.0646, -118.3430]);

    const f4 = await query(`
      INSERT INTO fields (name, crop_type, location, latitude, longitude)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING *;
    `, ['Valley Crest Grape Vineyard', 'Grapes', 'Napa Valley Hillside', 38.2975, -122.2869]);

    const field1Id = f1.rows[0]?.id || 1;
    const field2Id = f2.rows[0]?.id || 2;
    const field4Id = f4.rows[0]?.id || 4;

    // 2. Insert Diagnostics
    const d1 = await query(`
      INSERT INTO diagnostics (field_id, image_url, detected_disease, diagnostic_confidence, symptom_summary)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING *;
    `, [
      field1Id,
      '/samples/tomato_late_blight.jpg',
      'Late Blight (Phytophthora infestans)',
      94.5,
      'Water-soaked irregular dark olive-brown lesions with pale chlorotic borders expanding rapidly from margins. High zoospore sporulation pressure.'
    ]);

    const d2 = await query(`
      INSERT INTO diagnostics (field_id, image_url, detected_disease, diagnostic_confidence, symptom_summary)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING *;
    `, [
      field2Id,
      '/samples/potato_early_blight.jpg',
      'Early Blight (Alternaria solani)',
      88.0,
      'Concentric ring target-like lesions on lower mature foliage with yellow halo. Moderate spore density.'
    ]);

    const d3 = await query(`
      INSERT INTO diagnostics (field_id, image_url, detected_disease, diagnostic_confidence, symptom_summary)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING *;
    `, [
      field4Id,
      '/samples/grape_powdery_mildew.jpg',
      'Powdery Mildew (Erysiphe necator)',
      91.2,
      'White talcum-powder like mycelial patches on adaxial leaf surface, curling upward along leaf edges.'
    ]);

    const diag1Id = d1.rows[0]?.id || 1;
    const diag2Id = d2.rows[0]?.id || 2;
    const diag3Id = d3.rows[0]?.id || 3;

    // 3. Insert Micro-climates
    await query(`
      INSERT INTO micro_climates (field_id, temperature, relative_humidity, leaf_wetness_hours, wind_speed)
      VALUES ($1, $2, $3, $4, $5);
    `, [field1Id, 18.5, 92.0, 9.5, 5.4]);

    await query(`
      INSERT INTO micro_climates (field_id, temperature, relative_humidity, leaf_wetness_hours, wind_speed)
      VALUES ($1, $2, $3, $4, $5);
    `, [field2Id, 24.0, 68.0, 3.5, 8.2]);

    await query(`
      INSERT INTO micro_climates (field_id, temperature, relative_humidity, leaf_wetness_hours, wind_speed)
      VALUES ($1, $2, $3, $4, $5);
    `, [field4Id, 23.5, 86.5, 7.0, 4.8]);

    // 4. Insert Advisories
    await query(`
      INSERT INTO advisories (diagnostic_id, risk_score, risk_level, intervention_viability, treatment_recommendation, optimal_spray_window)
      VALUES ($1, $2, $3, $4, $5, $6);
    `, [
      diag1Id,
      87.5,
      'High',
      'Immediate Targeted Systemic Treatment',
      'Apply systemic fungicide Mandipropamid (Revus) or Cyazofamid combined with protective Mancozeb. Ensure complete coverage on canopy underside. Pre-harvest interval (PHI): 14 days.',
      'Next 12 to 24 hours before next precipitation event (06:00 - 10:00 local time under low wind)'
    ]);

    await query(`
      INSERT INTO advisories (diagnostic_id, risk_score, risk_level, intervention_viability, treatment_recommendation, optimal_spray_window)
      VALUES ($1, $2, $3, $4, $5, $6);
    `, [
      diag2Id,
      48.0,
      'Moderate',
      'Preventive Bio-Fungicide Application',
      'Apply Bacillus amyloliquefaciens (Serenade ASO) or copper hydroxide protective formulation. Re-evaluate leaf wetness trajectory in 48 hours.',
      'Within next 48 hours during morning dry-down window (07:30 - 11:00)'
    ]);

    await query(`
      INSERT INTO advisories (diagnostic_id, risk_score, risk_level, intervention_viability, treatment_recommendation, optimal_spray_window)
      VALUES ($1, $2, $3, $4, $5, $6);
    `, [
      diag3Id,
      72.0,
      'High',
      'Immediate Targeted Treatment',
      'Rotate DMI fungicide (Myclobutanil) or sulfur-based suspension. Ensure vine canopy aeration through leaf pulling.',
      'Apply within 24 hours under wind speed < 8 km/h'
    ]);

    console.log('Seeding completed successfully!');
  } catch (err) {
    console.error('Error during seeding:', err);
  }
}

seed();
