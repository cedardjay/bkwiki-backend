import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';

const CreateCountrySchema = z.object({
  name: z.string().min(1, 'Country name is required'),
  suffix: z.string().min(1, 'Suffix is required'),
  countryCode: z.number().int().positive('Country code must be a positive number'),
  status: z.boolean().optional(),
});

export class CreateCountryDto extends createZodDto(CreateCountrySchema) {}