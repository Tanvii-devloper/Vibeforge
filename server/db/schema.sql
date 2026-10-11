-- Production SQL Schema for AI-Powered Agriculture Micro-Climatic Crop Disease Early Warning System

CREATE TABLE IF NOT EXISTS fields (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    crop_type VARCHAR(100) NOT NULL,
    location VARCHAR(255) NOT NULL,
    latitude DECIMAL(10, 6),
    longitude DECIMAL(10, 6),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS diagnostics (
    id SERIAL PRIMARY KEY,
    field_id INT REFERENCES fields(id) ON DELETE CASCADE,
    image_url TEXT NOT NULL,
    detected_disease VARCHAR(255) NOT NULL,
    diagnostic_confidence DECIMAL(5, 2) NOT NULL,
    symptom_summary TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS micro_climates (
    id SERIAL PRIMARY KEY,
    field_id INT REFERENCES fields(id) ON DELETE CASCADE,
    temperature DECIMAL(5, 2) NOT NULL,
    relative_humidity DECIMAL(5, 2) NOT NULL,
    leaf_wetness_hours DECIMAL(5, 2) NOT NULL,
    wind_speed DECIMAL(5, 2) NOT NULL,
    recorded_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS advisories (
    id SERIAL PRIMARY KEY,
    diagnostic_id INT REFERENCES diagnostics(id) ON DELETE CASCADE,
    risk_score DECIMAL(5, 2) NOT NULL,
    risk_level VARCHAR(50) NOT NULL,
    intervention_viability VARCHAR(100) NOT NULL,
    treatment_recommendation TEXT NOT NULL,
    optimal_spray_window VARCHAR(255) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
