import { Injectable, NotFoundException, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Country } from './country.entity';
import { FileUploadService } from '../common/services/file-upload.service';
import { ResponseDto } from '../common/response.dto';

@Injectable()
export class CountryService {
  constructor(
    @InjectRepository(Country)
    private countryRepository: Repository<Country>,
    private fileUploadService: FileUploadService,
  ) {}

  async findAll(): Promise<ResponseDto<Country[]>> {
    const countries = await this.countryRepository.find();
    return new ResponseDto(200, 'Countries retrieved successfully', countries);
  }

  async findOne(id: number): Promise<ResponseDto<Country>> {
    const country = await this.countryRepository.findOne({ where: { id } });
    if (!country) throw new NotFoundException(`Country with ID ${id} not found`);
    return new ResponseDto(200, 'Country retrieved successfully', country);
  }

  async create(data: Partial<Country>): Promise<ResponseDto<Country>> {
    const country = this.countryRepository.create(data);
    const saved = await this.countryRepository.save(country);
    return new ResponseDto(201, 'Country created successfully', saved);
  }

  async remove(id: number): Promise<ResponseDto<null>> {
    await this.countryRepository.delete(id);
    return new ResponseDto(200, 'Country deleted successfully');
  }

  async update(id: number, data: Partial<Country>): Promise<ResponseDto<Country>> {
  const country = await this.countryRepository.findOne({ where: { id } });
  if (!country) throw new NotFoundException(`Country with ID ${id} not found`);

  Object.assign(country, data);
  const updated = await this.countryRepository.save(country);
  return new ResponseDto(200, 'Country updated successfully', updated);
}

  async uploadImage(id: number, file: Express.Multer.File): Promise<ResponseDto<{ imagePath: string }>> {
    const country = await this.countryRepository.findOne({ where: { id } });
    if (!country) throw new NotFoundException(`Country with ID ${id} not found`);

    const imagePath = await this.fileUploadService.uploadImage(file, 'countries');

    if (country.image) {
      await this.fileUploadService.deleteImage(country.image);
    }

    try {
      country.image = imagePath;
      await this.countryRepository.save(country);
      return new ResponseDto(200, 'Image uploaded successfully', { imagePath });
    } catch (error) {
      await this.fileUploadService.deleteImage(imagePath);
      throw new InternalServerErrorException('Failed to update country with image');
    }
  }
}