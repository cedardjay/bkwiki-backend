import { Injectable, NotFoundException, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Country } from './country.entity';
import { FileUploadService } from '../common/services/file-upload.service';

@Injectable()
export class CountryService {
    constructor(
        @InjectRepository(Country)
        private countryRepository: Repository<Country>,
        private fileUploadService: FileUploadService,
    ) { }

    async findAll(): Promise<Country[]> {
        return this.countryRepository.find();
    }

    async findOne(id: number): Promise<Country | null> {
        return this.countryRepository.findOne({ where: { id } });
    }

    async create(data: Partial<Country>): Promise<Country> {
        const country = this.countryRepository.create(data);
        return this.countryRepository.save(country);
    }

    /* async update(id: number, data: Partial<Country>): Promise<Country> {
       await this.countryRepository.update(id, data);
       return this.findOne(id);
     }
   */
    async remove(id: number): Promise<void> {
        await this.countryRepository.delete(id);
    }

    
    async uploadImage(id: number, file: Express.Multer.File): Promise<{ statusCode: number; message: string; data: { imagePath: string } }> {
        // Fail early - check if country exists
        const country = await this.countryRepository.findOne({ where: { id } });
        if (!country) {
            throw new NotFoundException(`Country with ID ${id} not found`);
        }

        const existingCountry = country;

        // Upload image using shared service
        const imagePath = await this.fileUploadService.uploadImage(file, 'countries');
        // Delete old image if exists
        if (existingCountry.image) {
            await this.fileUploadService.deleteImage(existingCountry.image);
        }

        // Update country with new image path
        try {
            existingCountry.image = imagePath;
            await this.countryRepository.save(existingCountry);

            return {
                statusCode: 200,
                message: 'Image uploaded successfully',
                data: { imagePath }
            };
        } catch (error) {
            // Rollback - delete the saved file if database update fails
            await this.fileUploadService.deleteImage(imagePath);
            throw new InternalServerErrorException('Failed to update country with image');
        }
    }









}