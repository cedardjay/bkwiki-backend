import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Country } from './country.entity';
import { CountryService } from './country.service';
import { CountryController } from './country.controller';
import { CommonModule } from '../common/common.module';

@Module({
  imports: [TypeOrmModule.forFeature([Country]), CommonModule],
  providers: [CountryService],
  controllers: [CountryController],
})
export class CountryModule {}