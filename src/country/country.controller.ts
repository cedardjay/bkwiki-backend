import { Controller, Patch, UseInterceptors, UploadedFile, Get, Post, Put, Delete, Body, Param } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { CountryService } from './country.service';
import { Country } from './country.entity';

@Controller('country')
export class CountryController {
    constructor(private countryService: CountryService) { }

    @Patch(':id/image')
    @UseInterceptors(FileInterceptor('image'))
    uploadImage(
        @Param('id') id: number,
        @UploadedFile() file: Express.Multer.File
    ) {
        return this.countryService.uploadImage(id, file);
    }












  /* 
   @Get()
    findAll() {
        return this.countryService.findAll();
    }

    @Get(':id')
    findOne(@Param('id') id: number) {
        return this.countryService.findOne(id);
    }

    @Post()
    create(@Body() data: Partial<Country>) {
        return this.countryService.create(data);
    }

    /* @Put(':id')
     update(@Param('id') id: string, @Body() data: Partial<Country>) {
       return this.countryService.update(id, data);
     }
   

    @Delete(':id')
    remove(@Param('id') id: number) {
        return this.countryService.remove(id);
    }
*/
   





}