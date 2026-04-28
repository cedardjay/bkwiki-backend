// src/users/users.controller.ts
import { Controller, Patch, Param, UseInterceptors, UploadedFile } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
    constructor(private readonly usersService: UsersService) {}

    @Patch(':id/image')
    @UseInterceptors(FileInterceptor('image'))
    uploadImage(
        @Param('id') id: number,
        @UploadedFile() file: Express.Multer.File
    ) {
        return this.usersService.uploadImage(id, file);
    }
}