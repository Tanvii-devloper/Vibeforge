import pg from 'pg';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const { Pool } = pg;

// In-memory fallback storage if PostgreSQL is not running locally
class FallbackStore {
  constructor() {
    this.tables = {
      fields: [],
      diagnostics: [],
      micro_climates: [],
      advisories: []
    };
    this.autoIncrement = {
      fields: 1,
      diagnostics: 1,
      micro_climates: 1,
      advisories: 1
    };
    this.isFallback = true;
  }

  insert(table, data) {
    const id = this.autoIncrement[table]++;
    const record = { id, created_at: new Date().toISOString(), recorded_at: new Date().toISOString(), ...data };
    this.tables[table].push(record);
    return record;
  }

  findById(table, id) {
    return this.tables[table].find(r => r.id === parseInt(id, 10));
  }

  delete(table, id) {
    const numId = parseInt(id, 10);
    const initialLen = this.tables[table].length;
    this.tables[table] = this.tables[table].filter(r => r.id !== numId);
    return initialLen > this.tables[table].length;
  }
}

export const memoryStore = new FallbackStore();

let pool = null;
let useFallback = false;

if (process.env.DATABASE_URL && process.env.DATABASE_URL.trim() !== '') {
  try {
    pool = new Pool({
      connectionString: process.env.DATABASE_URL,
      ssl: process.env.DATABASE_URL.includes('localhost') ? false : { rejectUnauthorized: false }
    });

    pool.on('error', (err) => {
      console.warn('Postgres connection pool warning:', err.message);
    });
  } catch (err) {
    console.warn('Failed to initialize PG pool, using fallback store:', err.message);
    useFallback = true;
  }
} else {
  console.log('No DATABASE_URL configured. Initializing in-memory resilient storage for seamless execution.');
  useFallback = true;
}

export async function initDatabase() {
  if (!useFallback && pool) {
    try {
      const client = await pool.connect();
      try {
        const schemaPath = path.join(__dirname, 'db', 'schema.sql');
        if (fs.existsSync(schemaPath)) {
          const schemaSql = fs.readFileSync(schemaPath, 'utf8');
          await client.query(schemaSql);
          console.log('PostgreSQL schema verified and synchronized successfully.');
        }
      } finally {
        client.release();
      }
      return true;
    } catch (err) {
      console.warn('PostgreSQL connection failed during init. Falling back to internal engine:', err.message);
      useFallback = true;
    }
  }

  // Populate initial seed data in fallback store if empty
  if (memoryStore.tables.fields.length === 0) {
    seedFallbackStore();
  }
  return true;
}

export async function query(text, params = []) {
  if (!useFallback && pool) {
    try {
      return await pool.query(text, params);
    } catch (err) {
      console.warn('PostgreSQL query error, attempting fallback recovery:', err.message);
    }
  }

  // Simulate SQL query responses for fallback mode
  return simulateQuery(text, params);
}

function simulateQuery(text, params) {
  const normalized = text.trim().toLowerCase();

  // Handle INSERT INTO fields
  if (normalized.startsWith('insert into fields')) {
    const [name, crop_type, location, latitude, longitude] = params;
    const inserted = memoryStore.insert('fields', {
      name,
      crop_type,
      location,
      latitude: latitude ? parseFloat(latitude) : null,
      longitude: longitude ? parseFloat(longitude) : null
    });
    return { rows: [inserted], rowCount: 1 };
  }

  // Handle INSERT INTO diagnostics
  if (normalized.startsWith('insert into diagnostics')) {
    const [field_id, image_url, detected_disease, diagnostic_confidence, symptom_summary] = params;
    const inserted = memoryStore.insert('diagnostics', {
      field_id: parseInt(field_id, 10),
      image_url,
      detected_disease,
      diagnostic_confidence: parseFloat(diagnostic_confidence),
      symptom_summary
    });
    return { rows: [inserted], rowCount: 1 };
  }

  // Handle INSERT INTO micro_climates
  if (normalized.startsWith('insert into micro_climates')) {
    const [field_id, temperature, relative_humidity, leaf_wetness_hours, wind_speed] = params;
    const inserted = memoryStore.insert('micro_climates', {
      field_id: parseInt(field_id, 10),
      temperature: parseFloat(temperature),
      relative_humidity: parseFloat(relative_humidity),
      leaf_wetness_hours: parseFloat(leaf_wetness_hours),
      wind_speed: parseFloat(wind_speed)
    });
    return { rows: [inserted], rowCount: 1 };
  }

  // Handle INSERT INTO advisories
  if (normalized.startsWith('insert into advisories')) {
    const [diagnostic_id, risk_score, risk_level, intervention_viability, treatment_recommendation, optimal_spray_window] = params;
    const inserted = memoryStore.insert('advisories', {
      diagnostic_id: parseInt(diagnostic_id, 10),
      risk_score: parseFloat(risk_score),
      risk_level,
      intervention_viability,
      treatment_recommendation,
      optimal_spray_window
    });
    return { rows: [inserted], rowCount: 1 };
  }

  // Handle SELECT from fields with latest diagnostic
  if (normalized.includes('from fields')) {
    if (normalized.includes('where id =')) {
      const field = memoryStore.findById('fields', params[0]);
      return { rows: field ? [field] : [], rowCount: field ? 1 : 0 };
    }
    const fieldsWithStatus = memoryStore.tables.fields.map(f => {
      const latestDiag = [...memoryStore.tables.diagnostics]
        .filter(d => d.field_id === f.id)
        .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))[0];

      const latestAdvisory = latestDiag
        ? memoryStore.tables.advisories.find(a => a.diagnostic_id === latestDiag.id)
        : null;

      const latestWeather = [...memoryStore.tables.micro_climates]
        .filter(m => m.field_id === f.id)
        .sort((a, b) => new Date(b.recorded_at) - new Date(a.recorded_at))[0];

      return {
        ...f,
        latest_disease: latestDiag ? latestDiag.detected_disease : 'Healthy / Untested',
        diagnostic_confidence: latestDiag ? latestDiag.diagnostic_confidence : null,
        risk_level: latestAdvisory ? latestAdvisory.risk_level : 'Low',
        risk_score: latestAdvisory ? latestAdvisory.risk_score : 12.0,
        temperature: latestWeather ? latestWeather.temperature : 22.5,
        relative_humidity: latestWeather ? latestWeather.relative_humidity : 65.0,
        leaf_wetness_hours: latestWeather ? latestWeather.leaf_wetness_hours : 2.0
      };
    });
    return { rows: fieldsWithStatus, rowCount: fieldsWithStatus.length };
  }

  // Handle SELECT from advisories joined with diagnostics and fields
  if (normalized.includes('from advisories') || normalized.includes('from diagnostics')) {
    if (params.length > 0) {
      const advId = parseInt(params[0], 10);
      const adv = memoryStore.findById('advisories', advId) || memoryStore.tables.advisories[0];
      if (adv) {
        const diag = memoryStore.findById('diagnostics', adv.diagnostic_id) || {};
        const field = memoryStore.findById('fields', diag.field_id) || {};
        const weather = [...memoryStore.tables.micro_climates]
          .filter(m => m.field_id === diag.field_id)
          .sort((a, b) => new Date(b.recorded_at) - new Date(a.recorded_at))[0] || {
            temperature: 21.5,
            relative_humidity: 88.0,
            leaf_wetness_hours: 8.5,
            wind_speed: 6.2
          };

        return {
          rows: [{
            ...adv,
            field_id: field.id,
            field_name: field.name,
            crop_type: field.crop_type,
            location: field.location,
            latitude: field.latitude,
            longitude: field.longitude,
            image_url: diag.image_url,
            detected_disease: diag.detected_disease,
            diagnostic_confidence: diag.diagnostic_confidence,
            symptom_summary: diag.symptom_summary,
            temperature: weather.temperature,
            relative_humidity: weather.relative_humidity,
            leaf_wetness_hours: weather.leaf_wetness_hours,
            wind_speed: weather.wind_speed,
            weather_recorded_at: weather.recorded_at
          }],
          rowCount: 1
        };
      }
    }
    return { rows: memoryStore.tables.advisories, rowCount: memoryStore.tables.advisories.length };
  }

  // Handle DELETE FROM fields
  if (normalized.startsWith('delete from fields')) {
    const deleted = memoryStore.delete('fields', params[0]);
    return { rows: [], rowCount: deleted ? 1 : 0 };
  }

  return { rows: [], rowCount: 0 };
}

function seedFallbackStore() {
  const f1 = memoryStore.insert('fields', {
    name: 'North Valley Tomato Plot A',
    crop_type: 'Tomato',
    location: 'Salinas Valley, Sector 12',
    latitude: 36.6777,
    longitude: -121.6555
  });
  const f2 = memoryStore.insert('fields', {
    name: 'East Ridge Potato Sector 4',
    crop_type: 'Potato',
    location: 'Columbia Basin, Plot B',
    latitude: 46.2234,
    longitude: -119.1235
  });
  const f3 = memoryStore.insert('fields', {
    name: 'Sunburst Wheat Field 2',
    crop_type: 'Wheat',
    location: 'Walla Walla Flats',
    latitude: 46.0646,
    longitude: -118.3430
  });
  const f4 = memoryStore.insert('fields', {
    name: 'Valley Crest Grape Vineyard',
    crop_type: 'Grapes',
    location: 'Napa Valley Hillside',
    latitude: 38.2975,
    longitude: -122.2869
  });

  // Diagnostics
  const d1 = memoryStore.insert('diagnostics', {
    field_id: f1.id,
    image_url: '/samples/tomato_late_blight.jpg',
    detected_disease: 'Late Blight (Phytophthora infestans)',
    diagnostic_confidence: 94.5,
    symptom_summary: 'Water-soaked irregular dark olive-brown lesions with pale chlorotic borders visible on leaf margins. High risk of rapid secondary zoospore sporulation.'
  });
  const d2 = memoryStore.insert('diagnostics', {
    field_id: f2.id,
    image_url: '/samples/potato_early_blight.jpg',
    detected_disease: 'Early Blight (Alternaria solani)',
    diagnostic_confidence: 88.0,
    symptom_summary: 'Concentric ring target-like lesions on lower mature foliage with yellow halo. Moderate spore density.'
  });
  const d3 = memoryStore.insert('diagnostics', {
    field_id: f4.id,
    image_url: '/samples/grape_powdery_mildew.jpg',
    detected_disease: 'Powdery Mildew (Erysiphe necator)',
    diagnostic_confidence: 91.2,
    symptom_summary: 'White talcum-powder like mycelial patches on adaxial leaf surface, curling upward along leaf edges.'
  });

  // Micro-climates
  memoryStore.insert('micro_climates', {
    field_id: f1.id,
    temperature: 18.5,
    relative_humidity: 92.0,
    leaf_wetness_hours: 9.5,
    wind_speed: 5.4
  });
  memoryStore.insert('micro_climates', {
    field_id: f2.id,
    temperature: 24.0,
    relative_humidity: 68.0,
    leaf_wetness_hours: 3.5,
    wind_speed: 8.2
  });
  memoryStore.insert('micro_climates', {
    field_id: f4.id,
    temperature: 23.5,
    relative_humidity: 86.5,
    leaf_wetness_hours: 7.0,
    wind_speed: 4.8
  });

  // Advisories
  memoryStore.insert('advisories', {
    diagnostic_id: d1.id,
    risk_score: 87.5,
    risk_level: 'High',
    intervention_viability: 'Immediate Targeted Systemic Treatment',
    treatment_recommendation: 'Apply systemic fungicide Mandipropamid (Revus) or Cyazofamid combined with protective Mancozeb. Ensure complete coverage on canopy underside. Pre-harvest interval (PHI): 14 days.',
    optimal_spray_window: 'Next 12 to 24 hours before next precipitation event (06:00 - 10:00 local time under low wind)'
  });
  memoryStore.insert('advisories', {
    diagnostic_id: d2.id,
    risk_score: 48.0,
    risk_level: 'Moderate',
    intervention_viability: 'Preventive Bio-Fungicide Application',
    treatment_recommendation: 'Apply Bacillus amyloliquefaciens (Serenade ASO) or copper hydroxide protective formulation. Re-evaluate leaf wetness trajectory in 48 hours.',
    optimal_spray_window: 'Within next 48 hours during morning dry-down window (07:30 - 11:00)'
  });
  memoryStore.insert('advisories', {
    diagnostic_id: d3.id,
    risk_score: 72.0,
    risk_level: 'High',
    intervention_viability: 'Immediate Targeted Treatment',
    treatment_recommendation: 'Rotate DMI fungicide (Myclobutanil) or sulfur-based suspension. Ensure vine canopy aeration through leaf pulling.',
    optimal_spray_window: 'Apply within 24 hours under wind speed < 8 km/h'
  });
}

export default { query, initDatabase, memoryStore };
