import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { InterfaceModule } from './interfaces/interface.module';
import { AuthModule } from './auth/auth.module';
import { AiModule } from './ai/ai.module';
import { ObjectsModule } from './objects/objects.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: ['.env.local', '.env'],
      isGlobal: true,
    }),
    InterfaceModule, 
    AuthModule,
    AiModule,
    ObjectsModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
