import { z } from 'zod';

export const ROMANIAN_PHONE_REGEX = /^07\d{8}$/;

export const romanianPhoneSchema = z
  .string()
  .min(1, 'required')
  .regex(ROMANIAN_PHONE_REGEX, 'invalidPhone');
