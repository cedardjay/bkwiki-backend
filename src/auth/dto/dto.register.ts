import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';

const RegisterSchema = z.object({
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  email: z.string().refine(
    (val) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val),
    { message: 'Must be a valid email' }
  ),
  password: z.string().min(8, 'Password must be at least 8 characters'),
});

export class RegisterDto extends createZodDto(RegisterSchema) { }