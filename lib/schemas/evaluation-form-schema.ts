import { z } from 'zod';

export const bloodTypeOptions = [
  'A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-', 'unknown',
] as const;

// Yes/No enum — no default, forces explicit selection
const yesNo = z.enum(['yes', 'no'], {
  required_error: 'required',
  invalid_type_error: 'required',
});

export const evaluationFormSchema = z.object({
  // Step 1 — Personal Data
  first_name: z.string().min(1, 'required'),
  last_name: z.string().min(1, 'required'),
  age: z.coerce.number().min(1, 'required').max(150),
  date_of_birth: z.string().min(1, 'required'),
  profession: z.string(),
  blood_type: z.enum(bloodTypeOptions),
  weight: z.coerce.number().min(1, 'required').max(500),
  height: z.coerce.number().min(1, 'required').max(300),

  // Step 2 — Communication
  speaks_romanian: yesNo,
  other_language: z.string(),
  visual_impairment: yesNo,
  hearing_impairment: yesNo,
  speech_impairment: yesNo,

  // Step 3 — Medical History
  // Neurological
  stroke: yesNo,
  seizures: yesNo,
  hemiparesis: yesNo,

  // Cardiovascular
  hypertension: yesNo,
  cardiopathy: yesNo,
  swollen_feet: yesNo,
  fatigue_stairs: yesNo,
  varicose_veins: yesNo,
  myocardial_infarction: yesNo,
  chest_pain: yesNo,
  irregular_heartbeat: yesNo,
  cardiac_pacemaker: yesNo,
  pacemaker_type: z.string(),
  valvulopathy: yesNo,

  // Pulmonary
  bronchitis: yesNo,
  respiratory_virus: yesNo,
  shortness_of_breath: yesNo,
  tuberculosis: yesNo,
  smoker: yesNo,
  cigarettes_per_day: z.coerce.number().max(100).optional(),

  // Hepatic / Gastric
  hepatitis: yesNo,
  gastric_ulcer: yesNo,
  diabetes: yesNo,

  // Hematological
  hemophilia: yesNo,
  recent_bleeding: yesNo,
  anemia: yesNo,
  hiv_infection: yesNo,

  // Other
  spinal_problems: yesNo,
  kidney_disease: yesNo,
  thyroid_disease: yesNo,
  myasthenia_gravis: yesNo,
  duchenne_disease: yesNo,
  rheumatic_diseases: yesNo,
  accidents_trauma: yesNo,
  psychiatric_conditions: yesNo,
  other_conditions: z.string(),

  // Step 4 — Additional Information
  cultural_restrictions: yesNo,
  recent_infectious_contact: yesNo,
  pregnancy: yesNo,
  pregnancy_weeks: z.coerce.number().optional(),
  medication_last_month: z.string(),
  previous_surgeries: yesNo,
}).superRefine((data, ctx) => {
  if (data.speaks_romanian === 'no' && (!data.other_language || data.other_language.trim() === '')) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: 'required',
      path: ['other_language'],
    });
  }

  if (data.cardiac_pacemaker === 'yes' && (!data.pacemaker_type || data.pacemaker_type.trim() === '')) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: 'required',
      path: ['pacemaker_type'],
    });
  }

  if (data.smoker === 'yes' && (data.cigarettes_per_day === undefined || data.cigarettes_per_day < 1)) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: 'required',
      path: ['cigarettes_per_day'],
    });
  }

  if (data.pregnancy === 'yes' && (data.pregnancy_weeks === undefined || data.pregnancy_weeks < 1)) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: 'required',
      path: ['pregnancy_weeks'],
    });
  }
});

export type EvaluationFormData = z.infer<typeof evaluationFormSchema>;

// All yes/no field keys for utility purposes
export const yesNoFields = [
  'speaks_romanian', 'visual_impairment', 'hearing_impairment', 'speech_impairment',
  'stroke', 'seizures', 'hemiparesis',
  'hypertension', 'cardiopathy', 'swollen_feet', 'fatigue_stairs', 'varicose_veins',
  'myocardial_infarction', 'chest_pain', 'irregular_heartbeat', 'cardiac_pacemaker', 'valvulopathy',
  'bronchitis', 'respiratory_virus', 'shortness_of_breath', 'tuberculosis', 'smoker',
  'hepatitis', 'gastric_ulcer', 'diabetes',
  'hemophilia', 'recent_bleeding', 'anemia', 'hiv_infection',
  'spinal_problems', 'kidney_disease', 'thyroid_disease', 'myasthenia_gravis',
  'duchenne_disease', 'rheumatic_diseases', 'accidents_trauma', 'psychiatric_conditions',
  'cultural_restrictions', 'recent_infectious_contact', 'pregnancy', 'previous_surgeries',
] as const;

// Fields per step for partial validation with trigger()
export const stepFields: Record<number, string[]> = {
  0: ['first_name', 'last_name', 'age', 'date_of_birth', 'profession', 'blood_type', 'weight', 'height'],
  1: ['speaks_romanian', 'other_language', 'visual_impairment', 'hearing_impairment', 'speech_impairment'],
  2: [
    'stroke', 'seizures', 'hemiparesis',
    'hypertension', 'cardiopathy', 'swollen_feet', 'fatigue_stairs', 'varicose_veins',
    'myocardial_infarction', 'chest_pain', 'irregular_heartbeat', 'cardiac_pacemaker',
    'pacemaker_type', 'valvulopathy',
    'bronchitis', 'respiratory_virus', 'shortness_of_breath', 'tuberculosis',
    'smoker', 'cigarettes_per_day',
    'hepatitis', 'gastric_ulcer', 'diabetes',
    'hemophilia', 'recent_bleeding', 'anemia', 'hiv_infection',
    'spinal_problems', 'kidney_disease', 'thyroid_disease', 'myasthenia_gravis',
    'duchenne_disease', 'rheumatic_diseases', 'accidents_trauma', 'psychiatric_conditions',
    'other_conditions',
  ],
  3: [
    'cultural_restrictions', 'recent_infectious_contact', 'pregnancy', 'pregnancy_weeks',
    'medication_last_month', 'previous_surgeries',
  ],
};

// Subsection groupings for Step 3 "None" shortcuts
export const medicalSubsections = {
  neurological: ['stroke', 'seizures', 'hemiparesis'],
  cardiovascular: [
    'hypertension', 'cardiopathy', 'swollen_feet', 'fatigue_stairs', 'varicose_veins',
    'myocardial_infarction', 'chest_pain', 'irregular_heartbeat', 'cardiac_pacemaker', 'valvulopathy',
  ],
  pulmonary: ['bronchitis', 'respiratory_virus', 'shortness_of_breath', 'tuberculosis', 'smoker'],
  hepaticGastric: ['hepatitis', 'gastric_ulcer', 'diabetes'],
  hematological: ['hemophilia', 'recent_bleeding', 'anemia', 'hiv_infection'],
  other: [
    'spinal_problems', 'kidney_disease', 'thyroid_disease', 'myasthenia_gravis',
    'duchenne_disease', 'rheumatic_diseases', 'accidents_trauma', 'psychiatric_conditions',
  ],
} as const;
