import fs from 'fs';
import path from 'path';
import { query } from '../db.js';
import { diagnosticRequestSchema } from '../schemas/validation.js';
import { analyzeCropImage } from '../services/geminiService.js';
import { computeMicroClimaticRisk } from '../services/riskEngineService.js';

export async function createDiagnostic(req, res) {
  try {
    // Validate request body with Zod
    const validationResult = diagnosticRequestSchema.safeParse(req.body);
    if (!validationResult.success) {
      return res.status(400).json({
        success: false,
        error: 'Validation failed',
        details: validationResult.error.errors
      });
    }

    const {
      fieldId,
      cropType,
      growthStage,
      temperature,
      relativeHumidity,
      leafWetnessHours,
      windSpeed,
      symptomDescription,
      fieldLocation
    } = validationResult.data;

    let base64Image = '';
    let mimeType = 'image/jpeg';
    let imageUrl = '/samples/tomato_late_blight.jpg';

    if (req.file) {
      const buffer = fs.readFileSync(req.file.path);
      base64Image = buffer.toString('base64');
      mimeType = req.file.mimetype || 'image/jpeg';
      imageUrl = `/uploads/${path.basename(req.file.path)}`;
    } else if (req.body.imageBase64) {
      // Support direct base64 capture from webcam
      const match = req.body.imageBase64.match(/^data:(image\/[a-zA-Z]+);base64,(.+)$/);
      if (match) {
        mimeType = match[1];
        base64Image = match[2];
        const fileName = `capture_${Date.now()}.${mimeType.split('/')[1] || 'jpg'}`;
        const uploadDir = path.join(process.cwd(), 'uploads');
        if (!fs.existsSync(uploadDir)) {
          fs.mkdirSync(uploadDir, { recursive: true });
        }
        const filePath = path.join(uploadDir, fileName);
        fs.writeFileSync(filePath, Buffer.from(base64Image, 'base64'));
        imageUrl = `/uploads/${fileName}`;
      } else {
        base64Image = req.body.imageBase64;
      }
    } else {
      // Use fallback benchmark image
      imageUrl = '/samples/tomato_late_blight.jpg';
      base64Image = ''; // Service fallback engine will engage
    }

    // 1. Invoke Gemini multimodal analysis
    const aiResult = await analyzeCropImage(base64Image, mimeType, cropType, {
      growthStage,
      symptomDescription,
      fieldLocation
    });

    const detectedDisease = aiResult.detectedDisease || 'Unspecified Pathogen';
    const diagnosticConfidence = parseFloat(aiResult.diagnosticConfidence) || 90.0;
    const symptomSummary = aiResult.symptomSummary || 'Foliar lesions observed on canopy.';

    // 2. Persist diagnostic record
    const diagSql = `
      INSERT INTO diagnostics (field_id, image_url, detected_disease, diagnostic_confidence, symptom_summary)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING *;
    `;
    const diagResult = await query(diagSql, [
      fieldId,
      imageUrl,
      detectedDisease,
      diagnosticConfidence,
      symptomSummary
    ]);
    const diagnosticRecord = diagResult.rows[0];

    // 3. Persist micro-climate reading
    const weatherSql = `
      INSERT INTO micro_climates (field_id, temperature, relative_humidity, leaf_wetness_hours, wind_speed)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING *;
    `;
    await query(weatherSql, [
      fieldId,
      temperature,
      relativeHumidity,
      leafWetnessHours,
      windSpeed
    ]);

    // 4. Compute Micro-Climatic Risk Fusion & Calibrated Intervention
    const riskAssessment = computeMicroClimaticRisk({
      detectedDisease,
      diagnosticConfidence,
      temperature,
      relativeHumidity,
      leafWetnessHours,
      windSpeed,
      cropType
    });

    // 5. Persist calibrated advisory
    const advSql = `
      INSERT INTO advisories (diagnostic_id, risk_score, risk_level, intervention_viability, treatment_recommendation, optimal_spray_window)
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING *;
    `;
    const advResult = await query(advSql, [
      diagnosticRecord.id,
      riskAssessment.riskScore,
      riskAssessment.riskLevel,
      riskAssessment.interventionViability,
      riskAssessment.treatmentRecommendation,
      riskAssessment.optimalSprayWindow
    ]);
    const advisoryRecord = advResult.rows[0];

    return res.status(201).json({
      success: true,
      message: 'Diagnostic and advisory evaluated successfully',
      advisoryId: advisoryRecord.id,
      diagnosticId: diagnosticRecord.id,
      detectedDisease,
      diagnosticConfidence,
      riskScore: riskAssessment.riskScore,
      riskLevel: riskAssessment.riskLevel,
      interventionViability: riskAssessment.interventionViability,
      treatmentRecommendation: riskAssessment.treatmentRecommendation,
      optimalSprayWindow: riskAssessment.optimalSprayWindow
    });
  } catch (error) {
    console.error('Error in createDiagnostic controller:', error);
    return res.status(500).json({
      success: false,
      error: 'Failed to process diagnostic analysis',
      message: error.message
    });
  }
}
