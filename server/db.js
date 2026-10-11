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
    name: 'Maharashtra - Nashik Vineyard Plot A',
    crop_type: 'Grapes',
    location: 'Nashik / Pune (Maharashtra)',
    latitude: 19.9975,
    longitude: 73.7898
  });
  const f2 = memoryStore.insert('fields', {
    name: 'Punjab - Ludhiana Agro-Zone Sector 2',
    crop_type: 'Potato',
    location: 'Ludhiana / Amritsar (Punjab)',
    latitude: 30.9010,
    longitude: 75.8573
  });
  const f3 = memoryStore.insert('fields', {
    name: 'West Bengal - Hooghly Delta Sector 1',
    crop_type: 'Rice',
    location: 'Hooghly / Burdwan (West Bengal)',
    latitude: 22.8963,
    longitude: 88.2461
  });
  const f4 = memoryStore.insert('fields', {
    name: 'Madhya Pradesh - Malwa Plateau Sector 3',
    crop_type: 'Soybean',
    location: 'Indore / Bhopal (Madhya Pradesh)',
    latitude: 22.7196,
    longitude: 75.8577
  });
  const f5 = memoryStore.insert('fields', {
    name: 'Gujarat - Saurashtra Cash Crop Belt',
    crop_type: 'Cotton',
    location: 'Anand / Rajkot (Gujarat)',
    latitude: 22.5645,
    longitude: 72.9289
  });
  const f6 = memoryStore.insert('fields', {
    name: 'Uttar Pradesh - Gangetic Agro Plot',
    crop_type: 'Sugarcane',
    location: 'Lucknow / Varanasi (Uttar Pradesh)',
    latitude: 26.8467,
    longitude: 80.9462
  });
  const f7 = memoryStore.insert('fields', {
    name: 'Haryana - Karnal Basmati Zone',
    crop_type: 'Wheat',
    location: 'Karnal / Hisar (Haryana)',
    latitude: 29.6857,
    longitude: 76.9905
  });
  const f8 = memoryStore.insert('fields', {
    name: 'Karnataka - Belagavi Agro Cluster',
    crop_type: 'Maize',
    location: 'Belagavi / Dharwad (Karnataka)',
    latitude: 15.8497,
    longitude: 74.4977
  });

  // Diagnostics
  const d1 = memoryStore.insert('diagnostics', {
    field_id: f1.id,
    image_url: '/samples/grape_powdery_mildew.jpg',
    detected_disease: 'Powdery Mildew (Erysiphe necator)',
    diagnostic_confidence: 94.8,
    symptom_summary: 'White powdery patches on adaxial leaf surface with upward curling. High sporulation risk across Nashik viticulture belt.'
  });
  const d2 = memoryStore.insert('diagnostics', {
    field_id: f2.id,
    image_url: '/samples/tomato_late_blight.jpg',
    detected_disease: 'Late Blight (Phytophthora infestans)',
    diagnostic_confidence: 96.2,
    symptom_summary: 'Water-soaked irregular dark olive-brown lesions on foliar margins under dense Punjab fog and cold morning dew.'
  });
  const d3 = memoryStore.insert('diagnostics', {
    field_id: f3.id,
    image_url: '/samples/potato_early_blight.jpg',
    detected_disease: 'Rice Sheath Blight (Rhizoctonia solani)',
    diagnostic_confidence: 91.5,
    symptom_summary: 'Oval to elliptical greenish-gray lesions on leaf sheaths triggered by hyper-humid Gangetic delta micro-climate.'
  });

  // Micro-climates (>85% RH triggers for fungal spore warnings)
  memoryStore.insert('micro_climates', {
    field_id: f1.id,
    temperature: 23.5,
    relative_humidity: 89.0,
    leaf_wetness_hours: 8.0,
    wind_speed: 4.8
  });
  memoryStore.insert('micro_climates', {
    field_id: f2.id,
    temperature: 18.2,
    relative_humidity: 94.5,
    leaf_wetness_hours: 9.5,
    wind_speed: 3.5
  });
  memoryStore.insert('micro_climates', {
    field_id: f3.id,
    temperature: 25.0,
    relative_humidity: 96.0,
    leaf_wetness_hours: 10.0,
    wind_speed: 3.8
  });
  memoryStore.insert('micro_climates', {
    field_id: f4.id,
    temperature: 26.5,
    relative_humidity: 86.0,
    leaf_wetness_hours: 6.5,
    wind_speed: 6.0
  });
  memoryStore.insert('micro_climates', {
    field_id: f5.id,
    temperature: 28.5,
    relative_humidity: 85.5,
    leaf_wetness_hours: 5.5,
    wind_speed: 7.2
  });

  // Advisories
  memoryStore.insert('advisories', {
    diagnostic_id: d1.id,
    risk_score: 84.5,
    risk_level: 'High',
    intervention_viability: 'Immediate Targeted Treatment Window',
    treatment_recommendation: 'Rotate DMI fungicide (Myclobutanil) or sulfur-based suspension for Nashik vineyards. Ensure canopy airflow.',
    optimal_spray_window: 'Next 12 to 24 hours before next humidity escalation (06:00 - 09:30 local time)'
  });
  memoryStore.insert('advisories', {
    diagnostic_id: d2.id,
    risk_score: 93.0,
    risk_level: 'High',
    intervention_viability: 'Urgent Critical Intervention Required',
    treatment_recommendation: 'Deploy systemic translaminar Mandipropamid + Mancozeb protective tank mix. Severe Late Blight risk in Ludhiana/Amritsar fog corridor.',
    optimal_spray_window: 'Immediate action within next 12 hours under low wind velocity'
  });
  memoryStore.insert('advisories', {
    diagnostic_id: d3.id,
    risk_score: 78.0,
    risk_level: 'High',
    intervention_viability: 'Targeted Sheath Blight Application',
    treatment_recommendation: 'Apply Validamycin or Hexaconazole 5% SC. Drain excess stagnant water from paddy basins in Hooghly delta.',
    optimal_spray_window: 'Within next 24 to 36 hours during morning dry-down interval'
  });
}

export default { query, initDatabase, memoryStore };
