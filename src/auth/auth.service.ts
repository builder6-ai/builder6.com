import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { betterAuth } from 'better-auth';
import { mongodbAdapter } from 'better-auth/adapters/mongodb';
import { Db } from 'mongodb';

@Injectable()
export class AuthService implements OnModuleInit {
  public auth: ReturnType<typeof betterAuth>;

  constructor(@Inject('DATABASE_CONNECTION') private db: Db) {}

  onModuleInit() {
    this.auth = betterAuth({
      database: mongodbAdapter(this.db),
      emailAndPassword: {
        enabled: true,
      },
      // Add other providers here (e.g. Google, GitHub)
    });
  }
}
