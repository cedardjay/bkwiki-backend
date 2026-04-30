import { Injectable, NotFoundException, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './users.entity';
import { UserDto } from './dto/dto.user';
import { FileUploadService } from '../common/services/file-upload.service';
import { ResponseDto } from '../common/response.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    private fileUploadService: FileUploadService,
  ) {}


  async findByEmail(email: string): Promise<User | null> {
    return this.usersRepository.findOne({ where: { email } });
  }

  async findById(id: number): Promise<User | null> {
    return this.usersRepository.findOne({ where: { id } });
  }

  async create(data: {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
  }): Promise<User> {
    const user = this.usersRepository.create(data);
    return this.usersRepository.save(user);
  }

async findAll(): Promise<ResponseDto<UserDto[]>> {
  const users = await this.usersRepository.find();
  return new ResponseDto(200, 'Users retrieved successfully', users.map(UserDto.fromEntity));
}
  
async findOne(id: number): Promise<ResponseDto<UserDto>> {
  const user = await this.usersRepository.findOne({ where: { id } });
  if (!user) throw new NotFoundException(`User with ID ${id} not found`);
  return new ResponseDto(200, 'User retrieved successfully', UserDto.fromEntity(user));
}


async update(id: number, data: Partial<User>): Promise<ResponseDto<UserDto>> {
  const user = await this.usersRepository.findOne({ where: { id } });
  if (!user) throw new NotFoundException(`User with ID ${id} not found`);
  Object.assign(user, data);
  const updated = await this.usersRepository.save(user);
  return new ResponseDto(200, 'User updated successfully', UserDto.fromEntity(updated));
}

async remove(id: number): Promise<ResponseDto<null>> {
  const user = await this.usersRepository.findOne({ where: { id } });
  if (!user) throw new NotFoundException(`User with ID ${id} not found`);
  await this.usersRepository.delete(id);
  return new ResponseDto(200, 'User deleted successfully');
}

  async uploadImage(id: number, file: Express.Multer.File): Promise<ResponseDto<{ imagePath: string }>> {
    const user = await this.usersRepository.findOne({ where: { id } });
    if (!user) throw new NotFoundException(`User with ID ${id} not found`);

    const imagePath = await this.fileUploadService.uploadImage(file, 'users');

    if (user.image) {
      await this.fileUploadService.deleteImage(user.image);
    }

    try {
      user.image = imagePath;
      await this.usersRepository.save(user);
      return new ResponseDto(200, 'Image uploaded successfully', { imagePath });
    } catch (error) {
      await this.fileUploadService.deleteImage(imagePath);
      throw new InternalServerErrorException('Failed to update user with image');
    }
  }
}