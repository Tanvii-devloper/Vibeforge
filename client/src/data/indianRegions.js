/**
 * Major Agricultural Regions, States, and Farming Hubs across India
 * Real-world regional crop mapping and hyper-local micro-climatic simulation engine
 */

export const INDIAN_AGRICULTURAL_REGIONS = [
  {
    id: 'maharashtra',
    state: 'Maharashtra',
    hub: 'Nashik / Pune',
    label: 'Maharashtra (Nashik / Pune)',
    subtext: 'Key for Grapes, Onions, Tomatoes, Potatoes',
    badge: 'Viticulture & Horticulture Capital',
    crops: ['Grapes', 'Onions', 'Tomatoes', 'Potatoes'],
    defaultCrop: 'Grapes',
    coordinates: { lat: 19.9975, lng: 73.7898 },
    simulatedClimate: {
      temperature: 23.5,
      relativeHumidity: 89.0, // >85% critical fungal spore trigger
      leafWetnessHours: 8.0,
      windSpeed: 4.8
    },
    primaryPathogens: ['Grape Powdery & Downy Mildew', 'Tomato Late Blight', 'Onion Purple Blotch'],
    riskVector: 'Critical Spore Vector (Vineyard Mildew / Late Blight)',
    riskLevel: 'High'
  },
  {
    id: 'punjab',
    state: 'Punjab',
    hub: 'Ludhiana / Amritsar',
    label: 'Punjab (Ludhiana / Amritsar)',
    subtext: 'Key for Wheat, Rice, Potatoes / Late Blight risk',
    badge: 'Granary of India & Fog Corridor',
    crops: ['Wheat', 'Rice', 'Potatoes'],
    defaultCrop: 'Potatoes',
    coordinates: { lat: 30.9010, lng: 75.8573 },
    simulatedClimate: {
      temperature: 18.2,
      relativeHumidity: 94.5, // >85% dense winter canopy humidity
      leafWetnessHours: 9.5,
      windSpeed: 3.5
    },
    primaryPathogens: ['Potato Late Blight (Phytophthora)', 'Wheat Stripe / Yellow Rust', 'Rice Blast'],
    riskVector: 'Severe Late Blight & Fog Dew Sporulation',
    riskLevel: 'Critical'
  },
  {
    id: 'uttar-pradesh',
    state: 'Uttar Pradesh',
    hub: 'Lucknow / Varanasi',
    label: 'Uttar Pradesh (Lucknow / Varanasi)',
    subtext: 'Key for Sugarcane, Wheat, Potatoes',
    badge: 'Gangetic Plains Agro-Zone',
    crops: ['Sugarcane', 'Wheat', 'Potatoes'],
    defaultCrop: 'Sugarcane',
    coordinates: { lat: 26.8467, lng: 80.9462 },
    simulatedClimate: {
      temperature: 21.0,
      relativeHumidity: 88.5, // >85% trigger
      leafWetnessHours: 7.8,
      windSpeed: 4.2
    },
    primaryPathogens: ['Sugarcane Red Rot (Colletotrichum)', 'Potato Late Blight', 'Wheat Foliar Rust'],
    riskVector: 'High Foliar Fungal Inoculum',
    riskLevel: 'High'
  },
  {
    id: 'madhya-pradesh',
    state: 'Madhya Pradesh',
    hub: 'Indore / Bhopal',
    label: 'Madhya Pradesh (Indore / Bhopal)',
    subtext: 'Key for Soybean, Wheat',
    badge: 'Malwa Plateau Black Soil Belt',
    crops: ['Soybean', 'Wheat', 'Gram'],
    defaultCrop: 'Soybean',
    coordinates: { lat: 22.7196, lng: 75.8577 },
    simulatedClimate: {
      temperature: 26.5,
      relativeHumidity: 86.0, // >85% trigger
      leafWetnessHours: 6.5,
      windSpeed: 6.0
    },
    primaryPathogens: ['Soybean Rust (Phakopsora)', 'Anthracnose Pod Blight', 'Collar Rot'],
    riskVector: 'Legume Canopy Fungal Vector',
    riskLevel: 'Moderate'
  },
  {
    id: 'haryana',
    state: 'Haryana',
    hub: 'Karnal / Hisar',
    label: 'Haryana (Karnal / Hisar)',
    subtext: 'Key for Wheat, Paddy',
    badge: 'Basmati & Wheat Research Hub',
    crops: ['Wheat', 'Paddy', 'Mustard'],
    defaultCrop: 'Wheat',
    coordinates: { lat: 29.6857, lng: 76.9905 },
    simulatedClimate: {
      temperature: 19.5,
      relativeHumidity: 91.0, // >85% trigger
      leafWetnessHours: 8.5,
      windSpeed: 4.5
    },
    primaryPathogens: ['Karnal Bunt (Tilletia indica)', 'Stripe Rust (Puccinia striiformis)', 'Paddy Blast'],
    riskVector: 'Cool Humid Wheat Rust Vector',
    riskLevel: 'High'
  },
  {
    id: 'west-bengal',
    state: 'West Bengal',
    hub: 'Hooghly / Burdwan',
    label: 'West Bengal (Hooghly / Burdwan)',
    subtext: 'Key for Rice, Potatoes / High Humidity',
    badge: 'Gangetic Alluvial Delta',
    crops: ['Rice', 'Potatoes', 'Jute'],
    defaultCrop: 'Rice',
    coordinates: { lat: 22.8963, lng: 88.2461 },
    simulatedClimate: {
      temperature: 25.0,
      relativeHumidity: 96.0, // Extreme humidity delta
      leafWetnessHours: 10.0,
      windSpeed: 3.8
    },
    primaryPathogens: ['Rice Sheath Blight (Rhizoctonia)', 'Bacterial Leaf Blight (Xanthomonas)', 'Potato Late Blight'],
    riskVector: 'Hyper-Humid Delta Sporulation Surge',
    riskLevel: 'Critical'
  },
  {
    id: 'gujarat',
    state: 'Gujarat',
    hub: 'Anand / Rajkot',
    label: 'Gujarat (Anand / Rajkot)',
    subtext: 'Key for Cotton, Groundnuts / Pink Bollworm risk',
    badge: 'Saurashtra Cash Crop Belt',
    crops: ['Cotton', 'Groundnuts', 'Cumin'],
    defaultCrop: 'Cotton',
    coordinates: { lat: 22.5645, lng: 72.9289 },
    simulatedClimate: {
      temperature: 28.5,
      relativeHumidity: 85.5, // >85% trigger
      leafWetnessHours: 5.5,
      windSpeed: 7.2
    },
    primaryPathogens: ['Cotton Alternaria Leaf Blight', 'Bacterial Blight', 'Groundnut Tikka Leaf Spot'],
    riskVector: 'Bollworm & Alternaria Sporulation',
    riskLevel: 'High'
  },
  {
    id: 'karnataka',
    state: 'Karnataka',
    hub: 'Belagavi / Dharwad',
    label: 'Karnataka (Belagavi / Dharwad)',
    subtext: 'Key for Maize, Sugarcane, Paddy',
    badge: 'Northern Karnataka Agro-Hub',
    crops: ['Maize', 'Sugarcane', 'Paddy', 'Cotton'],
    defaultCrop: 'Maize',
    coordinates: { lat: 15.8497, lng: 74.4977 },
    simulatedClimate: {
      temperature: 24.0,
      relativeHumidity: 87.5, // >85% trigger
      leafWetnessHours: 7.2,
      windSpeed: 5.0
    },
    primaryPathogens: ['Maize Turcicum Leaf Blight', 'Sugarcane Smut', 'Paddy Blast'],
    riskVector: 'High Foliar Humidity Vector',
    riskLevel: 'High'
  }
];

export function getRegionById(id) {
  return INDIAN_AGRICULTURAL_REGIONS.find(r => r.id === id) || INDIAN_AGRICULTURAL_REGIONS[0];
}

export function simulateMicroClimate(regionId, options = {}) {
  const region = getRegionById(regionId);
  const base = region.simulatedClimate;
  
  // Optional slight micro-variance (+/- 0.3°C, +/- 1% RH) if dynamic simulation is toggled
  const tempVariance = options.variance ? Number((Math.random() * 0.6 - 0.3).toFixed(1)) : 0;
  const rhVariance = options.variance ? Number((Math.random() * 1.6 - 0.8).toFixed(1)) : 0;
  
  return {
    temperature: Number((base.temperature + tempVariance).toFixed(1)),
    relativeHumidity: Math.min(99.0, Number((base.relativeHumidity + rhVariance).toFixed(1))),
    leafWetnessHours: base.leafWetnessHours,
    windSpeed: base.windSpeed,
    regionLabel: region.label,
    state: region.state,
    hub: region.hub,
    badge: region.badge,
    riskVector: region.riskVector,
    primaryPathogens: region.primaryPathogens
  };
}
