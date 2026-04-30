import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';

const LoginSchema = z.object({
  email: z.string().refine(
    (val) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val),
    { message: 'Must be a valid email' }
  ),
   password: z.string().min(1, 'Password is required'),
});

export class LoginDto extends createZodDto(LoginSchema) { }