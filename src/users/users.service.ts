import { Injectable, NotFoundException, BadRequestException, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './users.entity';
import { FileUploadService } from '../common/services/file-upload.service';
import { diskStorage } from 'multer';



@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    private fileUploadService: FileUploadService,
  ) { }

  async findByEmail(email: string): Promise<User | null> {
    return this.usersRepository.findOne({ where: { email } });
  }

  async findById(id: number): Promise<User | null> {
    return this.usersRepository.findOne({ where: { id } });
  }

  async create(data: {
    firstName: string; lastName: string; email: string; password: string;
  }): Promise<User> {
    const user = this.usersRepository.create(data);
    return this.usersRepository.save(user);
  }

  async uploadImage(id: number, file: Express.Multer.File): Promise<{ statusCode: number; message: string; data: { imagePath: string } }> {
    // Fail early - check if user exists
    const user = await this.usersRepository.findOne({ where: { id } });
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    const existingUser = user;

    // Upload image using shared service
    const imagePath = await this.fileUploadService.uploadImage(file, 'users');

    // Delete old image if exists
    if (existingUser.image) {
      await this.fileUploadService.deleteImage(existingUser.image);
    }

    // Update user with new image path
    try {
      existingUser.image = imagePath;
      await this.usersRepository.save(existingUser);

      return {
        statusCode: 200,
        message: 'Image uploaded successfully',
        data: { imagePath }
      };
    } catch (error) {
      // Rollback - delete the saved file if database update fails
      await this.fileUploadService.deleteImage(imagePath);
      throw new InternalServerErrorException('Failed to update user with image');
    }
  }







}