import { HttpService } from '@nestjs/axios';
import { AxiosResponse } from 'axios';
import { Injectable, OnModuleInit } from '@nestjs/common';
import { forkJoin, Observable } from 'rxjs';
import { Pet } from './entities/pet.entity';
import { PetDto } from './dto/pet.dto';
import { PetCategories } from './entities/pet-categories.entity';

@Injectable()
export class PetsService implements OnModuleInit {
  private _pets: PetDto[];
  get pets() {
    return [...this._pets];
  }
  constructor(private readonly httpService: HttpService) {}
  onModuleInit() {
    forkJoin([this.fetchPets(), this.fetchPetCategories()]).subscribe((res) => {
      const pets = res[0].data;
      const petCategories = res[1].data.categories;
      this._pets = pets.map((pet) => {
        const matchedCategory = petCategories.find(
          (category) => pet.category === category.id,
        )?.name;
        return {
          ...pet,
          category: matchedCategory,
        };
      });
    });
  }

  fetchPets(): Observable<AxiosResponse<Pet[]>> {
    return this.httpService.get('https://bsl1.herokuapp.com/pet');
  }
  fetchPetCategories(): Observable<AxiosResponse<PetCategories>> {
    return this.httpService.get('https://bsl1.herokuapp.com/pet/categories');
  }
}
