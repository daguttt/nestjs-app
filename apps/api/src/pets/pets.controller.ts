import { Get } from '@nestjs/common';
import { Controller } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { PetsService } from './pets.service';

@Controller('pets')
@ApiTags('pets')
export class PetsController {
  constructor(private readonly petsService: PetsService) {}
  @Get()
  findAll() {
    return this.petsService.pets;
  }
}
