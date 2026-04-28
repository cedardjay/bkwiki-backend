// src/common/services/file-upload.service.ts
import { Injectable, BadRequestException, InternalServerErrorException } from '@nestjs/common';
import { extname } from 'path';
import * as fs from 'fs';

@Injectable()
export class FileUploadService {
    async uploadImage(
        file: Express.Multer.File,
        targetFolder: string // 'users' or 'countries'
    ): Promise<string> {
        
        // Fail early - check if file was uploaded
        if (!file) {
            throw new BadRequestException('No image file provided');
        }

        // Fail early - check file type
        const allowedTypes = /jpeg|jpg|png|gif/;
        const ext = extname(file.originalname).toLowerCase();
        if (!allowedTypes.test(ext)) {
            throw new BadRequestException('Only image files (jpeg, jpg, png, gif) are allowed');
        }

        // Fail early - check file size (5MB limit)
        const maxSize = 5 * 1024 * 1024;
        if (file.size > maxSize) {
            throw new BadRequestException(`File size exceeds ${maxSize / 1024 / 1024}MB limit`);
        }

        // Create uploads directory if it doesn't exist
        const uploadDir = `./uploads/${targetFolder}`;
        if (!fs.existsSync(uploadDir)) {
            try {
                fs.mkdirSync(uploadDir, { recursive: true });
            } catch (error) {
                throw new InternalServerErrorException('Failed to create upload directory');
            }
        }

        // Generate unique filename
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
        const filename = `${uniqueSuffix}${ext}`;
        const filePath = `${uploadDir}/${filename}`;

        // Save file to disk
        try {
            fs.writeFileSync(filePath, file.buffer);
        } catch (error) {
            throw new InternalServerErrorException('Failed to save image file');
        }

        return `uploads/${targetFolder}/${filename}`;
    }

    async deleteImage(imagePath: string): Promise<void> {
        if (!imagePath) return;
        
        try {
            if (fs.existsSync(imagePath)) {
                fs.unlinkSync(imagePath);
            }
        } catch (error) {
            console.error('Failed to delete image:', error);
        }
    }
}