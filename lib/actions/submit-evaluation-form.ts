'use server';

/*
CREATE TABLE evaluation_forms (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT now() NOT NULL,

  -- Step 1: Personal Data
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  age INTEGER NOT NULL,
  date_of_birth DATE NOT NULL,
  profession TEXT,
  blood_type TEXT NOT NULL,
  weight NUMERIC NOT NULL,
  height NUMERIC NOT NULL,

  -- Step 2: Communication
  speaks_romanian BOOLEAN DEFAULT true NOT NULL,
  other_language TEXT,
  visual_impairment BOOLEAN DEFAULT false NOT NULL,
  hearing_impairment BOOLEAN DEFAULT false NOT NULL,
  speech_impairment BOOLEAN DEFAULT false NOT NULL,

  -- Step 3: Medical History — Neurological
  stroke BOOLEAN DEFAULT false NOT NULL,
  seizures BOOLEAN DEFAULT false NOT NULL,
  hemiparesis BOOLEAN DEFAULT false NOT NULL,

  -- Step 3: Medical History — Cardiovascular
  hypertension BOOLEAN DEFAULT false NOT NULL,
  cardiopathy BOOLEAN DEFAULT false NOT NULL,
  swollen_feet BOOLEAN DEFAULT false NOT NULL,
  fatigue_stairs BOOLEAN DEFAULT false NOT NULL,
  varicose_veins BOOLEAN DEFAULT false NOT NULL,
  myocardial_infarction BOOLEAN DEFAULT false NOT NULL,
  chest_pain BOOLEAN DEFAULT false NOT NULL,
  irregular_heartbeat BOOLEAN DEFAULT false NOT NULL,
  cardiac_pacemaker BOOLEAN DEFAULT false NOT NULL,
  pacemaker_type TEXT,
  valvulopathy BOOLEAN DEFAULT false NOT NULL,

  -- Step 3: Medical History — Pulmonary
  bronchitis BOOLEAN DEFAULT false NOT NULL,
  respiratory_virus BOOLEAN DEFAULT false NOT NULL,
  shortness_of_breath BOOLEAN DEFAULT false NOT NULL,
  tuberculosis BOOLEAN DEFAULT false NOT NULL,
  smoker BOOLEAN DEFAULT false NOT NULL,
  cigarettes_per_day INTEGER,

  -- Step 3: Medical History — Hepatic / Gastric
  hepatitis BOOLEAN DEFAULT false NOT NULL,
  gastric_ulcer BOOLEAN DEFAULT false NOT NULL,
  diabetes BOOLEAN DEFAULT false NOT NULL,

  -- Step 3: Medical History — Hematological
  hemophilia BOOLEAN DEFAULT false NOT NULL,
  recent_bleeding BOOLEAN DEFAULT false NOT NULL,
  anemia BOOLEAN DEFAULT false NOT NULL,
  hiv_infection BOOLEAN DEFAULT false NOT NULL,

  -- Step 3: Medical History — Other
  spinal_problems BOOLEAN DEFAULT false NOT NULL,
  kidney_disease BOOLEAN DEFAULT false NOT NULL,
  thyroid_disease BOOLEAN DEFAULT false NOT NULL,
  myasthenia_gravis BOOLEAN DEFAULT false NOT NULL,
  duchenne_disease BOOLEAN DEFAULT false NOT NULL,
  rheumatic_diseases BOOLEAN DEFAULT false NOT NULL,
  accidents_trauma BOOLEAN DEFAULT false NOT NULL,
  psychiatric_conditions BOOLEAN DEFAULT false NOT NULL,
  other_conditions TEXT,

  -- Step 4: Additional Information
  cultural_restrictions BOOLEAN DEFAULT false NOT NULL,
  recent_infectious_contact BOOLEAN DEFAULT false NOT NULL,
  pregnancy BOOLEAN DEFAULT false NOT NULL,
  pregnancy_weeks INTEGER,
  medication_last_month TEXT,
  previous_surgeries BOOLEAN DEFAULT false NOT NULL
);

-- Enable RLS
ALTER TABLE evaluation_forms ENABLE ROW LEVEL SECURITY;

-- Users can only read/write their own evaluation
CREATE POLICY "Users can view own evaluation"
  ON evaluation_forms FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own evaluation"
  ON evaluation_forms FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own evaluation"
  ON evaluation_forms FOR UPDATE
  USING (auth.uid() = user_id);
*/

import { createClient } from '@/lib/supabase/server';
import type { EvaluationFormData } from '@/lib/schemas/evaluation-form-schema';
import { yesNoFields } from '@/lib/schemas/evaluation-form-schema';

function toBool(val: 'yes' | 'no'): boolean {
  return val === 'yes';
}

export async function submitEvaluationForm(data: EvaluationFormData) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { success: false, error: 'Not authenticated' };
  }

  // Convert yes/no fields to booleans for DB storage
  const dbData: Record<string, unknown> = {
    user_id: user.id,
    first_name: data.first_name,
    last_name: data.last_name,
    age: data.age,
    date_of_birth: data.date_of_birth,
    profession: data.profession || null,
    blood_type: data.blood_type,
    weight: data.weight,
    height: data.height,
    other_language: data.speaks_romanian === 'no' ? data.other_language : null,
    pacemaker_type: data.cardiac_pacemaker === 'yes' ? data.pacemaker_type : null,
    cigarettes_per_day: data.smoker === 'yes' ? data.cigarettes_per_day : null,
    pregnancy_weeks: data.pregnancy === 'yes' ? data.pregnancy_weeks : null,
    medication_last_month: data.medication_last_month || null,
    other_conditions: data.other_conditions || null,
  };

  for (const field of yesNoFields) {
    dbData[field] = toBool(data[field]);
  }

  const { error } = await supabase.from('evaluation_forms').upsert(dbData);

  if (error) {
    return { success: false, error: error.message };
  }

  return { success: true };
}

export async function getEvaluation() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return null;
  }

  const { data } = await supabase
    .from('evaluation_forms')
    .select('*')
    .eq('user_id', user.id)
    .single();

  return data;
}
