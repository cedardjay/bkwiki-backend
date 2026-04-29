import { Controller, Get, Post, Put, Delete, Patch, Param, Body, UploadedFile, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { UsersService } from './users.service';
import { User } from './users.entity';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

 // MODIFY THE USER SERVICE TO SEND DTO INSTEAD
 
 @Get('all')
  findAll() {
    return this.usersService.findAll();
  }


//find by id
  @Get(':id') 
  findOne(@Param('id') id: number) {
    return this.usersService.findOne(id);
  }


  @Put('update/:id')
  update(@Param('id') id: number, @Body() data: Partial<User>) {
    return this.usersService.update(id, data);
  }

  @Delete('delete/:id')
  remove(@Param('id') id: number) {
    return this.usersService.remove(id);
  }

  @Patch('image/:id')
  @UseInterceptors(FileInterceptor('image'))
  uploadImage(
    @Param('id') id: number,
    @UploadedFile() file: Express.Multer.File,
  ) {
    return this.usersService.uploadImage(id, file);
  }
}
