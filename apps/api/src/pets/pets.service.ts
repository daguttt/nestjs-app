import { HttpService } from '@nestjs/axios';
import { AxiosResponse } from 'axios';
import { Injectable, OnModuleInit } from '@nestjs/common';
import { Observable } from 'rxjs';
import { Pet } from './entities/pet.entity';
import { PetDto } from './dto/pet.dto';
import { PetCategories } from './entities/pet-categories.entity';
import fetch from 'node-fetch';

@Injectable()
export class PetsService implements OnModuleInit {
  private _pets: PetDto[];
  get pets() {
    return [...this._pets];
  }
  constructor(private readonly httpService: HttpService) {}
  onModuleInit() {
    Promise.allSettled([
      fetch('https://bsl1.herokuapp.com/pet').then((res) => res.json()),
      fetch('https://bsl1.herokuapp.com/pet/categories').then((res) =>
        res.json(),
      ),
    ]).then((responses) => {
      const castedResponses = responses.filter(
        (res) => res.status === 'fulfilled',
      ) as PromiseFulfilledResult<Pet[] | PetCategories>[];

      const pets = castedResponses[0].value as Pet[];
      const petCategories = castedResponses[1].value as PetCategories;

      this._pets = pets.map((pet) => {
        const { name: nameMatchedCategory } = petCategories.categories.find(
          (category) => pet.category === category.id,
        );
        return {
          ...pet,
          category: nameMatchedCategory,
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
