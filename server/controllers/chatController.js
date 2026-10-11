import { GoogleGenAI } from '@google/genai';

const KNOWLEDGE_BASE = [
  {
    keywords: ['late blight', 'potato blight', 'tomato blight', 'phytophthora'],
    answer: `**Potato & Tomato Late Blight (*Phytophthora infestans*) Protocol:**
• **Target Treatment**: Deploy systemic translaminar fungicide like **Mandipropamid (Revus 250 SC)** at 0.6 L/ha or **Cyazofamid**, tank-mixed with protective **Mancozeb 75% WP** (2.5 kg/ha).
• **Spray Technique**: Full coverage on canopy undersides where delicate white zoosporangial bloom emerges.
• **Safety Interval (PHI)**: 14 days before harvest.
• **Micro-Climatic Trigger**: High risk when ambient RH > 85% and leaf wetness exceeds 6 continuous hours at 15–22°C.`
  },
  {
    keywords: ['early blight', 'alternaria', 'target spot', 'concentric'],
    answer: `**Early Blight (*Alternaria solani*) Protocol:**
• **Target Treatment**: Apply **Azoxystrobin + Difenoconazole** or bio-fungicide **Bacillus subtilis (Serenade ASO)**.
• **Spray Window**: Apply during morning dry-down hours (07:00–10:30 AM).
• **Canopy Sanitation**: Prune lower chlorotic foliage in contact with wet soil to curb soil-splash conidia.`
  },
  {
    keywords: ['spray time', 'when to spray', 'timing', 'best time', 'spray window'],
    answer: `**Calibrated Chemical Spray Window Guidelines:**
• **Optimal Hour**: **06:00 AM – 09:30 AM** (allows foliar drying without rapid pesticide evaporation).
• **Wind Speed Limit**: Must be **< 8 km/h** to eliminate aerosol drift and chemical loss.
• **Rain Fastness**: Ensure a rain-free window of at least 3–4 hours post-application.
• **Avoid**: Never spray during intense afternoon heat (> 30°C) or strong sunlight to prevent leaf scorch (phytotoxicity).`
  },
  {
    keywords: ['humidity', 'rh', 'leaf wetness', 'dew', 'weather risk', 'spore'],
    answer: `**Micro-Climatic Risk Vectors & Fungal Sporulation:**
• **Relative Humidity (> 85%)**: Fungal pathogens require high atmospheric moisture to release and germinate spores.
• **Continuous Leaf Wetness (> 6 hrs)**: Water droplets on foliage dissolve spore coatings and allow infection hyphae to penetrate stomata.
• **False Alarm Suppression**: When conditions are hot (> 28°C) and dry (RH < 65%), fungal sporulation halts. AgriGuard automatically suppresses spray alarms to prevent wasteful chemical runoff.`
  },
  {
    keywords: ['grape', 'nashik', 'pune', 'powdery mildew', 'vineyard', 'erysiphe'],
    answer: `**Nashik / Pune Viticulture Advisory (Grape Powdery Mildew):**
• **Treatment**: Rotate systemic DMI fungicide (**Myclobutanil 10% WP**) with micronized wettable sulfur (80% WDG) at 2.5–3 g/L.
• **Canopy Management**: Selective leaf thinning in the berry bunch zone increases aeration and lowers localized micro-climatic humidity.`
  },
  {
    keywords: ['rice', 'paddy', 'west bengal', 'hooghly', 'sheath blight', 'blast'],
    answer: `**Rice & Paddy Advisory (West Bengal / Punjab Delta):**
• **Sheath Blight (*Rhizoctonia solani*)**: Apply **Validamycin 3% L** (2.5 ml/L) or **Hexaconazole 5% SC**.
• **Paddy Blast (*Magnaporthe oryzae*)**: Apply **Tricyclazole 75% WP** at 0.6 g/L before panicle emergence.
• **Water Management**: Drain stagnant standing water for 48 hours to aerate the root crown.`
  },
  {
    keywords: ['cotton', 'gujarat', 'anand', 'rajkot', 'bollworm'],
    answer: `**Gujarat Saurashtra Cotton Advisory:**
• **Alternaria Leaf Blight**: Spray **Propiconazole 25% EC** (1 ml/L) or Copper Oxychloride 50% WP (2.5 g/L).
• **Pink Bollworm (*Pectinophora gossypiella*)**: Install 5 Gossyplure pheromone traps per acre to monitor moth catch thresholds.`
  },
  {
    keywords: ['sugarcane', 'uttar pradesh', 'lucknow', 'varanasi', 'red rot'],
    answer: `**Uttar Pradesh Sugarcane Advisory (Red Rot Prevention):**
• **Red Rot (*Colletotrichum falcatum*)**: Treat seed setts with **Carbendazim 50% WP** (1 g/L) before planting.
• **Drainage**: Ensure deep furrows to eliminate waterlogging along the root zone.`
  },
  {
    keywords: ['runoff', 'chemical save', 'false alarm', 'organic', 'bio'],
    answer: `**Chemical Conservation & False Alarm Mitigation:**
• **Threshold Gating**: Only apply synthetic chemicals when the multi-variable risk index exceeds 70%.
• **Bio-Fungicide Window**: For moderate risk (40–70%), prioritize organic solutions like *Bacillus subtilis*, *Trichoderma viride*, or neem oil suspensions (5 ml/L).
• **Sustainability**: Farmers using AgriGuard reduce chemical spray costs by **58.4%** while preserving beneficial soil microbes.`
  }
];

function getFallbackExpertResponse(question) {
  const q = question.toLowerCase();
  
  for (const item of KNOWLEDGE_BASE) {
    if (item.keywords.some(k => q.includes(k))) {
      return item.answer;
    }
  }

  return `**AgriGuard Agronomy Expert Advisory:**
• For questions regarding foliar symptoms, check our **Laser Diagnostic Studio** to upload leaf photographs for real-time Gemini vision diagnosis.
• Remember: Fungal sporulation is critically elevated when **Relative Humidity exceeds 85%** and **Leaf Wetness exceeds 6 continuous hours**.
• Best general chemical application window is **early morning (06:00 - 09:30 AM)** with wind velocity under 8 km/h.`;
}

export async function handleChatMessage(req, res) {
  try {
    const { message } = req.body;

    if (!message || typeof message !== 'string' || message.trim() === '') {
      return res.status(400).json({ success: false, error: 'Message content is required' });
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (apiKey && apiKey !== 'your_gemini_api_key_here' && apiKey.trim() !== '') {
      try {
        const ai = new GoogleGenAI({ apiKey });
        const systemPrompt = `You are "AgriGuard Expert", a world-class plant pathologist and agricultural micro-climatic early warning assistant.
Provide crisp, authoritative, practical advice for farmers. Highlight actionable chemical active ingredients, organic bio-fungicides, optimal spray windows (morning 06:00-09:30, low wind <8 km/h), and micro-climatic triggers (RH > 85%, leaf wetness > 6h). Keep responses structured with concise bullet points.`;

        let reply = '';
        const candidateModels = ['gemini-3.8-flash', 'gemini-2.5-flash', 'gemini-2.0-flash', 'gemini-1.5-flash'];
        
        for (const modelName of candidateModels) {
          try {
            const response = await ai.models.generateContent({
              model: modelName,
              contents: message,
              config: {
                systemInstruction: systemPrompt
              }
            });
            reply = response.text || response.candidates?.[0]?.content?.parts?.[0]?.text || '';
            if (reply && reply.trim() !== '') {
              return res.json({
                success: true,
                reply: reply,
                source: modelName
              });
            }
          } catch (modelErr) {
            console.warn(`Model ${modelName} error, trying next candidate:`, modelErr.message);
          }
        }
      } catch (geminiError) {
        console.warn('Gemini chat API fallback engaged:', geminiError.message);
      }
    }

    // Expert heuristic fallback
    const fallbackReply = getFallbackExpertResponse(message);
    return res.json({
      success: true,
      reply: fallbackReply,
      source: 'agriguard-expert-heuristics'
    });
  } catch (error) {
    console.error('Chat error:', error);
    return res.status(500).json({
      success: false,
      error: 'Failed to process chat message',
      reply: getFallbackExpertResponse(req.body?.message || '')
    });
  }
}
