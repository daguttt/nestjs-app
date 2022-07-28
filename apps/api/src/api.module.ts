import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';

import apiConfig from '../config/api.config';
import swaggerConfig from '../config/swagger.config';

import { UserModule } from './user/user.module';
import { PetsModule } from './pets/pets.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [apiConfig, swaggerConfig],
    }),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '../../../apps/api', 'public'),
    }),
    UserModule,
    PetsModule,
  ],
  controllers: [],
  providers: [],
})
export class ApiModule {}
