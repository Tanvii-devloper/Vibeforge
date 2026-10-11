import { z } from 'zod';

export const diagnosticRequestSchema = z.object({
  fieldId: z.union([z.string(), z.number()]).transform(val => parseInt(String(val), 10)),
  cropType: z.string().min(2, "Crop type is required"),
  growthStage: z.string().min(2, "Growth stage is required"),
  temperature: z.union([z.string(), z.number()]).transform(val => parseFloat(String(val))),
  relativeHumidity: z.union([z.string(), z.number()]).transform(val => parseFloat(String(val))),
  leafWetnessHours: z.union([z.string(), z.number()]).transform(val => parseFloat(String(val))),
  windSpeed: z.union([z.string(), z.number()]).optional().default(5.0).transform(val => parseFloat(String(val))),
  symptomDescription: z.string().optional().default(""),
  fieldLocation: z.string().optional().default("")
});

export const fieldCreateSchema = z.object({
  name: z.string().min(2, "Field name is required"),
  cropType: z.string().min(2, "Crop type is required"),
  location: z.string().min(2, "Location is required"),
  latitude: z.union([z.number(), z.string()]).optional().nullable().transform(val => (val !== undefined && val !== null && val !== '') ? parseFloat(String(val)) : null),
  longitude: z.union([z.number(), z.string()]).optional().nullable().transform(val => (val !== undefined && val !== null && val !== '') ? parseFloat(String(val)) : null)
});
