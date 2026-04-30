import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';

const UpdateUserSchema = z.object({
    firstName: z.string().min(1, 'First name is required').optional(),
    lastName: z.string().min(1, 'Last name is required').optional(),
    email: z.string().refine(
        (val) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val),
        { message: 'Must be a valid email' }
    ),
    password: z.string().min(8, 'Password must be at least 8 characters').optional(),
    status: z.boolean().optional(),
}).refine(data => Object.keys(data).length > 0, {
    message: 'At least one field must be provided',
});

export class UpdateUserDto extends createZodDto(UpdateUserSchema) { }