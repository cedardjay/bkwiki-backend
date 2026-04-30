import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';

const UpdateCountrySchema = z.object({
  name: z.string().min(1, 'Country name is required').optional(),
  suffix: z.string().min(1, 'Suffix is required').optional(),
  countryCode: z.number().int().positive('Country code must be a positive number').optional(),
  status: z.boolean().optional(),
}).refine(data => Object.keys(data).length > 0, {
  message: 'At least one field must be provided',
});

export class UpdateCountryDto extends createZodDto(UpdateCountrySchema) {}